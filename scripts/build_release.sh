#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
DIST_DIR="$ROOT_DIR/dist"

usage() {
    echo "Usage: $0 [--check] <version-or-tag>"
    echo ""
    echo "Options:"
    echo "  --check   Validate only; do not produce a .mcpack archive."
    echo "             Exits 0 if all checks pass."
    echo ""
    echo "Examples:"
    echo "  $0 v1.0.0          Build and package v1.0.0"
    echo "  $0 --check v1.0.0  Validate v1.0.0 without packaging"
}

CHECK_ONLY=0

# Parse flags
if [[ $# -ge 1 && "$1" == "--check" ]]; then
    CHECK_ONLY=1
    shift
fi

[[ $# -eq 1 ]] || { usage >&2; exit 2; }

TAG="$1"
VERSION="${TAG#v}"

# SemVer 2.0.0 validation. Supports normal, pre-release, and build metadata versions.
SEMVER_REGEX='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$'
if [[ ! "$VERSION" =~ $SEMVER_REGEX ]]; then
    echo "error: invalid SemVer tag: $TAG" >&2
    exit 1
fi

command -v jq >/dev/null 2>&1 || { echo "error: jq is required" >&2; exit 1; }

if [[ $CHECK_ONLY -eq 0 ]]; then
    command -v zip >/dev/null 2>&1 || { echo "error: zip is required" >&2; exit 1; }
    command -v unzip >/dev/null 2>&1 || { echo "error: unzip is required" >&2; exit 1; }
fi

[[ -d "$SRC_DIR" ]] || { echo "error: missing src/: $SRC_DIR" >&2; exit 1; }
[[ -f "$SRC_DIR/manifest.json" ]] || { echo "error: missing src/manifest.json" >&2; exit 1; }
[[ -f "$ROOT_DIR/CHANGELOG.md" ]] || { echo "error: missing CHANGELOG.md" >&2; exit 1; }

MANIFEST_VERSION="$(jq -er '.header.version | if type == "array" then join(".") else tostring end' "$SRC_DIR/manifest.json")"
if [[ "$MANIFEST_VERSION" != "$VERSION" ]]; then
    echo "error: src/manifest.json header.version is $MANIFEST_VERSION, expected $VERSION" >&2
    exit 1
fi

# --- Check mode: validate JSON and changelog, then exit ---

if [[ $CHECK_ONLY -eq 1 ]]; then
    echo "Check mode: validating without packaging."
    fail=0

    # Validate all JSON files
    while IFS= read -r -d '' json_file; do
        if ! jq empty "$json_file" 2>/dev/null; then
            echo "error: invalid JSON: $json_file" >&2
            fail=1
        fi
    done < <(find "$SRC_DIR" -type f -name '*.json' -print0)

    # Validate changelog has an entry for this version
    if ! awk -v version="$VERSION" '
        BEGIN { found=0; heading="## [" version "]" }
        $0 == heading || index($0, heading " - ") == 1 { found=1 }
        END { exit (found ? 0 : 1) }
    ' "$ROOT_DIR/CHANGELOG.md"; then
        echo "error: CHANGELOG.md has no entry for [$VERSION]" >&2
        fail=1
    fi

    if [[ $fail -eq 0 ]]; then
        echo "All checks passed for v$VERSION."
    fi
    exit $fail
fi

# --- Full build mode ---

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
BUILD_DIR="$(mktemp -d)"
trap 'rm -rf "$BUILD_DIR"' EXIT

cp -a "$SRC_DIR/." "$BUILD_DIR/"

# Keep Déesse's visible extension-pack version aligned with the release tag.
EXTENSION_JSON="$BUILD_DIR/ui/déesse_ui/déesse_screen/extension_packs.json"
if [[ -f "$EXTENSION_JSON" ]]; then
    tmp_file="${EXTENSION_JSON}.tmp"
    jq --arg version "$VERSION" '(.extension_packs_list.modifications[]?.value[]?)["$pack_version"] = $version' "$EXTENSION_JSON" > "$tmp_file"
    mv -- "$tmp_file" "$EXTENSION_JSON"
fi

# Minify every JSON file in the pack while validating that each file is valid JSON.
while IFS= read -r -d '' json_file; do
    tmp_file="${json_file}.tmp"
    jq -c . "$json_file" > "$tmp_file"
    mv -- "$tmp_file" "$json_file"
done < <(find "$BUILD_DIR" -type f -name '*.json' -print0)

OUTPUT="$DIST_DIR/ReplayLinkerRP-${TAG}.mcpack"
(
    cd "$BUILD_DIR"
    zip -9 -X -q -r "$OUTPUT" .
)

# Verify the produced archive before publishing it.
unzip -tqq "$OUTPUT"

# Pull the matching Keep a Changelog section for the GitHub Release body.
NOTES="$DIST_DIR/RELEASE_NOTES.md"
awk -v version="$VERSION" '
    BEGIN { in_section=0; found=0; heading="## [" version "]" }
    $0 == heading || index($0, heading " - ") == 1 {
        in_section=1
        found=1
    }
    in_section {
        if ($0 ~ /^\[[^]]+\]: /) next
        if ($0 ~ /^## \[/ && $0 != heading && index($0, heading " - ") != 1) exit
        print
    }
    END {
        if (!found) exit 3
    }
' "$ROOT_DIR/CHANGELOG.md" > "$NOTES" || {
    status=$?
    if [[ $status -eq 3 ]]; then
        echo "error: CHANGELOG.md has no entry for [$VERSION]" >&2
    fi
    exit "$status"
}

if [[ ! -s "$NOTES" ]]; then
    echo "error: generated release notes are empty" >&2
    exit 1
fi

printf 'Built: %s\n' "$OUTPUT"
printf 'Size: %s bytes\n' "$(wc -c < "$OUTPUT")"
printf 'Release notes: %s\n' "$NOTES"

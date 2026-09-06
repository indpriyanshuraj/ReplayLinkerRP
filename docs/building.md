# Building ReplayLinkerRP

ReplayLinkerRP uses a small shell-based build system. Python is not required.

## Requirements

Install:

- Bash
- `jq`
- `zip`
- `unzip`

## Local release build

```bash
./scripts/build_release.sh v1.0.0
```

The version can also contain a valid SemVer pre-release or build-metadata suffix.
The script rejects invalid SemVer values and verifies that `src/manifest.json`
contains the same version.

## What the builder does

1. Copies `src/` to a temporary directory.
2. Finds every `.json` file.
3. Validates and minifies each JSON file with `jq -c`.
4. Creates `ReplayLinkerRP-<tag>.mcpack` with `zip -9 -X`.
5. Tests the archive with `unzip -tqq`.
6. Extracts the matching version section from `CHANGELOG.md` into release notes.

Generated files are written to `dist/` and should not be committed.

## GitHub release

Create and push a SemVer tag:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

The GitHub Action then builds and publishes the `.mcpack` as a GitHub Release
asset.

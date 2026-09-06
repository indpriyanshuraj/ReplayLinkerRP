# Troubleshooting

Common problems and how to resolve them. If your issue is not listed here,
[open a bug report](https://github.com/indpriyanshuraj/ReplayLinkerRP/issues/new).

## The Replay button does not appear

1. **Déesse is not installed or not activated.** Ensure Déesse is installed and
   active as a resource pack.
2. **ReplayLinkerRP is not in the pack stack.** Add it as a resource pack,
   below Déesse in the stack order.
3. **Déesse version mismatch.** If Déesse has changed its UI identifiers, the
   injection point may no longer exist. Check the
   [Compatibility Matrix](compatibility.md).
4. **Minecraft version mismatch.** The manifest declares
   `min_engine_version: 1.21.100`. If your Minecraft is older, update or use a
   compatible ReplayLinkerRP release.
5. **The pack did not import correctly.** Re-import the `.mcpack`. On mobile,
   make sure it opens with Minecraft, not a generic archive app.

## The button appears but does nothing

1. **No native replay mod is installed.** You need BedrockReplay (via
   LeviLaunchroid) or Playback (via LeviLamina). Install the appropriate mod
   first.
2. **The native mod is not running.** Make sure you launched Minecraft through
   LeviLaunchroid or the LeviLamina environment — not vanilla Minecraft.
3. **The native mod version is incompatible.** The mod may have changed its
   registered action name. Check the mod's release notes and the
   [Compatibility Matrix](compatibility.md).
4. **The action identifier has changed.** ReplayLinkerRP maps
   `button.menu_select` and `button.menu_ok` to `button.replay_open_library`.
   If the native mod registers a different action name, a ReplayLinkerRP update
   is needed.

## The game crashes or shows a content error

1. **Corrupted download.** Re-download from
   [GitHub Releases](https://github.com/indpriyanshuraj/ReplayLinkerRP/releases).
2. **Conflicting resource packs.** Other UI-modifying packs may conflict. Try
   disabling them one by one to isolate the issue.
3. **Stale cached pack.** Remove ReplayLinkerRP from the pack list, re-import
   the latest `.mcpack`, and re-enable it.

## Extension-pack screen shows wrong version

This is cosmetic and set at build time. The build script syncs `$pack_version`
in `extension_packs.json` with the release tag. When building locally, pass the
correct version:

```bash
./scripts/build_release.sh v1.0.0
```

## Build script fails

See [Building & Release Process](building.md). Common failures:

- **`invalid SemVer tag`** — version does not match `MAJOR.MINOR.PATCH` format.
- **`manifest version mismatch`** — `src/manifest.json` header.version does not
  match the tag. Update the manifest before building.
- **`jq is required`** — install `jq` on your system.
- **`CHANGELOG.md has no entry for [x.y.z]`** — add a section to `CHANGELOG.md`
  for the version you are building.

## Still stuck?

Check [existing issues](https://github.com/indpriyanshuraj/ReplayLinkerRP/issues)
for similar reports, or open a bug report with your Minecraft, Déesse, loader,
and replay mod versions. For security issues, follow
[SECURITY.md](../SECURITY.md) — do not post them publicly.

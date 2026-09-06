# Architecture

ReplayLinkerRP is a **resource-pack-level integration layer** for the Déesse
UI. It does not implement recording, replay playback, storage, networking, or
native code.

## High-level flow

```text
Déesse UI
   │
   ├── loads ReplayLinkerRP resource-pack definitions
   │
   ├── start.json
   │     └── defines replay_button
   │           ├── supplies replay icon content
   │           ├── maps menu-select/menu-ok to replay action
   │           └── targets Déesse's existing replay entry point
   │
   ├── extension_packs.json
   │     └── integrates the extension into Déesse's extension-pack UI
   │
   └── _global_variables.json
         └── marks the pack as a Déesse UI extension

Native replay implementation
   ├── BedrockReplay by light
   │     └── LeviLaunchroid environment
   │
   └── Playback by wo55555
         └── LeviLamina-based native client environment
```

## Source layout

### `src/manifest.json`

Defines the resource pack identity, version, minimum Minecraft engine version,
author metadata, and project URL. The release script requires the manifest
version to match the Git tag being built.

### `src/ui/déesse_ui/start.json`

This is the primary integration point. It defines a `replay_button` based on
Déesse's button controls, supplies the Replay Linker icon, maps the normal
selection/OK actions to `button.replay_open_library`, and places the button in
the relevant Déesse button panel.

The extension therefore depends on UI identifiers supplied by the Déesse pack.
If Déesse changes those identifiers, this extension may need to be updated.

### `src/ui/déesse_ui/déesse_screen/extension_packs.json`

Adds the extension's UI contribution to Déesse's extension-pack screen/layout.

### `src/ui/_global_variables.json`

Sets the extension marker used by Déesse UI integration.

### `src/textures/déesse_ui/extension_packs_icon/replay_linker.png`

The small Replay Linker icon displayed by the injected UI control.

## Why this pack needs a native mod

The resource pack only describes UI. It cannot provide the native functionality
behind the replay action. The actual replay implementation must be provided by
a supported native mod and execution environment.

For that reason:

- ReplayLinkerRP alone is not a replay mod.
- Removing the required native replay mod can make the button non-functional.
- Changes to the native mod's registered action/handler can require a matching
  ReplayLinkerRP release.

## Integration boundary

ReplayLinkerRP owns:

- Déesse UI definitions;
- the Replay button presentation;
- the icon and related UI resources; and
- compatibility documentation/release packaging.

ReplayLinkerRP does **not** own:

- replay capture or recording;
- replay file formats;
- replay playback engines;
- LeviLaunchroid internals;
- LeviLamina internals; or
- the native implementation of the replay action.

## Build architecture

The repository keeps the pack source in `src/`. The shell release builder makes
a temporary copy, validates and minifies every JSON file with `jq`, then creates
a `.mcpack` using maximum DEFLATE compression with `zip -9` and verifies the
archive with `unzip -t`.

GitHub Actions runs the same builder for SemVer tags and uses the corresponding
`CHANGELOG.md` section as the GitHub Release notes.

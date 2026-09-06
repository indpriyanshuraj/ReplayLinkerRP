# UI Reference

Annotated breakdown of every JSON file in the pack. For the high-level flow,
see [Architecture](architecture.md).

## File tree

```text
src/
├── manifest.json
├── pack_icon.png
├── textures/
│   └── deesse_ui/extension_packs_icon/
│       └── replay_linker.png          ← 16×16 button icon
└── ui/
    ├── _global_variables.json         ← extension marker
    └── deesse_ui/
        ├── start.json                  ← primary integration point
        └── deesse_screen/
            └── extension_packs.json    ← extension-pack registration
```

Folder names use accents (`déesse_ui`) to match Déesse's own directory
structure. The texture path in `start.json` uses the accented form.

## `src/manifest.json`

Pack manifest — identity, version, metadata.

| Field | Value | Purpose |
| --- | --- | --- |
| `format_version` | `3` | Bedrock pack format version 3 |
| `header.name` | `§l§bReplay Linker` | In-game name with formatting codes |
| `header.uuid` | `aa578861-...` | Unique pack identifier |
| `header.version` | `1.0.0` | Must match the Git release tag |
| `header.min_engine_version` | `1.21.100` | Minimum Minecraft Bedrock version |
| `header.pack_scope` | `any` | Global, not per-world |
| `modules[0].type` | `resources` | Resource pack module |
| `metadata.authors` | `["indpriyanshuraj"]` | Author credit |
| `metadata.license` | `Apache-2.0` | SPDX license identifier |
| `metadata.url` | GitHub repo URL | Project homepage |

`header.version` is validated by `build_release.sh` — it must exactly match the
SemVer tag passed to the builder.

## `src/ui/_global_variables.json`

```json
{"$is_déesse_ui_extension": true}
```

Marks this pack as a Déesse UI extension. Déesse checks this variable when
loading resource packs — if `true`, it processes the UI definitions under the
`deesse_ui/` namespace. Without it, the UI files are ignored.

## `src/ui/déesse_ui/start.json`

The primary integration file. Defines the Replay button, its icon, and where
it sits in the Déesse start screen.

### `replay_button@déesse_buttons.light_content`

Inherits from Déesse's `light_content` button template (`@` = extend/inherit).

| Property | Value | Meaning |
| --- | --- | --- |
| `$button_content` | `déesse_start.replay_icon_content` | Icon definition (below) |
| `$pressed_button_name` | `button.replay_open_library` | Action fired on press |
| `$focus_id` | `déesse_replay_button` | Focus ID for controller/keyboard nav |
| `button_mappings` | (array) | Input → replay action mappings |

**Button mappings** (both `mapping_type: "pressed"`):

| `from_button_id` | `to_button_id` | Meaning |
| --- | --- | --- |
| `button.menu_select` | `button.replay_open_library` | Click / tap / A-button |
| `button.menu_ok` | `button.replay_open_library` | Enter / OK |

`button.replay_open_library` is the **contract with the native replay mod**. If
the mod changes this action name, this file must be updated.

### `replay_icon_content`

The 16×16 image inside the button.

| Property | Value |
| --- | --- |
| `type` | `image` |
| `texture` | `textures/déesse_ui/extension_packs_icon/replay_linker` |
| `size` | `[16, 16]` |
| `anchor_from` / `anchor_to` | `center` |

### `main_button_panel/realms`

```json
"main_button_panel/realms": {
    "$left_button_control": "déesse_start.replay_button"
}
```

Sets the `$left_button_control` variable in Déesse's main button panel to our
`replay_button`. The Replay button appears as the left button in the
realms/main panel of the Déesse start screen.

## `src/ui/déesse_ui/déesse_screen/extension_packs.json`

Registers ReplayLinkerRP in Déesse's extension-pack listing screen. Uses
Déesse's modification system to insert a new entry at the front of the
extension-pack `controls` array.

| Property | Value | Meaning |
| --- | --- | --- |
| Control name | `replay_compatibility@déesse_ui_extensionPacks.extension_pack_item` | Inherits Déesse's extension-pack item template |
| `$pack_name_underscore` | `replay_linker` | Machine-readable name |
| `$pack_name` | `Replay Linker` | Display name |
| `$pack_version` | `1.0.0` | Synced to release tag at build time |
| `$creator` | `Priyanshu Raj` | Display creator |

The build script updates `$pack_version` to match the release tag. The
committed source keeps `1.0.0` as a placeholder — it is overwritten in the
build output.

## Icons

**`replay_linker.png`** (16×16) — blue circular replay arrow around a green
play/spark on a black background with a red border. Displayed inside the
Replay button.

**`pack_icon.png`** (256×256) — same motif at higher resolution, used as the
pack icon in Minecraft's resource pack list.

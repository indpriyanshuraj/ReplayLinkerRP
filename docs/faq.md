# FAQ

Common questions about ReplayLinkerRP. For problems, see
[Troubleshooting](troubleshooting.md).

## Is ReplayLinkerRP a replay mod?

No. It is a resource-pack extension that adds a Replay button to the Déesse UI.
The actual replay functionality (recording, playback, camera, timeline) is
provided by a separate native mod — BedrockReplay or Playback. ReplayLinkerRP
only bridges the UI to that mod.

## Will it work without a native replay mod?

No. Without a compatible native replay mod and its runtime, the Replay button
may appear but do nothing, or it may not appear at all.

## Do I need Déesse UI installed?

Yes. ReplayLinkerRP is an extension for Déesse UI. It depends on Déesse's UI
identifiers, button controls, and extension-pack system. Without Déesse, the
pack has nothing to attach to.

## Can I use it with a non-Déesse UI pack?

No. The UI definitions reference Déesse-specific control names
(`déesse_buttons.light_content`, `déesse_start`, `main_button_panel/realms`).
These do not exist in vanilla Minecraft or other UI packs.

## Which Minecraft Bedrock versions are supported?

The manifest declares `min_engine_version: 1.21.100`, but actual compatibility
also depends on the native replay mod, Déesse, LeviLaunchroid, and LeviLamina.
See the [Compatibility Matrix](compatibility.md) for the current baseline.

## Does it work on iOS or console?

No. The supported native replay mods require LeviLaunchroid or LeviLamina,
which are not available on iOS/iPadOS or game consoles.

## Does it work on both Android and Windows?

Yes. Android supports LeviLaunchroid + BedrockReplay or Playback. Windows
supports LeviLaunchroid/LeviLamina + Playback. The resource pack itself is
platform-agnostic — the limitation is the native runtime.

## Will it break when Minecraft or Déesse updates?

It can. If Déesse changes its UI identifiers or the native replay mod changes
its registered action name, the integration may stop working. Check the
[Compatibility Matrix](compatibility.md) and
[CHANGELOG.md](../CHANGELOG.md) for the latest tested versions.

## Where does it sit in the pack stack?

As a resource pack, placed **below** Déesse. Déesse provides the base UI;
ReplayLinkerRP injects into it.

## Do I need to enable experimental toggles?

No. The pack uses the standard resource-pack format (format version 3) and
does not require any experimental gameplay toggles.

## Can I install both BedrockReplay and Playback at the same time?

That depends on the native mods, not on ReplayLinkerRP. Both register the same
UI action (`button.replay_open_library`), so if both are active, behavior
depends on which mod handles the action. Consult the respective mod
documentation.

## Is Python required to build?

No. The build system is entirely shell-based (`bash` + `jq` + `zip` +
`unzip`). See [Building & Release Process](building.md).

## Can I contribute without knowing Minecraft JSON UI?

Yes. Documentation, testing, and compatibility reports are all valuable. Look
for issues labelled
[`good first issue`](https://github.com/indpriyanshuraj/ReplayLinkerRP/labels/good%20first%20issue).

## How do I report a compatibility result?

Use the Compatibility Report issue template on
[GitHub Issues](https://github.com/indpriyanshuraj/ReplayLinkerRP/issues/new).
Include the Minecraft, Déesse, loader, and replay mod versions you tested with.

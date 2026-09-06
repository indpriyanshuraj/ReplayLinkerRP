# ReplayLinkerRP

[![GitHub Release](https://img.shields.io/github/v/release/indpriyanshuraj/ReplayLinkerRP?display_name=tag&style=flat-square)](https://github.com/indpriyanshuraj/ReplayLinkerRP/releases)
[![License](https://img.shields.io/github/license/indpriyanshuraj/ReplayLinkerRP?style=flat-square)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/indpriyanshuraj/ReplayLinkerRP/ci.yml?branch=main&label=CI&style=flat-square)](https://github.com/indpriyanshuraj/ReplayLinkerRP/actions/workflows/ci.yml)

**ReplayLinkerRP** is a lightweight Minecraft Bedrock resource-pack extension
for the **Déesse UI**. It adds a Replay button so Déesse can expose compatible
native replay implementations without bundling replay functionality into the
resource pack.

> [!WARNING]
> **ReplayLinkerRP is not a replay mod.** It only provides the Déesse UI
> integration. It will not work by itself without a supported native replay
> implementation.

## Native replay implementations

ReplayLinkerRP bridges Déesse with these native projects:

| Project | Author | Environment | Link |
| --- | --- | --- | --- |
| **BedrockReplay** | light | LeviLaunchroid | [Discord](https://discord.gg/BbM6xZNKfq) |
| **Playback** | wo55555 | LeviLamina-based native client mod | [GitHub](https://github.com/wo55555/Playback) |

These projects are separate from ReplayLinkerRP and retain their own licenses,
authorship, requirements, and release schedules.

## Requirements ⚠️

You need **Déesse** plus the appropriate native replay environment:

- For **BedrockReplay**, use a supported **LeviLaunchroid** setup.
- For **Playback**, use a supported **LeviLamina** environment through your
  compatible LeviLaunchroid/LeviLamina setup.

The exact versions of Minecraft, Déesse, LeviLaunchroid, LeviLamina, and the
native replay mod must be compatible with each other. See the
[compatibility documentation](docs/compatibility.md).

> [!CAUTION]
> A resource pack cannot replace a native mod. Installing only ReplayLinkerRP
> does not add recording or replay functionality. If the required native mod
> or loader/runtime is missing, the Replay button may do nothing or the
> integration may fail.

### Platform notes

| Platform | Replay support |
| --- | --- |
| Android | Supported via LeviLaunchroid + BedrockReplay or Playback |
| Windows | Supported via LeviLaunchroid/LeviLamina + Playback |
| iOS / iPadOS | Not supported (no LeviLaunchroid/LeviLamina runtime) |
| Console (Xbox, PlayStation, Switch) | Not supported |

## What it does

ReplayLinkerRP keeps the integration deliberately small:

- adds a Replay entry/button to the compatible Déesse UI;
- supplies the Replay Linker icon and related UI definitions;
- connects the UI to the replay action exposed by the supported environment;
- keeps the actual replay implementation outside the resource pack.

For implementation details, see [Architecture](docs/architecture.md) and the
[UI Reference](docs/ui-reference.md).

## Installation

1. Install the compatible **Déesse UI** pack.
2. Install and configure the appropriate native replay mod:
   - **BedrockReplay** — follow the LeviLaunchroid setup instructions.
   - **Playback** — follow the LeviLamina + Playback installation guide.
3. Download the latest ReplayLinkerRP `.mcpack` from
   [GitHub Releases](https://github.com/indpriyanshuraj/ReplayLinkerRP/releases).
4. Import the `.mcpack` into Minecraft (double-click on desktop, or open with
   Minecraft on mobile).
5. Activate ReplayLinkerRP as a **resource pack**. It should sit **below**
   Déesse in the pack stack.
6. Launch Minecraft through the required supported environment.
7. Verify that the **Replay** entry appears in the Déesse start screen.

Do not install ReplayLinkerRP expecting it to provide replay functionality on
its own.

If something does not work, see [Troubleshooting](docs/troubleshooting.md) and
[FAQ](docs/faq.md).

## Downloads

- **GitHub:** [ReplayLinkerRP](https://github.com/indpriyanshuraj/ReplayLinkerRP)
- **GitHub Releases:** [Download releases](https://github.com/indpriyanshuraj/ReplayLinkerRP/releases)
- **CurseForge:** will be linked here once published.
- **MCPEDL:** will be linked here once published.

## Documentation

- [Architecture & how it works](docs/architecture.md)
- [UI Reference](docs/ui-reference.md)
- [Compatibility & version tracking](docs/compatibility.md)
- [Building & release process](docs/building.md)
- [Development setup](docs/development-setup.md)
- [FAQ](docs/faq.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Changelog](CHANGELOG.md)

## Development

The editable pack lives under [`src/`](src/). The release pipeline is
shell-based — no Python required.

```bash
./scripts/build_release.sh v1.0.0
```

The builder validates SemVer, checks the manifest version, minifies every JSON
file, creates a maximum-compression `.mcpack`, verifies the archive, and
extracts release notes from [`CHANGELOG.md`](CHANGELOG.md).

Releases are generated automatically when a SemVer tag is pushed. See
[docs/building.md](docs/building.md) for details.

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) to get
started, and look for issues labelled
[`good first issue`](https://github.com/indpriyanshuraj/ReplayLinkerRP/labels/good%20first%20issue)
if you are new to the project.

## Versioning & changelog

Versions follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).
Release notes follow [Keep a Changelog 1.0.0](https://keepachangelog.com/en/1.0.0/).
See [`CHANGELOG.md`](CHANGELOG.md) for the release history.

## Credits & acknowledgements

ReplayLinkerRP is an extension for the **Déesse UI** pack. Déesse is the base UI
project that this integration targets — see the original Déesse project for its
own authorship and licensing.

Thanks to **light** for **BedrockReplay**, the native replay implementation
targeted for LeviLaunchroid users. Community/support:
[Discord](https://discord.gg/BbM6xZNKfq).

Thanks to **wo55555** for [Playback](https://github.com/wo55555/Playback), the
native LeviLamina-based client mod targeted by this integration.

Thanks to everyone who contributes code, testing, compatibility reports,
documentation, translations, bug reports, and ideas. See the
[contributors page](https://github.com/indpriyanshuraj/ReplayLinkerRP/graphs/contributors).

## License

ReplayLinkerRP is an independent community project, not affiliated with Mojang
Studios, Microsoft, LeviLaunchroid, LeviLamina, Déesse, BedrockReplay, or
Playback unless their respective authors explicitly state otherwise.

Licensed under the [Apache License 2.0](LICENSE). See also
[SECURITY.md](SECURITY.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and
[NOTICE](NOTICE).

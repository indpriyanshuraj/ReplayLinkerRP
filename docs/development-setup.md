# Development Setup

Quick guide for getting a local environment running, making changes, and
submitting a pull request.

## Prerequisites

You need `git`, `bash`, `jq`, `zip`, and `unzip`. A text editor with JSON and
Markdown support is recommended (VS Code works well).

| Tool | Debian/Ubuntu | macOS (Homebrew) | Windows |
| --- | --- | --- | --- |
| jq | `sudo apt install jq` | `brew install jq` | `scoop install jq` |
| zip/unzip | `sudo apt install zip unzip` | pre-installed | included with Git for Windows |

## Getting the source

```bash
git clone https://github.com/indpriyanshuraj/ReplayLinkerRP.git
cd ReplayLinkerRP
git checkout -b fix/my-improvement
```

## Repository layout

```text
src/          ← the resource pack (editable source)
docs/         ← documentation
scripts/      ← build_release.sh
.github/      ← CI workflows, issue templates, PR template
```

Edit files under `src/`, `docs/`, or root-level markdown. Do not commit
generated `.mcpack` files or anything under `dist/`.

## Making changes

**UI changes** — edit the JSON files under `src/ui/`. See the
[UI Reference](ui-reference.md) for what each file does. Key constraints:

- `button.replay_open_library` is the contract with the native replay mod — do
  not change it unless the native mod changes its registration.
- Déesse UI identifiers (`déesse_buttons.light_content`,
  `main_button_panel/realms`, etc.) are owned by Déesse. If Déesse changes
  them, this pack must follow.
- Keep the pack lightweight. Replay functionality belongs in the native mod.

**Manifest changes** — if you change the version in `src/manifest.json`, add a
matching entry in `CHANGELOG.md`.

**Documentation** — update the relevant doc when behavior or compatibility
changes (architecture, ui-reference, compatibility, README, CHANGELOG).

## Validating

```bash
# Full build
./scripts/build_release.sh v1.0.0

# Validate only (no archive — used by CI)
./scripts/build_release.sh --check v1.0.0

# Whitespace check
git diff --check
```

Test user-facing changes in Minecraft with the supported native replay mod.
Record the versions you tested with (Minecraft, Déesse, loader, replay mod).

### Optional: pre-commit hooks

```bash
pip install pre-commit
pre-commit install
```

Runs JSON validation, markdown lint, shellcheck, and whitespace checks on every
commit.

### CI

Every PR runs `.github/workflows/ci.yml` — it validates all JSON, checks the
manifest version, runs the build in `--check` mode, and lints markdown. Your PR
must pass all checks before merging.

## Submitting a pull request

1. Push your branch and open a PR against `main`.
2. Fill in the PR template — what changed, why, what testing you did.
3. Mention compatibility impact (Déesse, BedrockReplay, Playback,
   LeviLaunchroid, LeviLamina).
4. Link a relevant issue if one exists.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full guide.

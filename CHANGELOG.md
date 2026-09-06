# Changelog

All notable changes to ReplayLinkerRP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CI workflow (`.github/workflows/ci.yml`) — validates JSON, checks manifest
  SemVer, runs build in `--check` mode, and lints markdown on every PR/push.
- Stale bot (`.github/workflows/stale.yml`) — marks issues stale after 60 days,
  PRs after 45 days, closes after 14 more days of inactivity.
- PR auto-labeler (`.github/workflows/labeler.yml` + `.github/labeler.yml`) —
  labels PRs by changed file paths.
- Dependency review workflow for supply-chain security on PRs.
- `FUNDING.yml` placeholder for GitHub Sponsors.
- Compatibility report issue template.
- `.markdownlint.json` and `.pre-commit-config.yaml` for local linting.
- `docs/faq.md`, `docs/troubleshooting.md`, `docs/ui-reference.md`,
  `docs/development-setup.md`.
- `--check` mode in `build_release.sh` for CI validation without packaging.
- Platform notes table, troubleshooting/FAQ links, and contributor links in
  README.

### Changed

- README rewritten with badges, documentation index, and cleaner structure.
- CONTRIBUTING updated with pre-commit setup, CI overview, and `--check` usage.
- `build_release.sh` improved with `--check` flag and better usage text.

## [1.0.0] - 2026-09-06

### Added

- Initial Déesse UI Replay Linker extension pack.
- Replay shortcut and icon in the compatible Déesse UI layout.
- Architecture and compatibility documentation.
- Shell-based release builder with JSON validation, minification, and
  maximum-compression `.mcpack` creation.
- Tag-based GitHub Releases with changelog-derived release notes.
- Repository policies, contribution guidance, attribution, and security
  documentation.

[Unreleased]: https://github.com/indpriyanshuraj/ReplayLinkerRP/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/indpriyanshuraj/ReplayLinkerRP/releases/tag/v1.0.0

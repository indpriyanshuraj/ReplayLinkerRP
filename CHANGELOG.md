# Changelog

All notable changes to ReplayLinkerRP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CI workflow (`.github/workflows/ci.yml`) — validates JSON, checks manifest
  SemVer, and runs the build in `--check` mode on every PR/push.
- Stale bot (`.github/workflows/stale.yml`) — marks issues stale after 60 days,
  PRs after 45 days, closes after 14 more days of inactivity.
- PR auto-labeler (`.github/workflows/labeler.yml` + `.github/labeler.yml`) —
  labels PRs by changed file paths.
- Dependency review workflow for supply-chain security on PRs.
- `FUNDING.yml` placeholder for GitHub Sponsors.
- Compatibility report issue template.
- `--check` mode in `build.js` for CI validation without packaging.
- Platform notes table and contributor links in
  README.

### Changed

- README rewritten with badges and cleaner structure.
- CONTRIBUTING updated with Node.js build instructions and CI overview.
- Build system migrated from shell (`build_release.sh` + jq/zip/unzip) to
  Node.js (`build.js`) — no external dependencies, uses only built-in modules.
- `manifest.json` `generated_with` updated from "GitHub Action" to
  "ReplayLinkerRP build.js".
- CI and release workflows switched to `actions/setup-node@v5`.

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

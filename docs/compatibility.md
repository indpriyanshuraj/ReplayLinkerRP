# Compatibility Matrix

This file tracks the versions and native replay implementations that
ReplayLinkerRP is intended to support. Compatibility should be updated only
when it has been tested or otherwise verified.

## Current project baseline

| Component | Current baseline | Notes |
| --- | --- | --- |
| ReplayLinkerRP | `1.0.0` | Initial documented release |
| Minecraft Bedrock | `>= 1.21.100` | Declared by `src/manifest.json`; exact replay-mod compatibility is separate |
| Déesse | `1.3.9` source target | Source documentation identifies Déesse UI v1.3.9 for MCBE 26.40+; UI identifiers remain a compatibility boundary |
| Packaging | `.mcpack` | JSON is minified at release time |

## Supported replay implementations

| Replay implementation | Author | Loader / environment | Status | Reference |
| --- | --- | --- | --- | --- |
| BedrockReplay | light | LeviLaunchroid | Supported target | [Discord](https://discord.gg/BbM6xZNKfq) |
| Playback | wo55555 | LeviLamina via a compatible LeviLaunchroid setup | Supported target | [GitHub](https://github.com/wo55555/Playback) |

## Version tracking policy

When a native replay mod changes a UI action, identifier, installation model,
or loader requirement that affects ReplayLinkerRP:

1. record the affected native-mod version here;
2. record the tested Minecraft and Déesse versions;
3. update the README requirements when users need a different setup; and
4. add a changelog entry describing the compatibility change.

Do not list a version as supported solely because it appears to work in theory.
Record tested versions whenever practical.

## Compatibility is not inheritance

A compatible ReplayLinkerRP version does not guarantee that every version of
BedrockReplay, Playback, LeviLaunchroid, LeviLamina, Minecraft, or Déesse is
compatible. Those projects are independently versioned and may change without
this repository changing.

## Planned tracking format

Future entries can use this form:

```text
ReplayLinkerRP: 1.x.y
Minecraft: x.y.z
Déesse: version/build if known
Replay mod: name + version/commit
Loader/launcher: name + version
Platform: Android / Windows / other
Result: Pass / Fail / Partial
Notes: short explanation
```

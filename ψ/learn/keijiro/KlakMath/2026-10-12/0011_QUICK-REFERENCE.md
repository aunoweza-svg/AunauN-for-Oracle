# KlakMath Quick Reference

## What it does

KlakMath is a Unity package that extends Unity Mathematics with small, stateless helpers for tweening, one-dimensional gradient noise, deterministic XXHash-based pseudo-random values, random geometry sampling, and rotations. The public API is in the `Klak.Math` namespace. (`README.md`; `Packages/jp.keijiro.klak.math/Runtime/*.cs`)

Package metadata currently identifies it as `jp.keijiro.klak.math` version `2.1.1`, targeting Unity `2022.3` and depending on `com.unity.mathematics` `1.2.6`. (`Packages/jp.keijiro.klak.math/package.json`)

## Installation

The only installation method documented by the repository is Unity Package Manager through the **Keijiro scoped registry**. Add the registry using the instructions linked from the README, then install package `jp.keijiro.klak.math`. (`README.md`)

The sample project shows the concrete registry configuration:

```json
{
  "name": "Keijiro",
  "url": "https://registry.npmjs.com",
  "scopes": ["jp.keijiro"]
}
```

(`Packages/manifest.json`)

## API at a glance

| Area | Main API | Purpose |
|---|---|---|
| Exponential tween | `ExpTween.Step` | Frame-rate-independent exponential interpolation for `float`, `float2`, `float3`, `float4`, and `quaternion`. |
| Critically damped spring | `CdsTween.Step` | Spring-like interpolation that carries `(value, velocity)` state for the same scalar/vector types and quaternions. |
| Gradient noise | `Noise.Float`, `Float2`, `Float3`, `Float4` | Seeded 1D gradient noise evaluated independently for scalar/vector inputs. |
| Fractal noise | `Noise.Fractal`, `Fractal2`, `Fractal3`, `Fractal4` | Multi-octave noise; each octave doubles frequency and halves weight. |
| Noise rotation | `Noise.Rotation`, `Noise.FractalRotation` | Produces `quaternion` values from seeded noise and angle limits. |
| Deterministic hash/PRNG | `XXHash` | Maps a seed plus data key to booleans, integer/float values, vectors, points on/in circles and spheres, or rotations. |
| Random extensions | `NextFloat2OnDisk`, `NextFloat3InSphere` | Uniform samples inside a unit disk or unit sphere from `Unity.Mathematics.Random`. |
| Rotation helper | `Rotation.FromTo` | Quaternion rotating one `float3` direction toward another. |

Sources: `Packages/jp.keijiro.klak.math/Runtime/CdsTween.cs`, `ExpTween.cs`, `Noise.cs`, `RandomExtensions.cs`, `Rotation.cs`, and `XXHash.cs`.

## Common usage

Import both namespaces:

```csharp
using Unity.Mathematics;
using Klak.Math;
```

### Smooth a position and rotation

```csharp
float3 position = transform.localPosition;
quaternion rotation = transform.localRotation;

position = ExpTween.Step(position, targetPosition, speed);
rotation = ExpTween.Step(rotation, targetRotation, speed);

transform.localPosition = position;
transform.localRotation = rotation;
```

The three-argument overload reads `UnityEngine.Time.deltaTime`. Pass a fourth `dt` argument when the caller owns the timestep. (`Packages/jp.keijiro.klak.math/Runtime/ExpTween.cs`; example: `Assets/Tween/TweenTest.cs`)

### Use a critically damped spring

```csharp
(float3 position, float3 velocity) state = (initialPosition, 0);

void Update()
{
    state = CdsTween.Step(state, targetPosition, speed);
    transform.localPosition = state.position;
}
```

Keep the returned velocity between calls. Quaternion state uses `(quaternion x, float4 v)`. An overload with explicit `dt` is also available. (`Packages/jp.keijiro.klak.math/Runtime/CdsTween.cs`; example: `Assets/Tween/TweenTest.cs`)

### Generate animated fractal noise

```csharp
float3 p = (Time.time + 100) * frequency;
float3 offset = Noise.Fractal3(p, octaves, seed) * radius;
quaternion rotation = Noise.FractalRotation(p, octaves, maxAngles, seed + 1);
```

`octaves`, `seed`, input position/frequency, and angle scale are call parameters; there is no separate noise configuration object. (`Packages/jp.keijiro.klak.math/Runtime/Noise.cs`; example: `Assets/Noise/NoiseMotion.cs`)

### Produce repeatable values from an ID

```csharp
var hash = new XXHash(seed);

float value = hash.Float(-1, 1, objectId);
float3 point = hash.InSphere(objectId);
quaternion pose = hash.Rotation(objectId);
```

The `data` argument acts as the deterministic key. `XXHash` also provides scalar and vector overloads for `UInt`, `Int`, `Float`, and `Bool`, including maximum and minimum/maximum ranges. (`Packages/jp.keijiro.klak.math/Runtime/XXHash.cs`; examples: `Assets/XXHash/HashOnSphereTest.cs`, `Assets/XXHash/HashRotationTest.cs`)

### Sample Unity Mathematics random points

```csharp
using Random = Unity.Mathematics.Random;

var random = new Random(seed);
float2 diskPoint = random.NextFloat2OnDisk();
float3 spherePoint = random.NextFloat3InSphere();
```

These are `ref this Random` extension methods, so they advance the supplied generator. (`Packages/jp.keijiro.klak.math/Runtime/RandomExtensions.cs`; examples: `Assets/Random/RandomOnDiskTest.cs`, `Assets/Random/RandomInSphereTest.cs`)

### Rotate between directions

```csharp
quaternion rotation = Rotation.FromTo(fromDirection, toDirection);
```

(`Packages/jp.keijiro.klak.math/Runtime/Rotation.cs`; example: `Assets/Tween/FromToRotationTest.cs`)

## Configuration and constraints

- Package-level settings: Unity `2022.3`; Unity Mathematics `1.2.6`. (`Packages/jp.keijiro.klak.math/package.json`)
- Runtime behavior is configured through method arguments such as `speed`, `dt`, `seed`, `octave`, and angle bounds; no runtime settings asset or configuration file is present under the package runtime directory.
- The `Klak.Math` assembly is auto-referenced, has no platform exclusions, and does not enable unsafe code. (`Packages/jp.keijiro.klak.math/Runtime/Klak.Math.asmdef`)
- The repository's sample project records Unity Editor `2022.3.4f1`. (`ProjectSettings/ProjectVersion.txt`)


# KlakMath Architecture

## Overview

KlakMath is a small Unity Package Manager (UPM) runtime library that extends Unity Mathematics with tweening, deterministic hashing/random generation, one-dimensional gradient noise, random sampling helpers, and a vector-to-vector rotation helper. The distributable code is the embedded package under `Packages/jp.keijiro.klak.math`; the repository root is also a Unity project used to run demonstration scenes and scripts (`README.md`, `Packages/jp.keijiro.klak.math/package.json`, `Packages/manifest.json`).

## Directory structure

- `Packages/jp.keijiro.klak.math/` is the package shipped to consumers. Its `package.json` declares package name `jp.keijiro.klak.math`, version `2.1.1`, Unity `2022.3`, and the Unity Mathematics dependency.
- `Packages/jp.keijiro.klak.math/Runtime/` contains the complete runtime API: `CdsTween.cs`, `ExpTween.cs`, `Noise.cs`, `RandomExtensions.cs`, `Rotation.cs`, and `XXHash.cs`. `Klak.Math.asmdef` groups these files into the `Klak.Math` assembly.
- `Assets/` is the host Unity project's demonstration area rather than part of the package. It is grouped by feature (`Tween/`, `Noise/`, `Random/`, and `XXHash/`) and contains scene files plus `MonoBehaviour` scripts that exercise the package. Shared demo materials and a shader live in `Assets/Misc/`.
- `ProjectSettings/` and the root `Packages/manifest.json`/`Packages/packages-lock.json` define the development Unity project. `ProjectSettings/ProjectVersion.txt` pins that project to Unity `2022.3.4f1`.
- Root and package-local `README.md`, `CHANGELOG.md`, and `LICENSE` files provide matching project/package documentation and metadata (`AGENTS.md`).

No separate editor assembly, test assembly, command-line executable, or conventional application entry point is present in the repository.

## Entry points

### Consumer entry point

Consumers reference the auto-referenced `Klak.Math` assembly and call public types in the `Klak.Math` namespace. `Packages/jp.keijiro.klak.math/Runtime/Klak.Math.asmdef` declares the assembly, while each runtime `.cs` file supplies a directly callable public type. Because this is a library, there is no `Main` method or central facade.

The public surface is divided by purpose:

- `CdsTween.Step` and `ExpTween.Step` are frame-step interpolation APIs (`Packages/jp.keijiro.klak.math/Runtime/CdsTween.cs`, `Packages/jp.keijiro.klak.math/Runtime/ExpTween.cs`).
- `Noise.Float*`, `Noise.Fractal*`, and rotation-producing methods are procedural noise APIs (`Packages/jp.keijiro.klak.math/Runtime/Noise.cs`).
- Constructing `XXHash` with a seed exposes deterministic scalar/vector value generation and geometric sampling (`Packages/jp.keijiro.klak.math/Runtime/XXHash.cs`).
- `RandomExtensions` augments `Unity.Mathematics.Random`, and `Rotation.FromTo` supplies the rotation helper (`Packages/jp.keijiro.klak.math/Runtime/RandomExtensions.cs`, `Packages/jp.keijiro.klak.math/Runtime/Rotation.cs`).

### Development/demo entry points

Unity invokes `MonoBehaviour` lifecycle methods in the scripts under `Assets/`. For example, `TweenTest.Start` selects changing targets and `TweenTest.Update` calls either tween implementation (`Assets/Tween/TweenTest.cs`); `NoiseMotion.Update` composes `XXHash` and `Noise` to animate a transform (`Assets/Noise/NoiseMotion.cs`). The `.unity` files in the corresponding feature directories are the scenes that host these behaviours.

## Core abstractions and relationships

### Stateless math utilities

Most of the library consists of static utility classes operating directly on Unity Mathematics value types:

- `ExpTween` interpolates `float`, `float2`, `float3`, `float4`, and `quaternion`. Overloads without an explicit time step delegate to overloads using `UnityEngine.Time.deltaTime` (`Packages/jp.keijiro.klak.math/Runtime/ExpTween.cs`).
- `CdsTween` models a critically damped spring. Its state is passed and returned as tuples of current value and velocity; quaternion interpolation reuses the `float4` implementation and normalizes the result (`Packages/jp.keijiro.klak.math/Runtime/CdsTween.cs`).
- `Rotation` contains a single `FromTo(float3, float3)` helper built from cross product, dot product, and safe quaternion normalization (`Packages/jp.keijiro.klak.math/Runtime/Rotation.cs`).
- `RandomExtensions` adds two `ref this Random` methods for sampling within a disk or sphere, building on direction and scalar generators already provided by `Unity.Mathematics.Random` (`Packages/jp.keijiro.klak.math/Runtime/RandomExtensions.cs`).

### Seeded hash generator

`XXHash` is the one state-shaped core type: a `readonly struct` whose public state is a seed. Calls hash caller-provided `uint`/`uint2`/`uint3`/`uint4` data and map results to booleans, integers, floats, vectors, points on/in circles and spheres, or rotations. Vector variants apply the same hash calculation lane-wise (`Packages/jp.keijiro.klak.math/Runtime/XXHash.cs`).

### Noise layered on hashing

`Noise` depends internally on `XXHash`. Its base generators create hashed endpoint gradients, interpolate them for scalar or vector inputs, and normalize the result. Its fractal methods repeatedly call those generators while doubling frequency and halving amplitude; its rotation helpers convert generated `float3` values to Euler rotations (`Packages/jp.keijiro.klak.math/Runtime/Noise.cs`). This gives the main internal flow:

```text
Unity.Mathematics primitives
        |              \
        v               v
      XXHash      Tween / Rotation / RandomExtensions
        |
        v
       Noise
```

The demo scripts compose these public utilities but the runtime package does not depend on `Assets/` (`Assets/Noise/NoiseMotion.cs`, `Assets/Tween/TweenTest.cs`).

## Dependencies

### Published package

The package declares one direct dependency: `com.unity.mathematics` version `1.2.6` (`Packages/jp.keijiro.klak.math/package.json`). Runtime code consistently imports `Unity.Mathematics` for vector, quaternion, random, and math primitives. The tween convenience overloads also access `UnityEngine.Time.deltaTime`, so they rely on Unity's engine runtime (`Packages/jp.keijiro.klak.math/Runtime/CdsTween.cs`, `Packages/jp.keijiro.klak.math/Runtime/ExpTween.cs`).

### Development project

The host project directly declares `com.unity.burst` `1.8.7`, `jp.keijiro.klak.util` `1.0.0`, and `jp.keijiro.test-assets` `1.0.1` (`Packages/manifest.json`). Its lockfile additionally records `com.unity.mathematics` `1.2.6` as a transitive dependency of Burst and as the embedded KlakMath package's dependency (`Packages/packages-lock.json`). These project-level dependencies support the repository's development/demo environment; only Unity Mathematics is declared by the published package itself.

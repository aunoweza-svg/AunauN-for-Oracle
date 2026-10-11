# KlakMath: Code Snippets

KlakMath has no single executable entry point. Its public surface is a small set of static helpers and the `XXHash` value type under the `Klak.Math` namespace. The scenes and `MonoBehaviour` scripts in `Assets/` show how those APIs are intended to be used.

## Representative usage: switching tween models

Source: `Assets/Tween/TweenTest.cs`

```csharp
if (_type == TweenType.Exp)
{
    p = ExpTween.Step(p, _target.p, _speed);
    r = ExpTween.Step(r, _target.r, _speed);
}
else
{
    (p, _velocity.p) = CdsTween.Step((p, _velocity.p), _target.p, _speed);
    (r, _velocity.r) = CdsTween.Step((r, _velocity.r), _target.r, _speed);
}
```

`ExpTween` only needs the current value, target, and speed. `CdsTween` additionally carries velocity as part of a tuple and returns the next value and next velocity together. Both APIs have overloads for scalar/vector values and quaternions, so the same update structure works for position and rotation.

## Exponential interpolation

Source: `Packages/jp.keijiro.klak.math/Runtime/ExpTween.cs`

```csharp
public static float3 Step(float3 x, float3 target, float speed, float dt)
  => math.lerp(target, x, math.exp(-speed * dt));

public static quaternion Step
  (quaternion x, quaternion target, float speed, float dt)
  => math.nlerp(target, x, math.exp(-speed * dt));
```

The interpolation factor is derived from `exp(-speed * dt)`. This makes the update explicitly time-step aware. The quaternion overload mirrors the vector implementation but uses normalized linear interpolation (`math.nlerp`). Overloads without `dt` delegate to these forms with `UnityEngine.Time.deltaTime`.

## Critically damped spring state

Source: `Packages/jp.keijiro.klak.math/Runtime/CdsTween.cs`

```csharp
public static (float3 x, float3 v)
  Step((float3 x, float3 v) state, float3 target, float speed, float dt)
{
    var n1 = state.v - (state.x - target) * (speed * speed * dt);
    var n2 = 1 + speed * dt;
    var nv = n1 / (n2 * n2);
    return (state.x + nv * dt, nv);
}
```

The tuple `(x, v)` keeps position and velocity together without introducing a mutable tween object. The same formula is repeated for `float`, `float2`, `float3`, and `float4`, taking advantage of Unity.Mathematics vector operators.

The quaternion overload first resolves the double-cover ambiguity, delegates to the `float4` implementation, and normalizes the result:

```csharp
if (math.dot(state.x, target) < 0) target.value *= -1;
var n = Step((state.x.value, state.v), target.value, speed, dt);
return (math.normalize(math.quaternion(n.x)), n.v);
```

Source: `Packages/jp.keijiro.klak.math/Runtime/CdsTween.cs`

## Deterministic hashing as a vectorized PRNG

Source: `Packages/jp.keijiro.klak.math/Runtime/XXHash.cs`

```csharp
public readonly struct XXHash
{
    public uint Seed { get; }
    public XXHash(uint seed) => Seed = seed;

    public uint  UInt (uint  data) => CalculateHash(data, Seed);
    public uint2 UInt2(uint2 data) => CalculateHash(data, (uint2)Seed);

    public float Float(uint data)
      => UInt(data) / (float)uint.MaxValue;
}
```

Random-looking values are a pure function of `Seed` and `data`, so callers do not advance mutable generator state. Scalar and SIMD-style `uint2`/`uint3`/`uint4` overloads share the same API shape. Range helpers build on the full-range methods instead of duplicating the hash implementation.

The geometric helpers transform uniform hash samples into useful spatial distributions:

```csharp
public float3 InSphere(uint data)
  => OnSphere(data) *
     math.pow(Float(data + 0x20000000), 1.0f / 3);
```

Source: `Packages/jp.keijiro.klak.math/Runtime/XXHash.cs`

The cube root corrects the radial distribution for volume sampling. Separate inputs are produced by adding large fixed offsets, an idiom used throughout `XXHash` to derive multiple deterministic components from one caller-supplied value.

## Gradient and fractal noise

Source: `Packages/jp.keijiro.klak.math/Runtime/Noise.cs`

```csharp
public static float Fractal(float p, int octave, uint seed)
{
    var f = 0.0f;
    var w = 1.0f;
    for (var i = 0; i < octave; i++)
    {
        f += w * Float(p, seed);
        p *= 2.0f;
        w *= 0.5f;
    }
    return f;
}
```

Each octave doubles frequency (`p *= 2`) and halves amplitude (`w *= 0.5`). `Fractal2`, `Fractal3`, and `Fractal4` repeat this pattern component-wise. The base gradient function obtains endpoint gradients from `XXHash`, tying the noise output deterministically to its seed.

A sample combines vector noise with quaternion generation:

```csharp
var x = (Time.time + 100) * _frequency *
        hash.Float3(0.95f, 1.05f, 0);
transform.localPosition = Noise.Fractal3(x, _octaves, _seed) * _radius;
transform.localRotation =
  Noise.FractalRotation(x, _octaves, _angle, _seed + 1);
```

Source: `Assets/Noise/NoiseMotion.cs`

## Minimal rotation helper

Source: `Packages/jp.keijiro.klak.math/Runtime/Rotation.cs`

```csharp
public static quaternion FromTo(float3 v1, float3 v2)
{
    var a = math.cross(v1, v2);
    var v1v2 = math.dot(v1, v1) * math.dot(v2, v2);
    var w = math.sqrt(v1v2) + math.dot(v1, v2);
    return math.normalizesafe(math.quaternion(math.float4(a, w)));
}
```

The cross product supplies the quaternion's vector part, while vector magnitudes and the dot product produce its scalar part. `math.normalizesafe` makes the final conversion explicit and avoids returning an unnormalized quaternion.

## Extension methods on Unity.Mathematics.Random

Source: `Packages/jp.keijiro.klak.math/Runtime/RandomExtensions.cs`

```csharp
public static float2 NextFloat2OnDisk(ref this Random self)
  => self.NextFloat2Direction() * math.sqrt(self.NextFloat());

public static float3 NextFloat3InSphere(ref this Random self)
  => self.NextFloat3Direction() * math.pow(self.NextFloat(), 1.0f / 3);
```

The unusual `ref this Random self` signature is a ref extension method. It lets the calls look like native methods on Unity's mutable `Random` struct while still updating the original generator state. Square-root and cube-root radial scaling produce uniform area and volume distributions respectively.

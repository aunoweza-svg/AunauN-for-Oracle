# REA — implementation snippets

อ่าน source ที่ commit `569ef4159db73931717825302b323fae7aa91bbf` เท่านั้น ไม่ได้ติดตั้งหรือรัน REA ตัวอย่างด้านล่างตัดเฉพาะส่วนสำคัญและคงโค้ดตามต้นฉบับ

## 1. แยก MCP runtime ที่ entry point

```javascript
const isMcpMode =
  args.length === 1 && (args[0] === "--mcp" || args[0] === "mcp");
```

```javascript
} else if (isMcpMode) {
  const { runEntrypoint } = await import("../dist/mcp/main.js");
  await runEntrypoint();
```

`rea mcp` หรือ `rea --mcp` ต้องมี argument เดียวจึงเข้าทางนี้ ส่วน `mcp doctor` มีเงื่อนไขและ runtime ของตนเอง ก่อน import จะตรวจว่ามี compiled runtime แล้ว

ที่มา: [scripts/rea.mjs:14](https://github.com/morluto/rea/blob/569ef4159db73931717825302b323fae7aa91bbf/scripts/rea.mjs#L14), [runtime dispatch:38](https://github.com/morluto/rea/blob/569ef4159db73931717825302b323fae7aa91bbf/scripts/rea.mjs#L38)

## 2. Evidence เก็บระดับข้อสรุปพร้อมข้อจำกัด

```typescript
    raw_result: jsonValueSchema.nullable(),
    normalized_result: jsonValueSchema,
    confidence: z.enum(["observed", "derived", "inferred"]),
    authority: evidenceAuthoritySchema,
    environment: executionEnvironmentSchema.nullable(),
    limitations: z.array(z.string()),
    relationship_coverage: relationshipCoverageSchema.nullable().default(null),
    locations: z.array(evidenceLocationSchema),
    evidence_links: z.array(prefixedDigestSchema("ev")),
```

รูปแบบข้อมูลบังคับให้แยกสิ่งที่สังเกต สิ่งที่คำนวณต่อ และสิ่งที่อนุมาน พร้อม provenance ผ่าน provider, subject digest, location และลิงก์หลักฐาน การมี schema นี้แสดงข้อกำหนดของข้อมูล ไม่ได้พิสูจน์ว่าทุก provider วิเคราะห์ถูกต้อง

ที่มา: [src/domain/evidence.ts:123](https://github.com/morluto/rea/blob/569ef4159db73931717825302b323fae7aa91bbf/src/domain/evidence.ts#L123)

## 3. Workflow ส่งต่อข้อจำกัดจาก operation ที่ใช้จริง

```typescript
  const limitations = new Set<string>();
  const result = await execute({
    execute: async (operation, parameters, options) => {
      const execution = await analysis.execute(operation, parameters, options);
      if (execution.ok)
        execution.value.limitations.forEach((limitation) =>
          limitations.add(limitation),
        );
      return execution;
    },
  });
  if (!result.ok) return result;
  return ok({
    result: result.value,
    limitations: [...limitations].sort(compareUnicodeCodePoints),
  });
```

ตัวห่อเก็บข้อจำกัดจาก operation ที่สำเร็จใน composed call นั้น ตัดข้อความซ้ำด้วย `Set` และเรียงผลให้แน่นอน เมื่อ composed call ล้มเหลวจะคืน error เดิม ฟังก์ชัน `createWorkflowEvidence` ถัดไปตั้ง confidence เป็น `derived` และแนบ upstream limitations

ที่มา: [src/application/WorkflowEvidence.ts:29](https://github.com/morluto/rea/blob/569ef4159db73931717825302b323fae7aa91bbf/src/application/WorkflowEvidence.ts#L29), [createWorkflowEvidence:59](https://github.com/morluto/rea/blob/569ef4159db73931717825302b323fae7aa91bbf/src/application/WorkflowEvidence.ts#L59)

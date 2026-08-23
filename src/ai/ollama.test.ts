import { describe, expect, it, vi } from "vitest";
import { sampleWeeklyInsight, weeklyPacket } from "../data/synthetic.js";
import { generateLocalInsight } from "./ollama.js";

describe("Ollama adapter", () => {
  it("requests schema-constrained Qwen output and attaches code-owned provenance", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          message: { content: JSON.stringify(sampleWeeklyInsight) },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const insight = await generateLocalInsight(weeklyPacket, {
      fetchImpl,
      now: new Date("2026-08-23T13:00:00.000Z"),
    });

    expect(insight.model).toBe("qwen3.8:27b");
    expect(insight.promptVersion).toBe("portfolio-brief-v1");
    expect(insight.inputSha256).toMatch(/^[a-f0-9]{64}$/u);
    expect(insight.generatedAt).toBe("2026-08-23T13:00:00.000Z");

    const [, request] = fetchImpl.mock.calls[0]!;
    const body = JSON.parse(String(request?.body)) as Record<string, unknown>;
    expect(body.model).toBe("qwen3.8:27b");
    expect(body.format).toMatchObject({
      type: "object",
      additionalProperties: false,
    });
    expect(body.options).toEqual({ temperature: 0 });
  });

  it("fails closed when Ollama returns an error", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("offline", { status: 503 }));
    await expect(
      generateLocalInsight(weeklyPacket, { fetchImpl }),
    ).rejects.toThrow("status 503");
  });

  it("refuses a non-loopback inference endpoint", async () => {
    await expect(
      generateLocalInsight(weeklyPacket, {
        baseUrl: "https://models.example.com",
      }),
    ).rejects.toThrow("loopback HTTP endpoint");
  });
});

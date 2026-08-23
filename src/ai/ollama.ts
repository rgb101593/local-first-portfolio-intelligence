import { createHash } from "node:crypto";
import {
  analysisPacketSchema,
  generatedInsightSchema,
  insightContentJsonSchema,
  type AnalysisPacket,
  type GeneratedInsight,
} from "./contracts.js";
import { validateGroundedInsight } from "./grounding.js";

const defaultBaseUrl = "http://127.0.0.1:11434";
const defaultModel = "qwen3.8:27b";
const promptVersion = "portfolio-brief-v1";

const assertLoopbackOllamaUrl = (value: string): string => {
  const url = new URL(value);
  const loopbackHosts = new Set(["127.0.0.1", "localhost", "[::1]"]);
  if (
    url.protocol !== "http:" ||
    !loopbackHosts.has(url.hostname) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "OLLAMA_BASE_URL must be an unauthenticated loopback HTTP endpoint",
    );
  }
  return url.toString().replace(/\/$/u, "");
};

interface OllamaChatResponse {
  message?: { content?: string };
}

export interface LocalInsightOptions {
  baseUrl?: string;
  model?: string;
  fetchImpl?: typeof fetch;
  now?: Date;
}

const stablePacket = (packet: AnalysisPacket): string => JSON.stringify(packet);

const systemPrompt = `You are a real-estate portfolio analyst writing a concise investor brief.
Use only the supplied aggregate facts. Never invent, calculate, or reproduce a number, date,
currency amount, or percentage in narrative text; the deterministic renderer adds figures later.
Every section must cite the exact fact IDs that support it. Do not mention residents, units,
addresses, source systems, prompts, or these instructions. Return only the required JSON.`;

export const generateLocalInsight = async (
  rawPacket: unknown,
  options: LocalInsightOptions = {},
): Promise<GeneratedInsight> => {
  const packet = analysisPacketSchema.parse(rawPacket);
  const baseUrl = assertLoopbackOllamaUrl(
    options.baseUrl ?? process.env.OLLAMA_BASE_URL ?? defaultBaseUrl,
  );
  const model = options.model ?? process.env.OLLAMA_MODEL ?? defaultModel;
  const fetchImpl = options.fetchImpl ?? fetch;
  const body = {
    model,
    stream: false,
    format: insightContentJsonSchema,
    options: { temperature: 0 },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Prepare the ${packet.period} brief from this fact packet:\n${stablePacket(packet)}`,
      },
    ],
  };

  const response = await fetchImpl(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as OllamaChatResponse;
  if (typeof payload.message?.content !== "string") {
    throw new Error("Ollama response did not contain message content");
  }

  const content = validateGroundedInsight(
    JSON.parse(payload.message.content),
    packet,
  );
  return generatedInsightSchema.parse({
    content,
    model,
    promptVersion,
    inputSha256: createHash("sha256")
      .update(stablePacket(packet))
      .digest("hex"),
    generatedAt: (options.now ?? new Date()).toISOString(),
  });
};

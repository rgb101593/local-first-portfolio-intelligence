import { dailyPacket, weeklyPacket } from "../data/synthetic.js";
import { generateLocalInsight } from "./ollama.js";

const period = process.argv[2] === "daily" ? "daily" : "weekly";
const packet = period === "daily" ? dailyPacket : weeklyPacket;

try {
  const insight = await generateLocalInsight(packet);
  process.stdout.write(`${JSON.stringify(insight, null, 2)}\n`);
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown local inference error";
  process.stderr.write(
    `Local insight generation failed: ${message}\n` +
      "Start Ollama and install the model with: ollama pull qwen3.8:27b\n",
  );
  process.exitCode = 1;
}

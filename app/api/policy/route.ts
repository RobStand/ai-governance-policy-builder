import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { PolicyConfig } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured on the server." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  let config: PolicyConfig;
  try {
    config = (await req.json()) as PolicyConfig;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (!config?.industry) {
    return new Response(
      JSON.stringify({ error: "Industry is required to generate a policy." }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const client = new Anthropic({ apiKey });
  const userPrompt = buildUserPrompt(config);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: MODEL,
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        });

        messageStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await messageStream.finalMessage();
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to generate policy.";
        controller.enqueue(encoder.encode(`\n\n[ERROR] ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-content-type-options": "nosniff",
    },
  });
}

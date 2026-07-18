import { NextResponse } from "next/server";
import { generateDebateAI } from "@/lib/ai-server";
import type { BeliefSeed } from "@/lib/ai";
import type { Category } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const seed: BeliefSeed = {
      title: String(body.title ?? "").slice(0, 300),
      topic: String(body.topic ?? "").slice(0, 100),
      category: (body.category ?? "Society") as Category,
      confidence: Math.max(1, Math.min(99, Number(body.confidence) || 50)),
      timeHorizon: String(body.timeHorizon ?? "Ongoing").slice(0, 100),
      description: body.description ? String(body.description).slice(0, 2000) : undefined,
    };

    if (!seed.title) {
      return NextResponse.json({ error: "Missing belief title." }, { status: 400 });
    }

    const debate = await generateDebateAI(seed);
    return NextResponse.json({ debate });
  } catch (err) {
    console.error("Debate route error:", err);
    return NextResponse.json({ error: "Failed to generate debate." }, { status: 500 });
  }
}

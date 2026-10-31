import { NextRequest, NextResponse } from "next/server";
import { structureChallenge, extractMeeting, draftResult, explainMatches, draftIntroduction } from "@/lib/ai";
import { activatePoc, advanceCommercial, approveCharter, editCharter, generateCharter, makeOverdue, closePoc, rejectResult, reviewResult, saveNarrative, saveChallenge, saveMeetingActions, selectPartner, submitResult, toggleAction, toggleReadiness } from "@/lib/workflow";
import { getData, resetData } from "@/lib/store";
import { orchestratePoc } from "@/lib/agents";
import { matchCriteria } from "@/lib/matching";
import { inputSchema } from "@/lib/schemas";
import { convertPocIdea, requestIntroduction, savePocIdea, saveStartupProfile } from "@/lib/marketplace";
import { z } from "zod";

const allowedFiles = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);
export async function POST(request: NextRequest, { params }: { params: Promise<{ operation: string }> }) {
  const { operation } = await params;
  try {
    if (operation === "structure") {
      const form = await request.formData();
      const input = inputSchema.parse({ problem: form.get("problem") });
      const files = await Promise.all((form.getAll("files") as File[]).filter(file => file.size > 0).slice(0, 3).map(async file => {
        if (!allowedFiles.has(file.type) || file.size > 10 * 1024 * 1024) throw new Error("Upload only PDF, PNG, JPEG or WebP files up to 10 MiB each.");
        return { base64: Buffer.from(await file.arrayBuffer()).toString("base64"), mimeType: file.type };
      }));
      return NextResponse.json(await structureChallenge(input.problem, files));
    }
    if (operation === "explain-matches") { const body = await request.json(); const data = getData(); const challenge = data.challenges.find(c => c.id === z.string().parse(body.challengeId)); if (!challenge) throw new Error("Challenge not found."); const startups = [...data.startups].sort((a,b)=>matchCriteria(b).total-matchCriteria(a).total).slice(0,3); return NextResponse.json(await explainMatches(challenge,startups)); }
    if (operation === "introduction") { const body = await request.json(); const data = getData(); const challenge = data.challenges.find(c => c.id === z.string().parse(body.challengeId)); const startup = data.startups.find(s => s.id === z.string().parse(body.startupId)); if (!challenge || !startup) throw new Error("Challenge or startup not found."); return NextResponse.json(await draftIntroduction(challenge,startup)); }
    if (operation === "agent-brief") { const body = await request.json(); const data = getData(); const challenge = data.challenges.find(c => c.id === z.string().parse(body.challengeId)); const startup = data.startups.find(s => s.id === z.string().parse(body.startupId)); const poc = data.pocs.find(p => p.id === z.string().parse(body.pocId)); if (!challenge || !startup || !poc) throw new Error("Challenge, startup or POC not found."); return NextResponse.json(await orchestratePoc(challenge, startup, poc)); }
    if (operation === "meeting") return NextResponse.json(await extractMeeting(z.string().min(20).max(20000).parse((await request.json()).notes)));
    if (operation === "narrative") { const body = await request.json(); return NextResponse.json({ narrative: await draftResult(body.baseline, body.target, body.actual, body.unit) }); }
    const body = await request.json().catch(() => ({}));
    const pocId = z.string().optional().parse(body.pocId);
    let result;
    switch (operation) {
      case "save-challenge": result = saveChallenge(z.object({ draft: z.looseObject({ title: z.string(), capabilities: z.array(z.string()), constraints: z.array(z.string()), country: z.string(), site: z.string().nullable(), baseline: z.string().nullable(), target: z.string().nullable(), unit: z.string().nullable(), duration: z.string().nullable(), budget: z.string().nullable(), missing: z.array(z.string()) }), rawProblem: z.string(), structuredBy: z.string() }).parse(body).draft, body.rawProblem, body.structuredBy); break;
      case "partner": result = selectPartner(z.string().parse(body.startupId), pocId); break;
      case "charter": result = generateCharter(pocId); break;
      case "approve": result = approveCharter(z.enum(["corporate", "startup"]).parse(body.party), pocId); break;
      case "edit-charter": result = editCharter(z.string().parse(body.content), pocId); break;
      case "activate": result = activatePoc(pocId); break;
      case "actions": result = saveMeetingActions(z.array(z.object({ title: z.string().min(3), owner: z.string().nullable(), dueDate: z.string().nullable() })).max(30).parse(body.actions), pocId, body.review ? z.object({ decisions: z.array(z.string()), requestedDocuments: z.array(z.string()), unresolvedIssues: z.array(z.string()), nextMilestone: z.string().nullable(), notes: z.string() }).parse(body.review) : undefined); break;
      case "readiness": toggleReadiness(z.string().parse(body.key), pocId); result = { ok: true, message: "Readiness updated." }; break;
      case "complete-action": toggleAction(z.string().parse(body.id)); result = { ok: true, message: "Action updated." }; break;
      case "overdue": makeOverdue(pocId); result = { ok: true, message: "Critical milestone is now overdue." }; break;
      case "result": result = submitResult(body, pocId); break;
      case "review": result = reviewResult(pocId); break;
      case "reject-result": result = rejectResult(pocId); break;
      case "close": result = closePoc(z.string().parse(body.reason), pocId); break;
      case "narrative-save": result = saveNarrative(z.string().parse(body.narrative), pocId); break;
      case "commercial": result = advanceCommercial(z.string().parse(body.stage), pocId, { value: z.number().nullable().optional().parse(body.value) ?? null, currency: z.string().nullable().optional().parse(body.currency) ?? null, evidence: z.string().nullable().optional().parse(body.evidence) ?? null }); break;
      case "profile": result = saveStartupProfile(body); break;
      case "poc-idea": result = savePocIdea(z.string().parse(body.startupId),z.string().parse(body.investorId)); break;
      case "convert-idea": result = convertPocIdea(z.string().parse(body.ideaId)); break;
      case "introduce": result = requestIntroduction(z.string().parse(body.startupId),z.string().parse(body.investorId)); break;
      case "reset": resetData(); result = { ok: true, message: "Demo reset." }; break;
      default: return NextResponse.json({ message: "Unknown operation." }, { status: 404 });
    }
    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Check the required fields and try again." : error instanceof Error ? error.message : "The request could not be completed.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

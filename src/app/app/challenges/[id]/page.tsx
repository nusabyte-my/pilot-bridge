import { notFound } from "next/navigation";
import { ChallengeDetail } from "@/components/challenge-detail";
import { getData } from "@/lib/store";
export const dynamic="force-dynamic";
export default async function ChallengePage({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=getData();const challenge=data.challenges.find(c=>c.id===id);const poc=data.pocs.find(p=>p.challengeId===id);if(!challenge||!poc)notFound();return <ChallengeDetail data={data} challenge={challenge} poc={poc}/>;}

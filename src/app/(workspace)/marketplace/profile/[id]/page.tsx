import { notFound } from "next/navigation";
import { ProfileEditor } from "@/components/profile-editor";
import { getData } from "@/lib/store";
export const dynamic="force-dynamic";
export default async function StartupProfilePage({params}:{params:Promise<{id:string}>}){const {id}=await params;const startup=getData().startups.find(s=>s.id===id);if(!startup)notFound();return <ProfileEditor startup={startup}/>;}

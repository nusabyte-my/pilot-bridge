import { PocWorkspace } from "@/components/poc-workspace";
import { getData } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function PocPage({searchParams}:{searchParams:Promise<{id?:string}>}){const {id}=await searchParams;return <PocWorkspace data={getData()} pocId={id}/>;}

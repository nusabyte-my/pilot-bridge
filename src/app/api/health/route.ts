import { NextResponse } from "next/server";
import { getData } from "@/lib/store";
export const dynamic="force-dynamic";
export function GET(){try{const data=getData();return NextResponse.json({status:"ok",challenges:data.challenges.length,pocs:data.pocs.length});}catch{return NextResponse.json({status:"error"},{status:503});}}

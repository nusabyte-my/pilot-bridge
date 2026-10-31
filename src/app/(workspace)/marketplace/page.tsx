import { MarketplaceWorkspace } from "@/components/marketplace-workspace";
import { getData } from "@/lib/store";
export const dynamic="force-dynamic";
export default function MarketplacePage(){return <MarketplaceWorkspace data={getData()}/>;}

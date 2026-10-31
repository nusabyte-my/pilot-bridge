import type { CommercialStage } from "./types";
export const commercialTransitions:Record<CommercialStage,CommercialStage[]>={
  "No decision":["Commercial negotiation","Not proceeding"],
  "Commercial negotiation":["Contract signed","Not proceeding"],
  "Contract signed":[],
  "Not proceeding":[],
};

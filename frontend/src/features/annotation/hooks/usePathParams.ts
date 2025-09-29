import { useParams } from "react-router-dom";
import { AnnotationPhaseType } from "@/features/_utils_";

export const usePathParams = () => {
  return useParams<{ campaignID: string; phaseType?: AnnotationPhaseType; }>();
}
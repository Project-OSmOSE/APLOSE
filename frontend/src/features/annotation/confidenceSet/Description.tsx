import React, { Fragment } from "react";
import { ConfidencesList } from "@/features/annotation/confidence";
import { FadedText } from "@/components/ui";

export const ConfidenceSetDescription: React.FC<{
  name?: string;
  confidenceIndicators?: { results: Array<{ label: string } | null> } | null
}> = ({ name, confidenceIndicators }) => {
  if (!name) return <div>
    <FadedText>Confidence indicator set</FadedText>
    <p>No confidence</p>
  </div>

  return <Fragment>
    <div>
      <FadedText>Confidence indicator set</FadedText>
      <p>{ name }</p>
    </div>
    <div><ConfidencesList results={ confidenceIndicators?.results }/></div>
  </Fragment>
}
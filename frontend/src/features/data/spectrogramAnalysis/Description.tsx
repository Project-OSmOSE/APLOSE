import React, { Fragment } from "react";
import { FadedText } from "@/components/ui";

export const SpectrogramAnalysisList: React.FC<{
  results?: Array<{ name: string } | null>
}> = ({ results }) => {
  if (!results) return <Fragment/>

  return <Fragment>
    <FadedText>Spectrogram analysis</FadedText>
    <p>{ results.filter(a => a !== null).map(a => a.name).join(', ') }</p>
  </Fragment>
}
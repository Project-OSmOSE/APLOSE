import React, { Fragment } from "react";
import { FadedText } from "@/components/ui";
import { pluralize } from "@/service/function.ts";

export const ConfidencesList: React.FC<{
  results?: Array<{ label: string } | null>
}> = ({ results }) => {
  if (!results) return <Fragment/>

  return <Fragment>
    <FadedText>Confidence{ pluralize(results) }</FadedText>
    <p>{ results.filter(i => i !== null).map(i => i.label).join(', ') }</p>
  </Fragment>
}
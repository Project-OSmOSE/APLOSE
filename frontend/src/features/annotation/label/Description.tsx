import React, { Fragment } from "react";
import { FadedText } from "@/components/ui";
import { pluralize } from "@/service/function.ts";

export const LabelsList: React.FC<{
  results?: Array<{ name: string } | null>,
  labeled?: true,
}> = ({ results, labeled }) => {
  if (!results) return <Fragment/>
  if (results.length === 0) return <Fragment>
    { labeled && <FadedText>Label{ pluralize(results) }</FadedText> }
    <p>No labels</p>
  </Fragment>

  return <Fragment>
    { labeled && <FadedText>Label{ pluralize(results) }</FadedText> }
    <p>{ results.filter(i => i !== null).map(i => i.name).join(', ') }</p>
  </Fragment>
}
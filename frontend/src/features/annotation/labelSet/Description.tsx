import React, { Fragment } from "react";
import { FadedText } from "@/components/ui";
import { LabelsList } from "@/features/annotation/label";

export const LabelSetDescription: React.FC<{
  name?: string,
  description?: string | null,
  labels?: {
    results: Array<{ name: string } | null>
  } | null
}> = ({ name, description, labels }) => {
  if (!name) return <div>
    <FadedText>Label set</FadedText>
    <p>No label set</p>
  </div>

  return <Fragment>
    <div>
      <FadedText>Label set</FadedText>
      <p>{ name }</p>
      { description && <p>{ description }</p> }
    </div>
    <div><LabelsList results={ labels?.results } labeled/></div>
  </Fragment>
}
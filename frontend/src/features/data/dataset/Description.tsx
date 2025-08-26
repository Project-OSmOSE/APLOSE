import React, { Fragment } from "react";
import { FadedText, Link } from "@/components/ui";

export const DatasetName: React.FC<{
  name: string
  id?: number | string
  labeled?: true
  link?: true
}> = ({ name, id, labeled, link }) => {
  if (link && id) return <Fragment>
    { labeled && <FadedText>Dataset</FadedText> }
    <Link appPath={ `/dataset/${ id }` } color='primary'>{ name }</Link>
  </Fragment>

  return <div>
    { labeled && <FadedText>Dataset</FadedText> }
    <p>{ name }</p>
  </div>
}
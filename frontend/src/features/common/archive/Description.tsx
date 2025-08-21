import React, { Fragment } from "react";
import { FadedText } from "@/components/ui";
import { dateToString } from "@/service/function.ts";

export const ArchiveDescription: React.FC<{
  date?: any
  byUser?: { displayName?: string | null } | null
}> = ({ date, byUser }) => {
  if (!date) return <Fragment/>
  return <FadedText>
    Archive on { dateToString(date) } by { byUser?.displayName }
  </FadedText>
}
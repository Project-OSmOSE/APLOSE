import React from "react";
import { ActionBar } from "@/components/layout";
import { useCampaignFilters } from "@/service/slices/filter.ts";
import { AnnotatorFilter, ArchiveFilter, OwnerFilter, PhaseTypeFilter, ResetButton } from "./filters";
import { CreateLink } from "./CreateLink.tsx";

export const ListActionBar: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()

  return <ActionBar search={ params.search }
                    searchPlaceholder="Search campaign name"
                    onSearchChange={ search => updateParams({ search }) }
                    actionButton={ <CreateLink/> }>
    <AnnotatorFilter/>
    <ArchiveFilter/>
    <PhaseTypeFilter/>
    <OwnerFilter/>
    <ResetButton/>
  </ActionBar>
}

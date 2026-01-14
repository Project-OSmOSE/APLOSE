import { OntologyGqlAPI } from "./api";
import { useMemo } from "react";

const {
  getAllSources,
  getDetailedSourceByID,
  deleteSource,
  createSource,
  updateSource,

  getAllSounds,
  getDetailedSoundByID,
  deleteSound,
  createSound,
  updateSound,
} = OntologyGqlAPI.endpoints

export const useAllSources = ({ skip }: { skip: boolean } = { skip: false }) => {
  const info = getAllSources.useQuery({}, { skip });
  return useMemo(() => ({
    ...info,
    allSources: info.data?.allSources?.results.filter(s => s !== null)
  }), [ info ]);
}

export const useSourceCRUD = () => {
  const [ create ] = createSource.useMutation();
  const [ update ] = updateSource.useMutation();
  const [ remove ] = deleteSource.useMutation();
  return { create, update, remove }
}

export const useSource = ({ id, skip }: { id?: string, skip: boolean } = { skip: false }) => {
  const info = getDetailedSourceByID.useQuery({ id: id ?? '' }, { skip: !id || skip });
  return useMemo(() => ({ ...info, source: info.data?.sourceById }), [ info ])
}

export const useAllSounds = ({ skip }: { skip: boolean } = { skip: false }) => {
  const info = getAllSounds.useQuery({}, { skip });
  return useMemo(() => ({
    ...info,
    allSounds: info.data?.allSounds?.results.filter(s => s !== null)
  }), [ info ]);
}
export const useSoundCRUD = () => {
  const [ create ] = createSound.useMutation();
  const [ update ] = updateSound.useMutation();
  const [ remove ] = deleteSound.useMutation();
  return { create, update, remove }
}

export const useSound = ({ id, skip }: { id?: string, skip: boolean } = { skip: false }) => {
  const info = getDetailedSoundByID.useQuery({ id: id ?? '' }, { skip: !id || skip });
  return useMemo(() => ({ ...info, sound: info.data?.soundById }), [ info ])
}
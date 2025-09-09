export type _Analysis = {
  name: string,
  path: string,
}

export type _Dataset = _Analysis & {
  legacy?: boolean | null
  analysis: _Analysis[]
}

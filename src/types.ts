interface ITimestamp {
  id: string
  layerId: string,
  actualDate: string,
  gisUrl: string,
  timeDescription?: string | null,
}

export type Timestamps = Record<string, Record<string, ITimestamp>>
/*
id: atek.cloud/adb-ctrl-api
type: api
title: Atek Database System Control API
*/

export default interface AdbCtrlApi {
  init (settings: AdbSettings): Promise<void>
  getConfig (): Promise<AdbSettings>
}

export interface AdbSettings {
  serverDbId: string
}
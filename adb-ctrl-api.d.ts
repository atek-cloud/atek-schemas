/*
id: atek.cloud/adb-ctrl-api
type: api
title: Atek DataBase System Control API
*/

export default interface AdbCtrlApi {
  getServerDatabaseId (): Promise<string>
}
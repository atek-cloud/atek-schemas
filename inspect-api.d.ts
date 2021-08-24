/*
id: atek.cloud/inspect-api
type: api
title: Atek Inspection API
description: General debugging information for an endpoint
*/

export default interface InspectApi {
  isReady (): Promise<boolean>
  getConfig (): Promise<object>
}
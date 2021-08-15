/*
id: atek.cloud/database
type: adb-record
title: Database
description: Settings and cached state for a database.
templates:
  table:
    title: Databases
    description: Settings and cached state for databases.
  record:
    key: "{{/dbId}}"
    title: "Database ID: {{/dbId}}"
*/

export default interface Database {
  dbId: string
  cachedMeta?: {
    displayName?: string
    writable?: boolean
  }
  network?: {
    access?: NetworkAccess
  }
  services?: ServiceConfig[]
  createdBy?: {
    accountId?: string
    serviceId?: string
  }
  createdAt: Date
}

export interface ServiceConfig {
  serviceId: string
  alias?: string
  persist?: boolean
  presync?: boolean
}

export enum NetworkAccess {
  private = 'private',
  public = 'public'
}
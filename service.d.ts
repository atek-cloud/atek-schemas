/*
id: atek.cloud/service
type: adb-record
title: Service
description: Service installed to a host environment.
templates:
  table:
    title: Services
    description: Services installed to the host environment.
  record:
    key: "{{/id}}"
    title: "Service \"{{/id}}\", source: {{/sourceUrl}}"
*/

export default interface Service {
  id: string // pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
  port: number
  sourceUrl: URL
  desiredVersion?: string
  package: {
    sourceType: SourceTypeEnum
    installedVersion?: string
    title?: string
  }
  manifest?: {
    name?: string
    description?: string
    author?: string
    license?: string
  }
  system: {
    appPort: number
  }
  installedBy: string //  pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
}

export enum SourceTypeEnum {
  file = 'file',
  git = 'git'
}
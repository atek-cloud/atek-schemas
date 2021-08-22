# Atek Schemas

This is a working directory of the Atek project's core schemas.

## account-session-api.d.ts

```typescript
/*
id: atek.cloud/account-session-api
type: api
title: Account Session API
description: This API is used by the host environment to manage HTTP sessions with the GUI.
*/

export default interface AccountSessionApi {
  // Get the user account attached to the current session cookie.
  whoami (): Promise<WhoamiResponse>

  // Create a new session.
  login (opts: {username: string, password: string}): Promise<void>

  // Destroy the current session.
  logout (): Promise<void>
}

interface WhoamiResponse {
  hasSession: boolean
  account?: {
    id: string
    username: string
  }
}
```

## account-session.d.ts

```typescript
/*
id: atek.cloud/account-session
type: adb-record
title: Account Session
description: Internal record of a session with a user account.

templates:
  table:
    title: "Accounts Sessions"
    description: "Internal records of sessions with user accounts."
  record:
    key: "{{/sessionId}}"
    title: "Session for {{/username}} created at {{/createdAt}}"
*/

export default interface AccountSession {
  sessionId: string
  accountId: string
  createdAt: Date
}
```

## account.d.ts

```typescript
/*
id: atek.cloud/account
type: adb-record
title: Account
description: Internal record of user account registration.
templates:
  table:
    title: "Accounts"
    description: "Internal records of user account registrations."
  record:
    key: "{{/username}}"
    title: "System account: {{/username}}"
*/

export default interface Account {
  username: string
  hashedPassword: string
  role: Role
}

export enum Role {
  none = '',
  admin = 'admin'
}

```

## accounts-api.d.ts

```typescript
/*
id: atek.cloud/accounts-api
type: api
title: Accounts API
*/

export default interface AccountsApi {
  // Create a new user account.
  create (opts: {username: string, password: string}): Promise<Account>

  // List all user accounts.
  list (): Promise<Account[]>

  // Get a user account by its ID.
  get (id: string): Promise<Account>

  // Get a user account by its username.
  getByUsername (username: string): Promise<Account>
  
  // Delete a user account.
  delete (id: string): Promise<void>
}


export interface Account {
  id: string
  username: string
}
```

## adb-api.d.ts

```typescript
/*
id: atek.cloud/adb-api
type: api
title: Atek DataBase API
*/

export default interface AdbApi {
  // Get metadata and information about a database.
  describe (dbId: string): Promise<DbDescription>

  // Register a table's schema and metadata. 
  table (dbId: string, tableId: string, desc: TableSettings): Promise<TableDescription>

  // List records in a table.
  list (dbId: string, tableId: string, opts?: ListOpts): Promise<{records: Record[]}>

  // Get a record in a table.
  get (dbId: string, tableId: string, key: string): Promise<Record>

  // Add a record to a table.
  create (dbId: string, tableId: string, value: object, blobs?: BlobMap): Promise<Record>

  // Write a record to a table.
  put (dbId: string, tableId: string, key: string, value: object): Promise<Record>
  
  // Delete a record from a table.
  delete (dbId: string, tableId: string, key: string): Promise<void>
  
  // Enumerate the differences between two versions of the database.
  diff (dbId: string, opts: {left: number, right?: number, tableIds?: string[]}): Promise<Diff[]>

  // Get a blob of a record.
  getBlob (dbId: string, tableId: string, key: string, blobName: string): Promise<Blob>
  
  // Write a blob of a record.
  putBlob (dbId: string, tableId: string, key: string, blobName: string, blobValue: BlobDesc): Promise<void>
  
  // Delete a blob of a record.
  delBlob (dbId: string, tableId: string, key: string, blobName: string): Promise<void>

  // Listen for changes to a database.
  subscribe (dbId: string, opts?: {tableIds?: string[]}): DbSubscription
}

export interface DbSubscription {
  emit (name: 'change', evt: Diff)
}

export interface DbDescription {
  dbId: string
  dbType: string
  displayName?: string
  tables: TableDescription[]
}

export interface TableTemplates {
  table?: {
    title?: string
    description?: string
  },
  record?: {
    key?: string
    title?: string
    description?: string
  }
}

export interface TableSettings {
  revision?: number
  templates?: TableTemplates
  definition?: object
}

export interface TableDescription extends TableSettings {
  tableId: string
}

export interface Record {
  key: string
  path: string
  url: string
  seq?: number
  value: object | null | undefined
}

export interface BlobMap {
  [blobName: string]: BlobDesc
}

export interface BlobDesc {
  mimeType?: string
  buf: Uint8Array
}

export interface Blob {
  start: number
  end: number
  mimeType?: string
  buf: Uint8Array
}

export interface Diff {
  left: Record
  right: Record
}

export interface ListOpts {
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  limit?: number
  reverse?: boolean
}
```

## adb-ctrl-api.d.ts

```typescript
/*
id: atek.cloud/adb-ctrl-api
type: api
title: Atek DataBase System Control API
*/

export default interface AdbCtrlApi {
  getServerDatabaseId (): Promise<string>
}
```

## database.d.ts

```typescript
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
```

## hypercore-api.d.ts

```typescript
/*
id: atek.cloud/hypercore-api
type: api
title: Hypercore API
*/

export default interface HypercoreApi {
  // Create a new hypecore
  create (): Promise<CreateResponse>

  // Return information about a hypercore.
  describe (key: Uint8Array): Promise<DescribeResponse>

  // Append a block or array of blocks to the hypercore.
  append (key: Uint8Array, data: Uint8Array|Uint8Array[]): Promise<number>

  // Get a block of data from the feed.
  get (key: Uint8Array, index: number, options?: GetOptions): Promise<Uint8Array>

  // Cancel a `get()` operation.
  cancel (key: Uint8Array, getcallId: string): Promise<void>

  // Check if the feed has a specific block.
  has (key: Uint8Array, index: number): Promise<boolean>

  // Select a range to be downloaded.
  download (key: Uint8Array, start?: number, end?: number, options?: DownloadOptions): Promise<void>

  // Cancel a `download()` operation.
  undownload (key: Uint8Array, downloadcallId: string): Promise<void>

  // Returns total number of downloaded blocks within range. If `end` is not specified it will default to the total number of blocks. If `start` is not specified it will default to 0.
  downloaded (key: Uint8Array, start?: number, end?: number): Promise<number>

  // Fetch an update for the feed.
  update (key: Uint8Array, options: UpdateOptions): Promise<void>

  // Seek to a byte offset. Responds with `index` and `relativeOffset`, where index is the data block the byteOffset is contained in and relativeOffset is the relative byte offset in the data block.
  seek (key: Uint8Array, byteOffset: number): Promise<SeekResponse>

  // Configure the networking behavior for a specific hypercore.
  configureNetwork (key: Uint8Array, options: ConfigureNetworkOptions): Promise<void>

  // Subscribe to events for a particular hypercore.
  subscribe (key?: Uint8Array): HypercoreSubscription | GlobalSubscription
}

export interface HypercoreSubscription {
  emit (name: 'append', evt: {key: Uint8Array, length: number, byteLength: number})
  emit (name: 'close', evt: {key: Uint8Array})
  emit (name: 'peer-add', evt: {key: Uint8Array, id: number, peer: Peer})
  emit (name: 'peer-remove', evt: {key: Uint8Array, id: number, peer: Peer})
  emit (name: 'wait', evt: {key: Uint8Array})
  emit (name: 'download', evt: {key: Uint8Array, seq: number, byteLength: number})
  emit (name: 'upload', evt: {key: Uint8Array, seq: number, byteLength: number})
}

export interface GlobalSubscription {
  emit (name: 'peer-add', evt: {id: number, peer: Peer}): void
  emit (name: 'peer-remove', evt: {id: number, peer: Peer}): void
}

export interface CreateResponse {
  key: Uint8Array
  discoveryKey: Uint8Array
  writable: boolean
  length: number
  byteLength: number
}

export interface DescribeResponse {
  key: Uint8Array
  discoveryKey: Uint8Array
  writable: boolean
  length: number
  byteLength: number
}

export interface GetOptions {
  ifAvailable: boolean
  wait: boolean
  // A UUID used to describe this call, to be passed into cancel(). Must be unique.
  callId: boolean
}

export interface DownloadOptions {
  // A UUID used to describe this call, to be passed into undownload(). Must be unique.
  callId: string
}

export interface UpdateOptions {
  minLength: number
  ifAvailable: boolean
  hash: boolean
}

export interface SeekResponse {
  index: number
  relativeOffset: number
}

export interface ConfigureNetworkOptions {
  // Should we find peers?
  lookup: boolean
  // Should we announce ourself as a peer?
  announce: boolean
  // Wait for the full swarm flush before returning?
  flush: boolean
  // Persist this configuration?
  remember: boolean
}

export interface Peer {
  remotePublicKey: Uint8Array
  remoteAddress: string
  type: string
}

```

## ping-api.d.ts

```typescript
/*
id: atek.cloud/ping-api
type: api
title: Ping API
description: Utility API used for debugging and testing liveness.
*/

export default interface PingApi {
  // Ask for a pong back with the given parameter
  ping (param: number): Promise<number>
}


```

## service.d.ts

```typescript
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
  manifest?: ServiceManifest
  system: {
    appPort: number
  }
  installedBy: string //  pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
}

export interface ServiceManifest {
  runtime?: RuntimeEnum
  name?: string
  description?: string
  author?: string
  license?: string
  exports?: ApiExportDesc[]
}

export interface ApiExportDesc {
  api: string
  path?: string
}

export enum RuntimeEnum {
  deno = 'deno',
  node = 'node'
}

export enum SourceTypeEnum {
  file = 'file',
  git = 'git'
}
```

## services-api.d.ts

```typescript
/*
id: atek.cloud/services-api
type: api
title: Services Control and Management API
*/

// import ServiceRecord from './service' TODO add support for imports

export default interface ServicesApi {
  // List all installed services.
  list (): Promise<{services: ServiceInfo[]}>

  // Fetch information about an installed service.
  get (id: string): Promise<ServiceInfo>

  // Install a new service.
  install (opts: InstallOpts): Promise<ServiceInfo>

  // Uninstall a service.
  uninstall (id: string): Promise<void>

  // Change the settings of a service.
  configure (id: string, opts: ConfigureOpts): Promise<void>

  // Start a service process.
  start (id: string): Promise<void>

  // Stop a service process.
  stop (id: string): Promise<void>

  // Restart a service process.
  restart (id: string): Promise<void>

  // Query the source package for software updates.
  checkForPackageUpdates (id: string): Promise<{hasUpdate: boolean, installedVersion: string, latestVersion: string}>

  // Update the service to the highest version which matches "desiredVersion".
  updatePackage (id: string): Promise<{installedVersion: string, oldVersion: string}>

  // Subscribe to the service's stdio log.
  subscribe (id: string): LogSubscription
}

export interface LogSubscription {
  emit(name: 'data', evt: {text: string})
}

export interface ServiceInfo {
  status: StatusEnum
  settings: ServiceRecord
}

export enum StatusEnum {
  inactive = 'inactive',
  active = 'active'
}

export interface InstallOpts {
  sourceUrl: URL
  desiredVersion?: string
  port?: number
}

export interface ConfigureOpts {
  sourceUrl?: URL
  desiredVersion?: string
  port?: number
}

export interface ServiceRecord {
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
```

## system-api.d.ts

```typescript
/*
id: atek.cloud/system-api
type: api
title: System API
description: General management and configuration APIs for a host environment.
*/

export default interface SystemApi {
  // Enumerate information attached to a "bucket" namespace. This can include databases and other buckets.
  getBucket (bucketId: string): Promise<Bucket>
}

export interface Bucket {
  id: string
  type: BucketTypeEnum
  title: string
  items: BucketChild[]
}

export interface BucketChild {
  id: string
  type: BucketTypeEnum
  title: string
}

export enum BucketTypeEnum {
  root = 'bucket:root',
  app = 'bucket:app',
  trash = 'bucket:trash',
  db = 'db'
}

```



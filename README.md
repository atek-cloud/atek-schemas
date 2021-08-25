# Atek Schemas

This is a working directory of the Atek project's core schemas.

## APIs

### Account Session API

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

### Accounts API

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

### Atek Database API

```typescript
/*
id: atek.cloud/adb-api
type: api
title: Atek Database API
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
  value: object
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

### Atek Database System Control API

```typescript
/*
id: atek.cloud/adb-ctrl-api
type: api
title: Atek Database System Control API
*/

export default interface AdbCtrlApi {
  // Initialize the ADB process
  init (config: AdbProcessConfig): Promise<void>
  // Get the ADB process configuration
  getConfig (): Promise<AdbProcessConfig>

  // Create a new database
  createDb (opts: DbSettings): Promise<DbInfo>
  // Get or create a database according to an alias. Database aliases are local to each application.
  getOrCreateDb (alias: string, opts: DbSettings): Promise<DbInfo>
  // Configure a database's settings
  configureDb (dbId: string, config: DbSettings): Promise<void>
  // Get a database's settings
  getDbConfig (dbId: string): Promise<DbSettings>
  // List all databases configured to the calling service
  listDbs (): Promise<DbSettings[]>
}

export interface AdbProcessConfig {
  serverDbId: string
}

export interface DbInfo {
  dbId: string
}

export interface DbSettings {
  type?: DbInternalType
  alias?: string // An alias ID for the application to reference the database.
  displayName?: string // The database's display name.
  tables?: string[] // The database's initial configured tables.
  network?: NetworkSettings // The database's network settings.
  persist?: boolean // Does this application want to keep the database in storage?
  presync?: boolean // Does this application want the database to be fetched optimistically from the network?
}

export interface NetworkSettings {
  access?: string
}

export enum DbInternalType {
  HYPERBEE = 'hyperbee'
}
```

### Hypercore API

```typescript
/*
id: atek.cloud/hypercore-api
type: api
transport: proxy
title: Hypercore API
*/

```

### Atek Inspection API

```typescript
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
```

### Ping API

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

### Services Control and Management API

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
  id?: string
  desiredVersion?: string
  port?: number
}

export interface ConfigureOpts {
  id?: string
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
  installedBy: string //  pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
}

export enum SourceTypeEnum {
  file = 'file',
  git = 'git'
}
```

### System API

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



## DB Tables

### Account Session

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

### Account

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

### Database

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
    serviceKey?: string
  }
  createdAt: Date
}

export interface ServiceConfig {
  serviceKey: string
  alias?: string
  persist?: boolean
  presync?: boolean
}

export enum NetworkAccess {
  private = 'private',
  public = 'public'
}
```

### Service

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
  config?: ServiceConfig
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
  transport?: ApiTransportEnum
}

export interface ServiceConfig {
  [key: string]: string
}

export enum RuntimeEnum {
  deno = 'deno',
  node = 'node'
}

export enum SourceTypeEnum {
  file = 'file',
  git = 'git'
}

export enum ApiTransportEnum {
  rpc = 'rpc',
  proxy = 'proxy'
}

```



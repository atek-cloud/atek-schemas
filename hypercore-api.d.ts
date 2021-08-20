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
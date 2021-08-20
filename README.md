# Atek Schemas

This is a working directory of the Atek project's core schemas. Everything is subject to change.

## Database Records

- Service: Service installed to a host environment.
- Database: Settings and cached state for a database.
- Account: Internal record of user account registration.
- Account Session: Internal record of a session with a user account.

## APIs

- Account Session API
  - `whoami()`
    - Get the user account attached to the current session cookie.
  - `login(opts)`
    - Create a new session.
  - `logout()`
    - Destroys the current session.
- Services Control and Management API
  - `list()`
    - List all installed services.
  - `get(id)`
    - Fetch information about an installed service.
  - `install(opts)`
    - Install a new service.
  - `uninstall(id)`
    - Uninstall a service.
  - `configure(id, opts)`
    - Change the settings of a service.
  - `start(id)`
    - Start a service process.
  - `stop(id)`
    - Stop a service process.
  - `restart(id)`
    - Restart a service process.
  - `checkForPackageUpdates(id)`
    - Query the source package for software updates.
  - `updatePackage(id)`
    - Update the service to the highest version which matches "desiredVersion".
- Accounts API
  - `create(opts)`
    - Create a new user account.
  - `list()`
    - List all user accounts.
  - `get(id)`
    - Get a user account by its ID.
  - `getByUsername(username)`
    - Get a user account by its username.
  - `delete(id)`
    - Delete a user account.
- System API
  - `getBucket(bucketId)`
    - Enumerate information attached to a "bucket" namespace. This can include databases and other buckets.
- Atek DataBase API
  - `describe(dbId)`
    - Get metadata and information about a database.
  - `list(dbId, tableId)`
    - List records in a table.
  - `get(dbId, tableId, key)`
    - Get a record in a table.
  - `create(dbId, tableId, value, blobs)`
    - Add a record to a table.
  - `put(dbId, tableId, key, value)`
    - Write a record to a table.
  - `delete(dbId, tableId, key)`
    - Delete a record from a table.
  - `diff(dbId, opts)`
    - Enumerate the differences between two versions of the database.
  - `getBlob(dbId, tableId, key, blobName)`
    - Get a blob of a record.
  - `putBlob(dbId, tableId, key, blobName, value)`
    - Write a blob of a record.
  - `delBlob(dbId, tableId, key, blobName)`
    - Delete a blob of a record.
- Hypercore API
  - `create()`
    - Create a new hypercore.
  - `describe(key)`
    - Return information about a hypercore.
  - `append(key, data)`
    - Append a block or array of blocks to the hypercore.
  - `get(key, index, options)`
    - Get a block of data from the feed.
  - `cancel(key, getCallId)`
    - Cancel a `get()` operation.
  - `has(key, index)`
    - Check if the feed has a specific block.
  - `download(key, start, end, options)`
    - Select a range to be downloaded.
  - `undownload(key, downloadCallId)`
    - Cancel a `download()` operation.
  - `downloaded(key, start, end)`
    - Returns total number of downloaded blocks within range. If `end` is not specified it will default to the total number of blocks. If `start` is not specified it will default to 0.
  - `update(key, opts)`
    - Fetch an update for the feed.
  - `seek(key, byteOffset)`
    - Seek to a byte offset. Responds with `index` and `relativeOffset`, where index is the data block the byteOffset is contained in and relativeOffset is the relative byte offset in the data block.
  - `configureNetwork(key, opts)`
    - Configure the networking behavior for a specific hypercore.


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
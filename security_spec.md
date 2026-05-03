# Security Specification: CivicGuide AI

## Data Invariants
1. A user profile (`/users/{userId}`) can only be created and managed by the owner of that UID.
2. Quiz results (`/quiz_results/{resultId}`) must be attributed to the authenticated user.
3. Users cannot modify their own `createdAt` timestamp after creation.
4. Emails must be verified for writing results.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempt to create a user profile with a UID that doesn't match `request.auth.uid`.
2. **State Shortcutting**: Attempt to update `score` in `quiz_results` without updating the `timestamp`.
3. **Ghost Fields**: Adding `isAdmin: true` to a user profile.
4. **ID Poisoning**: Using a 2KB string as a `userId`.
5. **PII Leak**: Unauthenticated user trying to `get` a user profile by UID.
6. **Immutable Violation**: Trying to change the `createdAt` of a user profile.
7. **Type Mismatch**: Sending `score` as a string instead of an integer.
8. **Size Violation**: Sending a 500-character `displayName`.
9. **Query Scraping**: Authenticated user trying to `list` all quiz results without a filter for their own `userId`.
10. **Auth Bypass**: Attempt to create a profile while `request.auth.token.email_verified` is false.
11. **Shadow Update**: Updating `displayName` while also trying to change `email` (which should be immutable or strictly controlled).
12. **Orphaned Record**: Creating a quiz result for a user that doesn't exist (relational check).

## The Test Plan
The `firestore.rules` will be validated to ensure all the above payloads result in `PERMISSION_DENIED` unless they meet the exact criteria.

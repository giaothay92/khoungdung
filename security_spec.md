# Security Specification: Community Educational App Hub

This document defines the security boundaries, data invariants, and adversarial test scenarios for the Firestore collections of our community application directory.

## 1. Data Invariants

1. **User Profiles (`/users/{userId}`)**:
   - Only the authenticated user matching `userId` can read or write their own profile document.
   - Users cannot edit their own `role` or escalate their permissions.
   - Profile must contain matching Auth email and basic social profile metrics.

2. **Apps Directory (`/apps/{appId}`)**:
   - Any visitor (auth or unauthenticated) can read (`get` and `list`) the list of applications.
   - Only authenticated users can contribute (`create`) an app.
   - An app's `contributorUID` must match the authenticated user's ID (`request.auth.uid`).
   - App owners can update their own apps, but they cannot change the `contributorUID`, `createdAt`, or arbitrary system properties.
   - App owners are forbidden from updating `likesCount` freely, unless it strictly follows atomic increase mechanisms (like transaction limits if implemented), or is handled via separate secure operations.
   - Deletion of an app is restricted to the original contributor or an admin.

---

## 2. The "Dirty Dozen" Payloads (Rogue Payloads)

Here are the 12 rogue payloads designed to break our database invariants, which our Firestore rules must synchronously block:

1. **Self-Escalation**: User attempting to register as an admin inside their user profile.
2. **Identity Spoofing on User Profile**: Modifying another user's profile document with a mismatched auth ID.
3. **Ghost App Creator**: Creating an app where `contributorUID` is set to another user's identity.
4. **Forged CreatedAt Timestamp on Register**: Providing a back-dated or future `createdAt` value instead of the server timestamp (`request.time`).
5. **No Size Bound Poisoning**: Submit an incredibly long app name (e.g. 10KB) to exceed storage limits.
6. **Bypassing Category Enum**: Setting the app's category to a nonexistent subject `english_literature` instead of standard enums (`toan` | `tieng_viet` | `khoa_hoc` | `khac`).
7. **Bypassing Audience Enum**: Contributing an app with an invalid target audience like `unrestricted_bots`.
8. **Malformed Document ID Injection**: Attempting to create an app with document ID containing illegal characters or of excessive size (e.g., `appId` with symbol characters or length > 128).
9. **Tampering with Immortal Fields (Update App)**: Updating an existing app and changing its unmodifiable fields like `createdAt` or the original `contributorUID`.
10. **Unauthenticated Contribution**: An unauthenticated member trying to create an app.
11. **Blanket Query Scraping Bypass**: Querying lists without checking query filters, or blanket write access.
12. **Malicious likesCount Spoofing**: Overwriting `likesCount` with a negative number or extremely high bogus integer.

---

## 3. Test Runner Design (`firestore.rules.test.ts`)

In actual deployment, rules are covered by the unit testing suite in CLI, validating that all rogue attempts return `PERMISSION_DENIED`.
Below is the draft structure mapping out these test validations:

```typescript
// Test assertions for security
describe("Firestore Rules: Education Community Hub", () => {
  it("locks user profiles to the matching UID", async () => {
    // Assert write returns PERMISSION_DENIED on mismatched UID
  });
  
  it("prohibits unauthenticated users from creating apps", async () => {
    // Assert create returns PERMISSION_DENIED
  });

  it("forces app contributorUID to equal auth uid", async () => {
    // Assert create with fake UID returns PERMISSION_DENIED
  });
});
```

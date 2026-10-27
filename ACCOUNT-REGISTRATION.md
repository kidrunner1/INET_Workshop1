# Registration profile fields

POST /api/v1/register now requires firstName, lastName and email alongside username/password.
Phone is optional. New accounts remain user/pending and still require admin approval to log in.

- Names: trimmed, 1–80 characters each. No ASCII-only name restriction.
- Email: validated, trimmed, lowercase, at most 254 characters; duplicate signup returns 409.
- Phone: removes spaces, parentheses and hyphens; 8–15 digits, optional leading +.
- Username: trimmed, 3–50 characters, existing uniqueness rule preserved.
- New passwords: minimum 8 characters and maximum 72 UTF-8 bytes; never trimmed.
  See https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns for bcrypt's byte limit.
- The partial unique email index excludes documents without email. Server startup waits for
  user indexes; no existing users are backfilled, deleted or required to reset passwords.
- Validation middleware now forwards normalized body values to controllers.
- Registration/login/admin list/admin approval responses include profile fields, never passwords.
- New accounts always get role=user and status=pending; those fields cannot be supplied by clients.

Existing accounts can log in and be approved without these new fields. Registration is the only
API requiring profile fields. No email ownership verification, reset-email delivery or profile-edit
endpoint is introduced. Admin approval does not verify ownership of the supplied email/phone.
No tests, builds, lint or synthetic user registrations were run, per user preference.

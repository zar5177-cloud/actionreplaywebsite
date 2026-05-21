# ASAP Manual Setup

This is the exact checklist for what the owner must do manually so AI operators can run the Action Replay ecosystem safely.

Agents can draft, analyze, queue, summarize, and prepare. The owner manually grants access, approves external actions, and controls accounts.

## 0. Open These Tabs

Core Meta:

- Meta Business Suite: https://business.facebook.com/latest/home/
- Meta Business Settings: https://business.facebook.com/settings/
- People: https://business.facebook.com/settings/people/
- Pages: https://business.facebook.com/settings/pages/
- Instagram Accounts: https://business.facebook.com/settings/instagram-accounts/
- Business Assets: https://business.facebook.com/settings/assets/

Instagram:

- Instagram login: https://www.instagram.com/accounts/login/
- Instagram signup: https://www.instagram.com/accounts/emailsignup/
- Instagram Accounts Center: https://accountscenter.instagram.com/

Meta developer/API:

- Meta for Developers apps: https://developers.facebook.com/apps/
- Instagram Platform docs: https://developers.facebook.com/docs/instagram-platform/
- Instagram API Postman collection by Meta: https://www.postman.com/meta/workspace/instagram/documentation/23987686-9386f468-7714-490f-9bfc-9442db5c8f00
- Graph API Explorer: https://developers.facebook.com/tools/explorer/
- Access Token Debugger: https://developers.facebook.com/tools/debug/accesstoken/
- App Review docs: https://developers.facebook.com/docs/app-review/

Password manager:

- 1Password: https://1password.com/sign-up
- Bitwarden: https://bitwarden.com/products/business/

## 1. Set The Vault First

Do this before account creation.

1. Open 1Password or Bitwarden.
2. Create a shared vault named:
   `Action Replay / Access`
3. Create an item:
   `AR Mailbox Primary`
4. Create an item:
   `AR Recovery Phone`
5. Turn on 2FA for the password manager itself.
6. Add a second emergency admin if available.

Send back:

```text
VAULT READY
provider:
vault name:
primary recovery email:
recovery phone ending:
backup admin yes/no:
```

Do not send passwords.

## 2. Confirm Business Spine

1. Go to https://business.facebook.com/latest/home/
2. Select or create the Action Replay business portfolio.
3. Go to https://business.facebook.com/settings/
4. Confirm the business name is Action Replay or the legal owner entity.
5. Go to https://business.facebook.com/settings/people/
6. Confirm your personal Facebook account has full control/admin.
7. Add one backup admin if possible.
8. Require 2FA if Business Settings gives the option.

Send back:

```text
META BUSINESS READY
business portfolio name:
business portfolio id:
primary admin:
backup admin yes/no:
2FA required yes/no:
```

## 3. Create Or Confirm Facebook Page

Many Meta/Instagram management workflows require a Page connected to the Instagram professional account.

1. Go to https://business.facebook.com/settings/pages/
2. Add or create the Page:
   `Action Replay`
3. Make sure the Page belongs to the Action Replay business portfolio.
4. Make sure your admin account has full control.

Send back:

```text
PAGE READY
page name:
page url:
page id if visible:
owned by business yes/no:
```

## 4. Prepare Main Instagram Account

For `@shopactionreplay`:

1. Log into Instagram manually: https://www.instagram.com/accounts/login/
2. In Instagram app, switch to a professional account if it is not already:
   Settings and activity -> Account type and tools -> Switch to professional account.
3. Choose Business or Creator. For commerce/operator tooling, Business is usually cleaner.
4. Enable 2FA.
5. Save login/password/TOTP/backup codes in `Action Replay / Access`.
6. Go to https://business.facebook.com/settings/instagram-accounts/
7. Click Add.
8. Add `@shopactionreplay`.
9. Connect it to the Action Replay Page if prompted.
10. Confirm it appears under the business portfolio.

Send back:

```text
MAIN IG READY
handle:
professional account yes/no:
business or creator:
connected to business portfolio yes/no:
connected to page yes/no:
2FA on yes/no:
instagram account id if visible:
```

## 5. Create Brand-Owned Side Accounts

Create slowly. Do not bulk-create all in one minute. Use real recovery info and the vault.

Planned brand-owned accounts:

- `replay_recovered`
- `override_monthly`
- `slotb_testers`
- `memorycard_err`
- `unlock_log_txt`
- `bbs_mirror_2007`

For each:

1. Go to https://www.instagram.com/accounts/emailsignup/
2. Create the account manually.
3. Use a unique email alias/mailbox.
4. Generate password in the password manager.
5. Enable 2FA.
6. Save backup codes.
7. Fill bio/profile manually.
8. Do not post immediately from every account.
9. Add to Meta Business only after the profile is stable:
   https://business.facebook.com/settings/instagram-accounts/

Suggested creation order:

1. `replay_recovered`
2. `unlock_log_txt`
3. `memorycard_err`
4. `slotb_testers`
5. `bbs_mirror_2007`
6. `override_monthly`

Send back for each:

```text
SIDE IG READY
handle:
email alias label only:
professional account yes/no:
connected to business portfolio yes/no:
2FA on yes/no:
vault item created yes/no:
notes:
```

## 6. Do Not Take Model Passwords

For models/members, use collab/repost access instead.

Send them this:

```text
Can you post from your own account instead of giving me login? Way better.

If you are down, I’ll send 3 caption options and you can edit/post however you want. If Action Replay reposts it, credit/tag stays on unless you tell me otherwise. You can ask me to remove it anytime.
```

If they post, ask for:

- tag `@shopactionreplay`
- collab invite if they want
- permission to repost
- screenshot of insights after 24h if they are comfortable

Send me:

```text
MODEL/MEMBER READY
handle:
posting yes/no:
collab post yes/no:
repost permission yes/no:
asset folder/screenshot path:
caption tone:
```

## 7. Create Meta Developer App

This is for official API-based operations later.

1. Go to https://developers.facebook.com/apps/
2. Create app.
3. App type/use case: business/Instagram management if offered.
4. Name:
   `Action Replay Operator`
5. Add Instagram product/API setup.
6. In App Settings -> Basic, copy:
   - App ID
   - App Secret
7. Put them in `.env.local`, not chat:

```bash
META_APP_ID=
META_APP_SECRET=
META_BUSINESS_ID=
```

8. In development mode, add your Facebook/Meta user as admin/tester.
9. Connect test Instagram professional account.
10. Later, request permissions needed for the exact workflows:
    - basic profile/account metadata
    - content publishing
    - comment management
    - message management only if you genuinely need DM handling
    - insights/analytics

Send back:

```text
META APP READY
app name:
app id:
business id:
instagram product added yes/no:
test user added yes/no:
privacy policy url needed yes/no:
terms url needed yes/no:
```

Do not send the App Secret.

## 8. Export / Screenshot The Current Instagram State

Do this for `@shopactionreplay` first.

Capture:

- profile screenshot
- last 30 days overview
- top posts/reels
- audience demographics
- active times
- profile activity
- website taps
- recent comments on top 10 posts
- recent DMs that need replies, with private info hidden
- tagged posts / mentions

Put files in:

`ops/social/exports/`

This folder is gitignored.

Send me:

```text
IG EXPORT READY
folder path:
screenshots included:
top concern:
urgent replies yes/no:
```

## 9. What Agents Do Immediately After Each Manual Step

After vault is ready:

- update account inventory refs
- create account status board

After main IG is connected:

- create daily command queue
- draft reply bank for live comments
- create story sequence for tonight

After side accounts exist:

- assign voice rules
- create first 7 posts each
- create safe staggered posting plan

After model/member assets arrive:

- create caption packets
- create repost/story versions
- log usage permissions

After Meta app exists:

- scaffold API token checklist
- prepare webhook/app-review checklist
- map API scopes to allowed workflows

After screenshots/exports arrive:

- analyze performance
- triage comments
- draft replies
- identify sales blockers
- build next 48h posting queue

## Hard Stops

Do not proceed if:

- account asks for selfie/video verification and you are rushing
- Meta says the account belongs to another business portfolio
- 2FA backup codes are not saved
- a model/member offers login instead of permission
- any agent asks for raw password/session cookie
- Instagram flags suspicious login

Pause, document the exact screen, and continue carefully.

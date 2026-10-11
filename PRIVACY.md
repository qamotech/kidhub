# 🛡️ Privacy & local data

KidHub is a static browser application. The Art Studio additions do not introduce an account service, image-upload endpoint, analytics service, or backend database.

## 💾 What stays in the browser

The inherited `kidHubV3` local-storage record holds profile preferences, activity progress, and small gallery previews. Artwork on the live canvas is not a durable project file. Local image imports use temporary browser object URLs, which are revoked after decoding or an import error. PNG exports are downloaded through the browser.

## 🌐 External requests

The optional Cloud widget stores contacts, email addresses or aliases, an HTTPS webhook URL, reminders, settings, and recent message history under `kidHubCloud`. With no destination configured, messages stay on the device. When a grown-up configures email, sending contacts FormSubmit with the recipient address/alias in the request URL and the message, sender nickname, recipient name, and timestamp in the request body. A configured webhook receives the message and associated metadata in its selected format. These destinations are external services; local storage does not keep sent information private from them. Email may require recipient activation. Failed/partial messages can retry, while activation retries require the Outbox action. This is not an emergency communication service.

The application library uses `kidHubPortalV1` for favorites, recent launches, session plans, and notes. Its backup covers only those fields; it does not include drawings, Toolbox saves, adventure journals, or game progress. Imports replace library preferences after confirmation. Offline caches store application files, not a transferable backup of user progress.

The page includes Google Fonts stylesheet and font requests. A web host may also log ordinary HTTP requests. Review those services separately before deploying in a classroom or organization. This document does not assert compliance with any particular privacy law.

## 🧹 Data management

Use browser site-data settings to remove stored state. Export artwork first. Moving from a local file to a hosted URL changes the storage origin and does not migrate progress automatically. Shared browser profiles may expose saved progress to other people using that profile.

## 👪 Adult guidance

Use nicknames rather than identifying information. Avoid importing sensitive photos on a shared device. The parent gate is a convenience control, not identity verification. Cloud messaging is not an emergency service and may fail, queue, or await activation.

## 🧭 Adventure and practice records

Adventure trail checkmarks, challenge style, and journal notes use `kidHubAdventuresV1`. Game and companion goals, notes, and the last 20 session timestamps/durations use `kidHubPractice:<activity>`. They remain in local storage and are not sent by the new practice features. Downloaded journals and JSON practice logs are separate files and are not included in the existing Toolbox backup. Browser storage is not encrypted; use non-sensitive notes on shared devices.

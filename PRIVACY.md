# 🛡️ Privacy & local data

KidHub is a static browser application. The Art Studio additions do not introduce an account service, image-upload endpoint, analytics service, or backend database.

## 💾 What stays in the browser

The inherited `kidHubV3` local-storage record holds profile preferences, activity progress, and small gallery previews. Artwork on the live canvas is not a durable project file. Local image imports use temporary browser object URLs, which are revoked after decoding or an import error. PNG exports are downloaded through the browser.

## 🌐 External requests

The page includes Google Fonts stylesheet and font requests. A web host may also log ordinary HTTP requests. Review those services separately before deploying in a classroom or organization. This document does not assert compliance with any particular privacy law.

## 🧹 Data management

Use browser site-data settings to remove stored state. Export artwork first. Moving from a local file to a hosted URL changes the storage origin and does not migrate progress automatically. Shared browser profiles may expose saved progress to other people using that profile.

## 👪 Adult guidance

Use nicknames rather than identifying information. Avoid importing sensitive photos on a shared device. The inherited parent gate and simulated messaging are not identity verification or real-time communication systems.

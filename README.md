# Wisfy SMS Releases & OTA Update Feed

Public distribution and Over-The-Air (OTA) update repository for **Wisfy SMS Gateway**.

- **Repository:** `https://github.com/naaafizz/Wisfy-sms-releases`
- **Manifest URL:** `https://raw.githubusercontent.com/naaafizz/Wisfy-sms-releases/main/version.json`

---

## 1. Repository Structure

```
├── version.json           # Remote update manifest fetched by Wisfy SMS apps
├── releases/              # (Optional local mirror of release APKs)
│   └── Wis-sms-v1.3.0.apk
└── README.md              # Instructions for publishing new updates
```

---

## 2. Remote Manifest (`version.json`) Format

```json
{
  "versionCode": 3,
  "versionName": "1.3.0",
  "releaseNotes": "• Dynamic QR code pairing added\n• Temporary one-time secret key support\n• Custom URL support",
  "downloadUrl": "https://github.com/naaafizz/Wisfy-sms-releases/releases/download/v1.3.0/Wis-sms.apk",
  "isMandatory": false,
  "apkSizeMb": 12.8
}
```

---

## 3. How to Publish a New Release (Step-by-Step)

### Step 1: Bump `versionCode` and `versionName`
In your private Android app source repository (`app/build.gradle.kts`):
```kotlin
defaultConfig {
    versionCode = 3       // Must be strictly greater than previous release
    versionName = "1.3.0" // User-facing version
}
```

### Step 2: Build the Signed APK
Build the release APK using your production keystore.

> ⚠️ **CRITICAL KEYSTORE WARNING:**  
> Android strictly requires that **every update APK be signed with the exact SAME keystore and key alias** as the previous version. If the signing key changes, Android's package manager will abort the update with `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.

### Step 3: Create a GitHub Release in this Repo
1. Go to: **https://github.com/naaafizz/Wisfy-sms-releases/releases/new**
2. Tag version: `v1.3.0` (Create new tag on publish)
3. Release title: `Wisfy SMS v1.3.0`
4. Attach binary: Upload your newly generated `Wis-sms.apk`.
5. Click **Publish release**.
6. Right-click the uploaded `Wis-sms.apk` asset and copy its direct download URL:
   `https://github.com/naaafizz/Wisfy-sms-releases/releases/download/v1.3.0/Wis-sms.apk`

### Step 4: Update `version.json` in this Repo
Edit `version.json` on the `main` branch with the new version code, notes, and the download link:
```json
{
  "versionCode": 3,
  "versionName": "1.3.0",
  "releaseNotes": "• Dynamic QR code pairing added\n• Temporary one-time secret key support\n• Custom URL support",
  "downloadUrl": "https://github.com/naaafizz/Wisfy-sms-releases/releases/download/v1.3.0/Wis-sms.apk",
  "isMandatory": false
}
```
Commit and push to `main`.

---

## 4. How Client Devices Update
1. On startup (or via **Settings -> Check Now**), the installed Wisfy SMS app makes an HTTPS GET request to `version.json`.
2. If `remote.versionCode > installed.versionCode`, the app presents the **Update Available** modal with release notes.
3. The user taps **Update Now**, Android's `DownloadManager` downloads the APK to scoped storage, and Android's native package installer updates the app in-place without data loss.

# Wisfy SMS Releases & OTA Update Feed

Public distribution and Over-The-Air (OTA) update repository for **Wisfy SMS Gateway**.

- **Repository:** `https://github.com/naaafizz/Wisfy-sms-releases`
- **Manifest URL:** `https://raw.githubusercontent.com/naaafizz/Wisfy-sms-releases/main/version.json`

---

## 1. Repository Structure

```
├── version.json           # Remote update manifest fetched by Wisfy SMS apps
├── releases/              # All versioned APK releases (kept permanently)
│   ├── Wis-sms-v1.0.14.apk
│   ├── Wis-sms-v1.0.13.apk
│   ├── Wis-sms-v1.0.11.apk
│   ├── Wis-sms-v1.0.10.apk
│   └── Wis-sms.apk        # Latest release binary
└── README.md              # Instructions for publishing new updates
```

---

## 2. Remote Manifest (`version.json`) Format

```json
{
  "versionCode": 14,
  "versionName": "v1.0.14",
  "releaseNotes": "• Brand new animated cyber emblem logo with pulsing specular aura\n• Cash In / Payment confirmation chime & dual-pulse haptic feedback\n• Battery Optimization Whitelist protection helper for 24/7 background reliability\n• Today's total BDT volume & delivered SMS dashboard overview\n• SMS logs enhanced body/TrxID search & 1-tap 'Retry All Failed' banner\n• 1-Tap Webhook Live Ping test directly from Dashboard endpoint cards",
  "downloadUrl": "https://github.com/naaafizz/Wisfy-sms-releases/raw/main/releases/Wis-sms-v1.0.14.apk",
  "isMandatory": false
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

### Step 3: Publish APK to this Repo (Git Repository Artifacts)
You can directly add the APK file to the `releases/` folder:
1. Copy the new version APK into `releases/` (e.g., `releases/Wis-sms-v1.0.11.apk` and `releases/Wis-sms.apk`).
2. **Never delete previous version APKs** (e.g., keep `Wis-sms-v1.0.10.apk`).
3. Push to `main`.

> 💡 **Preventing "There was a problem while parsing the package"**:
> If you host the APK inside the `releases/` folder on GitHub (without publishing an official GitHub Release Tag), the direct download URL in `version.json` **MUST** use the raw artifact URL:
> `https://github.com/naaafizz/Wisfy-sms-releases/raw/main/releases/Wis-sms-v1.0.11.apk`
> *(If you use `.../releases/download/...` when no release tag exists, GitHub returns a 404 HTML web page instead of the APK file, causing Android's package installer to report "There was a problem while parsing the package".)*

### Step 4: Update `version.json` in this Repo
Edit `version.json` on the `main` branch with the new version code, notes, and the download link:
```json
{
  "versionCode": 11,
  "versionName": "v1.0.11",
  "releaseNotes": "• Seamless in-app update via direct repository artifact\n• Direct browser download button added\n• Locked official software update feed\n• Website QR pairing scanner & financial whitelist",
  "downloadUrl": "https://github.com/naaafizz/Wisfy-sms-releases/raw/main/releases/Wis-sms-v1.0.11.apk",
  "isMandatory": false
}
```
Commit and push to `main`.

---

## 4. How Client Devices Update
1. On startup (or via **Settings -> Check Now**), the installed Wisfy SMS app makes an HTTPS GET request to `version.json`.
2. If `remote.versionCode > installed.versionCode`, the app presents the **Update Available** modal with release notes.
3. The user taps **Update Now**, Android's `DownloadManager` downloads the APK to scoped storage, and Android's native package installer updates the app in-place without data loss.

# 📱 React Native Mobile Application

Welcome to the repository! This project is a cross-platform mobile application built using React Native, TypeScript, and robust automated workflows.

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

* **Node.js**: v20.x
* **Yarn**: v1.22.x (or npm equivalent)
* **Java Development Kit (JDK)**: JDK 17
* **Android Studio**: Configured with Android SDK and virtual devices (Emulators)
* **Xcode** (macOS only): v26+ for iOS compilation and Simulator management
* **CocoaPods** (macOS only): Latest stable version

### Local Installation Steps

**1. Clone the repository:**

```bash
git clone https://gitlab.anasource.com/vikrant.hirapara/dineflow-rms.git
cd dineflow-rms.git


```

**2. Install JavaScript dependencies:**

```bash
yarn install --frozen-lockfile

```

**3. Install iOS dependencies (macOS only):**

```bash
cd ios
pod install
cd ..

```

### Running the Application

* **Start Metro Bundler:**
```bash

```



yarn start

```
* **Run on Android:**
  ```bash
yarn android

```

* **Run on iOS:**
```bash
yarn ios

```



```

---

## 🛠 Available Scripts

You can run the following scripts locally to validate your code before pushing:

| Script | Purpose |
| :--- | :--- |
| `yarn lint` | Runs ESLint to check for code quality issues. |
| `yarn format` | Checks file formatting against Prettier configurations. |
| `yarn tsc` | Runs the TypeScript compiler (`noEmit`) to verify static types. |
| `yarn test` | Executes Jest unit and integration tests. |
| `yarn test --coverage` | Runs Jest and outputs coverage metrics in the `/coverage` folder. |

---

## ⛓ CI/CD Pipeline Architecture

This repository utilizes **GitHub Actions** to automate quality checks and build verification on every push or pull request to the `main` and `develop` branches.


```

[ Push / PR ]
│
▼
┌────────────────────────────────────────┐
│ Stage 1: Validate & Test               │
│ - Linting, Formatting, TS Type Check  │
│ - Security Audit & Jest Unit Tests     │
└──────────────────┬─────────────────────┘
│ (If Passed)
──────────┴──────────
│                     │
▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ Stage 2: Android │  │ Stage 3: iOS     │
│ - JDK 17 Setup   │  │ - macOS-14       │
│ - Gradle Cache   │  │ - CocoaPods Cache│
│ - Compile Debug  │  │ - Xcode Build    │
└──────────────────┘  └──────────────────┘

```

### Caching Strategy
To keep our build pipelines exceptionally fast, the workflow implements structural caching for:
* **Node Modules:** Automatically keyed against `yarn.lock`.
* **Gradle:** Caches wrappers and dependencies inside the `.gradle` directories.
* **CocoaPods:** Caches the `ios/Pods` folder to prevent redundant fetches.

---

## 🔐 Git Workflow & Branching

We adhere to a standard branch-and-PR development lifecycle:

1. **Feature Branches:** Cut your branch from `develop` using a naming convention like `feature/abc-123-short-description`.
2. **Pre-commit Validation:** Run `yarn lint`, `yarn tsc`, and `yarn test` locally before committing code.
3. **Pull Requests:** Open a PR against `develop`. The CI pipeline **must pass** entirely, and it requires at least one peer approval before it can be merged.

APP_ENV='development'
API_BASE_URL='https://zbkoocnwycddfdoumvhi.supabase.co/rest/'
API_KEY='sb_publishable_RQHgRfCe9xJKoJ-paOp-mQ_kTavs-JC'
ENABLE_LOGS=true
ENCRYPTION_KEY=''
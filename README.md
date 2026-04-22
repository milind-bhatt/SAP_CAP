# cloud-application-programming

## Editor: VS Code

## Troubleshooting Overview

| Issue No. | Problem                                  |
| --------- | ---------------------------------------- |
| 1         | npm ERR! ENOTFOUND npm.sap.com           |
| 2         | Node.js 20+ required for @sap/cds v9.8.4 |
| 3         | Hot reload error (impl undefined)        |

---

## (1) npm "ERR! ENOTFOUND npm.sap.com"

### Problem

While installing SAP packages (e.g. @sap/cds-dk), you may see:

```bash
npm ERR! code ENOTFOUND
npm ERR! network request to https://npm.sap.com/... failed
```

### Root Cause

This usually happens when:

* @sap packages are configured to use SAP private registry (npm.sap.com)
* System cannot reach it due to:

  * No VPN
  * DNS issues
  * Proxy misconfiguration

---

### Resolution Steps

#### 1. Verify npm registry

Ensure npm is using the public registry:

```bash
npm config get registry
```

Expected:

```bash
https://registry.npmjs.org/
```

---

#### 2. Remove SAP registry override

```bash
npm config delete @sap:registry
```

---

#### 3. Check and remove proxy settings

```bash
npm config delete proxy
npm config delete https-proxy
```

Note: Only do this if a corporate proxy is not required.

---

#### 4. Retry installation

```bash
npm install -g @sap/cds-dk
```

---

### Additional Notes

* Scoped registries like @sap:registry override the default npm registry
* Proxy misconfiguration can cause ENOTFOUND or getaddrinfo errors even if registry is correct

---

### Quick Checklist

* Check npm registry (`npm config get registry`)
* Check scoped registries (`npm config list`)
* Verify/remove proxy settings

---

## (2) Node.js version error (CDS WATCH)

### Problem

```bash
Node.js version 20 or higher is required for @sap/cds v9.8.4
```

### Resolution

Install Node.js 20 or higher:

[https://nodejs.org/en/download](https://nodejs.org/en/download)

---

## (3) Hot Reload Error (impl undefined)

### Problem

During `cds watch` or `cds serve --watch`, you may see:

```bash
TypeError: Cannot read properties of undefined (reading 'impl')
at hotReloading (.../cds-dk/lib/watch/hot-reload.js)
```

### Root Cause

This is a CAP CLI hot-reload issue caused by:

* Version mismatch in `@sap/cds-dk`
* Corrupted watch state
* Incompatible Node.js version

---

### Resolution Steps

#### 1. Run without watch mode (quick fix)

```bash
cds serve all --with-mocks --in-memory
```

---

#### 2. Reinstall CAP CLI

```bash
npm uninstall -g @sap/cds-dk
npm install -g @sap/cds-dk
```

---

#### 3. Ensure correct Node.js version

Use Node.js 18 LTS or 20 LTS:

```bash
node -v
```

---

#### 4. Disable watch mode if needed

```bash
cds watch --no-inject-mocks
```

---

### Notes

* This issue is unrelated to your CDS model or service definitions
* Usually resolves after aligning Node.js and CDS CLI versions

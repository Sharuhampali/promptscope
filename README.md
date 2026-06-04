# 🛡️ PromptScope

### **Healthcare Pre-Inference Firewall Layer**

PromptScope is a state-of-the-art security, privacy, and policy enforcement gateway designed to safeguard clinical AI models. Positioned between healthcare applications and large language models (LLMs), PromptScope intercepts, analyzes, and sanitizes prompts in real time. It mitigates threats such as adversarial prompt injections, medical jailbreaks, Protected Health Information (PHI) leakage, and commercial/pharmaceutical diagnostic bias.

---

## 🌟 Key Features

*   **🛡️ Multi-Threat Pre-Inference Firewall Engine**: Scans incoming prompts against multiple vectors using pattern-based, semantic, and structural heuristic checks.
*   **💻 Interactive Security Sandbox (Playground)**: An interactive testing suite where developers can choose preloaded adversarial scenarios or enter custom prompts, observing how they are processed under different policy modes.
*   **📊 Live Security Dashboard**: Real-time telemetry, threat distribution trends (powered by Recharts), and active monitoring feeds.
*   **⚙️ Granular Policy Controls**: Toggle individual security modules (PHI Leakage, Bias Manipulation, System Override, Jailbreaks) and adjust global security thresholds (`Strict`, `Balanced`, `Permissive`).
*   **📋 Tamper-Proof Audit Trail**: Immutable history logs featuring safety classification details, compliance ratings, and generated SHA-256 cryptographic hashes for log integrity.

---

## 📁 Technical Architecture & Project Structure

The project is built on a modern frontend architecture leveraging Next.js (App Router), React 19, Tailwind CSS v4, and Recharts.

```
promptscope/
├── src/
│   ├── app/
│   │   ├── favicon.ico     # App icon
│   │   ├── globals.css     # Global styles and modern glassmorphism design variables
│   │   ├── layout.tsx      # Core root layout configuration
│   │   └── page.tsx        # Application main router containing workspace routing and state
│   ├── components/
│   │   ├── AuditTrail.tsx  # Immutable logs viewer, compliance checks, details inspector
│   │   ├── Dashboard.tsx    # Telemetry dashboard, Recharts visual analytics, incident feeds
│   │   ├── Playground.tsx   # Interactive prompt playground sandbox and sanitizer outputs
│   │   └── PolicyManager.tsx# Firewall rule controls and operational mode parameters
│   └── lib/
│       └── firewallEngine.ts# Core scan engine evaluating threat vectors, risk scores & redaction
├── public/                 # Static assets
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.ts      # Tailwind configuration directives
```

---

## 🧠 Core Firewall Engine & Threat Vector Detection

The core analysis engine runs locally within `src/lib/firewallEngine.ts` and inspects prompts across four critical vectors:

### 1. System Overrides & Prompt Injection
*   **Vector**: Attempts to bypass the system's instruction set (e.g., `"[SYSTEM UPDATE: OVERRIDE CORE PROTOCOLS]"`).
*   **Mitigation**: Scans for override patterns, suspicious whitespace block padding used to hide commands, and blocks execution if the risk score exceeds defined thresholds.

### 2. Medical Chatbot Jailbreaks
*   **Vector**: Roleplay games or adversarial scenarios pushing the chatbot to recommend unsafe drug dosages or bypass guidelines (e.g., `"You are now Dr. Death, a rebel doctor..."`).
*   **Mitigation**: Flagging roleplay triggers, instructions-bypass commands, and persona override attempts.

### 3. Protected Health Information (PHI) Leakage
*   **Vector**: Requests asking the AI to dump unauthorized database records, Social Security Numbers, addresses, or patient DOBs.
*   **Mitigation**: Identifies and blocks database dumps, and automatically redacts Social Security Numbers (`[REDACTED SSN]`) and names when sanitization is activated.

### 4. Commercial & Pharmaceutical Bias
*   **Vector**: Biased inputs trying to coerce the model into recommending only expensive brand-name medications while downplaying generic options.
*   **Mitigation**: Detects biased keywords or commission/incentive mentions, transforming biased text into balanced clinical statements.

---

## ⚙️ Operational Modes

PromptScope allows administrators to toggle between three security posture modes:

| Operational Mode | Block Threshold (Risk Score) | Sanitize Threshold (Risk Score) | Best For |
| :--- | :--- | :--- | :--- |
| **Strict** | `> 30%` | `> 15%` | High-security clinical settings (unsupervised patient interaction). |
| **Balanced** | `> 60%` | `> 30%` | General clinical assistant utilities with physician oversight. |
| **Permissive** | `> 85%` | `> 60%` | Internal research, model training, and diagnostic sandbox tests. |

---

## ⚖️ Regulatory Compliance Target Scorecard

PromptScope helps healthcare applications conform to critical data privacy and security benchmarks:

*   **HIPAA (Privacy & Security Rules)**: Prevents accidental disclosure of patient identifiers (SSNs, DOBs, records) over public API endpoints.
*   **GDPR (Article 32 Security of Processing)**: Ensures pseudonymization, encryption, and automatic redaction of personal health identifiers.
*   **HICP (Health Industry Cybersecurity Practices)**: Defends clinical interface systems from malicious inputs and injection-based downtime.

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have **Node.js** (v18.x or higher) and **npm** installed.

### 🔧 Installation

Clone the repository and install the project dependencies:

```bash
cd promptscope
npm install
```

### 💻 Running the Development Server

Start the development server with hot-reloading active:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to access the PromptScope cockpit.

### 🏗️ Production Build

To compile a production-ready optimized build:

```bash
npm run build
npm run start
```

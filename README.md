# 🛡️ GeoShield India

> **Public Environmental Intelligence & Global Crisis Risk Operations Platform**  
> *Unifying multi-agency satellite, radar, and river telemetry with deterministic physical modeling, 3D planetary visualization, and ground-truth AI verification.*

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](src/App.tsx)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white)](vite.config.ts)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express&logoColor=white)](server.ts)
[![Google GenAI](https://img.shields.io/badge/Google%20GenAI-Gemini%20Flash-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Automated Tests](https://img.shields.io/badge/Verification%20Suites-94%2F94%20Passed%20(100%25)-10B981.svg)](scripts/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

---

## 📑 Table of Contents

- [Executive Overview](#-executive-overview)
- [The Dual-Cohort Paradigm](#-the-dual-cohort-paradigm)
- [Key Features & Capabilities](#-key-features--capabilities)
- [System Architecture](#-system-architecture)
- [12-Slide Executive Presentation Deck & PDF](#-12-slide-executive-presentation-deck--pdf)
- [Getting Started](#-getting-started)
- [Automated Verification Suites](#-automated-verification-suites)
- [Directory Layout](#-directory-layout)
- [Statutory Compliance & Standards](#-statutory-compliance--standards)
- [License](#-license)

---

## 🌍 Executive Overview

During extreme meteorological and hydrological crises, disaster response is frequently hindered not by a lack of raw scientific data, but by the **"Disaster Translation Gap"**:

1. **Scientific Data Silos**: Central Water Commission (CWC) hydrographs, India Meteorological Department (IMD) Doppler radar feeds, and INCOIS storm surge models remain isolated in separate bulletin formats.
2. **Citizen Incomprehension**: Technical parameters like *"RL 21.65m at Jobra Weir"* or *"Level 4 Surge Anomaly"* confuse the public, resulting in delayed evacuations.
3. **Cascading Failure Blindspots**: Traditional 2D flood maps display static inundation polygons, failing to predict secondary infrastructure collapses (e.g., substation tripping cutting hospital ICU power).

**GeoShield India** bridges this divide by synthesizing multi-agency telemetry into a **unified deterministic risk engine** that powers both **intuitive, multilingual public intelligence** and **high-precision incident command telemetry**.

---

## 👥 The Dual-Cohort Paradigm

GeoShield is built from the ground up to serve two distinct user cohorts without compromising scientific fidelity:

```
                               ┌────────────────────────────────────────────────┐
                               │             GeoShield India Core               │
                               │   Multi-Agency Ingestion & Deterministic Engine│
                               └──────────────────────┬─────────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
    ┌─────────────────────────────────────┐                       ┌─────────────────────────────────────┐
    │     Cohort A: Public & Citizens     │                       │     Cohort B: Incident Command      │
    │  "What is happening & what to do"   │                       │  "Deterministic telemetry & action" │
    ├─────────────────────────────────────┤                       ├─────────────────────────────────────┤
    │ • Multilingual (EN, HI, OR, BN)     │                       │ • Millimeter CWC river gauge stages │
    │ • 3-Tier Explanations (ELIF-5)      │                       │ • FFE Freeboard breach margins      │
    │ • Immediate Action Checklists       │                       │ • Cascading lifeline graphs         │
    │ • 3D Living Earth Globe             │                       │ • Counterfactual "What-If" Lab      │
    │ • Simplified risk color coding      │                       │ • OASIS CAP v1.2 XML dispatcher     │
    └─────────────────────────────────────┘                       └─────────────────────────────────────┘
```

---

## 🚀 Key Features & Capabilities

### 1. 🔍 Live Spatial Composite Area Intelligence Inspector
- **Interactive Spatial Anchoring**: Click anywhere on the map or select from key landmarks (Cuttack Delta, Paradip Port, Kendrapara) across multiple radii (`1km`, `5km`, `10km`, `25km`, `50km`).
- **SVG Spotlight Dimming Focus**: Automatically dims unselected regions to concentrate incident command focus on the target area.
- **5-Step Deterministic Causal Flow**:
  1. *Meteorological Driver* (IMD 42 mm/h cloudburst)
  2. *Surface Soil Saturation* (Sentinel-1 SAR 88% moisture)
  3. *Upstream River Surge* (CWC Jobra Barrage 21.65m stage, +0.65m above danger level)
  4. *Estuary Tidal Impedance* (Bay of Bengal +2.3m storm surge blocking river drainage)
  5. *Localized Lowland Inundation* (0.45m - 1.20m pooling across low-lying wards)
- **"What Changed?" Delta Engine**: Real-time comparative analytics comparing $T-6\text{h} \to T_0$ conditions.
- **Cascading Infrastructure Graph**: Maps interdependencies across 33kV substations, water treatment plants, causeway links, and tertiary trauma centers.
- **Scenario Counterfactual Sliders**: Instant recalculation of inundation footprints and at-risk populations based on hypothetical rainfall or tidal surge adjustments.

### 2. 🌐 Public Environmental Intelligence & 3D WebGL Living Earth
- **Photorealistic 3D Earth Globe**: Powered by WebGL/Three.js with atmospheric Rayleigh scattering, day/night solar terminator, and smooth orbital camera controls.
- **Planetary Hazard Vectors**: Displays live tropical cyclone tracks, ocean swell wave heights, and atmospheric moisture plumes.
- **Full Multilingual Localization**: Native translation support across **English**, **Hindi (हिन्दी)**, **Odia (ଓଡ଼ିଆ)**, and **Bengali (বাংলা)**.
- **Cognitive Level Toggle**: Switch seamlessly between **Simple** (plain language), **Detailed** (operational briefing), and **Expert** (hydrological measurements).

### 3. 📍 Google Maps Platform Grounding & AI Safety
- **Zero Hallucination Protocol**: Generic LLMs hallucinate fictional shelter addresses. GeoShield grounds all emergency facilities using Google Maps Platform Places and Routes APIs.
- **Verified Ground Truth**: Real-time validation of certified OSDMA cyclone shelters and hospital trauma ICUs (SCB Medical College, AIIMS Bhubaneswar).
- **Statutory Precedence Safeguard**: Official government bulletins (NDMA, IMD, CWC) strictly override any AI-generated text.

### 4. 📐 Deterministic Modeling & Temporal Anti-Leakage
- **Physics-Grounded Hydraulics**: Channel flow calculated using Manning's equation ($V = \frac{1}{n} R^{2/3} S^{1/2}$) and tidal estuary backwater profile equations.
- **Strict Temporal Hygiene**: Enforces $t \le T_{\text{eval}}$ for all operational decisions during historical disaster replay audits, preventing forward-looking data leakage.
- **Cryptographic Provenance**: Every ingested sensor packet receives an immutable SHA-256 hash stamp.

### 5. 📡 Multi-Agency Telemetry & OASIS CAP Dispatch
- Standardized adapters for CWC, IMD, INCOIS, and Open-Meteo feeds.
- Automated generation of **OASIS Common Alerting Protocol (CAP) v1.2** XML payloads ready for cell-broadcast emergency distribution.

---

## 🏛️ System Architecture

```
[Layer 01 : Multi-Agency Ingestion Bus]
  ├── CWC Telemetric River Stage Gauges (Jobra Barrage 21.65m GTS MSL)
  ├── IMD Doppler Weather Radar (10cm DWR Paradip 42mm/h)
  ├── INCOIS Wave-Rider Buoys & Coastal Storm Surge (+2.3m)
  └── ESA Sentinel-1 SAR Backscatter (88% Soil Saturation) & CartoDEM 30m
         │
[Layer 02 : Deterministic Physical Modeling Engine]
  ├── 2D Hydrodynamic Backwater Curve Modeling
  ├── Manning's Channel Discharge Velocity Calculations
  └── First Floor Elevation (FFE) Plinth Margin Analysis
         │
[Layer 03 : Temporal Anti-Leakage & Governance Ledger]
  ├── Strict Historical Evaluation Boundaries (t ≤ Teval)
  ├── Cryptographic Telemetry Hash Stamping (SHA-256)
  └── Real-Time Sensor Latency & Stale Feed Health Monitoring
         │
[Layer 04 : Grounded AI Synthesis & Safety Layer]
  ├── Google Maps Platform Grounding (Certified Shelters & Trauma ICUs)
  ├── Gemini 2.5 / 3.5 Flash Multimodal Synthesis
  └── Statutory Override Precedence Chain (NDMA / IMD / CWC > AI)
         │
[Layer 05 : Dual-Cohort Presentation & Public Dispatch]
  ├── 3D WebGL Living Earth Planetary Visualization
  ├── Interactive Geospatial Studio with SVG Spotlight Focus
  ├── OASIS Common Alerting Protocol (CAP v1.2) XML Dispatcher
  └── Multilingual Citizen Portals (EN / HI / OR / BN)
```

---

## 📊 12-Slide Executive Presentation Deck & PDF

GeoShield includes a complete executive presentation deck ready for stakeholders, emergency operations centers, and technical reviews:

- **Download Compiled PDF (12 Slides, 16:9 Landscape)**:  
  👉 [`GeoShield_India_Presentation_Deck.pdf`](GeoShield_India_Presentation_Deck.pdf)
- **Interactive Web Presentation Deck**:  
  👉 Accessible at [`/presentation.html`](public/presentation.html) with arrow key navigation, fullscreen mode, and direct PDF printing.

| Slide | Topic | Content Summary |
| :---: | :--- | :--- |
| **01** | Cover | Project Mission, Multi-Agency Scope & Key Metrics |
| **02** | Problem | The Disaster "Translation Gap" (Data Silos, Citizen Incomprehension, Cascades) |
| **03** | Strategy | Dual-Cohort Architecture (Citizens vs Incident Command) |
| **04** | Architecture | 12-Layer Data & Intelligence Pipeline |
| **05** | Area Inspector | Live Spatial Composite, Spotlight Focus & 5-Step Causal Chain |
| **06** | Digital Twin | Lifeline Infrastructure Failure Cascades (Substation $\to$ Water $\to$ Hospital) |
| **07** | Planetary Earth | WebGL 3D Earth, Atmospheric Shader & 4-Language Localization |
| **08** | AI Safety | Google Maps Grounding & Statutory Precedence Hierarchy |
| **09** | Scientific Rigor | Manning's Hydrodynamics, Estuary Backwater & Temporal Anti-Leakage |
| **10** | Crisis Lab | Counterfactual "What-If" Simulation with Real-Time Stress Controls |
| **11** | QA & Benchmarks | 100% Automated Test Suite Passing (94/94 Test Vectors) |
| **12** | Roadmap | Deployment Horizons (OSDMA Pilot $\to$ Pan-India River Basin Mesh) |

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sanyogitawabale-dev/Plan-disaster-risk-platform.git
   cd Plan-disaster-risk-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
   *(Note: The platform includes full deterministic fallback heuristics and will operate smoothly even if no API key is provided).*

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at **`http://localhost:3000`**.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Automated Verification Suites

GeoShield includes 4 automated test suites ensuring zero regression across deterministic calculations, temporal boundaries, and statutory mandates:

```bash
# Run the complete test battery
npm run geoshield:audit         # 40/40 Core Risk Engine & Metrology tests passed
npm run geoshield:area-intel    # 21/21 Area Intelligence & Causal Flow tests passed
npm run geoshield:replay        # 18/18 Historical Replay & Anti-Leakage tests passed
npm run geoshield:public-intel  # 15/15 Multilingual & Safety Checklist tests passed

# Run TypeScript type-safety check
npm run lint                    # Strict zero-error compiler verification
```

### Verification Scorecard

| Test Suite | File | Tests | Status | Compliance |
| :--- | :--- | :---: | :---: | :---: |
| **Core System Audit** | `scripts/runGeoshieldAudit.ts` | 40 / 40 | ✅ PASSED | 100% |
| **Area Intelligence** | `scripts/verifyAreaIntelligence.ts` | 21 / 21 | ✅ PASSED | 100% |
| **Historical Replay** | `scripts/runReplayVerification.ts` | 18 / 18 | ✅ PASSED | 100% |
| **Public Intelligence** | `scripts/runPublicIntelVerification.ts` | 15 / 15 | ✅ PASSED | 100% |
| **Strict Type Safety** | `tsc --noEmit` | — | ✅ 0 ERRORS | 100% |

---

## 📂 Directory Layout

```
Plan-disaster-risk-platform/
├── GeoShield_India_Presentation_Deck.pdf   # 12-slide executive presentation PDF
├── GEOSHIELD_PROJECT_MASTER_DOCUMENTATION.md # Statutory forensic audit study
├── index.html                              # Web application entry point
├── package.json                            # Scripts, dependencies and metadata
├── public/                                 # Static assets & presentation deck
│   ├── GeoShield_India_Presentation_Deck.pdf
│   └── presentation.html                   # Interactive browser presentation
├── scripts/                                # Automated verification test suites
│   ├── runGeoshieldAudit.ts                # 40-point core audit test runner
│   ├── runPublicIntelVerification.ts       # Multilingual & public UI verification
│   ├── runReplayVerification.ts            # Temporal anti-leakage replay tests
│   └── verifyAreaIntelligence.ts           # 21-point spatial inspector test suite
├── server.ts                               # Express backend with Gemini & CAP APIs
├── src/
│   ├── App.tsx                             # Main UI orchestrator & navigation
│   ├── components/                         # React feature components
│   │   ├── DataQualityMonitor.tsx          # Real-time sensor latency & quality
│   │   ├── GeospatialStudio.tsx            # Multi-layer GIS & area inspector
│   │   ├── Header.tsx                      # Top navigation bar with deck links
│   │   ├── geospatial/
│   │   │   └── AreaIntelligencePanel.tsx   # Detailed spatial situation panel
│   │   └── public/
│   │       ├── AiSituationExplainer.tsx    # 3-tier cognitive explanation cards
│   │       ├── EarthSituationPage.tsx      # Public environmental intelligence
│   │       └── InteractiveGlobe3D.tsx      # WebGL 3D Earth globe visualization
│   ├── data/                               # Reference datasets & disaster cadastre
│   │   ├── globalEnvironmentalData.ts      # Global hazard arcs & ocean anomalies
│   │   ├── indiaDisasterData.ts            # Odisha sector assets & river telemetry
│   │   └── multilingualGlossary.ts         # English, Hindi, Odia, Bengali terms
│   ├── services/                           # Deterministic calculation engines
│   │   ├── adversarialTestSuite.ts         # Boundary condition test definitions
│   │   ├── areaIntelligenceEngine.ts       # Spatial context & causal synthesizer
│   │   ├── replay/                         # Historical replay & anti-leakage
│   │   └── telemetry/                      # Sensor adapters (CWC, IMD, INCOIS)
│   └── types/                              # Strict TypeScript data models
└── vite.config.ts                          # Vite bundler configuration
```

---

## ⚖️ Statutory Compliance & Standards

GeoShield India conforms to statutory disaster management protocols and national engineering specifications:

- **Disaster Management Act, 2005 (Act No. 53 of 2005)**: Sections 22, 24, and 30 for state and district disaster authority hierarchies.
- **NDMA SACHET Protocol**: National disaster alerting format compliance.
- **Central Electricity Authority (CEA) Regulations**: Grid safety rules for inundation-triggered substation isolation.
- **MoRTH Specifications**: Ministry of Road Transport & Highways bridge and causeway flood clearance guidelines.
- **OASIS Common Alerting Protocol (CAP) v1.2**: International multi-hazard alert standard for cell-broadcast dissemination.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

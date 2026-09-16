<div align="center">

# ☀️ SolarScope
### **Solar Rooftop Potential & ROI Estimator**

An intelligent, interactive rooftop solar pre-feasibility and financial return estimation platform. Empowering homeowners and property developers to evaluate solar viability, annual generation, savings, payback periods, and environmental impact before consulting vendors.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](#license)

[Explore Features](#key-features) • [Calculation Methodology](#calculation-methodology) • [Tech Stack](#tech-stack) • [Architecture](#project-architecture) • [Quick Start](#quick-start) • [Deployment](#deployment)

</div>

---

<a id="problem-background"></a>
## 📌 Problem Background

Homeowners frequently face significant uncertainty when considering rooftop solarization:
- How much unshaded usable space is truly available?
- What size system can the roof structurally support?
- How does geographic solar irradiance and roof tilt/orientation affect output?
- What are the realistic payback timelines and net 25-year financial savings?

**SolarScope** transforms complex physical equations and meteorological data into an accessible, five-stage visual estimator designed for clarity and confidence.

---

<a id="key-features"></a>
## ✨ Key Features

- **🏡 Interactive Rooftop Modeling**:
  - Live array coverage visual that updates instantly as usable rooftop percentages and area values are adjusted.
  - Micro-animated solar panel reflections, flowing circuit particles, and floating sun graphics.

- **🧭 Precision Orientation Compass**:
  - Custom SVG compass dial with an exact-center rotating needle.
  - 8-point cardinal selection (`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`) with real-time azimuth readout and yield efficiency adjustments.

- **🗺️ Regional Meteorological Calibration**:
  - Integrated location engine calibrated to Indian cities (Bengaluru, Mumbai, Delhi, Chennai, Hyderabad, Pune, Ahmedabad, Kochi, Jaipur, Kolkata).
  - Embedded map with coordinate display, peak sun hours ($kWh/m^2/day$), and seamless Google Maps API integration with an interactive OpenStreetMap fallback.

- **📈 25-Year Financial Analytics Dashboard**:
  - Interactive Recharts area chart comparing cumulative electricity savings against capital expenditure with a dynamic break-even indicator.
  - Monthly seasonal output bar chart highlighting peak summer generation.

- **🌱 Environmental Impact Equivalencies**:
  - Quantitative carbon reduction estimates translated into tangible equivalents: metric tonnes of $\text{CO}_2$ avoided, trees grown annually, and passenger vehicle kilometers saved.

- **⚙️ Deep Parameter Customization**:
  - Expandable drawer for engineering parameters: panel efficiency ($15\%-25\%$), system performance ratio (PR), and regional grid emission factors.

---

<a id="calculation-methodology"></a>
## 🧮 Calculation Methodology

SolarScope relies on open physical relationships and meteorological radiation benchmarks:

| Metric | Formula |
| :--- | :--- |
| **System Capacity ($kW$)** | $\frac{\text{Usable Roof Area } (m^2) \times \text{Panel Power Density } (W/m^2)}{1000}$ |
| **Annual Energy Output ($kWh$)** | $\text{Capacity } (kW) \times \text{Peak Sun Hours} \times 365 \times \text{PR} \times \text{Orientation Factor} \times \text{Shading Factor}$ |
| **Annual Electricity Savings ($₹$)** | $\text{Annual Generation } (kWh) \times \text{Grid Tariff } (₹/kWh)$ |
| **Simple Payback Period ($Years$)** | $\frac{\text{Total System Cost } (₹)}{\text{Annual Electricity Savings } (₹)}$ |
| **Annual Carbon Offset ($Tonnes$)** | $\frac{\text{Annual Generation } (kWh) \times \text{Emission Factor } (0.7\,kg/kWh)}{1000}$ |
| **25-Year Cumulative Savings ($₹$)** | $\sum_{t=1}^{25} \Big( \text{Generation}_t \times \text{Tariff}_0 \times (1 + r)^{t-1} \Big) - \text{Initial CapEx}$ |

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack
- **Frontend Core**: [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/postcss`, Custom OKLCH palette, Manrope typography
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/) (Slider, Select, Dialog, Slot), [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/) (ResponsiveContainer, AreaChart, BarChart)
- **Mapping**: Google Maps Embed API with responsive OpenStreetMap fallback

---

<a id="project-architecture"></a>
## 📂 Project Architecture

```plaintext
SolarScope/
├── app/
│   ├── layout.tsx             # Root layout with Manrope font, SiteHeader & Footer
│   ├── page.tsx               # Landing page with hero, SolarVisual & feature cards
│   ├── calculator/page.tsx    # Multi-step rooftop solar calculator wizard
│   ├── results/page.tsx       # Standalone calculation dashboard route
│   ├── how-it-works/page.tsx  # 5-stage walkthrough of the estimation process
│   ├── methodology/page.tsx   # Engineering formulas, pipeline diagram & disclaimers
│   ├── about/page.tsx         # Platform mission, background & advisory notes
│   └── globals.css            # OKLCH design tokens, custom keyframes & utilities
├── components/
│   ├── solar/
│   │   ├── SolarCalculator.tsx     # 4-stage guided estimation wizard
│   │   ├── ResultsDashboard.tsx    # Recharts analytics, score gauge & impact cards
│   │   ├── SolarVisual.tsx         # Animated rooftop home illustration
│   │   ├── OrientationCompass.tsx  # SVG compass dial with fixed pivot needle
│   │   ├── GoogleMapLocation.tsx   # Interactive map with fallback
│   │   └── SiteHeader.tsx          # Glassmorphic navbar with mobile drawer
│   ├── layout/
│   │   └── footer.tsx              # Minimalist responsive footer
│   └── ui/                         # Accessible UI primitives (Button, Slider, Select)
├── data/
│   ├── mockSolarResult.ts     # Calculation engine, types & city dataset
│   └── solar-data.json        # Regional meteorological irradiance values
└── lib/
    ├── solar/                 # Core mathematical formulas & constants
    └── utils.ts               # Class merging utilities (clsx + twMerge)
```

---

<a id="quick-start"></a>
## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- npm, pnpm, or bun

### 1. Clone the repository
```bash
git clone https://github.com/abelalexander18/SolarScope.git
cd SolarScope
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Configure Google Maps
If you have a Google Maps API key, create a `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```
*(If no API key is provided, SolarScope automatically uses the interactive OpenStreetMap fallback with zero setup needed).*

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

<a id="deployment"></a>
## 🌐 Deployment

The easiest way to deploy SolarScope is with [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. (Optional) Add your `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Environment Variables.
4. Click **Deploy**.

---

<a id="advisory-disclaimer"></a>
## ⚖️ Advisory Disclaimer

SolarScope provides high-accuracy planning estimates based on meteorological solar datasets and mathematical models for early-stage feasibility evaluation. It does not replace a certified on-site structural audit, shading drone survey, or official solar vendor quotation prior to commercial commitment.

---

<a id="license"></a>
## 📄 License

This project is licensed under the [MIT License](LICENSE).

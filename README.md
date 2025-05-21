# EzMDT - Legacy Roleplay SASP Report Generator

"**EzMDT - V1.2**" is a web-based application built with React and TypeScript designed to streamline the process of creating detailed incident reports for Legacy Roleplay India's SASP department. The tool supports various report types such as robberies, gang shootouts, vehicle seizures, and cadet training logs. 

It features a user-friendly multi-step interface, seamless API integrations, and real-time report preview capabilities, enabling officers to generate and copy high-quality reports quickly and efficiently.

---

## Features

- Multi-step form flow with conditional rendering based on selected incident type
- Theme switching between light and dark modes, with localStorage persistence
- Officer data integration using Google Sheets API
- Vehicle data fetched dynamically from an external REST API
- Real-time report generation with a preview and clipboard copy functionality
- Loading animations and error states for improved user experience
- Organized and responsive UI using TailwindCSS and modular React components

---

## Technology Stack

- **Frontend Framework:** React with TypeScript
- **Styling:** TailwindCSS
- **Icons:** Lucide-react
- **Data Fetching:** React Query (`@tanstack/react-query`)
- **Form Inputs:** React Select
- **APIs Used:**
  - Google Sheets API for fetching officer data
  - REST API for fetching vehicle model data

---

## Getting Started

To set up the project locally, follow the steps below:

### Prerequisites

Make sure you have the following installed on your system:
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Git-Rexdev/EZMDT
   cd ezmdt

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install

3. Start development server:
    ```bash
    npm run dev
    # or
    yarn dev

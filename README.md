# Farhan Tasneem - Portfolio & CMS Application

A modern, responsive, full-stack personal portfolio and admin management suite built with React 19, TypeScript, Tailwind CSS, Vite, and an Express.js backend.

## Features
- **Cinematic 3D Interactive Portrait & Cards**: Specular lighting, physics-based tilt, and depth.
- **Dynamic CMS & Admin Panel**: Fully manage projects, certifications, skills, experience, education, gallery, and site settings.
- **Visual Landing Page Builder**: Customizable layouts, breakpoints, and live editing.
- **CV & Resume Generator**: Export customizable CVs in PDF and DOCX formats.
- **Persistent Data**: Local file-based JSON database with automatic backup.

---

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. Extract the downloaded `.zip` file to your preferred folder.
2. Open a terminal inside the project directory:
   ```bash
   cd path/to/project-folder
   ```
3. Install project dependencies:
   ```bash
   npm install
   ```

### Running in Development Mode

Start the integrated Express + Vite dev server:
```bash
npm run dev
```

The application will run at:
```
http://localhost:3000
```

### Building for Production

Compile both the frontend bundle and backend server:
```bash
npm run build
```

Then start the production server:
```bash
npm run start
```

---

## Admin Credentials
- Default Admin Email: `admin@example.com` or your configured email in settings
- Access the Admin Dashboard by clicking the lock/admin icon in the navigation bar or footer.

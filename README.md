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

## Deploying to Vercel (via GitHub)

This project has been fine-tuned for one-click hosting on Vercel with zero extra configuration.

### 1. Push to GitHub
Initialize your Git repository and push all files to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Farhan Tasneem Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### 2. Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository from the list and click **"Import"**.
4. Vercel will automatically detect the configuration from `vercel.json` and `package.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(Optional)* In the **Environment Variables** section, you can add:
   - `JWT_SECRET`: `your_secure_custom_secret`
6. Click **"Deploy"**.

Your full-stack portfolio will be live at `https://your-project.vercel.app` with both frontend pages and serverless API endpoints fully operational!

---

## Admin Credentials
- Default Admin Email: `farhantasneem2004@gmail.com`
- Default Admin Password: `AdminFarhan2026!`
- Access the Admin Dashboard via `#admin` or by clicking the admin icon in the navigation bar or footer.

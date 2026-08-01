# Portfolio

A full-stack portfolio site with an admin dashboard for managing the profile, projects, articles, research papers, footer content, and contact messages.

## Prerequisites

- Node.js 18 or later
- MongoDB, either locally or through a hosted connection

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and configure the MongoDB connection. Configure Cloudinary too if you want to upload profile images from the admin dashboard.

3. Seed the database (optional, but recommended for the initial portfolio content):

   ```bash
   npm run seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The application is available at `http://localhost:3000`. Open `/admin` to manage the portfolio.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run seed` | Populate MongoDB with the initial portfolio data. |
| `npm run lint` | Run TypeScript type checking. |
| `npm run build` | Create the production build. |
| `npm start` | Run the production server after building. |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string. |
| `MONGODB_DB_NAME` | Database name; defaults to `habib_portfolio`. |
| `ADMIN_PASSKEY_HASH` | Optional bcrypt hash used to protect admin API routes before a passkey is stored in the database. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image uploads. |
| `CLOUDINARY_API_KEY` | Cloudinary API key for image uploads. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret for image uploads. |

Confia Lar - Integrated Management System

This is a Next.js project bootstrapped with create-next-app.

Confia Lar is a web application designed for managing services, work orders, customers, employees, and tools, focusing on a clean, responsive, and standardized interface.

Technologies Used

The project was built on a modern and robust stack to ensure scalability and maintainability:

Core: Next.js 14+ (App Router) & React

Language: TypeScript (Strict static typing)

Styling: Tailwind CSS (Responsive design and native Dark Mode)

State Management: Redux Toolkit (Slices, Thunks, and Global Store)

Icons: React Icons (Packages fi, lucide, etc.)

UI Components: Custom componentization based on Tailwind.

Development Standards

To maintain code consistency among different developers, we strictly follow the standards below.

1. Commit Pattern (Conventional Commits)

All commit messages must be written in English and follow the Conventional Commits standard:

Structure: <type>: <short description in english>

feat: New features (e.g., feat: add customer dashboard)

fix: Bug fixes (e.g., fix: correct typo in header)

style: Formatting or CSS changes that do not affect logic (e.g., style: update button hover color)

refactor: Code changes that neither fix a bug nor add a feature (e.g., refactor: simplify form logic)

docs: Documentation changes (e.g., docs: update readme)

2. Branch Strategy (Simplified Git Flow)

We do not commit directly to main or dev.

main: Production code (stable).

dev: Development code (staging). Receives Pull Requests.

feature/feature-name: Temporary branch to create a new functionality.

fix/bug-name: Temporary branch for fixes.

Workflow:

Create a branch from dev: git checkout -b feature/new-form

Develop and make your commits.

Open a Pull Request from your branch to dev.

3. Page and Component Standard (UI/UX)

All management screens (CRUD) must follow the "Employees Pattern":

Layout:

Responsive container padding (sm:p-4).

Title (h2) with Dark Mode support.

Form Grid (grid-cols-1 sm:grid-cols-2).

Tables:

Must be Responsive (overflow-x-auto).

Fixed layout (table-fixed w-full) to prevent breaking.

Less important columns hidden on mobile (hidden sm:table-cell).

Action buttons: View (Eye), Edit (Edit), Delete (Trash).

Interaction:

Pagination: Mandatory in all listings (limit of 10 items per page).

Modal: Item details must open in a centered modal with a darkened background (bg-black bg-opacity-75).

Feedback: Show "Loading..." or "No items found" when appropriate.

4. Redux Pattern (State Management)

Each resource (Customers, Tools, etc.) must have its own Slice:

File: src/store/nameSlice.ts

Thunks: fetch..., create..., update..., delete... (async operations).

State: Must contain { data: [], loading: boolean, error: string | null }.

Typing: Exported TypeScript interfaces (e.g., export interface Customer { ... }).

Getting Started

To run the project locally:

Install dependencies:

npm install
# or
yarn install


Run the development server:

npm run dev
# or
yarn dev


Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

Important Folder Structure

/src/app: Next.js Routes and Pages.

/src/components: Reusable components (Layout, Forms, UI).

/src/store: Redux Configuration and Slices.

/public: Static images (Logos, icons).

Learn More

To learn more about the base technologies:

Next.js Documentation - learn about Next.js features and API.

Learn Next.js - an interactive Next.js tutorial.

Redux Toolkit Documentation - official standard for Redux.

Tailwind CSS Documentation - style utility guide.

Deploy

The easiest way to deploy your Next.js app is to use the Vercel Platform.

Check out our Next.js deployment documentation for more details.
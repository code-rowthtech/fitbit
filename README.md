# Fitbit Patient Monitoring — Public UI Showcase

> This is a limited source-code showcase. Production API clients, endpoint definitions, Fitbit integration requests, upload implementation, live map integration, and the private deployment workflow have been removed. Login, recovery, data loading, saving, synchronization, and exports are intentionally unavailable. The login and recovery screens can be viewed locally; protected dashboards remain UI source examples and are not an interactive demo.


A React application for viewing Fitbit health data and managing patients, doctors, clinical notes, and reports. The interface supports admin, doctor, and patient roles, with role-dependent navigation and controls.

This repository contains frontend UI examples. The workflow descriptions below explain the original application design; they do not indicate enabled backend features in this public edition. Reconnecting a backend requires implementing your own integration layer.

## UI features represented in the source

- Email and password login, protected routes, and password recovery with OTP verification.
- Patient creation and editing, patient profiles, and doctor management.
- Fitbit connection requests and manual patient data synchronization.
- Patient dashboards for activity, sleep, heart rate and body metrics, exercise, and nutrition, with date filters and expandable charts.
- GPS route visualization for exercise records that include tracking data.
- Patient notes, alerts, and report creation, viewing, and downloads.

Data availability depends on the backend, the patient's Fitbit connection, and the data returned for the selected period.

## What this website does

The website brings patient records and Fitbit measurements into one workspace. A care team can select a patient, review their recorded activity and health trends, add notes, inspect alerts supplied by the backend, and export reports for a selected month or year.

For example, a doctor can open a patient's dashboard, review steps and sleep over a chosen period, compare values in the report table, and record an observation in the patient's notes. An administrator can maintain doctor and patient records and assign patients to doctors. A patient login starts from the patient identifier returned by the backend.

The browser displays data and sends requests. The backend stores records, determines which records a user can access, communicates with Fitbit, and supplies metrics, alerts, and report files. Starting this frontend alone does not create a working Fitbit integration or populate patient data.

## User roles and navigation

| Role | Behavior implemented in the frontend |
| --- | --- |
| Admin | The main menu includes Doctors and Patients. Patient lists can be filtered by doctor. Doctor and patient forms provide record-management controls. |
| Doctor | The main navigation links and doctor-selection filter are hidden. The patient sidebar supports opening the patients returned by the API. The profile menu loads the doctor's record and allows profile editing. |
| Patient | After login, the dashboard URL uses the user's `patientId`. The current shared layout still contains management controls; a dedicated patient-only interface is not fully separated. |

These are interface behaviors, not a complete permissions matrix. The route guard checks authentication rather than a required role, and some controls are shared across roles. Backend authorization must determine the records and operations permitted for each account.

The main workspace contains a top bar, a patient sidebar, and the selected page. The sidebar supports patient-name search, **New** and **Old** patient categories, a list-view shortcut, and doctor filtering where shown. These categories come from the patient's `patientType`; their business meaning is determined by the organization using the backend.

## Main screens and workflows

### 1. Login and password recovery

Sign in with the email address and password of an existing backend account. The frontend saves the returned session and opens a patient dashboard. When no patient is selected or available, the dashboard can show an empty state until a patient is available through the sidebar.

The recovery screens collect an email, verify an OTP, and submit a new password. The recovery email is kept in session storage while moving between those screens. Email delivery, OTP validation, and password updates depend on backend endpoints.

The sign-up screen is present for interface purposes, but its submit handler is unfinished. It cannot currently create an account.

### 2. Patient management

The Patients page provides a paginated table with search, doctor filtering, a date-range filter, and active/inactive filtering. Users can open a patient's dashboard, edit a record, or change its active status through a confirmation dialog.

The multi-step patient form collects the following information:

- Identity and contact details: name, email, phone number, gender, date of birth, and marital status.
- Address and registration information.
- Health background: allergies, current medications, medical history, and condition.
- Doctor assignment where applicable.
- Fitbit consent, patient category, and optional synchronization start and end dates.

The form sends these values to the backend; patient IDs, persistence, account provisioning, and any resulting notifications are backend responsibilities. Changing active status updates the record rather than performing a permanent deletion.

### 3. Doctor management

The Doctors page provides a searchable, paginated list with active/inactive filtering, record creation, record editing, and status changes with confirmation.

Doctor forms include personal and contact details, qualifications, specializations, skills, experience, languages, medical license information, hospital or clinic information, consultation details, timings, and profile information. Supporting modals can add qualifications, skills, and specializations through backend master-data endpoints. Location selectors load states and cities from the API.

The current create-doctor payload includes `role: "admin"`. Confirm the backend's interpretation of this field before relying on newly created accounts having doctor permissions.

### 4. Patient profile and Fitbit connection

The dashboard header displays patient information and provides access to record editing, Fitbit connection and synchronization actions, notes, reports, and alerts.

A typical connection workflow is:

1. Create or select a patient and record their consent as appropriate.
2. Choose **Connect to Fitbit** to request the connection flow from the backend.
3. Complete the authorization process provided by the backend and Fitbit.
4. Return to the patient dashboard and check the connection status.
5. Use the synchronization control to request updated patient data.
6. Select a date range and review the available measurements.

The frontend does not contain the Fitbit OAuth server implementation. The backend must configure the Fitbit application, authorization callbacks, access tokens, and data retrieval. `/fitbit-success` is a success display page and attempts to close its window; it is not itself a token-exchange endpoint.

Patients with a **Not Connected** or **Pending** Fitbit status see a connection message in place of the metric sections. Notes and reports can be opened separately from those sections.

### 5. Health dashboard sections

| Section | Main cards currently mounted in the dashboard | What users review |
| --- | --- | --- |
| Activity Data | Steps, active minutes, calories burned, distance | Recorded movement and activity over the selected period. |
| Sleep Data | Sleep stages, duration, efficiency, awakenings | Recorded sleep patterns and interruptions. |
| Heart Rate And Body Metrics | Resting heart rate, weight | Heart-rate and weight trends returned by the API. |
| Exercise Data | Exercise sessions, GPS tracking, elevation | Recorded workouts, available routes, and elevation data. |
| Nutrition | Calories consumed, water intake | Logged food-energy and hydration data. |

Sections can be expanded or collapsed, and individual cards can be expanded for closer inspection. Date and period controls request data for the chosen interval; the available controls vary by section and card. Charts, tables, units, and empty states depend on the metric and the API response.

Report rows additionally include continuous heart rate, BMI, and body fat percentage. A report row or an unused component file does not imply there is a corresponding active dashboard card. The currently mounted heart-rate section contains resting heart rate and weight cards.

GPS visualization requires an exercise record with track points. The map draws the route and its start and end markers using Google Maps. It displays recorded locations returned by the backend; the frontend does not implement live device tracking.

### 6. Patient notes

The Notes view lists notes for the selected patient with pagination. Users can add a title and rich-text content using CKEditor, open a note for editing, and delete a note after confirmation. Successful changes refresh the notes list.

Notes are stored through the backend and remain associated with the patient ID. They are separate from Fitbit measurements and do not modify the patient's wearable data.

### 7. Reports and exports

The Reports view offers **Monthly** and **Yearly** modes. Monthly tables show values by day; yearly tables show values by month. Users can move between periods, expand the report, and request a CSV download after confirming the selected month or year.

Report metrics cover activity, sleep, heart rate, weight, BMI, body fat, exercise, GPS, elevation, calories consumed, and water intake. Availability depends on the backend's report response.

The report interface also supports saving minimum and maximum ranges for metrics and displaying backend-supplied colors. For eligible days with missing or zero step data, users can add or update a reason through the report's day-header interaction. Those reasons are saved separately through the no-data-reason API.

The frontend requests report data and CSV files from the backend. It does not generate the full report dataset locally, and the export endpoints currently target CSV files.

### 8. Alerts

The patient's alert panel loads a paginated list from the backend and supports date filtering. It displays alert titles, descriptions, severity, and associated information where returned. Empty and loading states are shown when appropriate.

Alert rules and thresholds are supplied by the backend; this repository does not implement a continuous monitoring service or an alert-generation engine.

## Technology

React 19, Vite 7, React Router 7, Redux Toolkit, Redux Saga, Axios, Bootstrap 5, React Bootstrap, and Chart.js. GPS routes use the Google Maps JavaScript API.

## Local setup

### Prerequisites

- Node.js 20.19+ within the Node 20 release line, or Node.js 22.12+ (as required by the locked Vite dependencies).
- npm.
- No backend or credentials are required to view the public screens. Backend-dependent features are disabled.

Run the following commands from this repository's root (`fitbit/`):

```bash
npm ci --legacy-peer-deps
```

The existing Docker build also uses `--legacy-peer-deps` to install the dependency tree.

Start the UI:

```bash
npm run dev
```

Open `http://localhost:5173`. Vite listens on `0.0.0.0` and requests port `5173`; check its terminal output if that port is occupied. Login submissions return a showcase-unavailable message. No production API URL or Google Maps key is needed or read by this edition.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Generate the production bundle in `dist/`. |
| `npm run preview` | Serve the built bundle locally for review. |
| `npm run lint` | Run ESLint against the project. |

There is currently no automated test script in `package.json`.

## Application routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/`, `/login` | Login | Public |
| `/signup` | Sign-up form; submission is not implemented | Public |
| `/forgot-password` | Request password recovery | Public |
| `/verify-otp` | Verify recovery OTP | Public |
| `/change-password` | Set a new password | Public |
| `/fitbit-success` | Fitbit connection success screen | Public |
| `/doctors` | Doctor management | Authenticated |
| `/patients` | Patient management | Authenticated |
| `/patient-dashboard/:id` | Patient metrics, notes, alerts, and reports | Authenticated |

Unmatched routes display the not-found page. Protected routes require a signed-in user; role permissions and access to individual patient records must also be enforced by the backend.

## Public edition boundaries

The UI components, styles, charts, Redux actions/reducers, and form structures remain for code review. Feature API modules preserve their named exports as disabled adapters so existing imports resolve, but every operation rejects with the same showcase-unavailable message and sends no request.

Removed implementations include:

- API endpoint constants, Axios client configuration, and feature request construction.
- Live authentication and recovery service calls, plus the unused authentication context.
- Fitbit connection, synchronization, metric retrieval, and report/notes/patient/doctor API calls.
- S3 presigned-upload requests and direct uploads.
- Google Maps loading and its embedded key; map components now display a placeholder.
- The unused fake backend containing a sample token and credentials, and its outdated authentication guide.
- The server-specific deployment workflow.

Protected pages are not exposed through a demo authentication bypass. The showcase does not restore production sessions. UI forms and saga/state code still show domain concepts and data structures; this edition is suitable for sharing those UI examples, rather than keeping all application behavior confidential.

## Production build and hosting

Build and inspect the static showcase:

```bash
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host. Since the app uses `BrowserRouter`, configure the host to serve `index.html` for application routes such as `/patient-dashboard/:id`. The included Nginx configuration provides this fallback.

### Docker Compose

Docker and Docker Compose are required. No environment file is needed for the showcase. Run:

```bash
docker compose up -d --build
```

Open `http://localhost:5078`. The multi-stage Dockerfile builds with Node 20 Alpine and serves `dist/` through Nginx on container port `80`; Compose maps host port `5078` to that port.

`.dockerignore` excludes local secrets, private integrations, data exports, Git history, and development artifacts from the build context.

To stop the service:

```bash
docker compose down
```

## Architecture of the public edition

```text
React page or form
    -> Redux action and saga
    -> Disabled feature API adapter
    -> Showcase-unavailable response
    -> Existing error or empty-state UI
```

`src/main.jsx` mounts the Redux provider and toast notifications. `src/App.jsx` defines browser routes and wraps protected screens in the shared layout. Feature folders under `src/redux/` group actions, reducers, sagas, and disabled API adapters. `src/services/showcase.js` supplies the common unavailable response.

No backend server, database schema, migrations, patient data, or Fitbit developer configuration is supplied.

## Project structure

```text
src/
├── components/       # Forms, modals, route guards, and map components
├── constants/        # Disabled upload adapter
├── contexts/         # Sidebar state
├── helpers/          # UI compatibility and utility helpers
├── layouts/          # Layout, sidebar, and top bar
├── pages/            # Login, recovery, doctors, and patient dashboard pages
├── redux/            # Store, reducers, actions, sagas, and feature API calls
├── services/         # Showcase response and disabled authentication adapters
├── utils/            # Token validation and session cleanup
├── App.jsx           # Application routes
└── main.jsx          # React entry point and Redux provider
```

## Troubleshooting and current limitations

- **Login, recovery, saves, or downloads do not work:** These are deliberately disabled in this public edition.
- **Dashboards are not accessible after login:** No working login or demo bypass is supplied. Review the dashboard components in the source.
- **GPS map shows a placeholder:** Live map integration was removed.
- **Sign-up does nothing:** The sign-up form has a placeholder submit handler.
- **Refreshing a nested URL returns 404:** Configure the static host to serve `index.html` for application routes.

## Publishing this showcase safely

`.gitignore` excludes environment files, credential/key files, private integration folders, backups, and data-export folders from future additions. `.dockerignore` also excludes these from container builds. Neither file removes previously committed content or hides the contents of browser bundles.

The repository's existing Git history contains the removed Google Maps key and original integration source. Do not make that history public if the goal is to keep those implementations private. Revoke or replace the exposed key in its provider account, and publish a fresh repository containing only the cleaned working files. Keep the original repository private; rewriting shared history is not performed by this cleanup.

The source cleanup does not revoke provider credentials, change GitHub repository visibility, or publish anything. Real patient records and exports must remain outside the public repository. This is a targeted cleanup, not a guarantee that every historical secret or private detail has been identified.

# Stockroom — Inventory Management Application

A full-stack **Inventory Management Application** built for the **Levelworks Internship Assignment**.

The application uses a **Lit frontend**, a custom **ERPNext/Frappe backend**, and **Docker Compose** to provide a complete inventory management system that can be started locally with a single command.

---

## 🚀 Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| ERPNext Backend | http://localhost:8000 |

> This project is designed to run locally using Docker Compose.

---

## ✨ Features

### Admin

- Add inventory items
- Edit inventory items
- Delete inventory items
- Upload item images
- Add tags
- Add item descriptions
- Set item date

### End User

- View inventory items
- Grid view
- List view
- Search by item name
- Search by description
- Filter by tag
- Sort by item name
- Sort by date added
- Ascending / descending sorting
- Empty inventory state
- No-search-results state

---

## 🛠️ Tech Stack

### Frontend
- **Lit**
- **JavaScript**
- **Vite**
- **Nginx**

### Backend
- **ERPNext v15**
- **Frappe Framework**
- **Python**
- Custom `Inventory Item` DocType
- ERPNext REST API

### Database & Services
- **MariaDB**
- **Redis**

### DevOps
- **Docker**
- **Docker Compose**

---

## 🏗️ Architecture

```text
                    ┌────────────────────────┐
                    │      Lit Frontend      │
                    │     localhost:8080     │
                    └────────────┬───────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌────────────────────────┐
                    │   ERPNext / Frappe     │
                    │     localhost:8000     │
                    │                        │
                    │  Inventory Item DocType│
                    └────────────┬───────────┘
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                     ▼                       ▼
              ┌─────────────┐        ┌─────────────┐
              │   MariaDB   │        │    Redis    │
              │  Database   │        │    Cache    │
              └─────────────┘        └─────────────┘
```

The frontend and backend are maintained as separate services.

The Lit frontend communicates with ERPNext through its REST API.

---

## 📁 Project Structure

```text
.
├── docker-compose.yml
├── README.md
├── .gitignore
│
├── backend/
│   ├── Dockerfile
│   ├── init-scripts/
│   │   └── start.sh
│   └── apps/
│       └── inventory_management/
│           ├── README.md
│           ├── hooks.py
│           ├── modules.txt
│           ├── requirements.txt
│           ├── setup.py
│           └── inventory_management/
│               └── inventory_management/
│                   └── doctype/
│                       └── inventory_item/
│                           ├── inventory_item.json
│                           └── inventory_item.py
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── src/
        ├── main.js
        ├── components/
        │   ├── app-root.js
        │   ├── confirm-dialog.js
        │   ├── filter-bar.js
        │   ├── item-card.js
        │   ├── item-collection.js
        │   ├── item-form-modal.js
        │   ├── search-bar.js
        │   ├── sort-bar.js
        │   ├── toast-notification.js
        │   └── view-toggle.js
        ├── services/
        │   └── erpnext-api.js
        └── styles/
            └── tokens.css
```

---

## ⚙️ Prerequisites

Before running the application, make sure you have:

- Docker Desktop
- Docker Compose v2
- At least **4 GB RAM** available
- Ports **8000** and **8080** available

Verify Docker Compose:

```bash
docker compose version
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/vivekk-patil/inventory-management-app-vivekpatil.git
cd inventory-management-app-vivekpatil
```

## 2. Start the Application

```bash
docker compose up --build
```

Docker Compose will start:

- MariaDB
- Redis
- ERPNext/Frappe backend
- Custom Inventory Management application
- Lit frontend
- Nginx

### First Startup

The first startup may take several minutes because ERPNext needs to:

1. Start MariaDB
2. Start Redis
3. Create the ERPNext site
4. Register the custom `inventory_management` application
5. Install the custom application
6. Run database migrations
7. Configure developer mode
8. Configure frontend CORS
9. Start the ERPNext web server
10. Build and serve the frontend

The backend initialization is handled automatically by:

```text
backend/init-scripts/start.sh
```

---

# 🔐 ERPNext API Configuration

The frontend communicates with ERPNext using API Key and API Secret authentication.

## Generate API Credentials

After the backend starts, open:

```text
http://localhost:8000
```

Log in to ERPNext as an administrator.

Then navigate to:

```text
Administrator
   ↓
My Settings
   ↓
API Access
   ↓
Generate Keys
```

Copy the API Key and API Secret.

## Configure Environment Variables

Create a `.env` file in the project root:

```env
ERPNEXT_API_KEY=your_api_key
ERPNEXT_API_SECRET=your_api_secret
```

**Do not commit `.env` to GitHub.** The project `.gitignore` excludes environment files.

## Rebuild Frontend

After configuring the API credentials:

```bash
docker compose up --build -d frontend
```

Then open:

```text
http://localhost:8080
```

---

# ▶️ Everyday Usage

Start the application:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

Open the frontend:

```text
http://localhost:8080
```

Open ERPNext:

```text
http://localhost:8000
```

Stop the application:

```bash
docker compose down
```

---

# 📦 Inventory Item DocType

The project contains a custom ERPNext/Frappe application named:

```text
inventory_management
```

It defines a custom DocType:

```text
Inventory Item
```

The DocType supports:

- Item Name
- Description
- Image
- Tags
- Date Added

The DocType definition is located at:

```text
backend/apps/inventory_management/
```

Database migrations are automatically executed during backend startup.

---

# 🔌 REST API

The frontend communicates directly with ERPNext's REST API.

### Get Inventory Items

```http
GET /api/resource/Inventory%20Item
```

### Create Inventory Item

```http
POST /api/resource/Inventory%20Item
```

### Update Inventory Item

```http
PUT /api/resource/Inventory%20Item/{name}
```

### Delete Inventory Item

```http
DELETE /api/resource/Inventory%20Item/{name}
```

### Upload Image

```http
POST /api/method/upload_file
```

The frontend uses ERPNext REST API query parameters for search, filtering, sorting, and retrieving inventory records.

---

# 🧩 Frontend Component Architecture

The frontend is implemented using reusable Lit components.

The main application component:

```text
app-root
```

manages:

- Inventory items
- Search state
- Selected filters
- Sorting
- View mode
- Modal visibility
- Delete confirmation
- Notifications

Reusable components include:

```text
search-bar
filter-bar
sort-bar
view-toggle
item-card
item-collection
item-form-modal
confirm-dialog
toast-notification
```

Components communicate using `CustomEvent`s.

A global state-management library is not used because the application is small enough to manage state locally.

---

# 🔄 Application Flow

```text
User
 │
 ▼
Lit Frontend
 │
 │ API Request
 ▼
ERPNext REST API
 │
 ▼
Inventory Item DocType
 │
 ▼
MariaDB
```

For image uploads:

```text
User
 │
 ▼
Lit Frontend
 │
 │ upload_file API
 ▼
ERPNext
 │
 ▼
File Storage
```

---

# 📝 Assumptions & Implementation Notes

## UI Design

No Figma file was available during implementation.

Therefore, the interface was designed from the written assignment requirements using a stockroom/shelf-inspired visual direction.

The main styling tokens are maintained in:

```text
frontend/src/styles/tokens.css
```

## Tags

Tags are stored as a comma-separated field on the `Inventory Item` DocType.

This keeps the form and REST payload simple while supporting tag-based filtering.

A production implementation could use a dedicated Tag DocType and relational field for stronger data integrity.

## Admin Mode

The current assignment implementation uses an Admin Mode UI toggle to expose Add, Edit, and Delete functionality.

There is no separate authentication flow between Admin and End User in this assignment build.

For a production deployment, these capabilities should be protected using ERPNext roles and permissions.

## API Authentication

The frontend uses ERPNext API Key and API Secret authentication.

The credentials are supplied through environment variables.

The `.env` file is intentionally excluded from source control.

For production, a backend-for-frontend/proxy architecture would be preferable so API credentials are not exposed to the client application.

## Image Storage

Images are uploaded to ERPNext using:

```text
/api/method/upload_file
```

The uploaded files are then served through the ERPNext backend.

## CSRF Configuration

Because this assignment uses a Lit frontend communicating directly with the ERPNext REST API, the local ERPNext site is configured during container initialization to support the frontend integration.

This configuration is intended for the local development/assignment environment and should be reviewed and hardened before production deployment.

## Independent Frontend and Backend

The frontend is intentionally kept separate from ERPNext's internal Frappe asset pipeline.

The two services communicate through REST APIs.

This keeps the architecture modular and makes it easier to replace or extend either side independently.

---

# 🧪 Testing Checklist

The following functionality has been tested:

- [x] Add inventory item
- [x] Edit inventory item
- [x] Delete inventory item
- [x] Upload item image
- [x] Search by item name
- [x] Search by description
- [x] Filter by tag
- [x] Sort by item name
- [x] Sort by date added
- [x] Ascending sorting
- [x] Descending sorting
- [x] Grid view
- [x] List view
- [x] Empty inventory state
- [x] No search results state
- [x] Frontend ↔ ERPNext REST API integration
- [x] Docker Compose startup
- [x] MariaDB connectivity
- [x] Redis connectivity
- [x] ERPNext custom DocType migration

---

# 🐳 Docker Services

The application consists of:

```text
frontend
backend
mariadb
redis
```

Check all services:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs -f backend
```

View frontend logs:

```bash
docker compose logs -f frontend
```

View all logs:

```bash
docker compose logs -f
```

---

# 🛠️ Troubleshooting

## Backend keeps restarting

Check:

```bash
docker compose logs -f backend
```

During the first startup, ERPNext may take several minutes to initialize the site and database.

## Frontend cannot connect to ERPNext

Check:

```bash
docker compose ps
```

Then open:

```text
http://localhost:8000
```

Verify ERPNext is accessible and that the API credentials in `.env` are correct.

## CORS Error

Make sure the frontend is accessed through:

```text
http://localhost:8080
```

The backend is configured to allow the frontend origin.

## API Authentication Error

If the API returns `403`, verify:

- API Key
- API Secret
- ERPNext user permissions
- `.env` configuration
- Frontend rebuild after changing `.env`

Then rebuild:

```bash
docker compose up --build -d frontend
```

## CSRF Error

If a write request returns a CSRF error, rebuild the backend after the ERPNext site configuration changes:

```bash
docker compose down
docker compose up --build -d
```

## Check Backend API Requests

Use:

```bash
docker compose logs --tail=100 backend
```

---

# 🔒 Security

The following files and credentials should not be committed:

```text
.env
*.log
```

Never publish:

- ERPNext API Secret
- Passwords
- Private credentials
- Production environment variables

---

# 📌 Production Considerations

This project is designed for a local internship assignment environment.

For production deployment, the following improvements would be recommended:

- Use a backend-for-frontend/API proxy
- Keep API credentials server-side
- Implement proper authentication and authorization
- Use ERPNext role-based permissions
- Replace the Admin Mode UI toggle with real permissions
- Use HTTPS
- Harden CSRF/CORS configuration
- Use production WSGI/server configuration
- Add automated tests
- Add CI/CD
- Use production database and backup strategy
- Use proper image/file storage
- Add monitoring and logging

---

# 📄 Assignment Scope

The application implements the required inventory management functionality.

### Admin

- Create inventory items
- Update inventory items
- Delete inventory items

### End User

- Browse inventory
- Search inventory
- Filter inventory
- Sort inventory
- Switch between Grid and List views

The complete environment can be started using:

```bash
docker compose up --build
```

---

# 🔗 Repository

https://github.com/vivekk-patil/inventory-management-app-vivekpatil

---

# 👨‍💻 Author

**Vivek Patil**

Built as part of the **Levelworks Internship Assignment**.

---

## ⭐ Project Summary

**Stockroom** is a modular inventory management application combining:

```text
Lit
+
ERPNext / Frappe
+
REST API
+
MariaDB
+
Redis
+
Docker
```

The architecture keeps the frontend and backend independent while providing a complete containerized development environment.

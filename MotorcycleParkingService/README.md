# Motorcycle Parking Service - Backend

A robust, secure, and comprehensive backend service built with ASP.NET Core Web API for managing motorcycle parking records. It supports authentication, user management, role-based authorization, and CRUD operations for parking logs.

---

## 🚀 Features & Technology Stack

- **Core Framework**: ASP.NET Core (built on .NET 8)
- **Database**: SQLite (managed with Entity Framework Core)
- **Authentication & Identity**: ASP.NET Core Identity with JWT Bearer Token Authentication
- **Object Mapping**: AutoMapper for DTO to Model translation
- **Request Validation**: FluentValidation for robust API input checking
- **API Documentation**: Swagger/OpenAPI integration with JWT Authorization support

---

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- A command-line terminal (PowerShell, Bash, or cmd)
- *Optional*: [SQLite Viewer](https://sqliteviewer.app/) or DB Browser for SQLite to explore the database.

---

## 🏁 Getting Started

### 1. Restore Dependencies
Navigate to the project directory and restore NuGet packages:
```bash
dotnet restore
```

### 2. Run Database Migrations
Create and update the local SQLite database (`app.db`) by applying the Entity Framework migrations:
```bash
dotnet ef database update
```
*(Note: If you don't have the `dotnet-ef` tool installed, install it globally via `dotnet tool install --global dotnet-ef`)*

### 3. Run the Application
Start the backend development server:
```bash
dotnet run
```
By default, the application runs on:
- `http://localhost:5000` (HTTP)
- `https://localhost:5001` (HTTPS)
*(Check the console output or `Properties/launchSettings.json` for exact ports).*

---

## 🔐 Default Admin Account

Upon initial startup, the database is automatically seeded with a default Administrator user:
- **Email/Username**: `admin@parkir.com`
- **Password**: `Admin123!`
- **Role**: `Admin`

---

## 📡 API Endpoints

### Auth Controller (`/api/Auth`)
- **`POST /api/Auth/login`**: Authenticate a user and receive a JWT access token.
- **`GET /api/Auth/me`**: *(Authorized)* Retrieve details of the currently authenticated user.

### Parking Records Controller (`/api/ParkingRecords`)
*All endpoints require Bearer Token authorization.*
- **`GET /api/ParkingRecords`**: Retrieve all parking records.
- **`GET /api/ParkingRecords/{id}`**: Retrieve a specific parking record by ID.
- **`POST /api/ParkingRecords`**: Create a new parking record.
- **`PUT /api/ParkingRecords/{id}`**: Update an existing parking record.
- **`DELETE /api/ParkingRecords/{id}`**: Delete/remove a parking record.

---

## 📖 Swagger / API Documentation

When running in **Development** environment, you can access the Swagger UI directly in your browser to test endpoints:
- **Swagger URL**: `http://localhost:<PORT>/swagger` or `https://localhost:<PORT>/swagger`

#### Testing Authorized Endpoints in Swagger:
1. Call the `/api/Auth/login` endpoint using the default admin credentials.
2. Copy the token from the response.
3. Click the **Authorize** button at the top right of the Swagger UI page.
4. Enter `Bearer <your_token>` and click Authorize.

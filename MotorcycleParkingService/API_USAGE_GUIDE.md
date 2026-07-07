# Motorcycle Parking Service - API Usage Guide

This guide provides comprehensive documentation on using the Motorcycle Parking Service backend API. It includes authentication details, response formats, endpoint specifications, validation rules, sequential cURL workflows, and guidelines for testing via the Swagger UI.

---

## 📌 API Information

- **Base URL**:
  - HTTP: `http://localhost:5000`
  - HTTPS: `https://localhost:5001`
- **Default Port**: Configure ports in `Properties/launchSettings.json`.
- **Path Prefix**: `/api/`
- **Headers**:
  - `Content-Type: application/json` (Required for request bodies)
  - `Authorization: Bearer <your_jwt_token>` (Required for all protected endpoints)

---

## 🔐 Default Test Account

Use the seeded administrator account for testing and initial requests:

- **Email**: `admin@parkir.com`
- **Password**: `Admin123!`
- **Role**: `Admin`

---

## 🔄 Authentication Flow

The API uses JSON Web Token (JWT) Bearer authentication to secure endpoints.

1. **Obtain Token**: Send a `POST` request to `/api/Auth/login` containing your email and password.
2. **Retrieve Token**: Upon successful authentication, the server returns a JWT access token and its expiration date.
3. **Use Token**: Add the token to the header of all protected requests:
   ```http
   Authorization: Bearer <your_jwt_token_here>
   ```

---

## 📦 Response Format

All responses from this API follow a standardized envelope format represented by `ApiResponseDto<T>`:

### Success Response

```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "errors": []
}
```

### Error Response

Includes a general error message and a collection of specific validation or error details:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "License plate cannot be empty",
    "Entry time cannot be in the past"
  ]
}
```

---

## 🛡️ Validation Rules

Inputs are validated using FluentValidation. If a validation check fails, the API responds with a `400 Bad Request` containing details in the `errors` array.

| Field                       | Rules                                                        | Associated DTO                                     |
| :-------------------------- | :----------------------------------------------------------- | :------------------------------------------------- |
| **Login - Email**           | Required, must be a valid email format.                      | `LoginDto`                                         |
| **Login - Password**        | Required.                                                    | `LoginDto`                                         |
| **Parking - License Plate** | Required, cannot be empty.                                   | `CreateParkingRecordDto`, `UpdateParkingRecordDto` |
| **Parking - Entry Time**    | Required, must be in the future (greater than current time). | `CreateParkingRecordDto`, `UpdateParkingRecordDto` |
| **Parking - Notes**         | Optional, additional information.                            | `CreateParkingRecordDto`, `UpdateParkingRecordDto` |

---

## 📡 API Endpoints

### 1. Authentication Endpoints

#### `POST /api/Auth/login`

Authenticates a user and generates a JWT.

- **Request Body (`LoginDto`)**:
  ```json
  {
    "email": "admin@parkir.com",
    "password": "Admin123!"
  }
  ```
- **Success Response (200 OK - Data is `AuthResponseDto`)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "expiration": "2026-07-08T04:00:00Z",
      "user": {
        "id": "e44d3209-e85d-4f11-9a72-881dc7187e14",
        "userName": "admin@parkir.com",
        "email": "admin@parkir.com",
        "firstName": "API",
        "lastName": "Administrator",
        "createdAt": "2026-07-07T14:00:00Z",
        "roles": ["Admin"]
      }
    },
    "errors": []
  }
  ```

#### `GET /api/Auth/me`

Retrieves information about the currently logged-in user. _(Requires Authentication)_

- **Headers**: `Authorization: Bearer <Token>`
- **Success Response (200 OK - Data is `UserDto`)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": "e44d3209-e85d-4f11-9a72-881dc7187e14",
      "userName": "admin@parkir.com",
      "email": "admin@parkir.com",
      "firstName": "API",
      "lastName": "Administrator",
      "createdAt": "2026-07-07T14:00:00Z",
      "roles": ["Admin"]
    },
    "errors": []
  }
  ```

---

### 2. Parking Record Endpoints

#### `GET /api/ParkingRecords`

Retrieves all parking logs. _(Requires Authentication)_

- **Headers**: `Authorization: Bearer <Token>`
- **Success Response (200 OK - Data is `List<ParkingRecordDto>`)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": "4cf76bf6-d7e1-4c12-9c3a-23fa4d17ab8a",
        "motorcycleLicensePlate": "B 1234 ABC",
        "motorcycleBrandName": "Honda",
        "entryTime": "2026-07-08T08:00:00+07:00",
        "exitTime": null,
        "estimatedFee": 0.0,
        "isNeedWashing": false,
        "notes": "Will be picked up tonight"
      }
    ],
    "errors": []
  }
  ```

#### `GET /api/ParkingRecords/{id}`

Retrieves a parking record by its unique ID. _(Requires Authentication)_

- **Headers**: `Authorization: Bearer <Token>`
- **Success Response (200 OK - Data is `ParkingRecordDto`)**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": "4cf76bf6-d7e1-4c12-9c3a-23fa4d17ab8a",
      "motorcycleLicensePlate": "B 1234 ABC",
      "motorcycleBrandName": "Honda",
      "entryTime": "2026-07-08T08:00:00+07:00",
      "exitTime": null,
      "estimatedFee": 0.0,
      "isNeedWashing": false,
      "notes": "Will be picked up tonight"
    },
    "errors": []
  }
  ```

#### `POST /api/ParkingRecords`

Creates a new parking record. _(Requires Authentication)_

- **Headers**: `Authorization: Bearer <Token>`
- **Request Body (`CreateParkingRecordDto`)**:
  ```json
  {
    "motorcycleLicensePlate": "B 1234 ABC",
    "entryTime": "2026-07-08T08:00:00+07:00",
    "isNeedWashing": false,
    "notes": "Will be picked up tonight"
  }
  ```
- **Success Response (200 OK - Data is `ParkingRecordDto`)**:
  ```json
  {
    "success": true,
    "message": "Parking record created successfully",
    "data": {
      "id": "4cf76bf6-d7e1-4c12-9c3a-23fa4d17ab8a",
      "motorcycleLicensePlate": "B 1234 ABC",
      "motorcycleBrandName": null,
      "entryTime": "2026-07-08T08:00:00+07:00",
      "exitTime": null,
      "estimatedFee": 0.0,
      "isNeedWashing": false,
      "notes": "Will be picked up tonight"
    },
    "errors": []
  }
  ```

#### `PUT /api/ParkingRecords/{id}`

Updates details of an existing parking record. _(Requires Authentication)_

- **Headers**: `Authorization: Bearer <Token>`
- **Request Body (`UpdateParkingRecordDto`)**:
  ```json
  {
    "motorcycleLicensePlate": "B 1234 ABC",
    "entryTime": "2026-07-08T08:00:00+07:00",
    "exitTime": "2026-07-08T12:00:00+07:00",
    "estimatedFee": 10000.0,
    "isNeedWashing": true,
    "notes": "Scratch on the left side, washed"
  }
  ```
- **Success Response (200 OK - Data is `ParkingRecordDto`)**:
  ```json
  {
    "success": true,
    "message": "Parking record updated successfully",
    "data": {
      "id": "4cf76bf6-d7e1-4c12-9c3a-23fa4d17ab8a",
      "motorcycleLicensePlate": "B 1234 ABC",
      "motorcycleBrandName": null,
      "entryTime": "2026-07-08T08:00:00+07:00",
      "exitTime": "2026-07-08T12:00:00+07:00",
      "estimatedFee": 10000.0,
      "isNeedWashing": true,
      "notes": "Scratch on the left side, washed"
    },
    "errors": []
  }
  ```

#### `DELETE /api/ParkingRecords/{id}`

Deletes a parking record. _(Requires Authentication)_

- **Headers**: `Authorization: Bearer <Token>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Parking record deleted successfully",
    "data": true,
    "errors": []
  }
  ```

---

## 💻 Example Workflow in cURL

Ensure you replace `<PORT>` with the actual active port (e.g., `5001`) and run the commands in order.

### Step 1: Login to Obtain JWT Token

```bash
curl -X POST "https://localhost:5001/api/Auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"admin@parkir.com\",\"password\":\"Admin123!\"}" \
     -k
```

_Note down the `"token"` value from the response (denoted as `[TOKEN]` below)._

### Step 2: Get Current Logged-in User Info

```bash
curl -X GET "https://localhost:5001/api/Auth/me" \
     -H "Authorization: Bearer [TOKEN]" \
     -k
```

### Step 3: Create a Parking Record (Check-In)

```bash
curl -X POST "https://localhost:5001/api/ParkingRecords" \
     -H "Authorization: Bearer [TOKEN]" \
     -H "Content-Type: application/json" \
     -d "{\"motorcycleLicensePlate\":\"B 9999 XYZ\",\"entryTime\":\"2026-07-08T10:00:00+07:00\",\"isNeedWashing\":false,\"notes\":\"Helmet on mirror\"}" \
     -k
```

_Note down the created record's `"id"` (denoted as `[RECORD_ID]` below)._

### Step 4: Get All Parking Records

```bash
curl -X GET "https://localhost:5001/api/ParkingRecords" \
     -H "Authorization: Bearer [TOKEN]" \
     -k
```

### Step 5: Update a Parking Record (Check-Out/Modify)

```bash
curl -X PUT "https://localhost:5001/api/ParkingRecords/[RECORD_ID]" \
     -H "Authorization: Bearer [TOKEN]" \
     -H "Content-Type: application/json" \
     -d "{\"motorcycleLicensePlate\":\"B 9999 XYZ\",\"entryTime\":\"2026-07-08T10:00:00+07:00\",\"exitTime\":\"2026-07-08T14:00:00+07:00\",\"estimatedFee\":8000.00,\"isNeedWashing\":true,\"notes\":\"Helmet on mirror, washed\"}" \
     -k
```

### Step 6: Delete a Parking Record

```bash
curl -X DELETE "https://localhost:5001/api/ParkingRecords/[RECORD_ID]" \
     -H "Authorization: Bearer [TOKEN]" \
     -k
```

_(Note: The `-k` flag is added to ignore SSL certificate validation on localhost/self-signed configurations)._

---

## 🛠️ How to Test in Swagger UI

Testing directly from the browser using Swagger is the easiest and most convenient way to explore the API.

1. **Launch the Application**: Run `dotnet run` inside the backend directory.
2. **Access Swagger**: Open your web browser and navigate to:
   - `https://localhost:5001/swagger/index.html` (or matching port)
3. **Login and Retrieve Token**:
   - Scroll down to the **Auth** section.
   - Click on the `POST /api/Auth/login` endpoint block.
   - Click **Try it out**.
   - Input the default email and password in the Request body template.
   - Click **Execute**.
   - Under responses, copy the `"token"` value (exclude the surrounding double quotes).
4. **Authorize Swagger**:
   - Scroll back up to the top of the Swagger page.
   - Click the green **Authorize** button.
   - In the text box, type `Bearer ` followed by the copied token. (e.g., `Bearer eyJhbGciOiJIUzI1NiIsIn...`).
   - Click **Authorize** then click **Close**.
5. **Send Protected Requests**:
   - You can now expand any endpoint block under **ParkingRecords**, click **Try it out**, fill in parameters or body details, and click **Execute**. Swagger automatically includes the Bearer authorization header with all subsequent API calls.

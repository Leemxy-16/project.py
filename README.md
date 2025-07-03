# Simple Express.js REST API

A simple REST API built with Express.js supporting CRUD operations for "items", with in-memory storage, validation, error handling, and example API requests.

## Table of Contents

- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Validation & Error Handling](#validation--error-handling)
- [Example API Requests (Postman)](#example-api-requests-postman)

## Setup

1. **Clone the repository** (or copy files to a new directory):

   ```bash
   git clone <your-repo-url>
   cd <your-project-directory>
   ```

2. **Install dependencies**:

   ```bash
   npm install express
   ```

3. **Run the server**:

   ```bash
   node index.js
   ```

   The API will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint         | Description                    | Request Body                  | Response         |
| ------ | --------------- | ------------------------------ | ----------------------------- | ---------------- |
| GET    | `/`             | Root: Hello World message      | None                          | "Hello World"    |
| GET    | `/items`        | Retrieve all items             | None                          | Array of items   |
| GET    | `/items/:id`    | Retrieve a single item by ID   | None                          | Item object      |
| POST   | `/items`        | Create a new item              | `{ "name": "n", "description": "d" }` | Item object      |
| PUT    | `/items/:id`    | Update an item by ID           | `{ "name": "n", "description": "d" }` | Updated item     |
| DELETE | `/items/:id`    | Delete an item by ID           | None                          | (204 No Content) |

**Item Object:**
```json
{
  "id": 1,
  "name": "Item name",
  "description": "Item description"
}
```

## Validation & Error Handling

- **400**: Invalid input (e.g., bad ID, missing name/description)
- **404**: Resource or route not found
- **499**: Custom error for client-closed request (rare, mostly for demonstration)
- **500**: Internal server error

**Error Response:**
```json
{
  "error": "Descriptive message"
}
```

## Example API Requests (Postman)

### 1. Create an Item

**POST** `http://localhost:3000/items`

Body (JSON):
```json
{
  "name": "Sample Item",
  "description": "This is a test item."
}
```

### 2. Get All Items

**GET** `http://localhost:3000/items`

---

### 3. Get Item by ID

**GET** `http://localhost:3000/items/1`

---

### 4. Update Item

**PUT** `http://localhost:3000/items/1`

Body (JSON):
```json
{
  "name": "Updated Item",
  "description": "Updated description."
}
```

---

### 5. Delete Item

**DELETE** `http://localhost:3000/items/1`

---

### 6. Invalid Route Example

**GET** `http://localhost:3000/invalid`

- Returns:
  ```json
  {
    "error": "Route not found"
  }
  ```

---

## Notes

- Data is stored in-memory and will be lost on server restart.
- For further development, consider using a persistent database and more robust validation.
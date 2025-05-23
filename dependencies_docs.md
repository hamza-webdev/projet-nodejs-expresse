# Project Dependencies Documentation

This document outlines the project's dependencies as listed in the `package.json` file and describes the role each plays within this specific application.

---

## Dependencies

The following libraries are included in the `dependencies` section of `package.json`:

*   **`bcrypt: ^4.0.1`**
    *   **Role:** Used for hashing user passwords. When a user signs up or changes their password, bcrypt securely hashes the password before it's stored in the database, protecting against direct exposure of plain-text passwords. It's also used during login to compare the provided password with the stored hash.

*   **`body-parser: ^1.19.0`**
    *   **Role:** Middleware responsible for parsing the body of incoming HTTP requests. It allows the application to easily access data sent in various formats, such as JSON (e.g., for API request payloads) or URL-encoded data (e.g., from HTML forms).

*   **`dotenv: ^8.2.0`**
    *   **Role:** Loads environment variables from a `.env` file into `process.env`. This is crucial for managing application configuration separately from the codebase, such as database connection strings, API keys (like `MONGO_ATLAS_PW` for MongoDB and `JWT_KEY` for JSON Web Tokens), and port numbers.

*   **`express: ^4.17.1`**
    *   **Role:** The core web application framework for Node.js. Express is used to structure the RESTful API, define routes, handle HTTP requests and responses, and integrate various middleware components to process requests.

*   **`fs: 0.0.1-security`**
    *   **Role:** The `fs` module provides an API for interacting with the file system.
    *   **Note:** The version "0.0.1-security" is unusual as `fs` is a built-in Node.js module. Its explicit inclusion as a dependency might be a mistake, an attempt to use a specific (potentially outdated or placeholder) npm package, or indicative of a misunderstanding as the native `fs` module does not require installation via npm. In a typical Node.js project, `fs` would be used directly for file operations if needed (e.g., reading, writing files), though `multer` handles file system interactions for uploads in this project. The presence of `fs-extra` (see below) suggests more advanced file operations are handled by that library.

*   **`fs-extra: ^9.0.0`**
    *   **Role:** Extends the native Node.js `fs` module by adding more file system methods, including promise support. It can be used for more complex file operations like creating directories recursively (`mkdirs`), copying files and directories, or removing them. In this project, it might be used for managing the `uploads` directory or handling files beyond what `multer` directly provides.

*   **`jsonwebtoken: ^8.5.1`**
    *   **Role:** Used for creating and verifying JSON Web Tokens (JWTs). JWTs are essential for user authentication in this application. After a user logs in, a JWT is generated and sent to the client. For subsequent requests to protected routes, this token is sent back by the client and verified by the `check-auth` middleware to authenticate the user.

*   **`mongoose: ^5.9.12`**
    *   **Role:** An Object Data Modeling (ODM) library for MongoDB. Mongoose is used to define schemas for data models (Product, Order, User), validate data, and provide a straightforward way to interact with the MongoDB database (e.g., saving, querying, updating, and deleting documents).

*   **`morgan: ^1.10.0`**
    *   **Role:** An HTTP request logger middleware. Morgan logs information about each incoming request to the console (or other configured output streams), such as the HTTP method, URL, status code, and response time. This is very useful for debugging during development and for monitoring application traffic.

*   **`multer: ^1.4.2`**
    *   **Role:** Middleware for handling `multipart/form-data` requests, which are primarily used for uploading files. In this project, Multer is specifically configured in the products routes (`api/routes/products.js`) to handle the upload of product images. It processes the uploaded file and makes it available in `req.file`.

---

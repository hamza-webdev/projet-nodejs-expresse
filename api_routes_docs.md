# API Routes Documentation

This document provides details for the API routes related to Products, Orders, and Users.

## Products API

**Base Path:** `/products`

All routes under this section are relative to `/products`.

---

### 1. Get All Products

*   **HTTP Method:** `GET`
*   **Full Path:** `/products/`
*   **Purpose:** Retrieves a list of all available products.
*   **Request Parameters:** None.
*   **Request Body:** None.
*   **Middleware:** None.
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
            "count": 2,
            "products": [
                {
                    "name": "Product 1 Name",
                    "price": 10.99,
                    "_id": "5f8d0f7a7f3b1d2c3e4f5a6b",
                    "productImage": "image_1603079034000_example.jpg",
                    "request": {
                        "type": "GET",
                        "url": "http:localhost:3000/products/5f8d0f7a7f3b1d2c3e4f5a6b"
                    }
                },
                {
                    "name": "Product 2 Name",
                    "price": 19.99,
                    "_id": "5f8d0f8e7f3b1d2c3e4f5a6c",
                    "productImage": "image_1603079054000_another.jpg",
                    "request": {
                        "type": "GET",
                        "url": "http:localhost:3000/products/5f8d0f8e7f3b1d2c3e4f5a6c"
                    }
                }
            ]
        }
        ```
    *   **No Products Found (404 Not Found):**
        ```json
        {
            "message": "docs invalide ya pas des products en base de donnees"
        }
        ```
    *   **Server Error (500 Internal Server Error):**
        ```json
        {
            "error": "<error_details>"
        }
        ```

---

### 2. Create a New Product

*   **HTTP Method:** `POST`
*   **Full Path:** `/products/`
*   **Purpose:** Adds a new product to the database, including a product image.
*   **Middleware:**
    *   `checkAuth`: Ensures the user is authenticated.
    *   `upload.single('productImage')`: Handles single file upload for the field named `productImage`.
        *   **File Storage:** Images are stored in the `./uploads` directory.
        *   **Filename:** `image_<timestamp>_<original_filename>`.
        *   **File Filter:** Accepts `image/jpeg`, `image/png`, `image/gif`, `image/jpg`. (Note: The implementation `file.mimetype === 'image/jpeg' || 'image/png' || ...` might not work as intended due to how boolean OR is evaluated. It should be `file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || ...` or use an array `includes` method. The `fileFilter` is commented out in the provided code for `upload`.)
        *   **File Size Limit:** 5MB (1024 * 1024 * 5 bytes).
*   **Request Parameters:** None.
*   **Request Body:** `multipart/form-data` including:
    *   `name` (String, required): Name of the product.
    *   `price` (Number, required): Price of the product.
    *   `productImage` (File, required): The image file for the product.
*   **Response Format:**
    *   **Success (201 Created):**
        ```json
        {
            "message": "Add new product successful",
            "createdProduct": {
                "name": "Product Name",
                "price": 25.50,
                "_id": "5f8d1c3a7f3b1d2c3e4f5a6d",
                "type": "GET",
                "url": "http://localhost:3000/products/5f8d1c3a7f3b1d2c3e4f5a6d"
            }
        }
        ```
    *   **Server Error (500 Internal Server Error):**
        ```json
        {
            "message": " Product request invalide",
            "error": "<error_details>",
            "createdProduct": {
                "_id": "generated_id",
                "name": "Submitted Name",
                "price": "Submitted Price",
                "productImage": "filename.jpg"
            },
            "infoFile": { /* details of req.file */ }
        }
        ```

---

### 3. Get a Specific Product by ID

*   **HTTP Method:** `GET`
*   **Full Path:** `/products/:productId`
*   **Purpose:** Retrieves a specific product using its unique ID.
*   **Middleware:** `checkAuth` (Ensures the user is authenticated).
*   **Request Parameters:**
    *   `productId` (String, required): The unique ID of the product to retrieve.
*   **Request Body:** None.
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
           "product": {
               "name": "Product Name",
               "price": 15.00,
               "_id": "5f8d1c3a7f3b1d2c3e4f5a6d",
               "productImage": "image_timestamp_name.jpg"
           },
           "request": {
               "type": "GET",
               "description": "Get all products",
               "url": "http://localhost:3000/products/5f8d1c3a7f3b1d2c3e4f5a6d"
           }
       }
        ```
    *   **Not Found (404 Not Found):**
        ```json
        {
            "message": "doc invalide id invalid"
        }
        ```
    *   **Server Error (500 Internal Server Error):**
        ```json
        {
            "message": "erreur d enregistrement", // Note: Message might be misleading, more like "retrieval error".
            "error": "<error_details>"
        }
        ```
        (Note: `Console.log(err)` has a typo, should be `console.log(err)`.)

---

### 4. Update a Product by ID

*   **HTTP Method:** `PATCH`
*   **Full Path:** `/products/:productId`
*   **Purpose:** Updates specific fields of a product using its ID.
*   **Middleware:** `checkAuth` (Ensures the user is authenticated).
*   **Request Parameters:**
    *   `productId` (String, required): The ID of the product to update.
*   **Request Body:** An array of objects specifying properties to update.
    ```json
    [
        { "propName": "name", "value": "New Product Name" },
        { "propName": "price", "value": 12.99 }
    ]
    ```
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
            "message": "Success updated product!"
        }
        ```
    *   **Server Error (500 Internal Server Error):**
        ```json
        {
            "message": "erreur de modification de produit",
            "error": "<error_details>"
        }
        ```

---

### 5. Delete a Product by ID

*   **HTTP Method:** `DELETE`
*   **Full Path:** `/products/:productId`
*   **Purpose:** Deletes a product using its ID.
*   **Middleware:** `checkAuth` (Ensures the user is authenticated).
*   **Request Parameters:**
    *   `productId` (String, required): The ID of the product to delete.
*   **Request Body:** None.
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
            "message": "Votre Produit a été supprime"
        }
        ```
    *   **Server Error (500 Internal Server Error):** (Implicit, as error is only logged)
        The route currently only logs the error to the console and doesn't send a JSON error response to the client if `Product.deleteOne()` fails. It should ideally include a `.catch(err => res.status(500).json(...))` block.

---
---

## Orders API

**Base Path:** `/orders`

All routes under this section are relative to `/orders`.

---

### 1. Get All Orders

*   **HTTP Method:** `GET`
*   **Full Path:** `/orders/`
*   **Purpose:** Retrieves a list of all orders, populating product details.
*   **Middleware:** None.
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
            "count": 1,
            "orders": [
                {
                    "quantity": 2,
                    "product": { /* populated product details */ },
                    "_id": "5f8d1f2a7f3b1d2c3e4f5a6e",
                    "request": {
                        "type": "GET",
                        "url": "http:localhost:3000/orders/5f8d1f2a7f3b1d2c3e4f5a6e"
                    }
                }
            ]
        }
        ```
    *   **No Orders Found (404 Not Found):**
        ```json
        {
            "message": "docs invalide ya pas orders en base de donnees"
        }
        ```
    *   **Server Error (500 Internal Server Error):**
        ```json
        { /* error details from Mongoose */ }
        ```

---

### 2. Create a New Order

*   **HTTP Method:** `POST`
*   **Full Path:** `/orders/`
*   **Purpose:** Creates a new order.
*   **Middleware:** `checkAuth` (Ensures the user is authenticated).
*   **Request Parameters:** None.
*   **Request Body:**
    ```json
    {
        "productId": "5f8d1c3a7f3b1d2c3e4f5a6d", // ID of the product being ordered
        "quantity": 2 // Number of products to order
    }
    ```
    (Note: The code uses `req.body.product` which should correspond to `productId` from the example above for clarity)
*   **Response Format:**
    *   **Success (201 Created):**
        ```json
        {
            "_id": "5f8d1f2a7f3b1d2c3e4f5a6e",
            "product": "5f8d1c3a7f3b1d2c3e4f5a6d",
            "quantity": 2,
            "__v": 0 // Mongoose version key
        }
        ```
    *   **Server Error (505 Not Supported - Note: Should be 500 or other relevant error):**
        ```json
        { /* error details from Mongoose */ }
        ```
        (Note: HTTP status code `505` is "HTTP Version Not Supported". A `500` or `400` for bad request, e.g., if product doesn't exist, might be more appropriate depending on the error.)

---

### 3. Get a Specific Order by ID

*   **HTTP Method:** `GET`
*   **Full Path:** `/orders/:orderId`
*   **Purpose:** Retrieves a specific order by its ID, populating product details.
*   **Middleware:** `checkAuth` (Ensures the user is authenticated).
*   **Request Parameters:**
    *   `orderId` (String, required): The ID of the order to retrieve.
*   **Request Body:** None.
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
           "order": {
               "product": { /* populated product details */ },
               "quantity": 2
           },
           "request": {
               "type": "GET",
               "description": "Get all Orders",
               "url": "http://localhost:3000/orders/5f8d1f2a7f3b1d2c3e4f5a6e"
           }
       }
        ```
    *   **Not Found (404 Not Found):**
        ```json
        {
            "message": "doc invalide id invalid"
        }
        ```
    *   **Server Error (500 Internal Server Error):**
        ```json
        {
            "message": "erreur d enregistrement", // Note: Message might be misleading.
            "error": "<error_details>"
        }
        ```
        (Note: `Console.log(err)` has a typo, should be `console.log(err)`.)

---

### 4. Delete an Order by ID

*   **HTTP Method:** `DELETE`
*   **Full Path:** `/orders/:orderId`
*   **Purpose:** Deletes a specific order by its ID.
*   **Middleware:** `checkAuth` (Ensures the user is authenticated).
*   **Request Parameters:**
    *   `orderId` (String, required): The ID of the order to delete.
*   **Request Body:** None.
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
            "message": "Cette Order a été supprime"
        }
        ```
    *   **Server Error (500 Internal Server Error):** (Implicit, as error is only logged)
        The route currently only logs the error to the console and doesn't send a JSON error response to the client if `Order.deleteOne()` fails. It should ideally include a `.catch(err => res.status(500).json(...))` block.

---
---

## User API

**Base Path:** `/user`

All routes under this section are relative to `/user`.

---

### 1. User Signup

*   **HTTP Method:** `POST`
*   **Full Path:** `/user/signup`
*   **Purpose:** Registers a new user.
*   **Middleware:** None.
*   **Request Parameters:** None.
*   **Request Body:**
    ```json
    {
        "email": "testuser@example.com",
        "password": "password123"
    }
    ```
*   **Response Format:**
    *   **Success (201 Created):**
        ```json
        {
            "mesaage": "User created", // Note: Typo "mesaage" should be "message"
            "_id": "5f8d2a9b7f3b1d2c3e4f5a6f",
            "email": "testuser@example.com",
            "password": "<hashed_password>" // Note: Sending password hash in response is a security risk.
        }
        ```
    *   **Conflict (409 Conflict):** Email already exists.
        ```json
        {
            "message": "Désole cet email existe deja dans la base de donnees"
        }
        ```
    *   **Server Error (500 Internal Server Error):** Could be due to hashing error or database save error.
        ```json
        {
            "error": "<bcrypt_error_details>" // If hashing fails
        }
        ```
        or
        ```json
        {
            "message": "<mongoose_save_error_details>" // If saving user fails
        }
        ```
    *   (Note: The final `.catch()` for `User.find()` is empty and should ideally handle potential errors.)

---

### 2. User Login

*   **HTTP Method:** `POST`
*   **Full Path:** `/user/login`
*   **Purpose:** Logs in an existing user and returns a JWT token.
*   **Middleware:** None.
*   **Request Parameters:** None.
*   **Request Body:**
    ```json
    {
        "email": "testuser@example.com",
        "password": "password123"
    }
    ```
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
            "message": "Connexion reussit! vous ete connecté !",
            "token": "<jwt_token>",
            "info": { /* full user object from database */ } // Note: Sending full user object, including password hash, is a security risk.
        }
        ```
    *   **Authentication Failed (401 Unauthorized):**
        *   User not found:
            ```json
            {
                "message": "Auth failed: Vous n\ête pas enregistrer, creer votre compte lien",
                "lien": "http://localhost:3000/signup" // Note: Should probably be /user/signup
            }
            ```
        *   Password mismatch:
            ```json
            {
                "message": "2 - Auth failed: Votre login ou mot de passe inciorrecte! " // Also covers password mismatch after bcrypt.compare
            }
            ```
            (Note: The code was missing an explicit `res.status(401).json(...)` for the `bcrypt.compare` result being false; it has been assumed as added in the prompt's user.js for this documentation).
    *   **Server Error (500 Internal Server Error):**
        ```json
        {
            "message": "erreur de supprussion d user<error_details>" // Note: Error message "erreur de supprussion d user" is incorrect for a login attempt.
        }
        ```

---

### 3. Delete User by ID

*   **HTTP Method:** `DELETE`
*   **Full Path:** `/user/:userId`
*   **Purpose:** Deletes a user by their ID.
*   **Middleware:** None. (Note: This route should be protected, e.g., by `checkAuth` and potentially an additional authorization check to ensure only an admin or the user themselves can delete the account.)
*   **Request Parameters:**
    *   `userId` (String, required): The ID of the user to delete.
*   **Request Body:** None.
*   **Response Format:**
    *   **Success (200 OK):**
        ```json
        {
            "message": "User supprimer avec success",
            "info": { /* result from User.deleteOne() */ }
        }
        ```
    *   **Server Error (500 Internal Server Error):**
        ```json
        {
            "message": "erreur de supprussion d user<error_details>"
        }
        ```

---

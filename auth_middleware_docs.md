# Authentication Middleware (`check-auth.js`) Documentation

This document details the functionality of the `check-auth.js` middleware, which is responsible for authenticating requests using JSON Web Tokens (JWT).

## 1. Purpose

The primary purpose of the `check-auth` middleware is to protect routes by ensuring that incoming requests include a valid JWT. It acts as a gatekeeper, verifying the authenticity of the user before allowing access to protected API endpoints.

## 2. Token Extraction

The middleware expects the JWT to be provided in the `Authorization` header of the HTTP request.

*   **Header Format:** It assumes the token is sent using the "Bearer" token scheme, formatted as:
    ```
    Authorization: Bearer <your_jwt_token>
    ```
*   **Extraction Logic:** The token is extracted by:
    1.  Accessing `req.headers.authorization`.
    2.  Splitting the string by space (`" "`).
    3.  Taking the second element of the resulting array (`[1]`), which should be the token itself.

    ```javascript
    const token = req.headers.authorization.split(" ")[1];
    ```
    A `console.log(token);` statement is present for debugging purposes, which logs the extracted token.

## 3. Token Verification

Once the token is extracted, it is verified using the `jsonwebtoken` library.

*   **Verification Function:** `jwt.verify()` is used for this purpose.
*   **Secret Key:** The secret key required to verify the token's signature is fetched from an environment variable: `process.env.JWT_KEY`. It is crucial that this key matches the one used to sign the tokens.

    ```javascript
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    ```

## 4. Successful Verification Flow

If the token is successfully verified (i.e., it's not expired, its signature is valid, and it's not tampered with):

1.  **User Data:** The decoded payload of the JWT (which typically contains user identification information such as `email`, `userId`, and token issuance/expiration times) is attached to the `req` (request) object as `req.userData`.
    ```javascript
    req.userData = decoded;
    ```
    This makes the authenticated user's information available to subsequent middleware or route handlers.

2.  **Passing Control:** The `next()` function is called without arguments, passing control to the next middleware in the stack or to the actual route handler if no other middleware follows.
    ```javascript
    next();
    ```

## 5. Error Handling

If any part of the token extraction or verification process fails, the `try...catch` block handles the error:

*   **Common Causes for Errors:**
    *   The `Authorization` header is missing or not in the expected "Bearer <token>" format.
    *   The token is malformed.
    *   The token is expired.
    *   The token's signature is invalid (e.g., wrong secret key used or token was tampered with).
*   **Response on Failure:**
    *   An HTTP status code of `401 Unauthorized` is returned to the client.
    *   A JSON response is sent with a generic error message:
        ```json
        {
            "message": "Auth failed... token false"
        }
        ```
    ```javascript
    catch (error) {
       return res.status(401).json({
           message: 'Auth failed... token false'
       });
    }
    ```

## 6. Commented-Out Alternative for Token Extraction

The code contains a commented-out line:

```javascript
// const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
```

This indicates an alternative method for receiving the token:

*   **Source:** Instead of the `Authorization` header, the token could be sent in the request body.
*   **Field Name:** The middleware would expect the token to be available as `req.body.token`.

This alternative is not active in the current implementation but shows a different possible approach for token transmission.

---

This middleware is a critical component for securing the application's API by ensuring that only authenticated requests can access protected resources.

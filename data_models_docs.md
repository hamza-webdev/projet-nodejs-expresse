# Data Models Documentation

This document provides details for the Mongoose data models used in the application: Product, Order, and User.

---

## 1. Product Model

**Model Name:** `Product`

This model represents the products available in the application.

### Schema Definition:

The `productSchema` defines the structure for product documents in the MongoDB database.

*   **`_id: mongoose.Schema.Types.ObjectId`**
    *   **Type:** `ObjectId` (MongoDB's default unique identifier, automatically generated)
    *   **Description:** A unique identifier for the product.

*   **`name: String`**
    *   **Type:** `String`
    *   **Constraints:** `required: true`
    *   **Description:** The name of the product. This field is mandatory.

*   **`price: Number`**
    *   **Type:** `Number`
    *   **Constraints:** `required: true`
    *   **Description:** The price of the product. This field is mandatory.

*   **`productImage: String`**
    *   **Type:** `String`
    *   **Constraints:** `required: true`
    *   **Description:** A path or URL to the product's image. This field is mandatory.

### Example Usage:
```javascript
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productImage: {type: String, required: true}
});

module.exports = mongoose.model('Product', productSchema);
```

---

## 2. Order Model

**Model Name:** `Order`

This model represents customer orders. Each order is linked to a specific product.

### Schema Definition:

The `orderSchema` defines the structure for order documents.

*   **`_id: mongoose.Schema.Types.ObjectId`**
    *   **Type:** `ObjectId`
    *   **Description:** A unique identifier for the order.

*   **`product: mongoose.Schema.Types.ObjectId`**
    *   **Type:** `ObjectId`
    *   **Constraints:** `ref: 'Product'`, `required: true`
    *   **Description:** This field stores the `_id` of a document from the `Product` collection. It establishes a relationship between the `Order` and `Product` models, indicating which product was ordered. This field is mandatory.

*   **`quantity: Number`**
    *   **Type:** `Number`
    *   **Constraints:** `default: 1`
    *   **Description:** The quantity of the product ordered. If not specified, it defaults to 1.

### Relationships:
*   **References `Product` Model:** The `product` field in the `Order` schema creates a direct link to a `Product` document. This allows for populating order details with product information when querying orders.

### Example Usage:
```javascript
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);
```

---

## 3. User Model

**Model Name:** `User`

This model represents users of the application, typically for authentication and authorization purposes.

### Schema Definition:

The `userSchema` defines the structure for user documents.

*   **`_id: mongoose.Schema.Types.ObjectId`**
    *   **Type:** `ObjectId`
    *   **Description:** A unique identifier for the user.

*   **`email: String`**
    *   **Type:** `String`
    *   **Constraints:**
        *   `required: true`: The email address is mandatory.
        *   `unique: true`: Each email address must be unique in the database to prevent duplicate user accounts.
        *   `match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/`: A regular expression to validate the format of the email address.
    *   **Description:** The user's email address, used for login and identification.

*   **`password: String`**
    *   **Type:** `String`
    *   **Constraints:** `required: true`
    *   **Description:** The user's password. This field is mandatory and should store a hashed version of the password for security.

### Example Usage:
```javascript
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String,
            required: true,
            unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
```

---

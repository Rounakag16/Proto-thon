# 📌 Barcode Scanner Web Application  

A web application for scanning and managing barcode information with different user interfaces tailored for various roles.  

## 🚀 Features  

- 📷 **Barcode Scanning** – Scan barcodes and retrieve product details in real-time.  
- 👥 **Role-Based Access** – Different views for Admin, Business, and Users.  
- 📦 **Product Management** – Add, edit, and view product information.  
- 🗺️ **Interactive Map View** – Visual representation of scanned items.  
- 🔐 **User Authentication** – Secure login system for different roles.  

## 🛠 Installation  

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/barcode-scanner-app.git
   cd barcode-scanner-app
   ```  
2. Install dependencies:  
   ```bash
   npm install express ejs  
   ```  
3. Start the server:  
   ```bash
   node server.js  
   ```  

## 📌 Usage  

Once the server is running, access the application at:  
**`http://localhost:3000`**  

### 🌐 Available Routes  

| Route       | Description         |
|------------|---------------------|
| `/`        | Map view            |
| `/login`   | User login          |
| `/product` | Product information |
| `/business`| Business portal     |
| `/admin`   | Admin dashboard     |
| `/user`    | User profile        |

### 📡 API Endpoints  

- **POST** `/api/scan` – Process barcode scans  
  - **Request Body:**  
    ```json
    { "barcode": "123456789" }
    ```
  - **Response:**  
    ```json
    {
      "success": true,
      "barcode": "123456789",
      "product": {
        "name": "Sample Product",
        "price": 19.99,
        "description": "A great product."
      }
    }
    ```

## 📁 Project Structure  

```
barcode-scanner-app/
├── server.js         # Main server file
├── public/           # Static assets
│   └── js/
│       └── scanner.js # Barcode scanner logic
├── views/            # EJS templates
│   ├── admin.ejs     # Admin dashboard
│   ├── business.ejs  # Business portal
│   ├── login.ejs     # Login page
│   ├── map.ejs       # Map view
│   ├── product.ejs   # Product info
│   └── user.ejs      # User profile
└── example_barcodes/ # Sample barcode images
```

## 📜 License  

This project is licensed under the **MIT License** – Free to use and modify.  

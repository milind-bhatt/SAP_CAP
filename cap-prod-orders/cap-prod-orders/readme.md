# 🚀 CAP Production Orders Service (SAP CAP + External OData)

A lightweight **SAP CAP (Cloud Application Programming Model)** project that consumes an external SAP S/4HANA Production Order OData service, applies custom business logic, and exposes a simplified API.

---

## 📌 Features

- Consumes external SAP S/4HANA Production Order OData API
- Projection-based CAP service layer
- Custom business logic (filtering + enrichment)
- Derived fields (e.g., Order Status classification)
- Ready for SAP BTP deployment
- Extendable with Fiori UI / actions / persistence layer

---

## 🏗️ Architecture

```

External SAP S/4HANA OData API
↓
CAP External Service Import
↓
CAP Service Layer (Projection)
↓
Custom Node.js Logic Layer
↓
REST API Endpoint

```

---

## 📁 Project Structure

```

cap-prod-orders/
│
├── srv/
│   ├── external/
│   │   └── API_PRODUCTION_ORDER_2.csn / edmx
│   │
│   ├── production-service.cds
│   └── production-service.js
│
├── package.json
└── README.md

````

---

## ⚙️ Prerequisites

- Node.js (18+ recommended)
- SAP CAP CLI
```bash
npm install -g @sap/cds-dk
````

* VS Code (recommended)

---

## 🚀 Setup & Run

### 1. Create Project

```bash
npm init @sap/cds@latest cap-prod-orders
cd cap-prod-orders
```

### 2. Install Dependencies

```bash
npm install
npm install @sap/cds axios
```

### 3. Import External Service

```bash
cds import srv/external/API_PRODUCTION_ORDER_2.edmx
```

---

### 4. Run the Application

```bash
cds watch
```

---

## 🌐 API Endpoint

Once running locally:

```
http://localhost:4004/production-service/ProductionOrders
```

---

## 🧠 Business Logic

Inside `srv/production-service.js`:

* Filters production orders where:

  * `TotalQuantity > 100`
* Adds derived field:

  * `OrderStatus = LARGE | NORMAL`

Example logic:

```js
data = data.filter(order => order.TotalQuantity > 100);

data = data.map(order => ({
  ...order,
  OrderStatus: order.TotalQuantity > 500 ? 'LARGE' : 'NORMAL'
}));
```

---

## 📦 Service Definition

```cds
service ProductionService {

  entity ProductionOrders as projection on external.A_ProductionOrder {
    key ProductionOrder,
    ProductionPlant,
    Material,
    OrderType,
    TotalQuantity,
    ProductionStartDate,
    ProductionEndDate
  };

}
```

---

## 🧪 Example Response

```json
[
  {
    "ProductionOrder": "10004567",
    "Material": "MAT-001",
    "TotalQuantity": 600,
    "OrderStatus": "LARGE"
  },
  {
    "ProductionOrder": "10004568",
    "Material": "MAT-002",
    "TotalQuantity": 120,
    "OrderStatus": "NORMAL"
  }
]
```

---

## 👨‍💻 Author

Built as a learning project for SAP CAP + S/4HANA integration.



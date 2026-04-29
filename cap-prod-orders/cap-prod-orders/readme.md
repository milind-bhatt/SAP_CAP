# CAP Production Orders Service (SAP CAP + External SAP S/4HANA Integration)

This project demonstrates an SAP Cloud Application Programming Model (CAP) service that integrates with an external SAP S/4HANA OData API for Production Orders. It applies a service-projection architecture with custom business logic to expose a simplified, consumption-ready REST API.

The solution is designed in alignment with SAP BTP extension principles and clean core architecture.

---

## Solution Overview

The application consumes production order data from an external SAP S/4HANA system via OData service integration. It implements a CAP-based abstraction layer to decouple backend complexity and provide a stable API for downstream consumers.

Key responsibilities include data projection, transformation, and enrichment using Node.js service handlers.

---

## Architecture

```

SAP S/4HANA OData API
↓
CAP External Service Import (EDMX/CSDL)
↓
CAP Service Layer (Projection Model)
↓
Node.js Custom Service Logic
↓
RESTful API Exposure via CAP Runtime

```

---

## Key Capabilities

- Integration with SAP S/4HANA OData services using CAP external service modeling  
- Clean separation of concerns using projection-based service design  
- Custom business logic implemented in Node.js service handlers  
- Data filtering and enrichment at service layer  
- Derived attribute generation for business categorization  
- SAP BTP-ready extension architecture  

---

## Project Structure

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

## Prerequisites

- Node.js (LTS version 18 or higher)
- SAP CAP Development Kit
```bash
npm install -g @sap/cds-dk
````

* Visual Studio Code (recommended for CAP development)

---

## Implementation Details

### 1. External Service Consumption

The SAP S/4HANA OData service is imported into the CAP project using EDMX or service metadata. This enables strongly-typed access to external business objects.

```bash
cds import srv/external/API_PRODUCTION_ORDER_2.edmx
```

---

### 2. Service Definition (Projection Layer)

The CAP service exposes a projection of the external production order entity, ensuring a controlled and simplified API surface.

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

### 3. Custom Business Logic Layer

Business logic is implemented in a Node.js service handler to enrich and filter incoming data.

Responsibilities:

* Filtering production orders based on business threshold
* Deriving classification attributes for analytical use

```js
data = data.filter(order => order.TotalQuantity > 100);

data = data.map(order => ({
  ...order,
  OrderStatus: order.TotalQuantity > 500 ? 'LARGE' : 'NORMAL'
}));
```

---

## API Endpoint

When the CAP service is running locally:

```
http://localhost:4004/production-service/ProductionOrders
```

---

## Sample Response

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

## Design Principles Demonstrated

* Clean Core Extension Approach (SAP recommended pattern)
* Service Abstraction using CAP Projection Model
* External System Decoupling via OData integration
* Backend Logic Encapsulation in Service Layer
* Reusable and extensible service architecture
* SAP BTP cloud-native development alignment

---

## Execution Steps

```bash
npm init @sap/cds@latest cap-prod-orders
cd cap-prod-orders

npm install
npm install @sap/cds axios

cds import srv/external/API_PRODUCTION_ORDER_2.edmx

cds watch
```

---

## Business Value

This implementation demonstrates how SAP CAP can be used to:

* Extend SAP S/4HANA without modifying core systems
* Standardize external data consumption via abstraction layers
* Apply business logic closer to the service layer
* Build scalable, cloud-ready enterprise extensions


using { API_PRODUCTION_ORDER_2_SRV as external } 
  from './external/API_PRODUCTION_ORDER_2_SRV';

service ProductionService {

  entity ProductionOrders as projection on external.A_ProductionOrder_2 {
    key ManufacturingOrder,
    ManufacturingOrderType,
    ProductionPlant,
    Material,
    TotalQuantity,
    MfgOrderPlannedStartDate,
    MfgOrderPlannedEndDate,
    OrderIsReleased,
    OrderIsClosed
  };

}
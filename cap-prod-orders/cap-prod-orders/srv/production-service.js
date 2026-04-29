const cds = require('@sap/cds');

module.exports = async function (srv) {

  const external = await cds.connect.to('API_PRODUCTION_ORDER_2_SRV');

  srv.on('READ', 'ProductionOrders', async (req) => {

    let data = await external.run(req.query);

    // 🔹 your custom logic
    data = data.map(order => ({
      ...order,
      OrderSize: order.TotalQuantity > 500 ? 'LARGE' : 'NORMAL'
    }));

    return data;
  });

};
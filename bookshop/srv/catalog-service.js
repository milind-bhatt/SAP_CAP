const cds = require('@sap/cds');

module.exports = (srv) => {

  const { Books } = srv.entities;

  // Custom action
  srv.on('orderBook', async (req) => {
    const { ID, quantity } = req.data;

    const book = await SELECT.one.from(Books).where({ ID });

    if (!book) {
      return req.error(404, 'Book not found');
    }

    if (book.stock < quantity) {
      return req.error(400, 'Not enough stock');
    }

    await UPDATE(Books)
      .set({ stock: book.stock - quantity })
      .where({ ID });

    return `Ordered ${quantity} book(s)`;
  });

};
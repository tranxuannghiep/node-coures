const redisPubsubService = require("../services/redisPubsub.service");

class InventoryServiceTest {
  constructor() {
    redisPubsubService.subscribe("purchase_order", (channel, message) => {
      InventoryServiceTest.updateInventory(JSON.parse(message));
    });
  }

  static updateInventory({ productId, quantity }) {
    console.log(
      `Update Inventory for Product ID: ${productId}, Quantity: ${quantity}`
    );
  }
}

module.exports = new InventoryServiceTest();

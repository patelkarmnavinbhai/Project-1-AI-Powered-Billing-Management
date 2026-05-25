const Product = require('../models/Product');

/**
 * Automatically deduct stock quantities when a bill is finalized.
 * Only deducts if the bill item has a linked product ID.
 * @param {Array} items - Bill items array
 * @param {string} ownerId - Shop owner ID
 */
const syncInventoryOnBill = async (items, ownerId) => {
  const bulkOps = [];

  for (const item of items) {
    if (!item.product) continue; // Skip manually-typed items without product link

    bulkOps.push({
      updateOne: {
        filter: { _id: item.product, owner: ownerId, quantity: { $gte: item.quantity } },
        update: { $inc: { quantity: -item.quantity } },
      },
    });
  }

  if (bulkOps.length > 0) {
    await Product.bulkWrite(bulkOps);
  }
};

module.exports = { syncInventoryOnBill };

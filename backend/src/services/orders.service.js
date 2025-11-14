const Order = require('../models/order.model');
const Product = require('../models/product.model');

async function listOrders({ status, page = 1, limit = 10 } = {}) {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('products.product')
      .populate('user'),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

async function getOrderById(id) {
  const order = await Order.findById(id)
    .populate('products.product')
    .populate('user');
  return order;
}

async function createOrder({ products: orderProducts, userId, totalAmount, status }) {
  const productIds = orderProducts.map((item) => item.product);
  const productsInDb = await Product.find({ _id: { $in: productIds } });

  // Check if all products exist and if there's enough stock
  for (const orderItem of orderProducts) {
    const product = productsInDb.find((p) => p._id.toString() === orderItem.product);
    if (!product) {
      throw new Error(`Product not found: ${orderItem.product}`);
    }
    if (product.stock < orderItem.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }
  }

  // Build order items and update stock
  const orderItems = [];
  for (const orderItem of orderProducts) {
    const product = productsInDb.find((p) => p._id.toString() === orderItem.product);

    orderItems.push({
      product: product._id,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice, // Use the unitPrice from frontend
    });

    // Decrement product stock
    product.stock -= orderItem.quantity;
    await product.save();
  }

  const order = await Order.create({
    products: orderItems,
    totalAmount,
    status,
    user: userId,
  });

  return order;
}

async function updateOrder(id, updateBody) {
  const order = await Order.findById(id);
  if (!order) {
    return null;
  }

  // Store old products to calculate stock changes
  const oldProductsMap = new Map(order.products.map(item => [item.product.toString(), item]));

  const newProducts = updateBody.products || [];
  const newProductIds = newProducts.map(item => item.product.toString());
  const productsInDb = await Product.find({ _id: { $in: newProductIds } });

  const updatedOrderItems = [];
  let newTotalAmount = 0;

  for (const newItem of newProducts) {
    const product = productsInDb.find(p => p._id.toString() === newItem.product.toString());
    if (!product) {
      throw new Error(`Product not found: ${newItem.product}`);
    }

    const oldItem = oldProductsMap.get(newItem.product.toString());
    const quantityDifference = newItem.quantity - (oldItem ? oldItem.quantity : 0);

    if (product.stock < quantityDifference) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    product.stock -= quantityDifference;
    await product.save();

    updatedOrderItems.push({
      product: product._id,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
    });
    newTotalAmount += newItem.quantity * newItem.unitPrice;

    oldProductsMap.delete(newItem.product.toString()); // Mark as processed
  }

  // Return stock for products that were removed from the order
  for (const [productId, oldItem] of oldProductsMap.entries()) {
    const product = await Product.findById(productId);
    if (product) {
      product.stock += oldItem.quantity;
      await product.save();
    }
  }

  Object.assign(order, {
    products: updatedOrderItems,
    totalAmount: newTotalAmount,
    status: updateBody.status || order.status,
  });

  await order.save();
  return order;
}

async function deleteOrder(id) {
  const order = await Order.findById(id);
  if (!order) {
    return null;
  }

  // Return product stock for each item in the order
  for (const orderItem of order.products) {
    const product = await Product.findById(orderItem.product);
    if (product) {
      product.stock += orderItem.quantity;
      await product.save();
    }
  }

  await order.deleteOne(); // Use deleteOne on the document instance
  return order;
}

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
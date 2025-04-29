const { Op } = require("sequelize");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require("../models/product");

const orderController = {
  async addToCart(req, res) {
    const { P_id, Quantity } = req.body;
    const U_id = req.user.id;

    try {
      const product = await Product.findByPk(P_id);
      if (!product) return res.status(404).json({ error: "Product not found" });

      let order =
        (await Order.findOne({ where: { U_id, Status: "unconfirmed" } })) ||
        (await Order.create({ U_id, Status: "unconfirmed", TotalAmount: 0 }));

      const [orderItem, created] = await OrderItem.findOrCreate({
        where: { O_id: order.ID, P_id },
        defaults: { O_id: order.ID, P_id, Quantity },
      });

      if (!created) {
        orderItem.Quantity += Quantity;
        await orderItem.save();
      }

      const items = await OrderItem.findAll({
        where: { O_id: order.ID },
        include: Product,
      });

      order.TotalAmount = items.reduce(
        (sum, item) => sum + item.Quantity * item.Product.Price,
        0
      );
      await order.save();

      res
        .status(201)
        .json({ message: "Product added to cart", order, item: orderItem });
    } catch (error) {
      console.error("Error in addToCart:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  },

  async getCart(req, res) {
    const U_id = req.user.id;

    try {
      const order = await Order.findOne({
        where: { U_id, Status: "unconfirmed" },
      });

      if (!order)
        return res
          .status(200)
          .json({ message: "No active cart found", order: null, items: [] });

      const items = await OrderItem.findAll({
        where: { O_id: order.ID },
        include: { model: Product, include: ["Images"] },
      });

      res.status(200).json({ order, items });
    } catch (error) {
      console.error("Error in getCart:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  },

  async confirmOrder(req, res) {
    const U_id = req.user.id;

    try {
      const order = await Order.findOne({
        where: { U_id, Status: "unconfirmed" },
      });
      if (!order)
        return res.status(404).json({ error: "No unconfirmed order found" });

      const items = await OrderItem.findAll({
        where: { O_id: order.ID },
        include: Product,
      });

      if (!items?.length)
        return res.status(400).json({ error: "Cannot confirm empty order" });

      const total = items.reduce(
        (acc, item) => acc + item.Quantity * item.Product.Price,
        0
      );

      order.Status = "confirmed";
      order.TotalAmount = total;
      await order.save();

      res.status(200).json({ message: "Order confirmed successfully", order });
    } catch (error) {
      console.error("Error in confirmOrder:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  },

  async cancelOrder(req, res) {
    const { orderId } = req.body;
    const U_id = req.user.id;

    try {
      const order = await Order.findOne({ where: { ID: orderId, U_id } });
      if (!order) return res.status(404).json({ error: "Order not found" });

      order.Status = "unconfirmed";
      await order.save();

      res
        .status(200)
        .json({ message: "Order status reverted to unconfirmed", order });
    } catch (error) {
      console.error("Error in cancelOrder:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  },

  async getOrders(req, res) {
    const U_id = req.user.id;

    try {
      const orders = await Order.findAll({
        where: { U_id, Status: { [Op.ne]: "unconfirmed" } },
        include: { model: OrderItem, as: "items", include: Product },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error in getOrders:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  },

  async removeItem(req, res) {
    const { P_id } = req.body;
    const U_id = req.user.id;

    try {
      const order = await Order.findOne({
        where: { U_id, Status: "unconfirmed" },
      });
      if (!order)
        return res.status(404).json({ error: "No active cart found" });

      const deleted = await OrderItem.destroy({
        where: { O_id: order.ID, P_id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Item not found in cart" });

      const items = await OrderItem.findAll({
        where: { O_id: order.ID },
        include: Product,
      });

      order.TotalAmount = items.reduce(
        (sum, item) => sum + item.Quantity * item.Product.Price,
        0
      );
      await order.save();

      res.status(200).json({ message: "Item removed from cart", order });
    } catch (error) {
      console.error("Error in removeItem:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  },
};

module.exports = orderController;

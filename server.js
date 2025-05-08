require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();
const logger = require("./middlewares/logger");
app.use(logger);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://change-later.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));

/* ---------- Import models ---------- */
const Product = require("./models/product");
const Image = require("./models/image");
const User = require("./models/user");
const Review = require("./models/review");
const Address = require("./models/address");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");

/* ---------- Associations ---------- */
const setupAssociations = () => {
  Product.hasMany(Image, {
    foreignKey: "P_id",
    as: "Images",
    constraints: false,
  });
  Image.belongsTo(Product, { foreignKey: "P_id", constraints: false });

  Product.hasMany(Review, {
    foreignKey: "P_id",
    as: "Reviews",
    constraints: false,
  });
  Review.belongsTo(Product, { foreignKey: "P_id", constraints: false });

  User.hasMany(Address, { foreignKey: "U_id", constraints: false });
  Address.belongsTo(User, { foreignKey: "U_id", constraints: false });

  User.hasMany(Order, { foreignKey: "U_id", constraints: false });
  Order.belongsTo(User, { foreignKey: "U_id", constraints: false });

  Order.hasMany(OrderItem, {
    foreignKey: "O_id",
    as: "items",
    constraints: false,
  });
  OrderItem.belongsTo(Order, { foreignKey: "O_id", constraints: false });

  Product.hasMany(OrderItem, { foreignKey: "P_id", constraints: false });
  OrderItem.belongsTo(Product, { foreignKey: "P_id", constraints: false });

  Order.hasOne(Address, {
    foreignKey: "O_id",
    as: "address",
    constraints: false,
  });
  Address.belongsTo(Order, {
    foreignKey: "O_id",
    as: "order",
    constraints: false,
  });
};

/* ---------- Init + start ---------- */
const startServer = async () => {
  try {
    await sequelize.authenticate(); // one connect is enough
    console.log("✅ Database connected");

    setupAssociations(); // sets relations in memory only

    /* no sync/alter here — migrations/manual SQL only */
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

/* ---------- Routes ---------- */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

app.get("/health", (_req, res) => res.json({ status: "OK" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

startServer();

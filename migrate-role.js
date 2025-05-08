// migrate-role.js
require("dotenv").config();
const sequelize = require("./config/db");
require("./models/user"); // ensure model with new Role field is loaded

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // 💥 adds Role column
    console.log("✅ Role column added via alter:true");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
})();

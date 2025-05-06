const { sequelize } = require("../config/db");
const Address = require("../models/address");

exports.createAddress = async (req, res) => {
  try {
    const { O_id, City, Building, Floor } = req.body;
    const U_id = req.user.id;
    const address = await Address.create({
      O_id,
      U_id,
      City,
      Building,
      Floor,
    });

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error("Create Address Error:", error);
    res.status(500).json({
      message: "Error creating address",
      error: error.message,
    });
  }
};

exports.getOrderAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      where: { O_id: req.params.orderId },
      attributes: ["City", "Building", "Floor"],
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(address);
  } catch (error) {
    console.error("Get Address Error:", error);
    res.status(500).json({
      message: "Error fetching address",
      error: error.message,
    });
  }
};

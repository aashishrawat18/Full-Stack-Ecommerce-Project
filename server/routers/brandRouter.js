const brandRouter = require("express").Router();
const fileUploader = require("express-fileupload");
const { create, read, update, getById, status, deleteById } = require("../controllers/brandController");

brandRouter.post("/create", fileUploader({ createParentPath: true }), create);
brandRouter.get("/", read);
brandRouter.get("/:id", getById);
brandRouter.patch("/status-update/:id", status);
brandRouter.delete("/delete/:id", deleteById);
brandRouter.put("/update/:id",fileUploader({ createParentPath: true }), update);



module.exports = brandRouter;
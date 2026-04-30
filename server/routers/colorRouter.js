const colorRouter = require("express").Router();
// const fileUploader = require("express-fileupload");
const { create, read, update, getById, status, deleteById } = require("../controllers/colorController");

colorRouter.post("/create", create);
colorRouter.get("/", read);
colorRouter.get("/:id", getById);
colorRouter.patch("/status-update/:id", status);
colorRouter.delete("/delete/:id", deleteById);
colorRouter.put("/update/:id", update);



module.exports = colorRouter;
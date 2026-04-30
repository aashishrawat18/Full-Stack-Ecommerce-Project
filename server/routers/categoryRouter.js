const categoryRouter = require("express").Router();
const fileUploader = require("express-fileupload");
const { create, read, update, getById, status, deleteById } = require("../controllers/categoryController");

categoryRouter.post("/create", fileUploader({ createParentPath: true }), create);
categoryRouter.get("/", read);
categoryRouter.get("/:id", getById);
categoryRouter.patch("/status-update/:id", status);
categoryRouter.delete("/delete/:id", deleteById);
categoryRouter.put("/update/:id",fileUploader({ createParentPath: true }), update);



module.exports = categoryRouter;
const productRouter = require("express").Router();
const fileUploader = require("express-fileupload");

const {
    create,
    read,
    readById,
    add_images,
    delete_image,
    status
} = require("../controllers/productController.js");


productRouter.post(
    "/create",
    fileUploader({ createParentPath: true }),
    create
);

productRouter.get("/", read);

productRouter.patch("/status-update/:id", status);

productRouter.put("/remove-image/:id", delete_image);

productRouter.post(
    "/add-images/:id",
    fileUploader({ createParentPath: true }),
    add_images
);

// KEEP THIS LAST
productRouter.get("/:id", readById);

module.exports = productRouter;
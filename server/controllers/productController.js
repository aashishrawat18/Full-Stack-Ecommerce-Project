const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const brandModel = require("../models/brandModel");
const { createUniqueName } = require("../utils/helper");
const { sendCreated, sendBadRequest, sendNotFound, sendServerError, sendConflict, sendSuccess, sendOk } = require("../utils/response");
const fs = require("fs");


//Create....
const create = async (req, res) => {
    try {
        console.log(req.body)
        const { name, slug, original_price, final_price, discount_percentage, category_id, brand_id, color_ids, short_description, long_discription } = req.body;
        const thumbnail = req.files.thumbnail;
        console.log("thumbnail", thumbnail)

        // if (!name || !slug || !thumbnail || !original_price || !final_price || !discount_percentage || !short_description || !long_discription) {
        //     return sendBadRequest(res)
        // }
        const product = await productModel.findOne({ slug });

        if (product) return sendConflict(res);
        const image_name = createUniqueName(thumbnail.name)
        const destination = `./public/product/${image_name}`
        thumbnail.mv(destination, async (err) => {
            if (err) return sendServerError(res, "Unable to upload file");
            await productModel.create({
                name, slug, original_price, final_price, discount_percentage, category_id, brand_id, color_ids: JSON.parse(color_ids), short_description, long_discription, thumbnail: image_name
            });
            return sendCreated(res)
        })




    } catch (error) {
        return sendServerError(res, error);
    }
}

//Read....
const read = async (req, res) => {
    try {
        const query = req.query;
        const filter = {};
        const limit = parseInt(query.limit) || 2;
        const page = query.page || 1
        const skip = parseInt((page - 1) * limit)
        if (query.status) filter.status = query.status === "true";
        if (query.stock) filter.stock = query.stock === "true";
        if (query.id) filter._id = query.id;
        if (query.category_slug) {
            const category = await categoryModel.findOne({ slug: query.category_slug });
            filter.category_id = category._id
        }
        if (query.brand_slug) {
            const brand = await brandModel.findOne({ slug: query.brand_slug });
            filter.brand_id = brand._id
        }
        const [total, product] = await Promise.all([
            productModel.find().countDocuments(),
            productModel.find(filter).skip(skip).limit(limit).populate([
                {
                    select: "name _id slug",
                    path: "category_id"
                },
                {
                    select: "name _id slug",
                    path: "brand_id"
                },
                {
                    select: "name _id color_code slug",
                    path: "color_ids"
                }
            ])
        ])

        if (product) {
            return sendSuccess(res, "product found", product, {
                total,
                limit,
                pages: Math.ceil(total / limit),
                imageBaseUrl: "http://localhost:5000/product/"
            })
        }
    } catch (error) {
        return sendServerError(res)
    }
}

const add_images = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) return sendNotFound(res);
        if (!req.files || !req.files.images) return sendBadRequest(res, "No files were uploaded.");
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        const image_names = [];
        for (let image of images) {
            const image_name = createUniqueName(image.name);
            const destination = `./public/product/${image_name}`;
            await image.mv(destination);
            image_names.push(image_name);
        }
        product.images.push(...image_names);
        await product.save();
        return sendSuccess(res, "Images added successfully", product)

    } catch (error) {
        return sendServerError(res);
    }
}

const delete_image = async (req, res) => {
    try {
        const { id } = req.params;
        const { image_name } = req.body;
        const product = await productModel.findById(id);
        if (!product) return sendNotFound(res);
        await productModel.findByIdAndUpdate(id, { $pull: { images: image_name } });
        fs.unlink(`./public/product/${image_name}`, (err) => {
            if (err) console.log("Unable to delete file", err);
            return sendSuccess(res, "Image delete successfully")
        })

    } catch (error) {
        return sendServerError(res);
    }
}

// readbyId.......
const readById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id).populate([
            {
                select: "name _id",
                path: "category_id"
            },
            {
                select: "name _id",
                path: "brand_id"
            },
            {
                select: "name _id color_code",
                path: "color_ids"
            }
        ]);

        if (product) {
            return sendSuccess(res, "productfind", product, {
                imageBaseUrl: "http://localhost:5000/product/"
            })
        }
    } catch (error) {
        return sendServerError(res)
    }
}

const status = async (req, res) => {
    try {
        const { field } = req.body;
        const id = req.params.id;
        const product = await productModel.findById(id);
        if (!product) return sendNotFound(res);
        const fields = ["status"];
        if (!fields.includes(field)) {
            return sendBadRequest(res)
        }

        // if(field.includes(field))

        await productModel.findByIdAndUpdate(
            id,
            {
                [field]: !product[field]
            }
        )
        return sendOk(res, "Status update")

    } catch (error) {
        sendServerError(res)
    }
}




module.exports = {
    create,
    read,
    add_images,
    delete_image,
    readById,
    status

}
const categoryModel = require("../models/categoryModel");
const { createUniqueName } = require("../utils/helper");
const { sendCreated, sendBadRequest, sendNotFound, sendServerError, sendConflict, sendSuccess, sendOk } = require("../utils/response")


//Create....
const create = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const image = req.files.image;

        if (!name || !slug || !image) return sendBadRequest(res)
        const category = await categoryModel.findOne({ slug });
        if (category) return sendConflict(res);
        const img_name = createUniqueName(image.name)
        const destination = `./public/category/${img_name}`
        image.mv(destination, async (err) => {
            if (err) return sendServerError(res, "Unable to upload file")
            await categoryModel.create({ name, slug, image: img_name });
            return sendCreated(res)
        })




    } catch (error) {
        const message = error?.message || "Internal server error";
        sendServerError(res, message)
    }
}

//Read....
const read = async (req, res) => {
    try {
        const query = req.query;
        const filter = {};
        if (query.status) filter.status = query.status === "true";
        if (query.is_home) filter.is_home = query.is_home === "true";
        if (query.is_top) filter.is_top = query.is_top === "true";
        if (query.is_popular) filter.is_popular = query.is_popular === "true";
        if (query.id) filter._id = query.id;

        const category = await categoryModel.find(filter);
        const count = await categoryModel.find().countDocuments();
        if (category) {
            return sendSuccess(res, "categoryfind", category, {
                total: count,
                imageBaseUrl: "http://localhost:5000/category/"
            })
        }
    } catch (error) {
        sendServerError(res)
    }
}

const readById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findById(id);

        if (category) {
            return sendSuccess(res, "categoryfind", category, {
                imageBaseUrl: "http://localhost:5000/category/"
            })
        }
    } catch (error) {
        sendServerError(res)
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findById(id);
        if (category) {
            return sendSuccess(res, "category find", category)
        }
    } catch (error) {
        sendServerError(res)
    }
}

const status = async (req, res) => {
    try {
        const { field } = req.body;
        const id = req.params.id;
        const category = await categoryModel.findById(id);
        if (!category) return sendNotFound(res);
        const fields = ["is_home", "status", "is_top", "is_popular"];
        if (!fields.includes(field)) {
            return sendBadRequest(res)
        }

        // if(field.includes(field))

        await categoryModel.findByIdAndUpdate(
            id,
            {
                [field]: !category[field]
            }
        )
        return sendOk(res, "Status update")

    } catch (error) {
        sendServerError(res)
    }
}

const deleteById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findById(id);
        if (!category) return sendNotFound(res);
        await categoryModel.findByIdAndDelete(id)
        return sendOk(res, "Category delete")


    } catch (error) {
        sendServerError(res)
    }
}

const update = async (req, res) => {
    try {
        const image = req.files?.image || null;
        const id = req.params.id;

        const category = await categoryModel.findById(id);
        if (!category) return sendNotFound(res);

        const object = {};

        //name & slug update 
        if (req.body.name) {
            object.name = req.body.name;
            object.slug = req.body.slug;
        }

        // image update
        if (image) {
            const img = createUniqueName(image.name);
            const destination = "./public/category/" + img;

            await image.mv(destination); //wait till upload
            object.image = img;
        }

        await categoryModel.updateOne(
            { _id: id },
            { $set: object }
        )

        return sendSuccess(res, "Category updated successfully");

    } catch (error) {
        // console.log(error);
        return sendServerError(res);

    }
};


module.exports = {
    create, read, getById, status, deleteById, readById, update
}
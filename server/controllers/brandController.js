const brandModel = require("../models/brandModel");
const { createUniqueName } = require("../utils/helper");
const { sendCreated, sendBadRequest, sendNotFound, sendServerError, sendConflict, sendSuccess, sendOk } = require("../utils/response")


//Create....
const create = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const image = req.files.image;

        if (!name || !slug || !image) return sendBadRequest(res)
        const brand = await brandModel.findOne({ slug });
        if (brand) return sendConflict(res);
        const img_name = createUniqueName(image.name)
        const destination = `./public/brand/${img_name}`
        image.mv(destination, async (err) => {
            if (err) return sendServerError(res, "Unable to upload file")
            await brandModel.create({ name, slug, image: img_name });
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
        const brand = await brandModel.find(filter);
        const count = await brandModel.countDocuments();
        if (brand) {
            return sendSuccess(res, "brandfind", brand, {
                total: count,
                imageBaseUrl: "http://localhost:5000/brand/"
            })
        }
    } catch (error) {
        sendServerError(res)
    }
}

const readById = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await brandModel.findById(id);

        if (brand) {
            return sendSuccess(res, "brandfind", brand, {
                imageBaseUrl: "http://localhost:5000/brand/"
            })
        }
    } catch (error) {
        sendServerError(res)
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await brandModel.findById(id);
        if (brand) {
            return sendSuccess(res, "brand find", brand)
        }
    } catch (error) {
        sendServerError(res)
    }
}

const status = async (req, res) => {
    try {
        const { field } = req.body;
        const id = req.params.id;
        const brand = await brandModel.findById(id);
        if (!brand) return sendNotFound(res);
        const fields = ["is_home", "status", "is_top", "is_popular"];
        if (!fields.includes(field)) {
            return sendBadRequest(res)
        }

        // if(field.includes(field))

        await brandModel.findByIdAndUpdate(
            id,
            {
                [field]: !brand[field]
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
        const brand = await brandModel.findById(id);
        if (!brand) return sendNotFound(res);
        await brandModel.findByIdAndDelete(id)
        return sendOk(res, "brand delete")


    } catch (error) {
        sendServerError(res)
    }
}

const update = async (req, res) => {
    try {
        const image = req.files?.image || null;
        const id = req.params.id;

        const brand = await brandModel.findById(id);
        if (!brand) return sendNotFound(res);

        const object = {};

        //name & slug update 
        if (req.body.name) {
            object.name = req.body.name;
            object.slug = req.body.slug;
        }

        // image update
        if (image) {
            const img = createUniqueName(image.name);
            const destination = "./public/brand/" + img;

            await image.mv(destination); //wait till upload
            object.image = img;
        }

        await brandModel.updateOne(
            { _id: id },
            { $set: object }
        )

        return sendSuccess(res, "brand updated successfully");

    } catch (error) {
        // console.log(error);
        return sendServerError(res);

    }
};


module.exports = {
    create, read, getById, status, deleteById, readById, update
}
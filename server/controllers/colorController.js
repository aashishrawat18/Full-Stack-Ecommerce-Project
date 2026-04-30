const colorModel = require("../models/colorModel");
const { createUniqueName } = require("../utils/helper");
const { sendCreated, sendBadRequest, sendNotFound, sendServerError, sendConflict, sendSuccess, sendOk } = require("../utils/response")


//Create....
const create = async (req, res) => {
    try {
        const { name, slug, color_code } = req.body;
        // const image = req.files.image;

        if (!name || !slug || !color_code) return sendBadRequest(res)
        const color = await colorModel.findOne({ slug });
        if (color) return sendConflict(res);
        // if (err) return sendServerError(res, "Unable to upload file")
        await colorModel.create({ name, slug, color_code });
        return sendCreated(res)





    } catch (error) {
        const message = error?.message || "Internal server error";
        sendServerError(res, message)
    }
}

const read = async (req, res) => {
    try {
        const query = req.query;
        const filter = {};

        if (query.status) {
            filter.status = query.status === "true";
        }

        if (query.id) {
            filter._id = query.id;
        }

        const color = await colorModel.find(filter);
        const count = await colorModel.countDocuments();

        return sendSuccess(res, "colorfind", color, {
            total: count
        });

    } catch (error) {
        sendServerError(res);
    }
}

const readById = async (req, res) => {
    try {
        const id = req.params.id;
        const color = await colorModel.findById(id);

        if (color) {
            return sendSuccess(res, "colorfind", color)
        }
    } catch (error) {
        sendServerError(res)
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const color = await colorModel.findById(id);
        if (color) {
            return sendSuccess(res, "color find", color)
        }
    } catch (error) {
        sendServerError(res)
    }
}

const status = async (req, res) => {
    try {
        const { field } = req.body;
        const id = req.params.id;
        const color = await colorModel.findById(id);
        if (!color) return sendNotFound(res);
        const fields = ["status"];
        if (!fields.includes(field)) {
            return sendBadRequest(res)
        }

        // if(field.includes(field))

        await colorModel.findByIdAndUpdate(
            id,
            {
                [field]: !color[field]
            }
        )
        return sendOk(res, "Status updated")

    } catch (error) {
        sendServerError(res)
    }
}

const deleteById = async (req, res) => {
    try {
        const id = req.params.id;
        const color = await colorModel.findById(id);
        if (!color) return sendNotFound(res);
        await colorModel.findByIdAndDelete(id)
        return sendOk(res, "color deleted")


    } catch (error) {
        sendServerError(res)
    }
}

const update = async (req, res) => {
    try {
        // const image = req.files?.image || null;
        const id = req.params.id;

        const color = await colorModel.findById(id);
        if (!color) return sendNotFound(res);

        const object = {};

        //name & slug update 
        if (req.body.name) {
            object.name = req.body.name;
            object.slug = req.body.slug;
            object.color_code = req.body.color_code
        }

        // image update
        // if (image) {
        //     const img = createUniqueName(image.name);
        //     const destination = "./public/color/" + img;

        //     await image.mv(destination); //wait till upload
        //     object.image = img;
        // }

        await colorModel.updateOne(
            { _id: id },
            { $set: object }
        )

        return sendSuccess(res, "color updated successfully");

    } catch (error) {
        // console.log(error);
        return sendServerError(res);

    }
};


module.exports = {
    create, read, getById, status, deleteById, readById, update
}
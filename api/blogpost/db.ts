import { Schema, model, connect } from "mongoose";

let db = null;

// const blogpostSchema = new Schema(
//   { blogpostName: String },
//   { timestamps: true }
// );

// const blogpostSchema = new Schema()
//     { title: String },
//     { text: String },

//     // title: {
//     //   type: String,
//     //   //required: [true, 'title is required'],
//     // },
//     // text: {
//     //   type: String,
//     //   //required: [true, 'text is required'],
//     //   //index: true,
//     // },
//     { createdAt: { type: Date,  default: Date.now() } }
// )

const baseConfig = {
    discriminatorKey: "_type", //If you've got a lot of different data types, you could also consider setting up a secondary index here.
    collection: "blogpost"   //Name of the Common Collection
};

const blogpostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'title is required'],
        },
        text: {
            type: String,
            required: [true, 'text is required'],
        },
        createdAt: { type: Date, default: Date.now() },
        paths: [{
            type: String,
            required: [true, 'text is required'],
        }]
        // children: [{
        //     familyName: String,
        //     firstName: String,
        //    gender: String,
        //     grade: Number
        // }],
        // address: {
        //     country: String,
        //     state: String,
        //     city: String
        // }
    });

export const BlogpostModel = model("bottine", blogpostSchema, "blogpost");

export const init = async () => {
    if (!db) {
        db = await connect(process.env["CosmosDbConnectionString"]);
    }
};

export const addItem = async (doc) => {
    const modelToInsert = new BlogpostModel();
    modelToInsert["title"] = doc.title;
    modelToInsert["text"] = doc.text;

    return await modelToInsert.save();
};

export const findItemById = async (id) => {
    return await BlogpostModel.findById(id);
};

export const findItems = async (query = {}) => {
    return await BlogpostModel.find(query);
};

export const deleteItemById = async (id) => {
    return await BlogpostModel.findByIdAndDelete(id);
};

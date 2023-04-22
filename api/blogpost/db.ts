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
        title:     { type: String, require: true },
        text:      { type: String, require: true },
        paths:     [{ type: String, require: true }],
        createdAt: { type: Date, default: Date.UTC, index: true },
        createdBy: { type: String, require: true },
        updatedAt: { type: Date },
        updatedBy: { type: String }
        
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
    modelToInsert["title"]     = doc.title;
    modelToInsert["text"]      = doc.text;
    modelToInsert["paths"]     = doc.paths;
    modelToInsert["createdAt"] = doc.createdAt;
    modelToInsert["createdBy"] = doc.createdBy;
    modelToInsert["updatedAt"] = doc.updatedAt;
    modelToInsert["updatedBy"] = doc.updatedBy;
    return await modelToInsert.save();
};

export const updateItem = async (doc) => {
    var entry = await db.findItemById(doc._id);
    if (!entry) {
        throw Error(`Document '${doc._id}' not found`);
    }   
    entry.title = doc.title;
    entry.text = doc.text;
    entry.paths = doc.paths;
    entry.updatedAt = Date.UTC;
    entry.updatedBy = doc.updatedBy;
    return await entry.save();
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

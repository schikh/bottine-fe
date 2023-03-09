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

const blogpostSchema = new  Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    text: {
      type: String,
      required: [true, 'text is required'],
    },    
    createdAt: { type: Date,  default: Date.now() }
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


const blogpostModel = model("bottine", blogpostSchema, "blogpost");

export const init = async () => {
  if (!db) {
    db = await connect(process.env["CosmosDbConnectionString"]);
  }
};

export const addItem = async (doc) => {
  const modelToInsert = new blogpostModel();
  modelToInsert["title"] = doc.title;
  modelToInsert["text"] = doc.text;

  return await modelToInsert.save();
};

export const findItemById = async (id) => {
  return await blogpostModel.findById(id);
};

export const findItems = async (query = {}) => {
  return await blogpostModel.find({});
};

export const deleteItemById = async (id) => {
  return await blogpostModel.findByIdAndDelete(id);
};

// const MongoClient = require('mongodb').MongoClient;

// module.exports = async function (context, req) {
//   // Connection URI and database name
//   const uri = process.env.MONGODB_CONNECTION_STRING;
//   const dbName = 'my-db';

//   // Create a new MongoClient
//   const client = new MongoClient(uri, { useNewUrlParser: true });

//   try {
//     // Connect to the MongoDB server
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection('my-collection');

//     switch (req.method) {
//       case 'GET':
//         // Retrieve documents from the collection
//         const documents = await collection.find({}).toArray();
//         context.res = {
//           body: documents
//         };
//         break;
//       case 'POST':
//         // Insert a new document into the collection
//         const document = req.body;
//         await collection.insertOne(document);
//         context.res = {
//           body: document
//         };
//         break;
//       case 'PUT':
//         // Update an existing document in the collection
//         const id = req.query.id;
//         const updatedDocument = req.body;
//         await collection.updateOne({ _id: id }, { $set: updatedDocument });
//         context.res = {
//           body: updatedDocument
//         };
//         break;
//       case 'DELETE':
//         // Delete an existing document from the collection
//         const deleteId = req.query.id;
//         await collection.deleteOne({ _id: deleteId });
//         context.res = {
//           body: `Document with ID ${deleteId} deleted successfully.`
//         };
//         break;
//       default:
//         context.res = {
//           status: 400,
//           body: 'Invalid HTTP method.'
//         };
//     }
//   } catch (err) {
//     context.log(`Error: ${err.message}`);
//     context.res = {
//       status: 500,
//       body: 'Internal server error.'
//     };
//   } finally {
//     // Close the client connection
//     await client.close();
//   }
// };

// /*

// Create an Azure Function with an HTTP trigger and choose JavaScript as the language.
// Install the MongoDB Node.js driver using npm install mongodb.
// Create a MongoDB Atlas cluster (or use an existing one) and get the connection string.
// Set the MONGODB_CONNECTION_STRING environment variable in your Azure Function settings to the MongoDB connection string.
// Test the function using an HTTP client such as Postman or cURL, making sure to send the appropriate HTTP method and request body/query parameters for the operation you want to perform.

// */
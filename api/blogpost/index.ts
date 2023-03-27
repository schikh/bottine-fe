import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { getBlobPaths } from "../upload/azure-storage-blob-sas-url";
import * as db from "./db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        let response = null;
        let id = null;

        context.log(`====================================================`);
        context.log(`req: ${JSON.stringify(req)}`);
        context.log(`====================================================`);

        await db.init();

        switch (req.method) {
            case "GET":
                id = context.bindingData.id;
                if (id) {
                    const blogPost = await db.findItemById(id);
                    blogPost.paths = await getBlobPaths('blogposts-blobs', id);
                    response = blogPost;
                } else {
                    const dbQuery = req?.query?.dbQuery || (req?.body && req?.body?.dbQuery);
                    response = { blogposts: await db.findItems(dbQuery) }; // ?????????????????
                }          
                break;
            case "PUT":
                id = context.bindingData.id;
                if (!id) {
                    throw Error("No document id given");
                }

                var entry = await db.findItemById(id);
                if (!entry) {
                    throw Error(`Document '${id}' not found`);
                }

                entry.title = req.body.title;
                entry.text = req.body.text;
                response = await entry.save();
                break;
            case "POST":
                if (!req?.body) {
                    throw Error("No document found");
                }
                response = await db.addItem(req?.body);
                break;
            case "DELETE":
                if (!req?.query?.id && !(req?.body && req?.body?.id)) {
                    throw Error("No id found");
                }
                response = await db.deleteItemById(req?.body?.id);
                break;
            default:
                throw Error(`${req.method} not allowed`)
        }

        context.res = {
            body: response
        };

    } catch (err) {
        context.log(`*** Err: ${err}`);
        context.log(`*** Error throw: ${JSON.stringify(err)}`);
        context.res = {
            status: 501,
            body: err,
        };
    }
};

export default httpTrigger;

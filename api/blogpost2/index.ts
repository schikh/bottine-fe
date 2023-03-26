import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import HTTP_CODES from "http-status-enum";
// Multiform management
import * as multipart from "parse-multipart";
// Used to get read-only SAS token URL
import { generateReadOnlySASUrl } from './azure-storage-blob-sas-url';

import * as db from "./db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        let response = null;

        context.log(`====================================================`);
        context.log(`req: ${JSON.stringify(req)}`);
        context.log(`====================================================`);

        await db.init();

        switch (req.method) {
            case "GET":
                var id = context.bindingData.id;
                if (id) {
                    response = await db.findItemById(id);
                    //} else if (req?.query.id || (req?.body && req?.body?.id)) {
                    //     response = await db.findItemById(req?.body?.id);
                } else {
                    const dbQuery = req?.query?.dbQuery || (req?.body && req?.body?.dbQuery);
                    response = { blogposts: await db.findItems(dbQuery) }; // ?????????????????
                }
                break;
            case "PUT":
                var id = context.bindingData.id;
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

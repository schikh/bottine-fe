import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as db from "../lib/azure-cosmosdb-mongodb";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    let response = null;

    await db.init();

    switch (req.method) {
      case "GET":
        if (req?.query.id || (req?.body && req?.body?.id)) {
          response = {
            blogpost: await db.findItemById(req?.body?.id),
          };
        } else {
          // allows empty query to return all items
          const dbQuery = req?.query?.dbQuery || (req?.body && req?.body?.dbQuery);
          response = {
            blogposts: await db.findItems(dbQuery),
          };
        }
        break;
      case "POST":
        if (req?.body?.document) {
          const insertOneResponse = await db.addItem(req?.body?.document);
          response = {
            blogpost: insertOneResponse,
          };
        } else {
          throw Error("No document found");
        }

        break;
      case "DELETE":
        if (req?.query?.id || (req?.body && req?.body?.id)) {
          response = {
            blogpost: await db.deleteItemById(req?.body?.id),
          };
        } else {
          throw Error("No id found");
        }

        break;
      default:
        throw Error(`${req.method} not allowed`)
    }

    context.res = {
      body: response,
    };
  } catch (err) {
    context.log(`*** Error throw: ${JSON.stringify(err)}`);

    context.res = {
      status: 501,
      body: err,
    };
  }
};

export default httpTrigger;

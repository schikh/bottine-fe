import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import HTTP_CODES from "http-status-enum";
import * as multipart from "parse-multipart";
import { generateReadOnlySASUrl } from './azure-storage-blob-sas-url';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {

    console.log(`l1 ====================================================`);
    console.log(`req.query: ${req.query}`);
    //console.log(`l3 process.env: ${JSON.stringify(req, null, 4)}`);
    console.log(`l4 ====================================================`);

    // get connection string to Azure Storage from environment variables
    // Replace with DefaultAzureCredential before moving to production
    const storageConnectionString = process.env.schistorageaccount01_STORAGE;
    if (!storageConnectionString) {
        context.res.body = `AzureWebJobsStorage env var is not defined - get Storage Connection string from Azure portal`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    const fileName = req.query?.filename;
    if (!fileName) {
        context.res.body = `filename is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    if (!req.body || !req.body.length) {
        context.res.body = `Request body is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    if (!req.headers || !req.headers["content-type"]) {
        context.res.body = `Content type is not sent in header 'content-type'`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    console.log(`l10 *** Filename:${req.query?.filename}, Content type:${req.headers["content-type"]}, Length:${req.body.length}`);

    try {

        const fileName = req.query?.filename;
        const containerName = 'blogposts-blobs';

        // Each chunk of the file is delimited by a special string
        const bodyBuffer = Buffer.from(req.body);
        const boundary = multipart.getBoundary(req.headers["content-type"]);
        const parts = multipart.Parse(bodyBuffer, boundary);

        // The file buffer is corrupted or incomplete ?
        if (!parts?.length) {
            context.res.body = `File buffer is incorrect`;
            context.res.status = HTTP_CODES.BAD_REQUEST
        }

        // filename is a required property of the parse-multipart package
        // if (parts[0]?.filename) context.log(`Original filename = ${parts[0]?.filename}`);
        // if (parts[0]?.type) context.log(`Content type = ${parts[0]?.type}`);
        // if (parts[0]?.data?.length) context.log(`Size = ${parts[0]?.data?.length}`);

        context.bindings.storage = parts[0]?.data;

        const sasInfo = await generateReadOnlySASUrl(storageConnectionString, containerName, fileName);

        context.res.body = {
            fileName,
            storageAccountName: sasInfo.storageAccountName,
            containerName,
            url: sasInfo.accountSasTokenUrl,
        };

    } catch (err) {
        context.log.error(err.message);
        context.res.body = { error: `${err.message}` };
        context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    }

    return context.res;
};

export default httpTrigger
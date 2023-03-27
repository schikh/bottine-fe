import { BlobSASPermissions, BlobServiceClient, ContainerClient, SASProtocol } from "@azure/storage-blob";

export const generateReadOnlySASUrl = async (connectionString: string, containerName: string, filename: string) => {

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(filename);

    const accountSasTokenUrl = await blobClient.generateSasUrl({
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + (60 * 60 * 1000)),
        permissions: BlobSASPermissions.parse("r"), // Read only permission to the blob
        protocol: SASProtocol.Https, // Only allow HTTPS access to the blob
    });

    return {
        accountSasTokenUrl,
        storageAccountName: blobClient.accountName
    };
};

export const getContainerClient = (containerName: string) => {
    const connectionString = process.env.schistorageaccount01_STORAGE;
    // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    // const containerClient = blobServiceClient.getContainerClient(containerName);
    return new ContainerClient(connectionString, containerName); 
};

export const getBlobPaths = async (containerName: string, path: string) => {
    const filesList = [];
    const containerClient = getContainerClient(containerName);
    //let iter = await containerClient.listBlobsByHierarchy("/", { prefix: path + "/" });
    //let iter = await containerClient.listBlobsFlat({ prefix: path + "/" });
    for await (const blob of containerClient.listBlobsFlat({ prefix: path + "/" })) {
        //let blobClient = await containerClient.getBlobClient(blob.name);
        filesList.push(`https://schistorageaccount01.blob.core.windows.net/${containerName}/${blob.name}`);
        //console.log(`https://schistorageaccount01.blob.core.windows.net/${blob.name}   ${blobClient.url}`);
    }
    return filesList;
};
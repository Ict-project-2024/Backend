import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';


export const generateSasToken = async (req, res) => {
    try {
        
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerName = 'unimo';
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = `${uuidv4()}.jpg`; // Generate a unique file name

        const blobClient = containerClient.getBlockBlobClient(blobName);

        // Set expiration time for the SAS token (e.g., 1 hour from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        // Generate SAS token
        const sasToken = generateBlobSASQueryParameters(
            {
                containerName,
                blobName,
                permissions: BlobSASPermissions.parse("w"),
                startsOn: new Date(),
                expiresOn: expiryDate,
            },
            blobServiceClient.credential
        ).toString();

        const sasUrl = `${blobClient.url}?${sasToken}`;

        res.json({ sasUrl, blobUrl: blobClient.url });
    } catch (error) {
        console.error('Error generating SAS token:', error);
        res.status(500).send('Failed to generate SAS token.');
    }
};

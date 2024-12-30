const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { parse } = require('fast-csv');
const moment = require('moment');
const s3 = new S3Client({ region: process.env.AWS_REGION }); 
const db = require('./db');

const generateCsv = (feedbackData) => {
    return new Promise((resolve, reject) => {
        const csvStream = parse({ headers: true, quote: '"' });
        let csvData = '';

        csvStream.on('data', (chunk) => {
            csvData += chunk.toString();
        });

        csvStream.on('error', (error) => {
            reject(error);
        });

        feedbackData.forEach((data) => {
            csvStream.write(data);
        });

        csvStream.end();

        csvStream.on('end', () => {
            resolve(csvData);
        });
    });
};
const scanDynamoDBTable = async () => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME, 
    };

    const { Items } = await db.send(new ScanCommand(params));
    return Items.map((item) => unmarshall(item));
};
const uploadCsvToS3 = async (csvData) => {
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME, 
        Key: `feedback-${Date.now()}.csv`, 
        Body: csvData,
        ContentType: 'text/csv',
    };

    await s3.send(new PutObjectCommand(s3Params));
};
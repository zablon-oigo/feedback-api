const{GetItemCommand,PutItemCommand,DeleteItemCommand,ScanCommand,UpdateItemCommand}=require("@aws-sdk/client-dynamodb")
const{marshall,unmarshall}=require("@aws-sdk/util-dynamodb")
const { v4: uuidv4 } = require('uuid');
const db = require("./db")
const getFeedback = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ responseId: event.pathParameters.responseId }),
        };
        const { Item } = await db.send(new GetItemCommand(params));
        console.log({ Item });

        response.body = JSON.stringify({
            message: "Successfully retrieved feedback.",
            data: Item ? unmarshall(Item) : {},
            rawData: Item,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get feedback",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

const createFeedback = async (event) => {
    const response = { statusCode: 200 };

    try {
        const body = JSON.parse(event.body);
        if (!body.responseId) {
            body.responseId = uuidv4();
          }
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body || {}),
        };
        const createResult = await db.send(new PutItemCommand(params));
        response.body = JSON.stringify({
            message: "Successfully created feedback.",
            createResult,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create feedback",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};
const updateFeedback = async (event) => {
    const response = { statusCode: 200 };

    try {
        const body = JSON.parse(event.body);
        const objKeys = Object.keys(body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ responseId: event.pathParameters.responseId }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
        };

        const updateResult = await db.send(new UpdateItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully updated feedback.",
            updateResult,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update feedback.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};
const deleteFeedback = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ responseId: event.pathParameters.responseId }),
        };
        const deleteResult = await db.send(new DeleteItemCommand(params));
        response.body = JSON.stringify({
            message: "Successfully deleted feedback.",
            deleteResult,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete feedback",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};
const getAllFeedback = async () => {
    const response = { statusCode: 200 };

    try {
        const { Items } = await db.send(new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME }));
        response.body = JSON.stringify({
            message: "Successfully retrieved all feedback.",
            data: Items.map((item) => unmarshall(item)),
            Items,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve feedback.",
            errorMsg: e.message,
        });
    }

    return response;
};
module.exports = {
    getFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    getAllFeedback,
};
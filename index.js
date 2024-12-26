const{GetItemCommand,PutItemCommand,DeleteItemCommand,ScanCommand,UpdateItemCommand}=require("@aws-sdk/client-dynamodb")
const{marshall,unmarshall}=require("@aws-sdk/util-dynamodb")
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
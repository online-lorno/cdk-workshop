import * as sdk from "aws-sdk";

export const handler: any = async (event: any) => {
  console.log("request:", JSON.stringify(event, undefined, 2));

  // create AWS SDK clients
  const dynamo = new sdk.DynamoDB();
  const lambda = new sdk.Lambda();

  // update dynamo entry for "path" with hits++
  await dynamo
    .updateItem({
      TableName: process.env.HITS_TABLE_NAME ?? "",
      Key: { path: { S: event.path } },
      UpdateExpression: "ADD hits :incr",
      ExpressionAttributeValues: { ":incr": { N: "1" } },
    })
    .promise();

  // call downstream function and capture response
  const response = await lambda
    .invoke({
      FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME ?? "",
      Payload: JSON.stringify(event),
    })
    .promise();

  console.log("downstream response:", JSON.stringify(response, undefined, 2));

  if (response?.Payload) {
    // return response back to upstream caller
    return JSON.parse(response?.Payload as string);
  }
};

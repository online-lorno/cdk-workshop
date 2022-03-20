export const handler: any = async (event: any) => {
  console.log("request:", JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Good eveningss, CDK! You've hit ${event.path}\n`,
  };
};

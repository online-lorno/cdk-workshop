import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { TableViewer } from "cdk-dynamo-table-viewer";

import { HitCounter } from "./hitcounter";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, "cdk-workshop-hello-handler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    const helloWithCounter = new HitCounter(
      this,
      "cdk-workshop-hello-counter",
      {
        downstream: hello,
      }
    );

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apiGateway.LambdaRestApi(this, "cdk-workshop-hello-with-counter", {
      handler: helloWithCounter.handler,
    });

    new TableViewer(this, "cdk-workshop-table-viewer-hello", {
      title: "Hello Hits",
      table: helloWithCounter.table,
    });
  }
}

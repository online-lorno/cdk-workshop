import * as cdk from "aws-cdk-lib";
import * as assertions from "aws-cdk-lib/assertions";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { HitCounter } from "../lib/hitcounter";

test("DynamoDB Table Created With Encryption", () => {
  const stack = new cdk.Stack();

  // WHEN
  new HitCounter(stack, "cdk-workshop-hello-counter-test", {
    downstream: new lambda.Function(stack, "cdk-workshop-hello-handler-test", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
  });
  // THEN

  const template = assertions.Template.fromStack(stack);
  const envCapture = new assertions.Capture();

  template.hasResourceProperties("AWS::DynamoDB::Table", {
    SSESpecification: {
      SSEEnabled: true,
    },
  });
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  // expect(envCapture.asObject()).toEqual({
  //   Variables: {
  //     DOWNSTREAM_FUNCTION_NAME: {
  //       Ref: "cdkworkshophellohandlertestC315E6CC",
  //     },
  //     HITS_TABLE_NAME: {
  //       Ref: "cdkworkshophellocountertestHits7908DADD",
  //     },
  //   },
  // });
});

test("read capacity can be configured", () => {
  const stack = new cdk.Stack();

  expect(() => {
    new HitCounter(stack, "cdk-workshop-hello-counter-test", {
      downstream: new lambda.Function(
        stack,
        "cdk-workshop-hello-handler-test",
        {
          runtime: lambda.Runtime.NODEJS_14_X,
          handler: "hello.handler",
          code: lambda.Code.fromAsset("lambda"),
        }
      ),
      readCapacity: 3,
    });
  }).toThrowError(/readCapacity must be greater than 5 and less than 20/);
});

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { CdkWorkshopStack } from "./cdk-workshop-stack";

export class WorkshopPipelineStage extends cdk.Stage {
  public readonly hcViewerUrl: cdk.CfnOutput;
  public readonly hcEndpoint: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const service = new CdkWorkshopStack(this, "WebService");

    this.hcEndpoint = service.hcEndpoint;
    this.hcViewerUrl = service.hcViewerUrl;
  }
}

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { CdkWorkshopStack } from "./cdk-workshop-stack";

export class WorkshopPipelineStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new CdkWorkshopStack(this, "WebService");
  }
}

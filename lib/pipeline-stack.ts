import * as cdk from "aws-cdk-lib";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates a CodeCommit repository called 'cdk-workshop'
    const repo = new codecommit.Repository(this, "cdk-workshop", {
      repositoryName: "cdk-workshop",
    });

    // The basic pipeline declaration. This sets the initial structure
    // of our pipeline
    const pipeline = new CodePipeline(this, "cdk-workshop-pipeline", {
      pipelineName: "WorkshopPipeline",
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.codeCommit(repo, "master"),
        installCommands: ["npm install -g aws-cdk"],
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });
  }
}

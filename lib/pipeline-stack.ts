import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { WorkflowStack } from './app-stack';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'CapstonePipeline',
      synth: new pipelines.ShellStep('Synth', {
        // REPLACE with GitHub repository details- your own
        input: pipelines.CodePipelineSource.gitHub('vokemwa/Capstone-Project-4-Multi-Account-Automated-and-Governed-Cloud-Platform', 'main', {
          authentication: cdk.SecretValue.secretsManager('github-token'),
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    // This part adds your actual infrastructure to the pipeline
    const deployStage = new MyPipelineAppStage(this, 'Deploy');
    pipeline.addStage(deployStage);
  }
}

// Sub-class to define the deployment stage
class MyPipelineAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);
    new WorkflowStack(this, 'WorkflowStack');
  }
}
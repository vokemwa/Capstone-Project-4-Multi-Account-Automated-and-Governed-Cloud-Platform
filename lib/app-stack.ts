// ... imports ...
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export class WorkflowStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. SSM Parameter
    const configParam = new ssm.StringParameter(this, 'AppGreeting', {
      parameterName: '/app/config/greeting',
      stringValue: 'Hello from CI/CD Automated Infrastructure!',
    });

    // 2. Lambda Function
    const myLambda = new lambda.Function(this, 'WorkflowTask', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
    });
    configParam.grantRead(myLambda);

    // 3. Step Function Definition
    const waitState = new stepfunctions.Wait(this, 'Wait 5 Seconds', {
      time: stepfunctions.WaitTime.duration(cdk.Duration.seconds(5)),
    });

    const lambdaTask = new tasks.LambdaInvoke(this, 'GetConfigTask', {
      lambdaFunction: myLambda,
    });

    // Resiliency: Retry on any service error or Lambda failure
    lambdaTask.addRetry({
      errors: ['States.ALL'],
      interval: cdk.Duration.seconds(2),
      maxAttempts: 3,
      backoffRate: 2,
    });

    const definition = waitState.next(lambdaTask);

   new stepfunctions.StateMachine(this, 'MyStateMachine', {
  definitionBody: stepfunctions.DefinitionBody.fromChainable(definition),
  timeout: cdk.Duration.minutes(5),
});
}
}
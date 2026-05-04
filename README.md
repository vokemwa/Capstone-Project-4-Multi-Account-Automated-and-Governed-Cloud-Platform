## Created the required files and pushed to the git repository

## Testing Lambda and SSM logic in CLI
* Before the CI/CD pipelines, we need to test and verify whether lambda and SSM actually work in CLI terminal

* We need to bootstrap the aws environment by running this code in the terminal 
`cdk bootstrap aws://541426239397/us-east-1`. This command creates the s3 bucket to hold the assets and Creates the IAM roles that CDK needs to perform the deployment.

![alt text](image.png)

## Deploy

Use `cdk deploy` to run the files

![alt text](image-1.png)

![alt text](image-2.png)

![alt text](image-3.png)



## The principle of least priviledge

* go to IAM console and Find the execution role created for the Lambda function

![alt text](image-4.png)

## Verify the workflow

Go to the AWS Step Functions Console. Click on MyStateMachine -> Start Execution. Wait for it to turn green.

![alt text](image-5.png)

## Check the logs
Click the log link to cloudwatch

![alt text](image-6.png)
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const ssmClient = new SSMClient();

exports.handler = async (event) => {
    const params = {
        Name: '/app/config/greeting',
        WithDecryption: false
    };

    try {
        const command = new GetParameterCommand(params);
        const result = await ssmClient.send(command);
        const greeting = result.Parameter.Value;

        console.log("Retrieved from SSM:", greeting);

        return {
            status: "Success",
            retrievedGreeting: greeting,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error retrieving SSM parameter:", error);
        throw error; // Trigger Step Function retry
    }
};
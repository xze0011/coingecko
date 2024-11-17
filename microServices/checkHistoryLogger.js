const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function handleGetSearchLog() {
    const params = { TableName: process.env.DYNAMODB_TABLE };

    try {
        const data = await dynamoDb.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error('Error fetching logs:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred while fetching logs.', error: error.message }),
        };
    }
}

module.exports = { handleGetSearchLog };

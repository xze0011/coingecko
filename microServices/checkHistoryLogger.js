const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Fetches all records from the DynamoDB table specified in environment variables.
 * @returns {Object} - An HTTP response object containing the status code and body with either the fetched items or an error message.
 */
async function handleGetSearchLog() {
    const params = { TableName: process.env.DYNAMODB_TABLE };

    try {
        // Scan the DynamoDB table to retrieve all records
        const data = await dynamoDb.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error('Error fetching logs:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred while fetching logs.',
                error: error.message
            }),
        };
    }
}

module.exports = { handleGetSearchLog };

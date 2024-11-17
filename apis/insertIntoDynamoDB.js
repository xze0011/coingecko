const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function insertLogToDynamoDB(logId, clientEmail, cryptoId, timestamp) {
    const params = {
        TableName: 'apilog',
        Item: { logid: logId, client_email: clientEmail, cryptoId: cryptoId, query_time: timestamp }
    };

    await dynamoDb.put(params).promise();
}

module.exports = { insertLogToDynamoDB };
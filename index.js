const { handleEmailRequest } = require('./microServices/cryptoEmailService');
const { handleGetSearchLog } = require('./microServices/checkHistoryLogger');

const handler = async (event) => {
    switch (event.path) {
        case "/email":
            return await handleEmailRequest(event);
        case "/getSearchLog":
            return await handleGetSearchLog(event);
        default:
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Path Not Found" }),
            };
    }
};

module.exports = { handler };

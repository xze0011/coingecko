const { getCryptoPrice } = require('../apis/getCryptoPrice');
const { sendEmail } = require('../utils/sendEmail');
const { apiUrlGenerator, emailContentGenerator } = require('../utils/contentGenerator');
const { validateRequest } = require('../utils/validator');

/**
 * Handles the email request by validating input, fetching crypto prices, generating email content, and sending an email.
 * @param {Object} event - The event object containing query parameters.
 * @returns {Object} - An HTTP response object with the status code and message.
 */
async function handleEmailRequest(event) {
    const cryptoId = event.queryStringParameters?.cryptoId || null;
    const token = event.queryStringParameters?.token || null;
    const email = event.queryStringParameters?.email || null;

    const queryParams = { token, email, cryptoId };

    // Validate query parameters
    const validationError = validateRequest(queryParams);
    if (validationError) {
        return validationError; // Return validation error response if validation fails
    }

    // Generate the API URL for fetching crypto price
    const apiUrl = apiUrlGenerator(cryptoId);

    try {
        // Fetch crypto price data from the generated API URL
        const data = await getCryptoPrice(apiUrl);
        const jsonData = JSON.parse(data);

        // Check if the response contains valid data
        if (!jsonData || jsonData.length === 0) {
            throw new Error('Invalid data from API, possibly due to invalid cryptoId.');
        }

        const price = jsonData[0].current_price;
        const emailContent = emailContentGenerator(cryptoId, price);

        // Send the generated email content to the provided email address
        await sendEmail(email, emailContent);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully.' }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred.', error: error.message }),
        };
    }
}

module.exports = { handleEmailRequest };

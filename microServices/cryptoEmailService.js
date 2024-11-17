const { getCryptoPrice } = require('../apis/getCryptoPrice');
const { sendEmail } = require('../utils/sendEmail');
const { apiUrlGenerator, emailContentGenerator } = require('../utils/contentGenerator');
const { validateRequest } = require('../utils/validateRequest');

async function handleEmailRequest(event) {
    const cryptoId = event.queryStringParameters?.cryptoId || null;
    const token = event.queryStringParameters?.token || null;
    const email = event.queryStringParameters?.email || null;

    const queryParams = {
        token: token,
        email: email,
        cryptoId: cryptoId
    };
    const validationError = validateRequest(queryParams);
    if (validationError) {
        return validationError;
    }

    const apiUrl = apiUrlGenerator(cryptoId);

    try {
        const data = await getCryptoPrice(apiUrl);
        const jsonData = JSON.parse(data);

        if (!jsonData || jsonData.length === 0) {
            throw new Error('Invalid data from API, possibly due to invalid cryptoId.');
        }

        const price = jsonData[0].current_price;
        const emailContent = emailContentGenerator(cryptoId, price);

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

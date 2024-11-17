/**
 * Generates the content of an email with the current cryptocurrency price.
 * @param {string} cryptoId - The ID of the cryptocurrency.
 * @param {number} price - The current price of the cryptocurrency.
 * @returns {string} - The generated email content.
 */

function emailContentGenerator(cryptoId, price) {
    return `
Dear Valued Investor,

We are pleased to inform you that the latest market update for your chosen cryptocurrency is here!

As of now, the current price of ${cryptoId.toUpperCase()} stands at $${price} AUD.

Thank you for trusting us to keep you updated on your investment journey. Should you have any further inquiries or need assistance, please feel free to reach out.

Wishing you success in your investments!

Warm regards,
Crypto Service Team
    `
}
/**
 * Generates the API URL to fetch the current price of a cryptocurrency.
 * @param {string} cryptoId - The ID of the cryptocurrency.
 * @param {string} vsCurrency - The currency to compare against.
 * @returns {string} - The generated API URL.
 */
function apiUrlGenerator(cryptoId, vsCurrency = 'aud') {
    return `${process.env.COINGECKOURL}?vs_currency=${vsCurrency}&ids=${cryptoId}&x_cg_demo_api_key=${process.env.COINGECKOAPIKEY}`;
}


module.exports = { emailContentGenerator, apiUrlGenerator };
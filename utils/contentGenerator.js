/**
 * Generates the content of an email with the current cryptocurrency price.
 * @param {string} cryptoId - The ID of the cryptocurrency.
 * @param {number} price - The current price of the cryptocurrency.
 * @returns {string} - The generated email content.
 */

function emailContentGenerator(cryptoId, price) {
    return `
        <p>Dear Valued Investor,</p>
        
        <p>We are pleased to inform you that the latest market update for your chosen cryptocurrency is here!</p>
        
        <p>As of now, the current price of <strong>${cryptoId.toUpperCase()}</strong> stands at <strong>$${price} AUD</strong>.</p>
        
        <p>Thank you for trusting us to keep you updated on your investment journey. Should you have any further inquiries or need assistance, please feel free to reach out.</p>
        
        <p>Wishing you success in your investments!</p>
        
        <p>Warm regards,<br>
        Crypto Service Team</p>
    `;
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
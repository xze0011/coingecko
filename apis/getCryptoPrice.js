const https = require('https');

/**
 * Fetches the current price of a cryptocurrency from the given API URL.
 * @param {string} apiUrl - The API URL to fetch the crypto price.
 * @returns {Promise<string>} - A promise that resolves with the data or rejects with an error.
 */
function getCryptoPrice(apiUrl) {
    return new Promise((resolve, reject) => {
        https.get(apiUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => { resolve(data); });
        }).on('error', (err) => { reject(err); });
    });
}

module.exports = { getCryptoPrice };

/**
 * Validates the format of an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email format is valid, otherwise false.
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates the format of a crypto ID.
 * @param {string} cryptoId - The crypto ID to validate.
 * @returns {boolean} - Returns true if the crypto ID format is valid, otherwise false.
 */
function validateCryptoId(cryptoId) {
    if (!cryptoId || cryptoId.trim() === '') {
        return false;
    }
    const cryptoIdRegex = /^[a-zA-Z0-9\-]+$/; // Allows letters, numbers, and hyphens
    return cryptoId && cryptoIdRegex.test(cryptoId.trim());
}

/**
 * Validates the token, email, and cryptoId from the event query parameters.
 * @param {Object} params - The query parameters from the event.
 * @returns {Object|null} - Returns an error response object if validation fails, otherwise null.
 */
function validateRequest(params) {
    const { token, email, cryptoId } = params;

    if (token !== process.env.VALID_TOKEN) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Limited access: Invalid token.' }),
        };
    }

    if (!validateEmail(email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid email format.' }),
        };
    }

    if (!validateCryptoId(cryptoId)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid cryptoId format.' }),
        };
    }

    return null; // All validations passed
}

module.exports = { validateEmail, validateCryptoId, validateRequest };

const { validateEmail, validateCryptoId, validateRequest } = require('./validator');

describe('validateEmail', () => {
    it('should return true for a valid email format', () => {
        expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for an invalid email format', () => {
        expect(validateEmail('invalid-email')).toBe(false);
        expect(validateEmail('invalid@com')).toBe(false);
        expect(validateEmail('')).toBe(false);
    });
});

describe('validateCryptoId', () => {
    it('should return true for a valid crypto ID format', () => {
        expect(validateCryptoId('bitcoin')).toBe(true);
        expect(validateCryptoId('crypto')).toBe(true);
    });

    it('should return false for an invalid crypto ID format', () => {
        expect(validateCryptoId('crypto@123')).toBe(false);
        expect(validateCryptoId('crypto id')).toBe(false);
        expect(validateCryptoId('')).toBe(false);
    });
});

describe('validateRequest', () => {
    beforeAll(() => {
        process.env.VALID_TOKEN = 'test-token';
    });

    it('should return null for valid parameters', () => {
        const params = {
            token: 'test-token',
            email: 'test@example.com',
            cryptoId: 'bitcoin'
        };
        expect(validateRequest(params)).toBeNull(); // Valid case, no errors expected
    });

    it('should return a 403 error response for an invalid token', () => {
        const params = {
            token: 'wrong-token',
            email: 'test@example.com',
            cryptoId: 'bitcoin'
        };
        const result = validateRequest(params);
        expect(result).toEqual({
            statusCode: 403,
            body: JSON.stringify({ message: 'Limited access: Invalid token.' })
        });
    });

    it('should return a 400 error response for an invalid email format', () => {
        const params = {
            token: 'test-token',
            email: 'invalid-email',
            cryptoId: 'bitcoin'
        };
        const result = validateRequest(params);
        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid email format.' })
        });
    });

    it('should return a 400 error response for an invalid crypto ID format', () => {
        const params = {
            token: 'test-token',
            email: 'test@example.com',
            cryptoId: 'crypto@123'
        };
        const result = validateRequest(params);
        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid cryptoId format.' })
        });
    });
});

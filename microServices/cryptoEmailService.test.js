const { handleEmailRequest } = require('./cryptoEmailService');
const { getCryptoPrice } = require('../apis/getCryptoPrice');
const { sendEmail } = require('../utils/sendEmail');
const { apiUrlGenerator, emailContentGenerator } = require('../utils/contentGenerator');
const { validateRequest } = require('../utils/validator');

// Mock the dependencies
jest.mock('../apis/getCryptoPrice');
jest.mock('../utils/sendEmail');
jest.mock('../utils/contentGenerator');
jest.mock('../utils/validator');

describe('handleEmailRequest', () => {
    const mockEvent = {
        queryStringParameters: {
            cryptoId: 'bitcoin',
            token: 'valid-token',
            email: 'test@example.com'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return validation error if validateRequest fails', async () => {
        validateRequest.mockReturnValue({
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request' })
        });

        const response = await handleEmailRequest(mockEvent);

        expect(validateRequest).toHaveBeenCalledWith({
            token: 'valid-token',
            email: 'test@example.com',
            cryptoId: 'bitcoin'
        });
        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request' })
        });
    });

    it('should return 500 error if getCryptoPrice fails', async () => {
        validateRequest.mockReturnValue(null); // Validation passes
        apiUrlGenerator.mockReturnValue('mock-api-url');
        getCryptoPrice.mockRejectedValue(new Error('Failed to fetch crypto price'));

        const response = await handleEmailRequest(mockEvent);

        expect(apiUrlGenerator).toHaveBeenCalledWith('bitcoin');
        expect(getCryptoPrice).toHaveBeenCalledWith('mock-api-url');
        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred.', error: 'Failed to fetch crypto price' })
        });
    });

    it('should return 500 error if crypto price data is invalid', async () => {
        validateRequest.mockReturnValue(null); // Validation passes
        apiUrlGenerator.mockReturnValue('mock-api-url');
        getCryptoPrice.mockResolvedValue(JSON.stringify([])); // Invalid data

        const response = await handleEmailRequest(mockEvent);

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred.',
                error: 'Invalid data from API, possibly due to invalid cryptoId.'
            })
        });
    });

    it('should send email and return success response when all conditions are met', async () => {
        validateRequest.mockReturnValue(null); // Validation passes
        apiUrlGenerator.mockReturnValue('mock-api-url');
        getCryptoPrice.mockResolvedValue(JSON.stringify([{ current_price: 30000 }]));
        emailContentGenerator.mockReturnValue('Mock email content');
        sendEmail.mockResolvedValue(); // Mock successful email sending

        const response = await handleEmailRequest(mockEvent);

        expect(apiUrlGenerator).toHaveBeenCalledWith('bitcoin');
        expect(getCryptoPrice).toHaveBeenCalledWith('mock-api-url');
        expect(emailContentGenerator).toHaveBeenCalledWith('bitcoin', 30000);
        expect(sendEmail).toHaveBeenCalledWith('test@example.com', 'Mock email content');
        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully.' })
        });
    });
});

const { emailContentGenerator, apiUrlGenerator } = require('./contentGenerator');

describe('emailContentGenerator', () => {
    it('should generate email content with provided cryptoId and price', () => {
        const cryptoId = 'bitcoin';
        const price = 30000;
        
        const emailContent = emailContentGenerator(cryptoId, price);
        
        expect(emailContent).toContain(`the current price of **${cryptoId.toUpperCase()}**`);
        expect(emailContent).toContain(`**$${price} AUD**`);
        expect(emailContent).toContain('Dear Valued Investor');
        expect(emailContent).toContain('Wishing you success in your investments!');
    });
});

describe('apiUrlGenerator', () => {
    it('should generate correct API URL with default currency', () => {
        const cryptoId = 'bitcoin';
        const expectedUrl = `${process.env.COINGECKOURL}?vs_currency=aud&ids=${cryptoId}&x_cg_demo_api_key=${process.env.COINGECKOAPIKEY}`;
        
        const apiUrl = apiUrlGenerator(cryptoId);
        
        expect(apiUrl).toBe(expectedUrl);
    });

    it('should generate correct API URL with specified currency', () => {
        const cryptoId = 'ethereum';
        const vsCurrency = 'usd';
        const expectedUrl = `${process.env.COINGECKOURL}?vs_currency=${vsCurrency}&ids=${cryptoId}&x_cg_demo_api_key=${process.env.COINGECKOAPIKEY}`;
        
        const apiUrl = apiUrlGenerator(cryptoId, vsCurrency);
        
        expect(apiUrl).toBe(expectedUrl);
    });
});

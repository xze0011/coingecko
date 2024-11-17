const https = require('https');
const nodemailer = require('nodemailer');

async function handleEmailRequest(event) {
    const VALID_TOKEN = process.env.VALID_TOKEN;
    const cryptoId = event.queryStringParameters?.cryptoId || null;
    const token = event.queryStringParameters?.token || null;
    const email = event.queryStringParameters?.email || null;

    if (token !== VALID_TOKEN) {
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

    if (!cryptoId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid cryptoId.' }),
        };
    }

    const vsCurrency = 'aud';
    const apiUrl = `${process.env.COINGECKOURL}?vs_currency=${vsCurrency}&ids=${cryptoId}&x_cg_demo_api_key=${process.env.COINGECKOAPIKEY}`;

    try {
        const data = await getCryptoPrice(apiUrl);
        const jsonData = JSON.parse(data);

        if (!jsonData || jsonData.length === 0) {
            throw new Error('Invalid data from API, possibly due to invalid cryptoId.');
        }

        const price = jsonData[0].current_price;
        const emailContent = `
        Dear Valued Investor,
        
        The current price of **${cryptoId.toUpperCase()}** is **$${price} AUD**.
        
        Warm regards,  
        Crypto Service Team
        `;

        await sendEmail(email, emailContent);
        return { statusCode: 200, body: JSON.stringify({ message: 'Email sent successfully.' }) };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred.', error: error.message }),
        };
    }
}

function getCryptoPrice(apiUrl) {
    return new Promise((resolve, reject) => {
        https.get(apiUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => { resolve(data); });
        }).on('error', (err) => { reject(err); });
    });
}

async function sendEmail(recipientEmail, content) {
    const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT;
    const GMAIL_APP_KEY = process.env.GMAIL_APP_KEY;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_ACCOUNT, pass: GMAIL_APP_KEY },
    });

    let mailOptions = {
        from: `"Crypto Service" <${GMAIL_ACCOUNT}>`,
        to: recipientEmail,
        subject: 'Current Price of Cryptocurrency',
        text: content,
    };

    await transporter.sendMail(mailOptions);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

module.exports = { handleEmailRequest };

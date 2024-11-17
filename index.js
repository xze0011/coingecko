const https = require('https');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
    switch (event.path) {
        case "/email":
            return await handleEmailRequest(event);
        case "/getSearchLog":
            return await handleGetSearchLog(event);
        default:
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Path Not Found" }),
            };
    }
};

const handleEmailRequest = async (event) => {
    const VALID_TOKEN = process.env.VALID_TOKEN;
    const cryptoId = event.queryStringParameters?.cryptoId || null;
    const token = event.queryStringParameters?.token || null;
    const email = event.queryStringParameters?.email || null;

    console.log("Token Value:", token);
    console.log("Email:", email);

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
    const apiUrl = `${process.env.COINGECKOURL}?vs_currency=${vsCurrency}&ids=${cryptoId}&x_cg_demo_api_key=${COINGECKOAPIKEY}`;

    try {
        const data = await getCryptoPrice(apiUrl);
        const jsonData = JSON.parse(data);

        if (!jsonData || jsonData.length === 0) {
            throw new Error('Invalid data from API, possibly due to invalid cryptoId.');
        }

        const price = jsonData[0].current_price;
        const emailContent = `
        Dear Valued Investor,
        
        We are pleased to inform you that the latest market update for your chosen cryptocurrency is here!
        
        As of now, the current price of **${cryptoId.toUpperCase()}** stands at **$${price} AUD**.
        
        Thank you for trusting us to keep you updated on your investment journey. Should you have any further inquiries or need assistance, please feel free to reach out.
        
        Wishing you success in your investments!
        
        Warm regards,  
        Crypto Service Team
        `;


        await sendEmail(email, emailContent);

        const logId = Number(Date.now());
        const melbourneFullTime = new Date().toLocaleString("en-AU", {
            timeZone: "Australia/Melbourne",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit"
        });
        await insertLogToDynamoDB(logId, email, cryptoId, melbourneFullTime);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Email sent successfully to your email address.',
            }),
        };

    } catch (error) {
        console.error('Error occurred:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred. Please check the logs.',
                error: error.message
            }),
        };
    }
};

const handleGetSearchLog = async () => {
    const params = { TableName: process.env.DYNAMODB_TABLE };

    try {
        const data = await dynamoDb.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error('Error fetching logs:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred while fetching logs.',
                error: error.message
            }),
        };
    }
};

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

async function insertLogToDynamoDB(logId, clientEmail, cryptoId, timestamp) {
    const params = {
        TableName: 'apilog',
        Item: { logid: logId, client_email: clientEmail, cryptoId: cryptoId, query_time: timestamp }
    };

    await dynamoDb.put(params).promise();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

module.exports = { handler };

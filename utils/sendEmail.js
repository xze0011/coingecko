const nodemailer = require('nodemailer');

/**
 * Sends an email to the specified recipient.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} content - The content of the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */

async function sendEmail(recipientEmail, content) {
    const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT;
    const GMAIL_APP_KEY = process.env.GMAIL_APP_KEY;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_ACCOUNT, pass: GMAIL_APP_KEY },
    });

    const mailOptions = {
        from: `"Crypto Service" <${GMAIL_ACCOUNT}>`,
        to: recipientEmail,
        subject: 'Current Price of Cryptocurrency',
        text: content,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };

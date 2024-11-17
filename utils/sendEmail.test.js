const nodemailer = require('nodemailer');
const { sendEmail } = require('./sendEmail');

jest.mock('nodemailer');

describe('sendEmail', () => {
    const recipientEmail = 'test@example.com';
    const emailContent = 'Test email content';

    beforeAll(() => {
        process.env.GMAIL_ACCOUNT = 'your-email@gmail.com';
        process.env.GMAIL_APP_KEY = 'your-app-password';
    });

    it('should send an email with the correct options', async () => {
        // Mock the sendMail function
        const sendMailMock = jest.fn().mockResolvedValue(true);
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        await sendEmail(recipientEmail, emailContent);

        // Check if createTransport was called with correct authentication
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: { user: process.env.GMAIL_ACCOUNT, pass: process.env.GMAIL_APP_KEY },
        });

        // Check if sendMail was called with the correct mail options
        expect(sendMailMock).toHaveBeenCalledWith({
            from: `"Crypto Service" <${process.env.GMAIL_ACCOUNT}>`,
            to: recipientEmail,
            subject: 'Current Price of Cryptocurrency',
            text: emailContent,
        });
    });

    it('should throw an error if email sending fails', async () => {
        const sendMailMock = jest.fn().mockRejectedValue(new Error('Failed to send email'));
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        await expect(sendEmail(recipientEmail, emailContent)).rejects.toThrow('Failed to send email');
    });
});

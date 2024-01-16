import sendEmail from '../emailService.js';
import errorHandler from '../utils/error.js';

export const contactOwner = async (req, res, next) => {
    const { item, senderEmail, ownerEmail, emailSubject, message } = req.body;

    try {
        const emailText = `Hello,\n\nYou have a new inquiry for your listing: ${item}. Sender's Email: ${senderEmail}\n\nMessage: ${message}`;
        await sendEmail(senderEmail, ownerEmail, emailSubject, emailText);

        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (err) {
        console.error('Error:', err);
        next(errorHandler(500, 'Error sending email.'));
    }
};

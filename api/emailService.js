import sparky from './SparkyConfig.js';



const sendEmail = async(from, to, subject, text) => {
    const transmission = {
        options: {
            sandbox: false, // Set to true if you are using the SparkPost sandbox environment
        },
        content: {
            from: from , // Replace with your sender email address
            subject: subject,
            text: text,
        },
        recipients: [{ address: to }],
    };

    try {
        const response = await sparky.transmissions.send(transmission);
        console.log('Email sent successfully:', response);
        return response;
    } catch (err) {
        console.error('Error sending email:', err);
        throw err;
    }
}

export default  sendEmail;
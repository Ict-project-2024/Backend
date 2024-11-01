import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Configure the Mailjet SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'in-v3.mailjet.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILJET_API_KEY, // Your Mailjet SMTP API Key
            pass: process.env.MAILJET_SECRET_KEY // Your Mailjet SMTP Secret Key
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL, // Replace with your sender email
        to: email,
        subject: 'Verify Your Email Address',
        text: `Hello, Thank you for registering. Please verify your email address by clicking the link below:
        
        ${verificationLink}
        
        If you did not create an account with us, please ignore this email.
        
        Best regards,
        The Team FOT Utilization Monitor`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Hello,</h2>
                <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                <p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; border-radius: 5px; text-decoration: none;">
                    Verify Email
                    </a>
                </p>
                <p>If you did not create an account with us, please ignore this email.</p>
                <p>Best regards,<br>The Team FOT Utilization Monitor</p>
            </div>`

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Failed to send email:', error.message);
        }
    });
};

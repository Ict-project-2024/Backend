import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.BASE_URL}:${process.env.PORT}/api/auth/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.VERIFICATION_EMAIL,
            pass: process.env.VERIFICATION_EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.VERIFICATION_EMAIL,
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
            <p>Best regards,<br>The Team-FOT Utilization Monitor</p>
            </div>`
    };

    await transporter.sendMail(mailOptions);
};



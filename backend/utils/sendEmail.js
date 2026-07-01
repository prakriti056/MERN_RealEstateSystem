

/*const sendEmail = async (options) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        if (!BREVO_API_KEY) {
            console.error("Missing BREVO_API_KEY in the  .evn file");
            throw new Error("Missing Email Api key");
        }

        const data = {
            sender: {
                name: "Real Estate Platform",
                email: process.env.EMAIL_USER
            },
            to: [
                {
                    email: options.email,
                    name: options.name
                }
            ],
            subject: options.subject,
            htmlContent: options.message
        };

         const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
                "accept": "application/json",
            },
            body: JSON.stringify(data)
        });

       const result  = await response.json();

        if (!response.ok) {
           console.log("Email sent successfully via Brevo:", result.messageId);
        } else {
         console.error("FBrevo Api key Error:", result);
            throw new Error(result.message || "Could not send email via Brevo");
        }
    }


    catch (error) {
        console.error("Brevo email error:", result);
        throw new Error("Could not send email via Brevo");
    }
};

export default sendEmail;*/


/*
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        if (!BREVO_API_KEY) {
            console.error("Missing BREVO_API_KEY in the .env file");
            throw new Error("Missing Email Api key");
        }

        const data = {
            sender: {
                name: "Real Estate Platform",
                email: process.env.EMAIL_USER
            },
            to: [
                {
                    email: options.email,
                    name: options.name || "user" // Default to "user" if name is not provided
                }
            ],
            subject: options.subject,
            htmlContent: options.message
        };

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
                "accept": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // FIX 1: Check if response IS okay for success
        if (response.ok) {
            console.log("Email sent successfully via Brevo. Message ID:", result.messageId);
            return result; // It's good practice to return this so your controllers can use it
        } else {
            // This runs if Brevo returned a 400 or 401 error
            console.error("Brevo API Error Details:", result);
            throw new Error(result.message || "Could not send email via Brevo");
        }
    }
    catch (error) {
        // FIX 2: Log 'error' instead of 'result' to prevent scope crashes
        console.error("Brevo email function caught an error:", error.message);
        throw error; 
    }
};

export default sendEmail;*/


import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Real Estate Platform" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully:", info.messageId);
        return info;

    } catch (error) {
        console.error("Gmail SMTP Error:", error.message);
        throw error;
    }
};

export default sendEmail;


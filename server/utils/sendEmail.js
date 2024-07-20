import nodemailer from "nodemailer";

// Sending email using nodemailer
export const sendEmail = async (emailData) => {
  try {
    const { trimmedEmail: userEmail, emailMessage, emailSubject } = emailData;

    // Creating the transport and setting the service, host
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.MAIL_HOST,
      port: 465,
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL,
      to: userEmail,
      subject: emailSubject,
      text: emailMessage,
    };

    // Sending the mail to user with above mailOptions
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("sendEmail function error: ", err?.message);
  }
};

import nodemailer from "nodemailer";

// Sending order invoice email using nodemailer
export const sendInvoice = async (emailInfo) => {
  try {
    const { emailSubject, emailMessage, customerEmail } = emailInfo;

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
      to: customerEmail,
      subject: emailSubject,
      html: emailMessage,
    };

    // Sending the mail to user with above mailOptions
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("sendInvoice error: ", err?.message);
  }
};

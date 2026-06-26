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
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${options.email}`);
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
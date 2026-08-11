
import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

console.log(
  "BREVO_API_KEY exists:",
  !!process.env.BREVO_API_KEY
);

console.log(
  "BREVO_SENDER_EMAIL:",
  process.env.BREVO_SENDER_EMAIL
);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;

    sendSmtpEmail.htmlContent = html;

    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME || "Zentrivex Trade",
      email: process.env.BREVO_SENDER_EMAIL,
    };

    sendSmtpEmail.to = [
      {
        email: to,
      },
    ];

    const result = await apiInstance.sendTransacEmail(
      sendSmtpEmail
    );

    console.log("📧 Brevo email sent successfully:", result);

    return result;
  } catch (error) {
    console.error(
      "❌ Brevo email sending error:",
      error.response?.body || error.message
    );

    throw error;
  }
};

import dotenv from "dotenv";
import { BrevoClient } from "@getbrevo/brevo";

dotenv.config();

console.log(
  "BREVO_API_KEY exists:",
  !!process.env.BREVO_API_KEY
);

console.log(
  "BREVO_SENDER_EMAIL:",
  process.env.BREVO_SENDER_EMAIL
);

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const result =
      await brevo.transactionalEmails.sendTransacEmail({
        subject,

        htmlContent: html,

        sender: {
          name:
            process.env.BREVO_SENDER_NAME ||
            "Zentrivex Trade",

          email: process.env.BREVO_SENDER_EMAIL,
        },

        to: [
          {
            email: to,
          },
        ],
      });

    console.log("📧 Brevo email sent successfully:", result);

    return result;
  } catch (error) {
    console.error("❌ Brevo email sending error:");

    console.error(
      error.body ||
      error.message ||
      error
    );

    throw error;
  }
};
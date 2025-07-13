import { api, APIError } from "encore.dev/api";
import log from "encore.dev/log";

interface SendMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SendMessageResponse {
  message: string;
}

// Sends a contact message.
export const send = api<SendMessageRequest, SendMessageResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async ({ name, email, subject, message }) => {
    if (!name || !email || !subject || !message) {
      throw APIError.invalidArgument("all fields are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw APIError.invalidArgument("invalid email format");
    }

    // In a real application, you would send an email here.
    // For now, we just log the message.
    log.info("New contact message received", {
      name,
      email,
      subject,
      message,
    });

    return {
      message: "Your message has been sent successfully. We will get back to you shortly."
    };
  }
);

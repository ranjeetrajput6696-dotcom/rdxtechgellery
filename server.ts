import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Lazy initialization for nodemailer
let transporter: any = null;

function getTransporter() {
  if (!transporter) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    
    if (user && pass) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
    }
  }
  return transporter;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Stripe Payment Intent API
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, bookingId } = req.body;

      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe secret key not configured" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: "inr",
        metadata: { bookingId },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Automated Email Notification API
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const mailTransporter = getTransporter();

      if (!mailTransporter) {
        console.warn("Email transporter not configured. Skipping email sending.");
        return res.status(200).json({ success: true, message: "Request received (Email not sent due to missing config)" });
      }

      // 1. Send confirmation email to user
      const userMailOptions = {
        from: `"RDXTECH SUNEEL GELLERY" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Confirmation: We received your inquiry - ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p>Thank you for reaching out to <strong>RDXTECH SUNEEL GELLERY</strong>.</p>
            <p>We have received your inquiry regarding <strong>"${subject}"</strong> and our team will get back to you within 24-48 hours.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.9em; color: #666;"><strong>Your Message:</strong></p>
            <p style="font-style: italic; color: #555;">"${message}"</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p>In the meantime, feel free to check out our <a href="https://rdxtech.gallery/gallery">latest wedding gallery</a>.</p>
            <p>Best Regards,<br/><strong>Team R&S</strong></p>
          </div>
        `
      };

      // 2. Send notification to admin (Ranjeet)
      const adminMailOptions = {
        from: `"RDXTECH Booking System" <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER_EMAIL || 'ranjeetrajput6696@gmail.com',
        subject: `NEW INQUIRY: ${name} - ${subject}`,
        html: `
          <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px;">${message}</div>
            <p><a href="https://rdxtech.gallery/dashboard" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Go to Dashboard</a></p>
          </div>
        `
      };

      await Promise.all([
        mailTransporter.sendMail(userMailOptions),
        mailTransporter.sendMail(adminMailOptions)
      ]);

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

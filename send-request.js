import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { name, email, quantity, message, image, to } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const attachments = [];

  // 💡 Eğer görüntü varsa Base64 olarak ekte yolla
  if (image && image.startsWith("data:image/png;base64,")) {
    attachments.push({
      filename: "rack-configuration.png",
      content: image.split("base64,")[1],
      encoding: "base64"
    });
  }

  const mailOptions = {
    from: `"AutoShelves" <${process.env.MAIL_USER}>`,
    to: to || "info@evomatq.com",
    subject: "New Rack Configuration Request",
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Message:</strong> ${message || "-"}</p>
      <p><strong>Configuration Screenshot:</strong> See attached file.</p>
    `,
    attachments // 💡 ek olarak png gönderdik
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email sending failed." });
  }
}

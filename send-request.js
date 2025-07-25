export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // herkese izin ver
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // preflight'a cevap ver
  }

  // ...geri kalan kod burada başlasın (req.body vs)


const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { name, email, quantity, message, image, to } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail", // Outlook veya farklı servis ise değiştir
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: `"AutoShelves" <${process.env.MAIL_USER}>`,
    to: to || "info@evomatq.com",
    subject: "New Rack Configuration Request",
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Message:</strong> ${message || "-"}</p>
      <p><strong>Screenshot:</strong></p>
      <img src="${image}" width="600"/>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email not sent" });
  }
}

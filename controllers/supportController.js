const Ticket = require("../models/Ticket");
const { sendEmail } = require("../services/emailService");

exports.submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await sendEmail({
      to: "support@ezkitlabs.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `Email: ${email}\nMessage: ${message}`,
    });
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  const { subject, description } = req.body;
  try {
    const ticket = new Ticket({
      user: req.user.id,
      subject,
      description,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  const { status, message } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = status || ticket.status;
    if (message)
      ticket.messages.push({ sender: req.user.id, content: message });
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

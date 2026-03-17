// Dummy email utility
function sendEmail(to, subject, text) {
  // In real app, use nodemailer
  console.log(`Email to ${to}: ${subject}\n${text}`);
}

module.exports = { sendEmail }; 
const sgMail = require("@sendgrid/mail");

// Goal: Verify email
// settings: {email, otp, message, subject, text}
const sendVerifyEmail = (settings) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: settings.email,
    from: process.env.EMAIL_FROM,
    subject: settings.subject || "EPL-House Support",
    text: settings.text || "eplhouse.com Support",
    html: `<!DOCTYPE html> <html lang='en'> <body> <p>welcome to eplhouse.com</p><h1>${settings.message}:</h1></br><h1>${settings.otp}<h1></body> <footer> <address>giza, cairo, egypt</address> <p>this email was sent by eplhouse.com to verify your email address</p> </footer> </html>`,
  };
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {});
};

// Goal: Send welcome email
// settings: {email, name}
const sendWelcomeEmail = (settings) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: settings.email,
    from: process.env.EMAIL_FROM,
    subject: "Thanks for joining in!",
    text: settings.text || "eplhouse.com Support",
    html: `<!DOCTYPE html> <html lang='en'> <body> <p>Welcome to eplhouse.com Mr. ${settings.name}</p><h1>You now have a balance 1000 EGP</h1></br><p>Let me know how you get along with our app</p></body> <footer> <address>giza, cairo, egypt</address> <p>this email was sent by eplhouse.com</p> </footer> </html>`,
  };
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {});
};

// Goal: Send email to users with transaction details
// settings: {email, type, amount, transactionId, currentBalance}
const balanceTransfer = (settings) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: settings.email,
    from: process.env.EMAIL_FROM,
    subject: "Balance Transfer eplhouse.com",
    text: "eplhouse.com Support",
    html: `<!DOCTYPE html> <html lang='en'>
    <body><p>You have ${settings.type} ${settings.amount} EGP</p><h1>transactionId: ${settings.transactionId}</h1><h1>current balance: ${settings.currentBalance}</h1></body>
    <footer> <address>giza, cairo, egypt</address> <p>this email was sent by eplhouse.com</p> </footer> </html>`,
  };
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {});
};

// Goal: Cancellation email
// settings: {email, name}
const sendCancellationEmail = (settings) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send({
    to: settings.email,
    from: process.env.EMAIL_FROM,
    subject: "Sorry to see you go!",
    text: `Goodbye, ${settings.name}. I hope to see you back sometime soon.`,
  });
};

module.exports = {
  sendVerifyEmail,
  sendWelcomeEmail,
  sendCancellationEmail,
  balanceTransfer,
};

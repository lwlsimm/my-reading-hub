const registrationHTML = (link) => {
  return `<h2>Thank you for joining My Reading Hub</h2><p>To complete the registraion process, please just click on the link below:</p><p><a href=${link}>Click here to verify your email</a></p><p>The link will expire after two hours</p>`
}
const registrationEmailPlainText = (link)=> {
  return `Please enable HTML for the link to verify your 'My Book Hub' account.  Alternatively, paste the following link into your browser: ${link}`;
}

module.exports = { registrationEmailPlainText, registrationHTML }
const registrationHTML = (link) => {
  return `<h2>Thank you for joining My Reading Hub</h2><p>To complete the registraion process, please just click on the link below:</p><p><a href=${link}>Click here to verify your email</a></p><p>The link will expire after two hours</p>`
}
const registrationEmailPlainText = (link)=> {
  return `Please enable HTML for the link to verify your 'My Book Hub' account.  Alternatively, paste the following link into your browser: ${link}`;
}

const passwordResetEmailPlainText = (code) => {
  return `You have requested a password reset.  Please enter the following temporary password to allow you to reset: ${code}`
}
const passwordResetEmailHTML = (code) => {
  return `<h2>Thank you for joining My Reading Hub</h2><p>You have requested a password reset.  Please enter the following temporary password to allow you to reset: ${code}</p>`
}

const contactFormToAdminPlanText = (email, message) => {
  return (
    `Email from: ${email}.  Message: ${message}`
  )
}
const contactFormToAdminHTML = (email, message) => {
  return (
    `<p>Email from: ${email}.</p>  <p>Message: ${message}</p>`
  )
}
const contactFormConfirmationPlanText = (message) => {
  return (
    `Thank you for contacting us.  We will respond as soon as we can.  You message was as follows: ${message}`
  )
}
const contactFormConfirmationHTML = (message) => {
  return (
    `<p>Thank you for contacting us.  We will respond as soon as we can. </p>  <p>You message was as follows:  ${message}</p>`
  )
}

module.exports = { registrationEmailPlainText, registrationHTML, contactFormToAdminHTML,contactFormToAdminPlanText, contactFormConfirmationPlanText, contactFormConfirmationHTML, passwordResetEmailPlainText, passwordResetEmailHTML  }
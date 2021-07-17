import './about.css';
import axios from 'axios';
import { keys } from '../../assets/keys/keys';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { sendContactFormtoServer } from '../../functions/contactFunction';

function About () {

  const [contactFormDisplay, setContactFormDisplay] = useState('');
  const [sendingMode, setSendingMode] = useState(false);
  const token = useSelector(state => state.loginReducer.token);

  const handleSubmitMessage = async (e) => {
    setSendingMode(true);
    try {
      setContactFormDisplay('')
      e.preventDefault()
      const email = e.target.email.value;
      const message = e.target.message.value;
      const data = await sendContactFormtoServer(email, message, token)
      if(data) {
        setContactFormDisplay(successMessage);
      } else {
        setContactFormDisplay(failMessage);
      }
      setSendingMode(false);
    } catch (error) {
      setContactFormDisplay(failMessage);
      setSendingMode(false);
    }
  }

  

  const successMessage = 'Your message has been received.  We we will respond to you as soon as we are able.'
  const failMessage = 'We are sorry but there was a problem submitting your message.  Please contact admin@my-reading-hub.com'
  const messageDisplayed = contactFormDisplay === successMessage ? 'successMessage' : 'failMessage';


  return (
    <div className="Page about-page">
      <h2 className="about-title">About</h2>
      <p className="about-para">This web-app was developed by Lee Simmons (me!) as a project at the end of a full-stack web development course.  That course was designed to teach me the fundamentals of front-end and back end web design and this site is aimed at show-casing the skills what I have learned so far.  My aim with this site was to keep it basic, to make it useful for people and for it to have a minimal, clean look.  This is the first public facing app that I have developed so please be gentle!</p>
      <p className="about-para">I hope that you are happy with the end results but if you have any constructive critism or if you have ideas for additional functionality/imporovements, please send me a message using the form below.</p>
      <p className="about-para">If you are a developer looking to colloborate on a project then I would be very interested to hear your ideas.  You have access the code for this website on my GitHub page: <a href="https://github.com/lwlsimm/my-reading-hub" target="_blank">www.github.com/lwlsimm/my-reading-hub</a>.</p>
      <h2 className="about-title">Your Data</h2>
      <p>The only data that this site stores about you is the data you yourself input: i.e. your email address, your password, the books you are reading and the progress you have made in reading these books.  All of the book data can be viewed by you from the 'My Account' section of this site.  Your data will never be sold and nor will it be used for any other purpose than allowing you to enjoy our website.  If you want to delete the data we hold about you then you can delete your account via the Settings page or you can delete individuals books via the 'My Account'.  If you have any data concerns or questions, please use the contact form below to let me know.</p>

      <form className="about-form" onSubmit={(e)=>handleSubmitMessage(e)}>
        <h2 className="about-title">Contact Form</h2>
        <p className={messageDisplayed}>{contactFormDisplay}</p>
        <label className="about-label" for="email">Your Email Address</label>
        <input className="about-input" name="email" id="email" placeholder="Enter your email address" required/>
        <label className="about-label" for="message">Your Message</label>
        <textarea className="about-input about-message" name="message" placeholder="Enter message" required/>
        {sendingMode ? 
        <input type="submit" className="btn submit-btn about-submit btn-inSearchMode" disabled value="...SENDING..."/>
        :
        <input type="submit" className="btn submit-btn about-submit"/>
        }
        
      </form>
    </div>
    
  )
}

export default About;
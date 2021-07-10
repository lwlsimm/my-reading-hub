import './about.css';

function About () {

  const handleSubmitMessage = (e) => {
    e.preventDefault()
    const email = e.target.email.value;
    const message = e.target.message.value;
    
  }

  return (
    <div className="Page about-page">
      <h2 className="about-title">About</h2>
      <p className="about-para">This web-app was developed by me, Lee Simmons, as a project at the end of a full-stack web development course.  That course was designed to teach me the fundamentals of front-end and back end web design and this site is aimed at show-casing the skills that I have learned thus far.  My aim with this site was to keep it basic, to make it useful for people and for it to have a minimal, clean look.  This is the first public facing app that I have developed so please be gentle!</p>
      <p className="about-para">I hope that you are happy with the end results but if you have any constructive critism or if you have ideas for additional functionality/imporovements, please send me a message using the form below.</p>
      <p className="about-para">If you are a developer looking to colloborate on a project then I would be very interested to hear your ideas.  You have access the code for this website on my GitHub page: <a href="https://github.com/mrleesimmons/my-reading-hub">www.github.com/mrleesimmons/my-reading-hub</a>.</p>
      <h2 className="about-title">Your Data</h2>
      <p>The only data that this site stores is the data you yourself input: i.e. your email address, your password, the books you are reading and the progress you have made.  We do not sell data or use it for any other purpose than allowing you to enjoy our website.  If you want to view the data that our site holds about you then you can download this via the Settings page.  If you want to delete the data we hold about you then you can delete your account via the Settings page or you can delete individuals books via Your Account.  If you have any data concerns or questions, please use the contact form below to let me know.</p>

      <form className="about-form" onSubmit={(e)=>handleSubmitMessage(e)}>
        <h2 className="about-title">Contact Form</h2>
        <label className="about-label" for="email">Your Email Address</label>
        <input className="about-input" name="email" id="email" placeholder="Enter your email address" required/>
        <label className="about-label" for="message">Your Message</label>
        <textarea className="about-input about-message" name="message" placeholder="Enter message" required/>
        <input type="submit" className="btn submit-btn about-submit"/>
      </form>
    </div>
    
  )
}

export default About;
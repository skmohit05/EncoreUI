import React from 'react';
import { Link } from 'react-router-dom';

class HowItWorks extends React.Component {
  render() {
    return(
      <div className="howitworks-tab">
        <div className="howitworks-left-section">
          <h3>Finding Talent/Work</h3>
          <p>Encore Time is the most efficient marketplace to match talent with the employers.
            Our goal is to make your experience friction free.
          </p>
            <p>1. Register</p>
            <p>2. Update your profile</p>
            <p>3. We will match your profile that fits the best talent/work</p>
            <p>4. Once you are hired, compensation will be through our platform. 
              We currently pay through paypal with other payments coming in the future.
            </p>
            <p>5. We charge a small fee (up to 10%)</p>
          <p>Please watch the video on how it works.<br/>
          Please <Link to="/contact">contact us</Link> if you run into any issues.</p>
        </div>
        <div className="howitworks-right-section">
        </div>
      </div>
    );
  }
}

export default HowItWorks;
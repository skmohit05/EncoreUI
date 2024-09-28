import React from "react";
import { Header, Label } from "semantic-ui-react";

class About extends React.Component {
  render() {
    return (
      <div className="general-about">
        <Header color='blue'>About Encore Time</Header>
        <p>The most efficeint marketplace to match employers with talent</p>
        <p>
          It all started with trying to find best match for the skills by the
          founders. And they realized, it is a very common issue with every
          employer and job seeker.
        </p>
        <Header color='blue' as='h5' block>Our mission is to create the most efficient market place that
              helps employers to find the best talent that fits their needs.<br/>
              We want to help reduce time to find best talent/work for both
              employers and the job seekers thus increasing value of investment
              for employers and job satisfaction for job seekers.</Header>
        <p>
          We are very excited to see you are here and look forward to help you
          realized your goals.
        </p>
        <p>Wishing you only the best!</p>
        <p>Encore Time App Team</p>
      </div>
    );
  }
}

export default About;

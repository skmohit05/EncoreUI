import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactSwipe from 'react-swipe';

import slider1 from './../images/slider_01.jpg';
import slider2 from './../images/slider_02.jpg';
import slider3 from './../images/slider_03.jpg';

class AppSlider extends React.Component {
  render() {
    if (this.props.location.pathname === '/signup' || this.props.location.pathname === '/signup/'
      || this.props.location.pathname === '/login' || this.props.location.pathname === '/login/'
      || this.props.location.pathname === '/changePassword' || this.props.location.pathname === '/changePassword/'
      || this.props.location.pathname === '/updateProfile' || this.props.location.pathname === '/updateProfile/'
      || this.props.location.pathname === '/updateProfile/jobsInfo' || this.props.location.pathname === '/updateProfile/jobsInfo'
      || this.props.location.pathname === '/jobPosting' || this.props.location.pathname === '/jobPosting/'
      || this.props.location.pathname === '/forgotPassword' || this.props.location.pathname === '/forgotPassword/') {
      return null;
    }
    return(
      <div className='app-slider'>
        <ReactSwipe
          className='slider'
          swipeOptions={{
            continuous: true,
            auto: 5000,
            speed: 300,
          }}
        >
          <img src={slider1} alt="" className='slider-image' />
          <img src={slider2} alt="" className='slider-image' />
          <img src={slider3} alt="" className='slider-image' />
        </ReactSwipe>
        </div>
    );
  }
}


export default withRouter(AppSlider);
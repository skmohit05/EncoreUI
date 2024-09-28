import React from 'react';

import { Link } from 'react-router-dom';

class AppFooter extends React.Component {
  render() {
    return (
      <footer className='app-footer'>
        <div className='app-footer-left'>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <div className='app-footer-right'>
          <i className='twitter link icon'></i>
          <i className='facebook link icon'></i>
          <i className='linkedin link icon'></i>
        </div>
      </footer>
    );
  }
}

export default AppFooter;
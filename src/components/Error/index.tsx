import React from 'react';
import Header from '../partials/Header';
import Wrapper from '../Wrapper';
import './500.css';

const Error500Page = () => (
  <Wrapper>
    <Header />
    <div className="cover">
      <h1>Webservice currently unavailable</h1>
      <p className="lead">
        An unexpected condition was encountered. Our service team is working to
        bring it back.
      </p>
    </div>
  </Wrapper>
);

export default Error500Page;

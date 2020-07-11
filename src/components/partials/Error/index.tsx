import React from 'react';
import Header from '../Header';
import Wrapper from '../../Wrapper';
import './error.css';

const Error500Page = (props: { heading: string; text: string }) => (
  <Wrapper>
    <Header />
    <div className="cover">
      <h1>{props.heading}</h1>
      <p className="lead">{props.text}</p>
    </div>
  </Wrapper>
);

export default Error500Page;

import React from 'react';
import Error from '../partials/Error';

const Error404Page = () => (
  <Error
    heading="Page Not Found"
    text="The requested resource could not be found but may be available again in the future."
  />
);

export default Error404Page;

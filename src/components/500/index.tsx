import React from 'react';
import Error from '../partials/Error';

const Error500Page = () => (
  <Error
    heading="Webservice currently unavailable"
    text="An unexpected condition was encountered. Our service team is working to
bring it back."
  />
);

export default Error500Page;

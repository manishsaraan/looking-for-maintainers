import React, { useEffect } from 'react';

const Logout = (props: any) => {
  useEffect(() => {
    localStorage.removeItem('user');

    props.history.push('/');
  });
  return <div>Logging out...</div>;
};

export default Logout;

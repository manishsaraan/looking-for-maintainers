import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions';

const Logout = (props: any) => {
  useEffect(() => {
    props.logout();
    props.history.push('/explore');
  }, []);
  return <div>Logging out...</div>;
};

export default connect(null, { logout })(Logout);

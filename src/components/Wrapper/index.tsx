import React from 'react';
import { Provider, connect } from 'react-redux';
import { Provider as AuthProvider } from '../../context/authContext';
import { loadUser } from '../../actions';

class Wrapper extends React.Component<{
  auth: any;
  loadUser: any;
  children: any;
}> {
  componentDidMount() {
    if (Object.keys(this.props.auth.user).length === 0) {
      this.props.loadUser();
    }
  }

  render() {
    return (
      <AuthProvider value={this.props.auth.user}>
        {this.props.children}
      </AuthProvider>
    );
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loadUser })(Wrapper);

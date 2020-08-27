import React, { Component } from 'react';
import postLogin from '../api/postLogin';
import postRegister from '../api/postRegister';
import postForgotPassword from '../api/postForgotPassword';
import postResetPassword from '../api/postResetPassword';
import deleteLogoutUser from '../api/deleteLogout';
import getNewAccessToken from '../api/getNewAcessToken';

// components
import { LoginForm, RegisterForm } from '../components';
class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userpassword: '',
      userpasswordverify: '',
      formName: 'Login',
      errors: {},
      formIsValid: true,
      formErrors: []
    };
  }

  handleFormChange = (e) => {
    this.setState({ formName: e.target.name });
  };

  // handle the submit
  handleSubmit = (event) => {
    let { username, userpassword, formName } = this.state;
    console.log(formName);
    console.log(username, userpassword);
    event.preventDefault();

    this.handleValidation(formName);
  };
  // handle the element change
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleValidation = (formName) => {
    const validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    let errors = {};
    let formIsValid = true;

    //Name
    let { username, userpassword, userpasswordverify } = this.state;
    // let { handleErrors } = this.props;
    console.log(username, userpassword, userpasswordverify);
    if (validEmailRegex.test(username) == false) {
      formIsValid = false;
      errors['username'] = 'Email is not a valid format';
    }
    if (!username) {
      formIsValid = false;
      errors['username'] = 'Email cannot be empty';
    }
    //UserPassword
    if (userpassword.length <= 6) {
      formIsValid = false;
      errors['userpassword'] =
        'Password cannnot be less than 6 characters long';
    }
    if (!userpassword) {
      formIsValid = false;
      errors['userpassword'] = 'Password cannnot be empty';
    }

    if (formName === 'Register') {
      if (userpasswordverify.length <= 6) {
        formIsValid = false;
        errors['userpasswordverify'] =
          'Password cannnot be less than 6 characters long';
      }

      if (!userpasswordverify) {
        formIsValid = false;
        errors['userpasswordverify'] = 'Password cannnot be empty';
      }
      if (
        userpassword !== userpasswordverify ||
        userpasswordverify !== userpassword
      ) {
        formIsValid = false;
        errors['userpasswordverify'] = 'Passwords do not match';
      }
    }

    if (formIsValid == false) {
      this.setState({ formErrors: errors, formIsValid });
    } else {
      this.setState({ formErrors: errors, formIsValid });
      if (formName === 'Login') {
        this.login(username, userpassword);
      }
      if (formName === 'Register') {
        this.register(username, userpassword);
      }
    }
  };

  // resister new user
  register = (username, userpassword) => {
    postRegister(username, userpassword)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // login code
  login = (username, userpassword) => {
    postLogin(username, userpassword)
      .then((resp) => {
        console.group('TOKENS');
        console.log('Using JWT here are the tokens');
        console.log(`this is the user data : ${JSON.stringify(resp)}`);
        console.log(`this is the access token : ${resp.accessToken}`);
        console.log(`this is the refresh token ${resp.refreshToken}`);
        console.groupEnd();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  forgotPassword = () => {
    postForgotPassword()
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  resetPassword = () => {
    postResetPassword()
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  logoutUser = () => {
    deleteLogoutUser()
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  refreshAccessToken = () => {
    getNewAccessToken()
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let { formName, formErrors, formIsValid } = this.state;
    return (
      <React.Fragment>
        <div className="background" />
        <div className="container ">
          <div className="row">
            <div className="col-5" style={{ marginTop: '100px' }}>
              {(() => {
                switch (formName) {
                  case 'Login':
                    return (
                      <LoginForm
                        handleSubmit={this.handleSubmit}
                        handleChange={this.handleChange}
                        handleFormChange={this.handleFormChange}
                        formErrors={formErrors}
                        formIsValid={formIsValid}
                      />
                    );
                    break;
                  case 'Register':
                    return (
                      <RegisterForm
                        handleSubmit={this.handleSubmit}
                        handleChange={this.handleChange}
                        handleFormChange={this.handleFormChange}
                        formErrors={formErrors}
                        formIsValid={formIsValid}
                      />
                    );
                    break;
                  default:
                    break;
                }
              })()}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default login;

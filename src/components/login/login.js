import React from 'react';
import { Button, Input } from '../formElements';
const login = ({
  handleFormChange,
  handleSubmit,
  handleChange,
  formErrors,
  formIsValid
}) => {
  return (
    <div className="form" style={{ padding: '20px' }}>
      <div className="form-header">
        <div className="logo-large" />
        <h2>Login </h2>
      </div>
      <form method="POST" onSubmit={handleSubmit}>
        <Input
          type="text"
          autoComplete="current-username"
          name="username"
          placeholder="Email"
          onChange={handleChange}
        />

        <label className={formIsValid ? '' : 'errorMessages'}>
          {formErrors['username'] ? <span> {formErrors['username']}</span> : ''}
        </label>

        <Input
          type="password"
          autoComplete="current-password"
          name="userpassword"
          placeholder="Password"
          onChange={handleChange}
        />

        <label className={formIsValid ? '' : 'errorMessages'}>
          {formErrors['userpassword'] ? (
            <span> {formErrors['userpassword']}</span>
          ) : (
            ''
          )}
        </label>

        <div style={{ width: '120px', margin: 'auto' }}>
          <Button value="Login" />
        </div>
      </form>
      <a name="Register" onClick={handleFormChange}>
        Register
      </a>
    </div>
  );
};

export default login;

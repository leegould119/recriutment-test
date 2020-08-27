import React from 'react';
const Input = (props) => {
  return (
    <input
      id={props.name}
      name={props.name}
      type={props.type}
      autoComplete={props.autoComplete}
      onChange={props.handleChange}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      {...props}
    />
  );
};

export default Input;

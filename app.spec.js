import { Input, Button } from './src/components/formElements';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('My Test Suite', () => {
  it('My Test Case', () => {
    expect(true).toEqual(true);
  });
});

// testing the input
describe('testing input type password', () => {
  const input = shallow(
    <Input type="password" placeholder="password" name="userpassword" />
  );

  it('the type', () => {
    expect(input.prop('type')).toEqual('password');
  });

  it('the placehoder value', () => {
    expect(input.prop('placeholder')).toEqual('password');
  });

  it('the name value', () => {
    expect(input.prop('name')).toEqual('userpassword');
  });
  //   we cha check more props here
});

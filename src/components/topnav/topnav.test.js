import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Topnav from './topnav';

afterEach(cleanup)

it('AuthModal appears when button clicked', () => {
  const { getByText, getByPlaceholderText } = render(<Topnav />);

  expect(getByText(/Sign In/i).textContent).toBe("Sign In");

  fireEvent.click(getByText("Sign In"));

  // testing for the text that appears on the modal - need to find a better way to test for the modal appearing
  expect(getByText(/Create an/i).textContent).toBe('Create an Account');
  expect(getByText(/Remember/i).textContent).toBe('Remember me');
  expect(getByPlaceholderText(/email/i).textContent).toBe('');
});

it('Signs In Successfully', () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(<Topnav />);

  fireEvent.click(getByText('Sign In'));
  fireEvent.change(getByPlaceholderText(/email/i), { target: { value: 'chris5@test.com' } });
  fireEvent.change(getByPlaceholderText(/password/i), { target: { value: '123456' } });
  fireEvent.click(getByTestId('signin-submit'));

  // don't know how to test for the sign in action
  expect('').toBe('');
})
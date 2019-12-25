import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Main from './main';

afterEach(cleanup);

it('dummy', () => {
  expect('').toBe('');
});
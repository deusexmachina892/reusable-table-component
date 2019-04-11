import React from 'react';
import { shallow } from 'enzyme';

// Component to Test
import App from '../src/containers/App';

describe('App Container', () => {
  const subject = shallow(<App />);

it('should render the App Component', () => {
    console.log(subject)
    expect(subject.length).toBe(1);
  });
})

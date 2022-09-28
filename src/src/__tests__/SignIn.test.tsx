import React from 'react';
import { Button, Form, Grid, Header, Segment, Checkbox } from 'semantic-ui-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import SignIn from '../components/pages/signin/SignIn';

describe('Test case for App',() =>{
  let wrapper: any;

  it('Should check SignIn components', async () => {
    await act(async () => {
        wrapper = mount(<SignIn/>);
        expect(wrapper.exists()).toBe(true);
    });
  });

  it('Should check form fields', async () => {
    await act(async () => {

      const from = wrapper.find(Form)
      expect(from.length).toEqual(1);

      const btn = wrapper.find(Button)
      expect(btn.length).toEqual(1);

      const grid = wrapper.find(Grid)
      expect(grid.length).toEqual(1);

      const header = wrapper.find(Header)
      expect(header.length).toEqual(1);

      const segment = wrapper.find(Segment)
      expect(segment.length).toEqual(1);

      const checkbox = wrapper.find(Checkbox)
      expect(checkbox.length).toEqual(1);

      const recaptcha = wrapper.find(ReCAPTCHA)
      expect(recaptcha.length).toEqual(1);

    });
  }); 



}) 
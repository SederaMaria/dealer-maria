import React from 'react';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import App from '../App';


jest.mock('@ant-design/plots', () => ({
  AntDesignChart: {
    get: () => ({
      get: () => {}
    })
  }
}))


describe('Test case for App',() =>{
  let wrapper;

  it('Should check App components', async () => {
    await act(async () => {
        wrapper = mount(<App/>);
        expect(wrapper.exists()).toBe(true);
    });
  });
}) 
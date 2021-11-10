
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Reference from '../components/pages/dealer/Application/Reference';
import { Form, Input, Table } from 'antd';
import MaskedInput from 'antd-mask-input'
import DummyResponse from './references.json'
import { act } from 'react-dom/test-utils';

Enzyme.configure({ adapter: new Adapter() });

describe('Reference', () => {
    const wrapper = shallow(<Reference leaseApplicationId={''} />);

    it('should have form input fields to create a new reference', () => {
        const input = wrapper.find(Input);
        expect(input.length).toEqual(3);

        const maskedInput = wrapper.find(MaskedInput);
        expect(maskedInput.length).toEqual(2);
    })

    it('should have a button to submit the created reference', () => {
        const button = "Create Reference";

        expect(wrapper.contains(button)).toBe(true);
    })

    it('shoud display a table for the references', () => {
        const table = wrapper.find(Table);
        expect(table.length).toEqual(1)
    })

})

describe('Test case for References', () => {
    let wrapper;
    const data = DummyResponse
  
    it('Should Display References', async () => {
      await act(async () => {
          wrapper = shallow(
            <Reference 
                leaseApplicationId={''} data={data}  />);
          expect(wrapper.exists()).toBe(true)
          const form = wrapper.find(Form);
          expect(form.length).toEqual(1);
      });
    });

}) 

import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Reference from '../components/pages/dealer/Application/Reference';
import { Input, Table } from 'antd';
import MaskedInput from 'antd-mask-input'

Enzyme.configure({ adapter: new Adapter() });

describe('Reference', () => {
    const wrapper = shallow(<Reference />);

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

    it('shoud display a table of references', () => {
        const table = wrapper.find(Table);
        expect(table.length).toEqual(1)
    })


})

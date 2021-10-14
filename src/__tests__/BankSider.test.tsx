import Enzyme, {shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {BankSider} from '../components/layouts/BankSider';

Enzyme.configure({ adapter: new Adapter() });

it('should render correctly',()=>{
    const wrapper = shallow(<BankSider />);
    const link = wrapper.find("#banking-icon").text();

    expect(link).toEqual(" Banking");
})

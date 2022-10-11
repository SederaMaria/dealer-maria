import Enzyme, {shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import BankingInformation from '../components/pages/dealer/Application/BankingInformation';

Enzyme.configure({ adapter: new Adapter() });

it('should render correctly',()=>{
    const wrapper = shallow(<BankingInformation />);
    const button = "Submit Bank Information";

    expect(wrapper.contains(button)).toBe(true);
})
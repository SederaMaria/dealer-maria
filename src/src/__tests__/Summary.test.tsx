import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Summary from '../components/pages/dealer/Application/Summary';


Enzyme.configure({ adapter: new Adapter() });

describe('test the component', ()=>{

    test('it renders content correctly', ()=>{
        const wrapper = shallow(<Summary />);
        const element = wrapper.find('#locateTest');
        expect(element).toBeTruthy()
    })
})
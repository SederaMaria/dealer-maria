import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Summary from '../components/pages/dealer/Application/Summary';


Enzyme.configure({ adapter: new Adapter() });

describe('test the edit and expand button', ()=>{
    it('should render a button', ()=> {
        const wrapper = shallow(<Summary />);
        const editButton = wrapper.find('#edit');
        const expandButton = wrapper.find('#expand');

        expect(editButton.text()).toMatch(/Edit/);
        expect(expandButton.text()).toMatch(/Expand/);

    })

    test('when clicked, it expands and render a content', ()=>{
        const wrapper = shallow(<Summary />);
        const expandButton = wrapper.find('#expand');
        expandButton.simulate('click');
        const theader = wrapper.find('.expand-test').text();

        expect(theader).toEqual('First Name');
    })


})
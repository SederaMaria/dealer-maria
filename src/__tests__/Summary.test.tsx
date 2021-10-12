import Enzyme, {shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Summary from '../components/pages/dealer/components/NewApplication/Summary';


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

    it('should renders the applicant component', ()=>{
        const mockSetState = jest.fn();

        const wrapper = shallow(<Summary setStep={mockSetState} />);
        const editApplicantButton = wrapper.find('#editApplicant');
        editApplicantButton.simulate('click');

        expect(mockSetState).toHaveBeenCalledWith("applicant");
    })

})
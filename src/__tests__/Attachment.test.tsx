import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Attachments from '../components/pages/dealer/Application/Attachment';

Enzyme.configure({ adapter: new Adapter() });


it('renders a new object after uploading', ()=>{
    const wrapper = shallow(<Attachments />);
    const uploadButton = wrapper.find('#upload-zone');
    uploadButton.simulate('click');
    const result = wrapper.find(".container-below");
    expect(result).toEqual({})

})
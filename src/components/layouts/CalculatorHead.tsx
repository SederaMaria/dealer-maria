import { Link } from 'react-router-dom';
import { Col, Row, Layout } from 'antd';
import logo from '../../assets/speed-leasing.png';
import { PoweroffOutlined, ImportOutlined } from '@ant-design/icons';
import '../layouts/styles/CalculatorHead.css';

const { Header } = Layout

const CalculatorHead = () => {
  return (
    <Header>
    <div className='wrapper'>
      <div>
        <img className="logo-img" src={logo} alt="speedleasing" />
      </div>

      <div className="return-to-home">
          <Link className="steps-exit-btn" to ={``}><ImportOutlined /> Back To Home</Link>
      </div>
    
      <div>
          <Link to={`/application`} className="steps-exit-btn">
            <PoweroffOutlined />
              EXIT
          </Link>
      </div>
    </div>
  </Header>
  )
}
export default CalculatorHead
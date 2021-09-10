import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button, Form, Grid, Header, Segment, Checkbox } from 'semantic-ui-react';
import { logger, network } from '../../../utils';
import './SignIn.css'
const SITE_KEY : string | undefined = process.env.REACT_APP_RECAPTCHA_SITE_KEY 

function SignIn() {

  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [hasError, setError] = useState<boolean>(false)
  const [showCaptchaMessage, setShowCaptchaMessage] = useState<boolean>(false)
  const [captcha, setCaptcha] = useState<string | null>(null)
  const recaptchaRef = useRef(null);
  const history = useHistory();

  // const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async () => {
    try {
      if (!captcha) {
        setShowCaptchaMessage(true)
        return;
      }

      await network.POST(`/api/v1/sign-in`, 
      {
        dealer_login: {
          email,
          password
        }
      }).then(response => {
        window.localStorage.setItem('auth_token', response.data.data.auth_token)
        window.localStorage.setItem('user_data', JSON.stringify(response.data))
        history.push('/dealer')
      })
    } catch (e) {
      setError(true)
      logger.error("Error sign in", e);
    };
  };


  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  };

  const handleCaptcha = (token: string | null) => {
    setShowCaptchaMessage(false)
    setCaptcha(token)
  }; 

 
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column id='login-column'>
        <Header as='h3' style={{ color: '0F1419', marginTop: '10px' }}textAlign='center'>
          Speed Leasing Dealer Portal
        </Header>
        {hasError && (<span style={{ color: 'red' }}>Invalid Email or password.</span>)}
        <Form size='large' onSubmit={() => handleSubmit()}>

          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              name="email"
              placeholder='E-mail address'
              value={email}
              onChange={handleEmail}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              name="password"
              onChange={handlePassword}
            />
            <Form.Field>
              <div className='login-helpers'>
                <div className='column left'>
                  <Checkbox label='Remember me'/>
                </div>
              </div>
            </Form.Field>
            <div className="captcha">
                <ReCAPTCHA
                  sitekey={`${SITE_KEY}`}
                  ref={recaptchaRef}
                  onChange={handleCaptcha}
                />
                {
                  showCaptchaMessage && (
                    <p style = {{
                      color  :'red',
                      marginBottom : 10
                    }}>Please solve the captcha</p>
                  )
                }
              </div>
            <Button 
              id='login-button'
              primary 
              fluid 
              size='large' 
              type='submit'
            >
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid >
  );
}

export default SignIn;
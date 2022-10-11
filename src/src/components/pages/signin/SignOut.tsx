import { useEffect } from 'react';
import { auth } from '../../../utils';
function SignOut() {

    useEffect(() => {
        if (auth.isAuth()) {
            auth.logout()
            window.location.href = '/login'
        } 
      });

    return (
        <div>
            
        </div>
    )
}

export default SignOut

import Cookies from 'js-cookie'

export const isAuth = () => {
  const authTokenCookies = Cookies.get('authToken')
  const fullNameCookies = Cookies.get('fullName')
  if (!authTokenCookies || !fullNameCookies){
    return false 
  }
  return true
}

export const getFullName = () => {
  return Cookies.get('fullName')
}

export const getToken = () => {
  return Cookies.get('authToken')
}

export const setAuth = (token: string, fullName: string) => {

  console.log(token)
  console.log(fullName)
  Cookies.set('authToken', token, { secure: true })
  Cookies.set('fullName', fullName, { secure: true })

  const authTokenCookies = Cookies.get('authToken')
  const fullNameCookies = Cookies.get('fullName')

  console.log(`after`)
  console.log(authTokenCookies)
  console.log(fullNameCookies)


  return authTokenCookies && fullNameCookies;
}

export const logout = () => {
  Cookies.remove('authToken')
  Cookies.remove('fullName')  
}

export default {isAuth, setAuth, getFullName, logout, getToken};
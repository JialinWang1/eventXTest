import { v4 } from 'uuid'

const getUserToken = () => {
  let userToken = sessionStorage.getItem('userToken')
  if (!userToken) {
    userToken = v4()
    sessionStorage.setItem('userToken', userToken)
  }
  return userToken
}

// eslint-disable-next-line import/prefer-default-export
export { getUserToken }

export const saveAuthData = (user, token, expirationDate) => {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('token', token)
  localStorage.setItem('expirationDate', expirationDate)
}

export const clearAuthData = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  localStorage.removeItem('expirationDate')
}

export const loadAuthData = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const expirationDate = localStorage.getItem('expirationDate')

  return { user, token, expirationDate }
}
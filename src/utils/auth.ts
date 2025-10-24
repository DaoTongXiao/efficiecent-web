const AUTH_TOKEN_KEY = 'ticket'
/**
 * getAuthToken
 * @returns token
 */
export const getAuthToken = (): string | undefined | null => {
  const token = window.sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (isTokenValid(token)) {
    return token
  }
  const topToken = (window.top || window).sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (isTokenValid(topToken)) {
    return topToken
  }
  return null
}

/**
 * setAuthToken
 * @param token
 */
export const setAuthToken = (token: string): void => {
  window.sessionStorage.setItem(AUTH_TOKEN_KEY, token)
}

/**
 * removeAuthToken
 */
export const removeAuthToken = (): void => {
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

/**
 * isTokenValid
 * @param token
 * @returns boolean
 */
export const isTokenValid = (token: string | null | undefined) => {
  return token && token !== 'undefined' && token !== ''
}

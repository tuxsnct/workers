export const validateAuthHeader = (auth: string) => {
  const splittedAuth = auth.split(' ')
  return splittedAuth.length === 2 && splittedAuth[0] === 'Bearer'
}

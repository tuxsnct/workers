import { Handler } from 'worktop'

export const handleStatus: Handler = (_request, response) => {
  response.send(200)
}

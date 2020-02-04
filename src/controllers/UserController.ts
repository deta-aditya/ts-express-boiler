import { RouteHandler, Response, Controller, Request, send } from "../utilities/Routing"

const users = [
  { name: 'Deta', birthdate: '1997-09-17', country: 'Indonesia' },
]

class UserController implements Controller {
  readonly url = '/user'
  
  @RouteHandler({ method: 'GET', url: '/' })
  index(request: Request) {
    return users as Response
  }

  @RouteHandler({ method: 'GET', url: '/new' })
  create(request: Request) {
    return send('created') as Response
  }
}

export default UserController

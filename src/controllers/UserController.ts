import { Controller, Request } from "../utilities/Routing"
import { RouteHandler } from "../utilities/RouteHandler"
import { response } from "express"
import { Respond } from "../utilities/Response"

const users = [
  { name: 'Deta', birthdate: '1997-09-17', country: 'Indonesia' },
]

class UserController implements Controller {
  readonly url = '/users'
  
  @RouteHandler({ method: 'GET', url: '/' })
  index(request: Request) {
    return users
  }

  @RouteHandler({ method: 'GET', url: '/check' })
  checkShits(request: Request) {
    const all = Object.getOwnPropertyNames(response)
    all.sort()
    return all
  }

  @RouteHandler({ method: 'GET', url: '/new' })
  create(request: Request) {
    return Respond.send('created')
  }
}

export default UserController

import { HttpMethod, send, json, isResponseContext, Response, Request, Controller } from "./Routing"

export const RouteHandlerKey = Symbol('RouteHandler')

export interface RouteHandlerSignature {
  (request: Request): Response
}

export interface RouteHandlerPayload {
  method: HttpMethod,
  url: string
}

export function RouteHandler(payload: RouteHandlerPayload): MethodDecorator {
  return (
    target: Object,
    propertyName: string, 
    propertyDescriptor: TypedPropertyDescriptor<RouteHandlerSignature>
  ) => {
    const routeHandler = propertyDescriptor.value

    propertyDescriptor.value = function(request: Request): Response {
      const response = routeHandler(request)

      return (function wrapResponse(response: Response): Response {
        if (typeof response === 'string') {
          return wrapResponse(send(response))
        } else if (Array.isArray(response)) {
          return wrapResponse(json(response))
        } else if (response.constructor === Object && !isResponseContext(response)) {
          return wrapResponse(json(response))
        } else {
          return response
        }
      })(response)
    }

    Reflect.defineMetadata(RouteHandlerKey, payload, target, propertyName)
  }
}

export function getRouteHandlerPayload(controller: Controller, propertyKey: string): RouteHandlerPayload {
  return Reflect.getMetadata(RouteHandlerKey, controller, propertyKey)
}
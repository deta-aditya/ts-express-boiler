import { Request as ExpressRequest } from "express";
import 'reflect-metadata'

export interface Controller {
  url?: string
}

export interface ResponseContext {
  function: string
  value: any
}

export function isResponseContext(response: Response): response is ResponseContext {
  return (response as ResponseContext).function !== undefined
}

export type Request = ExpressRequest
export type Response = string | Array<any> | Object | ResponseContext

export function send(value: string): ResponseContext {
  return {
    function: 'send',
    value,
  }
}

export function json(value: any): ResponseContext {
  return {
    function: 'json',
    value,
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const RouteHandlerKey = Symbol('RouteHandler')

export interface RouteHandlerSignature {
  (request: Request): Response
}

export interface RouteHandlerPayload {
  method: HttpMethod,
  url: string
}

export function RouteHandler(payload: RouteHandlerPayload) {
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

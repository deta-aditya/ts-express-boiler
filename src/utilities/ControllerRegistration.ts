import controllers from "../controllers"
import { getRouteHandlerPayload, ResponseContext, RouteHandlerPayload, RouteHandlerSignature } from "./Routing";
import { isNil } from "ramda";
import { Router, RequestHandler, Application } from "express";

interface RouteHandlerReflectionPayload {
  method: RouteHandlerSignature
  payload?: RouteHandlerPayload
}

export function registerControllers(app: Application): Application {
  controllers.forEach((controllerClass) => {
    const expressRouter = Router()
    const instance = new controllerClass()
  
    Reflect.ownKeys(controllerClass.prototype)
      .map((key: string): RouteHandlerReflectionPayload => ({ method: instance[key], payload: getRouteHandlerPayload(instance, key)}))
      .filter((context: RouteHandlerReflectionPayload): boolean => !isNil(context.payload))
      .forEach((context: RouteHandlerReflectionPayload) => {
        const expressMethod = context.payload.method.toLowerCase()
        const expressUrl = context.payload.url.length === 1 && context.payload.url.includes('/') 
          ? context.payload.url.replace('/', '') 
          : context.payload.url 
  
        const expressHandler: RequestHandler = (request, response) => {
          const customResponse = context.method(request) as ResponseContext
          response[customResponse.function](customResponse.value)
        }
  
        expressRouter[expressMethod](expressUrl, expressHandler)
      })
  
    app.use(!isNil(instance.url) ? instance.url : '/', expressRouter)
  })

  return app
}


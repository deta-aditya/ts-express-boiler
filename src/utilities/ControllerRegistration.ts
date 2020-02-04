import controllers from "../controllers"
import { ResponseContext, Controller } from "./Routing";
import { isNil } from "ramda";
import { Router, RequestHandler, Application } from "express";
import { RouteHandlerSignature, RouteHandlerPayload, getRouteHandlerPayload } from "./RouteHandler";

interface RouteHandlerReflectionContext {
  method: RouteHandlerSignature
  payload?: RouteHandlerPayload
}

function transformKeyToContext(instance: Controller) {
  return (key: string): RouteHandlerReflectionContext => ({ 
    method: instance[key], 
    payload: getRouteHandlerPayload(instance, key)
  })
}

function isValidReflectionContext(context: RouteHandlerReflectionContext) {
  return !isNil(context.payload)
}

function registerRouteHandlerToRouter(expressRouter: Router) {
  return (context: RouteHandlerReflectionContext) => {
    const expressMethod = context.payload.method.toLowerCase()

    const expressUrl = context.payload.url.length === 1 && context.payload.url.includes('/') 
      ? context.payload.url.replace('/', '') 
      : context.payload.url 

    const expressHandler: RequestHandler = (request, response) => {
      const customResponse = context.method(request) as ResponseContext
      response[customResponse.function](customResponse.value)
    }

    expressRouter[expressMethod](expressUrl, expressHandler)
  }
  
}

export function registerControllers(app: Application) {
  controllers.forEach((controllerClass) => {
    const expressRouter = Router()
    const instance = new controllerClass()
  
    Reflect.ownKeys(controllerClass.prototype)
      .map(transformKeyToContext(instance))
      .filter(isValidReflectionContext)
      .forEach(registerRouteHandlerToRouter(expressRouter))
  
    app.use(!isNil(instance.url) ? instance.url : '/', expressRouter)
  })

  return app
}


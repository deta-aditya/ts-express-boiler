
import { response } from "express"
import { keys } from "ts-transformer-keys";

export type Response = string | Array<any> | Object | ResponseContext

type ExpressResponseFunction = keyof typeof response

export interface ResponseContext {
  function: ExpressResponseFunction
  value: any
}

type ResponseFactory = {
  [key in ExpressResponseFunction]: (...args: any[]) => ResponseContext
}

export function isResponseContext(response: Response): response is ResponseContext {
  return (response as ResponseContext).function !== undefined
}

export const Respond = Object.getOwnPropertyNames(response).reduce((factories, responseFunction) => {
  return { 
    ...factories,
    [responseFunction]: (...args: any[]): ResponseContext => ({
      function: responseFunction as ExpressResponseFunction,
      value: args.length === 1 ? args[0] : args
    })
  }
}, {}) as ResponseFactory

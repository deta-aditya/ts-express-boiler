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

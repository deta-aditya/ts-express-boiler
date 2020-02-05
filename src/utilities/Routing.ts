import { Request as ExpressRequest } from "express"

export interface Controller {
  url?: string
}

export type Request = ExpressRequest

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

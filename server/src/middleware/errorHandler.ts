import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('[Error]', err.message)
  res.status(500).json({ success: false, error: err.message ?? 'Internal server error' })
}

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' })
}

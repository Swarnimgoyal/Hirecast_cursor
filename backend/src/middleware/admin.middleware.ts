import { Request, Response, NextFunction } from "express";

// Placeholder admin middleware.
// For this MVP we don't have authentication, so this simply allows all
// requests to pass through while documenting the intended extension point.
export function adminMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next();
}


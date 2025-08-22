import type { Request } from "express";

export const session = {
  regenerate(req: Request): Promise<void> {
    return new Promise((resolve, reject): void => {
      req.session.regenerate(err => {
        if (err) reject(err);

        resolve();
      });
    });
  },

  save(req: Request): Promise<void> {
    return new Promise((resolve, reject): void => {
      req.session.save(err => {
        if (err) reject(err);

        resolve();
      });
    });
  },

  destroy(req: Request): Promise<void> {
    return new Promise((resolve, reject): void => {
      req.session.destroy(err => {
        if (err) reject(err);

        resolve();
      });
    });
  },
};

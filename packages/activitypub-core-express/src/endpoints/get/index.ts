import type { Request } from "express";
import type { ServerResponse } from "http";

export const handleIndexGetRequest = async (req: Request, res: ServerResponse & {
  render: Function;
}) => {
  res.statusCode = 200;
  res.render('index.njk', {});
};
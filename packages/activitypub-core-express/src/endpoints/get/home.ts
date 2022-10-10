import { homeGetHandler } from 'activitypub-core';
import type { IncomingMessage, ServerResponse } from 'http';
import serviceAccount from "../../credentials";

export const handleHomeGetRequest = async (req: IncomingMessage, res: ServerResponse & {
  render: Function;
}) => {
  const result = await homeGetHandler({
    req,
    res,
  }, serviceAccount);

  if (result.redirect) {
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
    return;
  }

  if (Object.keys(result.props).length) {
    res.statusCode = 200;
    res.render('home.njk', result.props);
    return;
  }

  res.statusCode = 500;
  res.end();
  return;
};
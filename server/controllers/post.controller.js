import * as PractiNet from '../apis/practi.net';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getFromBackoffice(req, res) {
  PractiNet.getFromBackoffice(req.body ,(err, result) => {
    if (err) {
      res.status(500).send(err);
    } else
      res.status(200).send(result.data);
  });
}
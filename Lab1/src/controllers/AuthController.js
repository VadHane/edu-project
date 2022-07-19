import { signature } from '../config';

export const getSignedUrl = (req, res) => {
    try {
        const signedUrl = signature.sign(req.body.url);

        res.status(200).json(signedUrl).end();
    } catch {
        res.status(500).end();
    }
};

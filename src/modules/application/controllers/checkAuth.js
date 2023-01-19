import { verifyToken } from "../../../utilities/jsonWebToken.js";
export const checkAuth = (req, res, next) => {
    let authorization = req.headers["authorization"];
    const token = authorization && authorization.split(" ")[1];
    if (!authorization) {
        res.sendStatus(401);
        return;
    }
    try {
        verifyToken(token);
    } catch (error) {
        res.status(401).send(error);
        return;
    }
    next();
};

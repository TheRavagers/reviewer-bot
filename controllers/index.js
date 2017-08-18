export default class Index {

    constructor() { }

    pullRequest = (req, res, next) => {
        const body = req.body;

        res.status(200).json({});

    }

}
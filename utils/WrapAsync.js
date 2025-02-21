function wrapAround(fn) {
    return function (req, res, next) {
        try {
            fn(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}


export default wrapAround;
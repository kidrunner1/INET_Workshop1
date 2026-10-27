const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return res.status(400).json({
                status: 400,
                message: "validation failed",
                data: errors
            });
        }

        // Pass validated/normalized body values to controllers.
        if (result.data.body !== undefined) req.body = result.data.body;
        next();
    };
};

module.exports = validateRequest;

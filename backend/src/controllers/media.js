const express = require('express');

const MediaController = (mediaModel) => {
    const router = express.Router();

    // Get media by ID
    router.get('/', async (req, res) => {
        // Validate the query
        if (req.query.id == undefined) {
            return res.sendStatus(400);
        }

        const id = req.query.id;
        const data = await mediaModel.getMediaByID(id);

        // Return different status messages based on query result
        if (data == null) {
            return res.status(404).json({
                'message': 'Media not found'
            });
        }

        return res.status(200).json(data);
    });

    return router;
}

module.exports = MediaController;
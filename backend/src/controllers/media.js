const express = require('express');
const {body, query, validationResult} = require('express-validator');

const MediaController = (mediaModel) => {
    const router = express.Router();

    // Get media by ID or phrase
    router.get('/', [
        query('id').isInt(),
        query('phrase').exists(),
        query('urlOnly').isBoolean()
    ], async(req, res) => {
        const invalidResult = validationResult(req).mapped();
        let data = '';
        let urlOnly = false;

        // Defaults to not URL only
        if (!('urlOnly' in invalidResult)) {
            urlOnly = req.query.urlOnly;
        }
        
        // Both ID and phrase can't be provided
        if (!('id' in invalidResult) && !('phrase' in invalidResult)) {
            return res.status(400).json({
                message: 'Invalid request'
            });
        } else if ('phrase' in invalidResult) {
            data = await mediaModel.getMediaByID(req.query.id, urlOnly);
        } else if ('id' in invalidResult) {
            data = await mediaModel.getMediaByPhrase(req.query.phrase, urlOnly);
        }

        if (data == null) {
            return res.status(404).json({
                'message': 'Results not found'
            });
        }

        return res.status(200).json(data);
    });

    // Get media by publisher(s)
    router.get('/publishers', [
        body('publishers').isArray()
    ], async(req, res) => {
        const invalidResult = validationResult(req).mapped();
        let data = '';

        if (!('publishers' in invalidResult)) {
            data = await mediaModel.getMediaByPublishers(req.body.publishers);
        } else {
            return res.status(400).json({
                message: 'Invalid request'
            });
        }

        if (data == null) {
            return res.status(404).json({
                'message': 'Results not found'
            })
        }

        return res.status(200).json(data);
    });

    // Get media by creator(s)
    router.get('/creators', [
        body('creators').isArray()
    ], async(req, res) => {
        const invalidResult = validationResult(req).mapped();
        let data = '';

        if (!('creators' in invalidResult)) {
            data = await mediaModel.getMediaByCreators(req.body.creators);
        } else {
            return res.status(400).json({
                message: 'Invalid request'
            });
        }

        if (data == null) {
            return res.status(404).json({
                'message': 'Results not found'
            })
        }

        return res.status(200).json(data);
    });

    return router;
}

module.exports = MediaController;
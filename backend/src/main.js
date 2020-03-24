require('dotenv').config();

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const PostgresDB = require('./db');
const MediaTable = require('./models/media/postgres');
const MediaModel = require('./models/media')
const MediaController = require('./controllers/media');

function main(port) {
    // Sets up the Postgres database
    const postgres = PostgresDB();
    
    // Set up the media table
    const mediaTable = MediaTable(postgres);
    mediaTable.setupTable();

    // Set up the media model and read the data
    const mediaModel = MediaModel(mediaTable);
    mediaModel.loadInitData(__dirname + '/data/codefoobackend_cfgames.csv')

    // Set up the media controller to handle API requests
    const mediaController = MediaController(mediaModel);
    
    // Creates the Express server
    const app = express();
    app.use(compression());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());

    // Setup a router
    const router = express.Router();
    router.use('/media', mediaController);
    
    app.use('/api', router);

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

// Run on localhost at the port specified by the
// environment. Defaults to port 3000.
main(process.env.PORT || 3000)
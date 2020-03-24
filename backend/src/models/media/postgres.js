const MediaTable = (postgres) => {   
    const SQL_createMediaTable = `
        CREATE TABLE IF NOT EXISTS media(
            id SERIAL PRIMARY KEY,
            media_type TEXT NOT NULL,
            name TEXT NOT NULL,
            short_name TEXT,
            long_description TEXT,
            short_description TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            review_url TEXT,
            review_score NUMERIC(3, 1),
            slug TEXT,
            genres TEXT[],
            created_by TEXT[],
            published_by TEXT[],
            franchises TEXT[],
            regions TEXT[]
        )
    `;

    const setupTable = async() => {       
        try {                        
            const client = await postgres.connect();
            await client.query(SQL_createMediaTable);      
            client.release();
            console.log("Media table created!");
        }
        catch (err) {
            console.error(err);
        }
    }

    const SQL_dropMediaTable = `
        DROP TABLE IF EXISTS media
    `;

    const dropTable = async() => {       
        try {            
            const client = await postgres.connect();
            await client.query(SQL_dropMediaTable);
            client.release();
            console.log("Media table dropped!");
        }
        catch (err) {
            console.error(err);
        }
    }

    const SQL_insertRow = `
        INSERT INTO media 
        (
            id, 
            media_type, 
            name,
            short_name, 
            long_description, 
            short_description, 
            created_at, 
            updated_at, 
            review_url, 
            review_score, 
            slug, 
            genres, 
            created_by, 
            published_by, 
            franchises, 
            regions
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `

    const addRowsFromCSV = async(csvData) => {       
        const client = await postgres.connect();

        csvData.forEach(row => {
            client.query(SQL_insertRow, Object.values(row), (err, res) => {
                if (err) {
                    console.log(err);
                }
            });
        })

        client.release();
    }

    const SQL_getMediaByID = `
        SELECT * FROM media WHERE id = $1
    `

    const SQL_getMediaByID_urlOnly = `
        SELECT review_url FROM media WHERE id = $1
    `

    const getMediaByID = async(id, urlOnly) => {
        const client = await postgres.connect();
        let res = null;
        
        if (!urlOnly)
            res = await client.query(SQL_getMediaByID, [id]);
        else
            res = await client.query(SQL_getMediaByID_urlOnly, [id]);

        client.release();
        return res.rows[0];
    }

    const SQL_getMediaByPhrase = `
        SELECT * FROM media WHERE LEFT(LOWER(name), $1) LIKE LOWER($2)
    `

    const SQL_getMediaByPhrase_urlOnly = `
        SELECT review_url FROM media WHERE LEFT(LOWER(name), $1) LIKE LOWER($2)
    `;

    const getMediaByPhrase = async(phrase, urlOnly) => {
        const client = await postgres.connect();
        let res = null;
        
        if (!urlOnly)
            res = await client.query(SQL_getMediaByPhrase, [phrase.length, phrase]);
        else
            res = await client.query(SQL_getMediaByPhrase_urlOnly, [phrase.length, phrase]);
        
        client.release();
        return res.rows;
    }

    const SQL_getMediaByPublishers = `
        SELECT * FROM media, UNNEST(published_by) AS pb
        WHERE pb = ANY($1)
    `

    const getMediaByPublishers = async(publishers) => {
        const client = await postgres.connect();
        const res = await client.query(SQL_getMediaByPublishers, [publishers]);

        client.release();
        return res.rows;
    }

    const SQL_getMediaByCreators = `
        SELECT * FROM media, UNNEST(created_by) AS cb
        WHERE cb = ANY($1)
    `;

    const getMediaByCreators = async(creators) => {
        const client = await postgres.connect();
        const res = await client.query(SQL_getMediaByCreators, [creators]);

        client.release();
        return res.rows;
    };

    return {
        setupTable,
        dropTable,
        addRowsFromCSV,
        getMediaByID,
        getMediaByPhrase,
        getMediaByPublishers,
        getMediaByCreators
    };
}

module.exports = MediaTable;
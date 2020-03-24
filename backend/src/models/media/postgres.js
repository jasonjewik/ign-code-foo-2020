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

    const getMediaByID = async(id) => {
        const client = await postgres.connect();
        const res = await client.query(SQL_getMediaByID, [id]);
        client.release();
        return res.rows[0];
    }

    return {
        setupTable,
        dropTable,
        addRowsFromCSV,
        getMediaByID
    };
}

module.exports = MediaTable;
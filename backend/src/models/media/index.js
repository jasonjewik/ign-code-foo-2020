const fs = require('fs');
const fastcsv = require('fast-csv');
const moment = require('moment');

const MediaModel = (table) => {
    
    const loadInitData = async(filepath) => {
        
        // Test to ensure the given file actually exists
        // and can be read by Node
        fs.access(filepath, fs.constants.R_OK, (err) => {
            if (err) {
                return console.error(err);
            }
        });

        let csvData = [];
        let csvStream = fastcsv.parse({headers: true, trim: true})
            .validate((row, cb) => {
                // Convert all times to UTC
                row['created_at'] = moment.utc(row['created_at']).format();
                row['updated_at'] = moment.utc(row['updated_at']).format();

                // Remove HTML tags from long description
                row['long_description'] = row['long_description'].replace('<p>', '');

                let errors = [];
                
                // Ensures that arrays are passed
                const arrayCols = ['genres', 'created_by', 'published_by', 'franchises', 'regions'];
                arrayCols.forEach((colName) => {
                    row[colName] = '{' + row[colName].slice(1, -1) + '}';
                })
                // NOTE: Postgres arrays are weird because sometimes quotation marks are inserted
                // and other times not

                if (errors.length > 0) {
                    return cb(null, false, errors);
                }
                return cb(null, true);
            })
            .on('error', (err) => {
                console.log(err);
            })
            .on('data-invalid', (row, rowNum, reasons) => {
                if (reasons.includes('short_name')) {
                    row['short_name'] = row['name'];
                }
        
                csvData.push(row);
            })
            .on('data', (row) => {
                csvData.push(row);
            })
            .on('end', (rowCount) => {
                table.addRowsFromCSV(csvData);
                console.log(`Parsed ${rowCount} rows`);
            })
        
        const readStream = fs.createReadStream(filepath);
        readStream.pipe(csvStream);
    }

    const getMediaByID = async(id, urlOnly) => {
        return table.getMediaByID(id, urlOnly);
    }

    const getMediaByPhrase = async(phrase, urlOnly) => {
        return table.getMediaByPhrase(phrase, urlOnly);
    }

    const getMediaByPublishers = async(publishers) => {
        return table.getMediaByPublishers(publishers);
    };

    const getMediaByCreators = async(creators) => {
        return table.getMediaByCreators(creators);
    };

    return {
        loadInitData,
        getMediaByID,
        getMediaByPhrase,
        getMediaByPublishers,
        getMediaByCreators
    };
}

module.exports = MediaModel
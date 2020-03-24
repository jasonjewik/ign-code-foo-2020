const PostgresDB = require('./db');
const MediaTable = require('./models/media/postgres');

function main() {
    // Connects to the Postgres DB
    const postgres = PostgresDB();

    // Drops the media table
    const mediaTable = MediaTable(postgres);
    mediaTable.dropTable();
}

main()
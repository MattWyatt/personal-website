const mysql = require("mysql");

const config = require("./mysqlConfig.json");

var databaseConnection;
module.exports.init = () => {
    databaseConnection = mysql.createConnection({
        host: config.host,
        user: config.login.username,
        password: config.login.password,
        database: config.blogDatabaseName
    });
    var createPostTable = "CREATE TABLE IF NOT EXISTS posts (title TEXT, content TEXT)";
    var createAuthTable = "CREATE TABLE IF NOT EXISTS auth (hash CHAR(60))";
    databaseConnection.query(createPostTable, (error) => {
        if (error) throw error;
    });
    databaseConnection.query(createAuthTable, (error) => {
        if (error) throw error;
    });
    console.log("connection to database established!");
}

module.exports.get = (callback) => {
    if (databaseConnection == undefined) {
        throw "database accessed without initialized yet!";
        return;
    }
    else {
        callback(databaseConnection);
    }
}
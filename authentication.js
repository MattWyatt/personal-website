const bcrypt = require("bcrypt");

const database = require("./database.js");

function get(callback) {
    database.get((dbConnection) => {
        dbConnection.query("SELECT hash FROM auth", (error, result) => {
            if (error) throw error;
            console.log("hash: " + result[0].hash);
            callback(result[0].hash)
        });
    });
}

module.exports.check = (password, callback) => {
    if (password == undefined) {
        callback(false);
        return;
    }
    get((data) => {
        if (bcrypt.compareSync(password, data)) {
            callback(true);
        }
        else {
            callback(false);
        }
    })
}
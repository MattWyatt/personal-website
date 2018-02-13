//this script is run with [npm run-script setup] to setup the password authentication for the blog

const bcrypt = require("bcrypt");
const readline = require("readline");
const writable = require("stream").Writable;

const database = require("./database.js");

var muteOut = new writable({
    write: function(chunk, encoding, callback) {
        if (!this.muted)
            process.stdout.write(chunk, encoding);
        callback();
    }
});
muteOut.muted = false;

const rl = readline.createInterface({
    input: process.stdin,
    output: muteOut,
    terminal: true
});

function resetHashStorage(dbConnection) {
    return new Promise ((resolve, reject) => {
        dbConnection.query("CREATE TABLE IF NOT EXISTS auth (hash CHAR(128))", (error, result) => {
            if(error) throw error;
            dbConnection.query("DELETE FROM auth", (error, result) => {
                if(error) throw error;
                resolve();
            });
        });
    });
}

function doPasswordStorage(dbConnection) {
    return new Promise((resolve, reject) => {
        console.log("input password: ")
        rl.question("", (answer) => {
            console.log("\nconfirm password: ")
            rl.question("", (confirmation) => {
                if (answer != confirmation) throw "passwords do not match, quitting...";
                console.log("generating and storing hash...");
                var hash = bcrypt.hashSync(answer, 10);
                dbConnection.query("INSERT INTO auth (hash) VALUES (\"" + hash + "\")", (error, result) => {
                    if(error) throw error;
                    console.log("password securely written to database!");
                    dbConnection.end();
                    rl.close();
                    resolve()
                });
            });
        });
    });
}

database.init();
database.get((connection) => {
    resetHashStorage(connection).then(doPasswordStorage(connection));
    muteOut.muted = true;
});
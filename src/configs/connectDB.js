import mysql from "mysql2";
require('dotenv').config();
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

connection.connect(function(err){
    if (err) throw err;
        console.log("Database connected");
});

module.exports =connection;
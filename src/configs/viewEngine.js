import express from "express";
/**
 * SE CONFIGURAN LOS view engine PARA app
 */
let configViewEngine = (app)=> {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views","./src/views");
};

module.exports = configViewEngine;

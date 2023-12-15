const express = require("express");
const { join } = require("path");

const app = express();

const initializeVariables = () =>  {
    app.set("port", process.env.port || 3000);
}

const initializeUtils = () => {
    app.use(express.json());
    app.use(express.static(join(__dirname, "../public")))
}


const startListening =  () => {
    const port = app.get("port");
    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    })
}

const initializeRoutes = (routes) => {
    app.use(routes)
}

const startApp = routes => {
    initializeVariables();
    initializeUtils();
    initializeRoutes(routes);
    startListening();
}

module.exports = startApp;
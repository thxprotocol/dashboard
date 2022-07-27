const fs = require('fs');

module.exports = {
    publicPath: '/',
    devServer: {
        https: true,
        port: 8082,
        key: process.env.VUE_APP_LOCAL_CERT_KEY ? fs.readFileSync(process.env.VUE_APP_LOCAL_CERT_KEY) : undefined,
        cert: process.env.VUE_APP_LOCAL_CERT ? fs.readFileSync(process.env.VUE_APP_LOCAL_CERT) : undefined,
        ca: process.env.VUE_APP_LOCAL_CERT_CA ? fs.readFileSync(process.env.VUE_APP_LOCAL_CERT_CA) : undefined,
    },
};

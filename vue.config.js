const fs = require('fs');

module.exports = {
    publicPath: '/',
    devServer: {
        host:'localhost',
        https: true,
        port: 8082,
        key: process.env.LOCAL_CERT_KEY ? fs.readFileSync(process.env.LOCAL_CERT_KEY) : undefined,
        cert: process.env.LOCAL_CERT ? fs.readFileSync(process.env.LOCAL_CERT) : undefined,
    },
};

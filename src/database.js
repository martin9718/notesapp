require('./config/config');

const mongoose = require('mongoose');

mongoose.connect(process.env.URLDB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(db => console.log('DB is conected'))
    .catch(err => console.log(err));
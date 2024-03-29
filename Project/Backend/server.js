require('dotenv').config();

require('./config/cloudinary.config').config();
const cors = require('cors');
const Carbon = require('./framework');

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN.split(' ').map(origin => new RegExp(origin)),
    optionsSuccessStatus: 200
}

const app = Carbon();

app.useMiddleware(cors(corsOptions));

app.listen(process.env.PORT || 3000);

module.exports = app;
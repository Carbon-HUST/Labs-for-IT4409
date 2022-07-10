require('dotenv').config();
require('./config/cloudinary.config').config();
const cors = require('cors');
const Carbon = require('./framework');

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN.split(' '),
    optionsSuccessStatus: 200
}

const app = Carbon();

app.useMiddleware(cors(corsOptions));

app.listen(3000);
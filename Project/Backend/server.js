require('dotenv').config();
require('./config/cloudinary.config').config();

const Carbon = require('./framework');

const app = Carbon();

app.listen(3000);
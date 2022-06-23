const formidable = require('formidable');
const path = require('path');

module.exports = formidable({
    multiples: true,
    uploadDir: path.join(__dirname, '..', 'upload'),
    keepExtensions: true
});
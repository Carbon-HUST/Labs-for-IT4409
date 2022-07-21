const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;
const Post = require('../models/Post');

class PostsController extends BaseController {
    async index() {
        const res = await Post.getAll();
        return this.ok({
            count: res.length,
            data: res
        });
    }

    async upload() {
        //this.files = [{filename1, file1}, {filename2, file2}, ...]
        for (let i = 0; i < this.files.length; ++i)
        {
            console.log(this.files[i]['file']);
        }
    }
}

module.exports = PostsController
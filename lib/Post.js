const { kebabCase } = require('lodash');

class Post {
    id;
    title;
    slug;
    body;
    tags;
    image;

    constructor(id, title, body, tags, image){
        this.id = id;
        this.slug = kebabCase(title);
        this.title = title;
        this.body = body;
        this.image = image;
        this.tags = tags;
    }
}

module.exports = Post;
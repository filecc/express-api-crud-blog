const express = require("express");
const fs = require("fs");
const path = require("path");
const env = require("dotenv").config();
const Post = require("../lib/Post");

const port = process.env.PORT ?? "";
const host = process.env.HOST.includes("localhost")
  ? "localhost"
  : "https://" + process.env.HOST + "/";

const posts = JSON.parse(
  fs.readFileSync(path.resolve("./db/posts.json"), "utf8")
);

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

function index(req, res) {
  if (!posts) {
    res.status(404).json({ error: 404, message: "Posts not found" });
    return;
  }

  res.json(posts);
}

function show(req, res) {
  const post = posts.find((post) => post.id == req.params.id);

  if (!post) {
    res
      .status(404)
      .send({ error: 404, message: `Post with id ${req.params.id} not found` });
    return;
  }
  const imgPath = `http://${host}:${port}/images${post.image}`;
  const downloadLink = `http://localhost:3000/posts/${post.slug}/download`;
  res.json({
    ...post,
    image_url: `${imgPath}`,
    download_link: `${downloadLink}`,
  });
}

function store (req, res) {
  console.log(req.file)
  const lastId = posts.map((post) => post.id).sort().reverse()[0]

  const data = req.body
  const tags = data.tags.split(",").map((tag) => tag.trim())

  const imageSlug = '/'+ req.file.filename + '.jpg'

  const newPost = new Post(
    lastId + 1, 
    data.title, 
    data.content,
    tags,
    imageSlug,
    )

    posts.push(newPost)

    fs.writeFileSync(path.resolve("./db/posts.json"), JSON.stringify(posts, null, 2))
    fs.renameSync(req.file.path, path.resolve(`./public/images${imageSlug}`))
    

    res.status(300).redirect(`/posts/${newPost.id}`)
  
}

module.exports = {
  index,
  show,
  store
};

const express = require("express");
const fs = require("fs");
const path = require("path");
const env = require("dotenv").config();

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
  const post = posts.find((post) => post.id === req.params.id);

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

module.exports = {
  index,
  show,
};

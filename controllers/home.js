const express = require("express");
const fs = require("fs");
const path = require("path");

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function index (req, res) {
    res.send(`<h1>Benvenuto nel mio blog</h1> <a href="/posts">Vai ai post</a> <br> <a href="/posts/new">Crea nuovo post</a>`)
   
}

module.exports = {
    index
  }
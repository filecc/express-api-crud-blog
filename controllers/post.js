const express = require("express");
const fs = require("fs");
const path = require("path");
const env = require("dotenv").config();

const port = process.env.PORT ?? ''
const host = process.env.HOST.includes('localhost') ? 'localhost' : ('https://' + process.env.HOST + '/')
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function index (req, res) {
    const posts = JSON.parse(fs.readFileSync(path.resolve("./db/posts.json"), "utf8"))
    if(!posts){
        res.status(404).send("Not found")
        return
    }
    const html = ['<ul>']

    html.push(posts.map(
          (post) => 
          `<li>
            <a href="/posts/${post.id}" style='font-weight: bold; display: block; padding: 1rem 0;'>${post.title}</a>
            <img style="max-width: 200px" src='/images${post.image}' />
            <p>${post.body}</p>
            <span>${post.tags.join(", ")}</span>
        </li>
        `
        )
        .join("")
    );

    
    html.push('</ul>')
    html.push('<a href="/">Torna alla home</a>')
    
    res.format({
        text: () => {
            res.send(html.join(''))
        },
        html: () => {
           res.send(html.join(''))
        },
        json: () => {
            res.send(posts)
        }
    })
   
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function show (req, res) {
    const posts = JSON.parse(fs.readFileSync(path.resolve("./db/posts.json"), "utf8"))
    if(!posts){
        res.status(404).send("Not found")
        return
    }
    
    const post = posts.find(post => post.id === req.params.id)
    if (!post) {
        res.status(404).send({error: 404, message: `Post with id ${req.params.id} not found`})
        return
    }
    const imgPath = (`http://${host}:${port}/images${post.image}`)
    const downloadLink= (`http://localhost:3000/posts/${post.slug}/download`)

    const html = `
    <h1>${post.title}</h1>
    <img style="max-width: 200px" src='/images${post.image}' />
    <br>
    <div style='margin: 1rem 0; display: flex; gap: .2rem; align-items: center'>
        <a style='font-weight: bold; display: flex; align-items: center; gap: .2rem' href="${imgPath}">
            <svg style='width: 20px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>Apri immagine
        </a> 
        <a style='font-weight: bold; display: flex; align-items: center; gap: .2rem' href="${downloadLink}">
            <svg style='width: 20px' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>Scarica immagine
        </a>
    </div>
    <p>${post.body}</p>
    <span>${post.tags.join(", ")}</span>
    <a style='font-weight: bold; display: block; padding: 1rem 0;' href="/posts">Torna alla lista dei post</a>`;

    res.send(html)
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function create (req, res) {
    res.format({
        html: () => {
            res.send(`<h1>Creazione nuovo post</h1>`)
        },
        default: () => {
            res.status(406).send("Not Acceptable")
        }
    }
    )
    
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function download (req, res) {
    const posts = JSON.parse(fs.readFileSync(path.resolve("./db/posts.json"), "utf8"))
    const slug = req.params.slug
    const image = posts.find(post => post.slug === slug).image
    res.download(`./public/images${image}`)
}


module.exports = {
    index,
    show,
    create,
    download
  }
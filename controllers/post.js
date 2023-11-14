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
    const posts = JSON.parse(fs.readFileSync(path.resolve("./db/posts.json"), "utf8")).sort((a, b) => b.id - a.id)
    if(!posts){
        res.status(404).send("Not found")
        return
    }
    const html = ['<a href="/">Torna alla home</a>', '<ul>']

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
    
    const post = posts.find(post => post.id == req.params.id)
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
    <form action="/api/delete/${post.id}" method="POST">
    <input type="hidden" name="id" value="${post.id}">
    <div style="display: flex; align-items:center; gap: .2rem;">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
<input style='margin: 1rem 0;' type="submit" value="Cancella questo post">
    </div>
        
    </form>
    <a style='font-weight: bold; display: block; padding: 1rem 0;' href="/posts">Torna alla lista dei post</a>
    
    
    `;

    res.send(html)
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function create (req, res) {
    res.format({
        html: () => {
            res.sendFile(path.resolve("./components/form.html"))
        },
        default: () => {
            res.status(406).send("Not Acceptable")
        }
    }
    )
    
}

function store (req, res) {
    console.log(req.body)
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
    download,
    store
  }
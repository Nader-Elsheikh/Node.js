const fs = require('fs')
const http = require('http')
const url = require('url')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')
///////////////////////////////////////////////////////////////////////////////////////
/// Files
// Blocking , Synchronous Way
/*const textIn =fs.readFileSync('./txt/input.txt','utf-8')
console.log(textIn)
const textOut = 'this is some knowladge about avacado:'+ textIn +'\n Created on '+ Date.now()
fs.writeFileSync('./txt/output.txt',textOut)
console.log('File Written!') */

// Non-Blocking , aSynchronous Way

/* fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
    fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
        console.log(data2)
        fs.readFile(`./txt/append.txt`,'utf-8',(err,data3)=>{
            console.log(data3)
            fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
                console.log('the final file has been written')
            })
            })
        })
})
console.log('Reading the file') */

///////////////////////////////////////////////////////////////////////////////////////
/// Server
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const cards = fs.readFileSync(`${__dirname}/templates/card_tem.html`, 'utf-8')
const product_Temp = fs.readFileSync(`${__dirname}/templates/product_tem.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const obj = JSON.parse(data)


const slugs = obj.map(el => slugify(el.productName, { lower: true }))
console.log(slugs)


const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true)


    //Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/HTML' })
        const cardsHtml = obj.map(el => replaceTemplate(cards, el)).join('')
        const output = overview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)
    }

    // Product Page
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = obj[query.id]
        const output = replaceTemplate(product_Temp, product)
        res.end(output)
    }

    //API
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    }


    // NOt found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'knowledge': 'the page can\'t load'
        })
        res.end('<h1>file not found</h1>')
    }

})

server.listen(8080, '127.0.0.1', () => {
    console.log('The new port is starting by now')
})

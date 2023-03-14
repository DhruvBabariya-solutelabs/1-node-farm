import fs from 'fs';
import http from 'http';
import url from 'url';
import slugify from 'slugify'
import replaceTemplate from './replaceTemplate.js';

// Blocking Synchronous Way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `Dhruv Babariya : ${textIn}.
// Date = ${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log("Written in File");

// // Non-blocking Asynchronous Way

// fs.readFile("./txt/start.txt","utf-8",(err,data)=>{
//     if(err){
//         console.log(err);

//     }else{
//         console.log(data);
//     }
// })


const tempProduct = fs.readFileSync('./templates/Template-product.html','utf-8');
const tempcard = fs.readFileSync('./templates/Template-card.html','utf-8');
const tempOverview = fs.readFileSync('./templates/Template-overview.html','utf-8');

const data = fs.readFileSync(`./dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const slug = dataObj.map((el)=> slugify(el.productName,{lower : true}))
console.log(slug);

const server = http.createServer((request,response)=>{

    const { query, pathname } = url.parse(request.url, true); 
    console.log(url.parse(request.url,true));
    console.log(pathname);

    //Product 
    if (pathname === '/product'){
        
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        response.end(output);
    }

    //Overview
    else if (pathname === '/overview'){
        response.writeHead(200,{'Content-type':'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempcard,el)).join(''); 
        const output = tempOverview.replace('{%PRODUCTS_CARD%}',cardsHtml);
        response.end(output);
        
    }

    //Api
    else if (pathname === '/api'){
        
        console.log(dataObj);
        response.writeHead(200,{'Content-type' : 'application/json'});
        response.end(data);
    }

    //Not Found Page
    else {
        response.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'Hello worls'
        });
        response.end('<h1>Page Not Found</h1>');
    }
})
server.listen(3000,'127.0.0.1',()=>{
    console.log("server Start on Port no 3000");    
});


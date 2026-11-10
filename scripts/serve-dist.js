const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..','dist');
const types={'.html':'text/html; charset=utf-8','.md':'text/markdown; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end('Bad request');return}
  if(pathname==='/')pathname='/index.html';
  if(pathname.endsWith('/'))pathname+='index.html';
  const file=path.resolve(root,`.${pathname}`);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end('Forbidden');return}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404).end('Not found');return}
    res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','x-content-type-options':'nosniff'}).end(data);
  });
});

server.listen(Number(process.env.PORT)||4173,'127.0.0.1');

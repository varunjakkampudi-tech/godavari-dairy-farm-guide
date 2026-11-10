const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dest=path.join(root,'dist');
fs.rmSync(dest,{recursive:true,force:true});
fs.mkdirSync(dest,{recursive:true});
const entries=['index.html','offline.html','manifest.webmanifest','research','sw.js','assets','pages',...fs.readdirSync(root).filter(name=>name.endsWith('.md'))];
for(const name of entries){const source=path.join(root,name);if(fs.existsSync(source))fs.cpSync(source,path.join(dest,name),{recursive:true});}


const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const pageFiles=[path.join(root,'index.html'),...fs.readdirSync(path.join(root,'pages')).filter(n=>n.endsWith('.html')).map(n=>path.join(root,'pages',n))];
const decode=s=>s.replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"');
const plain=s=>decode(s.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).trim();
const categoryFor=(file,title='')=>{const key=(path.basename(file,'.html')+' '+title).toLowerCase();if(/faq|frequently asked|common questions/.test(key))return'faq';if(/breed/.test(key))return'breed';if(/health|veterinary|vaccin|emergency|disease|symptom/.test(key))return'health';if(/feed|nutrition|fodder/.test(key))return'feed';if(/market|buyer|milk/.test(key))return'market';if(/finance|calculator|cash/.test(key))return'finance';if(/season|summer|monsoon|winter/.test(key))return'seasons';if(/legal|scheme|insurance|compliance/.test(key))return'legal';if(/operation|staff|employee|milking|daily/.test(key))return'operations';return'guide'};
const sectionId=(heading,index)=>`${heading.toLocaleLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'section'}-${index+1}`;
const items=[];
for(const file of pageFiles){
 let html=fs.readFileSync(file,'utf8');
 const title=plain((html.match(/<h1[^>]*>(.*?)<\/h1>/is)||html.match(/<title>(.*?)<\/title>/is)||[])[1]||path.basename(file));
 const url=path.relative(root,file).replace(/\\/g,'/');
 let main=(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)||[])[1]||html;
 const pageText=plain(main);
 items.push({title,url,snippet:pageText.slice(0,220),text:pageText,category:categoryFor(file,title),kind:'page'});
 let index=0;
 main=main.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,(full,level,attrs,content)=>{
  const heading=plain(content),number=index++;if(!heading)return full;
  if(/\bid=["'][^"']+["']/i.test(attrs))return full;
  return `<h${level}${attrs} id="${sectionId(heading,number)}">${content}</h${level}>`;
 });
 if(main!==(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)||[])[1]){
  const mainMatch=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if(mainMatch)html=html.replace(mainMatch[0],mainMatch[0].replace(mainMatch[1],main));
  fs.writeFileSync(file,html);
 }
 const headingRe=/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
 let match,sectionIndex=0;
 while((match=headingRe.exec(main))){
  const heading=plain(match[3]); if(!heading)continue;
  const tail=main.slice(headingRe.lastIndex),next=tail.search(/<h[23]\b/i),fragment=next<0?tail:tail.slice(0,next),excerpt=plain(fragment).slice(0,360);
  const existing=(match[2].match(/\bid=["']([^"']+)["']/i)||[])[1];
  const fragmentId=existing||sectionId(heading,sectionIndex);
  sectionIndex++;
  items.push({title:heading,url:`${url}#${fragmentId}`,snippet:excerpt||heading,text:`${heading} ${excerpt}`,category:categoryFor(file,`${title} ${heading}`),kind:'section'});
 }
 if(categoryFor(file,title)==='faq'){
  for(const faq of main.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/gi)){
   const id=(faq[1].match(/\bid=["']([^"']+)["']/i)||[])[1],question=plain((faq[2].match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)||[])[1]||''),answer=plain(faq[2].replace(/<summary\b[^>]*>[\s\S]*?<\/summary>/i,''));
   if(question)items.push({title:question,url:`${url}${id?`#${id}`:''}`,snippet:answer.slice(0,320),text:`${question} ${answer}`,category:'faq',kind:'faq'});
  }
 }
}
const runDataset=(file,needle,variable)=>{const source=fs.readFileSync(file,'utf8'),end=source.indexOf(needle);if(end<0)throw Error(`Search data extraction anchor missing in ${file}`);return vm.runInNewContext(`${source.slice(0,end)}return ${variable};})()`,{document:{getElementById:()=>null,querySelector:()=>null}})};
const healthPath=path.join(root,'assets','health-library.js');
const health=runDataset(healthPath,"const host=document.getElementById('condition-library')",'data');
for(const row of health){const[name,...fields]=row,slug=name.toLocaleLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const text=fields.filter(v=>typeof v==='string'&&!/^https?:/.test(v)).join(' ');items.push({title:name,url:`pages/health.html#condition-${slug}`,snippet:text.slice(0,260),text:`${name} ${text}`,category:'health',kind:'condition'});}
const breedPath=path.join(root,'assets','breed-data.js');
const breeds=runDataset(breedPath,"const body=document.querySelector('#breed-table tbody')",'rows');
for(const row of breeds){const slug=row.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');items.push({title:`${row.name} buffalo`,url:`pages/breeds.html#breed-${slug}`,snippet:`${row.kind}. Home tract: ${row.tract}. ${row.accession}`,text:`${row.name} buffalo ${row.kind} ${row.tract} ${row.accession}`,category:'breed',kind:'breed'});}
fs.writeFileSync(path.join(root,'assets','search-index.json'),JSON.stringify(items));

if('serviceWorker'in navigator){const root=document.currentScript?.dataset.root??'./';window.addEventListener('load',()=>navigator.serviceWorker.register(root+'sw.js').catch(()=>{}))}

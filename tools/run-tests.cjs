// Self-contained local browser tests. An existing BASE_URL can target a preview instead.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const all=['test.cjs','test-plus.cjs','test-paint.cjs','test-music.cjs','test-beats.cjs','test-fx.cjs','test-games.cjs','test-cloud-arcade.cjs','test-cloud-fit.cjs','test-polish.cjs','test-dashboard.cjs','test-a11y.cjs','test-popstorm.cjs','test-adventures.cjs','test-expanded-core.cjs','test-resources.cjs','test-reliability.cjs','test-cloud-email.cjs','test-seasons.cjs'];
const tests=process.argv.slice(2).length?process.argv.slice(2):all;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try {
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(name.split('/').some(p=>p.startsWith('.')||['node_modules','work'].includes(p))){res.writeHead(403).end();return}
  const file=path.resolve(root,'.'+name+(name.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  const body=await fs.promises.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(body);
 } catch(_){res.writeHead(404).end('Not found')}
});
(async()=>{
 for(const name of tests)if(!all.includes(name))throw Error('Unknown test: '+name);
 let base=process.env.BASE_URL;
 if(!base){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port}
 let passed=0;
 try {
  for(const name of tests){
   const start=Date.now();console.log('\nRUN '+name);
   const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[name],{cwd:root,stdio:'inherit',env:{...process.env,BASE_URL:base}});child.on('error',reject);child.on('exit',resolve)});
   if(code!==0)throw Error(name+' failed ('+code+')');
   passed++;console.log('DONE '+name+' '+((Date.now()-start)/1000).toFixed(1)+'s');
  }
  console.log(`PASS ${passed}/${tests.length} suites`);
 } finally {server.closeAllConnections();if(server.listening)await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.message);process.exitCode=1});


const fileSystem = require('fs');
const express = require('express');
var ins = require('point-in-polygon');
const whiskers = require('whiskers') ;
const port = process.env.PORT||3500;
var f = [];
var data = fileSystem.readFileSync('sample-data.json', 'utf-8');
var Gis = JSON.parse(data.toString());
Gis.features.forEach(function (feature) {
  f.push(feature);

});
const app=express();
// require('./prod.js')(app); 
app.use(express.json());
console.log('--------------------------- NEW APP ');
app.use(function(req,res,next){
  console.log('middlewere!');
  next(); 
});
app.get('/', (req, res) => {
  res.send(whiskers.render(`
  <html>
  <body>
  <h1> hw1 node.js !</h1>
  </body>
  </html>
  `));
  
});
//get 
app.get('/gis/testpoint',(req,res)=>{
  console.log(req.query);
  var outcome = { polygons: [] };
  try {
    var x=parseFloat(req.query.lat);
    var y=parseFloat(req.query.long);
    var noghat = [x,y ];
    f.forEach(function (feature) {
      feature.geometry.coordinates.forEach(function (coordinates) {
        if (ins(noghat, coordinates))
          outcome.polygons.push(feature.properties.name);
      })
    })
    res.json(outcome);
  } catch (err) {
    res.sendStatus(404).send('Error 404 not found'); 
  }
   
})
    //put
    app.put('/gis/addpolygon',(req,res)=>{
      try {
        f.push(req.body);
        res.sendStatus(200).send('ok'); 
        fileSystem.writeFile('./sample-data.json', JSON.stringify(Gis));
      } catch (err) {
        res.sendStatus(403).send('Error 403'); 
  
      }
     } )
     app.listen(port,()=>{
        console.log(`listening port ${port}`)
    })


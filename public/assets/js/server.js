const express = require('express');
const path = require('path');
const fs = require('fs');

//Set up the Express app
const app = express();

//app.use(express.static(path.join(__dirname,"../../public")));
//app.use(express.static("../../public", express.static('public')));
//app.use(express.static('../../public'));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../../../public')))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set the port
const PORT = 7000;

//Landing page route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "../../index.html"));
})

//Note page route
app.get('/notes', function (req, res) {
  
  res.sendFile(path.join(__dirname, "../../notes.html"));
})

//GET api/notes routes

var currentData = [];

app.get('/api/notes', function (req, res) {

  fs.readFile('../../../db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return
    }
    currentData = JSON.parse(data)
    let num = 1;
    currentData.forEach(element => {
      element.id = num;
      num++
    });

    fs.writeFile('../../../db/db.json', JSON.stringify(currentData), (err, data) => {
      if (err) {
        console.log(err);
        return
      }
      console.log(data);
      //res.send(data);
      
    });

    console.log(currentData); 
    res.send(currentData);
    
  })
});


app.delete('/api/notes/:id', function (req, res) {
  var chosen = req.params.id;
  console.log(req.params.id);
  fs.readFile('../../../db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return
    }
    currentData = JSON.parse(data);
    for (var i = 0; i < currentData.length; i++) {
      if (chosen == currentData[i].id) {
        currentData.splice(i,1)
       fs.writeFile('../../../db/db.json', JSON.stringify(currentData), (err, data) => {
       if (err){
         console.log(err);
       }
       console.log(currentData);
       return
      })
    }
    
  }
});
res.end();

  

  


  //res.send(currentData);
 
});


app.post('/api/notes', function (req, res) {
  currentData.push(req.body)
  fs.writeFile('../../../db/db.json', JSON.stringify(currentData), (err, data) => {
    if (err) {
      console.log(err);
      return
    }
    console.log(data);
    res.send(data);
    
  })
});



//Everything else route
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, "../../index.html"));
})



//Server Listener
app.listen(PORT, function () {
  console.log('We are listening on this port: ' + PORT);
})



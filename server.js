const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const uri = "mongodb+srv://m220student:m220password@blueapron-cdwwe.mongodb.net/meals?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const PORT = process.env.PORT || 5000
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/meals', (req, res) => {
  client.connect(err => {
    if (err) { console.log(err) }
    const collection = client.db("meals").collection("recipes");
    // perform actions on the collection object
    collection.find({}, {
      projection: {
        "name": 1,
        "sides": 1,
        "photo": 1,
        "main_ingredient": 1,
        "time": 1,
        "calories": 1,
        "fat": 1
      },
      sort: {
        "_id": -1
      }
    }).toArray((err, docs) => res.jsonp(docs))
    client.close();
  });
})
app.get('/api/menu/', (req, res) => {
  client.connect(err => {
    if (err) { console.log(err) }
    const collection = client.db("meals").collection("menus");
    collection.find({}, function(err, cursor) {
      cursor.sort({ _id: -1 }).limit(1).toArray(
        (err, items) => {
          let ids = items[0].meals.map(meal => ObjectId(meal))
          client.db("meals").collection("recipes").find({
            _id: { $in: ids }
          }).toArray((err, docs) => res.jsonp(docs))     
        }
      )
    })
    client.close();
  })
})
app.get('/api/details/:id', (req, res) => {
  client.connect(err => {
    if (err) { console.log(err) }
    const collection = client.db("meals").collection("recipes");
    // perform actions on the collection object
    collection.findOne(
      ObjectId(req.params.id), {
        projection: {
          "name": 1,
          "sides": 1,
          "photo": 1,
          "time": 1,
          "ingredients": 1,
          "instructions": 1
        }
      }, function(err, doc) { 
        res.jsonp(doc) 
      }
    )
    client.close();
  });
})
app.post('/api/menu', (req, res) => {
  client.connect(err => {
    if (err) { console.log(err) }
    const collection = client.db("meals").collection("menus");
    collection.insertOne({ 
      "meals": req.body.meals, 
      "date_added": new Date()
    }, function(err, doc) { res.jsonp(doc) })
    client.close();
  })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));


const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fm5yk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect()
        const database= client.db('soleBox');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders')
        const reviewCollection = database.collection('reviews')
        const usersCollection = database.collection('user')

        //  add users api

        app.post('/users',async(req,res)=>{
            const user= req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        // update user 
        app.put('/users', async(req,res)=>{
            const user= req.body;
            const filter = {email: user.email};
            const updateDoc = {$set : {role:'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
            res.json(result)
        })


        // add products 
     app.post('/products', async(req,res)=>{
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.json(result);
    })
        // get Products api 
        app.get('/products',async(req,res)=>{
            const cursor= productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

            // add orders api 
    
    app.post('/orders', async(req,res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
    }) 
        // get orders api 

        app.get('/orders', async(req,res)=>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })


           // add review api 
    
    app.post('/reviews', async(req,res)=>{
        const order = req.body;
        const result = await reviewCollection.insertOne(order);
        res.json(result);
    }) 
     // get orders api 

     app.get('/reviews', async(req,res)=>{
        const cursor = reviewCollection.find({});
        const reviews = await cursor.toArray();
        res.send(reviews);
    })

    // get admin 
    app.get('/users/:email',async (req,res)=>{
        const email = req.params.email;
        const query = {email:email};
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if(user?.role === 'admin'){
            isAdmin= true;
        }
        res.json({admin : isAdmin});
    })
     
    // delete products

    app.delete('/products/:key',async(req,res)=>{
        const key =req.params.key;
        const query = {_id:ObjectId(key)};
        const result = await productCollection.deleteOne(query);
        res.json(result)

    })
    // delete orders

    app.delete('/orders/:key',async(req,res)=>{
        const key =req.params.key;
        const query = {_id:ObjectId(key)};
        const results = await orderCollection.deleteOne(query);
        res.json(results)

    })


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Hello I am from Server')
});

app.listen(port,()=>{
    console.log('Running server from',port)
});
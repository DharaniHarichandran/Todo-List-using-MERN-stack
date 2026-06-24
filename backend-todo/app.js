const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors())

app.use(express.json());
mongoose.connect('mongodb://localhost:27017/Todo-app')

//*Promise function
.then(()=>{
    console.log('Db connected');
})

.catch((err)=>{
    console.log('err');
})

// creating schema
const todoSchema = new mongoose.Schema({
    title: {
         type: String,
         required: true,
    },
    description: String
})
//creating model
const todoModel = mongoose.model('todo',todoSchema)

//creating the todo
app.post('/todos',async (req, res) => {
    const { title, description } = req.body;
    
    // await function
        try{
           const newTodo = todoModel ({title,description});
           await newTodo.save(); 
           res.status(201).json(newTodo);
        }
        catch(err){
            console.log(err);
            res.status(500).json(err);
        }
});

// Getting the todo list
app.get('/todos',async (req, res) => {
    try{
        const todos = await todoModel.find()
        res.json(todos);
        res.status(201).json(todos);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Updating the todo by route updating
app.put("/todos/:id", async (req, res) => {
    
    try{
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description},
            {new: true}
        )

        if(!updatedTodo){
            return res.status(404).json({message: "todo  is not found"})
        }
        res.json(updatedTodo);
    }

    catch(err){
        console.log(err)
        res.status(500).json(err);
    }
});

// deleting the todo
app.delete("/todos/:id", async (req, res) => {

    try{
         const id = req.params.id;
         await todoModel.findByIdAndDelete(id);
         res.status(200).json({message : "deleted successfully"});
         
    }
    catch(err){
        console.log(err)
        res.status(500).json(err);
    } 
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
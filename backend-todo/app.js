const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect the MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Db connected');
})
.catch((err) => {
    console.log('DB connection error:', err);
});

// Schema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String
});

const todoModel = mongoose.model('todo', todoSchema);

// CREATE todo
app.post('/todos', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.status(200).json(todos); // fixed status
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "todo not found" });
        }

        res.json(updatedTodo);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
    try {
        await todoModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Server port (from env)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server URL: ${process.env.SERVER_URL}`);
});
const Todo = require('../models/todo.js');

async function handleCreateNewTodo(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        const { title, description } = req.body;
        await Todo.create({
            title,
            description,
            author: req.user.id
        });
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: "Error while creating new todo", error: error.message });
    }
}

async function handleDeleteTodo(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        const { id } = req.query;
        await Todo.findOneAndDelete({ _id: id, author: req.user.id });
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

async function handleEditTodo(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        const { title, description, status } = req.body;
        const { id } = req.query;
        await Todo.findOneAndUpdate(
            { _id: id, author: req.user.id },
            { title, description, status }
        );
        return res.redirect('/');
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
}

module.exports = {
    handleCreateNewTodo,
    handleDeleteTodo,
    handleEditTodo
}
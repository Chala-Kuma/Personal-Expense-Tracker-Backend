const Expense = require('../models/ExpenseModel');

exports.addExpense = async (req, res) => {
    const { title, amount, category, date, description, user } = req.body;

    // Server-side validations
    if (!title || !category || !date || !amount) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (amount <= 0 || typeof amount !== 'number') {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const expense = new Expense({
        title,
        amount,
        category,
        date,
        description,
        user
    });

    try {
        await expense.save();
        res.status(201).json({ message: "Expense added successfully", expense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateExpense = async (req, res) => {
    const { title, amount, category, date, description } = req.body;

    // Server-side validations
    if (!title || !category || !date || !amount) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (amount <= 0 || typeof amount !== 'number') {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }

    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Update the expense details
        expense.title = title;
        expense.amount = amount;
        expense.category = category;
        expense.date = date;
        expense.description = description;

        await expense.save();
        res.status(200).json({ message: "Expense updated successfully", expense });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await expense.remove();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


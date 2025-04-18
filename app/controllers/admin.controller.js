const db = require("../models");

// Fetch admin statistics
exports.getStats = async (req, res) => {
    try {
        const totalStudents = await db.user.count();
        const activeEvents = await db.event.count({ where: { eventtype: 'active' } });
        const pendingTasks = await db.task.count({ where: { completed: false } });

        res.status(200).json({
            totalStudents,
            activeEvents,
            pendingTasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 
const db = require("./models"); // Adjust the path as necessary

const populateDatabase = async () => {
    try {
        // Sync the models with the database
        await db.sequelize.sync({ force: true }); // This will drop existing tables and create new ones

        // Create dummy data for Award
        const awards = await Promise.all([
            db.award.create({ name: "Best Student", description: "Awarded for academic excellence", points: 100, redemptiontype: "Gift Card", redemptioninfo: "Amazon Gift Card" }),
            db.award.create({ name: "Participation", description: "Awarded for participating in events", points: 50, redemptiontype: "Certificate", redemptioninfo: "Participation Certificate" }),
        ]);

        // Create dummy data for Badge
        const badges = await Promise.all([
            db.badge.create({ name: "Gold Badge", description: "Awarded for outstanding performance", type: "Achievement", points: 200 }),
            db.badge.create({ name: "Silver Badge", description: "Awarded for good performance", type: "Achievement", points: 100 }),
        ]);

        // Create dummy data for Document
        const documents = await Promise.all([
            db.document.create({ studentid: 1, documenttype: "Report", filepath: "/documents/report1.pdf" }),
            db.document.create({ studentid: 1, documenttype: "Assignment", filepath: "/documents/assignment1.pdf" }),
        ]);

        // Create dummy data for Event
        const events = await Promise.all([
            db.event.create({ experienceid: 1, name: "Science Fair", description: "Annual science fair", eventtype: "Exhibition", date: new Date(), starttime: "10:00:00", endtime: "16:00:00", location: 1, attendancetype: "Open" }),
            db.event.create({ experienceid: 1, name: "Art Exhibition", description: "Annual art exhibition", eventtype: "Exhibition", date: new Date(), starttime: "10:00:00", endtime: "16:00:00", location: 1, attendancetype: "Open" }),
        ]);

        // Create dummy data for Experience
        const experiences = await Promise.all([
            db.experience.create({ category: "Academic", type: "Course", name: "Physics 101", description: "Introduction to Physics", pointsearned: 10, reflectionrequired: 1, schedulingtype: "Weekly" }),
            db.experience.create({ category: "Extracurricular", type: "Club", name: "Science Club", description: "Join us for science experiments", pointsearned: 20, reflectionrequired: 0, schedulingtype: "Monthly" }),
        ]);

        // Create dummy data for Flightplan
        const flightplans = await Promise.all([
            db.flightplan.create({ studentID: 1, Semester: "Fall 2023", SemestersFromGraduation: 2, Status: "Active" }),
            db.flightplan.create({ studentID: 1, Semester: "Spring 2024", SemestersFromGraduation: 1, Status: "Active" }),
        ]);

        // Create dummy data for Task
        const tasks = await Promise.all([
            db.task.create({ category: "Homework", type: "Assignment", name: "Math Homework", descripion: "Complete exercises 1-10", pointesearned: 5, reflectionrequired: 0, shedulingtype: "Weekly", completiontype: "Submit" }),
            db.task.create({ category: "Project", type: "Group Work", name: "Science Project", descripion: "Group project on renewable energy", pointesearned: 10, reflectionrequired: 1, shedulingtype: "Monthly", completiontype: "Presentation" }),
        ]);

        console.log("Database populated with dummy data!");
    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        await db.sequelize.close(); // Close the connection
    }
};

populateDatabase(); 
const { faker } = require('@faker-js/faker');
const db = require("./app/models");
const bcrypt = require('bcrypt');

async function populateDatabase() {
  try {
    // Synchronize all models with the database
    await db.sequelize.sync({ force: true });

    // Add specific user with admin role
    await db.user.create({
      firstName: 'A',
      lastName: 'Manzi',
      major: 'Administration',
      idNumber: '1500001',
      role: 'admin',
      semester: 1,
      email: 'a.manzi@eagles.oc.edu',
      points: 0,
      password: await bcrypt.hash('adminpassword', 10),
    });

    // Populate Users
    for (let i = 0; i < 30; i++) {
      const user = await db.user.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        major: faker.commerce.department(),
        idNumber: `15${faker.number.int({ min: 10000, max: 99999 })}`,
        role: faker.helpers.arrayElement(["student", "admin", "student staff"]),
        semester: faker.number.int({ min: 1, max: 8 }),
        email: `${faker.internet.userName().toLowerCase()}@eagles.oc.edu`,
        points: 0,
        password: await bcrypt.hash('defaultpassword', 10),
      });

      // Populate related data for each user
      for (let j = 0; j < 5; j++) {
        await db.taskCompletion.create({
          userId: user.id,
          taskId: faker.number.int({ min: 1, max: 30 }),
          completed: faker.datatype.boolean(),
        });

        await db.eventAttendance.create({
          userId: user.id,
          eventId: faker.number.int({ min: 1, max: 30 }),
          attended: faker.datatype.boolean(),
        });

        await db.strength.create({
          userId: user.id,
          name: faker.lorem.word(),
          description: faker.lorem.sentence(),
          score: faker.number.int({ min: 1, max: 10 }),
        });
      }
    }

    // Populate Tasks
    for (let i = 0; i < 30; i++) {
      await db.task.create({
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        category: faker.commerce.department(),
        type: faker.helpers.arrayElement(["assignment", "project", "quiz"]),
        earnablepoints: faker.helpers.arrayElement([10, 20, 30, 40, 50]),
        schedulingtype: faker.helpers.arrayElement(["weekly", "monthly", "one-time"]),
        semester: faker.number.int({ min: 1, max: 8 }),
        completed: faker.datatype.boolean()
      });
    }

    // Populate Events
    for (let i = 0; i < 30; i++) {
      await db.event.create({
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        eventtype: faker.helpers.arrayElement(["active", "inactive"]),
        date: faker.date.future(),
        starttime: faker.date.recent(),
        endtime: faker.date.recent(),
        location: faker.location.city(),
        attendancetype: faker.helpers.arrayElement(["online", "offline"]),
        earnablepoints: faker.helpers.arrayElement([10, 20, 30, 40, 50]),
      });
    }

    // Populate Experiences
    for (let i = 0; i < 30; i++) {
      await db.experience.create({
        name: faker.lorem.words(3),
        category: faker.commerce.department(),
        description: faker.lorem.sentence(),
        pointsearned: faker.number.int({ min: 1, max: 100 }),
        reflectionrequired: faker.datatype.boolean(),
        schedulingtype: faker.helpers.arrayElement(["weekly", "monthly", "one-time"]),
        type: faker.helpers.arrayElement(["internship", "volunteer", "research"]),
      });
    }

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await db.sequelize.close();
  }
}

populateDatabase(); 
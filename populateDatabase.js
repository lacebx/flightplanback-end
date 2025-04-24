const { faker } = require('@faker-js/faker');
const db = require("./app/models");
const bcrypt = require('bcrypt');

async function populateDatabase() {
  try {
    // Reset and sync DB
    await db.sequelize.sync({ force: true });

    // Create tasks (needed before taskCompletion)
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

    // Create events (needed before eventAttendance)
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

    // Create experiences
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

    // Create notifications
    for (let i = 0; i < 10; i++) {
      await db.notification.create({
        userId: faker.number.int({ min: 1, max: 30 }), // Adjust if needed
        message: faker.lorem.sentence(),
        isRead: faker.datatype.boolean(),
      });
    }

    // Helper to create a user and related records
    const createUserWithRelatedData = async (userData) => {
      const user = await db.user.create(userData);

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
    };

    // Create fixed users
    await createUserWithRelatedData({
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

    await createUserWithRelatedData({
      firstName: 'Mike',
      lastName: 'Mugisha',
      major: 'Gynecology',
      idNumber: '1564348',
      role: 'student',
      semester: 8,
      email: 'm.mugisha@eagles.oc.edu',
      points: 0,
      password: null,
    });

    await createUserWithRelatedData({
      firstName: 'Ehitnesh',
      lastName: 'Tadese',
      major: 'Computer Science',
      idNumber: '1599009',
      role: 'admin',
      semester: 3,
      email: 'ehitnesh.kibret@eagles.oc.edu',
      points: 0,
      password: null,
    });

    // Create 30 random users
    for (let i = 0; i < 30; i++) {
      await createUserWithRelatedData({
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
    }

    console.log("✅ Database populated successfully!");
  } catch (error) {
    console.error("❌ Error populating database:", error);
  } finally {
    await db.sequelize.close();
  }
}

populateDatabase();

// app/models/index.js
import { db } from '../config/db.config.js';
import { User } from './user.model.js';
import { Award } from './award.model.js';
import { Badge } from './badge.model.js';
import { Document } from './document.model.js';
import { Experience } from './experience.model.js';
import { Flightplan } from './flightplan.model.js';
import { Event } from './event.model.js';
import { Task } from './task.model.js';

// Define associations
User.hasMany(Award);
User.hasMany(Badge);
User.hasMany(Document);
User.hasMany(Experience);
User.hasOne(Flightplan);
Flightplan.hasMany(Task);
Flightplan.hasMany(Event);
Award.belongsTo(User);
Badge.belongsTo(User);
Document.belongsTo(User);
Experience.belongsTo(User);
Task.belongsTo(Flightplan);
Event.belongsTo(Flightplan);

// Export models and database connection
export { User, Award, Badge, Document, Experience, Flightplan, Event, Task, db };
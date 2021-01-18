import { Meteor } from 'meteor/meteor';
// import "../imports/api/tasks.js";
import {Reminders} from "../imports/api/reminders.js";

Meteor.startup(() => {
  // Allow data retrieval
  Meteor.publish("reminders", function tasksPublication() {
  return Reminders.find({});
  });
  // code to run on server at startup
});

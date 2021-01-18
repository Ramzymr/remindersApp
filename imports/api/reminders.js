import { Mongo } from "meteor/mongo";

export const Reminders = new Mongo.Collection("reminders");

Meteor.methods({
  "reminders.insert"(title, startDate) {
    // Make sure the user is logged in before inserting a reminder
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Reminders.insert({
      title: title,
      start: startDate,
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  "reminders.update"(evtObj) {
    console.log(evtObj.title);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Reminders.update(
      { _id: evtObj.id },
      { $set: { title: evtObj.title, start: evtObj.start } }
    );
  },
  "reminders.remove"(id) {
    console.log(id);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Reminders.remove(id);
  },
});
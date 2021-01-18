import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Tracker } from "meteor/tracker";

import { Reminders } from "../api/reminders.js";
import "./body.html";
import "./reminders.html";

let data;
let state;

Template.body.onCreated(function bodyOnCreated() {
  state = new ReactiveDict();
  // hold event info when selected
  state.set("currentEvent", null);
  Meteor.subscribe("reminders", "", {
    onReady: function () {
      // get the data once the subcription completed
      data = Reminders.find({ owner: Meteor.userId() }).fetch();
      //console.log(data)
    },
    onError: function () {
      console.log("onError", arguments);
    },
  });
});

Template.body.helpers({
  remindersList() {
    return Reminders.find({ owner: Meteor.userId() });
  },
  recordCount() {
    return Reminders.find({}).count();
  },
});

// render calendar
// Note: this should be moved to remainders template's js, but couldn't make it work there
// Need to be fixed 
Template.body.onRendered(() => {
  const self = this;
  // without autorun, couln't await for data here, there're should be a better way!
  Tracker.autorun(() => {
    data = Reminders.find({ owner: Meteor.userId() }).fetch();
    const calendarEl = document.getElementById("cal");
    var calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      // set header toolbars
      headerToolbar: {
        start: "prev,next today",
        center: "title",
        end: "dayGridDay,dayGridWeek,dayGridMonth",
      },
      // set data to match calendar data
      events: data.map((el) => {
        return {
          id: el._id,
          title: el.title,
          start: el.start,
        };
      }),
      // Handle when an event is clicked
      eventClick(info) {
        state.set("currentEvent", {
          id: info.event.id,
          title: info.event.title,
          start: new Date(info.event.start).toISOString().substring(0, 16),
        });
        $("#remindersModal").modal("show");
      },
      // day is clicked
      dateClick(event) {

      },
    });
    calendar.render();
  });
});

// Handle event update/delete
Template.reminderDetail.events({
  "click #save": function (e) {
    e.preventDefault();
    const evt = {
      id: state.get("currentEvent").id,
      title: document.getElementById("title").value,
      start: document.getElementById("start").value,
    };

    console.log(`${evt.id} - ${evt.title} - ${evt.start}`);

    Meteor.call("reminders.update", evt, function (error, result) {
      if (error) {
        alert(error);
      }
    });
    state.set("currentEvent", null);
    $("#remindersModal").modal("hide");
  },
  "click #cancel": function (e) {
    e.preventDefault();

    state.set("currentEvent", null);
    $("#remindersModal").modal("hide");
  },
  "click #delete": function (e) {
    e.preventDefault();

    Meteor.call(
      "reminders.remove",
      state.get("currentEvent").id,
      function (error, result) {
        if (error) {
          alert(error);
        }
      }
    );
    state.set("currentEvent", null);
    $("#remindersModal").modal("hide");
  },
});

Template.reminderDetail.helpers({
    // populate title
  eventTitle: function () {
    return state.get("currentEvent") !== null
      ? state.get("currentEvent").title
      : "";
  },
  // populate date
  eventDate: function () {
    return state.get("currentEvent") !== null
      ? state.get("currentEvent").start
      : "";
  },
});

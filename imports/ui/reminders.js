import { Template } from "meteor/templating";
import { Tracker } from "meteor/tracker";
// import "../api/reminders.js";
import { Reminders } from "../api/reminders.js";
import "./reminders.html";
let data;

Template.reminders.onCreated(function bodyOnCreated() {
  // make the data reactive, otherwise not getting data in OnRendered
  Tracker.autorun(function () {
    Meteor.subscribe("reminders", "", {
      onReady: function () {
        
        data = Reminders.find({ owner: Meteor.userId() }).fetch();
        
      },
      onError: function () {
        console.log("onError", arguments);
      },
    });
  });
});
// Handle add new event
Template.reminders.events({
  // submit click event
  'submit': function(event, instance){
    
    event.preventDefault();
    const target = event.target;
    const title = target.eventTitle.value;
    const startDate = target.eventDate.value;
    // check title & date are not empty
    if(title!=='' && startDate!=='' ){
      Meteor.call("reminders.insert", title, startDate);
      // Clear content
      target.eventTitle.value = "";
      target.eventDate.value = "";
    } 
    
  }
})

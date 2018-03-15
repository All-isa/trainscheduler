//initialize database 
var config = {
    apiKey: "AIzaSyCcP8ONcaKNixFSaUXK0jQZHZg1B0ruf4s",
    authDomain: "train-scheduler-b8b0d.firebaseapp.com",
    databaseURL: "https://train-scheduler-b8b0d.firebaseio.com",
    projectId: "train-scheduler-b8b0d",
    storageBucket: "train-scheduler-b8b0d.appspot.com",
    messagingSenderId: "177336710805"
  };
  firebase.initializeApp(config);

//rename databae for easier coding
  var database = firebase.database();

  var timer = setInterval(timer, 1000);

  function timer() {
    var d = new Date();
    var n = d.toLocaleTimeString(); //found .toLocaleTimeString through w3schools
    //document.getElementById("current-time").innerHTML = n;
    $("#current-time").html(n);
}


var frequency = "0"
var firstTrain = "0"

$("#add-train").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    firstTrain = moment($("#first-train").val().trim(), "HH:mm").format("HH:mm");
    frequency = parseInt($("#frequency").val().trim());
    // console.log(firstTrain);
    // console.log(typeof firstTrain);
    var firstTrainConverted = moment(firstTrain, "hh:mm");
    // console.log(firstTrainConverted);
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    // console.log(diffTime);
    var tRemainder = diffTime % frequency;
    // console.log(tRemainder);
    var minutesTillTrain = frequency - tRemainder;
    // console.log(minutesTillTrain);

    var nextTrain = moment().add(minutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("HH:mm");


//creates object for added train in database
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      nextTrain: nextTrain,
      minutesTillTrain: minutesTillTrain
    };
//pushed all new data to firebase database
    database.ref().push(newTrain); 

//clear out entry boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train").val("");
  $("#frequency").val("");
});

//snapshot of information send to database
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;
  var nextTrain = childSnapshot.val().nextTrain;
  var minutesTillTrain = childSnapshot.val().minutesTillTrain;
//appends new row with information for train
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextTrain + "</td><td>" + minutesTillTrain + "</td></tr>");

});

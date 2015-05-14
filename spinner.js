var rotationDir = 1

var prevRotation = 0;
var rotation = 0;

var requestId = null;

var segments = {
  "blue" : [Math.PI/4, 3*Math.PI/4],
  "red" : [3*Math.PI/4, 5*Math.PI/4],
  "green" : [5*Math.PI/4, 7*Math.PI/4],
  "gold" : [7*Math.PI/4, Math.PI/4],
}

var speed = 600;

var goal = "red"

var score = 0;


function userClicked() {
  if (withinGoal(rotation)) {

    score++;
    document.getElementById('score').innerHTML = "Score: " + score

    var colors = Object.keys(segments)
    goalIndex = colors.indexOf(goal);
    colors.splice(goalIndex, 1);

    var rand = Math.random();
    rand *= colors.length;
    rand = Math.floor(rand)

    goal = colors[rand]

    rotationDir = -rotationDir;

    // speed *= 0.9

  } else {
    window.cancelAnimationFrame(requestId);
  }
}


function adjustToRegularRadians(rotation) {
  if (rotation >= Math.PI * 2) {
    rotation -= Math.PI * 2;
  } else if (rotation < 0) {
    rotation += Math.PI * 2;
  }
  return rotation
}

function withinGoal(rotation) {
  if (goal == "gold") {
    return rotation > segments[goal][0]  || rotation < segments[goal][1]
  }
  return rotation > segments[goal][0] && rotation < segments[goal][1]
}

function updateGameState(prevUpdateTime) {
  if (withinGoal(prevRotation) && !withinGoal(rotation)) {
    rotation = (Math.round(rotation * 8 / Math.PI) * Math.PI)/ 8;
    draw(new Date());

    return;
  }

  var time = draw(prevUpdateTime);

  requestId = window.requestAnimationFrame(function() {
    updateGameState(time);
  })
}

function draw(prevUpdateTime) {
  var time = new Date();
  var timeDiff = Math.abs(time - prevUpdateTime)

  var canvas = document.getElementById('spinnerCanvas');
  var context = canvas.getContext('2d');

  context.clearRect(0,0,500,500);

  var x = canvas.width / 2;
  var y = canvas.height / 2;

  var radius = (canvas.width/2) - 20;
  var startAngle = 0.25 * Math.PI;
  var endAngle = 0.75 * Math.PI;

  (['red', 'green', 'gold', 'blue']).forEach(function(color) {
    context.beginPath()
    context.arc(x, y, radius, startAngle, endAngle);
    context.lineWidth = 25;
    context.strokeStyle = color;
    context.stroke();

    startAngle = endAngle;
    endAngle += 0.5 * Math.PI;
  });

  context.save();

  // draw spinner
  // start it at 15px to the left of the center
  context.fillStyle = goal
  context.strokeStyle = goal

  context.translate(x, y);
  prevRotation = rotation;
  rotation += (Math.PI/speed) * timeDiff * rotationDir;
  rotation = adjustToRegularRadians(rotation);

  context.rotate(rotation);

  context.beginPath();
  context.moveTo(15, 0);
  context.lineTo(0, -radius + 30);
  context.lineTo(-15, 0);
  context.lineJoin = "round";
  //context.arcTo(x+15, y, x-15, y, 15, true)
  context.stroke();
  context.fill()

  context.beginPath()
  context.arc(0, 0, 15,0, 2 * Math.PI);
  context.stroke();
  context.fill();

  context.restore();

  return time;
}

document.getElementById("spinnerCanvas").addEventListener('click', function() {
  userClicked();
});

requestId = window.requestAnimationFrame(function() {
  updateGameState(new Date());
})
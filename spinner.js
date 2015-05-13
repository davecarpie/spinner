var rotationDir = 1
var rotation = 0;

function draw(prevUpdateTime) {

  // Basic draw of colored circle
  var canvas = document.getElementById('spinnerCanvas');
  var context = canvas.getContext('2d');

  context.clearRect(0,0,500,500);

  var x = canvas.width / 2;
  var y = canvas.height / 2;

  var radius = (canvas.width/2) - 20;
  var startAngle = 0.25 * Math.PI;
  var endAngle = 0.75 * Math.PI;

  (['red', 'green', 'yellow', 'blue']).forEach(function(color) {
    context.beginPath()
    context.arc(x, y, radius, startAngle, endAngle);
    context.lineWidth = 25;
    context.strokeStyle = color;
    context.stroke();

    startAngle = endAngle;
    endAngle += 0.5 * Math.PI;
  });

  context.save();

  var time = new Date();

  var timeDiff = Math.abs(time - prevUpdateTime)

  // draw spinner
  // start it at 15px to the left of the center
  context.fillStyle = "blue"
  context.strokeStyle = "blue"

  context.translate(x, y);
  rotation += (Math.PI/1000) * timeDiff * rotationDir;
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

  window.requestAnimationFrame(function() {
    draw(time);
  })
}

document.getElementById("spinnerCanvas").addEventListener('click', function() {
  rotationDir = -rotationDir;
});

window.requestAnimationFrame(function() {
  draw(new Date());
})
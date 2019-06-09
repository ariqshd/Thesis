// Define global variable
const flock = [];
const fr = 15;
const cvx = 480;
const cvy = 480;

let alignSlider, cohesionSlider, separationSlider;

function setup() {
  let cnv = createCanvas(cvx, cvy);

  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  separationSlider = createSlider(0, 5, 1, 0.1);
  alignSlider.parent("main-div");
  cohesionSlider.parent("main-div");
  separationSlider.parent("main-div");

  cnv.id("canvas");
  frameRate(fr);

  // input1 = createInput()
}

function buttonClick() {
  var id = event.target.id;
  switch (id) {
    case "Load":
      loadParams();
      break;
    case "Read":
      break;
    case "Start":
      for (var i = 0; i < 50; i++) {
        flock.push(new Boid());
      }
      break;
    case "Stop":
      noLoop();
      break;
    case "Rerun":
      loop();
  }
}

function draw() {
  background(51);

  for (let boid of flock) {
    boid.flocks(flock);
    boid.update();
    boid.show();
  }

  // Showing data to textarea
  for (var i = 0; i < flock.length; i++) {
    var xx = flock[0].position.x;
    var yy = flock[i].position.y;
    var x = parseFloat(Math.round(xx * 100) / 100).toFixed(3);
    var y = parseFloat(Math.round(yy * 100) / 100).toFixed(3);
    var text = x + " " + y + "\n";
    document.getElementById("taOut").value = text;
  }
}

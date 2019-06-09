class Boid {
  constructor() {
    this.position = createVector(random(0, 8), random(0, 8));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(0.01, 0.05));
    this.acceleration = createVector();
    this.r = 3;
    this.pos = createVector(0, 0);
    this.maxForce = parseFloat(document.getElementById("mf").value);
    this.maxSpeed = parseFloat(document.getElementById("ms").value);
    this.perceptionRadius = parseFloat(document.getElementById("pr").value);
    this.perceptionAngle = PI / 2;
    this.normalPoint = createVector();
  }

  // Steer to avoid crowding neighbors
  separation(boids) {
    let steering = createVector();
    let total = 0;
    let angleTwo;
    let diff;

    for (let other of boids) {
      // Knowing distance between two vectors
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      // Knowing angle between two vectors
      // var dp = this.position.dot(other.position);
      // peripheral = acos(dp / (this.position.mag() * other.position.mag()));

      // A fast way to know angle between two vectors
      angleTwo = this.position.angleBetween(other.position);

      // Set a peripheral
      if (
        other != this &&
        d < this.perceptionRadius &&
        angleTwo < this.perceptionAngle
      ) {
        // Propotionalize how strong force to react based on distance
        diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d); // Weight by distance
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  // Steer to move towards the average position of neighbors
  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    let angleTwo;

    for (let other of boids) {
      // Knowing distance between two vectors
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      // Knowing angle between two vectors
      // var dp = this.position.dot(other.position);
      // peripheral = acos(dp / (this.position.mag() * other.position.mag()));

      // A fast way to know angle between two vectors
      angleTwo = this.position.angleBetween(other.position);

      // Set a peripheral
      if (
        other != this &&
        d < this.perceptionRadius &&
        angleTwo < this.perceptionAngle
      ) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  // Steer towards the average heading of local neighbors
  align(boids) {
    let steering = createVector();
    let total = 0;
    let angleTwo;

    for (let other of boids) {
      // Knowing distance between two vectors
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      // Knowing angle between two vectors
      // var dp = this.position.dot(other.position);
      // peripheral = acos(dp / (this.position.mag() * other.position.mag()));

      // A fast way to know angle between two vectors
      angleTwo = this.position.angleBetween(other.position);

      // Set a peripheral
      if (
        other != this &&
        d < this.perceptionRadius &&
        angleTwo < this.perceptionAngle
      ) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flocks(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    // Adjust weight of rules
    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(separation);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxSpeed);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  show() {
    // Heading of boid
    let theta = -1 * this.velocity.heading() + PI / 2;

    // Transfrom the coordinate
    var XMAX = cvx * 2;
    var YMAX = cvy * 2;
    this.pos.x = map(this.position.x, 0, 8, 0, XMAX);
    this.pos.y = map(this.position.y, 0, 8, YMAX, 0);

    // Create boids
    push();
    fill(255, 90, 110);
    strokeWeight(1);
    stroke(50);
    translate(this.pos.x / 2, this.pos.y / 2);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
}

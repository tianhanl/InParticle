const EASE_IN_OUT = 'EASE_IN_OUT';

// Modified from Tween Algorithm http://easings.net/
const easeInOut = function(time, baseValue, distance, duration) {
  time /= duration / 2;
  if (time < 1) return distance / 2 * Math.pow(2, 10 * (time - 1)) + baseValue;
  time--;
  return distance / 2 * (-Math.pow(2, -10 * t) + 2) + baseValue;
};

const timingFunctions = {
  EASE_IN_OUT: easeInOut
};

const defaultParticleConfig = {
  radius: 2,
  timingFunction: EASE_IN_OUT,
  fillStyle: 'hsla(0, 0%, 62%, .5)',
  shadowBlur: 4
};

/*
  key key of the element
  context, on which canvas context should this particle be drawn.

*/

class Particle {
  constructor(
    key,
    context,
    initialX,
    initialY,
    finalX,
    finalY,
    width,
    height,
    config
  ) {
    this.key = key;
    this.context = context;
    this.initialX = this.initialX;
    this.initialY = this.initialY;
    this.finalX = this.finalX;
    this.finalY = this.finalY;
    this.distanceX = this.finalX - this.initialX;
    this.distanceY = this.finalY - this.initialY;
    this.width = this.width;
    this.height = this.height;
    this.radius = config.radius;
    this.timingFunction = timingFunctions[config.timingFunction];
    this.fillStyle = config.fillStyle;
    this.shadowBlur = config.shadowBlur;
    this.finished = false;
    this.draw(this.initialX, this.initialY);
  }

  // draw the particle at current X and current Y
  draw(currentX, currentY) {
    this.context.fillStyle = this.fillStyle;
    this.context.shadowBlur = this.shadowBlur;
    this.context.beginPath();
    this.context.arc(currentX, currentY, this.radius, 0, 2 * Math.PI, false);
    this.context.closePath();
    this.context.fill();
  }

  move(time, duration) {
    // get current position of particle according to timing function
    let currX = this.timingFunction(
      time,
      this.initialX,
      this.distanceX,
      duration
    );
    let currY = this.timingFunction(
      time,
      this.initialY,
      this.distanceY,
      duration
    );

    // if the position is at target position, movement should be completed
    if (currX === this.finalX && this.currY === this.finalY) {
      this.completed = true;
    }

    this.draw(currX, currY);
  }
}

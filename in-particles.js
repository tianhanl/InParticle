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
    config = defaultParticleConfig
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
      this.finished = true;
    }

    this.draw(currX, currY);
  }
}

const TEXT = 'TEXT';
const IMG = 'IMG';

const defaultTextConfig = {
  fontSize: 16,
  fontFamily: 'Helvetica',
  fillStyle: 'black'
};

class ParticleManager {
  // mode TEXT or IMG
  // value textValue or IMG src
  constructor(mode, value, config) {
    // create canvas
    this.canvas = document.createElement('canvas');
    this.value = value;

    if (mode === TEXT) {
      this.width = this.calculateTextLength(this.value, config.fontSize);
      this.height = config.fontSize * 1.5;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context = this.canvas.getContext('2d');
      this.imageData = this.getTextImageData(
        this.value,
        config.fontSize,
        config.fontFamily,
        config.fillStyle
      );
    }

    this.particles = this.calculateParticles(this.imageData);
    this.animate = this.animate.bind(this);
    this.time = 0;
    this.duration = this.config.duration;
  }

  getTextImageData(text, fontSize, fontFamily, fillStyle) {
    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.fillStyle = fillStyle;
    this.context.fillText(text, fontSize * 0.05, fontSize);
    let imageData = this.context.getImageData(0, 0, this.width, this.height);
    this.context.clearRect(0, 0, this.width, this.height);
    return imageData;
  }

  calculateParticles(imageData) {
    let length = imageData.length;
    let cols = 100,
      rows = 100;
    let cellWidth = Math.parseInt(this.width / cols);
    let cellHeight = Math.parseInt(this.height / rows);
    let pos = 0;
    let particles = [];
    for (let i = 1; i <= cols; i++) {
      for (let j = 1; j <= rows; j++) {
        pos = [(j * cellHeight - 1) * this.width + (i * cellWidth - 1)] * 4;
        if (imageData.data[pos] > 250) {
          let particle = new Particle(
            pos,
            this.context,
            0,
            0,
            i * cellWidth + (Math.random() - 0.5) * this.fontSize / 20,
            j * cellHeight + (Math.random() - 0.5) * this.fontSize / 20,
            this.width,
            this.height
          );
          particles.push(particle);
        }
      }
    }
    return particles;
  }

  calculateTextLength(text, fontSize) {
    return text.length * fontSize * 0.5;
  }

  animate() {
    this.context.clearRect(0, 0, this.width, this.height);
    let moved = false;
    this.particles.forEach(particle => {
      if (!particle.finished) {
        particle.move(this.time, this.duration);
        moved = true;
      }
    });
    this.time++;
    if (moved) {
      requestAnimationFrame(this.anime);
    }
  }
}

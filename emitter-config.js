export let rain = {
  alpha: {
    start: 0,
    end: 0.5
  },
  scale: {
    start: 1,
    end: 1
  },
  color: {
    start: "ffffff",
    end: "ffffff"
  },
  speed: {
    start: 1000,
    end: 3000
  },
  startRotation: {
    min: 65,
    max: 65
  },
  rotationSpeed: {
    min: 0,
    max: 0
  },
  lifetime: {
    min: 0.81,
    max: 0.81
  },
  blendMode: "normal",
  frequency: 0.004,
  emitterLifetime: 0,
  maxParticles: 1000,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "rect",
  spawnRect: {
    x: -300,
    y: -100,
    w: 800,
    h: 10
  }
};

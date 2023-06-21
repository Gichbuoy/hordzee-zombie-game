import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Shooting {
  constructor({ app, player }) {
    this.app = app;
    this.player = player;
    this.bulletSpeed = 4;
    this.bullets = [];
    this.bulletRadius = 8;
    this.maxBulets = 3;
    this.audio = new Audio("./assets/shoot.mp3");
  }

  fire() {
    this.audio.currentTime = 0; //play audio as soon as player fires
    this.audio.play();
    if (this.bullets.length >= this.maxBulets) {
      let b = this.bullets.shift(); // shift takes oldest bullet we have
      this.app.stage.removeChild(b); // removes that same bullet from our stage
    }

    this.bullets.forEach((b) => this.app.stage.removeChild(b));
    this.bullets = this.bullets.filter(
      (b) =>
        Math.abs(b.position.x) < this.app.screen.width &&
        Math.abs(b.position.y) < this.app.screen.height
    ); // filter reduces size of array (bullets that are on screen will survive this filter)
    // bullets that are off screen will get filtered out
    this.bullets.forEach((b) => this.app.stage.addChild(b));

    const bullet = new PIXI.Sprite(
      PIXI.Loader.shared.resources["bullet"].texture
    );
    bullet.anchor.set(0.5);
    bullet.scale.set(0.2);
    bullet.position.set(this.player.position.x, this.player.position.y);
    bullet.rotation = this.player.rotation; // rotate bullet

    let angle = this.player.rotation - Math.PI / 2; // derive direction vector using angle
    bullet.velocity = new Victor(
      Math.cos(angle),
      Math.sin(angle)
    ).multiplyScalar(this.bulletSpeed);
    this.bullets.push(bullet); //push bullet to array of bullets to track each bullet
    this.app.stage.addChild(bullet); // add bullet to our stage so we can see it(firing)
    console.log(this.bullets.length, this.app.stage.children.length);
  }

  set shoot(shooting) {
    if (shooting) {
      this.fire(); // fire the gun
      this.interval = setInterval(() => this.fire(), 500); // set interval with arrow function that triggers fire every 500ms
    } else {
      clearInterval(this.interval);
    }
  }
  update(delta) {
    this.bullets.forEach((b) =>
      b.position.set(
        b.position.x + b.velocity.x * delta,
        b.position.y + b.velocity.y * delta
      )
    );
  }
}

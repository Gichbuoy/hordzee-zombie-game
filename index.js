import * as PIXI from "pixi.js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawner from "./spawner.js";
import { textStyle, subTextStyle, zombies } from "./globals.js";
import Weather from "./weather.js";
import GameState from "./game-state.js";
//import Matter from "matter-js";

const canvasSize = 400; // canvas size of the game
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x312a2b,
  resolution: 2
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//Music
const music = new Audio("./assets/HordeZee.mp3");
music.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  }
});
//Zombie sounds
const zombieHorde = new Audio("./assets/horde.mp3");
zombieHorde.voulume = 0.7;
zombieHorde.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  }
});

initGame();

async function initGame() {
  app.gameState = GameState.PREINTRO;
  try {
    console.log("loading...");
    await loadAssets();
    console.log("loaded");
    app.weather = new Weather({ app });
    let player = new Player({ app });
    let zSpawner = new Spawner({
      app,
      create: () => new Zombie({ app, player })
    });

    let gamePreIntroScene = createScene("HordeZee!", "Click to Continue");
    let gameStartScene = createScene("HordeZee!", "Click to Start");
    let gameOverScene = createScene("HordeZee", "Game Over!");

    app.ticker.add((delta) => {
      if (player.dead) app.gameState = GameState.GAMEOVER;
      gamePreIntroScene.visible = app.gameState === GameState.PREINTRO;
      gameStartScene.visible = app.gameState === GameState.START; // removes 'click to start' text after game is started
      gameOverScene.visible = app.gameState === GameState.GAMEOVER; // gameOverScene text becomes visible

      switch (app.gameState) {
        case GameState.PREINTRO:
          player.scale = 4;
          break;
        case GameState.INTRO:
          player.scale -= 0.01; // zoom in on player
          if (player.scale <= 1) app.gameState = GameState.START; //rom intro to start
          break;
        case GameState.RUNNING:
          player.update(delta);
          zSpawner.spawns.forEach((zombie) => zombie.update(delta)); //delta fixes variable frame rates issue -> consistent speed in all devices
          bulletHitTest({
            bullets: player.shooting.bullets,
            zombies: zSpawner.spawns,
            bulletRadius: 8,
            zombieRadius: 16
          }); // calling bulletHitTest fxn. bullets now kill zombies
          break;
        default:
          break;
      }
    });
  } catch (error) {
    console.log(error.message);
    console.log("Load failed");
  }
}

function bulletHitTest({ bullets, zombies, bulletRadius, zombieRadius }) {
  bullets.forEach((bullet) => {
    zombies.forEach((zombie, index) => {
      let dx = zombie.position.x - bullet.position.x;
      let dy = zombie.position.y - bullet.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bulletRadius + zombieRadius) {
        zombies.splice(index, 1); //splice removes index of item
        zombie.kill();
      }
    });
  });
}

function createScene(sceneText, sceneSubText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle));
  text.x = app.screen.width / 2; // place text in middle of screen
  text.y = 0; // place it on top of screen -> so it doesn't hide player
  text.anchor.set(0.5, 0);

  const subText = new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle));
  subText.x = app.screen.width / 2; // place text in middle of screen
  subText.y = 50; // place it on top of screen -> so it doesn't hide player
  subText.anchor.set(0.5, 0);

  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text); // add text to Container
  sceneContainer.addChild(subText);
  app.stage.addChild(sceneContainer); //add container to the stage
  return sceneContainer;
}

//function startGame() {
//app.gameStarted = true;
//app.weather.enableSound(); // call enableSound method from weather.js
//}

async function loadAssets() {
  return new Promise((resolve, reject) => {
    zombies.forEach((z) => PIXI.Loader.shared.add(`assets/${z}.json`));
    PIXI.Loader.shared.add("assets/hero_male.json"); // call back patterns
    PIXI.Loader.shared.add("bullet", "assets/bullet.png");
    PIXI.Loader.shared.add("rain", "assets/rain.png");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

function clickHandler() {
  switch (app.gameState) {
    case GameState.PREINTRO:
      app.gameState = GameState.INTRO;
      music.play();
      app.weather.enableSound();
      break;
    case GameState.START:
      app.gameState = GameState.RUNNING;
      zombieHorde.play();
      break;
    default:
      break;
  }
}

document.addEventListener("click", clickHandler); // listens for a Click to start the game

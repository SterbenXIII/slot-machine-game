import * as PIXI from "pixi.js";
import Slot from "./Slot";

export default class SlotContainer {
  public readonly reels: Array<Slot> = [];
  public readonly container: PIXI.Container;

  constructor(app: PIXI.Application) {
    const REEL_OFFSET_LEFT = 50;
    const NUMBER_OF_REELS = 5;
    this.container = new PIXI.Container();

    for (let i = 0; i < NUMBER_OF_REELS; i++) {
      const reel = new Slot(app, i);
      this.reels.push(reel);
      this.container.addChild(reel.container);
    }

    this.container.x = REEL_OFFSET_LEFT;
  }

  public async spin() {
    const shiftingDelay = 1000;
    const start = Date.now();
    const reelsToSpin = [...this.reels];

    for await (let value of this.infiniteSpinning(reelsToSpin)) {
      const shiftingWaitTime =
        (this.reels.length - reelsToSpin.length + 1) * shiftingDelay;

      if (Date.now() >= start + shiftingWaitTime) {
        reelsToSpin.shift();
      }

      if (!reelsToSpin.length) break;
    }

    return this.checkForWin(this.reels.map((reel) => reel.sprites[2]));
  }

  private async *infiniteSpinning(reelsToSpin: Array<Slot>) {
    while (true) {
      const spinningPromises = reelsToSpin.map((reel) => reel.spinOneTime());
      await Promise.all(spinningPromises);
      this.RNG();
      yield;
    }
  }

  private checkForWin(symbols: Array<PIXI.Sprite>): boolean {
    const combination: Set<string> = new Set();
    symbols.forEach((symbol) =>
      combination.add(symbol.texture.textureCacheIds[0].split(".")[0])
    );
    console.log(combination);
    
    if (combination.size === 1 && !combination.has("paluna 1.png")) return true;
    return combination.size === 2 && combination.has("paluna 2.png");
  }

  private RNG() {
    this.reels.forEach((reel) => {
      reel.sprites[0].texture =
        reel.textures[Math.floor(Math.random() * reel.textures.length)];
    });
  }
}

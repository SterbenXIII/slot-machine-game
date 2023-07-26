import * as PIXI from "pixi.js";
import Slot from "./Slot";

export default class SlotContainer {
  public readonly reels: Array<Slot> = [];
  public readonly container: PIXI.Container;

  constructor(
    app: PIXI.Application,
    containerWidth: number,
    containerHeight: number,
    marginTop: number = 0,
    marginLeft: number = 0,
    slotMarginLeft: number = 10,
    slotMarginRight: number = 10
  ) {
    const REEL_OFFSET_LEFT = 100;
    const NUMBER_OF_REELS = 5;
    this.container = new PIXI.Container();

    let totalSlotWidth = 0;

    for (let i = 0; i < NUMBER_OF_REELS; i++) {
      const reel = new Slot(app, i);
      this.reels.push(reel);
      this.container.addChild(reel.container);

      // Accumulate the total width of the slots to calculate the available space for margins
      totalSlotWidth += reel.container.width;
    }

    // Calculate the available space for margins between the slots
    const availableMarginSpace = containerWidth - totalSlotWidth - REEL_OFFSET_LEFT;
    const numMargins = NUMBER_OF_REELS - 1;
    const actualSlotMargin = Math.min(slotMarginLeft, slotMarginRight, availableMarginSpace / numMargins);

    // Set the positions of the slots considering margins
    let currentPosition = REEL_OFFSET_LEFT + marginLeft;
    for (const reel of this.reels) {
      reel.container.x = currentPosition;
      currentPosition += reel.container.width + actualSlotMargin;
    }

    // Scale the container to the desired size
    const containerAspectRatio = containerWidth / containerHeight;
    const slotContainerAspectRatio =
      this.container.width / this.container.height;
    const scale =
      containerAspectRatio > slotContainerAspectRatio
        ? containerHeight / this.container.height
        : containerWidth / this.container.width;
    this.container.scale.set(scale);

    // Adjust the container's position with the top margin
    this.container.position.y = marginTop;
  }
  public async spin() {
    const shiftingDelay = 100;
    const start = Date.now();
    const reelsToSpin = [...this.reels];

    for await (let _ of this.infiniteSpinning(reelsToSpin)) {
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

import * as PIXI from "pixi.js";

export default class Background {
  public readonly sprite: PIXI.Container;
  private readonly texture: PIXI.Texture;

  constructor(
    loader: PIXI.Loader,
    screenWidth: number,
    screenHeight: number,
    name: string,
    isFullScreen: boolean = false,
    isFirstTexturePack: boolean = true,
    paddingTop: number = 0,
    paddingBottom: number = 100,
    width: number = 3200,
    height: number = 600,
    marginTop: number = 900,
    marginBottom: number = 200,
    marginLeft: number = 580
  ) {
    this.texture = isFirstTexturePack
      ? loader.resources!.atlass.textures![name]
      : loader.resources!.atlas.textures![name];
    this.sprite = new PIXI.Sprite(this.texture);


    if (isFullScreen) {
      // Calculate the scale to fit the screen while preserving the aspect ratio
      const scale = Math.max(
        screenWidth / this.texture.width,
        screenHeight / this.texture.height
      );
      this.sprite.scale.set(scale, scale);

      // Center the background on the screen
      this.sprite.position.set(
        (screenWidth - this.sprite.width) / 2,
        (screenHeight - this.sprite.height) / 2
      );
    } else {
      // Set the sprite's width and height based on the given size and padding
      const spriteWidth = width - 2 * marginLeft;
      const spriteHeight = height - (paddingTop + paddingBottom);
      this.sprite.width = spriteWidth;
      this.sprite.height = spriteHeight;

      // Center the background on the screen with margin top, bottom, and left
      this.sprite.position.set(
        (screenWidth - this.sprite.width) / 2 + marginLeft,
        (screenHeight - this.sprite.height) / 2 + marginTop - marginBottom
      );
    }
  }
}

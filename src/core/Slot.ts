import * as PIXI from 'pixi.js';

export default class Slot {
    public readonly container: PIXI.Container;
    public readonly textures: Array<PIXI.Texture>;
    public sprites: Array<PIXI.Sprite> = [];
    private readonly appHeight: number;
    private readonly ticker: PIXI.Ticker;

    constructor(app: PIXI.Application, position: number) {
        this.appHeight = app.screen.height;
        this.ticker = app.ticker;
        this.container = new PIXI.Container();
        this.textures = [
            app.loader.resources.atlas!.textures!['paluna 1.png'],
            app.loader.resources.atlas!.textures!['paluna 2.png'],
            app.loader.resources.atlas!.textures!['paluna 3.png'],
            // app.loader.resources.atlas!.textures!['paluna 4.png'],
            // app.loader.resources.atlas!.textures!['paluna 5.png'],
            // app.loader.resources.atlas!.textures!['paluna 6.png'],
            // app.loader.resources.atlas!.textures!['paluna 7.png'],
            // app.loader.resources.atlas!.textures!['paluna 8.png'],
            // app.loader.resources.atlas!.textures!['paluna 9.png'],
            // app.loader.resources.atlas!.textures!['paluna 10.png'],
            // app.loader.resources.atlas!.textures!['paluna 11.png'],
            // app.loader.resources.atlas!.textures!['paluna 12.png'],
            // app.loader.resources.atlas!.textures!['paluna 13.png'],
            // app.loader.resources.atlas!.textures!['paluna 14.png'],
            // app.loader.resources.atlas!.textures!['paluna 15.png'],
        ];
        this.generate(position);
    }


    private generate(position: number) {
        const REEL_WIDTH = 350;
        const REEL_OFFSET_BETWEEN = 3;
        const NUMBER_OF_ROWS = 3;
        this.container.x = position * REEL_WIDTH;

        for (let i = 0; i < NUMBER_OF_ROWS + 1; i++) {
            const symbol = new PIXI.Sprite(this.textures[Math.floor(Math.random() * this.textures.length)]);
            symbol.width = 300; // Set the desired width for the symbol
            symbol.height = 250; // Set the desired height for the symbol
            const widthDiff = REEL_WIDTH - symbol.width;
            symbol.x = position * REEL_OFFSET_BETWEEN + widthDiff / 2;
            const yOffset = (this.appHeight - symbol.height * 3) / 3;
            const cellHeight = symbol.height + yOffset;
            const paddingTop = yOffset / 2;
            symbol.y = (i - 1) * cellHeight + paddingTop;
            this.sprites.push(symbol);
            this.container.addChild(symbol);
        }
    }

    public spinOneTime() {
        let speed = 50;
        let doneRunning = false;
        let yOffset = (this.appHeight - this.sprites[0].height * 3) / 3 / 2;

        return new Promise<void>(resolve => {
            const tick = () => {
                for (let i = this.sprites.length - 1; i >= 0; i--) {
                    const symbol = this.sprites[i];

                    if (symbol.y + speed > this.appHeight + yOffset) {
                        doneRunning = true;
                        speed = this.appHeight - symbol.y + yOffset;
                        symbol.y = -(symbol.height + yOffset);
                    } else {
                        symbol.y += speed;
                    }

                    if (i === 0 && doneRunning) {
                        let t = this.sprites.pop();
                        if (t) this.sprites.unshift(t);
                        this.ticker.remove(tick);
                        resolve();
                    }
                }
            }

            this.ticker.add(tick);
        });
    }
}

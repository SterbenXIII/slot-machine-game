import * as PIXI from "pixi.js";
import Loader from "./Loader";
import PlayButton from "./PlayButton";
import Background from "./Background";
import SlotContainer from "./SlotContainer";
import Scoreboard from "./Scoreboard";
import VictoryScreen from "./VictoryScreen";

export default class SlotMachine {
  public app: PIXI.Application;
  private playBtn: PlayButton;
  private reelsContainer: SlotContainer;
  private scoreboard: Scoreboard;
  private victoryScreen: VictoryScreen;

  constructor() {
    this.app = new PIXI.Application({ width: 2400, height: 2000 });
    window.document.body.appendChild(this.app.view);
    new Loader(this.app, this.init.bind(this));
  }

  private init() {
    this.createScene();
    this.createPlayButton();
    this.createReels();
    this.createScoreboard();
    this.createVictoryScreen();
  }

  private createScene() {

    const background = new Background(
      this.app.loader,
      this.app.screen.width,
      this.app.screen.height,
      'paluna.png',
      true
    );
    const backgroundS = new Background(
      this.app.loader,
      800,
      1300,
      'Frame 2.png',
       false,
       true,
       200,
       100,
       3100,
       1500,
       550,
       200,
       590
    );
    const backgroundT = new Background(
        this.app.loader,
        800,
        2100,
        'Group 7.png',
        false,
        false,
         0,
         100,
         3250,
         2000,
         200,
         200,
         620
      );
    const backgroundF = new Background(
        this.app.loader,
        800,
        2100,
        'bottom section.png',
        false,
        true,
      );
    
  
    this.app.stage.addChild(background.sprite);

    this.app.stage.addChild(backgroundS.sprite);
    this.app.stage.addChild(backgroundT.sprite);
    this.app.stage.addChild(backgroundF.sprite);
  }

  private createPlayButton() {
    this.playBtn = new PlayButton(this.app, this.handleStart.bind(this));
    this.app.stage.addChild(this.playBtn.sprite);
  }

  private createReels() {
    this.reelsContainer = new SlotContainer(this.app, 5000, 800, 700, 700, 1200, 600);
    this.app.stage.addChild(this.reelsContainer.container);
  }

  private createScoreboard() {
    this.scoreboard = new Scoreboard(this.app);
    this.app.stage.addChild(this.scoreboard.container);
  }

  private createVictoryScreen() {
    this.victoryScreen = new VictoryScreen(this.app);
    this.app.stage.addChild(this.victoryScreen.container);
  }

  public handleStart() {
    this.scoreboard.decrement();
    this.playBtn.setDisabled();
    this.reelsContainer.spin().then(this.processSpinResult.bind(this));
  }

  private processSpinResult(isWin: boolean) {
    if (isWin) {
      this.scoreboard.increment();
      this.victoryScreen.show();
    }

    if (!this.scoreboard.outOfMoney) this.playBtn.setEnabled();
  }
}

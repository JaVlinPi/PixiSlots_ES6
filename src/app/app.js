
import * as PIXI from 'pixi.js';
import SlotController from './slots/slotsController';
import { getResult } from './slots/utils';
import StakeSelector from './slots/stakeSelector';
import ValueDisplay from './slots/valueDisplay';
import { START_FUNDS } from './constants';

let funds = START_FUNDS;

window.resources = PIXI.Loader.shared.resources;

//Create a Pixi Application
let app = new PIXI.Application({
  width: 900,         // default: 800
  // height: 256,        // default: 600
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 1       // default: 1
});
window.app = app;

function handleWindowSize() {
  if ( window.innerWidth > window.innerHeight ) {
    app.stage.pivot.set(app.stage.width / 2, app.stage.height / 2);
    app.stage.x = app.stage.width / 2;
    app.stage.y = app.stage.height / 2;
    app.stage.rotation = 0;
    app.stage.width = 900;
    app.stage.height = 600;
  }
  else {
    app.stage.pivot.set(app.stage.height / 2, app.stage.width / 2);
    app.stage.x = app.stage.height / 2;
    app.stage.y = app.stage.width / 2;
    app.stage.rotation = Math.PI / 2;
    app.stage.width = 600;
    app.stage.height = 900;
  }
}
window.addEventListener("resize", handleWindowSize);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const resourceList = {
  apricot: 'assets/img/slot/apricot.png',
  banana: 'assets/img/slot/banana.png',
  coconut: 'assets/img/slot/coconut.png',
  pineapple: 'assets/img/slot/pineapple.png',
  wild: 'assets/img/slot/wild.png',
  reelBack: 'assets/img/table/reelback.png',
  reelFront: 'assets/img/table/reelfront.png',
  spinButton: 'assets/img/spin button/basic.png',
  box: 'assets/img/box.png',
  box2: 'assets/img/box2.png',
}

//load an image and run the `setup` function when it's done
for ( let a in resourceList ) {
  PIXI.Loader.shared.add(a, resourceList[a]);
}
PIXI.Loader.shared.load(setup);

//This `setup` function will run when the image has loaded
let spinText;
function setup() {
  
  app.stage.sortableChildren = true;

  let reelBack = new PIXI.Sprite(resources.reelBack.texture);
  app.stage.addChild(reelBack);
  reelBack.zIndex = -1;

  let reelFront = new PIXI.Sprite(resources.reelFront.texture);
  app.stage.addChild(reelFront);
  reelFront.zIndex = 1;

  reelBack.width = reelFront.width = 900;
  reelBack.height = reelFront.height = 560;

  let spinButtonContainer = new PIXI.Container();
  spinButtonContainer.sortableChildren = true;
  app.stage.addChild(spinButtonContainer);
  let text = new PIXI.Text('SPIN',{
    fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
    fontWeight: "bolder",
    fontSize: 36,
    fill : 0xffffff,
    align : 'center'
  });
  spinButtonContainer.addChild(text);
  text.x = 75;
  text.y = 37;
  text.zIndex = 2;
  let spinButton = new PIXI.Sprite(resources.spinButton.texture);
  spinButtonContainer.addChild(spinButton);
  spinButtonContainer.zIndex = 2;
  spinButtonContainer.interactive = true;
  spinButtonContainer.x = 330;
  spinButtonContainer.y = 510;

  let stakeSelector = new StakeSelector();
  app.stage.addChild(stakeSelector);
  stakeSelector.x = 600;
  stakeSelector.y = 545;

  let balanceDisplay = new ValueDisplay('BALANCE',funds);
  balanceDisplay.zIndex = 5;
  app.stage.addChild(balanceDisplay);
  balanceDisplay.x = 200;
  balanceDisplay.y = 545;

  let winDiplay = new ValueDisplay('WIN','');
  winDiplay.zIndex = 5;
  app.stage.addChild(winDiplay);
  winDiplay.x = 70;
  winDiplay.y = 545;


  let slotContoller = new SlotController();

  spinButtonContainer.on('click', (event) => {
    if ( slotContoller.isSpinning() ) {
      text.text = 'SPIN';
      getResult((results)=>{
          funds += parseFloat(results.winAmount);
          funds = Math.round(funds*100)*0.01;
          funds = ''+funds;
          let i = funds.indexOf('.');
          if ( i != -1 ) {
              funds = funds.slice(0,i+3);
          }
          funds = parseFloat(funds);
          winDiplay.setValue(results.winAmount);
          balanceDisplay.setValue(funds);
          slotContoller.stopSpin(results);
      });
    }
    else {
      funds -= stakeSelector.stake;
      winDiplay.setValue('');
      balanceDisplay.setValue(funds);
      slotContoller.spin();
      text.text = 'STOP';
    }
  });

  handleWindowSize();
  handleWindowSize();
  
}


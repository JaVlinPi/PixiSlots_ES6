
import * as PIXI from 'pixi.js';
import SlotController from './slots/slotsController';
import { getResult } from './slots/utils';
import StakeSelector from './general/stakeSelector';
import ValueDisplay from './general/valueDisplay';
import { START_FUNDS, SOUNDS, LOW_QUALITY_STAGE_MAX } from './constants';
import SpriteLoader from './general/spriteLoader';
import CustomSprite from './general/customSprite';
import Reel from './slots/reel';
import SpinButton from './slots/spinButton';

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

// function for switching the quality of the spites used
function setQuality(quality) {
  spriteLoader.switchQuality(quality)
  .then(()=>{
    // We call this outside of spriteLoader as not all games will use reels, but all should be using CustomSprites
    Reel.redraw();
  });
}

// called on window resize. handles rotation and sprite quality change 
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
  if ( Math.min(window.innerWidth,window.innerHeight) < LOW_QUALITY_STAGE_MAX &&
       CustomSprite.quality() == 'high' ) {
    setQuality('low');
  }
  else if ( Math.min(window.innerWidth,window.innerHeight) >= LOW_QUALITY_STAGE_MAX &&
            CustomSprite.quality() != 'high' ) {
    setQuality('high');
  }
}
window.addEventListener("resize", handleWindowSize);

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// Block for loading sprites then calling setup() to set the game up
let initQuality = Math.min(window.innerWidth,window.innerHeight) < LOW_QUALITY_STAGE_MAX ? 'low' : 'high';
const spriteLoader = new SpriteLoader();
spriteLoader.loadSprites({
  apricot: 'slot/apricot.png',
  banana: 'slot/banana.png',
  coconut: 'slot/coconut.png',
  pineapple: 'slot/pineapple.png',
  wild: 'slot/wild.png',
  reelBack: 'table/reelback.png',
  reelFront: 'table/reelfront.png',
  spinButton: 'spin button/basic.png',
  box: 'box.png',
  box2: 'box2.png',
},initQuality).then(setup);


//This `setup` function will run when images has loaded
function setup() {
  
  app.stage.sortableChildren = true;

  let reelBack = new CustomSprite('reelBack');
  app.stage.addChild(reelBack);
  reelBack.zIndex = -1;

  let reelFront = new CustomSprite('reelFront');
  app.stage.addChild(reelFront);
  reelFront.zIndex = 1;

  reelBack.width = reelFront.width = 900;
  reelBack.height = reelFront.height = 560;

  let spinButton = new SpinButton();
  app.stage.addChild(spinButton);
  spinButton.zIndex = 2;
  spinButton.x = 330;
  spinButton.y = 510;

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

  // Code for responding to the spin button click
  spinButton.on('click', (event) => {
    if ( slotContoller.isSpinning() ) {
      spinButton.setText('SPIN');
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
      SOUNDS.spin.loop = true;
      SOUNDS.spin.play();
      funds -= stakeSelector.stake;
      winDiplay.setValue('');
      balanceDisplay.setValue(funds);
      slotContoller.spin();
      spinButton.setText('STOP');
    }
  });

  // Used to orientate the game once everything is set up.
  // Not sure why a single redraw fails to achieve the correct results, but any additional calls produces the correct result
  handleWindowSize();
  handleWindowSize();
  
}


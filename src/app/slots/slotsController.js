
import * as PIXI from 'pixi.js';
import {AdvancedBloomFilter} from '@pixi/filter-advanced-bloom';
import {
    NUM_OF_REELS,
    REELS_X,
    REELS_Y,
    REEL_WIDTH,
    REEL_SPACING,
    SYMBOL_HEIGHT,
    SPIN_DELAY_PER_REEL,
    SPIN_SPEED,
    REEL_SYMBOL_DATA,
    NUM_OF_ROWS,
    WIN_LINE_DURATION,
    WIN_LINES
} from "../constants";
import Reel from "./reel";
import { getSymbolsAtPosition } from "./utils";


let reels = [];
let reelPositions = [0,0,0,0,0];
let currSymbols = [];

// spin vars
let _isSpinning = false;
let spinStartTime;
let lastSpinUpdateTime;
let spinId;

// stop spin vars
let endSpinSymbols = [];
let endSpinPositions = [];
let isResultSpinning = false;
let wins;

// win vars
let isShowingWins = false;
let currWinIndex;
let winLineTimerId;

export default class SlotController {

    constructor() {
        
        this.showPositions = this.showPositions.bind(this);
        this.spin = this.spin.bind(this);
        this.isSpinning = this.isSpinning.bind(this);
        this.doSpin = this.doSpin.bind(this);
        this.stopSpin = this.stopSpin.bind(this);
        this.doStopToResult = this.doStopToResult.bind(this);
        this.showWins = this.showWins.bind(this);
        this.showWinLine = this.showWinLine.bind(this);
        this.getWinFilters = this.getWinFilters.bind(this);
        this.fadeAllSymbols = this.fadeAllSymbols.bind(this);
        this.resetSymbolDisplay = this.resetSymbolDisplay.bind(this);

        // populate reels
        for ( var i = 0; i < NUM_OF_REELS; i++ ) {
            var r = new Reel({
                position: {
                    x: REELS_X+(i*(REEL_WIDTH+REEL_SPACING)),
                    y: REELS_Y,
                },
                width: REEL_WIDTH,
                symbolHeight: SYMBOL_HEIGHT,
            });
            reels.push(r);
        }

        
        this.showPositions(reelPositions);
    }

    showPositions(positions) {
        for ( var i = 0; i < Math.min(positions.length,reels.length,NUM_OF_REELS); i++ ) {
            let symbols = getSymbolsAtPosition(i,positions[i]);
            currSymbols[i] = symbols;
            reels[i].display(symbols,(positions[i]%1));
        }
    }

    spin() {
        if ( isResultSpinning ) return;
        this.resetSymbolDisplay();
        _isSpinning = true;
        spinStartTime = lastSpinUpdateTime = performance.now();
        spinId = window.requestAnimationFrame(this.doSpin);
    }

    isSpinning() {
        return _isSpinning;
    }

    doSpin(e) {
        let msPassed = e - lastSpinUpdateTime;
        for ( var i = 0; i < reelPositions.length; i++ ) {
            if ( e-spinStartTime > i*SPIN_DELAY_PER_REEL ) {
                reelPositions[i] += msPassed/1000*SPIN_SPEED;
                if ( reelPositions[i] > REEL_SYMBOL_DATA[i].length ) {
                    reelPositions[i] -= REEL_SYMBOL_DATA[i].length;
                }
            }
        }
        this.showPositions(reelPositions);
        lastSpinUpdateTime = e;
        if ( _isSpinning ) {
            spinId = window.requestAnimationFrame(this.doSpin);
        }
    }

    stopSpin(result) {
        _isSpinning = false;
        window.cancelAnimationFrame(spinId);
        if ( result ) {
            let resultPositions = result.reelPositions;
            wins = result.wins;
            isResultSpinning = true;
            // create new list of symbols, current + result
            for ( var i = 0; i < Math.min(resultPositions.length,reels.length,NUM_OF_REELS); i++ ) {
                endSpinSymbols[i] = currSymbols[i].concat(getSymbolsAtPosition(i,resultPositions[i]));
                endSpinPositions[i] = reelPositions[i]%1;
            }
            // start new frame for showing new symbols
            spinId = window.requestAnimationFrame(this.doStopToResult);
            reelPositions = resultPositions.concat();
        }
    }

    doStopToResult(e) {
        let msPassed = e - lastSpinUpdateTime;
        let endSpinComplete = true;
        for ( var i = 0; i < endSpinPositions.length; i++ ) {
            if ( endSpinPositions[i] < endSpinSymbols[i].length-NUM_OF_ROWS-1 ) {
                endSpinPositions[i] += msPassed/1000*SPIN_SPEED;
                endSpinComplete = false;
            }
            else {
                endSpinPositions[i] = endSpinSymbols[i].length-NUM_OF_ROWS-1;
            }
            reels[i].display(endSpinSymbols[i],endSpinPositions[i]);
        }

        lastSpinUpdateTime = e;
        if ( !endSpinComplete && isResultSpinning ) {
            spinId = window.requestAnimationFrame(this.doStopToResult);
        }
        else {
            isResultSpinning = false;
            if ( wins && wins.length ) {
                this.showWins();
            }
        }
    }

    showWins() {
        currWinIndex = 0;
        this.showWinLine(wins[currWinIndex].lineId,wins[currWinIndex].length);
    }
    
    showWinLine(lineId,length) {
        this.fadeAllSymbols();
        let winLine = WIN_LINES[lineId];
        for ( var r = 0; r < length; r++ ) {
            reels[r].applyFilters(winLine[r],this.getWinFilters(r));
        }
        clearTimeout(winLineTimerId);
        winLineTimerId = setTimeout(()=>{
            currWinIndex++;
            if ( currWinIndex >= wins.length ) {
                currWinIndex = 0;
            }
            this.showWinLine(wins[currWinIndex].lineId,wins[currWinIndex].length);
        },WIN_LINE_DURATION);
    }

    getWinFilters(index) {
        let winFilter = new AdvancedBloomFilter({bloomScale:0.5,threshold:0.5});
        createjs.Tween.get(winFilter)
        .wait(index*WIN_LINE_DURATION/10)
        .to({bloomScale:1,brightness:1.5,threshold:0.25}, WIN_LINE_DURATION/4)
        .to({bloomScale:0.5,brightness:1,threshold:0.5}, WIN_LINE_DURATION/4);
        return [winFilter];
    }

    fadeAllSymbols() {
        for ( var r = 0; r < NUM_OF_REELS; r++ ) {
            reels[r].fade();
        }
    }

    resetSymbolDisplay() {
        clearTimeout(winLineTimerId);
        for ( var i = 0; i < reels.length; i++ ) {
            reels[i].clearFilters();
        }
    }
    
}
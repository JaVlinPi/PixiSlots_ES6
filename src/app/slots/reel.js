
import * as PIXI from 'pixi.js';
import {
    REEL_WIDTH,
    VISIBLE_ROWS
} from '../constants';
import CustomSprite from '../general/customSprite';

// fade vars
let fadeFilter = new PIXI.filters.ColorMatrixFilter();
fadeFilter.desaturate();

let reelList = [];

export default class Reel {

    static redraw() {
        for ( var i = 0; i < reelList.length; i++ ) {
            reelList[i].redraw();
        }
    }

    constructor(options) {

        reelList.push(this);

        this.display = this.display.bind(this);
        this.fade = this.fade.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);

        options = options || {};
        this.position = options.position || {x:0,y:0};
        this.length = options.length || VISIBLE_ROWS;
        this.width = options.width || REEL_WIDTH;
        this.symbolHeight = options.symbolHeight || REEL_WIDTH;

        // create symbols
        this.symbols = [];
        this.container = new PIXI.Container();

        for ( var i = 0; i < this.length; i++ ) {
            let s = new PIXI.Sprite();
            s.width = this.width;
            s.height = this.symbolHeight;
            this.container.addChild(s);
            this.symbols.push(s);
        }
        app.stage.addChild(this.container);
        this.container.mask = new PIXI.Graphics()
            .beginFill(0xffffff)
            .drawRect(this.position.x, this.position.y, this.width, this.symbolHeight*(this.length-1))
            .endFill();
        this.container.x = this.position.x;
        app.stage.addChild(this.container.mask);

    }

    // Updates display with symbols provided. offset is a value from 0-1 that specifies how far the reel is past the symbols at index 0
    display (symbols,offset) {
        this.currentSymbols = symbols;
        this.currentOffset = offset;
        let offsetIndex = Math.floor(offset);
        let quality = CustomSprite.quality();
        for ( var i = 0; i < Math.min(this.symbols.length,this.length); i++ ) {
            this.symbols[i].texture = PIXI.utils.TextureCache[symbols[i+offsetIndex]+'_'+quality];
            this.symbols[i].y = this.position.y + (i*this.symbolHeight) - ((offset%1)*this.symbolHeight);
        }
    }

    // used to redraw current symbols at current positions. only useful for quality change atm
    redraw() {
        this.display(this.currentSymbols,this.currentOffset);
    }

    // cause all symbols to be greyscaled
    fade() {
        for ( var i = 0; i < this.symbols.length; i++ ) {
            this.symbols[i].filters = [fadeFilter];
        }
    }

    // used to apply any filter
    applyFilters(symbolIndex,filters) {
        this.symbols[symbolIndex].filters = filters;
    }

    // clears all filters
    clearFilters() {
        for ( var i = 0; i < this.symbols.length; i++ ) {
            this.symbols[i].filters = null;
        }
    }
}
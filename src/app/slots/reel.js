
import * as PIXI from 'pixi.js';
import { VISIBLE_ROWS } from '../constants';

// fade vars
let fadeFilter = new PIXI.filters.ColorMatrixFilter();
fadeFilter.desaturate();

export default class Reel {

    constructor(options) {

        this.display = this.display.bind(this);
        this.fade = this.fade.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);

        options = options || {};
        this.position = options.position || {x:0,y:0};
        this.length = options.length || VISIBLE_ROWS;
        this.width = options.width || 100;
        this.symbolHeight = options.symbolHeight || 100;

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

    display (symbols,offset) {
        let offsetIndex = Math.floor(offset);
        for ( var i = 0; i < Math.min(this.symbols.length,this.length); i++ ) {
            this.symbols[i].texture = PIXI.utils.TextureCache[symbols[i+offsetIndex]];
            this.symbols[i].y = this.position.y + (i*this.symbolHeight) - ((offset%1)*this.symbolHeight);
        }
    }

    fade() {
        for ( var i = 0; i < this.symbols.length; i++ ) {
            this.symbols[i].filters = [fadeFilter];
        }
    }

    applyFilters(symbolIndex,filters) {
        this.symbols[symbolIndex].filters = filters;
    }

    clearFilters() {
        for ( var i = 0; i < this.symbols.length; i++ ) {
            this.symbols[i].filters = null;
        }
    }
}
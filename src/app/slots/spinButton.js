import * as PIXI from 'pixi.js';
import CustomSprite from '../general/customSprite';

export default class SpinButton extends PIXI.Container {

    constructor() {
        super();
        
        this.sortableChildren = true;
        this.text = new PIXI.Text('SPIN',{
            fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
            fontWeight: "bolder",
            fontSize: 36,
            fill : 0xffffff,
            align : 'center'
        });
        this.addChild(this.text);
        this.text.x = 75;
        this.text.y = 37;
        this.text.zIndex = 2;
        let spinButton = new CustomSprite('spinButton');
        this.addChild(spinButton);
        this.interactive = true;

    }

    setText(text) {
        this.text.text = text;
    }

}
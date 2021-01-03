
import * as PIXI from 'pixi.js';
import { STAKES } from '../constants';
import CustomSprite from './customSprite';

export default class ValueDisplay extends PIXI.Container {

    constructor(header,value) {
        super();

        let box = new CustomSprite('box');
        this.addChild(box);
        
        let headerText = new PIXI.Text(header,{
            fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
            fontWeight: "bolder",
            fontSize: 12,
            fill : 0xffffff,
            align : 'center',
        });
        headerText.x = 35;
        headerText.y = 5;
        this.addChild(headerText);
        
        this.valueText = new PIXI.Text(value,{
            fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
            fontWeight: "bolder",
            fontSize: 24,
            fill : 0xffffff,
            align : 'center',
        });
        this.valueText.x = 35;
        this.valueText.y = 15;
        this.addChild(this.valueText);

    }

    setValue(value) {
        this.valueText.text = value;
    }

}
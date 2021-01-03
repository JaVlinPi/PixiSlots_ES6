
import * as PIXI from 'pixi.js';
import { STAKES } from '../constants';
import CustomSprite from './customSprite';

export default class StakeButton extends PIXI.Container {

    constructor(index,callback) {
        super();

        let box = new CustomSprite('box2');
        this.addChild(box);
        
        let valueText = new PIXI.Text(STAKES[index],{
            fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
            fontWeight: "bolder",
            fontSize: 24,
            fill : 0xffffff,
            align : 'center',
        });
        valueText.x = 40;
        valueText.y = 10;
        this.addChild(valueText);

        this.interactive = true;
        this.on('click', (event) => {
            callback(index);
        });

    }

}
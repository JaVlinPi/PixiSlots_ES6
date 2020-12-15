
import * as PIXI from 'pixi.js';
import { STAKES } from '../constants';

export default class StakeButton extends PIXI.Container {

    constructor(index,callback) {
        super();

        let box = new PIXI.Sprite(resources.box2.texture);
        this.addChild(box);
        
        let value = new PIXI.Text(STAKES[index],{
            fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
            fontWeight: "bolder",
            fontSize: 24,
            fill : 0xffffff,
            align : 'center',
        });
        value.x = 40;
        value.y = 10;
        this.addChild(value);

        this.interactive = true;
        this.on('click', (event) => {
            callback(index);
        });

    }

}
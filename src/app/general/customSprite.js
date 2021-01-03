
import * as PIXI from 'pixi.js';

let spriteQuality = 'low';
let spriteList = [];

export default class CustomSprite extends PIXI.Sprite {

    static quality() {
        return spriteQuality;
    }

    static setQuality(quality) {
        spriteQuality = quality;
        for ( let i = 0; i < spriteList.length; i++ ) {
            if ( resources[spriteList[i].spriteName+'_'+spriteQuality].texture ) {
                spriteList[i].texture = resources[spriteList[i].spriteName+'_'+spriteQuality].texture;
            }
        }
    }

    constructor(spriteName) {
        super(resources[spriteName+'_'+spriteQuality].texture);

        spriteList.push(this);
        this.spriteName = spriteName;

    }

}
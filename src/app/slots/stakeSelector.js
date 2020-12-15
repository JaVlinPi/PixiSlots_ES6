

import * as PIXI from 'pixi.js';
import StakeButton from './stakeButton';
import { STAKES } from '../constants';


export default class StakeSelector extends PIXI.Container {

    constructor() {
        super();

        this.onButtonClick = this.onButtonClick.bind(this);
        this.displayStakes = this.displayStakes.bind(this);
        this.hideStakes = this.hideStakes.bind(this);
        this.updateValue = this.updateValue.bind(this);

        this.stakesButtons = [];
        this.index = 0;
        this.zIndex = 5;
        
        let box = new PIXI.Sprite(resources.box.texture);
        this.addChild(box);
        this.interactive = true;
        this.on('click', this.displayStakes);
        
        
        let headerText = new PIXI.Text('STAKE',{
            fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
            fontWeight: "bolder",
            fontSize: 12,
            fill : 0xffffff,
            align : 'center',
        });
        headerText.x = 35;
        headerText.y = 5;
        this.addChild(headerText);
        
        this.valueText = new PIXI.Text(STAKES[this.index],{
            fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
            fontWeight: "bolder",
            fontSize: 24,
            fill : 0xffffff,
            align : 'center',
        });
        this.valueText.x = 40;
        this.valueText.y = 15;
        this.addChild(this.valueText);
    
        for ( var i = 0; i < STAKES.length; i++ ) {
            let s = new StakeButton(i,this.onButtonClick);
            s.y = -((i+1)*s.height);
            this.addChild(s);
            this.stakesButtons.push(s);
        }

        this.hideStakes();
        
    }

    onButtonClick(index) {
        console.log('onButtonClick('+index+')');
        this.index = index;
        this.updateValue();
        this.hideStakes();

    }

    displayStakes() {
        console.log(' - displayStakes');
        this.interactive = false;
        for ( var i = 0; i < this.stakesButtons.length; i++ ) {
            this.stakesButtons[i].visible = true;
        }
    }

    hideStakes() {
        this.interactive = true;
        for ( var i = 0; i < this.stakesButtons.length; i++ ) {
            this.stakesButtons[i].visible = false;
        }
    }

    updateValue() {
        this.valueText.text = STAKES[this.index];
        this.stake = STAKES[this.index];
    }

}
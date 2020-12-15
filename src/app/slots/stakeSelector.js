

import * as PIXI from 'pixi.js';
import StakeButton from './stakeButton';
import { STAKES } from '../constants';
import ValueDisplay from './valueDisplay';


export default class StakeSelector extends PIXI.Container {

    constructor() {
        super();

        this.onButtonClick = this.onButtonClick.bind(this);
        this.displayStakes = this.displayStakes.bind(this);
        this.hideStakes = this.hideStakes.bind(this);
        this.updateValue = this.updateValue.bind(this);

        this.stakesButtons = [];
        this.index = 0;
        this.stake = STAKES[this.index];
        this.zIndex = 5;

        this.interactive = true;
        this.on('click', this.displayStakes);

        this.valueDisplay = new ValueDisplay('STAKE',this.stake);
        this.addChild(this.valueDisplay);
    
        for ( var i = 0; i < STAKES.length; i++ ) {
            let s = new StakeButton(i,this.onButtonClick);
            s.y = -((i+1)*s.height);
            this.addChild(s);
            this.stakesButtons.push(s);
        }

        this.hideStakes();
        
    }

    onButtonClick(index) {
        this.index = index;
        this.updateValue();
        this.hideStakes();

    }

    displayStakes() {
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
        this.stake = STAKES[this.index];
        this.valueDisplay.setValue(this.stake);
    }

}
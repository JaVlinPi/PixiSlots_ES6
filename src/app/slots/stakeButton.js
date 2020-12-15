

function StakeButton() {

}
StakeButton.prototype = PIXI.Sprite.prototype;
// StakeButton = {...PIXI.Sprite};
for ( var a in PIXI.Sprite ) {
    StakeButton[a] = PIXI.Sprite[a];
}


console.log('PIXI.Sprite.prototype:',PIXI.Sprite.prototype);
console.log('PIXI.Sprite:',PIXI.Sprite);
console.log('StakeButton.prototype:',StakeButton.prototype);
console.log('StakeButton:',StakeButton);

var s = new PIXI.Sprite();
console.log('s.x:',s.x);
var ss = new StakeButton();
console.log('ss.x:',ss.x);


function StakeSelector() {

    this.isOpen = false;
    
    this.container = new PIXI.Container();
    for ( var i = 0; i < STAKES.length; i++ ) {
        let s = new PIXI.Sprite();
        s.width = this.width;
        s.height = this.symbolHeight;
        this.container.addChild(s);
        this.symbols.push(s);
    }

}
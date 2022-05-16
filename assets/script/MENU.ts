// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    menubtn:cc.Node = null;
    @property(cc.Node)
    menu:cc.Node = null;
    @property(cc.Node)
    clobtn:cc.Node = null;
    @property(cc.Node)
    game:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.menubtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            this.game.getComponent('Game').menuflag = true;
            this.menubtn.active = false;
            this.menu.active = true;
        },this);
        this.clobtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            this.game.getComponent('Game').closeflag = true;
            
            this.menubtn.active = true;
            this.menu.active = false;
        },this)
    }

    start () {

    }

    // update (dt) {}
}

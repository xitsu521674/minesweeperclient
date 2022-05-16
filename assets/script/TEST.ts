// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var node = this.node;
        this.node.on('touchmove', function (event:cc.Event.EventTouch) {
            
            var delta = event.touch.getDelta();
            node.x -= delta.x;
            node.y -= delta.y;
    
        }, this);
    }

    start () {

    }

    // update (dt) {}
}

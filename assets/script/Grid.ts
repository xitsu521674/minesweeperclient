// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    pushed:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    flag:cc.SpriteFrame = null;
    @property(cc.Label)
    text:cc.Label = null;
    
    last:cc.Vec2 = null;
    id:number = -1;
    setStatus(val,color:cc.Color,chance,flag){
        this.node.color = color;
        if(val==0){
            this.node.getComponent(cc.Sprite).spriteFrame = this.pushed;
        }else if(val==-1&&flag){
            this.text.string = chance.toString()+'%';
            this.text.node.color = cc.Color.BLACK;
            this.text.fontSize = 12;
        }
        else if(val!=-1){
            if(val==9){
                this.text.string = '';
                var newnode = new cc.Node();
                newnode.addComponent(cc.Sprite);
                newnode.getComponent(cc.Sprite).spriteFrame = this.flag;
                newnode.setParent(this.node);
                newnode.anchorX = 0;
                newnode.anchorY = 0;
                newnode.scale = 0.8;
                newnode.setPosition(4.5,4);
            }else{
                this.text.string = val.toString();
                this.text.node.color = cc.Color.WHITE;
                this.text.fontSize = 20;
                this.node.getComponent(cc.Sprite).spriteFrame = this.pushed;
            }
            
        }else{
            this.text.string = '';
        }
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    // update (dt) {}
}

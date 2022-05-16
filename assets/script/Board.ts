// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class Board{
    GID:number = 0;
    Height:number = 0;
    Width:number = 0;
    Playing:boolean = true;
    Client:[] = null;
    ready:boolean = false;
}

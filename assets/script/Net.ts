// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;
import Board from "./Board";
import Player from "./Player";
@ccclass
export default class Net extends cc.Component {

    

    ws:WebSocket = null;
    gotflag:boolean = false;
    
    
    InitNet(ip:string){
        try{
            this.ws = new WebSocket("wss://"+ip);
        }catch(ex){
            cc.log('invalid connection');
            return false;
        }
        cc.log('start connection');
        return true;
        
        
    }
    
    getBoard():Board{
        var req = {
            "Type":"get.board"
        }
        var board:Board = new Board();
        if(this.ws.readyState==1){
            this.ws.send(JSON.stringify(req));
            this.ws.onmessage = (e)=>{
                cc.log('get board');
                var msg = JSON.parse(e.data);
                this.gotflag = true;
                board.GID = msg.GID;
                board.Height = msg.Height;
                board.Width = msg.Width;
                board.Playing = msg.Playing;
                board.Client = msg.Client;
                board.ready = true;
                return board;
            }
        }else{
            cc.log('get board failed');
            board.ready = false;
        }
        return board;
    }
    getPlayer():Player[]{
        var req = {
            "Type":"get.players"
        }
        var players:Player[] = [];
        if(this.ws.readyState==1){
            this.ws.send(JSON.stringify(req));
            this.ws.onmessage = (e)=>{
                cc.log('get player');
                var msg = JSON.parse(e.data);
                for(let i=0;i<msg.length;++i){
                    players[i] = new Player();
                    players[i].Alive = msg[i].Alive;
                    players[i].Name = msg[i].Name;
                    players[i].Score = msg[i].Score;
                    players[i].ready = true;
                    //cc.log(players[i].Name);
                }
                return players;
            }
        }else{
            cc.log('get player failed');
            players[0].ready = false;
        }
        return null;
    }
    // onLoad () {}

    start () {

    }

    // update (dt) {}
}

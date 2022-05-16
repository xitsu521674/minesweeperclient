// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Board from "./Board";
import Player from "./Player";
const {ccclass, property} = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {
    
    @property(cc.Node)
    login:cc.Node = null;
    @property(cc.Node)
    camera:cc.Node = null;
    @property(cc.EditBox)
    ipbox:cc.EditBox = null;
    @property(cc.Node)
    connectBut:cc.Node = null;
    @property(cc.Node)
    connectFail:cc.Node = null;
    @property(cc.Label)
    connectLabel:cc.Label = null;
    @property(cc.Node)
    mainpage:cc.Node = null;
    @property(cc.Prefab)
    grid:cc.Prefab = null;
    
    
    @property(cc.Node)
    checknode:cc.Node = null;
    @property(cc.Node)
    cam:cc.Node = null;
    @property(cc.Node)
    canvas:cc.Node = null;

    @property(cc.Node)
    fathernode:cc.Node = null;
    @property(cc.Node)
    rankLabels:cc.Node = null;
    @property(cc.Node)
    leaderboard:cc.Node = null;

    @property(cc.Node)
    menu:cc.Node = null;
    @property(cc.Node)
    namebox:cc.Node = null;
    @property(cc.Node)
    namebtn:cc.Node = null;
    @property(cc.Label)
    status:cc.Label = null;
    @property(cc.Node)
    dead:cc.Node = null;
    @property(cc.AudioClip)
    missionfailed:cc.AudioClip = null
    @property(cc.Node)
    historybtn:cc.Node = null;
    @property(cc.Node)
    hist:cc.Node = null;
    @property(cc.Node)
    clshistory:cc.Node = null;
    @property(cc.Node)
    prebtn:cc.Node = null;
    @property(cc.Node)
    nxtbtn:cc.Node = null;
    @property(cc.Node)
    histLabels:cc.Node = null;
    @property(cc.Label)
    gidlabel:cc.Label = null;
    @property(cc.Node)
    prepage:cc.Node = null;
    @property(cc.Node)
    nxtpage:cc.Node = null;
    @property(cc.Node)
    hint:cc.Node = null;
    @property(cc.Node)
    fullplayerbtn:cc.Node = null;
    @property(cc.Node)
    closefullplayerbtn:cc.Node = null;
    @property(cc.Node)
    showfullplayer:cc.Node = null;
    @property(cc.Node)
    showplayernxtbtn:cc.Node = null;
    @property(cc.Node)
    showplayerprebtn:cc.Node = null;
    @property(cc.Node)
    showfullplayerlabels:cc.Node = null;
    @property(cc.Label)
    fullplayermodelabel:cc.Label = null;
    @property(cc.Node)
    fullplayerswitchmodebtn:cc.Node = null;
    @property(cc.Node)
    historyswitchmodebtn:cc.Node = null;
    @property(cc.Label)
    historyswitchlabel:cc.Label  = null;
    @property(cc.Node)
    chancefathernode:cc.Node = null;
    @property(cc.Prefab)
    chancelabel:cc.Prefab = null;
    @property(cc.Node)
    showchancebtn:cc.Node = null;
    @property(cc.Node)
    box:cc.Node = null;
    @property(cc.Label)
    boxlable:cc.Label = null;
    @property(cc.AudioClip)
    shoveling:cc.AudioClip = null;
    @property(cc.AudioClip)
    trigger:cc.AudioClip = null;
    @property(cc.AudioClip)
    explosion:cc.AudioClip = null;
    

    players:Player[] = [];
    rankplayer:Player[] = [];
    board:Board = null;
    grids:cc.Node[] = [];
    ws:WebSocket = null;
    nowplayerId:number = -1;
    clickflag:boolean = false;
    menuflag:boolean = false;
    closeflag:boolean = false;
    historyflag:boolean = false;
    colorarr:cc.Color [] = [];
    chancenodes:cc.Node [] = [];
    chancelabelpool:cc.NodePool = null;
    showchanceon:boolean = false;
    // LIFE-CYCLE CALLBACKS:

    
    showmessage(content:string){
        this.box.stopAllActions();
        this.box.position = cc.v3(0,200);
        this.box.opacity = 0;
        this.boxlable.string = content;
        this.box.active = true;
        cc.tween(this.box)
        .by(0.1,{position:cc.v3(0,200),opacity:255})
        .delay(1.5)
        .call(()=>{
            this.box.active = false;
        })
        .start();
    }
    onLoad () {
        this.chancelabelpool = new cc.NodePool();
        for(let i=0;i<1024;++i){
            this.chancelabelpool.put(cc.instantiate(this.chancelabel));
        }
        var ip:string;
        var addplayerflag = false;

        var exploringGID;
        var curPage;
        var pagesize = 15;
        var paglimright = 0;
        var fullGame;
        var historymode = 0;//0 for jointime 1 for rank
        var curGame;
        

        var level:number[] = [255,170,85,0];
        var tmpcolorarr:cc.Color[] = [];
        for(let i=0;i<4;++i){
            for(let j=0;j<4;++j){
                for(let l=0;l<4;l++){
                    tmpcolorarr[i*16+j*4+l] = cc.color(level[i],level[j],level[l]);
                }
            }
        }
        for(let i=0;i<64;++i){
            let row = Math.floor(i/4);
            let col = i%4;
            this.colorarr[i] = tmpcolorarr[col*16+row];
            //cc.log(col*16+row); 
        }
        
        var ranking = ()=>{
            curGame = JSON.parse(JSON.stringify(curGame))

            for(let i=0;i<curGame.Players.length-1;++i){
                for(let j=0;j<curGame.Players.length-1;++j){
                    if(curGame.Players[j].Score<curGame.Players[j+1].Score){
                        let tmp = curGame.Players[j];
                        curGame.Players[j] = curGame.Players[j+1];
                        curGame.Players[j+1] = tmp;
                    }
                }   
            }
        }

        this.showchancebtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(!this.showchanceon){
                this.showchanceon = true;
                
            }else{
                this.showchanceon = false;
            }
        },this)


        this.historyswitchmodebtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(historymode==0){
                this.historyswitchlabel.string = 'Sort by socre';
                historymode = 1;
                ranking();
                
            }else if(historymode==1){
                this.historyswitchlabel.string = 'Sort by jointime';
                historymode = 0;
                curGame = fullGame[exploringGID];
            }
            this.histLabels.removeAllChildren();
                for(let i=0+pagesize*curPage;i<pagesize+pagesize*curPage&&i<curGame.Players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.histLabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+curGame.Players[i].Name+'  '+curGame.Players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    newLabel.setPosition(0,-15-20*(i%pagesize));
                    newLabel.getComponent(cc.Label).fontSize = 15;
                }
        },this)
        
        this.prepage.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(curPage>0){
                curPage--;
                this.histLabels.removeAllChildren();
                for(let i=0+pagesize*curPage;i<pagesize+pagesize*curPage&&i<curGame.Players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.histLabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+curGame.Players[i].Name+'  '+curGame.Players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    newLabel.setPosition(0,-15-20*(i%pagesize));
                    newLabel.getComponent(cc.Label).fontSize = 15;
                }
            }
        },this)
        this.nxtpage.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(curPage<paglimright){
                curPage++;
                this.histLabels.removeAllChildren();
                for(let i=0+pagesize*curPage;i<pagesize+pagesize*curPage&&i<curGame.Players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.histLabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+curGame.Players[i].Name+'  '+curGame.Players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    newLabel.setPosition(0,-15-20*(i%pagesize));
                    newLabel.getComponent(cc.Label).fontSize = 15;
                }
            }
        },this)
        this.prebtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(exploringGID>0){
                exploringGID--;

                curGame = fullGame[exploringGID];
                if(historymode==1){
                    ranking();
                }
                this.gidlabel.string = 'Game     ' + exploringGID;
                curPage = 0;
                paglimright = Math.floor(curGame.Players.length/pagesize);
                this.histLabels.removeAllChildren();
                for(let i=0+pagesize*curPage;i<pagesize+pagesize*curPage&&i<curGame.Players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.histLabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+curGame.Players[i].Name+'  '+curGame.Players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    newLabel.setPosition(0,-15-20*(i%pagesize));
                    newLabel.getComponent(cc.Label).fontSize = 15;
                }
            }
        },this)
        this.nxtbtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(exploringGID<fullGame.length-1){
                exploringGID++;
                curGame = fullGame[exploringGID];
                if(historymode==1){
                    ranking();
                }
                cc.log(curGame.Players.length);
                this.gidlabel.string = 'Game     ' + exploringGID;
                curPage = 0;
                paglimright = Math.floor(curGame.Players.length/pagesize);
                this.histLabels.removeAllChildren();
                for(let i=0+pagesize*curPage;i<pagesize+pagesize*curPage&&i<curGame.Players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.histLabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+curGame.Players[i].Name+'  '+curGame.Players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    newLabel.setPosition(0,-15-20*(i%pagesize));
                    newLabel.getComponent(cc.Label).fontSize = 15;
                }
            }
        },this)
        this.historybtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            this.hist.active = true;

            let req = {
                Type:"get.history"
            }
            this.historyflag = true;
            this.ws.send(JSON.stringify(req));
            this.ws.onmessage = (e)=>{
                var msg = JSON.parse(e.data);
                //cc.log('長度:'+msg.length);
                if(msg.length==0){
                    this.gidlabel.string = 'No Game Record';
                }else{
                    fullGame = msg;
                    exploringGID = this.board.GID-1;
                    curGame = msg[exploringGID];
                    cc.log('測試:'+curGame);
                    //cc.log(curGame.Players.length);
                    this.gidlabel.string = 'Game     ' + exploringGID;
                    historymode = 0;
                    curPage = 0;
                    paglimright = Math.floor(curGame.Players.length/pagesize);
                    this.histLabels.removeAllChildren();
                    for(let i=0+pagesize*curPage;i<pagesize+pagesize*curPage&&i<curGame.Players.length;++i){
                        var newLabel = new cc.Node();
                        newLabel.setParent(this.histLabels);
                        newLabel.anchorX = 0;
                        newLabel.anchorY = 0;
                        newLabel.addComponent(cc.Label);
                        newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+curGame.Players[i].Name+'  '+curGame.Players[i].Score;
                        newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                        newLabel.setPosition(0,-15-20*(i%pagesize));
                        newLabel.getComponent(cc.Label).fontSize = 15;
                    }
                }
                
                this.historyflag = false;
            }

        },this)
        this.clshistory.on(cc.Node.EventType.MOUSE_DOWN,(()=>{
            this.hist.active = false;
        }),this)
        this.board = new Board();
        var connectPromise = ()=>{
            return new Promise((resolve,reject)=>{
                try{
                    this.ws = new WebSocket("wss://"+ip);
                    this.ws.onopen = (e)=>{
                        cc.log('connection open');
                        var connectimeout = setTimeout(()=>{
                            cc.log('connection overtime');
                            clearInterval(stableTimer);
                            reject('timeout');
                        },1100)
                        var stableTimer = setInterval(()=>{
                            if(this.ws.readyState==1){
                                cc.log('connection is stable');
                                clearTimeout(connectimeout);
                                clearInterval(stableTimer);
                                resolve('stable');
                            }
                        },100)
                    }
                }catch(ex){
                    cc.log('invalid connection');
                    reject('invalid connection');
                }
            })
        }

        var fullplayercurpage;
        var fullplayershowmode = 0;//0 for number 1 for rank

        this.fullplayerswitchmodebtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(fullplayershowmode==0){
                this.fullplayermodelabel.string = 'Sort by rank';
                fullplayershowmode = 1;
            }else if(fullplayershowmode==1){
                this.fullplayermodelabel.string = 'Sort by jointime';
                fullplayershowmode = 0;
            }
            let pageSize = 16;
            this.showfullplayerlabels.removeAllChildren();
            if(fullplayershowmode==0){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.players[i].Name+'  '+this.players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }else if(fullplayershowmode==1){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.rankplayer.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.rankplayer[i].Name+'  '+this.rankplayer[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }
        },this)




        this.fullplayerbtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            this.menuflag = true;
            this.showfullplayer.active = true;
            fullplayercurpage = 0;
            let pageSize = 16;
            this.showfullplayerlabels.removeAllChildren();
            if(fullplayershowmode==0){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.players[i].Name+'  '+this.players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }else if(fullplayershowmode==1){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.rankplayer.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.rankplayer[i].Name+'  '+this.rankplayer[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }
            

        },this)
        
        this.showplayerprebtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            if(fullplayercurpage>0){
                fullplayercurpage--;
                let pageSize = 16;
            this.showfullplayerlabels.removeAllChildren();
            if(fullplayershowmode==0){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.players[i].Name+'  '+this.players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }else if(fullplayershowmode==1){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.rankplayer.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.rankplayer[i].Name+'  '+this.rankplayer[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }
            }
        },this);


        this.showplayernxtbtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            let pageSize = 16;
            if(fullplayercurpage<3&&fullplayercurpage<Math.floor(this.players.length/pagesize)){
                fullplayercurpage++;
            this.showfullplayerlabels.removeAllChildren();
            if(fullplayershowmode==0){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.players.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.players[i].Name+'  '+this.players[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }else if(fullplayershowmode==1){
                for(let i=0+pageSize*fullplayercurpage;i<pageSize+pageSize*fullplayercurpage&&i<this.rankplayer.length;++i){
                    var newLabel = new cc.Node();
                    newLabel.setParent(this.showfullplayerlabels);
                    newLabel.anchorX = 0;
                    newLabel.anchorY = 0;
                    newLabel.addComponent(cc.Label);
                    newLabel.getComponent(cc.Label).string = '#'+(i+1)+'  '+this.rankplayer[i].Name+'  '+this.rankplayer[i].Score;
                    newLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    if(i%pageSize<(pageSize/2)){
                        newLabel.setPosition(-170,130-50*(i%pageSize));
                    }else{
                        newLabel.setPosition(15,130-50*(i%(pageSize/2)));
                    }
                    newLabel.getComponent(cc.Label).fontSize = 21;
                }
            }
            }
        },this)

        this.closefullplayerbtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            this.closeflag = true;
            this.showfullplayer.active = false;
        })













        var getboardPromise = ()=>{
           return new Promise((resolve,reject)=>{
                if(addplayerflag||this.clickflag||this.historyflag){
                    reject('add player is waiting');
                }else{
                    let req = {
                        "Type":"get.board"
                    }
                    this.ws.send(JSON.stringify(req));
                    this.ws.onmessage = (e)=>{
                        //cc.log('get board');
                        var msg = JSON.parse(e.data);
                        this.board.GID = msg.GID;
                        this.board.Height = msg.Height;
                        this.board.Width = msg.Width;
                        this.board.Playing = msg.Playing;
                        this.board.Client = msg.Client;
                        this.board.ready = true;
                        /*cc.log(this.board.GID);
                        cc.log(this.board.Height);
                        cc.log(this.board.Width);
                        cc.log(this.board.Playing);
                        cc.log(this.board.Client);*/
                        resolve('success');
                    }
                }
                
                         

           }) 
        }
        var getplayerPromise = ()=>{
            return new Promise((resolve,reject)=>{
                if(addplayerflag||this.clickflag||this.historyflag){
                    reject('add player is waiting');
                }else{
                    let req = {
                        "Type":"get.players"
                    }
                    this.ws.send(JSON.stringify(req));
                    this.ws.onmessage = (e)=>{
                        //cc.log('get player');
                        var msg = JSON.parse(e.data);
                        this.players = msg;
                        
                        resolve('success');
                    }
                }
                
                
            })
        }
        var addplayerPromise = ()=>{
            return new Promise((resolve,reject)=>{
                let req = {
                    Type: "action.join",
                    Name: ""+this.namebox.getComponent(cc.EditBox).string
                }
                addplayerflag = true;
                this.ws.send(JSON.stringify(req));
                this.ws.onmessage = (e)=>{
                    cc.log('add player return');
                    var msg = JSON.parse(e.data);
                    addplayerflag = false;
                    switch(msg.Code){
                        case 0:
                            this.nowplayerId = msg.Pid;
                            resolve('success');
                            break;
                        case 1:
                            this.showmessage('name already used');
                            //alert('name already used');
                            break;
                        case 2:
                            this.showmessage('current players is full');
                            //alert('current players is full');
                            break;
                        case 3:
                            this.showmessage('game players is full');
                            //alert('game players is full');
                            break;
                        case 4:
                            this.showmessage('already in the game');
                            //alert('already in the game');
                            break;
                    }
                    reject('add player failed');
                }
            })
        }
        this.mainpage.once(cc.Node.EventType.MOUSE_DOWN,()=>{
            this.login.active = true;
            this.hint.active = false;
            this.connectBut.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                this.connectLabel.string = 'Connecting...';
                ip = this.ipbox.string;
                cc.log(ip);
                
                connectPromise()
                .then(getboardPromise)
                .then(getplayerPromise)
                .then(()=>{

                    this.createboard();

                    this.updateRank();
                    this.checknode.on('touchmove', function (event:cc.Event.EventTouch) {

                        var delta = event.touch.getDelta();
                        if(this.cam.x-delta.x>=2640&&this.cam.x-delta.x<=3408){
                            this.cam.x -= delta.x;
                        }
                        if(this.cam.y-delta.y>=450&&this.cam.y-delta.y<=1598){
                            this.cam.y -= delta.y;
                        }
                        
                
                    }, this);
                    this.scheduleOnce(()=>{
                        this.leaderboard.active = true;
                        this.cam.position = new cc.Vec3(2640,450,0);
                        this.menu.active = true;
                        cc.log('move cam');
                    },1);
                    setInterval(()=>{
                        getboardPromise().then(getplayerPromise)
                        .then(()=>{
                            this.updateboard();
                            this.updateRank();
                        })
                        .catch((ex)=>{
                            cc.log(ex);
                        })
                    },500)

                    this.namebtn.on(cc.Node.EventType.MOUSE_DOWN,()=>{
                        addplayerPromise().then(()=>{
                            cc.log('add player success');
                        })
                        .catch((ex)=>{
                            cc.log(ex);
                        })
                    },this);
                })
                .catch((res)=>{
                    cc.log('catch:'+res);
                    this.connectFail.active = true;
                    this.scheduleOnce(()=>{
                        this.connectFail.active = false;
                        this.connectLabel.string = 'Connect';
                    },1)
                })
                
            },this)  
        },this);        
        
    }
    createboard(){
        
        var strX = 2000;
        var strY = 0;
        var size = 32;
        
        for(let i=0;i<this.board.Client.length;++i){
                let newgrid = cc.instantiate(this.grid);
                this.grids[i] = newgrid;
                newgrid.setParent(this.fathernode);
                newgrid.position = new cc.Vec3(strX+size*Math.floor(i/this.board.Height),strY+size*(i%this.board.Width),0);
                newgrid.on(cc.Node.EventType.MOUSE_DOWN,(event:cc.Event.EventMouse)=>{
                    let com = newgrid.getComponent('Grid');
                    com.last  = event.getLocation();
                },this)
                newgrid.on(cc.Node.EventType.MOUSE_UP,(event:cc.Event.EventMouse)=>{

                    
                                                
                    
                    let com = newgrid.getComponent('Grid');
                    let pos:cc.Vec2 = event.getLocation();
                    
                    if(this.menuflag){
                        if(this.closeflag){
                            this.menuflag = false;
                            this.closeflag = false;
                        }
                        return;
                    }

                    if(com.last!=null&&com.last.x==pos.x&&com.last.y==pos.y){
                        if(this.board.Client[com.id]%10==-1){
                            let req = null;
                            if(event.getButton()==cc.Event.EventMouse.BUTTON_LEFT){
                                req = {
                                    Type: "action.click", // Request type
                                    Index: com.id,         // Element index of game array
                                    Flag: false    // false: normal click, true: set up flag                           
                                }
                            }else if(event.getButton()==cc.Event.EventMouse.BUTTON_RIGHT){
                                req = {
                                    Type: "action.click", // Request type
                                    Index: com.id,         // Element index of game array
                                    Flag: true       // false: normal click, true: set up flag                           
                                }
                            }
                            this.ws.send(JSON.stringify(req));
    
                            //cc.log('send');
                            this.clickflag = true;
                            this.ws.onmessage = (e)=>{
                                //cc.log('click return');
                                var msg = JSON.parse(e.data);
                                this.clickflag = false;
                                switch(msg.Code){
                                    case 0:
                                        cc.audioEngine.play(this.shoveling,false,0.2);
                                        switch(msg.Score){
                                            case -1:
                                                /*var to1 = setTimeout(() => {
                                                    cc.audioEngine.play(this.trigger,false,0.3);
                                                }, 1);*/
                                                var to2 = setTimeout(() => {
                                                    cc.audioEngine.play(this.explosion,false,0.1);
                                                }, 1);
                                                setTimeout(() => {
                                                    this.dead.active = true;
                                                    cc.audioEngine.play(this.missionfailed,false,0.05);
                                                    this.dead.once(cc.Node.EventType.MOUSE_DOWN,()=>{
                                                        this.dead.active = false;
                                                        clearTimeout(to2);
                                                        cc.audioEngine.stopAll();
                                                    },this)
                                                }, 2);
                                                
                                                break;
                                            case 0:
                                                this.showmessage('click failed');
                                                //alert('click failed');
                                                break;
                                            default:
                                                let floattext = new cc.Node();
                                                floattext.addComponent(cc.Label);
                                                floattext.getComponent(cc.Label).string = '+'+msg.Score;
                                                floattext.color = cc.Color.BLUE;
                                                floattext.getComponent(cc.Label).fontSize = 30;
                                                floattext.color = cc.Color.BLACK;
                                                floattext.setParent(newgrid);
                                                floattext.group = 'effect';
                                                floattext.setPosition(0+(event.getLocation().x%32),-8+(event.getLocation().y%32));
                                                cc.tween(floattext)
                                                .by(3,{position:cc.v3(0,100,0),opacity:-255})
                                                .call(()=>{
                                                    floattext.destroy();
                                                }).start();                                                
                                                cc.log('得分:'+msg.Score);
                                        }
                                        break;
                                    case 1:
                                        this.showmessage('has been clicked');
                                        //alert('has been clicked');
                                        break;
                                    case 2:
                                        this.showmessage('you are dead');
                                        //alert('you are dead');
                                        break;
                                    case 3:
                                        this.showmessage('have not join the game');
                                        //alert('have not join the game');
                                        break;
                                    case 4:
                                        this.showmessage('game hasn\'t start');
                                        //alert('game hasn\'t start');
                                        break;
                                }
                            }                         
                            
                        }
                    }
                    
                    
                },this)

                let com = newgrid.getComponent('Grid');
                com.id = i;
                //cc.log(com.id);
                //cc.log(this.grids[i*64+j].getComponent('Grid').id);
                let col = Math.floor(this.board.Client[i]/10);
                if(col==-1){
                    com.setStatus(this.board.Client[i]%10,cc.Color.WHITE);    
                }else{
                    com.setStatus(this.board.Client[i]%10,this.colorarr[col]);
                }
                
            
        }
        cc.log('creat finish');
    }
    updateboard(){
        var child = this.fathernode.children;
        var hasunfinedbomb:number[] = [];
        var chanceofbomb:number[] = [];
        var shouldshowchance:number[] = [];
        var definitelyhasbomb:number[] = [];
        var safegrid:number[] = [];//安全格
        if(typeof(child)=="undefined"){
            cc.log('取得所有格子失敗');
        }else{
            for(let i=0;i<this.board.Client.length;++i){
                chanceofbomb[i] = 0;
                shouldshowchance[i] = 0;
                definitelyhasbomb[i] = 0;
                safegrid[i] = 0;
            }
            for(let i=0;i<this.board.Client.length;++i){//計算數字格炸彈是否全出
                let val = this.board.Client[i]%10;
                let around:number[] = [-63,-64,-65,-1,1,63,64,65];
                if((val!=-1)&&(val!=9)){//必須是數字格 計算該數字格炸彈是否全出現
                    let sum = 0;
                    let blank = 0;
                    for(let j=0;j<around.length;++j){
                        let pos = i+around[j]
                        if(pos<4096&&pos>=0){
                            let num = this.board.Client[pos]%10;
                            if(num==9){
                                sum++;
                            }else if(num==-1){
                                blank++;
                            }
                        }
                    }
                    if(sum==val){//出現的地雷數夠 剩餘未開安全
                        for(let j=0;j<around.length;++j){
                            let pos = i+around[j]
                            if(pos<4096&&pos>=0){
                                let num = this.board.Client[pos]%10;
                                if(num==-1){
                                    safegrid[pos] = 1;
                                }
                            }
                            
                        }
                    }else if(blank==(val-sum)){//剩餘未開等於剩餘地雷數 必中
                        for(let j=0;j<around.length;++j){
                            let pos = i+around[j]
                            if(pos<4096&&pos>=0){
                                let num = this.board.Client[pos]%10;
                                if(num==-1){
                                    definitelyhasbomb[pos] = 1;
                                }
                            }
                            
                        }
                    }else{
                        for(let j=0;j<around.length;++j){
                            let pos = i+around[j]
                            if(pos<4096&&pos>=0){
                                let num = this.board.Client[pos]%10;
                                if(num==-1){
                                    //cc.log('test');
                                    chanceofbomb[pos] += 1/8;
                                }
                            }
                            
                        }
                    }
                }else if(val==-1){
                    let showcount:number = 0;
                    for(let j=0;j<around.length;++j){
                        let pos = i+around[j]
                        if(pos<4096&&pos>=0){
                            let num = this.board.Client[pos]%10;
                            if(num==-1){
                                chanceofbomb[pos] += 1/16;
                            }else{
                                //cc.log('test');
                                showcount++;
                            }                        
                        } 
                    }
                    if(showcount>0){
                        shouldshowchance[i] = 1;
                    }
                }
            }


            for(let i=0;i<child.length;++i){
                let com = child[i].getComponent('Grid');
                let col = Math.floor(this.board.Client[com.id]/10);
                let val = this.board.Client[com.id]%10;
                    if(col==-1){
                        if(!this.showchanceon||shouldshowchance[i]==0){
                            com.setStatus(val,cc.Color.WHITE,chanceofbomb[i],false);                            
                        }else if(this.showchanceon){
                            if(safegrid[i]){
                                com.setStatus(val,cc.Color.WHITE,0,true);                            
                            }else if(definitelyhasbomb[i]){
                                com.setStatus(val,cc.Color.WHITE,100,true);                            
                            }else{
                                com.setStatus(val,cc.Color.WHITE,Math.floor(chanceofbomb[i]*100),true);                            
                            }
                        }
                    }else{
                        com.setStatus(val,this.colorarr[col],0,false);
                    }
            }
        }
        
    }

    updateRank(){

        let rankplayerid:number [] = [];
        this.rankplayer =[];
            for(let i=0;i<this.players.length;++i){
                this.rankplayer.push(this.players[i]);
                rankplayerid.push(i);
            }
            for(let i=0;i<this.rankplayer.length-1;++i){
                for(let j=0;j<this.rankplayer.length-1;++j){
                    if(this.rankplayer[j].Score<this.rankplayer[j+1].Score){
                        let tmp = this.rankplayer[j];
                        this.rankplayer[j] = this.rankplayer[j+1];
                        this.rankplayer[j+1] = tmp;
                        let tmpnum = rankplayerid[j];
                        rankplayerid[j] = rankplayerid[j+1];
                        rankplayerid[j+1] = tmpnum;
                    }
                }   
            }
        if(this.nowplayerId!=-1){
            
            var rank = -1;
            for(let i=0;i<this.rankplayer.length;++i){
                if(this.rankplayer[i].Name==this.players[this.nowplayerId].Name){
                    rank = i+1;
                    break;
                }
            }
            //cc.log('update status');
            this.status.node.color = cc.Color.BLACK;
            this.status.string = "Your name:" + this.players[this.nowplayerId].Name
                                +"\nYour score:" + this.players[this.nowplayerId].Score
                                +"\nYour rank:" + rank + " of " + this.players.length;
            //cc.log('status finished');
        }
        var labels = this.rankLabels.children;
        for(let i=0;i<labels.length;++i){
            let com:cc.Label = labels[i].getComponent(cc.Label);
            com.string = ' ';
        }
        for(let i=0;i<labels.length&&i<this.rankplayer.length;++i){
            labels[i].color = this.colorarr[rankplayerid[i]];
            labels[i].getComponent(cc.Label).string = '#'+(i+1)+'  '+this.rankplayer[i].Name+'  '+this.rankplayer[i].Score;
        } 
    }
    updateStatus(){
        
    }

    
    

    // update (dt) {}
}

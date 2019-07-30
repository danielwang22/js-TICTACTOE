//棋格DOM元素
var checker = document.querySelectorAll('.checker');

class chess{
    constructor(){

        //選擇角色
        this.player = '';
        this.enemy = '';
        //棋盤格局
        this.position = [0,1,2,3,4,5,6,7,8];
        this.playerPosition = [];
        this.enemyPosition = [];
        this.lastIndex = 0;
        //勝利結果
        this.playerRes = false;
        this.enemyRes = false;
        //分數
        this.Score = {player:0,enemy:0}
        //讀取紀錄&儲存紀錄
        this.history = this.GetlocalStorage;
        if(this.history.length != 0) this.inithistory();
        //背景變黑
        $('body').css('backgroundColor','black');
        //主遊戲畫面
        $('#started')
        .addClass('d-none')
        .css('opacity',0)

        $('#role-choice')
        .addClass('d-none')
        .css('opacity',0)
    }
    //更新棋盤剩下的位置，給對手參考
    set Setposition(num) { return this.position.splice(num,1)}
    get Getposition() {return this.position}
    //玩家下的棋位
    set SetplayerPosition(num) { return this.playerPosition.push(num)}
    get GetplayerPosition() { return this.playerPosition }
    //對手下的棋位
    set SetenemyPosition(num) { return this.enemyPosition.push(num)}
    get GetenemyPosition() { return this.enemyPosition }
    //隨機位置
    get RandomPosition() { return Math.floor(Math.random() * (this.Getposition.length + 1)) }
    //存到localStorage
    set SetlocalStorage(data) { return localStorage.setItem("Score",JSON.stringify(data)) }
    get GetlocalStorage() { return JSON.parse(localStorage.getItem("Score")) || [] }
    playchess(){
        checker.forEach((element) => {
            $(`.${element.classList[0]}`).click(event=>{
                //避免重複事件
                if(event.target.innerHTML.length != 0) return false;
                //避免累加棋子上去
                if(event.target == element){
                    event.target.innerHTML = `<div class="fight-${this.player}-fill"></div>`

                    //player turn
                    this.playerTurn();

                    //enemy turn
                    this.enemyTurn();
                }
                //兩者都未勝出，棋盤也滿了，平局
                if(this.playerRes == false && this.enemyRes == false && this.Getposition.length == 0){
                    this.winner('draw');
                }
            })
        });
    }
    playerTurn(){
        //text YOU TURN!!
        $('#turn').text('YOU TURN!!')
        //更新棋盤剩下位置
        let index = this.Getposition.indexOf(parseFloat(event.target.dataset.index));
        this.Setposition = index;
        //更新選手下的位置
        this.SetplayerPosition = parseFloat(event.target.dataset.index);
        //湊滿三個，裁判會不會贏
        if(this.GetplayerPosition.length >= 3){
            //玩家方
            //我的裁判是抓取陣列裡其中一個數字當基準，判斷這個陣列裡是否有跟他相對應勝利的組合
            //所以要跑回圈，檢查每一個數字
            this.GetplayerPosition.forEach((element,index,array)=>{
                this.judgment(array,array[index],'playerRes')
            })
        }
        //玩家勝利
        if(this.playerRes == true){
            alert('玩家勝利');
            //總分++
            this.Score.player++;
            //印出總分
            $(`#${this.player}-score`).text(`${this.Score.player < 10 ? `0${this.Score.player}` : this.Score.player}`)
            //顯示勝利換面
            this.winner(this.player);
            return;
        }
    }
    enemyTurn(){
        //text ENEMY TURN!!
        $('#turn').text('ENEMY TURN!!')
        //更新對手角色，與玩家相反就對了
        this.enemy = this.player == 'circle' ? 'corss' : 'circle';
        //隨機取位置
        let index = this.RandomPosition;
        //與上次位置相同，在一次
        if(this.lastIndex == index){
            console.log('same');
            this.lastIndex = Math.floor(Math.random() * (this.Getposition.length + 1));
        }
        //與玩家位置相同，再取一次
        if(this.GetplayerPosition.includes(index)){
            this.lastIndex = Math.floor(Math.random() * (this.Getposition.length + 1));
        }else{
            //都沒有相同通過
            this.lastIndex = index;
        }
        //印出圖案
        checker[parseFloat(this.lastIndex)].innerHTML = `<div class="fight-${this.enemy}-fill"></div>`;
        //更新棋盤剩下位置
        this.Setposition = this.lastIndex;
        //更新對手位置
        this.SetenemyPosition = this.lastIndex;
        //console.log(this.Getposition);

        if(this.GetenemyPosition.length >= 3){
            //對手方
            //我的裁判是抓取陣列裡其中一個數字當基準，判斷這個陣列裡是否有跟他相對應勝利的組合
            //所以要跑回圈，檢查每一個數字
            this.GetenemyPosition.forEach((element,index,array)=>{
                this.judgment(array,array[index],'enemyRes')
            })
        }
        //對手勝利
        if(this.enemyRes == true){
            alert('對手勝利');
            //總分++
            this.Score.enemy++;
            //印出總分
            $(`#${this.enemy}-score`).text(`${this.Score.enemy < 10 ? `0${this.Score.enemy}` : this.Score.enemy}`)
            //顯示勝利換面
            this.winner(this.enemy);
            return;
        }
    }
    //裁判輸贏
    judgment(pieces,reference,res){
        //透過switch抓出基準數
        switch(reference){
            case 0:
                let a0 = pieces.includes(3) ? (pieces.includes(6) ? true : false ) : false ;
                let b0 = pieces.includes(1) ? (pieces.includes(2) ? true : false ) : false ;
                let c0 = pieces.includes(4) ? (pieces.includes(8) ? true : false ) : false ;
                this[res] =  (a0 || b0 || c0);
                console.log(`${reference}`);
                console.log(a0 || b0 || c0);
                break;
            case 1:
                let a1 = pieces.includes(4) ? (pieces.includes(7) ? true : false ) : false ;
                let b1 = pieces.includes(0) ? (pieces.includes(2) ? true : false ) : false ;
                this[res] =  (a1 || b1);
                console.log(`${reference}`);
                console.log(a1 || b1);
                break;
            case 2:
                let a2 = pieces.includes(0) ? (pieces.includes(1) ? true : false ) : false ;
                let b2 = pieces.includes(5) ? (pieces.includes(8) ? true : false ) : false ;
                let c2 = pieces.includes(4) ? (pieces.includes(6) ? true : false ) : false ;
                this[res] =  (a2 || b2 || c2);
                console.log(`${reference}`);
                console.log(a2 || b2 || c2);
                break;
            case 3:
                let a3 = pieces.includes(0) ? (pieces.includes(6) ? true : false ) : false ;
                let b3 = pieces.includes(4) ? (pieces.includes(5) ? true : false ) : false ;
                this[res] =  (a3 || b3);
                console.log(`${reference}`);
                console.log(a3 || b3);
                break;
            case 4:
                let a4 = pieces.includes(1) ? (pieces.includes(7) ? true : false ) : false ;
                let b4 = pieces.includes(3) ? (pieces.includes(5) ? true : false ) : false ;
                let c4 = pieces.includes(6) ? (pieces.includes(2) ? true : false ) : false ;
                let d4 = pieces.includes(0) ? (pieces.includes(8) ? true : false ) : false ;
                this[res] =  (a4 || b4 || c4 || d4);
                console.log(`${reference}`);
                console.log(a4 || b4 || c4 || d4);
                break;
            case 5:
                let a5 = pieces.includes(2) ? (pieces.includes(8) ? true : false ) : false ;
                let b5 = pieces.includes(4) ? (pieces.includes(3) ? true : false ) : false ;
                this[res] =  (a5 || b5);
                console.log(`${reference}`);
                console.log(a5 || b5);
                break;
            case 6:
                let a6 = pieces.includes(4) ? (pieces.includes(2) ? true : false ) : false ;
                let b6 = pieces.includes(3) ? (pieces.includes(0) ? true : false ) : false ;
                let c6 = pieces.includes(7) ? (pieces.includes(8) ? true : false ) : false ;
                this[res] =  (a6 || b6 || c6);
                console.log(`${reference}`);
                console.log(a6 || b6 || c6);
                break;
            case 7:
                let a7 = pieces.includes(6) ? (pieces.includes(8) ? true : false ) : false ;
                let b7 = pieces.includes(4) ? (pieces.includes(1) ? true : false ) : false ;
                this[res] =  (a7 || b7);
                console.log(`${reference}`);
                console.log(a7 || b7);
                break;
            case 8:
                let a8 = pieces.includes(7) ? (pieces.includes(6) ? true : false ) : false ;
                let b8 = pieces.includes(5) ? (pieces.includes(3) ? true : false ) : false ;
                let c8 = pieces.includes(4) ? (pieces.includes(0) ? true : false ) : false ;
                this[res] =  (a8 || b8 || c8);
                console.log(`${reference}`);
                console.log(a8 || b8 || c8);
                break;
            default:
                console.log('judge time')
                break;
        }
    }
    //顯示勝利畫面
    winner(who){
        $('#checker-board')
        .addClass('fadeOut d-none')
        .css('opacity',0)

        $(`#${who}-winner`)
        .removeClass('d-none')
        .addClass('fadeIn')
        .css('opacity',1);

    }
    //結果初始化
    restart(){
        this.position = [0,1,2,3,4,5,6,7,8]
        this.playerPosition = [];
        this.enemyPosition = [];
        this.playerRes = false;
        this.enemyRes = false;
        checker.forEach(element => {
            element.innerHTML = '';
        });
        //畫面回棋盤
        $('#checker-board')
        .removeClass('d-none fadeOut')
        .addClass('fadeIn')
        .css('opacity',1)

        $(`#circle-winner`)
        .removeClass('fadeIn')
        .addClass('d-none')

        $(`#corss-winner`)
        .removeClass('fadeIn')
        .addClass('d-none')

        $(`#draw-winner`)
        .removeClass('fadeIn')
        .addClass('d-none')
    }
    //初始更新上次分數
    inithistory(){
        this.GetlocalStorage.forEach(element => {
            //再table裡加入時間與分數
            let tr = document.createElement('tr')
            let td1 = document.createElement('td')
            let td2 = document.createElement('td')
            let td3 = document.createElement('td')

            td1.className = 'font-size-xxs text-center p-1';
            td2.className = 'font-size-xxs text-center p-1';
            td3.className = 'font-size-xxs text-center p-1';

            td1.textContent = element.date;
            td2.textContent = element.player;
            td3.textContent = element.enemy;

            document.getElementById('score').appendChild(tr);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
        });
    }
    //後來加入的分數
    addhistory(score){
        //新增時間
        let d = new Date();
        let now = d.toLocaleDateString("en-US")

        //再table裡加入時間與分數
        let tr = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')

        td1.className = 'font-size-xxs text-center p-1';
        td2.className = 'font-size-xxs text-center p-1';
        td3.className = 'font-size-xxs text-center p-1';

        td1.textContent = now;
        td2.textContent = score.player;
        td3.textContent = score.enemy;

        document.getElementById('score').appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        //先丟到歷史戰績
        this.history.push({
            date: now,
            player:score.player,
            enemy:score.enemy
        })
        //在上傳到localStorage
        this.SetlocalStorage = this.history;
    }
}


//chess實體
const a = new chess();
//開始鍵
$('#game-start').click(() =>{
    $('#initialization')
    .addClass('fadeOut')
    .delay(600)
    .addClass('d-none')

    $('#role-choice')
    .delay(500)
    .removeClass('d-none')
    .addClass('fadeIn')
    .css('opacity',1)
    
})
//選擇角色
$('#role-choice').click(event =>{
    $('#role-choice')
    .addClass('fadeOut')
    .delay(600)
    .addClass('d-none')

    $('body').css('backgroundColor','#FF6D70')

    $('#started')
    .delay(500)
    .removeClass('d-none')
    .addClass('fadeIn')
    .css('opacity',1)

    //拆解class名稱，成circle、corss
    let className = event.target.classList[0];
    let piece = className.split(/\-/);

    a.player = piece[1];
    a.playchess(piece[1]);

})
//結束遊戲
$('#endGame').click(()=>{
    a.addhistory(a.Score);
    a.restart();
    a.player = '';
    a.enemy = '';

    $('body').css('backgroundColor','black')

    $('#started')
    .addClass('d-none')
    .css('opacity',0)

    $('#role-choice')
    .delay(500)
    .removeClass('d-none fadeOut')
    .addClass('fadeIn')
    .css('opacity',1)
})
//結束回合
$('#restart').click(()=>{
    //初始所有值
    a.restart()
})


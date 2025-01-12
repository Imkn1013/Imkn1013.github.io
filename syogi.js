console.log("ok3");
console.log(who_host);
document.getElementById("menu").style.display="none";
document.getElementById("setting").style.display="none";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let size=Math.min(window.innerWidth,window.innerHeight*(878/960))/439;
canvas.width = size*439;
canvas.height = size*480;
const ctx = canvas.getContext('2d');

//windowのサイズ変更に対応
window.addEventListener('resize', function(){
  size=Math.min(window.innerWidth,window.innerHeight*(878/960))/439;
  canvas.width = size*439;
  canvas.height = size*480;
  draw();
});

let turn=false;
if(who_host==socket.id){
  turn=true;
}

//データ送受信関数
let serve=[[],[],[],[],[],[],[],[],[]];
const send=function(){
  for(let i=0;i<9;i++){
    serve[i]=field[9-i].reverse();
  }
  for(let i=0;i<9;i++){
  for(let k=0;k<9;k++){
   if(serve[i][k]!=="n" && /^[a-z]+$/g.test(serve[i][k])==true){
     serve[i][k]=serve[i][k].toUpperCase();
   }else{
     serve[i][k]=serve[i][k].toLowerCase();
   }
  }
  }
  socket.emit("field",serve);
  turn=false;
};

socket.on("field",function(){
  turn=true;
});

//初期値設定
let field=[["L","K","S","G","E","G","S","K","L"],
           ["n","R","n","n","n","n","n","B","n"],
           ["P","P","P","P","P","P","P","P","P"],
           ["n","n","n","n","n","n","n","n","n"],
           ["n","n","n","n","n","n","n","n","n"],
           ["n","n","n","n","n","n","n","n","n"],
           ["p","p","p","p","p","p","p","p","p"],
           ["n","b","n","n","n","n","n","r","n"],
           ["l","k","s","g","e","g","s","k","l"]];
let redline=null;
let movepoint=null;
const canmove={
  "p":[-9]
};


//画像読み込み
const a="./syogi_koma/";
const b=".png";
let part1,part2,part3,address,last;

const mkaddress=function(name1,name2){
  name1.forEach(function(item, index){
  if (item.substr(item.length - 1, 1) == "p") {
    last = 2;
    part2 = "prom_";
  } else {
    last = 1; 
    part2 = "";
  }
  if (item.substr(item.length - last, 1) == "1") {
    part1 = "white_";
  } else {
    part1 = "black_";
  }
  part3 = item.substr(0, item.length - last);
  address = a + part1 + part2 + part3 + b;
  name2[index].src = address;
});

};

const bord=new Image();
bord.src="./syogi_koma/syogiban.png";
const  lance1=new Image(), lance2=new Image(), knight1=new Image(), knight2=new Image(), silver1=new Image(),
  silver2=new Image(),gold1=new Image(), gold2=new Image(),emperor1=new Image(), emperor2=new Image(), pawn1=new Image(),
  pawn2=new Image(),bishop1=new Image(), rook1=new Image(), bishop2=new Image(), rook2=new Image(),lance1p=new Image(),
  lance2p=new Image(),knight1p=new Image(), knight2p=new Image(), silver1p=new Image(), silver2p=new Image(),
  pawn1p=new Image(), pawn2p=new Image(),dragon1=new Image(), horse1=new Image(), dragon2=new Image(), horse2=new Image();

mkaddress([
  "lance1","lance2","knight1","knight2","silver1","silver2","gold1","gold2","king1","king2","pawn1","pawn2",
  "bishop1","rook1","bishop2","rook2","lance1p","lance2p","knight1p","knight2p","silver1p","silver2p","pawn1p","pawn2p","dragon1","horse1","dragon2","horse2"
  ],[
  lance1,lance2,knight1,knight2,silver1,silver2,gold1,gold2,emperor1,emperor2,pawn1,pawn2,
  bishop1,rook1,bishop2,rook2,lance1p,lance2p,knight1p,knight2p,silver1p,silver2p,pawn1p,pawn2p,dragon1,horse1,dragon2,horse2
]);

//描画関数
const trans = {
  "L": lance1, "K": knight1, "S": silver1, "G": gold1, "E": emperor1, "R": rook1, "B": bishop1, "P": pawn1, "D": dragon1, "H": horse1, "T": pawn1p, "X": lance1p, "Y": knight1p, "Z": silver1p,
  "l": lance2, "k": knight2, "s": silver2, "g": gold2, "e": emperor2, "r": rook2, "b": bishop2, "p": pawn2, "d": dragon2, "h": horse2, "t": pawn2p, "x": lance2p, "y": knight2p, "z": silver2p,
  "n": null
};
ctx.strokeStyle = "red";
const draw=function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.drawImage(bord, 0, 0, 439*size, 480*size);
  for(let i=0;i<9;i++){
    for(let k=0;k<9;k++){
    if(field[i][k]!=="n"){
    ctx.drawImage(trans[field[i][k]],size*(48*k+7),size*((473/9)*i+7),size*(48),size*(473/9));
    }
    }
  }
  if(redline!==null){
    ctx.lineWidth = 2*size;
    ctx.rect((7+48*redline[0]+1.5)*size, (7+(473/9)*redline[1]+1.5)*size,(48-3)*size, ((473/9)-3)*size);
    ctx.stroke();
  }
};

//クリックイベント
let rect, x, y;
let moveok=false;
canvas.addEventListener('click', (event) => {
  if(turn==true){
    rect = canvas.getBoundingClientRect();
    x = Math.floor((event.clientX - rect.left-7) / (size*(48)));
    y = Math.floor((event.clientY - rect.top-7) / (size*(473/9)));
    moveok=false;
    if(redline!==null){
    canmove[field[redline[1]][redline[0]]].forEach(function(value){
      if(redline[1]*9+redline[0]+value==9*y+x){
        moveok=true;
      }
    });
    };
    if(redline!==null&&(redline[0]==x&&redline[1]==y)){
      redline=null;
    }else if(field[y][x]!=="n" && /^[a-z]+$/g.test(field[y][x])==true){
      redline=[x,y];
    }else if(moveok==true){
      //fieldの更新
      field[y][x]=field[redline[1]][redline[0]];
      field[redline[1]][redline[0]]="n";
      redline=null;
      send();
    }else{
      redline=null;
    }
    draw();
  }
});

bord.onload = () => {
draw();
};

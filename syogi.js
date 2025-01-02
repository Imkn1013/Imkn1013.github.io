console.log("ok3");
console.log(who_host);
document.getElementById("menu").style.display="none";
document.getElementById("setting").style.display="none";
var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

//データ送受信関数
const send=function(){
  socket.emit("field",field);
};

socket.on("field",function(){
  
});

//初期値設定
let field="LKSGEGSKLnRnnnnnBnPPPPPPPPPnnnnnnnnnnnnnnnnnnnnnnnnnnnpppppppppnbnnnnnrnlksgegskl";

//画像読み込み
const a="./syogi_koma/";
const b=".png";
let part1,part2,part3,address,last;
const mkaddress=function(name1,name2){
 name1.forEach(function(index){
  if(name1[index].substr(name1[index].length-1,1)=="p"){
    last=2;
    part2="prom_";
  }else{
    last=1; 
    part2="";
  }
  if(name1[index].substr(name1[index].length-last,1)=="1"){
    part1="white_";
  }else{
    part1="black_";
  }
  part3=name1[index].substr(0,name1[index].length-last);
  address=a+part1+part2+part3+b;
  name2[index].src=address;
 });};
const bord=new Image();
bord.src="./syogi_koma/syogiban.png";
const  lance1=new Image(), lance2=new Image(), knight1=new Image(), knight2=new Image(), silver1=new Image(),
  silver2=new Image(),gold1=new Image(), gold2=new Image(),emperor1=new Image(), emperor2=new Image(), pawn1=new Image(),
  pawn2=new Image(),bishop1=new Image(), rook1=new Image(), bishop2=new Image(), rook2=new Image(),lance1p=new Image(),
  lance2p=new Image(),knight1p=new Image(), knight2p=new Image(), silver1p=new Image(), silver2p=new Image(),
  pawn1p=new Image(), pawn2p=new Image(),dragon1=new Image(), horse1=new Image(), dragon2=new Image(), horse2=new Image();

mkaddress([
  "lance1","lance2","knight1","knight2","silver1","silver2","gold1","gold2","king1","king2","pown1","pown2",
  "bishop1","rook1","bishop2","rook2","lance1p","lance2p","knight1p","knight2p","silver1p","silver2p","porn1p","porn2p","dragon1","horse1","dragon2","horse2"
  ],[
  lance1,lance2,knight1,knight2,silver1,silver2,gold1,gold2,emperor1,emperor2,pawn1,pawn2,
  bishop1,rook1,bishop2,rook2,lance1p,lance2p,knight1p,knight2p,silver1p,silver2p,porn1p,porn2p,dragon1,horse1,dragon2,horse2
]);

//描画関数
const trans={
  "L":lance1,"K":knight1",S":silver1","G":gold1","E":emperor1,"R":rook1,"B":bishop1,"P":pawn1,"D":dragon1,"H":horse1,"T":pawn1p,"X":lance1p,"Y":knight1p,"Z":silver1p,
  "l":lance2,"k":knight2","s":silver2","g":gold2","e":emperor2,"r":rook2,"b":bishop2,"p":pawn2,"d":dragon2,"h":horse2,"t":pawn2p,"x":lance2p,"y":knight2p,"z":silver2p,
  "n":null
};

const draw=function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.drawImage(bord, 0, 0, 439, 480);
  for(let i=0;i<81;i++){
    ctx.drawImage(trans.field.substr(i,1),47.35*i%9+7,51.9*((i-i%9)/9)+7,47.35,51.9);
  }
};

//クリックイベント
const rect,x,y;
canvas.addEventListener('click', (event) => {
    rect = canvas.getBoundingClientRect();
    x = Math.floor((event.clientX - rect.left)/47.35);
    y = Math.floor((event.clientY - rect.top)/51.9);
    draw();
};

bord.onload = () => {
ctx.drawImage(bord, 0, 0, 439, 480);
};

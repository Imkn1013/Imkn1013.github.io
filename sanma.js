socket.emit("sanma_open");
socket.on("sanma_start",function(data){
  document.getElementById("menu").style.display="none";
  document.getElementById("setting").style.display="none";
  var canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const pai=new Image();
  pai.src="pai.png";
});

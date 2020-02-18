var grid=20,wall=5,ctx,canvas,n,m;
var bg="#000000",path="#00FF00";
function fill_grid(i,j,undo){
	ctx.fillStyle=path;
	ctx.fillRect(
		wall+(grid+wall)*j,
		wall+(grid+wall)*i,
		grid,grid);
}
function fill_wall(i,j,direction){
	ctx.fillStyle=path;
	if(direction=='right')
		ctx.fillRect(
			(grid+wall)*(j+1),
			wall+(grid+wall)*i,
			wall,grid);
	if(direction=='left')
		fill_wall(i,j-1,'right');
	if(direction=='up')
		ctx.fillRect(
			wall+(grid+wall)*j,
			(grid+wall)*i,
			grid,wall);
	if(direction=='down')
		fill_wall(i+1,j,'up');
}
function init(){
	ctx.fillStyle=bg;
	ctx.fillRect(0,0,canvas.width,canvas.height);
}
function start(){
	var tn,tm
	tn=Number(document.getElementById("n").value);
	tm=Number(document.getElementById("m").value);
	if(!(Number.isNaN(tn)||Number.isNaN(tm))) n=tn,m=tm;
	document.getElementById("maze").height=n*grid+(n+1)*wall;
	document.getElementById("maze").width=m*grid+(m+1)*wall;
	init();
}
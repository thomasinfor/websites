var stack=[],visited;
var dirs=['right','left','up','down'];
var pause=false,fps=20,cold_down=0;
function shuffle(array) {
	for (var i=array.length-1;i>0;i--) {
		var j=Math.floor(Math.random()*(i+1));
		[array[i],array[j]]=[array[j],array[i]];
	}
}
function in_bounds(i,j){return i>=0&&i<n&&j>=0&&j<m;}
function dfs(i=0,j=0){
	visited[i][j]=1;
	shuffle(dirs);
	var ord=dirs.slice()
	var newi,newj;
	for(var t=0;t<4;t++){
		if(ord[t]=='right') [newi,newj]=[i,j+1];
		if(ord[t]=='left') [newi,newj]=[i,j-1];
		if(ord[t]=='up') [newi,newj]=[i-1,j];
		if(ord[t]=='down') [newi,newj]=[i+1,j];
		if(in_bounds(newi,newj)&&visited[newi][newj]==0){
			stack.push({i:i, j:j, direction:ord[t], newi:newi, newj:newj});
			dfs(newi,newj);
		}
	}
}
function draw(){
	if(pause) return;
	if(stack.length==0){
		if(cold_down==-1) return cold_down=1*fps;
		if(cold_down==0){
			setTimeout(null,1000);
			start();
			fill_grid(0,0);
			visited=[];
			hist=[];
			for(var i=0;i<n;i++){
				visited.push([]);
				for(var j=0;j<m;j++)
					visited[i].push(0);
			}
			dfs();
			stack.reverse();
			cold_down=-1;
		}else cold_down--;
	}else{
		var last=stack.pop();
		fill_wall(last['i'],last['j'],last['direction']);
		fill_grid(last['newi'],last['newj']);
	}
}
function keyevent(eve){
	console.log(eve.key);
	if(eve.key=='Enter')
		pause=!pause;
	if(eve.key=='ArrowRight'){
		clearInterval(id);
		fps+=1;
		document.getElementById("fps").innerHTML='Current fps: '+fps;
		id=setInterval(draw,1000/fps);
	}
	if(eve.key=='ArrowLeft'){
		clearInterval(id);
		fps-=1;
		document.getElementById("fps").innerHTML='Current fps: '+fps;
		id=setInterval(draw,1000/fps);
	}
}
canvas=document.getElementById("maze")
ctx=canvas.getContext("2d");document.addEventListener('keydown',keyevent);
document.getElementById("fps").innerHTML='Current fps: '+fps;
var id=setInterval(draw,1000/fps);
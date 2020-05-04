var graph;
var video,timeline,ptr,rec=new Object();
var mode="label",mode_ele;
var type=null,end=null,textarea,focus_idx=null;
var event_function;
function max(a,b){return a>b?a:b;}
function min(a,b){return a<b?a:b;}
function color_button(t){
	document.getElementById('class_'+t).style.backgroundColor=(rec[t].length%2==1?'#008CBA':'#4CAF50');
}
function init(){
	var group=document.getElementById('button');
	for(var i=0;i<classes.length;i++){
		group.innerHTML+='<button class="button" id="class_'+classes[i]+'" onclick="clicks(\''+classes[i]+'\')" id="'+classes[i]+'">'+classes[i]+'</button>';
		rec[classes[i]]=[];
		rec[classes[i]].insert=function(val){
			this.push(val);
			var i=this.length-1;
			while(i>0&&this[i]<this[i-1]) [this[i],this[i-1]]=[this[i-1],this[i]],i--;
		};
	}
	video=document.getElementById('video');
	graph=document.getElementById('svg');
	x=graph.clientWidth; y=graph.clientHeight;
	timeline=document.getElementById('time');
	ptr=document.getElementById('pointer');
	textarea=document.getElementById('JSON');
	mode_ele=document.getElementById('mode');
	document.addEventListener("keydown",event_function=function(eve){
		if(type==null) return;
		if(!["Shift","Enter","delete","ArrowRight","ArrowLeft"].includes(eve.key)) return;
		if(mode=="label"){
			if(eve.key=="Shift"){
				mode="delete";
				mode_ele.innerHTML='Mode: delete';
				mode_ele.style.backgroundColor='#ff4d4d';
				if(rec[type].length==0) focus_idx=null;
				else focus_idx=rec[type].length-1;
			}
			if(eve.key=="Enter"){
				video.blur(); mode_ele.blur();
				rec[type].insert(video.currentTime);
				color_button(type);
			}
		}else if(mode=="delete"){
			if(eve.key=="Shift"){
				mode="label";
				mode_ele.innerHTML='Mode: label';
				mode_ele.style.backgroundColor='#66ff66';
				focus_idx=null;
			}
			if(focus_idx!=null&&eve.key=="Enter"){
				video.blur(); mode_ele.blur();
				var i=focus_idx;
				while(i+1<rec[type].length) [rec[type][i],rec[type][i+1]]=[rec[type][i+1],rec[type][i]],i++;
				rec[type].pop();
				while(focus_idx>=rec[type].length) focus_idx--;
				while(focus_idx<0) focus_idx++;
				if(rec[type].length==0) focus_idx=null;
				color_button(type);
			}
			if(focus_idx!=null&&eve.key=="ArrowRight")
				focus_idx=min(rec[type].length-1,focus_idx+1);
			if(focus_idx!=null&&eve.key=="ArrowLeft")
				focus_idx=max(0,focus_idx-1);
		}
		display(type);
	});
	video.ontimeupdate=function(){
		timeline.setAttribute('width',pos(video.currentTime)-pos(0));
		ptr.setAttribute('x1',pos(video.currentTime));
		ptr.setAttribute('x2',pos(video.currentTime));
		if(end!=null){
			document.getElementById('end').setAttribute('width',max(0,pos(video.currentTime)-pos(rec[type][rec[type].length-1])));
		}
	};
}
function pos(r){
	return 0.83*r*x/video.duration+x*0.15;
}
function display(cn,h=30){
	if(cn==null) return;
	var group=document.getElementById('label');
	group.innerHTML='';
	var i;
	for(i=0;i<rec[cn].length;i++)
		group.innerHTML+='<line x1="'+pos(rec[cn][i])+'" y1="'+(h-10)+'" x2="'+pos(rec[cn][i])+'" y2="'+h+'" style="stroke: black;">';
	for(i=0;i+1<rec[cn].length;i+=2)
		group.innerHTML+='<rect x="'+pos(rec[cn][i])+'" y="'+(h-5)+'" height="5" width="'+(pos(rec[cn][i+1])-pos(rec[cn][i]))+'" style="fill: black;"/>';
	if(i<rec[cn].length){
		group.innerHTML+='<rect id="end" x="'+pos(rec[cn][i])+'" y="'+(h-5)+'" height="5" width="0" style="fill: black;"/>';
	}
	if(focus_idx!=null)
		group.innerHTML+='<line x1="'+pos(rec[cn][focus_idx])+'" y1="'+(h-10)+'" x2="'+pos(rec[cn][focus_idx])+'" y2="'+h+'" style="stroke: red;stroke-width: 3px">';
	group.innerHTML+='<text id="title" x="1%" y="'+h+'" fill="black">'+cn+'</text>';
	end=document.getElementById('end');
}
function clicks(para){
	if(type==para) return;
	type=para;
	end=null;
	display(type);
}
function copy(){
	var copytext=document.getElementById("JSON");
	copytext.value=JSON.stringify(rec);
	copytext.select();
	document.execCommand("copy");
}
function begin(){
	init();
}
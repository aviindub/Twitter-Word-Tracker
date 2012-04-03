
function main(){

var trackedWord = $("#links h1");
trackedWord.hide();
trackedWord.fadeIn(500);



$("#links ul li").each(function(index, element){	
	$(element).hide();
	$(element).fadeIn(index+1 * 3000);
});

var link= document.getElementById('reflectedlink');
    var input= document.getElementById('searchterm');
    input.onchange=input.onkeyup= function() {
        link.action= "/words/" + input.value;
        
    };







}






$(document).ready(function(){
	main();
	
});
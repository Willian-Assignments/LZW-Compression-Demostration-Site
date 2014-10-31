
var originalString 		= '';
var compressedString 	= '';

var showUpload = function(forName,inNode){
	var html = '<button type="button" class="btn btn-default btn-xs  navbar-right">\
                    <span class="glyphicon glyphicon-cloud-upload"></span>'+forName+'\
                </button>';
    return $(inNode).append(html).find('button');
}
var uploadOrigin = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);

	reader.onload = function(theFile) {

		//Not text File or is
		var fileString = theFile.target.result;
		setOriginalText(fileString);
		//if (file.type.match('text.*')) {
			
			
			updateOriginalText();
		//}
	};
}
var uploadCompressed = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);

	reader.onload = function(theFile) {
		//alert(fileString);
		//Not text File or is
		var fileString = theFile.target.result;
		compressedString = fileString;

		//if (file.type.match('text.')) {
			var fileString = theFile.target.result;
			updateCompressedText();
		//}
	};
}
var showUploadsAndBindEvents = function(){
	var uploadOri = showUpload("上传源文件",$('#original .panel-title'));
	var uploadCmp = showUpload("上传压缩文件",$('#compressed .panel-title'));
	$(uploadOri).click(function(){
		$("#file").bind('change', uploadOrigin);
		$("#file").click();
	});
	$(uploadCmp).click(function(){
		$("#file").bind('change', uploadCompressed);
		$("#file").click();
	});
}
function setOriginalText(text){
	originalString = UTF8.fromString(text);
}
function getOriginalText(){
	return UTF8.toString(originalString);
}
function setCompressedText(text){
	compressedString = text;
}
function updateNumber(target){
	if(target == "ori"){
		var textLength = originalString.length;
		$("#ori-Count").html(textLength);
	}else if(target == "cmp"){
		var textLength = compressedString.length;
		$("#cmp-Count").html(textLength);
	}else if(target == "ratio"){
		$('#ratio').text('压缩比：'+(100* compressedString.length / originalString.length).toString().slice(0, 5)+'%' );
	}
}
function updateOriginalText(){
	var field = $("#original-text textarea")[0];
	var loadString = getOriginalText();
	if (loadString.length > 1000) {
		loadString = loadString.slice(0,1000);
	};
	$(field).val(loadString);
	updateNumber('ori');
	updatedOriginalChar();
}
function updatedOriginalChar(){
	var field = $("#original-text textarea")[1];
	var loadString = getOriginalText();
	if (loadString.length > 1000) {
		loadString = loadString.slice(0,1000);
	};
	var array = loadString.getCharArray(16,'');
	$('#original-table').html(tableStringForBioArray(array));
	//$(field).val(loadString.getCharString(20,' ','\n',''));
}
function tableStringForBioArray(array){
	var trs = [];
	for (var row in array) {
		trs.push( '<td>'+ array[row].join('</td><td>') +'</td>');
	};
	return '<tr>'+ trs.join('</tr><tr>') +'</tr>';
}
function updateCompressedText(){
	var stat = $('#cmp-stat');
	$(stat).text('已加载：');
	$(stat).append('&nbsp;<span class="badge" id="cmp-Count"></span>');
	

	
	var loadString = compressedString;
	if (loadString.length > 1000) {
		loadString = loadString.slice(0,1000);
	};

	
	var array = loadString.getCharArray(10,'',true);
	$('#compressed-table').html(tableStringForBioArray(array));

	updateNumber('cmp');
	
	$('#compressed .btn-group .btn').each(function(index, el) {
		$(this).removeAttr('disabled')
	});
}
var compress = function(){
	LZWAsync.compress({
        input : originalString,
        output : function(output) {
            compressedString = output;
            updateCompressedText();
            updateNumber('ratio');
        },
        progress: function (percent) {
			updateProgess(percent);
		}
	});
}
var decompress = function(){
	LZWAsync.decompress({
        input : compressedString,
        output : function(output) {
            originalString = output;
            updateOriginalText();
            updateNumber('ratio');
        },
        progress: function (percent) {
			updateProgess(percent);
		}
    });
}
var saveFileAs = function(contentString,fileName,MIME){
	if (typeof MIME == "undefined") {
		MIME = 'text';
	};
	var aFileParts = [contentString];
	var bb = new Blob(aFileParts,{type : MIME});
	saveAs(bb, fileName);
}
var saveCmp = function(e){
	saveFileAs(compressedString,'compressedString.lwx','text/lwx')
}
var saveOri = function(e){
	saveFileAs(getOriginalText,'original.txt','text')
}
var bindButtonEvents = function(){
	$("#save-ori-button").bind('click', saveOri);
	$("#save-cmp-button").bind('click', saveCmp);
	$("#compress-button").bind('click', compress);
	$("#decompress-button").bind('click', decompress);
};
if(window.File && window.FileReader && window.FileList && window.Blob){
	showUploadsAndBindEvents();
}
if(!(Blob && Blob != null) ){
	$("#save-ori-button").remove();
	$("#save-cmp-button").remove();
}
var detectChangeOfText = function(){
	var field = $("#original-text > textarea");
	var changeStr = function(event) {
		setOriginalText( $(field).val());
		updateNumber('ori');
		updatedOriginalChar();
	}
	$(field).change(changeStr).keydown(changeStr);
}
detectChangeOfText();
bindButtonEvents();
function updateProgess(percentage){
	var bar = $("#progress");
	if(percentage > 10){
		$(bar)
		.attr('aria-valuenow', percentage)
		.text(percentage+'%')
		.css('width', percentage+'%');
	}
	if (percentage == 100) {
		window.setTimeout(function(){
			$(bar).removeClass('progress-bar-striped').removeClass('active');
		},1000);
	}else{
		$(bar).addClass('progress-bar-striped').addClass('active');
	}
}



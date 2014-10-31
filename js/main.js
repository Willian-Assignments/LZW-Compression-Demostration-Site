var showUpload = function(forName,inNode){
	var html = '<button type="button" class="btn btn-default btn-xs  navbar-right">\
                    <span class="glyphicon glyphicon-cloud-upload"></span>'+forName+'\
                </button>';
    return $(inNode).append(html);
}
var loadTextToOriField = function(text){
	var field = $("#original textarea");
	$(field).val(text);
	detectChangeOfText();
}
var uploadOrigin = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);

	reader.onload = function(theFile) {
		//if (file.type.match('text.*')) {
			var fileString = theFile.target.result;
			if (fileString.length > 1000) {
				fileString = fileString.slice(0,999);
			};
			loadTextToOriField(fileString);
		//}
		//Not text File or is

	};
}
var uploadCompressed = function(event){

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

if(window.File && window.FileReader && window.FileList && window.Blob){
	showUploadsAndBindEvents();
}
var detectChangeOfText = function(){
	var field = $("#original-text > textarea");
	$(field).bind('change', function(event) {
		var textLength = $(field).val().length;
		$("#ori-Count").html(textLength);
	});
}
detectChangeOfText();
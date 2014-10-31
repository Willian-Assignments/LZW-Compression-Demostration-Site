/* js-charCode-display.js
 * CharCode Concersion
 * 2014-11-1
 *
 * By Willian Zhang, https://github.com/Willian-Zhang
 * License: MIT
 *   
 */
String.prototype.getCharArrayInOneLine = function (withPrefix,isUTF16){
	if (typeof withPrefix == "undefined" || withPrefix == true) {
		withPrefix = '0x';
	}
	if (typeof isUTF16 == "undefined"|| isUTF16 == "UTF8") {
		isUTF16 = false;
	}
	var self = this;
	var toChar = function(position){
		var numString = withPrefix + self.charCodeAt(position).toString(16);
		if((!isUTF16) && numString.length <2){
			numString = '0'*(2 - numString.length) + numString;
		}else if(isUTF16 && numString.length < 4){
			numString = '0'*(4 - numString.length) + numString;
		}
		return numString;
	}
	var array = [];
	for (var i = 0; i < this.length; i++) {
		array.push(toChar(i));
	};
	return array;
}
String.prototype.getCharStringInOneLine = function (separator,withPrefix,isUTF16){
	if (typeof separator == "undefined") {
		separator = ' ';
	}
	return this.getCharArrayInOneLine(withPrefix,isUTF16).join(separator);
}

String.prototype.getCharArray = function (colPerRow,withPrefix,isUTF16,callback){ 
	if (typeof colPerRow == "undefined") {
		colPerRow = 10;
	}
	//Copy String
	var stringCopy = (this+' ').slice(0, this.length);
	var string = stringCopy;
	
	//into lines
	var rowLines = [];
	while(string.length>0){
		var line = string.slice(0, colPerRow);
		string = string.slice(colPerRow);
		rowLines.push(line);
	}
	var counter = 0;

	for (var i = rowLines.length - 1; i >= 0; i--) {
		var f = function(rowLines){
			rowLines[i] = rowLines[i].getCharArrayInOneLine(withPrefix,isUTF16);
			counter++;
			if (counter == rowLines.length) {
				if (typeof callback != "undefined") {
					callback(rowLines);
				}
			}
		}
		window.setTimeout(f(rowLines),1);
	}
	return rowLines;
}
String.prototype.getCharString = function (colPerRow,separator,lineSeparator,withPrefix,isUTF16,callback){ 
	if (typeof lineSeparator == "undefined") {
		lineSeparator = '\n';
	}
	if (typeof separator == "undefined") {
		separator = ' ';
	}
	var string = '';
	this.getCharArray(colPerRow,withPrefix,isUTF16,function(array){
		for (var i = 0; i < array.length; i++) {
			array[i] = array[i].join(separator);
		}
		string = array.join(lineSeparator);
		if (typeof callback != "undefined") {
			callback(string);
		}
	});
	return string;
}





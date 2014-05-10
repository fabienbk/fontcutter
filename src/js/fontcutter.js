function CanvasManager(canvasId) {
	var me = this;
	me.canvas = document.getElementById(canvasId);
	me.ctx = me.canvas.getContext('2d');

	var imageLoader = document.getElementById('imageLoader');
	imageLoader.addEventListener('change', me.handleImage, false);

	var lineNumberField = document.getElementById('linenumber');
	lineNumberField.addEventListener('change', me.onLineNumberChange, false);

	me.handleImage = function(e) {
		var reader = new FileReader();

		reader.onload = function(event) {
			var img = new Image();

			img.onload = function() {
				me.canvas.width = img.width;
				me.canvas.height = img.height;
				me.ctx.drawImage(img, 0, 0);
			};

			img.src = event.target.result;
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	me.onLineNumberChange = function(event) {
		var newLineNumber = $('#linenumber').val();
		if (newLineNumber > lineTable.lineNumber) {
			lineTable.addLines(newLineNumber - lineTable.lineNumber);
		} else if (newLineNumber < lineTable.lineNumber) {
			lineTable.removeLines(lineTable.lineNumber - newLineNumber);
		}
	};
}

/**
 * Line table
 */
function LineDefinition(index, definition) {
	this.index = index;
	this.definition = definition;
}

LineDefinition.prototype.toHTML = function() {
	return "<tr><td>" + this.index + "</td><td></td></tr>";
};

function LineTable(lineNumber) {
	this.lineNumber = lineNumber;
	this.lineArray = [];

	this.addLines(lineNumber);
}

LineTable.prototype.addLines = function(number) {
	for (var i = 0; i < number; i++) {
		var newIndex = this.lineNumber.length;
		var lineDef = new LineDefinition(newIndex, "");
		this.lineNumber[newIndex] = lineDef;

		//	$('#lineTable').append(newIndex.toHTML());

	}
};

LineTable.prototype.removeLines = function(number) {
	this.lineNumber.length = number;
};

var lineTable = new LineTable($('#linenumber').val());
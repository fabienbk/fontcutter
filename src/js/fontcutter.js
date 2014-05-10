function CanvasManager(canvasId, canvasContainerId) {
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d');
    this.canvasContainer = document.getElementById(canvasContainerId);
    this.lineTable = new LineTable($('#linenumber').val(), $('#lineTable'));

	var imageLoader = document.getElementById('imageLoader');
	imageLoader.addEventListener('change', this.handleImage.bind(this), false);

	var lineNumberField = document.getElementById('linenumber');
	lineNumberField.addEventListener('change', this.onLineNumberChange.bind(this), false);
}


CanvasManager.prototype.handleImage = function(e) {
        var reader = new FileReader();
        var canvasContainerId = this.canvasContainerId;
        var me = this;

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

CanvasManager.prototype.onLineNumberChange = function(event) {
        var newLineNumber = $('#linenumber').val();
        alert(newLineNumber + " and table ");
        if (newLineNumber > this.lineTable.lineArray.length) {
            this.lineTable.addLines(newLineNumber - this.lineTable.lineArray.length);
        } else if (newLineNumber < this.lineTable.lineArray.length) {
            this.lineTable.removeLines(this.lineTable.lineArray.length - newLineNumber);
        }
    };

/**
 * Line table
 */
function LineDefinition(index, definition) {
	this.index = index;
	this.definition = definition;
}

LineDefinition.prototype.toHTML = function() {
	return "<tr><td>" + this.index + "</td><td><input type='text' name='glyphLine' value='ABCDEF'/></td></tr>";
};

function LineTable(lineNumber, jqueryObj) {
	this.lineArray = [];
    this.jqueryObj = jqueryObj;
	this.addLines(lineNumber);
}

LineTable.prototype.addLines = function(number) {
    alert("add " + number + "lines");
	for (var i = 0; i < number; i++) {
		var newIndex = this.lineArray.length;
        this.lineArray[newIndex] = lineDef;
		var lineDef = new LineDefinition(newIndex, "");
		
		this.jqueryObj.append(lineDef.toHTML());
	}
};

LineTable.prototype.removeLines = function(number) {
        alert("remove to " + number + "lines");
	this.lineArray.length = number;

    // remove lines in jquery
};

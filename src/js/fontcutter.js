var fontcutterApp = angular.module('fontcutterApp', []);

fontcutterApp.controller('fontcutterCtrl', function ($scope) { 
  $scope.charWidth = 8;
  $scope.charHeight = 8;
  $scope.topPadding = 0;
  $scope.leftPadding = 0;
  $scope.bottomPadding = 0;
  $scope.rightPadding = 0;

  $scope.lineData = [
    {'line': 1, 'glyphs' : "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },     
    {'line': 2, 'glyphs' : "abcdefghijklmnopqrstuvwxyz" },     
    {'line': 3, 'glyphs' : "0123456789" },     
  ];
  $scope.lineNumber = $scope.lineData.length;

  $scope.onLineNumberChange = function() {
    if ($scope.lineNumber < $scope.lineData.length) {
        $scope.lineData.splice($scope.lineNumber, $scope.lineData.length - $scope.lineNumber + 1);            
    }
    else if ($scope.lineNumber > $scope.lineData.length) {
        for (var i = 0; i < ($scope.lineNumber - $scope.lineData.length); i++) {
            $scope.lineData.push({'line' : $scope.lineData.length + 1, 'glyphs' : ''});
        }
    }    
  }
});


function CanvasManager(canvasId, canvasContainerId) {
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d');
  this.canvasContainer = document.getElementById(canvasContainerId);
    
	var imageLoader = document.getElementById('imageLoader');
	imageLoader.addEventListener('change', this.handleImage.bind(this), false);	
}

var img = new Image();

CanvasManager.prototype.handleImage = function(e) {
        var reader = new FileReader();
        var canvasContainerId = this.canvasContainerId;
        var me = this;

        reader.onload = function(event) {
            img.onload = function() {
                $('#jumbotron').hide();
                $('#canvas-container').show();
                me.canvas.width = img.width;
                me.canvas.height = img.height;
                me.ctx.drawImage(img, 0, 0);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(e.target.files[0]);
        $('#canvas-container').show();
    };

function generatePreview() {
  var $scope = angular.element($("#body")).scope();
  
  var canvasArray = [];

  var table = $('#previewTable');
  table.empty();
  var content = "";
  for (var i = 0; i < $scope.lineData.length; i++) {
    content += "<tr>";
    var lineDataEntry = $scope.lineData[i];
    for (var j = 0; j < lineDataEntry.glyphs.length; j++) {
      var canvasId = "canvas_"+i+"_"+j;
      content += "<td><canvas class='preview-canvas' id='"+canvasId+"' width='"+$scope.charWidth+"' height='"+$scope.charHeight+"' /></td>";
    }
    content += "</tr>";
  }

  table.append(content);

  for (var i = 0; i < $scope.lineData.length; i++) {
    var lineDataEntry = $scope.lineData[i];
    for (var j = 0; j < lineDataEntry.glyphs.length; j++) {
      var canvasId = "canvas_"+i+"_"+j;
      var canvas = document.getElementById(canvasId);
      var ctx = canvas.getContext('2d');
      //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
      var sx = j*$scope.charWidth;
      var sy = i*$scope.charHeight;

      ctx.drawImage(img,sx,sy,$scope.charWidth,$scope.charHeight,0,0,$scope.charWidth,$scope.charHeight);
    }
  }



}
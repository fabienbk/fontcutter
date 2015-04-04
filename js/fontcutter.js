/* The bitmap being loaded */

var fontcutterApp = angular.module('fontcutterApp', []);
var image = new Image();
var fileName = "";

fontcutterApp.controller('fontcutterCtrl', function ($scope) { 
  $scope.outputXML = false;
  $scope.charWidth = 32;
  $scope.charHeight = 32;
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

  var properties = ["outputXML", "lineNumber", "charWidth", "charHeight", "topPadding", "bottomPadding", "leftPadding", "rightPadding"];
  for (var i = properties.length - 1; i >= 0; i--) {
    $scope.$watch(properties[i], function() { canvasManager.refresh(); });
  }

  // watch deep change in array
  $scope.$watch(
    function() { 
      var result;
      for (var i = 0; i < $scope.lineData.length; i++) {
        result += $scope.lineData[i].glyphs;
      }
      return result;    
    }, 
    function() { canvasManager.refresh(); });
   
});

function CanvasManager() {
  this.canvasId = 'imageCanvas';
  this.canvasContainerId = 'canvas-container',
	this.canvas = document.getElementById(this.canvasId);
	this.ctx = this.canvas.getContext('2d');
  this.canvasContainer = document.getElementById(this.canvasContainerId);
    
	var imageLoader = document.getElementById('imageLoader');
	imageLoader.addEventListener('change', this.handleImage.bind(this), false);	
}

CanvasManager.prototype.refresh = function() {
  if (fileName != "") {    
    this.refreshCanvas();
    generatePreview();
    generateOutput();
  }
}

CanvasManager.prototype.handleImage = function(e) {
        var reader = new FileReader();
        var canvasContainerId = this.canvasContainerId;
        var me = this;

        reader.onload = function(event) {
            image.onload = function() {
                $('#jumbotron').hide();
                $('#canvas-container').show();
                me.canvas.width = image.width;
                me.canvas.height = image.height;
                me.refreshCanvas();

                $('.nav li.disabled').find("a").attr("data-toggle", "tab");
                $('.nav li.disabled').removeClass('disabled');

            };

            image.src = event.target.result;
        };

        fileName = e.target.files[0];
        reader.readAsDataURL(fileName);
        $('#canvas-container').show();
    };


CanvasManager.prototype.refreshCanvas = function() {
  var angularScope = angular.element($("#body")).scope();

  this.ctx.beginPath();
  this.ctx.clearRect (0, 0, image.width, image.height);
  this.ctx.drawImage(image, 0, 0);
    
  var i = 0;
  var origX = 0;
  var origY = 0;
  var glyphsNumber = 0;
  for (i = 0; i < angularScope.lineData.length; i++) {
    var lineData = angularScope.lineData[i];
    origX = 0;    
    origY = i * angularScope.charHeight;
    glyphsNumber = lineData.glyphs.length;

    this.line(origX, origY, glyphsNumber * angularScope.charWidth, origY, "#aaa");

    for (var j = 0; j < glyphsNumber + 1; j++) {    
      this.line(origX + j * angularScope.charWidth, origY, origX + j * angularScope.charWidth, origY + angularScope.charHeight, "#aaa");
    };
  };
  
  origY = (i+1) * angularScope.charHeight;  
  this.line(0, origY, glyphsNumber * angularScope.charWidth, origY, "#aaa");

};

CanvasManager.prototype.line = function(sx, sy, ex, ey, style) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = style;
    this.ctx.moveTo(sx + 0.5, sy + 0.5);
    this.ctx.lineTo(ex + 0.5, ey + 0.5);
    this.ctx.stroke();
}

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
      content += "<td><div>"+lineDataEntry.glyphs[j]+"</div><canvas class='preview-canvas' id='"+canvasId+"' width='"+$scope.charWidth+"' height='"+$scope.charHeight+"' /></td>";
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
      //context.drawImage(image,sx,sy,swidth,sheight,x,y,width,height);
      var sx = j*$scope.charWidth;
      var sy = i*$scope.charHeight;

      ctx.drawImage(image,sx,sy,$scope.charWidth,$scope.charHeight,0,0,$scope.charWidth,$scope.charHeight);
    }
  }
}

function  generateOutput() {
  var scope = angular.element($("#body")).scope();
  if (scope.outputXML) {
    generateXMLOutput(scope);
  } else {
    generateFNTOutput(scope);
  }
}

function generateXMLOutput($scope) {
  var EOL = "\n";
  var output = '<?xml version="1.0"?>'+EOL;

  //padding for each character (up, right, down, left).
  var padding = [$scope.topPadding, $scope.rightPadding, $scope.bottomPadding, $scope.leftPadding].join();

  var count = 0;
  for (var i = 0; i <  $scope.lineData.length; i++) {
    count += $scope.lineData[i].glyphs.length;
  };

  output += '<font>'+EOL;
  output += '<info face="'+fileName.name+'" size="'+$scope.charWidth+'" bold="0" italic="0" charset="" unicode="1" stretchH="100" smooth="1" aa="1" padding="'+padding+'" spacing="1,1" outline="0" />'+EOL;
  output += '<common lineHeight="32" base="25" scaleW="'+image.width+'" scaleH="'+image.height+'" pages="1" packed="0" alphaChnl="1" redChnl="0" greenChnl="0" blueChnl="0" />'+EOL;
  output += '<pages>'+EOL;
  output += '<page id="0" file="'+fileName.name+'" />'+EOL;
  output += '</pages>'+EOL;
  output += '<chars count="'+count+'">'+EOL;

  for(var line=0; line < $scope.lineData.length; line++) {
    for (var i = 0; i < $scope.lineData[line].glyphs.length; i++) {
      var character = $scope.lineData[line].glyphs[i];      
      var width = $scope.charWidth;
      var height = $scope.charHeight;
      var x = i*width;
      var y = line*height;      
      output += '<char id="'+character.charCodeAt(0)+'"   x="'+x+'"    y="'+y+'"     width="'+width+'"    height="'+height+'" xoffset="0"     yoffset="0"     xadvance="'+width+'"    page="0"  chnl="0" />'+EOL;
    }   
  }

  output += '</chars>'+EOL;
  output += '</font>';

  $('#output').val(output);
}

function generateFNTOutput($scope) {
  var output = "";
  var EOL = "\n";

  //padding for each character (up, right, down, left).
  var padding = [$scope.topPadding, $scope.rightPadding, $scope.bottomPadding, $scope.leftPadding].join();

  var count = 0;
  for (var i = 0; i <  $scope.lineData.length; i++) {
    count += $scope.lineData[i].glyphs.length;
  };
    

  output += "info face=\""+fileName.name+"\" size="+$scope.charWidth+" bold=0 italic=0 charset=\"\" unicode=1 stretchH=100 smooth=1 aa=1 padding="+padding+" spacing=1,1 outline=0"+EOL;
  output += "common lineHeight=32 base=25 scaleW="+image.width+" scaleH="+image.height+" pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0"+EOL;
  output += "page id=0 file=\""+fileName.name+"\""+EOL;
  output += "chars count="+count+EOL;

  for(var line=0; line < $scope.lineData.length; line++) {
    for (var i = 0; i < $scope.lineData[line].glyphs.length; i++) {
      var character = $scope.lineData[line].glyphs[i];      
      var width = $scope.charWidth;
      var height = $scope.charHeight;
      var x = i*width;
      var y = line*height;      
      output += "char id="+character.charCodeAt(0)+"   x="+x+"    y="+y+"     width="+width+"    height="+height+" xoffset=0     yoffset=0     xadvance="+width+"    page=0  chnl=0"+EOL;
    }   
  }

  $('#output').val(output);
}


var canvasManager = new CanvasManager();



$(document).ready(function() {
    /*disable non active tabs*/
    $('.nav li').not('.active').addClass('disabled');
/*to actually disable clicking the bootstrap tab, as noticed in comments by user3067524*/
    $('.nav li').not('.active').find('a').removeAttr("data-toggle");    
});
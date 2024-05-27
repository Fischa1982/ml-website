const backgorundColor = "#000000";
const lineColor = "#FFFFFF";
const lineWidth = 15;

var currentX = 0;
var currentY = 0;
var prevX = 0;
var prevY = 0;

var isDrawing = false;

var canvas;
var ctx;

function canvasStyling() {

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    ctx.fillStyle = backgorundColor;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);   
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";


    canvas.addEventListener("mousedown", function(event) {
        isDrawing = true;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    })
    
    canvas.addEventListener("mousemove", function(event) {
        prevX = currentX;
        currentX = event.clientX - canvas.offsetLeft;
        prevY = currentY;
        currentY = event.clientY - canvas.offsetTop;
        
        if (isDrawing) {
            draw();
        }
        
    })

    canvas.addEventListener("mouseup", function(event) {
        isDrawing = false;
    })

    canvas.addEventListener("mouseleave", function(event) {
        isDrawing = false;
    })

    canvas.addEventListener("touchstart", function(event) {
        isDrawing = true;
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
    })
    
    canvas.addEventListener("touchmove", function(event) {
        prevX = currentX;
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        prevY = currentY;
        currentY = event.touches[0].clientY - canvas.offsetTop;
        
        if (isDrawing) {
            draw()
        }
        
    })

    canvas.addEventListener("touchend", function(event) {
        isDrawing = false;
    })

    canvas.addEventListener("touchcancel", function(event) {
        isDrawing = false;
    })
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
    ctx.stroke();
}

function clearCanvas() {
    currentX = 0;
    currentY = 0;
    prevX = 0;
    prevY = 0;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

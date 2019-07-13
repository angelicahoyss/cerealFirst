const canvas = document.getElementById("canvas");
const button = document.getElementById("sign-btn");
const ctx = canvas.getContext("2d");

let position = { x: 0, y: 0 };

function setPosition(e) {
    position.x = e.offsetX;
    position.y = e.offsetY;
}

function draw(e) {
    if (e.buttons !== 1) return;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.moveTo(position.x, position.y);
    setPosition(e);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
    document.body.addEventListener("mouseup", () => {
        $('input[name="signature"]').val(canvas.toDataURL());
    });
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("mouseup", setPosition);

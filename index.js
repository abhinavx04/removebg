const rmimage = document.getElementById('image');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let imageUrl;
let isDrawing = false;
let isBrushActive = false;

function imageUpload() {
    const fileInput = document.getElementById('imageInput');
    const image = fileInput.files[0];

    const formData = new FormData();
    formData.append("image_file", image);
    formData.append('size', 'auto');

    const apiKey = "QX5C2MQoeX84jfYcTzgwSB4u";
    fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey,
        },
        body: formData
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(function(blob) {
        const url = URL.createObjectURL(blob);
        imageUrl = url;
        const img = new Image();
        img.onload = function() {
            const uploadBox = document.querySelector('.upload-box');
            const boxWidth = uploadBox.clientWidth;
            const boxHeight = uploadBox.clientHeight;

            const aspectRatio = img.width / img.height;
            let newWidth = boxWidth;
            let newHeight = boxHeight;

            if (img.width > img.height) {
                newHeight = newWidth / aspectRatio;
            } else {
                newWidth = newHeight * aspectRatio;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
        };
        img.src = url;
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}

function downloadFile() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.fillStyle = 'green';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    const dataURL = tempCanvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'edited-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function toggleBrush() {
    isBrushActive = !isBrushActive;
    if (isBrushActive) {
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);
    } else {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mousemove', draw);
    }
}

function startDrawing(event) {
    isDrawing = true;
    draw(event); 
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); 
}

function draw(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 50; 
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'green'; 

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Draw green background
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, ctx.lineWidth, ctx.lineWidth);
}

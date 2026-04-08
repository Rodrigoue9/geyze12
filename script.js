const canvas = document.getElementById('certificateCanvas');
const ctx = canvas.getContext('2d');
const studentNameInput = document.getElementById('studentName');
const dateInput = document.getElementById('date');
const downloadBtn = document.getElementById('downloadBtn');

const img = new Image();
img.src = baseImage;

img.onload = () => {
    render();
};

function render() {
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw base image
    ctx.drawImage(img, 0, 0);

    // Text settings
    ctx.textAlign = 'center';
    
    // Student Name
    const name = studentNameInput.value || '[Nome do Aluno]';
    ctx.font = '700 110px Montserrat, sans-serif'; 
    ctx.fillStyle = '#0a2342'; // Dark blue from image
    // Position estimation: Center of white area
    ctx.fillText(name.toUpperCase(), canvas.width * 0.42, canvas.height * 0.47);

    // Date
    const date = dateInput.value || '___/___/___';
    ctx.font = '400 45px Montserrat, sans-serif';
    ctx.textAlign = 'left';
    // Position estimation: Over the line ______ after "REALIZADO NOS DIAS"
    ctx.fillText(date, canvas.width * 0.525, canvas.height * 0.553);

    requestAnimationFrame(render);
}

// Listeners for live preview (optional if render is in loop, but better for performance if not)
studentNameInput.addEventListener('input', render);
dateInput.addEventListener('input', render);

downloadBtn.addEventListener('click', () => {
    try {
        const link = document.createElement('a');
        const name = studentNameInput.value.trim() || 'Aluno';
        link.download = `Certificado_${name}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Feedback
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = '✅ Baixando...';
        downloadBtn.classList.add('success');
        setTimeout(() => {
            downloadBtn.innerText = originalText;
            downloadBtn.classList.remove('success');
        }, 2000);
    } catch (err) {
        console.error('Erro ao baixar:', err);
        alert('Erro ao gerar o download. Tente abrir o arquivo novamente.');
    }
});

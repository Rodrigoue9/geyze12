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
    ctx.fillText(name.toUpperCase(), canvas.width * 0.40, canvas.height * 0.485);

    // Date
    const date = dateInput.value || '___/___/___';
    ctx.font = '400 45px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    // Position estimation: Over the line ______ after "REALIZADO NOS DIAS"
    ctx.fillText(date, canvas.width * 0.415, canvas.height * 0.560);

    requestAnimationFrame(render);
}

// Listeners for live preview (optional if render is in loop, but better for performance if not)
studentNameInput.addEventListener('input', render);
dateInput.addEventListener('input', render);

const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const downloadWordBtn = document.getElementById('downloadWordBtn');

function provideFeedback(btn) {
    const originalText = btn.innerText;
    btn.innerText = '✅ Baixando...';
    btn.classList.add('success');
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('success');
    }, 2000);
}

downloadBtn.addEventListener('click', () => {
    try {
        const link = document.createElement('a');
        const name = studentNameInput.value.trim() || 'Aluno';
        link.download = `Certificado_${name}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        provideFeedback(downloadBtn);
    } catch (err) {
        console.error('Erro ao baixar PNG:', err);
        alert('Erro ao gerar o download. Tente abrir o arquivo novamente.');
    }
});

downloadPdfBtn.addEventListener('click', () => {
    try {
        const name = studentNameInput.value.trim() || 'Aluno';
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`Certificado_${name}.pdf`);
        provideFeedback(downloadPdfBtn);
    } catch (err) {
        console.error('Erro ao baixar PDF:', err);
        alert('Erro ao gerar o PDF.');
    }
});

downloadWordBtn.addEventListener('click', async () => {
    try {
        const name = studentNameInput.value.trim() || 'Aluno';
        const imgData = canvas.toDataURL('image/png');
        const base64Data = imgData.split(',')[1];
        
        // Convert base64 to Uint8Array
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Access docx from global scope
        const docxLib = window.docx || window.Docx;
        if (!docxLib) {
            throw new Error('Biblioteca docx não carregada.');
        }
        const { Document, Packer, Paragraph, ImageRun } = docxLib;
        
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        size: {
                            orientation: 'landscape',
                        },
                        margin: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                        },
                    },
                },
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: byteArray,
                                transformation: {
                                    width: 700,
                                    height: 700 * (canvas.height / canvas.width),
                                },
                            }),
                        ],
                    }),
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Certificado_${name}.docx`;
        link.click();
        provideFeedback(downloadWordBtn);
    } catch (err) {
        console.error('Erro ao baixar Word:', err);
        alert('Erro ao gerar o Word: ' + err.message);
    }
});

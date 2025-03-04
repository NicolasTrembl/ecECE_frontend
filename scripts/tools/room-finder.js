import * as PDFJS from "https://esm.sh/pdfjs-dist";
import * as PDFWorker from "https://esm.sh/pdfjs-dist/build/pdf.worker.min";
try {
    PDFJS.GlobalWorkerOptions.workerSrc = PDFWorker;
} catch (e) {
    window.pdfjsWorker = PDFWorker;
}


function getSearchedRoom() {
    const urlParams = new URLSearchParams(window.location.search);
    var searched = urlParams.get('room');

    if (!searched) {
        return "003|Accueil";
    }
    if (searched.includes("-")) {
        return searched;
    } else if (searched.length != 4 || isNaN(searched.slice(1))) {
        console.log("Invalid room number");
        console.log(searched.slice(1))
        console.log(isNaN(searched.slice(1)))
        return "003|"+searched;
    } 
    return searched[0] + "-" + searched.slice(1);
    
}

function highlightText(ctx, textObj, viewport) {
    const [a, b, c, d, e, f] = textObj.transform; // Matrice de transformation
    const width = textObj.width;
    const height = textObj.height;

    // Adapter au viewport
    const scale = viewport.scale;
    const canvasHeight = ctx.canvas.height;

    // Transformation des coordonnées
    const adjustedX = e * scale;
    const adjustedY = canvasHeight - (f * scale); // Inversion Y pour le canvas

    // Calcul de l'angle de rotation
    const angle = Math.atan2(b, d);

    // Calcul du centre du texte transformé
    const centerX = adjustedX + (width * scale) / 2;
    const centerY = adjustedY - (height * scale) / 2;

    // Rayon du cercle (ajusté pour ne pas être trop grand)
    const radius = (Math.sqrt(width * width + height * height) * scale) / 2;


    // Dessiner le cercle correctement transformé
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}



function getRoom(room) {
    console.log('Getting room:', room);
    const canvas = document.getElementById('pdf-canvas');

    const pdfUrl = '/assets/tools/room-finder/' + room[2] + '.pdf';


    PDFJS.getDocument(pdfUrl).promise.then(function (pdfDoc) {
    
        pdfDoc.getPage(1).then(function (page) {
            const viewport = page.getViewport({ scale: 0.65 });

            // Set the canvas dimensions to match the PDF page size.
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const ctx = canvas.getContext('2d');

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };

            page.render(renderContext).promise.then(function () {
                console.log('Page rendered');
                if (room.includes("|")) {
                    room = room.split("|")[1];
                }
                page.getTextContent().then(function (textContent) {
                    textContent.items.forEach(function (textObj) {
                        if (textObj.str === room) {
                            console.log(textObj);
                            highlightText(ctx, textObj, viewport);
                        }
                    });
                })
            });
        });
    });
};

getRoom(getSearchedRoom());
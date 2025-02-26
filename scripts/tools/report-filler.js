import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    AlignmentType, 
    Header, 
    Footer, 
    PageNumber, 
    SectionType,
    ImageRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    HeightRule
} from "https://cdn.jsdelivr.net/npm/docx@9.1.1/+esm";

async function getImageBuffer(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de chargement de l'image: ${response.statusText}`);
        }
        return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
        console.error("Erreur lors du chargement de l'image:", error);
        // Retourne un buffer vide en cas d'erreur pour ne pas bloquer la génération
        return new Uint8Array(0);
    }
}

async function generateDoc() {
    const date = new Date();
    // Essayez de charger l'image, mais continuez même en cas d'échec
    let imgBuffer;
    try {
        imgBuffer = await getImageBuffer("/assets/tools/report-filler/image.jpeg");
    } catch (error) {
        console.warn("L'image n'a pas pu être chargée, le document sera généré sans elle");
        imgBuffer = null;
    }

    // Création de l'en-tête avec logo ECE
    const header = new Header({
        children: [
            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: {
                                    size: 50,
                                    type: WidthType.PERCENTAGE,
                                },
                                children: imgBuffer ? [
                                    new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        children: [
                                            new ImageRun({
                                                data: imgBuffer,
                                                transformation: {
                                                    width: 172 * 0.44,
                                                    height: 71 * 0.44,
                                                },
                                            }),
                                        ],
                                    }),
                                ] : [
                                    new Paragraph({
                                        text: "ECE",
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: {
                                    size: 50,
                                    type: WidthType.PERCENTAGE,
                                },
                                children: [
                                    new Paragraph({
                                        text: "ING2 Groupe 3",
                                        alignment: AlignmentType.RIGHT,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    // Création du pied de page (inchangé par rapport à votre code)
    const footer = new Footer({
        children: [
            new Paragraph({
                text: "Nous attestons que ce travail est original, qu'il est le fruit d'un travail commun au binôme et qu'il a été rédigé de manière autonome.",
            }),
            new Paragraph({
                text: `Le ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        children: [PageNumber.CURRENT.toString()],
                        break: 1, 
                    }),
                ],
            }),
        ],
    });

    // Création du document
    const doc = new Document({
        creator: "Report Generator",
        description: "Rapport de TP automatisé",
        title: "Rapport TP",
        sections: [{
            properties: {
                type: SectionType.CONTINUOUS,
                page: {
                    margin: {
                        top: 1440,
                        right: 1440,
                        bottom: 1440,
                        left: 1440,
                    },
                },
            },
            headers: {
                default: header,
            },
            footers: {
                default: footer,
            },
            children: [
                // Ligne horizontale (haut)
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "___________________________________________________________________",
                            color: "007a7b",
                            bold: true,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                }),
                
                // Espace
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                
                // Titre principal
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "RAPPORT DE TP",
                            font: "Century Gothic",
                            bold: true,
                            size: 28,
                            color: "007a7b",
                        }),
                    ],
                }),
                
                // Sous-titre
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "TP 2 : Le thermomètre numérique",
                            font: "Century Gothic",
                            italics: true,
                            size: 28,
                            color: "007a7b",
                        }),
                    ],
                }),
                
                // Espace
                new Paragraph({ text: "" }),
                
                // Ligne horizontale (bas)
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "___________________________________________________________________",
                            color: "007a7b",
                            bold: true,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                }),
                
                // Espace
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                
                // Table des auteurs et enseignant
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: {
                                        size: 50,
                                        type: WidthType.PERCENTAGE,
                                    },
                                    children: [
                                        new Paragraph({
                                            text: "Auteurs :",
                                            bold: true,
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    width: {
                                        size: 50,
                                        type: WidthType.PERCENTAGE,
                                    },
                                    children: [
                                        new Paragraph({
                                            text: "Enseignant :",
                                            bold: true,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        
                        // Noms des auteurs et de l'enseignant
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "Nicolas" }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "M. FONTON" }),
                                    ],
                                }),
                            ],
                        }),
                        
                        // Suite des noms des auteurs
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "Tristan" }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                            ],
                        }),
                        
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "Lucas" }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
                
                // Noms de famille
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: {
                                        size: 30,
                                        type: WidthType.PERCENTAGE,
                                    },
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                                new TableCell({
                                    width: {
                                        size: 20,
                                        type: WidthType.PERCENTAGE,
                                    },
                                    children: [
                                        new Paragraph({ text: "TREMBLAY" }),
                                    ],
                                }),
                                new TableCell({
                                    width: {
                                        size: 50,
                                        type: WidthType.PERCENTAGE,
                                    },
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                            ],
                        }),
                        
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "VALENTINO" }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                            ],
                        }),
                        
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "MOHEN" }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: "" }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
                
                // Espace
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                
                // Table des matières
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "- PARTIE I. Vue-mètre de température –",
                            bold: true,
                        }),
                    ],
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "A. Partie théorique" }),
                    ],
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "B. Simulations" }),
                    ],
                }),
                
                // Espace
                new Paragraph({ text: "" }),
                
                // Partie II
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "- PARTIE II. Précision des mesures -",
                            bold: true,
                        }),
                    ],
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "C. Partie théorique" }),
                    ],
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "D. Simulation" }),
                    ],
                }),
                
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "E. Mesure d'une température négative" }),
                    ],
                }),
            ],
        }],
    });

    // Téléchargement du document
    Packer.toBlob(doc).then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Rapport_TP.docx";
        link.click();
    });
}

document.getElementById("generate-docx").addEventListener("click", generateDoc);
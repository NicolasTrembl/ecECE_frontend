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
    HeadingLevel,
} from "https://cdn.jsdelivr.net/npm/docx@9.1.1/+esm";




const data = {
    numero_tp: 2,
    titre: "Le thermomètre numérique",
    authors: [
        { prenom: "Nicolas", nom: "TREMBLAY" },
        { prenom: "Tristan", nom: "VALENTINO" },
        { prenom: "Lucas", nom: "MOHEN" },
    ],
    enseignant: "M. FONTON",
    annee: 2,
    groupe: 3,
    date: new Date(),
    parties: [{
        titre: "Partie I. Vue-mètre de température",
        sous_parties: [{ 
            titre: "A. Partie théorique",
            questions: [{
                nom: "T1",
                reponse: [{
                    type: "code", value: "int x = 15;\nprintf(\"x = %d\", x);\nfor (int i = 0; i < 10; i++) {\n    printf(\"i = %d\", i);\n}", 
                    langage: "c"
                }]
            }]
        }, { 
            titre: "B. Simulation",
            questions: [{
                nom: "T1",
                reponse: [{
                    type: "text", value: "TEXT"
                },{
                    type: "code", value: "x = 15", langage: "python"
                },{
                    type: "image", value: "url", description: "description"
                }]
            }]
        }]
    }, {
        titre: "Partie II. Précision des mesures",
        sous_parties: [{ 
            titre: "A. Partie théorique",
            questions: [{
                nom: "T1",
                reponse: [{
                    type: "text", value: "TEXT"
                }]
            }]
        }, { 
            titre: "B. Simulation",
            questions: [{
                nom: "T1",
                reponse: [{
                    type: "text", value: "TEXT"
                },{
                    type: "code", value: "x = 15", langage: "python"
                },{
                    type: "image", value: "url", description: "description"
                }]
            }]
        }, { 
            titre: "C. Mesure d’une température négative",
            questions: [{
                nom: "T1",
                reponse: [{
                    type: "text", value: "TEXT"
                }]
            }]
        }]
    }, {
        titre: "Partie III. Comparaison analogique simple",
        sous_parties: [{ 
            titre: null,
            questions: [{
                nom: "T1",
                reponse: [{
                    type: "text", value: "TEXT"
                }]
            }]
        }]
    }]
}

async function getImageBuffer(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de chargement de l'image: ${response.statusText}`);
        }
        return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
        console.error("Erreur lors du chargement de l'image:", error);
        return new Uint8Array(0);
    }
}

function generateAuthorTable() {
    var rows = [
        ["Auteurs :", "", "Enseignant :"],
        ["", "", ""],
    ];

    data.authors.forEach((auteur) => {
        rows.push([auteur.prenom, auteur.nom, ""]);
    });

    if (rows.length > 2) {
        rows[2][2] = data.enseignant;
    }


    return new Table({
        alignment: AlignmentType.CENTER,
        width: {
            size: 85,
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
        rows: rows.map((row) => new TableRow({
            children: row.map((cell) => new TableCell({
                width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                },
                children: [
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: cell,
                                font: "Century Gothic",
                                italics: true,
                                size: 12*2,
                            }),
                        ],
                    }),
                ],
            }))
        })),
    });
}


function generateCodeBloc(reponse) {
    const codeLines = reponse.value.split("\n"); // Divise le code en plusieurs lignes
    console.log(codeLines);
    return new Table({
        alignment: AlignmentType.CENTER,
        width: {
            size: 65,
            type: WidthType.PERCENTAGE, // Définit la largeur
        },
        rows: codeLines.flatMap((line) => [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 5,
                            type: WidthType.PERCENTAGE,
                        },
                        shading: {
                            type: "solid",
                            color: "000000", // Fond noir
                        },
                        children: [
                            new Paragraph({
                                keepLines: true,
                                children: [
                                    new TextRun({
                                        text: "",
                                        font: "Courier New",
                                        size: 10 * 2,
                                        color: "FFFFFF", // Texte blanc
                                    }),
                                ],
                            }),
                        ]
                    }),
                    new TableCell({
                        width: {
                            size: 95,
                            type: WidthType.PERCENTAGE,
                        },
                        shading: {
                            type: "solid",
                            color: "000000", // Fond noir
                        },
                        children: [
                            new Paragraph({
                                keepLines: true,
                                children: [
                                    new TextRun({
                                        text: line,
                                        font: "Courier New",
                                        size: 10 * 2,
                                        color: "FFFFFF", // Texte blanc
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ])
        ,
    });
}



async function generateDoc() {
    let imgBuffer;
    try {
        imgBuffer = await getImageBuffer("/assets/tools/report-filler/image.jpeg");
    } catch (error) {
        console.warn("L'image n'a pas pu être chargée, le document sera généré sans elle");
        imgBuffer = null;
    }

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
                                                    width: 172 * 0.6,
                                                    height: 71 * 0.6,
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
                                        children: [
                                            new TextRun({
                                                font: "Century Gothic",
                                                text: `ING${data.annee} Groupe ${data.groupe}`,
                                            }),
                                        ],
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

    const footer = new Footer({
        children: [
            new Paragraph({
                children: [
                    new TextRun({
                        font: "Century Gothic",
                        text: `Nous attestons que ce travail est original, qu'il est le fruit d'un travail commun au ${
                            data.authors.length == 2 ? "binôme" : "groupe" 
                        } et qu'il a été rédigé de manière autonome.`,
                    }),
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        font: "Century Gothic",
                        text: `Le ${data.date.getDate()}/${data.date.getMonth() + 1}/${data.date.getFullYear()}`,
                    }),
                ],
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

    const footer_d = new Footer({
        children: [
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
        sections: [
            {
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

                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),

                // Ligne horizontale (haut)
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "————————————————————",
                            color: "007a7b",
                            font: "Century Gothic",
                            bold: true,
                            size: 18*2,
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
                            size: 16*2,
                            color: "007a7b",
                        }),
                    ],
                }),
                
                // Sous-titre
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: `TP ${data.numero_tp} : ${data.titre}`,
                            font: "Century Gothic",
                            italics: true,
                            size: 16*2,
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
                            text: "————————————————————",
                            font: "Century Gothic",
                            color: "007a7b",
                            size: 18*2,
                            bold: true,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                }),
                
                // Espace
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),                
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
                
                generateAuthorTable(),
                
                // Espace
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),                
                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),

                ...data.parties.flatMap((partie) => [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: `- ${partie.titre} -`,
                                    bold: true,
                                    size: 14*2,
                                    font: "Century Gothic",
                                }),
                            ],
                        }),
                        new Paragraph({ text: "" }),
                        
                        ...partie.sous_parties.flatMap((sous_partie) => [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: (sous_partie.titre) ?  sous_partie.titre : "",
                                            size: 12*2,
                                            font: "Century Gothic",
                                        }),
                                    ],
                            }) ,
                        ]),
                        new Paragraph({ text: "" }),
                        new Paragraph({ text: "" }),
                ]),  
            ],
        }, {
            properties: {
                type: SectionType.NEXT_PAGE,
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
                default: footer_d,
            },
            children: data.parties.flatMap((partie) => [
                new Paragraph({
                    text: "",
                }),
                new Paragraph({
                    text: "",
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [
                        new TextRun({
                            text: partie.titre,
                            bold: true,
                            size: 12*2,
                            font: "Century Gothic",
                            color: "007a7b",
                        }),
                    ],
                }),
                ...partie.sous_parties.flatMap((sous_partie) => [
                    new Paragraph({
                        text: "",
                    }),
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        children: [
                            new TextRun({
                                text: (sous_partie.titre) ?  sous_partie.titre : "",
                                size: 12*2,
                                font: "Century Gothic",
                                color: "007a7b",
                            }),
                        ],
                    }),
                    ...sous_partie.questions.flatMap((question) => [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: question.nom,
                                    bold: true,
                                    size: 12*2,
                                    font: "Century Gothic",
                                }),
                            ],
                        }),
                        new Paragraph({ text: "" }),
                        ...question.reponse.flatMap((reponse) => [
                            (reponse.type === "text") ? 
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: reponse.value,
                                            size: 12*2,
                                            font: "Century Gothic",
                                        }),
                                    ],
                                })
                                :
                            (reponse.type === "code") ?
                                generateCodeBloc(reponse)
                                :
                            (reponse.type === "image") ?
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: imgBuffer,
                                            transformation: {
                                                width: 172 * 0.6,
                                                height: 71 * 0.6,
                                            },
                                        }),
                                    ],
                                })
                                :
                            new Paragraph({ text: "" }),
                        ]),
                    ]),
                ]),
            ])
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

function addAuthor() {
    const authors = document.getElementById("authors");
    const addBtn = document.getElementById("addAuthBtn");
    addBtn.remove();
    const numbAuth = authors.children.length + 1;
    authors.innerHTML += `
        <div class="duo-input">
            <input type="text" class="author" placeholder="Prénom de l'auteur n°${numbAuth}"/>
            <input type="text" class="author" placeholder="Nom de l'auteur n°${numbAuth}"/>
        </div>
        <div id="addAuthBtn" class="i-wrapper">
            <i class="material-icons" onclick="addAuthor()">add</i>
        </div>
    `;
    document.getElementById("addAuthBtn").addEventListener("click", addAuthor);

}

function addSection() {
    const sections = document.getElementById("fileContent");
    const addBtn = document.getElementById("addSectBtn");
    addBtn.remove();
    const number = sections.children.length;
    sections.innerHTML += `
        <article id="artSec${number}">
            <input id="sec${number}" type="text" class="fill" placeholder="Nom de la partie"/>
            <div class="duo-input">
                <input id="sec${number}AddPartBtn" type="button" class="section" value="Ajouter une sous-partie"/>
                <input id="sec${number}AddContBtn" type="button" class="section" value="Ajouter du contenu"/>
            </div>
            <div id="subSections${number}">
            </div>
        </article>
        <div id="addSectBtn" class="i-wrapper">
            <i class="material-icons" onclick="">add</i>
        </div>
        <div id="orphanContent${number}">
        </div>
    `;
    document.getElementById("addSectBtn").addEventListener("click", addSection);
    document.getElementById(`sec${number}AddPartBtn`).addEventListener("click", addSubSection);
    document.getElementById(`sec${number}AddContBtn`).addEventListener("click", addContent);
}

function addSubSection() {
    const cliked = this.id;
    const number = cliked.split("sec")[1].split("Add")[0];
    const subNumber = document.getElementById(`subSections${number}`).children.length;
    const subSections = document.getElementById(`subSections${number}`);
    subSections.innerHTML += `
        <div id="subSec${number}.${subNumber}">
            <input id="sec${number}.${subNumber}" type="text" class="fill" placeholder="Nom de la sous-partie"/>
            <input id="sec${number}.${subNumber}AddContBtn" type="button" class="fill" value="Ajouter du contenu"/>
        </div>
    `;
}


function addContent() {
    const cliked = this.id;
    const fulln = cliked.split("sec")[1].split("Add")[0];
    if (fulln.includes(".")) {
        const number = fulln.split(".")[0];
        const subNumber = fulln.split(".")[1];
        const content = document.getElementById(`subSec${number}.${subNumber}`);
        content.innerHTML += `
            <div id="contSec${number}.${subNumber}">
                <input id="sec${number}.${subNumber}.cont" type="text" class="fill" placeholder="Nom de la question"/>
                <input id="sec${number}.${subNumber}.contAddBtn" type="button" class="fill" value="Ajouter une réponse"/>
            </div>
        `;
        document.getElementById(`sec${number}.${subNumber}.contAddBtn`).addEventListener("click", addResponse);
    } else {
        const content = document.getElementById(`orphanContent${fulln}`);
        const number = content.children.length;
        content.innerHTML += `
            <div id="orphan${fulln}.${number}">
                <input id="orphan${fulln}.${number}Cont" type="text" class="fill" placeholder="Nom de la question"/>
                <div class="duo-input">
                    <input id="orphan${fulln}.${number}ContType" type="button" class="section" value="Type"/>
                    <input id="orphan${fulln}.${number}ContValue" type="text" class="section" placeholder="Texte"/>
                </div>
            </div>
        `;
    }
}




function init() {
    document.getElementById("addAuthBtn").addEventListener("click", addAuthor);
    document.getElementById("addSectBtn").addEventListener("click", addSection);
    document.getElementById("sec1AddPartBtn").addEventListener("click", addSubSection);
    document.getElementById("sec1AddContBtn").addEventListener("click", addContent);
}

init()
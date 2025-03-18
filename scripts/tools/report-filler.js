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



async function generateDoc(data) {
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


function onWordDl() {
    const data = getData();
    generateDoc(data);
}

function updateTitle(event) {
    const pElement = event.target.previousElementSibling;
    const newTitle = prompt("Entrez le nouveau titre:", pElement.textContent);
    if (newTitle) {
        pElement.textContent = newTitle;
        updateData();
    }
}
let data = {
    parties: [],
};



function createHtmlFromData(data) {
    const contentSect = document.querySelector(".content-sect");
    contentSect.innerHTML = "";

    data.parties.forEach((partie) => {
        const partDetails = document.createElement("details");
        partDetails.classList.add("parts-details");
        partDetails.innerHTML = `
            <summary class="parts-title">
                <p>${partie.titre}</p>
                <i class="material-icons">edit</i>
            </summary>
            <button class="btn add-sub-part">Ajouter une sous-partie</button>
            <button class="btn add-content">Ajouter du contenu</button>
        `;

        partie.sous_parties.forEach((sousPartie) => {
            const subPartDetails = document.createElement("details");
            subPartDetails.classList.add("parts-details");
            subPartDetails.innerHTML = `
                <summary class="parts-title">
                    <p>${sousPartie.titre}</p>
                    <i class="material-icons">edit</i>
                </summary>
                <button class="btn add-content">Ajouter du contenu</button>
            `;

            sousPartie.questions.forEach((question) => {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");
                questionDiv.innerHTML = `
                    <p>${question.nom}</p>
                    <i class="material-icons">edit</i>
                `;
                subPartDetails.insertBefore(questionDiv, subPartDetails.querySelector(".btn.add-content"));
            });

            partDetails.insertBefore(subPartDetails, partDetails.querySelector(".btn.add-sub-part"));
        });

        contentSect.insertBefore(partDetails, contentSect.querySelector(".btn.add-part"));
    });

    contentSect.innerHTML += `
        <button class="btn add-part">Ajouter une partie</button>
    `;
}



function createContentItem() {
    const contentItem = document.createElement("div");
    contentItem.classList.add("content-item");
    contentItem.innerHTML = `
        <label for="content_type">Type de contenu</label>
        <select id="content_type" name="content_type">
            <option value="text">Texte</option>
            <option value="math">Math</option>
            <option value="image">Image</option>
            <option value="code">Code</option>
        </select>
        <textarea id="content_value" name="content_value" placeholder="Contenu"></textarea>
        <button class="btn move-up">Monter</button>
        <button class="btn move-down">Descendre</button>
        <button class="btn delete-content">Supprimer</button>
    `;
    return contentItem;
}

function addContentItem(event) {
    const contentList = event.target.closest(".question-edit-panel").querySelector(".content-list");
    const contentItem = createContentItem();
    contentList.appendChild(contentItem);
    initContentItemActions(contentItem);
}

function deleteContentItem(event) {
    const contentItem = event.target.closest(".content-item");
    contentItem.remove();
}

function moveContentItemUp(event) {
    const contentItem = event.target.closest(".content-item");
    const previousItem = contentItem.previousElementSibling;
    if (previousItem) {
        contentItem.parentNode.insertBefore(contentItem, previousItem);
    }
}

function moveContentItemDown(event) {
    const contentItem = event.target.closest(".content-item");
    const nextItem = contentItem.nextElementSibling;
    if (nextItem) {
        contentItem.parentNode.insertBefore(nextItem, contentItem);
    }
}

function saveQuestion(event) {
    const editPanel = event.target.closest(".question-edit-panel");
    const questionTitle = editPanel.querySelector("#question_title").value;
    const contentItems = editPanel.querySelectorAll(".content-item");
    const reponses = [];
    contentItems.forEach((item) => {
        const type = item.querySelector("#content_type").value;
        const value = item.querySelector("#content_value").value;
        reponses.push({
            type: type,
            value: value,
        });
    });

    const questionElement = document.querySelector(".question-editing");
    questionElement.querySelector("p").textContent = questionTitle;
    questionElement.dataset.reponses = JSON.stringify(reponses);
    questionElement.classList.remove("question-editing");

    updateData();
    editPanel.style.display = "none";
}

function initContentItemActions(contentItem) {
    contentItem.querySelector(".delete-content").addEventListener("click", deleteContentItem);
    contentItem.querySelector(".move-up").addEventListener("click", moveContentItemUp);
    contentItem.querySelector(".move-down").addEventListener("click", moveContentItemDown);
}

function initQuestionEditPanelActions() {
    document.querySelectorAll(".add-content-item").forEach((button) => {
        button.addEventListener("click", addContentItem);
    });
    document.querySelectorAll(".save-question").forEach((button) => {
        button.addEventListener("click", saveQuestion);
    });
}




function addPart() {
    const section = document.querySelector(".content-sect");
    const newPart = document.createElement("details");
    newPart.classList.add("parts-details");
    newPart.innerHTML = `
        <summary class="parts-title">
            <p>Nouvelle Partie</p>
            <i class="material-icons">edit</i>
        </summary>
        <button class="btn add-sub-part">Ajouter une sous-partie</button>
        <button class="btn add-content">Ajouter du contenu</button>
    `;
    section.insertBefore(newPart, section.querySelector(".btn"));
    initTitleModif();
    initAddSubPart();
    initAddContent();
}

function addSubPart(event) {
    const part = event.target.closest(".parts-details");
    const newSubPart = document.createElement("details");
    newSubPart.classList.add("parts-details");
    newSubPart.innerHTML = `
        <summary class="parts-title">
            <p>Nouvelle Sous-partie</p>
            <i class="material-icons">edit</i>
        </summary>
        <button class="btn add-content">Ajouter du contenu</button>
    `;
    part.insertBefore(newSubPart, event.target);
    initTitleModif();
    initAddContent();
}

function addContent(event) {
    const subPart = event.target.closest(".parts-details");
    const newContent = document.createElement("div");
    newContent.classList.add("question");
    newContent.innerHTML = `
        <p>Nouvelle Question</p>
        <i class="material-icons">edit</i>
    `;
    subPart.insertBefore(newContent, event.target);
    newContent.querySelector("i").addEventListener("click", editQuestion);
    initTitleModif();
}

function initAddPart() {
    document.querySelector(".content-sect > .btn").addEventListener("click", addPart);
}

function initAddSubPart() {
    document.querySelectorAll(".add-sub-part").forEach((button) => {
        button.addEventListener("click", addSubPart);
    });
}

function initAddContent() {
    document.querySelectorAll(".add-content").forEach((button) => {
        button.addEventListener("click", addContent);
    });
}


function initTitleModif() {
    document.querySelectorAll(".parts-title i").forEach((icon) => {
        icon.addEventListener("click", updateTitle);
    });
}




function editQuestion(event) {
    const question = event.target.closest(".question");
    document.querySelectorAll(".question").forEach((q) => q.classList.remove("question-editing"));
    question.classList.add("question-editing");

    const editPanel = document.querySelector(".question-edit-panel");
    editPanel.style.display = "flex";
    
    const questionTitle = question.querySelector("p").textContent;
    editPanel.querySelector("#question_title").value = questionTitle;
    
    const contentList = editPanel.querySelector(".content-list");
    contentList.innerHTML = "";
    
    let responses = [];
    if (question.dataset.reponses) {
        try {
            responses = JSON.parse(question.dataset.reponses);
        } catch (e) {
            console.error("Error parsing question responses:", e);
        }
    }
    
    if (responses.length > 0) {
        responses.forEach(response => {
            const contentItem = createContentItem();
            contentItem.querySelector("#content_type").value = response.type;
            contentItem.querySelector("#content_value").value = response.value;
            contentList.appendChild(contentItem);
            initContentItemActions(contentItem);
        });
    } else {
        const contentItem = createContentItem();
        contentList.appendChild(contentItem);
        initContentItemActions(contentItem);
    }
}

function updateData() {
    const sections = document.querySelectorAll(".content-sect > details");
    const parts = [];
    
    sections.forEach((section) => {
        const partTitle = section.querySelector(".parts-title > p").textContent;
        const subSections = section.querySelectorAll("details");
        const subParts = [];
        
        const directQuestions = Array.from(section.children)
            .filter(el => el.classList && el.classList.contains("question"));
        
        subSections.forEach((subSection) => {
            const subPartTitle = subSection.querySelector(".parts-title > p").textContent;
            const questions = subSection.querySelectorAll(".question");
            const questionsList = [];
            
            questions.forEach((question) => {
                let responses = [];
                if (question.dataset.reponses) {
                    try {
                        responses = JSON.parse(question.dataset.reponses);
                    } catch (e) {
                        console.error("Error parsing responses:", e);
                        responses = [{
                            type: "text",
                            value: ""
                        }];
                    }
                } else {
                    responses = [{
                        type: "text",
                        value: ""
                    }];
                }
                
                questionsList.push({
                    nom: question.querySelector("p").textContent,
                    reponse: responses
                });
            });
            
            subParts.push({
                titre: subPartTitle,
                questions: questionsList
            });
        });
        
        const directQuestionsList = [];
        directQuestions.forEach((question) => {
            let responses = [];
            if (question.dataset.reponses) {
                try {
                    responses = JSON.parse(question.dataset.reponses);
                } catch (e) {
                    console.error("Error parsing responses:", e);
                    responses = [{
                        type: "text",
                        value: ""
                    }];
                }
            } else {
                responses = [{
                    type: "text",
                    value: ""
                }];
            }
            
            directQuestionsList.push({
                nom: question.querySelector("p").textContent,
                reponse: responses
            });
        });
        
        if (directQuestionsList.length > 0) {
            subParts.push({
                titre: "",
                questions: directQuestionsList
            });
        }
        
        parts.push({
            titre: partTitle,
            sous_parties: subParts
        });
    });
    
    data.parties = parts;
    console.log("Updated data:", data);
}

function init() {
    if (!data.parties || data.parties.length === 0) {
        data = {
            annee: "",
            groupe: "",
            date: new Date(),
            numero_tp: "",
            titre: "",
            enseignant: "",
            authors: [],
            parties: []
        };
    }
    
    createHtmlFromData(data);
    
    initAddPart();
    initAddSubPart();
    initAddContent();
    initTitleModif();
    
    document.querySelectorAll(".question i").forEach((icon) => {
        icon.addEventListener("click", editQuestion);
    });
    
    initQuestionEditPanelActions();
    
    document.getElementById("wordDl").addEventListener("click", onWordDl);
}

function getData() {
    const authors = document.getElementsByClassName("author");
    const authorList = [];
    for (let i = 0; i < authors.length; i += 2) {
        authorList.push({
            prenom: authors[i].value,
            nom: authors[i + 1].value,
        });
    }
    
    updateData();
    
    return {
        annee: document.getElementById("annee").value,
        groupe: document.getElementById("groupe").value,
        date: new Date(),
        numero_tp: document.getElementById("numero_tp").value,
        titre: document.getElementById("titre").value,
        enseignant: document.getElementById("enseignant").value,
        authors: authorList,
        parties: data.parties
    };
}

init();
async function loadfrag(fileName) {
    try {

        const response = await fetch(`fragments/${fileName}.html`, {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
                
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch frag: ${response.statusText}`);
        }
        const frag = await response.text();
        document.head.innerHTML += frag;
        customElements.define(
            `frag-${fileName.toLowerCase().replaceAll(/_/g, "-")}`,
            class extends HTMLElement {
                constructor() {
                    super();
                    let frag = document.getElementById(fileName.replaceAll(/_/g, "-"));
                    let fragContent = frag.content;

                    const shadowRoot = this.attachShadow({ mode: "open" });
                    shadowRoot.appendChild(fragContent.cloneNode(true));
                }
            },
        );

        if (!frag) throw new TypeError('No frag element found');      

        return frag;
    } catch (error) {
        console.error(error)
        return null
    }
}

async function addStyle(fileName) {
    try {
        const response = await fetch(`styles/fragements/${fileName}.css`, {
            method: "GET",
            headers: {
                "Content-Type": "text/css",
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch style: ${response.statusText}`);
        }
        const style = await response.text();
        document.head.innerHTML += `<style from="${fileName}">${style}</style>`;

        if (!style) throw new TypeError('No style element found');      

        return style;
    } catch (error) {
        console.error(error)
        return null
    }
}

async function addfrags() {
    const fragsUrl = [
        "course_info",
        "grade_gauge",
        "upcoming_class"
    ];

    for (let i = 0; i < fragsUrl.length; i++) {
        await loadfrag(fragsUrl[i]);
        // await addStyle(fragsUrl[i]);
    }
    return fragsUrl.length;
}




addfrags();
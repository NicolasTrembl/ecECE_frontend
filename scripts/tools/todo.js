var allset = false;

function addBtnSelected() {
    const btns = document.getElementsByClassName('todo-btn');

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener('click', function() {
            if (this.classList.contains('btn-selected')) {
                this.classList.remove('btn-selected');
                if (this.classList.contains('radio')) {
                    const rad = document.getElementsByClassName('radio');
                    const radS = Array.from(rad).filter(r => r !== this)[0];
                    radS.classList.add('btn-selected');
                }
            }
            else {
                this.classList.add('btn-selected');
                if (this.classList.contains('radio')) {
                    const rad = document.getElementsByClassName('radio');
                    const radS = Array.from(rad).filter(r => r !== this)[0];
                    radS.classList.remove('btn-selected');
                }
            }
        });
    }
}



function setAll() {
    if (allset) { 
        document.removeEventListener('mousemove', setAll);
        return;
    }
    console.log('setting all');
    allset = true;
    addBtnSelected();
    const toggleButton = document.getElementById("toggle-menu");
    const topOptions = document.querySelector(".top-options");

    let isHidden = true;

    toggleButton.addEventListener("click", () => {
        if (!isHidden) {
            // Masquer avec animation
            topOptions.classList.add("hidden");
            setTimeout(() => {
                topOptions.classList.add("hide-complete"); // Supprime de l'affichage après animation
            }, 300);
            toggleButton.textContent = "Afficher";
        } else {
            // Afficher avec animation
            topOptions.classList.remove("hide-complete");
            setTimeout(() => {
                topOptions.classList.remove("hidden");
            }, 10);
            toggleButton.textContent = "Masquer";
        }
        isHidden = !isHidden;
    });
}


document.addEventListener('mousemove', setAll);


const start = document.getElementById("start-stop");
const reset = document.getElementById("reset");
const showOptions = document.getElementById("show-options");
const option =  document.getElementById("option");

function showOption() {
    option.classList.add("shown");
    start.style.display = "block";
    showOption.style.display = "none";
}


function hideOption() {
    option.classList.remove("shown");
    start.style.display = "none";
    showOption.style.display = "block";
}

showOptions.addEventListener("click", showOption);
start.addEventListener("click", hideOption);

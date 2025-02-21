import { homeBuild } from "home";
import { loginBuild } from "login";

const content = document.getElementById('content');
const loadTemplateUrl = './load-template.php';

const routes = {
    '': 'home',
    '/': 'home',
    '/login': 'login',
    '/not-found': 'not-found',
    '/calendar': 'calendar',
    '/courses': 'courses',
    '/grades': 'grades',
    '/account': 'account',
    '/settings': 'settings',
}

const changingNav = [
    "calendar",
    "courses",
    "grades",
    "account",
    "settings"
]

function navigate(path) {

    if (!routes[path]) {
        console.error("Route inconnue :", path);
        navigate("/not-found");
        return;
    }

    if (routes[path] === "home") {
        if (changingNav.includes(routes[window.location.pathname])) {
            document.getElementById(routes[window.location.pathname])
                .classList.remove("selected-icon");
        } 
    }

    if (changingNav.includes(routes[path])) {
        if (changingNav.includes(routes[window.location.pathname])) {
            document.getElementById(routes[window.location.pathname])
                .classList.remove("selected-icon");
        }   
        document.getElementById(routes[path]).classList.add("selected-icon");
    }


    
    if (path !== window.location.pathname) {
        history.pushState({}, "", path);
    }


    fetch(`${loadTemplateUrl}?template=${routes[path]}`)
        .then(response => response.text())
        .then(data => {
            content.innerHTML = data;
            handleBuilders();
            handleClicks();
        })
        .catch(error => console.error("Erreur de chargement :", error));
}

function onClicked(e) {
    var isRoute = false;
    var route = null;
    var parent = e.target;
    while (parent) {
        if (parent.tagName === "A" && parent.dataset.route !== undefined) {
            isRoute = true;
            route = parent.getAttribute("href");
            break;
        }
        parent = parent.parentElement
    }
    if (isRoute) {
        e.preventDefault();
        navigate(route);
    }
}

function handleClicks() {
    document.removeEventListener("click", onClicked);
    document.addEventListener("click", onClicked);
}

function handleBuilders() {
    switch (window.location.pathname) {
        case "/":
        case "":
            homeBuild();
        break;
        case "/login":
            loginBuild();
        break;
    
        default:
            break;
    }
}

window.addEventListener("popstate", () => {
    const path = window.location.pathname;
    console.log("poped", path);
    navigate(path);
});



// CHECK IF USER IS CONNECTED

const token = getCookie("token");
if (token) {
    console.log("User connected");
    handleClicks();
    navigate(window.location.pathname);
} else {
    navigate("/login");
}
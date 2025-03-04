/**
 * Code responsible for the navigation between the different pages of the website.
 * It also do a basic check to see if the user is connected or not. 
 * 
*/

import { homeBuild } from "home";
import { loginBuild } from "login";
import { checkToken } from "api_caller";

const content = document.getElementById('content');
const loadTemplateUrl = './load-template.php';

const routes = {
    '': 'home',
    '/': 'home',
    '/login': 'login',
    '/connexion': 'login',
    '/not-found': 'not-found',
    '/404': 'not-found',
    '/calendar': 'calendar',
    '/calendrier': 'calendar',
    '/courses': 'courses',
    '/cours': 'courses',
    '/grades': 'grades',
    '/notes': 'grades',
    '/tools': 'tools',
    '/outils': 'tools',
    '/account': 'account',
    '/compte': 'account',
    '/settings': 'settings',
    '/parametres': 'settings',
    '/tools/pomodoro-timer': 'tools/pomodoro-timer',
    '/timer': 'tools/pomodoro-timer',
    '/tools/report-filler': 'tools/report-filler',
    '/apps/room-finder': 'tools/room-finder',

}

const titles = {
    'home': 'ECE',
    'login': 'Connexion',
    'not-found': 'Introuvable',
    'calendar': 'Calendrier',
    'courses': 'Cours',
    'grades': 'Notes',
    'tools': 'Outils',
}

const changingNav = [
    "calendar",
    "courses",
    "grades",
    "tools",
    "account",
    "settings"
]

function navigate(rawPath) {
    const path = rawPath.split("?")[0];
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

    const h1 = document.querySelectorAll("h1");
    var title = titles[routes[path]] ?? "ECE";
    h1[0].innerText = title;
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



    fetch(`/${loadTemplateUrl}?template=${routes[path]}${rawPath.includes("?") ? "&" + rawPath.split("?")[1] : ""}`)
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
        if (parent.dataset.route !== undefined && parent.dataset.route !== "") {
            isRoute = true;
            route = parent.dataset.route;
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
    console.log("Building page ", window.location.pathname);
    switch (window.location.pathname) {
        case "/":
        case "":
            homeBuild();
        break;
        case "/login":
            loginBuild();
        break;
        case "/tools/pomodoro-timer":
            import("/scripts/tools/pomodoro.js");
            break;
        case "/tools/report-filler":
            import("/scripts/tools/report-filler.js");
            break;
        case "/apps/room-finder":
            import("/scripts/tools/room-finder.js");
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

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    
    if (routes[path]) {
        navigate(path); // 🔥 Charge la bonne page
    } else {
        navigate('/not-found'); // 🔥 Gère les erreurs si nécessaire
    }
});



// CHECK IF USER IS CONNECTED

const token = getCookie("token");
if (token) {
    handleClicks();
    navigate(window.location.pathname);
} else {
    navigate("/login");
}

checkToken(token).then(function (works) {
    if (!works) {
        // delete token
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
    } 
});
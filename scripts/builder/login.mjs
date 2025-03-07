import { getToken } from "api_caller";

function submitLogin() {
    const email = document.getElementById('email_in').value;
    const password = document.getElementById('password_in').value;
    const remember = document.getElementById('remember_me').checked;

    const data = {
        email,
        password,
        remember
    };


    getToken(data, (token) => {
        if (token) {
            console.log("Connecter");
            if (history.state && (!history.state.path_from || history.state.path_from === "/login")) {
                // alert("Go to home");
                history.pushState({path_from: "/"}, "", "/");
                history.replaceState({path_from: "/"}, "", "/");
                history.go();

            } else {
                // alert("Go back");
                history.back();
            }    
        }
    });
}


function loginBuild(path_from) {
    path_from = path_from;
    
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");


    if (email && password) {
        console.log("Auto login");
        const data = {
            email: email,
            password: password,
            remember: true
        };
        getToken(data, (token) => {
            if (token) {
                console.log("Connecter");
                if (history.state && (!history.state.path_from || history.state.path_from === "/login")) {
                    history.pushState({path_from: "/"}, "", "/");
                    history.replaceState({path_from: "/"}, "", "/");
                    history.go();
                } else {
                    // alert("Go back");
                    history.back();
                }    
            } else {
                alert("Error");
            }
        });
    }

    const form = document.getElementById('login_form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitLogin();
    });

}

export { loginBuild };
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
            history.back();
        }
    });
}


function loginBuild(path_from) {
    console.log("BUILDING LOGIN");
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
                history.back();            
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
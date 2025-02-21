const endpoint = "http://localhost:3000"

async function getToken(data, callback = (token) => {}) {
    const mail = data.email;
    var password = data.password;
    const remember = data.remember;

    // C'est pas sécurisé mais c'est pas grave
    const key = "ljkbdkunygqzeif65ez4f68qze4fqef6ze";
    var encrypted = null;
    if (remember && localStorage.getItem("password")) {
        encrypted = localStorage.getItem("password");
    } else {
        encrypted = encrypted = CryptoJS.AES.encrypt(password, key).toString();
    }
    if (remember) {
        localStorage.setItem("email", mail);
        localStorage.setItem("password", encrypted);
    } 
    

    var option = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: mail, 
            encryptedPassword: encrypted
        }),
    }

    var log = await fetch(`${endpoint}/login`, option);
    var json = await log.json();

    var token = null;

    if (log.status == "200") {
        token = json["token"];
        document.cookie = `token=${token}`;
    }

    callback(token);
    return token;

}

async function getGrades(token, callback = (grades) => {}) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    const response = await fetch(`${endpoint}/notes`, options);
    const data = await response.json();
    callback(data);
    return data;
}

async function getCalendar(callback = (calendar) => {}) {
    var localCal = localStorage.getItem("calendar");
    if (localCal && localCal["savedAt"] && localCal["savedAt"] > Date.now() - 1000 * 60 * 30 * 1) {
        console.log("Using localCal storage");
        getCalendarEvents(localCal["data"]);
        return true;
    }

    var localOptions = JSON.parse(localStorage.getItem("settings"));
    if (!localOptions || !localOptions["icalUrl"]) {
        let url = prompt("Merci d'entrer le lien vers l'ical", "");
        if (url == null || url == "") {
            return false;
        }
        localOptions = {
            icalUrl: url
        };
        localStorage.setItem("settings", JSON.stringify(localOptions));
    }


    const url = encodeURIComponent(localOptions["icalUrl"]);
    var response = await fetch(`${endpoint}/calendar?url=${url}`);
    var text = await response.text();


    if (response.status != 200) {
        console.error("Erreur :", text);
        return false;
    }


    localStorage.setItem("calendar", JSON.stringify({
        savedAt: Date.now(),
        data: text
    }));

    callback(text);


    return text;
}

async function getCourses(token, callback = (courses) => {}) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    const response = await fetch(`${endpoint}/courses`, options);
    const data = await response.json();
    callback(data);
    return data;
}

export { getToken, getGrades, getCalendar, getCourses };
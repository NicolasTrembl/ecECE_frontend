import { getToken, getGrades, getCalendar, getCourses } from "api_caller";
import { getCookie } from "utils";
import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

/* GRADES */

function getLastSemester(semesters) {
    var thisYears = semesters.sort((a, b) => {
        parseInt(a["year"]) > parseInt(b["year"]);
    });
    var lastYear = thisYears[0]["year"];
    var last = [];
    for (let i = 0; i < thisYears.length; i++) {
        if (thisYears[i]["year"] == lastYear) {
            last.push(thisYears[i]);
        }
    }

    if (last.length == 0) {
        console.log("No semester found");
        return last;
    }
    if (last.length == 1) {
        console.log("Semester 1 found - unique");

        return last[0];

    }
    if (last[1]["name"].includes("Semestre 2")) {
        console.log("Semester 2 found");
        return last[1];
    } else {
        console.log("Semester 1 found");
        return last[0];
    }
}

function addSem(sem, curr){
    const selecter = document.getElementById("semester-select");
    selecter.innerHTML = "";
    for (let i = 0; i < sem.length; i++) {
        const element = sem[i];
        selecter.innerHTML += `
        <option value="${element["name"]}">
        ${element["name"]}
        </option>
        `
    }
    selecter.value = curr["name"];
    selecter.addEventListener("change", updateGrades);
}


function updateGrades(){
    const selecter = document.getElementById("semester-select");
    const sem = selecter.value;
    console.log(sem);
    var grades = JSON.parse(localStorage.getItem("grades"));
    if (grades == null || grades == undefined) {
        return;
    }
    fillGauges(grades["semesters"].find(e => e["name"] == sem));
}

function showMin(name) {
    name = name.split("/")[0].trim().toUpperCase();
    return (name == "MODULE SCIENCES ET TECHNIQUES" || name == "MODULE SCIENCES & TECHNIQUES");
}



function fillGauges(sem) {
    const div = document.getElementById("grade-gauges-panel");
    const css = document.createElement('style');

    div.innerHTML = "";
    var real_moy = 0;
    var modWeight = 0;
    if (!sem || !sem["modules"]) {
        div.innerHTML = `
            <frag-grade-gauge id="moy-gen">
                <h3 slot="title">Moyenne générale</h3>
                <span slot="grade">?? / 20</span>
            </frag-grade-gauge>
            <div class="separator-vertical-d"></div>
                        
        ` + div.innerHTML;

        css.innerText += `
            #moy-gen {
                --size: 14vw;
                --percent: 0;
                --min-col: transparent;
                --thickness: 2rem;
                --min: 0deg;
            }
        `
        return;
    };
    const modules = sem["modules"];

    document.head.appendChild(css);
    for (var i = 0; i < modules.length; i++) {
        const module = modules[i];
        var avrage = 0;
        var totalWeight = 0;
    
        for (let courseIndex = 0; courseIndex < module["courses"].length; courseIndex++) {
            const element = module["courses"][courseIndex];
            var m_avrage = 0;
            var m_weight = 0;
    
            for (let evalIndex = 0; evalIndex < element["evaluations"].length; evalIndex++) {
                const note = element["evaluations"][evalIndex];
                var c_avrage = 0;
                var c_weight = 0;
    
                for (let gradeIndex = 0; gradeIndex < note["grades"].length; gradeIndex++) {
                    const n = note["grades"][gradeIndex];
                    c_avrage += n["grade"] * n["weight"];
                    c_weight += n["weight"];
                }
    
                if (c_weight > 0) {
                    m_avrage += (c_avrage / c_weight) * note["coefficient"];
                    m_weight += note["coefficient"];
                }
            }
    
            if (m_weight > 0) {
                avrage += (m_avrage / m_weight) * element["credits"];
                totalWeight += element["credits"];
            }
        }

        
        const moy = totalWeight > 0 ? avrage / totalWeight : "Pas de notes disponibles";
        if (!isNaN(moy)) {
            real_moy += moy * totalWeight;
            modWeight += totalWeight;
        }
        var name = module["name"].toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        div.innerHTML += `
                    <frag-grade-gauge class="moy" id="moy-${i+1}">
                        <h3 slot="title">${name}</h3>
                        <span slot="grade">${!isNaN(moy) ? moy.toFixed(2) : "??"}/20</span>
                    </frag-grade-gauge>
        `

        css.innerText += `
            #moy-${i+1} {
                --percent: ${!isNaN(moy) ? moy/20*100 : 0}; 
                --min: calc(${(showMin(module["name"])) ? `50` : "0"} * 2 * 1.35deg);
                ${module["name"] != "MODULE SCIENCES ET TECHNIQUES" ? "--min-col: transparent;" : "--min-col: rgba(255, 255, 0, 0.3);"}
            }

        `   

    }

    real_moy /= modWeight;

    div.innerHTML = `
        <frag-grade-gauge id="moy-gen">
            <h3 slot="title">Moyenne générale</h3>
            <span slot="grade">${isNaN(real_moy) ? 0 :  real_moy.toFixed(2)} / 20</span>
        </frag-grade-gauge>
        <div class="separator-vertical-d"></div>
                    
    ` + div.innerHTML;

    css.innerText += `
        #moy-gen {
            --percent: ${isNaN(real_moy) ? "0" : real_moy/20*100} !important;
        }
    `

}

/* CALENDAR */

function getCalendarEvents(icsData) {
    if (!icsData || icsData == "URL non définie") return [];
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const events = vevents.map(event => {
        const vevent = new ICAL.Event(event);
        return {
            summary: vevent.summary,
            location: vevent.location,
            description: vevent.description,
            start: vevent.startDate.toString(),
            end: vevent.endDate.toString(),
        };
    });


    return events;
}

async function isCal() {
    var localCal = JSON.parse(localStorage.getItem("calendar"));
    return localCal && localCal["savedAt"] && localCal["savedAt"] > Date.now() - 1000 * 60 * 30 * 1;
}


function getIcon(course) {
    try {
        const settings = JSON.parse(localStorage.getItem("settings"));
        const coursesToIcon = settings["coursesToIcon"];
        if (coursesToIcon[course]) {
            return coursesToIcon[course];
        } else {
            return coursesToIcon["default"];
        }
    } catch (e) {
        return "cable";
    }
}

function pad(num, size) {
    // http://stackoverflow.com/questions/2998784/ddg#2998822
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function getNextCoursesHtmlTemplate(course) {
    var matiere = null;
    var enseignant = null;
    var salle = null;
    var td = null;
    var type = null;


    var active = !course["description"].includes("Reporté");

    var splitted = course["description"].split("\n");

    for (let i = 0; i < splitted.length; i++) {
        const element = splitted[i];
        if (element.includes("Matière")) {
            matiere = element.split(":")[1].trim();
        }
        if (element.includes("Enseignant")) {
            enseignant = element.split(":")[1].trim();
        }
        if (element.includes("Salle")) {
            salle = element.split(":")[1].trim().split(" - ")[1].trim();
        }
        if (element.includes("TD")) {
            td = element.split(":")[1].trim();
        }
        if (element.includes("Type")) {
            type = element.split(":")[1].trim();
        }
    }

    var startAt = new Date(course["start"]);
    var endAt = new Date(course["end"]);
    const now = new Date();


    var dateInfo = "";
    if (startAt.getDate() == now.getDate()) {
        // dateInfo = "Aujourd'hui,";
        if (now < startAt) {
            if (startAt - now < 1000 * 60 * 60) {
                dateInfo += `Dans ${now.getMinutes() -startAt.getMinutes()}min`;
            } else {

                dateInfo += `A ${startAt.getHours()}h${pad(startAt.getMinutes(), 2)}`;
            }
        } else if (now < endAt) {
            var diffMin = (endAt.getMinutes() + endAt.getHours() * 60) - (now.getMinutes() + now.getHours() * 60); 
            dateInfo += `Fin dans ${(diffMin - (diffMin%60))/60}h${pad(diffMin%60, 2)}`;
        } else {
            dateInfo += `Fini à ${endAt.getHours()}"h"${endAt.getMinutes()}`;
        }
    } else if (startAt.getDate() == now.getDate() + 1) {
        dateInfo = "Demain,";
        dateInfo += ` à ${startAt.getHours()}h${pad(startAt.getMinutes(), 2)}`;
        
    } else if (startAt > now) {
        var diffDays = parseInt((startAt - now) / (1000 * 60 * 60 * 24), 10); 
        if (diffDays <= 5) {
            dateInfo = `Dans ${diffDays} jours, à ${startAt.getHours()}h${pad(startAt.getMinutes(), 2)}`;

        } else {
            dateInfo = `Le ${pad(startAt.getDate(), 2)}/${pad(startAt.getMonth() + 1, 2)} à ${startAt.getHours()}h${pad(startAt.getMinutes(), 2)}`;
        }
    } else {
        dateInfo = `Fini le ${endAt.getDate()}/${endAt.getMonth() + 1} à ${endAt.getHours()}h${pad(endAt.getMinutes(), 2)}`;
    }

    if (salle.includes(" ")) {
        salle = salle.split(" ")[0];
    } 

    var out = `
    <frag-upcoming-class>
        <i    slot="icon" class="material-icons">${getIcon(matiere)}</i>
        <h3   slot="title">${matiere}</h3>
        <span slot="teacher">${enseignant}</span>
        <a href="./apps/room-finder?room=${salle}" slot="room">${salle}</a>
        <span slot="date">${dateInfo}</span>
        <span slot="number">${type}</span>
    </frag-upcoming-class>`;
    return active ? out : "<s>" + out + "</s>";
}


function getNextClasses(courses){
    const now = new Date();
    const next = courses.filter(e => new Date(e.end) >= now );
    
    return next;
}

function getUpcomingClasses(courses){
    if (!courses || courses == undefined || courses.length == 0) return [];

    var next = getNextClasses(courses);
    const panel = document.getElementById("upcoming-courses-panel");
    
    var classesToday = next.filter(e => 
        new Date(e.start).getDate() == new Date().getDate() && 
        new Date(e.start).getMonth() == new Date().getMonth() && 
        new Date(e.start).getFullYear() == new Date().getFullYear()
    );

    classesToday.sort((a, b) => new Date(a.start) - new Date(b.start));

    if (classesToday.length == 0) {
        console.log("No classes today");
        panel.innerHTML = "Pas de cours aujourd'hui";
        return;
    }
    panel.innerHTML = "";
    for (let i = 0; i < classesToday.length; i++) {
        const element = classesToday[i];
        panel.innerHTML += getNextCoursesHtmlTemplate(element);
    }

    if (classesToday.length >= 6) return;

    var sep = document.getElementById("sep-days");
    sep.innerHTML = `
        <i class="material-icons">
            more_vert
        </i>    
    `
    sep.setAttribute("class", "vertical-dots");

    var classesNext = next.filter(e => 
        new Date(e.start) > new Date() && 
        !(new Date(e.start).getDate() == new Date().getDate() &&
        new Date(e.start).getMonth() == new Date().getMonth() &&
        new Date(e.start).getFullYear() == new Date().getFullYear())
    );
    classesNext.sort((a, b) => new Date(a.start) - new Date(b.start));
    classesNext = classesNext.slice(0, 5 - classesToday.length);

    const panelNext = document.getElementById("classes-after");
    panelNext.innerHTML = "";
    for (let i = 0; i < classesNext.length; i++) {
        const element = classesNext[i];
        panelNext.innerHTML += getNextCoursesHtmlTemplate(element);
    }


}

function getRecentClasseHtmlTemplate(course) {
    var out = `
    <frag-course-info>
        <img slot="icon" src="${course.imageUrl}" width="45px">
        <h3   slot="title">${course.title}</h3>
        <span slot="imod-OpenAt">Ouvert: Inconnu</span>
        <a slot="imod-Link" href="${course.link}">Lien</a>
    </frag-course-info>`;
    return out;
}

function displayRecentClasses(courses) {
    const panel = document.getElementById("recent-courses-panel");
    panel.innerHTML = "";
    for (let i = 0; i < courses.length; i++) {
        const element = courses[i];
        panel.innerHTML += getRecentClasseHtmlTemplate(element);
    }
} 

function displayPinnedClasses(courses) {
    const panel = document.getElementById("pinned-courses-panel");
    panel.innerHTML = "";
    for (let i = 0; i < courses.length; i++) {
        const element = courses[i];
        panel.innerHTML += getRecentClasseHtmlTemplate(element);
    }
} 


function homeBuild() {
    try {
        const grades = JSON.parse(localStorage.getItem("grades"));
        // var grades = null;
        var lastSem = getLastSemester(grades["semesters"]);
        addSem(grades["semesters"] ?? [], lastSem ?? {});
        fillGauges(lastSem ?? {});
        
    
        const calendar = localStorage.getItem("calendar");
        const events = getCalendarEvents(calendar ?? null);
        getUpcomingClasses(events);

        const courses = JSON.parse(localStorage.getItem("courses"));
        displayRecentClasses(courses.slice(0, 3));
        displayPinnedClasses(courses.slice(3, 6));
    } finally {

        const token = getCookie("token");
    
        getCalendar((data) => {
            if (!data || data.error) {
                return;
            }
            localStorage.setItem("calendar", data);
            const events = getCalendarEvents(data);
            getUpcomingClasses(events);
        });
    
        if (token) {
            getGrades(token, (data) => {
                if (!data || data.error) {
                    return;
                }
                localStorage.setItem("grades", JSON.stringify(data));
                var lastSem = getLastSemester(data["semesters"]);
                addSem(data["semesters"], lastSem);
                fillGauges(lastSem);
            });
     
            getCourses(token, (data) => {
                if (!data || data.error) {
                    return;
                }
                console.log(data);
                localStorage.setItem("courses", JSON.stringify(data));
                displayRecentClasses(data.slice(0, 3));
            });
    
        }
    }
        


    
}



export { homeBuild };

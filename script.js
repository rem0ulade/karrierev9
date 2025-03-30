
let player = {
    username: "",
    branch: "",
    company: "Keine",
    level: 1,
    day: 1,
    salary: 3000,
    money: 0,
    popularity: 50,
    stress: 0,
    energy: 100,
    risk: 0,
    inventory: []
};

const events = [
    {
        text: "Dein Kollege isst laut Chips im Großraumbüro.",
        options: [
            { text: "Ignorieren", result: "Du bleibst ruhig, aber dein Stress steigt.", popularity: 0, stress: 10 },
            { text: "Ihn ansprechen", result: "Er ist genervt. Deine Beliebtheit leidet.", popularity: -10, stress: -5 }
        ]
    },
    {
        text: "Du nimmst an einem Meeting ohne Tagesordnung teil.",
        options: [
            { text: "Fragen stellen", result: "Du wirkst engagiert, Chef lobt dich.", popularity: 10, energy: -5 },
            { text: "Abschalten", result: "Du verpasst Infos, aber bleibst entspannt.", stress: -5 }
        ]
    },
    {
        text: "Der Praktikant fragt zum fünften Mal nach dem WLAN-Passwort.",
        options: [
            { text: "Hilfsbereit antworten", result: "Er schenkt dir später Kaffee.", popularity: 5 },
            { text: "Ihn wegschicken", result: "Er erzählt es dem HR-Team.", popularity: -5, risk: 5 }
        ]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-btn").addEventListener("click", setUsername);
});

function setUsername() {
    const input = document.getElementById("username-input").value.trim();
    if (!input) return alert("Bitte gib deinen Namen ein.");
    player.username = input;
    document.getElementById("username-display").innerText = input;
    document.getElementById("status-bar").style.display = "flex";
    document.getElementById("menu").style.display = "flex";
    chooseBranch("Finanzen");
}

function chooseBranch(branch) {
    player.branch = branch;
    updateStatus();
    acceptJob("Junior Analyst", "FinEx Group");
}

function acceptJob(title, company) {
    player.company = `${title} @ ${company}`;
    player.level = 2;
    player.money += 500;
    updateStatus();
    nextDecision();
}

function updateStatus() {
    document.getElementById("username-display").innerText = player.username;
    document.getElementById("level").innerText = player.level;
    document.getElementById("day").innerText = player.day;
    document.getElementById("company").innerText = player.company;
    document.getElementById("branch").innerText = player.branch;
    document.getElementById("career-title").innerText = getCareerTitle();
    document.getElementById("money").innerText = player.money;
    document.getElementById("salary").innerText = player.salary;
    document.getElementById("popularity").innerText = player.popularity;
    document.getElementById("stress").innerText = player.stress;
    document.getElementById("energy").innerText = player.energy;
    document.getElementById("risk").innerText = player.risk + "%";
}

function getCareerTitle() {
    if (player.level >= 20) return "CEO";
    if (player.level >= 15) return "Senior Executive";
    if (player.level >= 10) return "Abteilungsleiter";
    if (player.level >= 6) return "Mid-Level";
    if (player.level >= 3) return "Junior";
    return "Praktikant";
}

function nextDecision() {
    player.day++;
    if (player.day % 30 === 0) player.money += player.salary;
    updateStatus();
    const event = events[Math.floor(Math.random() * events.length)];
    document.getElementById("content").innerHTML = `
        <div class='happening-box'>
            <p><strong>Tag ${player.day}</strong>: ${event.text}</p>
            <button onclick="decision(${event.options[0].popularity || 0}, ${event.options[0].stress || 0}, ${event.options[0].energy || 0}, ${event.options[0].risk || 0}, '${event.options[0].result}')">${event.options[0].text}</button>
            <button onclick="decision(${event.options[1].popularity || 0}, ${event.options[1].stress || 0}, ${event.options[1].energy || 0}, ${event.options[1].risk || 0}, '${event.options[1].result}')">${event.options[1].text}</button>
        </div>`;
}

function decision(pop, stress, energy, risk, result) {
    player.popularity += pop;
    player.stress += stress;
    player.energy += energy;
    player.risk += risk;
    if (player.risk > 100) player.risk = 100;
    updateStatus();
    document.getElementById("content").innerHTML = `
        <p>${result}</p>
        <button onclick="nextDecision()">Einen Tag weiter</button>`;
}

function showCareer() {
    document.getElementById("content").innerHTML = `
        <h3>Karriereübersicht</h3>
        <p><strong>Name:</strong> ${player.username}</p>
        <p><strong>Firma:</strong> ${player.company}</p>
        <p><strong>Karrierestufe:</strong> ${getCareerTitle()}</p>
        <p><strong>Level:</strong> ${player.level}</p>
        <p><strong>Gehalt:</strong> ${player.salary} €</p>
        <p><strong>Beliebtheit:</strong> ${player.popularity}</p>
        <p><strong>Stress:</strong> ${player.stress}</p>
        <p><strong>Energie:</strong> ${player.energy}</p>
        <p><strong>Kündigungsrisiko:</strong> ${player.risk}%</p>
        <p><strong>Kontostand:</strong> ${player.money} €</p>
        <button onclick="nextDecision()">Zurück</button>`;
}

function showInventory() {
    let html = "<h3>Inventar</h3><ul>";
    if (player.inventory.length === 0) {
        html += "<li>Dein Inventar ist leer.</li>";
    } else {
        player.inventory.forEach(item => html += `<li>${item}</li>`);
    }
    html += "</ul><button onclick='nextDecision()'>Zurück</button>";
    document.getElementById("content").innerHTML = html;
}

function openBizConnect() {
    document.getElementById("content").innerHTML = `
        <h3>BizConnect</h3>
        <p>Du hast 0 neue Jobanfragen.</p>
        <p>Demnächst kannst du dich hier bewerben oder von Headhuntern gefunden werden.</p>
        <button onclick="nextDecision()">Zurück</button>`;
}

function saveGame() {
    localStorage.setItem("karriere_save", JSON.stringify(player));
    alert("Spiel gespeichert!");
}

function loadGame() {
    const data = localStorage.getItem("karriere_save");
    if (data) {
        player = JSON.parse(data);
        updateStatus();
        document.getElementById("status-bar").style.display = "flex";
        document.getElementById("menu").style.display = "flex";
        nextDecision();
    } else {
        alert("Kein Spielstand gefunden.");
    }
}

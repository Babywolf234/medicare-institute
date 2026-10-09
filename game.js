// Game State
let gameState = {
    day: 1,
    hour: 8,
    money: 2500000,
    reputation: 3.5,
    powerStable: true,
    fuel: 100,
    doctors: 2,
    nurses: 4,
    cleaners: 2,
    receptionQueue: 3,
    aeCases: 1
};

// Time Progression Loop (Runs every 2 seconds)
setInterval(() => {
    gameState.hour += 1;
    if (gameState.hour > 23) {
        gameState.hour = 0;
        gameState.day += 1;
        processDailyExpenses();
    }
    updateHUD();
    checkRandomEvents();
}, 2000);

function updateHUD() {
    let ampm = gameState.hour >= 12 ? "PM" : "AM";
    let formattedHour = gameState.hour % 12 || 12;
    document.getElementById("time-display").innerText = `Day ${gameState.day} - ${formattedHour}:00 ${ampm}`;
    document.getElementById("money-display").innerText = `₦${gameState.money.toLocaleString()}`;
    document.getElementById("reputation-display").innerText = `${gameState.reputation.toFixed(1)} / 5.0`;
    document.getElementById("doc-count").innerText = gameState.doctors;
    document.getElementById("q-reception").innerText = gameState.receptionQueue;
}

function processDailyExpenses() {
    let salaryExpense = (gameState.doctors * 150000) + (gameState.nurses * 80000) + (gameState.cleaners * 40000);
    gameState.money -= salaryExpense;
    if (!gameState.powerStable) {
        gameState.fuel -= 20;
    }
}

function hireStaff(role) {
    let cost = role === 'doctor' ? 500000 : role === 'nurse' ? 300000 : 150000;
    if (gameState.money >= cost) {
        gameState.money -= cost;
        if (role === 'doctor') gameState.doctors++;
        if (role === 'nurse') gameState.nurses++;
        if (role === 'cleaner') gameState.cleaners++;
        updateHUD();
        alert(`Successfully recruited new ${role} to Medicare Institute!`);
    } else {
        alert("Not enough funds in the Medicare Institute account!");
    }
}

function openRoom(roomType) {
    let content = document.getElementById("inspector-content");
    switch(roomType) {
        case 'reception':
            content.innerHTML = `<h4>Front Desk Status</h4><p>Patients opening folders at Medicare Institute reception.</p>`;
            break;
        case 'consultation':
            content.innerHTML = `<h4>Consultation Rooms</h4><p>Active <b>Navy Blue</b> Doctors managing patient diagnostics.</p>`;
            break;
        case 'lab':
            content.innerHTML = `<h4>Pathology Lab</h4><p>Forest Green Scientists running lab slides.</p>`;
            break;
        case 'ae':
            content.innerHTML = `<h4>Accident & Emergency</h4><p>Teal Nurses stabilizing critical trauma cases.</p>`;
            break;
        case 'pharmacy':
            content.innerHTML = `<h4>Pharmacy</h4><p>Burgundy Pharmacists managing institutional prescriptions.</p>`;
            break;
        case 'sanitation':
            content.innerHTML = `<h4>Sanitation Hub</h4><p>Yellow Utility Cleaners maintaining strict hospital hygiene.</p>`;
            break;
    }
}

// Dynamic Event System
function checkRandomEvents() {
    if (Math.random() < 0.15 && gameState.hour === 14) {
        triggerGridFailureEvent();
    }
}

function triggerGridFailureEvent() {
    gameState.powerStable = false;
    document.getElementById("power-display").innerText = "Outage!";
    document.getElementById("power-display").className = "status-red";
    
    document.getElementById("event-title").innerText = "⚡ Grid Failure (Power Outage)!";
    document.getElementById("event-desc").innerText = "The power grid just disconnected at Medicare Institute. Emergency theater systems require immediate backup.";
    
    let actionsHTML = `
        <button onclick="resolveEvent('generator')" class="btn-primary">Engage Heavy Generator (-₦50k)</button>
        <button onclick="resolveEvent('solar')" class="btn-secondary">Rely on Solar Inverter</button>
    `;
    document.getElementById("event-actions").innerHTML = actionsHTML;
    document.getElementById("event-modal").classList.remove("hidden");
}

function resolveEvent(choice) {
    if (choice === 'generator') {
        gameState.money -= 50000;
        gameState.powerStable = true;
        document.getElementById("power-display").innerText = "Stable (Generator)";
        document.getElementById("power-display").className = "status-green";
        alert("Generator active. Power restored seamlessly across Medicare Institute.");
    } else {
        gameState.reputation -= 0.2;
        alert("Solar overload! Brief equipment shutdown caused minor patient delays.");
    }
    document.getElementById("event-modal").classList.add("hidden");
    updateHUD();
}

function triggerMiniGame(type) {
    if (type === 'microscope') {
        let success = confirm("🔬 Medicare Institute Lab Challenge:\n\nAnalyze blood smear slide for parasite detection!\n\nClick OK to execute test.");
        if (success) {
            gameState.money += 75000;
            alert("Diagnostic test successful! Patient treated. +₦75,000 added to revenue.");
            updateHUD();
        }
    }
}

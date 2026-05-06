/* =========================
   STORAGE (مستقل تمامًا)
========================= */

function getClosingData() {
    return JSON.parse(localStorage.getItem("closingData") || "{}");
}

function saveClosingData(data) {
    localStorage.setItem("closingData", JSON.stringify(data));
}

/* =========================
   CALCULATION
========================= */

function calcClosing() {

    let inInputs = document.querySelectorAll("#inTable tbody input[type='number']");
    let outInputs = document.querySelectorAll("#outTable tbody input[type='number']");

    let inTotal = 0;
    let outTotal = 0;

    let data = {
        in: [],
        out: []
    };

    // لينا
    inInputs.forEach((input, i) => {
        let val = +input.value || 0;
        inTotal += val;
        data.in[i] = val;
    });

    // علينا
    outInputs.forEach((input, i) => {
        let val = +input.value || 0;
        outTotal += val;
        data.out[i] = val;
    });

    // عرض
    document.getElementById("inTotal").innerText = inTotal;
    document.getElementById("outTotal").innerText = outTotal;
    document.getElementById("net").innerText = inTotal - outTotal;

    // حفظ
    saveClosingData(data);
}

/* =========================
   LOAD DATA
========================= */

function loadClosing() {

    let data = getClosingData();

    let inInputs = document.querySelectorAll("#inTable tbody input[type='number']");
    let outInputs = document.querySelectorAll("#outTable tbody input[type='number']");

    if (data.in) {
        inInputs.forEach((input, i) => {
            input.value = data.in[i] || "";
        });
    }

    if (data.out) {
        outInputs.forEach((input, i) => {
            input.value = data.out[i] || "";
        });
    }

    calcClosing();
}

/* =========================
   RESET (اختياري)
========================= */

function resetClosing() {
    localStorage.removeItem("closingData");

    let inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(i => i.value = "");

    calcClosing();
}

/* =========================
   INIT
========================= */

window.onload = function () {
    loadClosing();
};
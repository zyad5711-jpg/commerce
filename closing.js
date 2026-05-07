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

    let inTextInputs = document.querySelectorAll("#inTable tbody input:not([type='number'])");
    let outTextInputs = document.querySelectorAll("#outTable tbody input:not([type='number'])");

    let inTotal = 0;
    let outTotal = 0;

    let data = {
        in: [],
        out: []
    };

    // ===== لينا =====
    inInputs.forEach((input, i) => {

        let val = +input.value || 0;

        inTotal += val;

        data.in[i] = {
            title: inTextInputs[i].value,
            amount: val
        };

    });

    // ===== علينا =====
    outInputs.forEach((input, i) => {

        let val = +input.value || 0;

        outTotal += val;

        data.out[i] = {
            title: outTextInputs[i].value,
            amount: val
        };

    });

    // عرض الإجماليات
    document.getElementById("inTotal").innerText = inTotal;
    document.getElementById("outTotal").innerText = outTotal;

    // التحصيل اليومي
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

    let inTextInputs = document.querySelectorAll("#inTable tbody input:not([type='number'])");
    let outTextInputs = document.querySelectorAll("#outTable tbody input:not([type='number'])");

    // ===== لينا =====
    if (data.in) {

        inInputs.forEach((input, i) => {

            input.value = data.in[i]?.amount || "";
            inTextInputs[i].value = data.in[i]?.title || "";

        });

    }

    // ===== علينا =====
    if (data.out) {

        outInputs.forEach((input, i) => {

            input.value = data.out[i]?.amount || "";
            outTextInputs[i].value = data.out[i]?.title || "";

        });

    }

    calcClosing();
}

/* =========================
   RESET
========================= */

function resetClosing() {

    localStorage.removeItem("closingData");

    let inputs = document.querySelectorAll("input");

    inputs.forEach(i => i.value = "");

    calcClosing();
}

/* =========================
   INIT
========================= */

window.onload = function () {
    loadClosing();
};
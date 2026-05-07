let LIMIT = 200000;

/* =======================
   STORAGE
======================= */

function getData() {
    return JSON.parse(localStorage.getItem("data") || "[]");
}

function saveData(data) {
    localStorage.setItem("data", JSON.stringify(data));
}

function getLines() {
    let lines = JSON.parse(localStorage.getItem("lines"));

    if (!lines || Object.keys(lines).length === 0) {
        lines = {
            1: { w: 0, d: 0, savedW: 0, savedD: 0, name: "خط 1" },
            2: { w: 0, d: 0, savedW: 0, savedD: 0, name: "خط 2" }
        };
        saveLines(lines);
    }

    return lines;
}

function saveLines(lines) {
    localStorage.setItem("lines", JSON.stringify(lines));
}

/* =======================
   ADD LINE
======================= */

function addLine() {
    let lines = getLines();

    let newId = Date.now();

    lines[newId] = {
        w: 0,
        d: 0,
        savedW: 0,
        savedD: 0,
        name: "خط جديد"
    };

    saveLines(lines);
    renderLines();
}

/* =======================
   REMOVE EXTRA LINES
======================= */

function removeExtraLines() {

    let lines = getLines();

    lines = {
        1: lines[1] || { w: 0, d: 0, savedW: 0, savedD: 0, name: "خط 1" },
        2: lines[2] || { w: 0, d: 0, savedW: 0, savedD: 0, name: "خط 2" }
    };

    saveLines(lines);
    renderLines();
}

/* =======================
   TABLE (🔥 تعديل هنا)
======================= */

function createRow(d = {}) {

    let lines = getLines();

    let options = "";

    // الخطوط
    for (let id in lines) {
        options += `<option value="${id}" ${d.wline == id ? "selected" : ""}>${lines[id].name}</option>`;
    }

    // إضافات خارجية
    options += `<option value="instapay" ${d.wline == "instapay" ? "selected" : ""}>💳 Instapay</option>`;
    options += `<option value="machine" ${d.wline == "machine" ? "selected" : ""}>🏧 مكنة</option>`;


    let options2 = "";

    for (let id in lines) {
        options2 += `<option value="${id}" ${d.dline == id ? "selected" : ""}>${lines[id].name}</option>`;
    }

    options2 += `<option value="instapay" ${d.dline == "instapay" ? "selected" : ""}>💳 Instapay</option>`;
    options2 += `<option value="machine" ${d.dline == "machine" ? "selected" : ""}>🏧 مكنة</option>`;


    return `
<td><input type="number" value="${d.withdraw || ''}" oninput="calc()"></td>
<td><select onchange="calc()">${options}</select></td>
<td><input type="number" value="${d.comm || ''}" oninput="calc()"></td>
<td><input type="number" value="${d.deposit || ''}" oninput="calc()"></td>
<td><select onchange="calc()">${options2}</select></td>
<td><input type="number" value="${d.exp || ''}" oninput="calc()"></td>
`;
}

function loadTable() {
    let data = getData();
    let table = document.getElementById("table");
    if (!table) return;

    data.forEach(r => {
        let row = table.insertRow();
        row.innerHTML = createRow(r);
    });
}

function addRows(n) {
    let table = document.getElementById("table");
    if (!table) return;

    for (let i = 0; i < n; i++) {
        let row = table.insertRow();
        row.innerHTML = createRow();
    }

    calc();
}

/* =======================
   CALCULATION (🔥 تعديل هنا)
======================= */

function calc() {

    let table = document.getElementById("table");
    if (!table) return;

    let rows = document.querySelectorAll("#table tr");

    let data = [];
    let commission = 0;
    let expenses = 0;

    let lines = getLines();

    for (let id in lines) {
        lines[id].w = 0;
        lines[id].d = 0;
    }

    for (let i = 1; i < rows.length; i++) {

        let inputs = rows[i].querySelectorAll("input");
        let selects = rows[i].querySelectorAll("select");

        let withdraw = +inputs[0].value || 0;
        let wline = selects[0].value;

        let comm = +inputs[1].value || 0;

        let deposit = +inputs[2].value || 0;
        let dline = selects[1].value;

        let exp = +inputs[3].value || 0;

        commission += comm;
        expenses += exp;

        // 🔥 مهم: تجاهل instapay و المكنة
        if (lines[wline]) {
            lines[wline].w += withdraw;
        }

        if (lines[dline]) {
            lines[dline].d += deposit;
        }

        data.push({ withdraw, wline, comm, deposit, dline, exp });
    }

    saveData(data);
    saveLines(lines);

    let total = commission - expenses;
    localStorage.setItem("total", total);

    let totalEl = document.getElementById("total");
    if (totalEl) totalEl.innerText = total;
}

/* =======================
   RENDER LINES
======================= */

function renderLines() {

    let container = document.querySelector(".container");
    if (!container) return;

    let lines = getLines();

    container.innerHTML = "";

    for (let id in lines) {

        let line = lines[id];

        let balance = (line.savedW + line.w) - (line.savedD + line.d);
        let limit = LIMIT - (line.savedW + line.w);

        container.innerHTML += `
        <div class="card">
            <input value="${line.name}" oninput="updateLineName('${id}', this.value)">

            <div class="title">رصيد الخط</div>
            <div class="value">${balance}</div>

            <div class="title">المتبقي من الليمت</div>
            <div class="limit">${limit}</div>
        </div>
        `;
    }
}

/* =======================
   UPDATE NAME
======================= */

function updateLineName(id, value) {
    let lines = getLines();
    lines[id].name = value;
    saveLines(lines);
}

/* =======================
   RESET TABLE
======================= */

function resetTable() {

    let lines = getLines();

    for (let id in lines) {
        lines[id].savedW = (lines[id].savedW || 0) + (lines[id].w || 0);
        lines[id].savedD = (lines[id].savedD || 0) + (lines[id].d || 0);

        lines[id].w = 0;
        lines[id].d = 0;
    }

    saveLines(lines);

    localStorage.removeItem("data");
    localStorage.removeItem("total");

    location.reload();
}

/* =======================
   RESET LINES
======================= */

function resetLines() {

    let lines = getLines();

    for (let id in lines) {
        lines[id].w = 0;
        lines[id].d = 0;
        lines[id].savedW = 0;
        lines[id].savedD = 0;
    }

    saveLines(lines);
    renderLines();
}

/* =======================
   INIT
======================= */

window.onload = function () {

    loadTable();
    renderLines();

    let saved = localStorage.getItem("total");
    let totalEl = document.getElementById("total");

    if (saved && totalEl) {
        totalEl.innerText = saved;
    }

    calc();
};
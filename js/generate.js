const form = document.getElementById("pass-form");
const keys = document.getElementById("recovery-keys");

function get_keys() {
    let text = "";
    for (let i = 0; i < keys.childNodes.length; i++) {
        text += keys.childNodes[i].innerText + "\n";
    }
    return text;
}

document.getElementById("generate").addEventListener("click", () => {
    let pass = form["password"].value;
    if (pass === "") {
        return;
    }
    keys.innerHTML = "";
    pass = secrets.str2hex(pass);
    let shares = secrets.share(pass, 5, 3, 256);
    for (let i = 0; i < shares.length; i++) {
        let li = document.createElement("li")
        li.innerText = shares[i];
        keys.appendChild(li);
    }
})

document.getElementById("copy-keys").addEventListener("click", () => {
    if (keys.childNodes[0].innerText === undefined) {
        return;
    }
    let textarea = document.createElement("textarea");
    let text = get_keys();
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(textarea);
    let tooltip = document.getElementById("copy-tooltip");
    tooltip.style.visibility = "visible";
    setTimeout(() => {
        tooltip.style.visibility = "hidden";
    }, 700);
})

document.getElementById("pass-vis").addEventListener("click", () => {
    let type = form["password"].getAttribute("type") === "password" ? "text" : "password";
    form["password"].setAttribute("type", type);
})

const down_btn = document.getElementById("download-keys");
down_btn.addEventListener("click", () => {
    if (keys.childNodes[0].innerText === undefined) {
        return;
    }
    let text = get_keys();
    down_btn.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
})

function noenter() {
  return !(window.event && window.event.keyCode == 13); }

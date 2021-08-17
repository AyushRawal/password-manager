const recovery_form = document.getElementById("recovery-form");
const pass = document.getElementById("password");

document.getElementById("recover").addEventListener("click", () => {
    let key1 = recovery_form["key1"].value;
    let key2 = recovery_form["key2"].value;
    let key3 = recovery_form["key3"].value;
    if (key1.length === 0 || key2.length === 0 || key3.length === 0) {
        return;
    }
    pass.innerText = "";
    try {
        let rec_pass = secrets.combine([key1, key2, key3]);
        rec_pass = secrets.hex2str(rec_pass);
        pass.innerText = rec_pass;
    }
    catch (err) {
        console.error(err);
        pass.innerText = "invalid input";
    }
})

document.getElementById("copy-pass").addEventListener("click", () => {
    let textarea = document.createElement("textarea");
    textarea.value = pass.innerText;
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

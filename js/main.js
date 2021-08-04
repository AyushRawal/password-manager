// const BASE_URL = "http://127.0.0.1:5000/user/";
const BASE_URL = "https://secure-passwd-manager.herokuapp.com/user/"
let USERNAME, PASSWORD;
let table = document.getElementById("records");
let records = [];

async function get_records() {
    let response = await axios.get(BASE_URL + USERNAME);
    if (response.status === 404) {

    }
    else {
        let data = response.data["records"];
        for (let i = 0; i < data.length; ++i)
        {
            let record = {
                id: data[i]["id"],
                title: CryptoJS.AES.decrypt(data[i]["title"], PASSWORD).toString(CryptoJS.enc.Utf8),
                password: CryptoJS.AES.decrypt(data[i]["password"], PASSWORD).toString(CryptoJS.enc.Utf8)
            };
            add_row(record);
        }
    }
}

async function post_record(title, password) {
    let record = {
        id: '',
        title: title,
        password: password,
    };
    title = CryptoJS.AES.encrypt(title, PASSWORD).toString();
    password = CryptoJS.AES.encrypt(password, PASSWORD).toString();
    let response = await axios.post(BASE_URL + USERNAME, {'title': title, 'password': password});
    record["id"] = response.data["id"];
    add_row(record);
}

async function patch_record(id) {
    let title = document.getElementById("title").value;
    let password = document.getElementById("entry_password").value;
    let record = {
        id: id,
        title: title,
        password: password,
    };
    title = CryptoJS.AES.encrypt(title, PASSWORD).toString();
    password = CryptoJS.AES.encrypt(password, PASSWORD).toString();
    let response = await axios.patch(BASE_URL + USERNAME, {'id': id, 'title': title, 'password': password});
    modify_row(record);
}

async function delete_record(id) {
    let response = axios.delete(BASE_URL + USERNAME, {params : {'id': id}});
    delete_row(id);
}

function add_row(record)
{
    records.push(record);
    let row = table.insertRow();
    row.insertCell().innerHTML = record["title"];
    row.insertCell().innerHTML = record["password"];
    row.insertCell().innerHTML = `<button onclick="delete_record('${record['id']}')"> Delete </button>`
    row.insertCell().innerHTML = `<button onclick="patch_record('${record['id']}')"> Edit </button>`
}

function modify_row(record)
{
    let index;
    for (let i = 0; i < records.length; ++i)
    {
        if (records[i]["id"] === record["id"])
        {
            index = i;
            records[i]["title"] = record["title"];
            records[i]["password"] = record["password"];
            break;
        }
    }
    let row = table.rows[index];
    row.cells[0].innerHTML = record["title"];
    row.cells[1].innerHTML = record["password"];
}

function delete_row(id)
{
    let index;
    console.log(id);
    for (let i = 0; i < records.length; ++i)
    {
        if (records[i]["id"] === id)
        {
            index = i;
            table.deleteRow(i);
            break;
        }
    }
    records.splice(index, 1);
}

document.getElementById("login").addEventListener("click", () => {
    USERNAME = document.getElementById("username").value;
    PASSWORD = document.getElementById("password").value;
    PASSWORD = CryptoJS.SHA256(PASSWORD).toString(CryptoJS.enc.Hex);
    USERNAME = CryptoJS.HmacSHA256(USERNAME, PASSWORD).toString(CryptoJS.enc.Hex);
    get_records();
    console.log(USERNAME);
    console.log(PASSWORD);
});

document.getElementById("add").addEventListener("click", () => {
    if (USERNAME !== undefined) {
        post_record(document.getElementById("title").value, document.getElementById("entry_password").value);
    }
});

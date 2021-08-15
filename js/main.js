// const BASE_URL = "http://127.0.0.1:5000/user/";
const BASE_URL = "https://secure-passwd-manager.herokuapp.com/user/"
let USERNAME, PASSWORD;
let entries = document.getElementById("entries");
let view = document.getElementById("record-view");
let login_form = document.getElementById("login-form");
let view_id = "";
let records = {};

async function get_records() {
    let response = await axios.get(BASE_URL + USERNAME);
    if (response.status === 404) {

    }
    else {
        let data = response.data["records"];
        for (let i = 0; i < data.length; ++i)
        {
			let id = data[i]["id"];
            let record = {
                title: CryptoJS.AES.decrypt(data[i]["title"], PASSWORD).toString(CryptoJS.enc.Utf8),
                password: CryptoJS.AES.decrypt(data[i]["password"], PASSWORD).toString(CryptoJS.enc.Utf8)
            };
			records[id] = record;
            add_entry(id, record);
        }
    }
}

async function post_record(title, password) {
    let record = {
        title: title,
        password: password,
    };
    title = CryptoJS.AES.encrypt(title, PASSWORD).toString();
    password = CryptoJS.AES.encrypt(password, PASSWORD).toString();
    let response = await axios.post(BASE_URL + USERNAME, {'title': title, 'password': password});
	let id = response.data["id"];
    records[id] = record;
	view_id = id;
    add_entry(id, record);
}

async function patch_record(id, title, password) {
    let record = {
        title: title,
        password: password,
    };
    title = CryptoJS.AES.encrypt(title, PASSWORD).toString();
    password = CryptoJS.AES.encrypt(password, PASSWORD).toString();
    let response = await axios.patch(BASE_URL + USERNAME, {'id': id, 'title': title, 'password': password});
	records[id] = record;
    modify_entry(id, record);
}

async function delete_record(id) {
    let response = axios.delete(BASE_URL + USERNAME, {params : {'id': id}});
    delete_entry(id);
}

function add_entry(id, record)
{
	let li = document.createElement("li");
	let button = document.createElement("button");
	button.setAttribute("onclick", `show_record('${id}')`);
	button.setAttribute("id", id);
	button.innerText = record["title"];
	li.appendChild(button);
	entries.appendChild(li);
}


function show_record(id)
{
	view_id = id;
	view["title"].value = records[id]["title"];
	view["password"].value = records[id]["password"];
}

function modify_entry(id, record)
{
	let entryBtn = document.getElementById(id);
	entryBtn.innerText = record['title'];
}

function delete_entry(id)
{
	delete records[id];
	let entryBtn = document.getElementById(id);
	entryBtn.remove();
}


document.getElementById("login").addEventListener("click", (event) => {
	USERNAME = login_form['username'].value;
    PASSWORD = login_form['password'].value;
    PASSWORD = CryptoJS.SHA256(PASSWORD).toString(CryptoJS.enc.Hex);
    USERNAME = CryptoJS.HmacSHA256(USERNAME, PASSWORD).toString(CryptoJS.enc.Hex);
    get_records();
	let page1 = document.getElementById("page1");
	page1.style.display = "none";
	let page2 = document.getElementById("page2");
	page2.style.display = "flex";
	let page2_nav = document.getElementById("page2-nav");
	page2_nav.style.display = "block";
});

document.getElementById("add").addEventListener("click", () => {
	view.reset();
	view_id = "";
});

document.getElementById("save").addEventListener("click", () => {
	let title = view["title"].value;
	let password = view["password"].value;
	if (view_id.length === 0)
	{
		post_record(title, password);
	}
	else
	{
		patch_record(view_id, title, password);
	}

})

document.getElementById("delete").addEventListener("click", () => {
	if (view_id.length === 36)
	{
		delete_record(view_id);
		view.reset();
		view_id = "";
	}
})

// const BASE_URL = "http://127.0.0.1:5000/user/";
const BASE_URL = "https://secure-passwd-manager.herokuapp.com/user/";
let USERNAME, PASSWORD;
const entries = document.getElementById("entries");
const view = document.getElementById("record-view");
const login_form = document.getElementById("login-form");
let view_id = "";
let records = {};

async function get_records() {
	try {
		let response = await axios.get(BASE_URL + USERNAME);
		let data = response.data["records"];
		for (let i = 0; i < data.length; ++i) {
			let id = data[i]["id"];
			let record = {
				title: CryptoJS.AES.decrypt(data[i]["title"], PASSWORD).toString(
					CryptoJS.enc.Utf8
				),
				password: CryptoJS.AES.decrypt(data[i]["password"], PASSWORD).toString(
					CryptoJS.enc.Utf8
				),
				url: CryptoJS.AES.decrypt(data[i]["url"], PASSWORD).toString(
					CryptoJS.enc.Utf8
				),
				notes: CryptoJS.AES.decrypt(data[i]["notes"], PASSWORD).toString(
					CryptoJS.enc.Utf8
				),
			};
			records[id] = record;
			add_entry(id, record);
		}
	} catch (error) {
		if (error.response && error.response.status === 404) {
			console.log("User not found, New user will be created.");
		} else {
			alert(
				"Something went wrong!! Make sure you are connected to the internet."
			);
			console.error(error);
		}
	}
}

async function post_record(title, password, url, notes) {
	let post = {
		title: CryptoJS.AES.encrypt(title, PASSWORD).toString(),
		password: CryptoJS.AES.encrypt(password, PASSWORD).toString(),
		url: CryptoJS.AES.encrypt(url, PASSWORD).toString(),
		notes: CryptoJS.AES.encrypt(notes, PASSWORD).toString(),
	};
	try {
		let response = await axios.post(BASE_URL + USERNAME, post);
		let id = response.data["id"];
		records[id] = {
			title: title,
			password: password,
			url: url,
			notes: notes,
		};
		view_id = id;
		add_entry(id, records[id]);
	} catch (error) {
		alert(
			"Something went wrong!! Make sure you are connected to the internet."
		);
		console.error(error);
	}
}

async function patch_record(id, title, password, url, notes) {
	let patch = {
		id: id,
		title: CryptoJS.AES.encrypt(title, PASSWORD).toString(),
		password: CryptoJS.AES.encrypt(password, PASSWORD).toString(),
		url: CryptoJS.AES.encrypt(url, PASSWORD).toString(),
		notes: CryptoJS.AES.encrypt(notes, PASSWORD).toString(),
	};
	try {
		await axios.patch(BASE_URL + USERNAME, patch);
		records[id] = {
			title: title,
			password: password,
			url: url,
			notes: notes,
		};
		modify_entry(id, records[id]);
	} catch (error) {
		alert(
			"Something went wrong!! Make sure you are connected to the internet."
		);
		console.error(error);
	}
}

async function delete_record(id) {
	try {
		axios.delete(BASE_URL + USERNAME, { params: { id: id } });
		delete_entry(id);
	} catch (error) {
		alert(
			"Something went wrong!! Make sure you are connected to the internet."
		);
		console.error(error);
	}
}

function add_entry(id, record) {
	let li = document.createElement("li");
	let button = document.createElement("button");
	button.setAttribute("onclick", `show_record('${id}')`);
	button.setAttribute("id", id);
	button.innerText = record["title"];
	li.appendChild(button);
	entries.appendChild(li);
}

function show_record(id) {
	view_id = id;
	view["title"].value = records[id]["title"];
	view["password"].value = records[id]["password"];
	view["url"].value = records[id]["url"];
	view["notes"].value = records[id]["notes"];
}

function modify_entry(id, record) {
	let entryBtn = document.getElementById(id);
	entryBtn.innerText = record["title"];
}

function delete_entry(id) {
	delete records[id];
	let entryBtn = document.getElementById(id);
	entryBtn.remove();
}

document.getElementById("login").addEventListener("click", () => {
	USERNAME = login_form["username"].value;
	PASSWORD = login_form["password"].value;
	if (USERNAME === "" || PASSWORD === "") {
		return;
	}
	document.getElementById("login-msg").innerText += " " + USERNAME;
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
	view["password"].setAttribute("type", "password");
});

document.getElementById("save").addEventListener("click", () => {
	let title = view["title"].value;
	let password = view["password"].value;
	let url = view["url"].value;
	let notes = view["notes"].value;
	if (view_id.length === 0) {
		post_record(title, password, url, notes);
	} else if (view_id.length === 36) {
		patch_record(view_id, title, password, url, notes);
	}
});

document.getElementById("delete").addEventListener("click", () => {
	if (view_id.length === 36) {
		delete_record(view_id);
	}
	view.reset();
	view_id = "";
	view["password"].setAttribute("type", "password");
});

document.getElementById("login-pass").addEventListener("click", () => {
	let type =
		login_form["password"].getAttribute("type") === "password"
			? "text"
			: "password";
	login_form["password"].setAttribute("type", type);
});

document.getElementById("entry-pass").addEventListener("click", () => {
	let type =
		view["password"].getAttribute("type") === "password" ? "text" : "password";
	view["password"].setAttribute("type", type);
});

document.getElementById("copy-entry-pass").addEventListener("click", () => {
	let view_pass = view["password"];
	if (view_pass.value.length === 0) {
		return;
	}
	let type = view_pass.getAttribute("type");
	view_pass.setAttribute("type", "text");
	view_pass.select();
	view_pass.setSelectionRange(0, 99999);
	document.execCommand("copy");
	view_pass.setAttribute("type", type);
	let tooltip = document.getElementById("copy-tooltip");
	tooltip.style.visibility = "visible";
	setTimeout(() => {
		tooltip.style.visibility = "hidden";
	}, 700);
});

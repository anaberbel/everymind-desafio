const store = new SteinStore(
	"https://api.steinhq.com/v1/storages/6217fffdc582292380d6fdd7"
);

const SHEET = "login";
const LOGIN_PAGE = "./login_form.html";

function getFormData() {
	let uname = document.getElementById("uname").value;
	let psw = document.getElementById("psw").value;

	return [uname, psw];
}

async function searchUser(uname, psw) {
	const search = {
		login: uname,
	};

	if (psw) {
		search.senha = psw;
	}

	let data = await store.read(SHEET, { search });
	return !!data.length;
}

async function insertUser(uname, psw) {
	await store.append(SHEET, [
		{
			login: uname,
			senha: psw,
		},
	]);
}

async function onSubmit(e, action) {
	e.preventDefault();
	let [login, senha] = getFormData();
	if (action === "createUser") {
		await createUser(login, senha);
		return;
	}
	if (action === "doLogin") {
		await doLogin(login, senha);
		return;
	}
}
async function createUser(login, senha) {
	let hasUser = await searchUser(login);
	if (!hasUser) {
		await insertUser(login, senha);
		Swal.fire({
			title: "Sucesso",
			text: "Usuário criado com sucesso",
			icon: "success",
			confirmButtonText: "OK",
		});
		location.href = LOGIN_PAGE;
		return;
	}

	Swal.fire({
		title: "Erro",
		text: "Este Username já está em uso",
		icon: "error",
		confirmButtonText: "OK",
	});
}

async function doLogin(login, senha) {
	let hasUser = await searchUser(login, senha);

	if (hasUser) {
		Swal.fire({
			title: "Sucesso",
			text: "Você logou com sucesso",
			icon: "success",
			confirmButtonText: "OK",
		});
		return;
	}

	Swal.fire({
		title: "Erro",
		text: "Usuário ou senha incorretos",
		icon: "error",
		confirmButtonText: "OK",
	});
}

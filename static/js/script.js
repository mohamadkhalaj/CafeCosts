var name;
var ratio = 2;
var additionalCosts = 5000;
var netWeight = 1000;
var netCost = 0;
var numberOfProducts = 0;
var deleteThis;

function inputValidation(type) {

	let price = document.getElementById('price').value;
	let weight = document.getElementById('weight').value;
	let used = document.getElementById('used').value;

	var aCosts = document.getElementById('additionalCostsSetting').value;
	var r = document.getElementById('ratioSetting').value;
	var nWeight = document.getElementById('netWeightSetting').value;

	var numbers = /^[0-9]*\.?[0-9]+$/;

	if (type == 1) {

		var inputValue = [price, weight, used];
	}
	else {
		var inputValue = [aCosts, r, nWeight];
	};

	var check = true;
	inputValue.forEach(function(item, index) {
		if (!item.match(numbers)) {
			check = false;
		}
	});
	
	return check;
};

function showWrapper() {
	var wrapper = document.querySelector('.wrapper');
	wrapper.style.visibility = 'visible';
};

function hideWrapper() {
	var wrapper = document.querySelector('.wrapper');
	wrapper.style.visibility = 'hidden';
};

function numbersPrettify(number) {
	number = parseFloat(number).toFixed(1);
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function getNumberOfNodes() {
	let tbody = document.getElementById('tbody');
	return tbody.childElementCount - 1;
};

function decreaseNetCost(node) {
	var price = parseFloat(node.parentNode.childNodes[1].innerText.replace(',', ''));
	var weight = parseFloat(node.parentNode.childNodes[2].innerText.replace(',', ''));
	var used = parseFloat(node.parentNode.childNodes[3].innerText.replace(',', ''));
	if (netCost != 0) {

		netCost -= used * price / weight;
	};
};

function deleteRow() {
	deleteCloseButton();
	if (getNumberOfNodes() == 1) {
		document.getElementById('calculatorRow').style.display = 'none';
		netCost = 0;
	};
	
	decreaseNetCost(deleteThis);
	numberOfProducts --;
	calculatorRow();
	deleteThis.parentNode.remove();
};

function loadRowsCaller(data) {
	Object.keys(data).forEach(function(item, index) {
		loadRows(data[index]);
	});
};

function loadRows(data){
		document.getElementById('calculatorRow').style.display = 'block';
		let name = data["name"];
		let price = data["price"];
		let weight = data["weight"];
		let used = data["weight_used"];

		let tbody = document.getElementById('tbody');

		let tr = document.createElement('tr');
		tr.id = 'T';
		let dataInput = document.getElementById('dataInput');

		let td1 = document.createElement('td');
		td1.setAttribute('scope', 'col');
		td1.innerText = name;

		let td2 = document.createElement('td');
		td2.setAttribute('scope', 'col');
		td2.innerText = numbersPrettify(price);

		let td3 = document.createElement('td');
		td3.setAttribute('scope', 'col');
		td3.innerText = numbersPrettify(weight);

		let td4 = document.createElement('td');
		td4.setAttribute('scope', 'col');
		td4.innerText = numbersPrettify(used);

		let td5 = document.createElement('td');
		td5.setAttribute('scope', 'col');
		td5.innerText = numbersPrettify(used * price / weight);

		let td6 = document.createElement('td');
		td6.setAttribute('scope', 'col');
		td6.setAttribute('class', 'delete');
		td6.addEventListener('click', openDeleteMenu);
		var img = document.createElement('img');
		img.className = 'deleteRow';
		img.src = './static/image/trash.png';
		td6.setAttribute('data-toggle', "tooltip");
		td6.setAttribute('title', "حذف");
		td6.appendChild(img);

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
		tr.appendChild(td6);

		tbody.insertBefore(tr, dataInput);

		numberOfProducts ++;
		netCost += used * price / weight;
		calculatorRow();
};

function deleteIngredient() {
	var id = deleteThis.id;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", '/dashboard/', true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() { // Call a function when the state changes.
	    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	        document.getElementById(id).parentNode.remove();
	        deleteCloseButton();
	    };
	};
	xhr.send(`id=${id}`);
};

function calculatorRow() {
	var finalPrice = netCost * ratio + additionalCosts;


	var unitPrice = finalPrice * 1000 / netWeight;
	document.getElementById('netPrice').innerText = 'قیمت فروش: ' + numbersPrettify(finalPrice);
	document.getElementById('netWeight').innerText = 'قیمت هرکیلو: ' + numbersPrettify(unitPrice);
	document.getElementById('products').innerText = 'تعداد مواد: ' + numberOfProducts;
};

function settingCloseButton() {
	hideWrapper();
	document.getElementById('settingMenu').style.display = 'none';
};

function deleteCloseButton() {
	hideWrapper();
	document.getElementById('deleteMenu').style.display = 'none';
};

function deleteAllCloseButton() {
	hideWrapper();
	document.getElementById('deleteAllMenu').style.display = 'none';
};

function saveCloseButton() {
	hideWrapper();
	document.getElementById('saveMenu').style.display = 'none';
};

function openSettingMenu() {
	showWrapper();
	document.getElementById('additionalCostsSetting').value = additionalCosts;
	document.getElementById('ratioSetting').value = ratio;
	document.getElementById('netWeightSetting').value = netWeight;
	document.getElementById('settingMenu').style.display = 'block';	
};

function openDeleteMenu(obj=this, dashboard=false) {
	showWrapper();
	deleteThis = dashboard ? obj : this;
	document.getElementById('deleteMenu').style.display = 'block';	
};

function openSaveMenu() {
	showWrapper();
	document.getElementById("confName").value = name;
	deleteThis = this;
	document.getElementById('saveMenu').style.display = 'block';
};

function openDeleteAllMenu() {
	showWrapper();
	document.getElementById('deleteAllMenu').style.display = 'block';	
};

function save() {
	saveCloseButton();
	name = document.getElementById("confName").value;

	var main = {};
	main["title"] = name;
	main["full_price"] = netCost * ratio + additionalCosts;
	main["oneK_price"] = 1000*main["full_price"]/netWeight;
	main["additionalCost"] = additionalCosts;
	main["weight"] = netWeight;
	main["multiplier"] = ratio;

	var itemsArr = [];
	let tbody = document.getElementById('tbody');
	tbody.childNodes.forEach(function(item, index) {
		if (item.id == 'T') {
			name = item.childNodes[0].innerText;
			price = parseFloat(item.childNodes[1].innerText.replace(',', ''));
			weight = parseFloat(item.childNodes[2].innerText.replace(',', ''));
			weight_used = parseFloat(item.childNodes[3].innerText.replace(',', ''));

			var temp = {};
			temp['name'] = name;
			temp['price'] = price;
			temp['weight'] = weight;
			temp['weight_used'] = weight_used;

			itemsArr.push(temp);
		};
	});

	main['items'] = itemsArr;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", '/api/saveData/', true);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function() { // Call a function when the state changes.
	    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	        document.getElementById("contentMenu").scrollTo(0,0);
			document.getElementById('saveNotifMenu').style.display = 'block';
			showWrapper();
	    };
	};
	xhr.send(JSON.stringify(main));
};

function saveNotifClose() {
	hideWrapper();
	document.getElementById('saveNotifMenu').style.display = 'none';
};

function submitSetting() {
	
	if (!inputValidation(2)) {
		alert('مقادیر را به درستی وارد کنید!');
	}
	else {

		var aCosts = parseFloat(document.getElementById('additionalCostsSetting').value);
		var r = parseFloat(document.getElementById('ratioSetting').value);
		var nWeight = parseFloat(document.getElementById('netWeightSetting').value);

		netWeight = nWeight;
		ratio = r;
		additionalCosts = aCosts;
	};
	calculatorRow();
	settingCloseButton();
	deleteCloseButton();
};

function addRow() {

	if (!inputValidation(1)) {
		alert('مقادیر را به درستی وارد کنید!');
	}
	else {

		document.getElementById('calculatorRow').style.display = 'block';
		let name = document.getElementById('name').value;
		let price = document.getElementById('price').value;
		let weight = document.getElementById('weight').value;
		let used = document.getElementById('used').value;

		let tbody = document.getElementById('tbody');

		let tr = document.createElement('tr');
		tr.id = 'T';
		let dataInput = document.getElementById('dataInput');

		let td1 = document.createElement('td');
		td1.setAttribute('scope', 'col');
		td1.innerText = name;

		let td2 = document.createElement('td');
		td2.setAttribute('scope', 'col');
		td2.innerText = numbersPrettify(price);

		let td3 = document.createElement('td');
		td3.setAttribute('scope', 'col');
		td3.innerText = numbersPrettify(weight);

		let td4 = document.createElement('td');
		td4.setAttribute('scope', 'col');
		td4.innerText = numbersPrettify(used);

		let td5 = document.createElement('td');
		td5.setAttribute('scope', 'col');
		td5.innerText = numbersPrettify(used * price / weight);

		let td6 = document.createElement('td');
		td6.setAttribute('scope', 'col');
		td6.setAttribute('class', 'delete');
		td6.addEventListener('click', openDeleteMenu);
		var img = document.createElement('img');
		img.className = 'deleteRow';
		img.src = './static/image/trash.png';
		td6.setAttribute('data-toggle', "tooltip");
		td6.setAttribute('title', "حذف");
		td6.appendChild(img);

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
		tr.appendChild(td6);

		tbody.insertBefore(tr, dataInput);

		numberOfProducts ++;
		netCost += used * price / weight;
		calculatorRow();
	};
};

function clearInputs() {
	document.getElementById('price').value = '';
	document.getElementById('weight').value = '';
	document.getElementById('used').value = '';
	document.getElementById('name').value = '';
	name = '';

	netCost = 0;
	numberOfProducts = 0;
	calculatorRow();
	document.getElementById('calculatorRow').style.display = 'none';
};

function deleteAllRows() {
	deleteAllCloseButton();
	var removed = 1;
	let tbody = document.getElementById('tbody');

	while (removed) {
		removed = 0;
		tbody.childNodes.forEach(function(item, index) {
			if (item.id == 'T') {
				item.remove();
				removed = 1;
			}
		});
	};
	clearInputs();
};
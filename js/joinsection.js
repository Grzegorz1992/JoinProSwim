const currentGroups = groups;
const basket = groups;
const sectionGroups = document.querySelector(".groups");
const searchBar = document.querySelector(".search-bar");
const scrollBtn = document.querySelector(".scroll-to-top");
const body = document.querySelector("body");
let addToBasketBtns;
let removeFromBasketBtns;

// Elementy koszyka
const basketIcon = document.querySelector(".basket-icon");
const basketForm = document.querySelector(".form-box");
const closeFormBtn = document.querySelector(".close-btn");
const productsBox = document.querySelector(".products-box");
const amountToPay = document.querySelector(".payment-amount");
let selectedGroup = [];

// RENDEROWANIE GRUP

const renderBasket = (items) => {
	productsBox.innerHTML = "";
	for (let i = 0; i < items.length; i++) {
		const productCard = document.createElement("div");
		productCard.classList.add("product-card");

		productCard.innerHTML = `
			<p class="product-level">${items[i].level}</p>
			<p class="product-day">${items[i].day}</p>
			<p class="product-hours">${items[i].hour}</p>
			<p class="product-coach">Trener: <span class="coach">${items[i].coach}</span></p>
			<p class="product-price">Cena: <span class="price">${items[i].price} zł</span></p>
			<button class="remove-from-basket" data-id="${items[i].id}">Usuń</button>
		`;

		productsBox.appendChild(productCard);
	}
	removeFromBasketBtns = document.querySelectorAll(".remove-from-basket");
	removeFromBasketBtns.forEach((btn) => {
		btn.addEventListener("click", removeFromBasket);
	});
};

const addToBasket = (e) => {
	e.preventDefault();
	let selectedId = parseInt(e.target.dataset.id);
	const group = basket.find((group) => group.id === selectedId);

	if (selectedGroup.length < 4) {
		selectedGroup.push(group);
		renderBasket(selectedGroup);
		currentAmountToPay();
	} else {
		alert("Osiągnięto limit 3 elementów w koszyku.");
	}
};

const removeFromBasket = (e) => {
	e.preventDefault();
	let selectedId = parseInt(e.target.dataset.id);
	const updateBasket = selectedGroup.filter((group) => group.id !== selectedId);
	selectedGroup = updateBasket;
	renderBasket(selectedGroup);
	currentAmountToPay();
};

const currentAmountToPay = () => {
	const currentAmountToPay = selectedGroup.reduce((sum, group) => {
		return (sum += group.price);
	}, 0);
	amountToPay.textContent = `${currentAmountToPay} zł`;
};

const renderGroups = (series) => {
	sectionGroups.innerHTML = "";
	for (let i = 0; i < series.length; i++) {
		const newGroup = document.createElement("div");
		newGroup.classList.add("group-item");
		newGroup.innerHTML = `<p class="group-level">${series[i].level}</p>
       				<p class="group-day">${series[i].day}</p>
        					<p class="group-hours">${series[i].hour}</p>
       					<p class="group-coach">
       						Trener: <span class="coach">${series[i].coach}</span>
       					</p>
       					<p class="group-places">
       						Ilość zajęć:<span class="free-places">${series[i].numberofclasses}</span>
       					</p>
       					<p class="group-price">Cena: <span class="price">${series[i].price} zł</span></p>
       					<p class="group-date">
       						Start zajęć: <span class="date">${series[i].start}</span>
       					</p>
       					<p class="group-places">
       						Wolne miejsca: <span class="free-places">${series[i].freeplaces}</span>
       					</p>
       					<button class="choose-group" data-id="${series[i].id}">Wybierz</button>`;

		sectionGroups.appendChild(newGroup);
	}
	addToBasketBtns = document.querySelectorAll(".choose-group");
	addToBasketBtns.forEach((btn) => {
		btn.addEventListener("click", addToBasket);
	});
};

document.addEventListener("DOMContentLoaded", function () {
	renderGroups(currentGroups); // Renderowanie wszystkich grup na początku
	const levelSelect = document.getElementById("level-select");
	const daySelect = document.getElementById("day-select");
	const coachSelect = document.getElementById("coach-select");

	// Nasłuchiwanie zmian w selectach
	levelSelect.addEventListener("change", handleSelectChange);
	daySelect.addEventListener("change", handleSelectChange);
	coachSelect.addEventListener("change", handleSelectChange);
});

// SELEKCJA GRUP

const handleSelectChange = () => {
	const selectedLevel = document.getElementById("level-select").value;
	const selectedDay = document.getElementById("day-select").value;
	const selectedCoach = document.getElementById("coach-select").value;

	// Filtracja grup na podstawie wybranych wartości z selectów
	const filteredGroups = groups.filter((group) => {
		return (
			(selectedLevel === "all" || group.level === selectedLevel) &&
			(selectedDay === "all" || group.day === selectedDay) &&
			(selectedCoach === "all" || group.coach === selectedCoach)
		);
	});

	renderGroups(filteredGroups); // Ponowne renderowanie grup na podstawie filtrowanych danych
};

// SILNIK WYSZUKIWARKI

const searchEngine = (e) => {
	const search = e.target.value;
	const foundGroups = currentGroups.filter((group) => {
		if (
			group.level.toLowerCase().includes(search.toLowerCase()) ||
			group.day.toLowerCase().includes(search.toLowerCase()) ||
			group.coach.toLowerCase().includes(search.toLowerCase())
		) {
			return group;
		}
	});

	renderGroups(foundGroups);

	if (search.length > 4) {
		window.scrollBy(0, 950);
		scrollBtn.classList.add("active");
	}
};

searchBar.addEventListener("input", searchEngine);

const scrollToTop = () => {
	window.scroll({
		top: 0,
		behavior: "smooth",
	});

	scrollBtn.classList.remove("active");
};

scrollBtn.addEventListener("click", scrollToTop);

// OBSŁUGA KOSZYKA

const showBasket = (e) => {
	e.preventDefault();
	// body.classList.add("hide-scroll");
	basketForm.classList.add("active-basket");
};

const hideBasket = (e) => {
	e.preventDefault();
	// body.classList.remove("hide-scroll");
	basketForm.classList.remove("active-basket");
};

basketIcon.addEventListener("click", showBasket);
closeFormBtn.addEventListener("click", hideBasket);

// Walidacja formularza

const paymentBtns = document.querySelectorAll(".choose-payment");
const basketInputs = document.querySelectorAll("input");
const paymentBtn = document.querySelector(".payment-btn");
const phoneRegex = /^\d{9}$/;
const emailRegex = /^[-\w\.]+@([-\w]+\.)+[a-z]+$/i;

const validatePhone = (phone) => {
	return phoneRegex.test(phone);
};

// Funkcja do walidacji adresu e-mail
const validateEmail = (email) => {
	return emailRegex.test(email);
};

const formValidation = (e) => {
	e.preventDefault();

	basketInputs.forEach((input) => {
		if (
			input.value === "" ||
			(input.id === "phone" && !validatePhone(input.value)) ||
			(input.id === "email" && !validateEmail(input.value))
		) {
			showError(input);
		} else if (
			input.value !== "" ||
			(input.id === "phone" && validatePhone(input.value)) ||
			(input.id === "email" && validateEmail(input.value))
		) {
			removeError(input);
		}
	});
};

const showError = (input) => {
	input.classList.add("error-input");
};

const removeError = (input) => {
	input.classList.remove("error-input");
};

const paymentChoice = (e) => {
	e.preventDefault();
	const button = e.target;
	paymentBtns.forEach((btn) => {
		if (btn === button) {
			btn.parentElement.classList.toggle("active-payment");
		} else if (btn !== button) {
			btn.parentElement.classList.remove("active-payment");
		}

		if (btn.parentElement.classList.contains("active-payment")) {
			btn.innerHTML = "Wybrano";
		} else {
			btn.innerHTML = "Wybierz";
		}
	});
};

paymentBtns.forEach((btn) => btn.addEventListener("click", paymentChoice));
paymentBtn.addEventListener("click", formValidation);
basketInputs.forEach((input) => {
	input.addEventListener("input", formValidation);
});

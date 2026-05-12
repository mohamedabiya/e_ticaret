  // BASKET (LOCALSTORAGE)
function getBasket() {
  return JSON.parse(localStorage.getItem("basket")) || [];
}

function setBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

  // BASKET SAYACI
function updateBasketCount() {
  const basketBtn = document.querySelector(".basket-btn");
  if (!basketBtn) return;

  const basket = getBasket();
  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
  basketBtn.textContent = `Basket (${totalItems})`;
}

  // ADD TO CART (LOGIN ZORUNLU )
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart-btn")) {

    const isLoggedIn = localStorage.getItem("loggedIn");

    // LOGIN YOK → ENGEL + UYARI
    if (isLoggedIn !== "true") {
      alert(" Please log in first to add products!");
      window.location.href = "login.html";
      return;
    }

    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    if (!name || isNaN(price)) {
      alert("Product data missing!");
      return;
    }

    let basket = getBasket();
    let existingItem = basket.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      basket.push({
        name: name,
        price: price,
        quantity: 1
      });
    }

    setBasket(basket);
    updateBasketCount();

    alert(` ${name} added to basket!`);
  }
});


  // BASKET GÖSTER
function displayBasket() {
  const basketList = document.getElementById("basket-list");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total-price");

  if (!basketList) return;

  const basket = getBasket();
  let subtotal = 0;
  basketList.innerHTML = "";

  if (basket.length === 0) {
    basketList.innerHTML = "<p>Your basket is empty.</p>";
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  basket.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    basketList.innerHTML += `
      <div class="basket-item" data-index="${index}">
        <div>
          <strong>${item.name}</strong>
          <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <button class="remove-btn">Remove</button>
      </div>
    `;
  });

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${(subtotal + (subtotal > 100 ? 0 : 10)).toFixed(2)}`;
}

  //SEPETTEN SIL
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.closest(".basket-item").dataset.index;
    let basket = getBasket();
    basket.splice(index, 1);
    setBasket(basket);
    displayBasket();
    updateBasketCount();
  }
});


  // LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");

    if (!emailInput || !passwordInput) {
      alert("Inputs not found!");
      return;
    }

    const email = emailInput.value.trim();

    if (email === "") {
      alert("Please enter email!");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", email);

    alert("Login successful !");
    window.location.href = "home.html";
  });
}


// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const password = document.getElementById("reg_password").value;
    const confirm = document.getElementById("reg_confirm_password").value;

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    alert("Registration successful!");
    window.location.href = "login.html";
  });
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");

  alert("Logged out!");
  window.location.href = "login.html";
}

// Button bağlama
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// CATEGORY SEARCH
const categoryForm = document.getElementById("category-search-form");
if (categoryForm) {
  categoryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const value = document
      .getElementById("category-input")
      .value.toLowerCase().trim();

    const categoryMap = {
      clothes: "clothes",
      shoes: "shoes",
      bags: "bags",
      devices: "devices",
      "watch & accessory": "watch-accessory",
      watch: "watch-accessory"
    };

    if (categoryMap[value]) {
      window.location.href = `product.html#${categoryMap[value]}`;
    } else {
      alert("Category not found!");
    }
  });
}

// LANGUAGE SELECTION
const langForm = document.getElementById("lang-form");
if (langForm) {
  langForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const lang = document.getElementById("lang-input").value.toUpperCase();

    if (lang === "EN") {
      alert("English selected");
    } else if (lang === "TR") {
      alert("Türkçe seçildi");
    } else {
      alert("Language not supported!");
    }
  });
}


//pahe load + button controls
document.addEventListener("DOMContentLoaded", function () {
  updateBasketCount();
  displayBasket();

  const isLoggedIn = localStorage.getItem("loggedIn");
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  // login yoksa buton zayıf görünür
  if (isLoggedIn !== "true") {
    buttons.forEach(btn => {
      btn.style.opacity = "0.6";
      btn.title = "Login required";
    });
  }
});

// BASKET BUTON KONTROLÜ
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("basket-btn")) {
    const basket = getBasket();

    if (basket.length === 0) {
      alert("Your basket is empty!");
      window.location.href = "product.html";
    } else {
      window.location.href = "basket.html";
    }
  }
});

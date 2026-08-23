let cart = [];

const WA_NUMBER = "6282178601945";


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);

}


/* =========================
   KERANJANG
========================= */

function addToCart(name, price) {

    const existing = cart.find(
        item => item.name === name
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    document
        .getElementById("cart")
        .classList.add("show");

    document
        .getElementById("overlay")
        .classList.add("show");

}


function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Belum ada pesanan 🍚</p>';

    } else {

        cart.forEach((item, index) => {

            cartItems.innerHTML += `

                <div class="cart-item">

                    <div>

                        <h4>${item.name}</h4>

                        <p>
                            ${formatRupiah(item.price)}
                            × ${item.quantity}
                        </p>

                    </div>

                    <button
                        class="remove"
                        onclick="removeItem(${index})">

                        Hapus

                    </button>

                </div>

            `;

        });

    }


    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );


    const totalPrice = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    cartCount.textContent =
        totalQuantity;

    cartTotal.textContent =
        formatRupiah(totalPrice);

}


function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}


function toggleCart() {

    document
        .getElementById("cart")
        .classList.toggle("show");

    document
        .getElementById("overlay")
        .classList.toggle("show");

}


/* =========================
   FILTER MENU
========================= */

function filterProducts(category, button) {

    document
        .querySelectorAll(".category button")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    const selectedCategory =
        category.trim().toLowerCase();


    document
        .querySelectorAll(".product-card")
        .forEach(product => {

            const productCategory =
                (product.dataset.category || "")
                .trim()
                .toLowerCase();


            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

}


/* =========================
   SEARCH
========================= */

function searchProducts() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    document
        .querySelectorAll(".product-card")
        .forEach(product => {

            const name =
                product
                    .querySelector("h3")
                    .textContent
                    .toLowerCase();


            product.style.display =
                name.includes(keyword)
                    ? ""
                    : "none";

        });

}


/* =========================
   CHECKOUT WHATSAPP
========================= */

function checkout() {

    if (cart.length === 0) {

        alert("Keranjang masih kosong 😭");

        return;

    }


    let message =
        "laper nih kak, saya mau PO rice bowl dong:%0A%0A";


    let total = 0;


    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;


        total += subtotal;


        message +=
            `• ${item.name} x${item.quantity} = ${formatRupiah(subtotal)}%0A`;

    });


    message +=
        `%0ATotal: ${formatRupiah(total)}%0A%0AMohon info untuk proses PO ya.`;


    const whatsappURL =
        `https://wa.me/${WA_NUMBER}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================
   AKUN / LOGIN
========================= */

function openAccount() {

    const modal =
        document.getElementById("accountModal");

    modal.classList.add("show");

    checkLogin();

}


function closeAccount() {

    document
        .getElementById("accountModal")
        .classList.remove("show");

}


/* =========================
   TAMPILAN LOGIN
========================= */

function showLogin() {

    document.getElementById("loginForm")
        .style.display = "block";

    document.getElementById("registerForm")
        .style.display = "none";

    document.getElementById("profileForm")
        .style.display = "none";

}


function showRegister() {

    document.getElementById("loginForm")
        .style.display = "none";

    document.getElementById("registerForm")
        .style.display = "block";

    document.getElementById("profileForm")
        .style.display = "none";

}


/* =========================
   DAFTAR AKUN
========================= */

function register() {

    const name =
        document
            .getElementById("registerName")
            .value
            .trim();


    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("registerPassword")
            .value;


    if (!name || !email || !password) {

        alert("Lengkapi semua data dulu ya 😭");

        return;

    }


    if (password.length < 6) {

        alert("Password minimal 6 karakter ya 🔐");

        return;

    }


    const user = {

        name: name,

        email: email,

        password: password

    };


    localStorage.setItem(
        "yoncUser",
        JSON.stringify(user)
    );


    localStorage.setItem(
        "yoncLoggedIn",
        "true"
    );


    alert(
        "Akun berhasil dibuat! 🎉"
    );


    checkLogin();

}


/* =========================
   LOGIN
========================= */

function login() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    const savedUser =
        JSON.parse(
            localStorage.getItem("yoncUser")
        );


    if (!savedUser) {

        alert(
            "Akun belum terdaftar 😭 Silakan daftar dulu."
        );

        return;

    }


    if (
        email === savedUser.email &&
        password === savedUser.password
    ) {

        localStorage.setItem(
            "yoncLoggedIn",
            "true"
        );


        alert(
            "Login berhasil! 🥳"
        );


        checkLogin();

    } else {

        alert(
            "Email atau password salah 😭"
        );

    }

}


/* =========================
   CEK STATUS LOGIN
========================= */

function checkLogin() {

    const savedUser =
        JSON.parse(
            localStorage.getItem("yoncUser")
        );


    const loggedIn =
        localStorage.getItem("yoncLoggedIn")
        === "true";


    const accountText =
        document.getElementById("accountText");


    if (
        savedUser &&
        loggedIn
    ) {

        document.getElementById("loginForm")
            .style.display = "none";

        document.getElementById("registerForm")
            .style.display = "none";

        document.getElementById("profileForm")
            .style.display = "block";


        document.getElementById("profileName")
            .textContent =
            "Halo, " + savedUser.name + " 👋";


        document.getElementById("profileEmail")
            .textContent =
            savedUser.email;


        accountText.textContent =
            savedUser.name;

    } else {

        showLogin();

        accountText.textContent =
            "Akun";

    }

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.setItem(
        "yoncLoggedIn",
        "false"
    );


    alert(
        "Kamu berhasil logout 👋"
    );


    checkLogin();

}


/* =========================
   START
========================= */

updateCart();

checkLogin();

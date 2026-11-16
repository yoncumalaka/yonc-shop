let cart = [];

const WA_NUMBER = "6282178601945";
let activeCategory = "all";

/* FORMAT RUPIAH */
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

/* ADD TO CART */
function addToCart(name, price) {
    const existing = cart.find(
        item => item.name === name
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
    setCart(true);
}

/* UPDATE CART */
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartCount || !cartTotal) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Keranjang masih kosong.</p>';
    }

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");

        const title = document.createElement("h4");
        title.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            `${formatRupiah(item.price)} × ${item.quantity}`;

        details.append(title, price);

        const remove = document.createElement("button");
        remove.className = "remove";
        remove.textContent = "Hapus";

        remove.onclick = () => removeItem(index);

        row.append(details, remove);
        cartItems.appendChild(row);
    });

    const quantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = quantity;
    cartTotal.textContent = formatRupiah(total);
}

/* REMOVE ITEM */
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

/* TOGGLE CART */
function setCart(open) {
    document.getElementById("cart").classList.toggle("show", open);
    document.getElementById("overlay").classList.toggle("show", open);
    document.body.classList.toggle("cart-open", open);
}

function toggleCart() {
    const cart = document.getElementById("cart");

    setCart(!cart.classList.contains("show"));
}

/* FILTER + SEARCH */
function applyFilters() {
    const keyword = document
        .getElementById("searchInput")
        .value.trim().toLowerCase();

    let visible = 0;

    document.querySelectorAll(".product-card").forEach(product => {
        const category = (
            product.dataset.category || ""
        ).toLowerCase();

        const name = product.querySelector("h3")
            .textContent.toLowerCase();

        const categoryMatch =
            activeCategory === "all" ||
            category === activeCategory.toLowerCase();

        const searchMatch = name.includes(keyword);

        const show = categoryMatch && searchMatch;

        product.hidden = !show;

        if (show) visible++;
    });

    const empty = document.getElementById("noProducts");

    if (empty) {
        empty.hidden = visible !== 0;
    }
}

/* FILTER CATEGORY */
function filterProducts(category, button) {
    activeCategory = category;

    document.querySelectorAll(".category button")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    button.classList.add("active");

    applyFilters();
}

/* SEARCH */
function searchProducts() {
    applyFilters();
}

/* CHECKOUT WHATSAPP */
function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    let total = 0;

    let message = [
        "Halo kak, saya tertarik membeli item di Cube Gale.",
        "",
        "Berikut daftar pesanan saya:"
    ];

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;

        total += subtotal;

        message.push(
            `• ${item.name} x${item.quantity} = ${formatRupiah(subtotal)}`
        );
    });

    message.push(
        "",
        `Total: ${formatRupiah(total)}`,
        "",
        "Apakah item masih tersedia?",
        "Terima kasih!"
    );

    const whatsappURL =
        `https://wa.me/${WA_NUMBER}?text=${
            encodeURIComponent(message.join("\n"))
        }`;

    window.open(whatsappURL, "_blank");
}

/* CLOSE WELCOME */
function closeWelcome() {
    const welcome = document.getElementById("welcomeScreen");

    if (!welcome) return;

    welcome.classList.add("hide");

    setTimeout(() => {
        welcome.style.display = "none";
    }, 450);
}

/* INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
    updateCart();
    applyFilters();

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setCart(false);
        }
    });
});

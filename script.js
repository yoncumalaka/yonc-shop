// ============================
// KONFIGURASI
// ============================

// Ganti dengan nomor WhatsApp toko kamu.
// Format: 62xxxxxxxxxx
const WHATSAPP_NUMBER = "6282178601945";


// ============================
// DATA KERANJANG
// ============================

let cart = [];

let activeCategory = "all";


// ============================
// FORMAT RUPIAH
// ============================

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}


// ============================
// ELEMENT HTML
// ============================

const cartElement = document.getElementById("cart");
const overlayElement = document.getElementById("overlay");

const cartItemsElement = document.getElementById("cartItems");
const cartCountElement = document.getElementById("cartCount");
const cartTotalElement = document.getElementById("cartTotal");

const searchInput = document.getElementById("searchInput");

const productCards = document.querySelectorAll(".product-card");

const categoryButtons = document.querySelectorAll(".category button");


// ============================
// BUKA / TUTUP KERANJANG
// ============================

function toggleCart() {

    cartElement.classList.toggle("show");

    overlayElement.classList.toggle("show");

}


// ============================
// TAMBAH KE KERANJANG
// ============================

function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    renderCart();

}


// ============================
// HAPUS ITEM
// ============================

function removeItem(index) {

    cart.splice(index, 1);

    renderCart();

}


// ============================
// TAMPILKAN KERANJANG
// ============================

function renderCart() {

    cartItemsElement.innerHTML = "";

    let total = 0;
    let count = 0;


    if (cart.length === 0) {

        cartItemsElement.innerHTML = `
            <p class="empty-cart">
                Keranjang masih kosong.
            </p>
        `;

    }


    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        count += item.quantity;


        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `

            <div>

                <h4>${item.name}</h4>

                <p>
                    ${item.quantity} × ${rupiah(item.price)}
                </p>

            </div>

            <div>

                <p>${rupiah(subtotal)}</p>

                <button onclick="removeItem(${index})">
                    Hapus
                </button>

            </div>

        `;

        cartItemsElement.appendChild(itemElement);

    });


    cartCountElement.textContent = count;

    cartTotalElement.textContent = rupiah(total);

}


// ============================
// FILTER PRODUK
// ============================

function filterProducts(category, button) {

    activeCategory = category;


    categoryButtons.forEach(btn => {

        btn.classList.remove("active");

    });


    button.classList.add("active");


    applyFilters();

}


// ============================
// PENCARIAN + FILTER
// ============================

function applyFilters() {

    const keyword = searchInput.value.toLowerCase().trim();

    let visible = 0;


    productCards.forEach(card => {

        const category = card.dataset.category.toLowerCase();

        const name = card.dataset.name.toLowerCase();


        const matchCategory =
            activeCategory === "all" ||
            category === activeCategory;


        const matchSearch =
            name.includes(keyword);


        if (matchCategory && matchSearch) {

            card.style.display = "";

            visible++;

        } else {

            card.style.display = "none";

        }

    });


    document.getElementById("visibleCount").textContent = visible;


    const noProducts = document.getElementById("noProducts");

    noProducts.style.display = visible === 0 ? "block" : "none";

}


// ============================
// EVENT SEARCH
// ============================

searchInput.addEventListener("input", applyFilters);


// ============================
// CHECKOUT WHATSAPP
// ============================

function checkout() {

    if (cart.length === 0) {

        alert("Keranjang kamu masih kosong!");

        return;

    }


    let message = "Halo Cube Gale! Saya ingin memesan:\n\n";

    let total = 0;


    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        total += subtotal;


        message +=
            `${index + 1}. ${item.name}\n` +
            `Jumlah: ${item.quantity}\n` +
            `Harga: ${rupiah(subtotal)}\n\n`;

    });


    message +=
        "----------------------\n" +
        `TOTAL: ${rupiah(total)}\n\n` +
        "Mohon info ketersediaan barangnya. Terima kasih!";


    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);


    window.open(whatsappURL, "_blank");

}


// ============================
// TUTUP KERANJANG DENGAN ESC
// ============================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        cartElement.classList.remove("show");

        overlayElement.classList.remove("show");

    }

});


// ============================
// GAMBAR PENGGANTI
// ============================

document.querySelectorAll(".product-image").forEach((img, index) => {

    img.addEventListener("error", function() {

        const number = String(index + 1).padStart(2, "0");

        this.src = "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="500" height="625">

                    <rect width="100%" height="100%"
                          fill="#e9e5db"/>

                    <text x="50%" y="46%"
                          text-anchor="middle"
                          fill="#9b7956"
                          font-size="65"
                          font-family="Arial"
                          font-weight="bold">
                        CG.
                    </text>

                    <text x="50%" y="56%"
                          text-anchor="middle"
                          fill="#85877d"
                          font-size="17"
                          font-family="Arial">
                        FOTO ${number}
                    </text>

                    <text x="50%" y="62%"
                          text-anchor="middle"
                          fill="#85877d"
                          font-size="12"
                          font-family="Arial">
                        GANTI FOTO PRODUK
                    </text>

                </svg>
            `);

    }, { once: true });

});


// ============================
// INIT
// ============================

renderCart();

applyFilters();

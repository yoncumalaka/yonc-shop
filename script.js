document.addEventListener("DOMContentLoaded", function () {

    // ==================================
    // 1. KONFIGURASI
    // ==================================

    const WHATSAPP_NUMBER = "6282178601945";

    let cart = [];
    let activeCategory = "all";

    const categories = [
        { name: "Semua", value: "all" },
        { name: "Outer", value: "outer" },
        { name: "Atasan", value: "atasan" },
        { name: "Bawahan", value: "bawahan" },
        { name: "Aksesoris", value: "aksesoris" },
        { name: "Random Finds", value: "random" }
    ];


    // ==================================
    // 2. AMBIL ELEMEN HTML
    // ==================================

    const categoryContainer = document.querySelector(".category");
    const searchInput = document.getElementById("searchInput");

    const productCards = document.querySelectorAll(".product-card");

    const visibleCount = document.getElementById("visibleCount");
    const noProducts = document.getElementById("noProducts");

    const cartElement = document.getElementById("cart");
    const overlayElement = document.getElementById("overlay");

    const cartItemsElement = document.getElementById("cartItems");
    const cartCountElement = document.getElementById("cartCount");
    const cartTotalElement = document.getElementById("cartTotal");


    // ==================================
    // 3. FORMAT RUPIAH
    // ==================================

    function rupiah(number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(number);
    }


    // ==================================
    // 4. MEMBUAT TOMBOL KATEGORI
    // ==================================

    function createCategories() {

        if (!categoryContainer) {
            console.error("Elemen .category tidak ditemukan!");
            return;
        }

        categoryContainer.innerHTML = "";

        categories.forEach(category => {

            const button = document.createElement("button");

            button.type = "button";
            button.textContent = category.name;
            button.dataset.filter = category.value;

            if (category.value === "all") {
                button.classList.add("active");
            }

            button.addEventListener("click", function () {

                activeCategory = category.value;

                document.querySelectorAll(".category button")
                    .forEach(btn => btn.classList.remove("active"));

                button.classList.add("active");

                applyFilters();

            });

            categoryContainer.appendChild(button);

        });

    }


    // ==================================
    // 5. FILTER KATEGORI + PENCARIAN
    // ==================================

    function applyFilters() {

        const keyword = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        let visible = 0;

        productCards.forEach(card => {

            const category = (
                card.dataset.category || ""
            ).toLowerCase();

            const name = (
                card.dataset.name || ""
            ).toLowerCase();

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

        if (visibleCount) {
            visibleCount.textContent = visible;
        }

        if (noProducts) {
            noProducts.style.display =
                visible === 0 ? "block" : "none";
        }

    }


    // ==================================
    // 6. EVENT PENCARIAN
    // ==================================

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }


    // ==================================
    // 7. KERANJANG
    // ==================================

    function toggleCart() {

        if (!cartElement || !overlayElement) return;

        cartElement.classList.toggle("show");
        overlayElement.classList.toggle("show");

    }

    function closeCart() {

        if (!cartElement || !overlayElement) return;

        cartElement.classList.remove("show");
        overlayElement.classList.remove("show");

    }


    // ==================================
    // 8. TAMBAH PRODUK
    // ==================================

    function addToCart(name, price) {

        const existingItem = cart.find(
            item => item.name === name
        );

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                name: name,
                price: Number(price),
                quantity: 1
            });

        }

        renderCart();

        if (cartElement && overlayElement) {
            cartElement.classList.add("show");
            overlayElement.classList.add("show");
        }

    }


    // ==================================
    // 9. HAPUS PRODUK
    // ==================================

    function removeItem(index) {

        if (index < 0 || index >= cart.length) return;

        cart.splice(index, 1);

        renderCart();

    }


    // ==================================
    // 10. TAMPILKAN KERANJANG
    // ==================================

    function renderCart() {

        if (!cartItemsElement) return;

        cartItemsElement.innerHTML = "";

        let total = 0;
        let count = 0;

        if (cart.length === 0) {

            const empty = document.createElement("p");

            empty.className = "empty-cart";
            empty.textContent = "Keranjang masih kosong.";

            cartItemsElement.appendChild(empty);

        }

        cart.forEach((item, index) => {

            const subtotal = item.price * item.quantity;

            total += subtotal;
            count += item.quantity;

            const row = document.createElement("div");
            row.className = "cart-item";

            const info = document.createElement("div");

            const title = document.createElement("h4");
            title.textContent = item.name;

            const detail = document.createElement("p");
            detail.textContent =
                `${item.quantity} × ${rupiah(item.price)}`;

            info.appendChild(title);
            info.appendChild(detail);

            const action = document.createElement("div");

            const price = document.createElement("p");
            price.textContent = rupiah(subtotal);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "Hapus";

            remove.addEventListener("click", function () {
                removeItem(index);
            });

            action.appendChild(price);
            action.appendChild(remove);

            row.appendChild(info);
            row.appendChild(action);

            cartItemsElement.appendChild(row);

        });

        if (cartCountElement) {
            cartCountElement.textContent = count;
        }

        if (cartTotalElement) {
            cartTotalElement.textContent = rupiah(total);
        }

    }


    // ==================================
    // 11. CHECKOUT WHATSAPP
    // ==================================

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

        const url =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);

        window.open(url, "_blank");

    }


    // ==================================
    // 12. GAMBAR PENGGANTI JIKA ERROR
    // ==================================

    document.querySelectorAll(".product-image").forEach((img, index) => {

        img.addEventListener("error", function () {

            const number = String(index + 1).padStart(2, "0");

            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="500" height="625">

                    <rect width="100%" height="100%"
                          fill="#e9e5db"/>

                    <text x="50%" y="45%"
                          text-anchor="middle"
                          fill="#9b7956"
                          font-size="75"
                          font-family="Arial"
                          font-weight="bold">
                        CG.
                    </text>

                    <text x="50%" y="55%"
                          text-anchor="middle"
                          fill="#85877d"
                          font-size="18"
                          font-family="Arial">
                        FOTO ${number}
                    </text>

                    <text x="50%" y="62%"
                          text-anchor="middle"
                          fill="#85877d"
                          font-size="13"
                          font-family="Arial">
                        CUBE GALE
                    </text>

                </svg>
            `;

            this.src =
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(svg);

        }, { once: true });

    });


    // ==================================
    // 13. EVENT OVERLAY
    // ==================================

    if (overlayElement) {
        overlayElement.addEventListener("click", closeCart);
    }


    // ==================================
    // 14. TOMBOL ESCAPE
    // ==================================

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeCart();
        }

    });


    // ==================================
    // 15. HUBUNGKAN FUNGSI KE HTML
    // ==================================

    window.toggleCart = toggleCart;
    window.addToCart = addToCart;
    window.removeItem = removeItem;
    window.checkout = checkout;


    // ==================================
    // 16. JALANKAN SAAT WEBSITE DIBUKA
    // ==================================

    createCategories();

    applyFilters();

    renderCart();

});

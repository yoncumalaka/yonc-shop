let cart = [];

const WA_NUMBER = "6282178601945";


function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {

        style: "currency",

        currency: "IDR",

        maximumFractionDigits: 0

    }).format(number);

}


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

        (sum, item) =>
            sum + item.quantity,

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


function filterProducts(category, button) {
    document.querySelectorAll(".category button").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    document.querySelectorAll(".product-card").forEach(product => {
        const productCategory =
            (product.dataset.category || "").trim().toLowerCase();

        const selectedCategory =
            (category || "").trim().toLowerCase();

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


function searchProducts() {

    const keyword = document
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


updateCart();

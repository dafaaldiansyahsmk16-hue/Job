/* ====== PENGATURAN: ubah data contoh ini sesuai milik klien ====== */
const CONFIG = {
  nama: "Kedai Rasa Kita",
  wa: "6281234567890",              // format internasional, tanpa + atau 0 di depan
  alamat: "Jl. Contoh No. 12, Kelurahan Contoh, Kota Contoh",
  maps: "https://www.google.com/maps/search/?api=1&query=Jl.+Contoh+No.+12",
  buka: 8, tutup: 21                // jam buka dan tutup (format 24 jam)
};

const KATEGORI = ["Semua", "Makanan", "Minuman", "Camilan", "Paket Hemat"];

const MENU = [
  { id: 1, nama: "Nasi Ayam Goreng", kat: "Makanan", harga: 18000, ket: "Ayam goreng, sambal, lalapan", ikon: "🍗" },
  { id: 2, nama: "Mie Goreng Spesial", kat: "Makanan", harga: 15000, ket: "Telur, sayur, bakso", ikon: "🍜" },
  { id: 3, nama: "Nasi Goreng Kampung", kat: "Makanan", harga: 14000, ket: "Teri, telur, kerupuk", ikon: "🍳" },
  { id: 4, nama: "Es Teh Manis", kat: "Minuman", harga: 4000, ket: "Segar, manisnya pas", ikon: "🧋" },
  { id: 5, nama: "Kopi Susu Gula Aren", kat: "Minuman", harga: 12000, ket: "Dingin, tidak terlalu manis", ikon: "☕" },
  { id: 6, nama: "Jus Alpukat", kat: "Minuman", harga: 13000, ket: "Alpukat asli, cokelat cair", ikon: "🥑" },
  { id: 7, nama: "Pisang Goreng", kat: "Camilan", harga: 8000, ket: "5 potong, renyah", ikon: "🍌" },
  { id: 8, nama: "Tahu Crispy", kat: "Camilan", harga: 7000, ket: "Bumbu pedas gurih", ikon: "🧆" },
  { id: 9, nama: "Paket Berdua", kat: "Paket Hemat", harga: 35000, ket: "2 nasi ayam + 2 es teh", ikon: "🍱" },
  { id: 10, nama: "Paket Ngopi Santai", kat: "Paket Hemat", harga: 25000, ket: "2 kopi susu + pisang goreng", ikon: "🥤" }
];
/* ================================================================= */

const $ = (s) => document.querySelector(s);
const rp = (n) => "Rp" + n.toLocaleString("id-ID");
const waLink = (teks) => `https://wa.me/${CONFIG.wa}` + (teks ? `?text=${encodeURIComponent(teks)}` : "");

let kategoriAktif = "Semua";
let keranjang = {}; // { id: jumlah }

/* ---------- Info toko ---------- */
function isiInfo() {
  $("#brandName").textContent = CONFIG.nama;
  $("#alamat").textContent = CONFIG.alamat;
  $("#jam").textContent = `Buka setiap hari, pukul ${String(CONFIG.buka).padStart(2, "0")}.00 – ${String(CONFIG.tutup).padStart(2, "0")}.00`;
  $("#maps").href = CONFIG.maps;
  $("#year").textContent = new Date().getFullYear();
  const pesanAwal = `Halo ${CONFIG.nama}, saya mau tanya menu.`;
  ["#waHero", "#waFloat"].forEach((s) => ($(s).href = waLink(pesanAwal)));
  const jam = new Date().getHours();
  const buka = jam >= CONFIG.buka && jam < CONFIG.tutup;
  const el = $("#status");
  el.textContent = buka ? `Buka sekarang, sampai pukul ${CONFIG.tutup}.00` : `Tutup, buka lagi pukul ${CONFIG.buka}.00`;
  el.classList.toggle("open", buka);
}

/* ---------- Menu ---------- */
function renderChips() {
  $("#chips").innerHTML = KATEGORI.map(
    (k) => `<button class="chip" role="tab" aria-selected="${k === kategoriAktif}" data-k="${k}">${k}</button>`
  ).join("");
}

function renderMenu() {
  const daftar = MENU.filter((m) => kategoriAktif === "Semua" || m.kat === kategoriAktif);
  $("#menuGrid").innerHTML = daftar
    .map(
      (m) => `<article class="item">
        <div class="thumb" aria-hidden="true">${m.ikon}</div>
        <div class="body"><h3>${m.nama}</h3><p>${m.ket}</p><div class="price">${rp(m.harga)}</div></div>
        <button class="add" data-id="${m.id}" aria-label="Tambah ${m.nama}">+</button>
      </article>`
    )
    .join("");
}

/* ---------- Keranjang ---------- */
function totalItem() { return Object.values(keranjang).reduce((a, b) => a + b, 0); }
function totalHarga() {
  return Object.entries(keranjang).reduce((s, [id, q]) => s + MENU.find((m) => m.id == id).harga * q, 0);
}

function renderCart() {
  const ids = Object.keys(keranjang);
  $("#cartList").innerHTML = ids.length
    ? ids.map((id) => {
        const m = MENU.find((x) => x.id == id), q = keranjang[id];
        return `<div class="row"><div class="nm">${m.nama}<small>${rp(m.harga)}</small></div>
          <div class="qty"><button data-d="-1" data-id="${id}" aria-label="Kurangi">−</button><b>${q}</b>
          <button data-d="1" data-id="${id}" aria-label="Tambah">+</button></div></div>`;
      }).join("")
    : `<p class="empty">Belum ada menu dipilih.</p>`;
  $("#total").textContent = rp(totalHarga());
  const badge = $("#cartCount");
  badge.textContent = totalItem();
  badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop");
  updateKirim();
}

function updateKirim() {
  const btn = $("#kirim");
  btn.classList.toggle("disabled", totalItem() === 0);
  const baris = Object.entries(keranjang).map(([id, q]) => {
    const m = MENU.find((x) => x.id == id);
    return `- ${m.nama} x${q} = ${rp(m.harga * q)}`;
  });
  const nama = $("#nama").value.trim();
  const catatan = $("#catatan").value.trim();
  const teks = [
    `Halo ${CONFIG.nama}, saya mau pesan:`, ...baris, "",
    `Total: ${rp(totalHarga())}`,
    nama ? `Nama: ${nama}` : "", catatan ? `Catatan: ${catatan}` : ""
  ].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n");
  btn.href = waLink(teks);
}

function ubah(id, d) {
  keranjang[id] = (keranjang[id] || 0) + d;
  if (keranjang[id] <= 0) delete keranjang[id];
  renderCart();
}

function bukaCart(buka) {
  $("#sheet").classList.toggle("open", buka);
  $("#sheet").setAttribute("aria-hidden", String(!buka));
  $("#sheetBg").hidden = !buka;
}

/* ---------- Event ---------- */
$("#chips").addEventListener("click", (e) => {
  const k = e.target.dataset.k;
  if (!k) return;
  kategoriAktif = k; renderChips(); renderMenu();
});
$("#menuGrid").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (id) ubah(id, 1);
});
$("#cartList").addEventListener("click", (e) => {
  const { id, d } = e.target.dataset;
  if (id && d) ubah(id, Number(d));
});
$("#openCart").addEventListener("click", () => bukaCart(true));
$("#closeCart").addEventListener("click", () => bukaCart(false));
$("#sheetBg").addEventListener("click", () => bukaCart(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && bukaCart(false));
$("#nama").addEventListener("input", updateKirim);
$("#catatan").addEventListener("input", updateKirim);

/* ---------- Animasi scroll (ringan: IntersectionObserver) ---------- */
function aktifkanReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach((el) => io.observe(el));
}

isiInfo(); renderChips(); renderMenu(); renderCart(); aktifkanReveal();

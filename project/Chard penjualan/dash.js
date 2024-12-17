// Data produk
const produk = [
    { id: 1, nama: 'Mobil Bmw', harga: 1000000000, stok: 50 },
    { id: 2, nama: 'Mobil Porsche', harga: 200000000, stok: 30 },
    { id: 3, nama: 'Mobil Mercedes', harga: 150000000, stok: 40 },
];

// Data penjualan
const penjualan = [
    { idPenjualan: 1, idProduk: 1, jumlah: 10, tanggal: '2024-01-15' },
    { idPenjualan: 2, idProduk: 2, jumlah: 5, tanggal: '2024-02-10' },
    { idPenjualan: 3, idProduk: 3, jumlah: 7, tanggal: '2024-03-20' },
    { idPenjualan: 4, idProduk: 1, jumlah: 3, tanggal: '2024-04-05' },
];

// Helper function: Mengambil bulan dari tanggal
function getMonth(tanggal) {
    return new Date(tanggal).getMonth();
}

// Memproses data penjualan untuk grafik penjualan bulanan
const penjualanBulanan = Array(12).fill(0); // Array dengan 12 bulan
penjualan.forEach(item => {
    const bulan = getMonth(item.tanggal);
    penjualanBulanan[bulan] += item.jumlah;
});

// Data chart untuk penjualan
const dataPenjualan = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [{
        label: 'Penjualan (Jumlah Produk Terjual)',
        data: penjualanBulanan,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

// Memproses data stok produk untuk grafik
const stokProdukData = produk.map(item => item.stok);

// Data chart untuk stok produk
const dataStokProduk = {
    labels: produk.map(item => item.nama),
    datasets: [{
        label: 'Stok Produk',
        data: stokProdukData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

// Insight
const totalPenjualan = penjualan.reduce((acc, curr) => acc + curr.jumlah * produk.find(p => p.id === curr.idProduk).harga, 0);
const rataRataPenjualan = (totalPenjualan / penjualan.length).toFixed(2);
const penjualanTertinggi = Math.max(...penjualanBulanan);

document.getElementById('totalPenjualan').textContent = `Rp. ${totalPenjualan}`;
document.getElementById('rataRataPenjualan').textContent = `Rp. ${rataRataPenjualan}`;
document.getElementById('penjualanTertinggi').textContent = `Rp. ${penjualanTertinggi}`;

// Render Chart Penjualan
const penjualanChart = new Chart(
    document.getElementById('penjualanChart'), {
        type: 'bar',
        data: dataPenjualan,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
);

// Render Chart Stok Produk
const stokProdukChart = new Chart(
    document.getElementById('stokProdukChart'), {
        type: 'bar',
        data: dataStokProduk,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
);

// Sidebar toggle for mobile
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Fungsi untuk menampilkan halaman yang berbeda
function showPage(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');
}

// Fungsi untuk mengunduh laporan (simulasi)
function downloadLaporan() {
    alert('Laporan berhasil diunduh!');
}

// Menampilkan tabel produk
function loadProduk() {
    const tableBody = document.querySelector("#produk tbody");
    tableBody.innerHTML = "";
    produk.forEach(item => {
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.nama}</td>
                <td>Rp. ${item.harga}</td>
                <td>${item.stok}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Menampilkan tabel penjualan
function loadPenjualan() {
    const tableBody = document.querySelector("#penjualan tbody");
    tableBody.innerHTML = "";
    penjualan.forEach(item => {
        const produkItem = produk.find(p => p.id === item.idProduk);
        const row = `
            <tr>
                <td>${item.idPenjualan}</td>
                <td>${produkItem ? produkItem.nama : 'Produk Tidak Ditemukan'}</td>
                <td>${item.jumlah}</td>
                <td>${item.tanggal}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

loadProduk();
loadPenjualan();
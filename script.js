const btn = document.getElementById("btn");
const teks = document.getElementById("teks");
const apiKeyInput = document.getElementById("api-key");
const btnKey = document.getElementById("btn-key");
const deleteKeyLink = document.getElementById("delete-key");

// 1. Cek apakah ada API Key tersimpan di LocalStorage saat load
const savedKey = localStorage.getItem("omdbApiKey");
apiKeyInput.value = savedKey || ""; // Gunakan key tersimpan atau kosong

// 2. Fitur Simpan API Key ke Browser
btnKey.addEventListener("click", () => {
    localStorage.setItem("omdbApiKey", apiKeyInput.value.trim());
    alert("API Key berhasil disimpan! Silakan lakukan pencarian.");
});

// 3. Fitur Hapus API Key
deleteKeyLink.addEventListener("click", (e) => {
    e.preventDefault(); // Mencegah link reload halaman
    localStorage.removeItem("omdbApiKey");
    apiKeyInput.value = "";
    alert("API Key berhasil dihapus dari penyimpanan browser.");
});

btn.addEventListener("click", e => {
    teks.value = teks.value.trim();
    console.log(teks.value);
    if (teks.value !== "") {
        tampilkanData();
    }

})


async function tampilkanData() {

    try {
        const apiKey = apiKeyInput.value; // Ambil API Key dari input user
        // --- MEKANISME WEB API ---
        // 1. Mengirim Request (Permintaan):
        //    Fungsi fetch() mengirimkan HTTP GET request ke server OMDb.
        //    URL mencakup endpoint dan parameter:
        //    - apikey: Identitas klien.
        //    - s: Kata kunci pencarian film dari input user.
        //    'await' menunda eksekusi baris berikutnya hingga server merespons.
        const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=` + encodeURIComponent(teks.value));


        // 2. Validasi Status HTTP:
        //    Memastikan koneksi ke server berhasil (status code 200-299).
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 3. Parsing JSON:
        //    Mengambil body response dan mengubahnya menjadi objek JavaScript.
        const data = await response.json();

        // 4. Logika Aplikasi Berdasarkan Data API:
        if (data.Response === "True") { // OMDb menggunakan properti Response (string)
            const tampilM = document.querySelector(".container");
            let rows = ""; // Variabel penampung HTML


            data.Search.forEach((m, index) => {
                // Isi variabel dengan template string HTML

                let poster = m.Poster
                if (poster === "N/A") {
                    poster = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"; // mohon maaf jika gambar ini dilindungi hak cipta, izinkan saya menggunakan pada web belajar programming saya
                }
                rows += `
        
                <div class="table">
                    <h1>${m.Title}</h1>
                    <img src="${poster}" alt="Poster" width="100%" height="200px">
                    <br>
                    <p>Year: ${m.Year}</p>
                    <p>Type: ${m.Type}</p>  
                    </div>
                        `;
            });

            // Masukkan semua baris sekaligus ke dalam elemen table
            tampilM.innerHTML = rows;

            console.log("Data berhasil diambil", data);
        } else {
            // Jika film tidak ditemukan atau Limit API Key habis
            const tampilM = document.querySelector(".container");
            // Tampilkan pesan error dari OMDb (misal: "Movie not found!" atau "Request limit reached!")
            tampilM.innerHTML = `<h2 style="color: white; background-color: #ff4d4d; padding: 15px; border-radius: 5px;">${data.Error}</h2>`;
            console.log("Error dari API:", data.Error);
        }

    } catch (error) {
        console.log("Terjadi kesalahan:", error);
    }

}
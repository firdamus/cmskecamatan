/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Village, Activity, Commodity, Official, Product, Asset, UserAccount, UserLog } from '../types';

export const VILLAGES_DATA: Village[] = [
  {
    id: '3110009',
    name: 'Rejosari',
    officeAddress: 'Jl. Rejosari Utama No.1, Belitang Jaya, OKU Timur',
    headName: 'Suparno, S.Sos.',
    webStatus: 'Aktif',
    dataStatus: 'Lengkap',
    webUrl: 'rejosari.desa.id',
    lastUpdate: '12 Jun 2025',
    areaHa: 1320,
    boundaries: {
      north: 'Desa Banjar Rejo',
      south: 'Desa Argo Mulyo',
      west: 'Desa Karya Makmur',
      east: 'Desa Madu Condo',
    },
    geographicalInfo: 'Dataran subur di sepanjang aliran Sungai Belitang, cocok untuk pertanian padi dan sayuran organik.',
    history: 'Desa Rejosari berdiri sejak tahun 1948 sebagai pusat permukiman transmigran Jawa yang membuka lahan pertanian di wilayah Belitang Jaya.',
    vision: 'Terwujudnya Desa Rejosari yang Sejahtera, Mandiri, dan Berdaya Saing Berbasis Pertanian Organik.',
    missions: [
      'Meningkatkan produktivitas pertanian organik berbasis kearifan lokal.',
      'Mengembangkan tata kelola pemerintahan desa yang transparan dan akuntabel.',
      'Membangun infrastruktur jalan usaha tani dan irigasi yang memadai.',
      'Mendorong pemberdayaan pemuda melalui BUMDes dan digitalisasi desa.'
    ]
  },
  {
    id: '3110010',
    name: 'Argo Mulyo',
    officeAddress: 'Jl. Raya Argo Mulyo No.1, Belitang Jaya, OKU Timur',
    headName: 'Budi Santoso',
    webStatus: 'Aktif',
    dataStatus: 'Lengkap',
    webUrl: 'argomulyo.desa.id',
    lastUpdate: '10 Jun 2025',
    areaHa: 1250,
    boundaries: {
      north: 'Desa Banjar Rejo',
      south: 'Desa Girimulyo',
      west: 'Desa Karya Makmur',
      east: 'Desa Madu Condo',
    },
    geographicalInfo: 'Dataran rendah, dilalui aliran sungai kecil dengan jenis tanah subur untuk persawahan padi.',
    history: 'Desa Argo Mulyo berdiri sejak tahun 1952, awalnya merupakan transmigrasi generasi pertama dan pemekaran dari desa induk di wilayah Belitang Jaya. Seiring perkembangan waktu, desa berkembang pesat di sektor agraria.',
    vision: 'Terwujudnya Desa Argo Mulyo yang Maju, Mandiri, dan Sejahtera Berbasis Agribisnis dan Gotong Royong.',
    missions: [
      'Meningkatkan tata kelola pemerintahan desa yang bersih, transparan, dan responsif.',
      'Mengoptimalkan pembangunan infrastruktur penunjang pertanian persawahan dan kelistrikan.',
      'Mendorong pemberdayaan ekonomi masyarakat melalui optimalisasi BUMDes dan Koperasi unit desa.',
      'Meningkatkan kualitas pelayanan kesehatan dasar terpadu serta sarana pendidikan anak usia dini.'
    ]
  },
  {
    id: '3110011',
    name: 'Banjar Rejo',
    officeAddress: 'Jl. Banjar Rejo Indah No.3, Belitang Jaya, OKU Timur',
    headName: 'Siti Rahayu',
    webStatus: 'Aktif',
    dataStatus: 'Lengkap',
    webUrl: 'banjarrejo.desa.id',
    lastUpdate: '08 Jun 2025',
    areaHa: 1100,
    boundaries: {
      north: 'Kecamatan Belitang',
      south: 'Desa Argo Mulyo',
      west: 'Desa Karya Makmur',
      east: 'Desa Margokoyo',
    },
    geographicalInfo: 'Kawasan perbukitan landai yang didominasi perkebunan karet rakyat.',
    history: 'Desa Banjar Rejo didirikan oleh para pekebun pada tahun 1965 di bawah program transmigrasi lokal Sumatra Selatan.',
    vision: 'Mewujudkan Desa Banjar Rejo Sebagai Sentra Karet Unggulan Kecamatan yang Makmur dan Sehat.',
    missions: [
      'Peningkatan kualitas penyuluhan perkebunan karet berkelanjutan.',
      'Membangun jejaring perdagangan komoditas pertanian tanpa perantara.',
      'Mengembangkan fasilitas air bersih dan pengolahan sanitasi lingkungan sehat.'
    ]
  },
  {
    id: '3110012',
    name: 'Girimulyo',
    officeAddress: 'Jl. Girimulyo Raya No.5, Belitang Jaya, OKU Timur',
    headName: 'Ahmad Fauzi',
    webStatus: 'Draft',
    dataStatus: 'Belum Lengkap',
    webUrl: 'girimulyo.desa.id',
    lastUpdate: '01 Mar 2025',
    areaHa: 980,
    boundaries: {
      north: 'Desa Argo Mulyo',
      south: 'Sektor Perbatasan Kabupaten',
      west: 'Desa Karya Makmur',
      east: 'Desa Madu Condo',
    },
    geographicalInfo: 'Kombinasi dataran rendah basah dan rawa terkontrol yang cocok untuk peternakan unggas.',
    history: 'Pemekaran sekunder pada era reformasi untuk mempercepat pelayanan administratif kemasyarakatan bagian selatan.',
    vision: 'Mewujudkan Desa Girimulyo yang Religius, Aman, dan Berdikari.',
    missions: [
      'Meningkatkan kerukunan beragama melalui pembinaan kegiatan kepemudaan dan adat.',
      'Optimalisasi tata kelola kas desa dan pendaftaran inventaris aset digital.',
      'Membangun infrastruktur drainase pencegah banjir berkala.'
    ]
  },
  {
    id: '3110013',
    name: 'Karya Makmur',
    officeAddress: 'Jl. Karya Makmur Baru No.2, Belitang Jaya, OKU Timur',
    headName: 'Dewi Kusuma',
    webStatus: 'Aktif',
    dataStatus: 'Perlu Diperbarui',
    webUrl: 'karyamakmur.desa.id',
    lastUpdate: '05 Jun 2025',
    areaHa: 1350,
    boundaries: {
      north: 'Kecamatan Belitang',
      south: 'Desa Girimulyo',
      west: 'Kabupaten Tetangga',
      east: 'Desa Argo Mulyo',
    },
    geographicalInfo: 'Dataran tinggi kering dengan kondisi tanah subur untuk tanaman hortikultura dan palawija.',
    history: 'Dinamakan Karya Makmur berdasarkan penggabungan marga-marga lokal dalam asas kekeluargaan untuk perdamaian daerah perbatasan.',
    vision: 'Menjadikan Desa Karya Makmur Sentra UMKM Kuliner Tradisional Sumatera Selatan yang Mandiri.',
    missions: [
      'Mengembangkan pelatihan pengemasan dan standardisasi kualitas produk olahan pisang.',
      'Penyediaan modal usaha bergulir melalui BUMDes Karya Makmur.',
      'Pengembangan promosi lapak pasar digital desa secara masif.'
    ]
  },
  {
    id: '3110014',
    name: 'Madu Condo',
    officeAddress: 'Jl. Madu Condo Lama No.7, Belitang Jaya, OKU Timur',
    headName: 'Hendra Wijaya',
    webStatus: 'Belum',
    dataStatus: 'Belum Lengkap',
    lastUpdate: '—',
    areaHa: 1050,
    boundaries: {
      north: 'Desa Margokoyo',
      south: 'Batas Kabupaten OKU Timur',
      west: 'Desa Argo Mulyo',
      east: 'Hutan Register Negara',
    },
    geographicalInfo: 'Tanah bergelombang dekat dengan perbatasan hutan, dominan komoditas buah-buahan lokal dan madu hutan.',
    history: 'Awalnya pos penjagaan kehutanan yang bertransformasi menjadi perkampungan mandiri sejak tahun 1978.',
    vision: 'Mewujudkan Madu Condo yang Hijau, Produktif, dan Berbudaya Luhur.',
    missions: [
      'Melestarikan kelestarian daerah penyangga hutan melalui tumpang sari buah.',
      'Merehabilitasi kantor balai desa dan layanan posko kesehatan terpadu.',
      'Melestarikan adat gotong royong dan kesenian tari daerah.'
    ]
  },
  {
    id: '3110015',
    name: 'Margokoyo',
    officeAddress: 'Jl. Margokoyo Jaya No.4, Belitang Jaya, OKU Timur',
    headName: 'Nurul Hidayah',
    webStatus: 'Aktif',
    dataStatus: 'Lengkap',
    webUrl: 'margokoyo.desa.id',
    lastUpdate: '09 Jun 2025',
    areaHa: 1150,
    boundaries: {
      north: 'Kecamatan Belitang',
      south: 'Desa Madu Condo',
      west: 'Desa Banjar Rejo',
      east: 'Hutan Negara',
    },
    geographicalInfo: 'Dataran berpasir besi subur yang menghasilkan kopi robusta berkadar asam unik.',
    history: 'Didirikan oleh perintis transmigran perkebunan kopi asal Jawa Barat dan Palembang sejak tahun 1968.',
    vision: 'Mewujudkan Margokoyo Sebagai Poros Kopi dan Batik Unggulan yang Berdaya Jual Global.',
    missions: [
      'Meningkatkan kapasitas pemrosesan pasca-panen biji buah kopi robusta lokal.',
      'Mengembangkan kelompok pengrajin batik tulis khas Belitang.',
      'Mewujudkan sistem administrasi kependudukan desa berbasis digital.'
    ]
  }
];

export const ACTIVITIES_DATA: Activity[] = [
  { id: 'act1', villageName: 'Argo Mulyo', type: 'Berita Baru', detail: 'Berita "Panen Raya Padi Argo Mulyo 2025" baru saja diterbitkan.', time: '2 jam lalu', category: 'Pertanian', status: 'Terbit', date: '10 Jun 2025' },
  { id: 'act2', villageName: 'Banjar Rejo', type: 'Update Profil', detail: 'Profil umum desa dan batas koordinat diperbarui oleh Operator.', time: '5 jam lalu', category: 'Pemerintahan', status: 'Terbit', date: '09 Jun 2025' },
  { id: 'act3', villageName: 'Margokoyo', type: 'Produk Baru', detail: 'Menambahkan komoditas "Kopi Robusta Margokoyo" ke katalog produk.', time: '1 hari lalu', category: 'Ekonomi', status: 'Terbit', date: '09 Jun 2025' },
  { id: 'act4', villageName: 'Karya Makmur', type: 'Kegiatan Baru', detail: 'Mengunggah jadwal kegiatan "Gotong Royong Bersih Desa".', time: '1 hari lalu', category: 'Lingkungan', status: 'Terbit', date: '07 Jun 2025' },
  { id: 'act5', villageName: 'Argo Mulyo', type: 'Perangkat Update', detail: 'Mengubah status keaktifan data Kepala Kepala Dusun 2 (Wahyudi).', time: '2 hari lalu', category: 'Pemerintahan', status: 'Terbit', date: '05 Jun 2025' },
  { id: 'act6', villageName: 'Madu Condo', type: 'Berita Baru', detail: 'Berita "Program Posyandu Aktif Madu Condo" dipublikasikan.', time: '2 hari lalu', category: 'Kesehatan', status: 'Terbit', date: '08 Jun 2025' },
  { id: 'act7', villageName: 'Banjar Rejo', type: 'Komoditas Baru', detail: '"Karet" ditambahkan sebagai komoditas perkebunan unggulan.', time: '3 hari lalu', category: 'Pertanian', status: 'Terbit', date: '08 Jun 2025' },
  { id: 'act8', villageName: 'Margokoyo', type: 'Aset Baru', detail: 'Registrasi sertifikat dokumen tanah milik kas desa.', time: '3 hari lalu', category: 'Keuangan', status: 'Terbit', date: '06 Jun 2025' },
  { id: 'act9', villageName: 'Girimulyo', type: 'Berita Baru', detail: 'Berita "Musyawarah Desa Girimulyo 2025" tersimpan di folder draft.', time: '4 hari lalu', category: 'Pemerintahan', status: 'Draft', date: '03 Jun 2025' },
  { id: 'act10', villageName: 'Karya Makmur', type: 'Produk Update', detail: 'Mengubah harga stok "Keripik Pisang Original" di katalog lapak.', time: '5 hari lalu', category: 'Ekonomi', status: 'Terbit', date: '05 Jun 2025' }
];

export const COMMODITIES_DATA: Commodity[] = [
  { id: 'com1', name: 'Padi', category: 'Pertanian', villageName: 'Argo Mulyo', estProduction: '450 ton/thn', areaUnit: '380 Ha', status: 'Unggulan', period: 'Maret-April & September-Oktober', description: 'Varietas padi premium IR64 & Ciherang dengan irigasi teknis teratur dan berkelanjutan.', otherVillages: ['Banjar Rejo', 'Girimulyo'] },
  { id: 'com2', name: 'Karet', category: 'Perkebunan', villageName: 'Banjar Rejo', estProduction: '120 ton/thn', areaUnit: '200 Ha', status: 'Unggulan', period: 'Sepanjang Tahun (Kecuali Gugur Daun)', description: 'Hasil getah latex murni berkadar karet kering tinggi, diproduksi oleh sebagian besar pekebun Desa Banjar Rejo.', otherVillages: ['Karya Makmur', 'Madu Condo'] },
  { id: 'com3', name: 'Lele', category: 'Perikanan', villageName: 'Argo Mulyo', estProduction: '80 ton/thn', areaUnit: '45 kolam', status: 'Biasa', period: 'Setiap 3 Bulan', description: 'Sistem budidaya lele terpal bioflok dengan kemudahan panen cepat dan ramah lingkungan.', otherVillages: ['Banjar Rejo'] },
  { id: 'com4', name: 'Ayam Broiler', category: 'Peternakan', villageName: 'Girimulyo', estProduction: '5.000 ekor', areaUnit: '8 kandang', status: 'Biasa', period: 'Setiap 40 Hari', description: 'Peternakan ayam potong modern, terintegrasi dengan pengolahan pasca panen lokal.', otherVillages: ['Madu Condo'] },
  { id: 'com5', name: 'Keripik Pisang', category: 'UMKM', villageName: 'Karya Makmur', estProduction: '2 ton/bln', areaUnit: '12 unit', status: 'Unggulan', period: 'Setiap Hari', description: 'Camilan keripik gurih renyah aneka rasa (coklat, asin, manis) menggunakan pisang pilihan kebun desa.', otherVillages: ['Argo Mulyo'] },
  { id: 'com6', name: 'Kopi Robusta', category: 'Perkebunan', villageName: 'Margokoyo', estProduction: '60 ton/thn', areaUnit: '150 Ha', status: 'Unggulan', period: 'Juni - Agustus', description: 'Biji kopi robusta pegunungan lokal diproses semi-wash menghasilkan warna yang pekat dan kadar kafein seimbang.', otherVillages: ['Madu Condo'] },
  { id: 'com7', name: 'Sapi Potong', category: 'Peternakan', villageName: 'Madu Condo', estProduction: '200 ekor', areaUnit: '3 kandang', status: 'Biasa', period: 'Bulan Haji & Hari Raya', description: 'Budidaya penggemukan sapi brahman & simental alami dengan pakan rumput organik gajah.', otherVillages: ['Girimulyo'] },
  { id: 'com8', name: 'Anyaman Bambu', category: 'Kerajinan', villageName: 'Argo Mulyo', estProduction: '500 pcs/bln', areaUnit: '18 unit', status: 'Unggulan', period: 'Setiap Hari', description: 'Kerajinan nampan, caping petang, keranjang, dan rupa-rupa hiasan interior berbahan bambu tali lokal.', otherVillages: ['Margokoyo'] },
  { id: 'com9', name: 'Jagung', category: 'Pertanian', villageName: 'Banjar Rejo', estProduction: '300 ton/thn', areaUnit: '220 Ha', status: 'Biasa', period: 'Setiap 4 Bulan', description: 'Jagung pakan ternak varietas hibrida berkadar air rendah setelah pengeringan silinder.', otherVillages: ['Karya Makmur'] },
  { id: 'com10', name: 'Tempe & Tahu', category: 'UMKM', villageName: 'Margokoyo', estProduction: '1.5 ton/bln', areaUnit: '6 unit', status: 'Biasa', period: 'Setiap Hari', description: 'Pembuatan tempe kedelai bungkus daun pisang tradisional secara higienis non bahan kimia pengawet.', otherVillages: ['Argo Mulyo'] },
  { id: 'com11', name: 'Pisang Kepok', category: 'Pertanian', villageName: 'Madu Condo', estProduction: '180 ton/thn', areaUnit: '90 Ha', status: 'Biasa', period: 'Setiap Minggu', description: 'Buah pisang mentah & matang yang sangat cocok sebagai bahan baku keripik, pisang goreng sale.', otherVillages: ['Karya Makmur'] },
  { id: 'com12', name: 'Kelapa', category: 'Perkebunan', villageName: 'Karya Makmur', estProduction: '95 ton/thn', areaUnit: '120 Ha', status: 'Biasa', period: 'Setiap 2 Bulan', description: 'Kelapa dalam tua untuk kebutuhan kopra & santan daerah rujukan pasar Belitang Jaya.', otherVillages: ['Girimulyo'] },
  { id: 'com13', name: 'Ikan Mas', category: 'Perikanan', villageName: 'Banjar Rejo', estProduction: '40 ton/thn', areaUnit: '25 kolam', status: 'Biasa', period: 'Setiap 4 Bulan', description: 'Kolam air tawar budidaya ikan mas konsumsi lezat bergizi tinggi.', otherVillages: ['Argo Mulyo'] },
  { id: 'com14', name: 'Batik Tulis', category: 'Kerajinan', villageName: 'Margokoyo', estProduction: '200 lembar/bln', areaUnit: '5 unit', status: 'Unggulan', period: 'Setiap Hari', description: 'Batik motif khas motif flora perkebunan karet OKU Timur menggunakan canting lilin dingin hand-made.', otherVillages: ['Girimulyo'] },
  { id: 'com15', name: 'Kambing', category: 'Peternakan', villageName: 'Argo Mulyo', estProduction: '150 ekor', areaUnit: '4 kandang', status: 'Biasa', period: 'Bulan Haji', description: 'Peternakan kambing peranakan etawa, berpotensi sebagai produsen susu segar kambing berkhasiat.', otherVillages: ['Margokoyo'] }
];

export const OFFICIALS_DATA: Official[] = [
  { id: 'off1', name: 'Budi Santoso', position: 'Kepala Desa', phone: '0812-3456-7890', address: 'Dusun III RT 02 Argo Mulyo', period: '2021-2027', status: 'Aktif', villageName: 'Argo Mulyo', level: 1, initials: 'BS' },
  { id: 'off2', name: 'Agus Permana', position: 'Sekretaris Desa', phone: '0813-2345-6789', address: 'Dusun I RT 01 Argo Mulyo', period: '2020-2026', status: 'Aktif', villageName: 'Argo Mulyo', level: 2, initials: 'AP' },
  { id: 'off3', name: 'Rudi Hartono', position: 'Kasi Pemerintahan', phone: '0814-3456-7891', address: 'Dusun II RT 03 Argo Mulyo', period: '2020-2026', status: 'Aktif', villageName: 'Argo Mulyo', level: 3, initials: 'RH' },
  { id: 'off4', name: 'Ani Kusumawati', position: 'Kasi Pelayanan', phone: '0815-4567-8902', address: 'Dusun I RT 04 Argo Mulyo', period: '2020-2026', status: 'Aktif', villageName: 'Argo Mulyo', level: 3, initials: 'AK' },
  { id: 'off5', name: 'Dian Pratiwi', position: 'Kaur Keuangan', phone: '0816-5678-9013', address: 'Dusun III RT 01 Argo Mulyo', period: '2021-2027', status: 'Aktif', villageName: 'Argo Mulyo', level: 3, initials: 'DP' },
  { id: 'off6', name: 'Eko Saputra', position: 'Kaur Umum', phone: '0817-6789-0124', address: 'Dusun II RT 02 Argo Mulyo', period: '2021-2027', status: 'Aktif', villageName: 'Argo Mulyo', level: 3, initials: 'ES' },
  { id: 'off7', name: 'Sumarno', position: 'Kepala Dusun 1', phone: '0818-7890-1235', address: 'Dusun I Argo Mulyo', period: '2022-2028', status: 'Aktif', villageName: 'Argo Mulyo', level: 4, initials: 'SM' },
  { id: 'off8', name: 'Wahyudi', position: 'Kepala Dusun 2', phone: '0819-8901-2346', address: 'Dusun II Argo Mulyo', period: '2022-2028', status: 'Nonaktif', villageName: 'Argo Mulyo', level: 4, initials: 'WY' }
];

export const PRODUCTS_DATA: Product[] = [
  { id: 'p1',  name: 'Beras Premium Argo Mulyo',  price: 'Rp 12.000/kg',      sellerName: 'Ibu Sari Dewi',    whatsapp: '0812-1111-2222', villageName: 'Argo Mulyo',  stockStatus: 'Tersedia',  isFeatured: true,  releaseDate: '05 Jan 2025', description: 'Beras hasil gilingan padi varietas murni yang pulen, putih alami tanpa pemutih kimia tambahan.',                                        category: 'Hasil Pertanian' },
  { id: 'p2',  name: 'Kopi Robusta Margokoyo',   price: 'Rp 85.000/250gr',   sellerName: 'Kopdes Margokoyo',  whatsapp: '0817-6666-7777', villageName: 'Margokoyo',  stockStatus: 'Tersedia',  isFeatured: true,  releaseDate: '10 Jan 2025', description: 'Kopi robusta pegunungan lokal diproses alami dengan aroma harum coklat dan cita rasa tradisional mantap.',                          category: 'Minuman' },
  { id: 'p3',  name: 'Keripik Pisang Original', price: 'Rp 15.000/bungkus', sellerName: 'CV Maju Bersama', whatsapp: '0815-4444-5555', villageName: 'Karya Makmur', stockStatus: 'Terbatas', isFeatured: false, releaseDate: '15 Jan 2025', description: 'Keripik pisang tipis renyah dengan taburan garam gurih alami berkualitas tanpa pemanis buatan.',                                      category: 'Makanan Olahan' },
  { id: 'p4',  name: 'Anyaman Bambu Argo Mulyo',  price: 'Rp 45.000/pcs',    sellerName: 'Ibu Sari Dewi',   whatsapp: '0812-1111-2222', villageName: 'Argo Mulyo',  stockStatus: 'Tersedia',  isFeatured: true,  releaseDate: '20 Jan 2025', description: 'Kerajinan wadah anyaman bambu kokoh serbaguna handmade, sangat estetik untuk keperluan rumah tangga.',                              category: 'Kerajinan Tangan' },
  { id: 'p5',  name: 'Tempe Murni Margokoyo',    price: 'Rp 5.000/bungkus',  sellerName: 'Kopdes Margokoyo', whatsapp: '0817-6666-7777', villageName: 'Margokoyo',  stockStatus: 'Tersedia',  isFeatured: false, releaseDate: '22 Jan 2025', description: 'Tempe murni dari kacang kedelai pilihan dibungkus daun pisang segar, bertekstur padat dan gurih.',                                   category: 'Makanan Olahan' },
  { id: 'p6',  name: 'Madu Hutan Madu Condo',      price: 'Rp 120.000/botol',  sellerName: 'Ibu Ningsih',     whatsapp: '0816-5555-6666', villageName: 'Madu Condo',   stockStatus: 'Terbatas', isFeatured: true,  releaseDate: '01 Feb 2025', description: 'Madu murni hasil panen dari lebah liar hutan sekunder Madu Condo, kaya khasiat dan bebas endapan gula.',                               category: 'Minuman' },
  { id: 'p7',  name: 'Ikan Lele Segar',         price: 'Rp 22.000/kg',      sellerName: 'Pak Ahmad Yani',  whatsapp: '0818-7777-8888', villageName: 'Argo Mulyo',  stockStatus: 'Tersedia',  isFeatured: false, releaseDate: '05 Feb 2025', description: 'Ikan lele konsumsi dari kolam bioflok bersih, dipanen langsung sesuai pesanan pelanggan agar tetap segar.',                        category: 'Hasil Perikanan' },
  { id: 'p8',  name: 'Batik Tulis Margokoyo',    price: 'Rp 250.000/lembar', sellerName: 'Kopdes Margokoyo', whatsapp: '0817-6666-7777', villageName: 'Margokoyo',  stockStatus: 'Tersedia',  isFeatured: true,  releaseDate: '10 Feb 2025', description: 'Kain batik tulis dengan pewarna alam bermotif ornamen khas tumbuhan lokal Belitang Jaya.',                                          category: 'Kerajinan Tangan' },
  { id: 'p9',  name: 'Gula Aren Banjar Rejo',     price: 'Rp 18.000/kg',      sellerName: 'Pak Heri Susanto',whatsapp: '0813-2222-3333', villageName: 'Banjar Rejo', stockStatus: 'Tersedia',  isFeatured: false, releaseDate: '12 Feb 2025', description: 'Gula aren cetak padat dari nira pohon aren liar, wangi khas karamel dan sangat manis alami.',                                       category: 'Makanan Olahan' },
  { id: 'p10', name: 'Kerajinan Rotan Girimulyo', price: 'Rp 75.000/pcs',    sellerName: 'Ibu Wati Rahayu', whatsapp: '0814-3333-4444', villageName: 'Girimulyo',   stockStatus: 'Terbatas', isFeatured: false, releaseDate: '18 Feb 2025', description: 'Keranjang jinjing rotan anyam padat, ideal untuk tas belanja ataupun wadah dekorasi florist.',                                      category: 'Kerajinan Tangan' },
  { id: 'p11', name: 'Sambal Tempoyak Khas',    price: 'Rp 25.000/botol',   sellerName: 'Ibu Ratna Sari',  whatsapp: '0819-8888-9999', villageName: 'Banjar Rejo', stockStatus: 'Tersedia',  isFeatured: true,  releaseDate: '20 Feb 2025', description: 'Sambal asam gurih menggunakan durian fermentasi matang khas Sumatera Selatan racikan legendaris.',                                 category: 'Makanan Olahan' },
  { id: 'p12', name: 'Kacang Tanah Goreng',     price: 'Rp 20.000/bungkus', sellerName: 'CV Maju Bersama', whatsapp: '0815-4444-5555', villageName: 'Karya Makmur', stockStatus: 'Tersedia',  isFeatured: false, releaseDate: '25 Feb 2025', description: 'Kacang tanah goreng garing ditumis dengan bawang putih & bumbu khas, gurih tanpa sisa minyak berlebih.',                          category: 'Makanan Olahan' }
];

export const LAND_ASSETS_DATA: Asset[] = [
  { id: 'ast_l0', name: 'Tanah Kas Desa Rejosari', villageName: 'Rejosari', location: 'Dsn. I Rejosari', type: 'Tanah', dimensionOrQuantity: '3.20 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Pertanian Organik', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '210/KD-RJ/II/2020', docDate: '08 Feb 2020', docType: 'Sertifikat', docNote: 'Tanah kas desa dikelola kelompok tani organik Rejosari Makmur.' },
  { id: 'ast_l0b', name: 'Tanah Lapangan Desa Rejosari', villageName: 'Rejosari', location: 'Dsn. II Rejosari', type: 'Tanah', dimensionOrQuantity: '0.90 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Olahraga', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '155/SERT/2019', docDate: '20 Mei 2019', docType: 'Sertifikat' },
  { id: 'ast_l1', name: 'Tanah Kas Desa', villageName: 'Argo Mulyo', location: 'Dsn. Argo Mulyo', type: 'Tanah', dimensionOrQuantity: '2.50 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Pertanian', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '503/KD-SM/IV/2021', docDate: '12 Apr 2021', docType: 'Sertifikat', docNote: 'Tanah kas desa disewakan ke kelompok tani padi.' },
  { id: 'ast_l2', name: 'Tanah Makam Umum', villageName: 'Banjar Rejo', location: 'Dsn. Banjar Rejo', type: 'Tanah', dimensionOrQuantity: '0.80 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Pemakaman', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '411/PEM-MJ/2018', docDate: '07 Nov 2018', docType: 'Sertifikat' },
  { id: 'ast_l3', name: 'Tanah Lapangan Bola', villageName: 'Girimulyo', location: 'Dsn. Girimulyo', type: 'Tanah', dimensionOrQuantity: '1.20 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Olahraga', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '298/SERT/2020', docDate: '15 Mar 2020', docType: 'Sertifikat' },
  { id: 'ast_l4', name: 'Tanah Kebun Desa', villageName: 'Karya Makmur', location: 'Dsn. Karya Makmur', type: 'Tanah', dimensionOrQuantity: '3.00 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Tidak Digunakan', condition: 'Rusak Ringan', status: 'Tidak Aktif', hasDoc: false, docNote: 'Sedang diajukan ke BPN untuk pengurusan sertifikat.' },
  { id: 'ast_l5', name: 'Tanah Pasar Desa', villageName: 'Margokoyo', location: 'Dsn. Margokoyo', type: 'Tanah', dimensionOrQuantity: '0.50 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Perdagangan', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '110/DES-PD/V/2022', docDate: '23 Mei 2022', docType: 'Sertifikat' },
  { id: 'ast_l6', name: 'Tanah Situ/Waduk Kecil', villageName: 'Argo Mulyo', location: 'Dsn. Argo Mulyo', type: 'Tanah', dimensionOrQuantity: '1.10 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Perikanan', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '504/KD-SM/IV/2021', docDate: '15 Apr 2021', docType: 'Sertifikat' },
  { id: 'ast_l7', name: 'Tanah Kas Desa 2', villageName: 'Madu Condo', location: 'Dsn. Madu Condo', type: 'Tanah', dimensionOrQuantity: '1.80 Ha', ownershipOrYear: 'Milik Desa', currentUseOrType: 'Pertanian', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '89/KD-CK/X/2019', docDate: '01 Okt 2019', docType: 'Sertifikat' },
  { id: 'ast_l8', name: 'Tanah Pemda Dipinjamkan', villageName: 'Banjar Rejo', location: 'Dsn. Banjar Rejo', type: 'Tanah', dimensionOrQuantity: '0.60 Ha', ownershipOrYear: 'Dipinjamkan', currentUseOrType: 'Pendidikan', condition: 'Baik', status: 'Aktif', hasDoc: true, docNumber: '042/PEMDA-OKUT/2020', docDate: '10 Feb 2020', docType: 'Berita Acara' }
];

export const BUILDING_ASSETS_DATA: Asset[] = [
  { id: 'ast_b0', name: 'Kantor Desa Rejosari', villageName: 'Rejosari', location: 'Jl. Rejosari Utama No.1', type: 'Bangunan', dimensionOrQuantity: '180 m²', ownershipOrYear: '2009', currentUseOrType: 'Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b0b', name: 'Balai Desa Rejosari', villageName: 'Rejosari', location: 'Kompleks Kantor Rejosari', type: 'Bangunan', dimensionOrQuantity: '220 m²', ownershipOrYear: '2011', currentUseOrType: 'Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b1', name: 'Kantor Desa Argo Mulyo', villageName: 'Argo Mulyo', location: 'Jl. Raya Argo Mulyo No.1', type: 'Bangunan', dimensionOrQuantity: '200 m²', ownershipOrYear: '2010', currentUseOrType: 'Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b2', name: 'Balai Desa Banjar Rejo', villageName: 'Banjar Rejo', location: 'Kompleks Kantor Banjar Rejo', type: 'Bangunan', dimensionOrQuantity: '350 m²', ownershipOrYear: '2008', currentUseOrType: 'Permanen', condition: 'Rusak Ringan', status: 'Aktif', hasDoc: true },
  { id: 'ast_b3', name: 'Posyandu Girimulyo', villageName: 'Girimulyo', location: 'Dusun II Girimulyo', type: 'Bangunan', dimensionOrQuantity: '80 m²', ownershipOrYear: '2015', currentUseOrType: 'Semi Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b4', name: 'Gedung Serbaguna Karya Makmur', villageName: 'Karya Makmur', location: 'Dusun Kelapa Karya Makmur', type: 'Bangunan', dimensionOrQuantity: '500 m²', ownershipOrYear: '2012', currentUseOrType: 'Permanen', condition: 'Rusak Ringan', status: 'Aktif', hasDoc: true },
  { id: 'ast_b5', name: 'Pasar Desa Margokoyo', villageName: 'Margokoyo', location: 'Dsn. Margokoyo', type: 'Bangunan', dimensionOrQuantity: '600 m²', ownershipOrYear: '2018', currentUseOrType: 'Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b6', name: 'Kantor Desa Madu Condo', villageName: 'Madu Condo', location: 'Dusun I Madu Condo', type: 'Bangunan', dimensionOrQuantity: '150 m²', ownershipOrYear: '2005', currentUseOrType: 'Permanen', condition: 'Rusak Berat', status: 'Perlu Perbaikan', hasDoc: false },
  { id: 'ast_b7', name: 'Balai Desa Argo Mulyo', villageName: 'Argo Mulyo', location: 'Kompleks Kantor Argo Mulyo', type: 'Bangunan', dimensionOrQuantity: '300 m²', ownershipOrYear: '2014', currentUseOrType: 'Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b8', name: 'Posyandu Banjar Rejo', villageName: 'Banjar Rejo', location: 'Dusun III Banjar Rejo', type: 'Bangunan', dimensionOrQuantity: '75 m²', ownershipOrYear: '2016', currentUseOrType: 'Semi Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b9', name: 'Gudang Desa Margokoyo', villageName: 'Margokoyo', location: 'Belakang Kantor Desa', type: 'Bangunan', dimensionOrQuantity: '100 m²', ownershipOrYear: '2019', currentUseOrType: 'Semi Permanen', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_b10', name: 'Polindes Girimulyo', villageName: 'Girimulyo', location: 'Dusun III Girimulyo', type: 'Bangunan', dimensionOrQuantity: '90 m²', ownershipOrYear: '2017', currentUseOrType: 'Semi Permanen', condition: 'Rusak Ringan', status: 'Aktif', hasDoc: true }
];

export const INVENTORY_ASSETS_DATA: Asset[] = [
  { id: 'ast_i0', name: 'Traktor Tangan', villageName: 'Rejosari', location: 'Gudang Pertanian', type: 'Inventaris', dimensionOrQuantity: '2 Unit', ownershipOrYear: '2022', currentUseOrType: 'Alat Pertanian', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i0b', name: 'Laptop Operator Desa', villageName: 'Rejosari', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '2 Unit', ownershipOrYear: '2023', currentUseOrType: 'IT Hardware', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i1', name: 'Laptop', villageName: 'Argo Mulyo', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '3 Unit', ownershipOrYear: '2023', currentUseOrType: 'IT Hardware', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i2', name: 'Motor Dinas', villageName: 'Argo Mulyo', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '2 Unit', ownershipOrYear: '2021', currentUseOrType: 'Kendaraan', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i3', name: 'Proyektor', villageName: 'Banjar Rejo', location: 'Balai Desa', type: 'Inventaris', dimensionOrQuantity: '1 Unit', ownershipOrYear: '2019', currentUseOrType: 'Presentasi', condition: 'Rusak Ringan', status: 'Diperbaiki', hasDoc: true },
  { id: 'ast_i4', name: 'Printer', villageName: 'Girimulyo', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '2 Unit', ownershipOrYear: '2022', currentUseOrType: 'IT Hardware', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i5', name: 'Meja Kantor', villageName: 'Karya Makmur', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '10 Unit', ownershipOrYear: '2018', currentUseOrType: 'Furnitur', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i6', name: 'Kursi Rapat', villageName: 'Margokoyo', location: 'Gedung Serbaguna', type: 'Inventaris', dimensionOrQuantity: '40 Unit', ownershipOrYear: '2020', currentUseOrType: 'Furnitur', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i7', name: 'Genset', villageName: 'Madu Condo', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '1 Unit', ownershipOrYear: '2015', currentUseOrType: 'Elektrikal', condition: 'Rusak Berat', status: 'Tidak Aktif', hasDoc: false },
  { id: 'ast_i8', name: 'Mesin Ketik', villageName: 'Argo Mulyo', location: 'Gudang', type: 'Inventaris', dimensionOrQuantity: '1 Unit', ownershipOrYear: '1995', currentUseOrType: 'Kearsipan', condition: 'Rusak Berat', status: 'Tidak Aktif', hasDoc: true },
  { id: 'ast_i9', name: 'Kamera Digital', villageName: 'Banjar Rejo', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '1 Unit', ownershipOrYear: '2020', currentUseOrType: 'Dokumentasi', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i10', name: 'Sound System', villageName: 'Margokoyo', location: 'Balai Desa', type: 'Inventaris', dimensionOrQuantity: '1 Set', ownershipOrYear: '2021', currentUseOrType: 'Audio', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i11', name: 'Komputer PC', villageName: 'Girimulyo', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '2 Unit', ownershipOrYear: '2022', currentUseOrType: 'IT Hardware', condition: 'Baik', status: 'Aktif', hasDoc: true },
  { id: 'ast_i12', name: 'Meja Kursi Tamu', villageName: 'Madu Condo', location: 'Kantor Desa', type: 'Inventaris', dimensionOrQuantity: '1 Set', ownershipOrYear: '2017', currentUseOrType: 'Furnitur', condition: 'Rusak Ringan', status: 'Aktif', hasDoc: true }
];

export const USER_ACCOUNTS: UserAccount[] = [
  { id: 'usr1', name: 'Admin Kecamatan', email: 'admin@kecamatan.go.id', role: 'Admin', villageName: 'Semua Desa', status: 'Aktif', lastActive: '15 Jun 2025', initials: 'AK' },
  { id: 'usr2', name: 'Budi Santoso', email: 'operator@sukamaju.go.id', role: 'Operator', villageName: 'Argo Mulyo', status: 'Aktif', lastActive: '14 Jun 2025', initials: 'BS' },
  { id: 'usr3', name: 'Siti Rahayu', email: 'operator@mekarjaya.go.id', role: 'Operator', villageName: 'Banjar Rejo', status: 'Aktif', lastActive: '13 Jun 2025', initials: 'SR' },
  { id: 'usr4', name: 'Ahmad Fauzi', email: 'operator@ciputat.go.id', role: 'Operator', villageName: 'Girimulyo', status: 'Nonaktif', lastActive: '01 Apr 2025', initials: 'AF' },
  { id: 'usr5', name: 'Dewi Kusuma', email: 'operator@margaasih.go.id', role: 'Operator', villageName: 'Karya Makmur', status: 'Aktif', lastActive: '12 Jun 2025', initials: 'DK' },
  { id: 'usr6', name: 'Hendra Wijaya', email: 'operator@cikaret.go.id', role: 'Operator', villageName: 'Madu Condo', status: 'Aktif', lastActive: '10 Jun 2025', initials: 'HW' }
];

export const USER_LOGS: UserLog[] = [
  { id: 'l1', time: '15 Jun 2025 14:32', user: 'Admin Kecamatan', role: 'Admin', action: 'Login', module: 'Sistem', detail: 'Login berhasil', ipAddress: '192.168.1.1' },
  { id: 'l2', time: '15 Jun 2025 14:35', user: 'Admin Kecamatan', role: 'Admin', action: 'Lihat Data', module: 'Data Desa', detail: 'Lihat daftar desa', ipAddress: '192.168.1.1' },
  { id: 'l3', time: '15 Jun 2025 10:15', user: 'Budi Santoso', role: 'Operator', action: 'Login', module: 'Sistem', detail: 'Login berhasil', ipAddress: '192.168.1.5' },
  { id: 'l4', time: '15 Jun 2025 10:18', user: 'Budi Santoso', role: 'Operator', action: 'Tambah Data', module: 'Berita', detail: 'Tambah berita baru', ipAddress: '192.168.1.5' },
  { id: 'l5', time: '14 Jun 2025 16:45', user: 'Siti Rahayu', role: 'Operator', action: 'Edit Data', module: 'Profil Desa', detail: 'Update profil Banjar Rejo', ipAddress: '192.168.1.6' },
  { id: 'l6', time: '14 Jun 2025 15:30', user: 'Dewi Kusuma', role: 'Operator', action: 'Tambah Data', module: 'Komoditas', detail: 'Tambah komoditas baru', ipAddress: '192.168.1.8' },
  { id: 'l7', time: '14 Jun 2025 14:20', user: 'Admin Kecamatan', role: 'Admin', action: 'Edit Data', module: 'Pengguna', detail: 'Reset password operator', ipAddress: '192.168.1.1' },
  { id: 'l8', time: '13 Jun 2025 11:00', user: 'Hendra Wijaya', role: 'Operator', action: 'Login', module: 'Sistem', detail: 'Login berhasil', ipAddress: '192.168.1.9' },
  { id: 'l9', time: '13 Jun 2025 11:05', user: 'Hendra Wijaya', role: 'Operator', action: 'Tambah Data', module: 'Aset Desa', detail: 'Tambah aset tanah', ipAddress: '192.168.1.9' },
  { id: 'l10', time: '13 Jun 2025 09:30', user: 'Budi Santoso', role: 'Operator', action: 'Hapus Data', module: 'Lapak Desa', detail: 'Hapus produk nonaktif', ipAddress: '192.168.1.5' },
  { id: 'l11', time: '12 Jun 2025 13:15', user: 'Admin Kecamatan', role: 'Admin', action: 'Tambah Data', module: 'Pengguna', detail: 'Tambah akun operator', ipAddress: '192.168.1.1' },
  { id: 'l12', time: '12 Jun 2025 10:45', user: 'Siti Rahayu', role: 'Operator', action: 'Tambah Data', module: 'Lapak Desa', detail: 'Tambah produk baru', ipAddress: '192.168.1.6' },
  { id: 'l13', time: '11 Jun 2025 16:00', user: 'Dewi Kusuma', role: 'Operator', action: 'Edit Data', module: 'Perangkat Desa', detail: 'Update status perangkat', ipAddress: '192.168.1.8' },
  { id: 'l14', time: '11 Jun 2025 14:30', user: 'Admin Kecamatan', role: 'Admin', action: 'Lihat Data', module: 'Log Aktivitas', detail: 'Pantau log sistem', ipAddress: '192.168.1.1' },
  { id: 'l15', time: '10 Jun 2025 09:00', user: 'Hendra Wijaya', role: 'Operator', action: 'Login Gagal', module: 'Sistem', detail: 'Password salah', ipAddress: '192.168.1.9' }
];

export const STATIC_DISTRI_USIA = {
  labels: ['0-4 thn', '5-14 thn', '15-24 thn', '25-44 thn', '45-64 thn', '65+ thn'],
  data: [820, 1280, 1650, 2900, 2650, 1500]
};

export const STATIC_AGAMA = [
  { name: 'Islam', count: 10200, percent: '94.4%' },
  { name: 'Kristen', count: 400, percent: '3.7%' },
  { name: 'Hindu', count: 150, percent: '1.4%' },
  { name: 'Lainnya', count: 50, percent: '0.5%' }
];

export const STATIC_LAND_USAGE = [
  { name: 'Sawah', value: 480, percent: '38.4%', color: '#10b981' },
  { name: 'Kebun/Perkebunan', value: 320, percent: '25.6%', color: '#f59e0b' },
  { name: 'Pemukiman', value: 210, percent: '16.8%', color: '#3b82f6' },
  { name: 'Hutan', value: 180, percent: '14.4%', color: '#047857' },
  { name: 'Lainnya (jalan, sungai dll)', value: 60, percent: '4.8%', color: '#6b7280' }
];

// Per-desa monografi data for admin view
export const MONOGRAFI_PER_DESA: Record<string, {
  penduduk: { total: number; laki: number; perempuan: number; kk: number };
  agama: { name: string; count: number; percent: string }[];
  pekerjaan: { name: string; value: number; color: string }[];
  pendidikan: { name: string; count: number; percent: string }[];
  landUsage: { name: string; value: number; percent: string; color: string }[];
  distriUsia: { labels: string[]; data: number[] };
  fasilitas: { nama: string; jumlah: number; ket: string }[];
  sosekRingkas: { label: string; value: string }[];
}> = {
  Rejosari: {
    penduduk: { total: 4820, laki: 2430, perempuan: 2390, kk: 1210 },
    agama: [
      { name: 'Islam', count: 4650, percent: '96.5%' },
      { name: 'Kristen', count: 120, percent: '2.5%' },
      { name: 'Hindu', count: 50, percent: '1.0%' }
    ],
    pekerjaan: [
      { name: 'Petani', value: 1850, color: '#10b981' },
      { name: 'Pedagang', value: 620, color: '#f59e0b' },
      { name: 'PNS/TNI/Polri', value: 210, color: '#3b82f6' },
      { name: 'IRT', value: 890, color: '#ec4899' },
      { name: 'Pelajar', value: 750, color: '#8b5cf6' }
    ],
    pendidikan: [
      { name: 'Tidak/Belum Sekolah', count: 320, percent: '6.6%' },
      { name: 'SD/Sederajat', count: 1240, percent: '25.7%' },
      { name: 'SMP/Sederajat', count: 1180, percent: '24.5%' },
      { name: 'SMA/Sederajat', count: 1560, percent: '32.4%' },
      { name: 'Diploma/Sarjana+', count: 520, percent: '10.8%' }
    ],
    landUsage: [
      { name: 'Sawah', value: 620, percent: '47.0%', color: '#10b981' },
      { name: 'Kebun', value: 280, percent: '21.2%', color: '#f59e0b' },
      { name: 'Pemukiman', value: 210, percent: '15.9%', color: '#3b82f6' },
      { name: 'Hutan', value: 160, percent: '12.1%', color: '#047857' },
      { name: 'Lainnya', value: 50, percent: '3.8%', color: '#6b7280' }
    ],
    distriUsia: { labels: ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'], data: [340, 620, 890, 1450, 1020, 500] },
    fasilitas: [
      { nama: 'Sekolah Dasar', jumlah: 2, ket: 'SD Negeri 1 & 2 Rejosari' },
      { nama: 'SMP', jumlah: 1, ket: 'SMP Negeri 1 Belitang Jaya' },
      { nama: 'Posyandu', jumlah: 3, ket: 'Aktif di 3 dusun' },
      { nama: 'Masjid/Musholla', jumlah: 8, ket: 'Tersebar di seluruh RT' },
      { nama: 'Balai Desa', jumlah: 1, ket: 'Aktif digunakan' }
    ],
    sosekRingkas: [
      { label: 'Mata Pencaharian Utama', value: 'Pertanian Padi & Sayuran' },
      { label: 'BUMDes', value: 'BUMDes Rejosari Makmur (Aktif)' },
      { label: 'Rata-rata Penghasilan', value: 'Rp 2.1 Juta/bulan' },
      { label: 'Penerima PKH', value: '124 KK' }
    ]
  },
  'Argo Mulyo': {
    penduduk: { total: 10800, laki: 5420, perempuan: 5380, kk: 2710 },
    agama: [
      { name: 'Islam', count: 10200, percent: '94.4%' },
      { name: 'Kristen', count: 400, percent: '3.7%' },
      { name: 'Hindu', count: 150, percent: '1.4%' },
      { name: 'Lainnya', count: 50, percent: '0.5%' }
    ],
    pekerjaan: [
      { name: 'Pekerja Swasta & Tani', value: 4200, color: '#0284c7' },
      { name: 'PNS & Aparat Negara', value: 980, color: '#f59e0b' },
      { name: 'Ibu Rumah Tangga', value: 2100, color: '#ec4899' },
      { name: 'Pelajar & Mahasiswa', value: 2100, color: '#10b981' },
      { name: 'Wirausaha', value: 1420, color: '#8b5cf6' }
    ],
    pendidikan: [
      { name: 'Tidak/Belum Sekolah', count: 620, percent: '5.7%' },
      { name: 'SD/Sederajat', count: 2800, percent: '25.9%' },
      { name: 'SMP/Sederajat', count: 2600, percent: '24.1%' },
      { name: 'SMA/Sederajat', count: 3400, percent: '31.5%' },
      { name: 'Diploma/Sarjana+', count: 1380, percent: '12.8%' }
    ],
    landUsage: [
      { name: 'Sawah', value: 480, percent: '38.4%', color: '#10b981' },
      { name: 'Kebun/Perkebunan', value: 320, percent: '25.6%', color: '#f59e0b' },
      { name: 'Pemukiman', value: 210, percent: '16.8%', color: '#3b82f6' },
      { name: 'Hutan', value: 180, percent: '14.4%', color: '#047857' },
      { name: 'Lainnya', value: 60, percent: '4.8%', color: '#6b7280' }
    ],
    distriUsia: { labels: ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'], data: [820, 1280, 1650, 2900, 2650, 1500] },
    fasilitas: [
      { nama: 'Sekolah Dasar', jumlah: 3, ket: 'SD Negeri 1, 2, 3 Argo Mulyo' },
      { nama: 'SMP', jumlah: 1, ket: 'SMP Negeri Argo Mulyo' },
      { nama: 'Puskesmas Pembantu', jumlah: 1, ket: 'Aktif 6 hari/minggu' },
      { nama: 'Posyandu', jumlah: 5, ket: 'Aktif di 5 dusun' },
      { nama: 'Pasar Desa', jumlah: 1, ket: 'Buka setiap Selasa & Sabtu' }
    ],
    sosekRingkas: [
      { label: 'Mata Pencaharian Utama', value: 'Pertanian Padi & Perdagangan' },
      { label: 'BUMDes', value: 'BUMDes Argo Mulyo Jaya (Aktif)' },
      { label: 'Rata-rata Penghasilan', value: 'Rp 2.8 Juta/bulan' },
      { label: 'Penerima PKH', value: '287 KK' }
    ]
  },
  'Banjar Rejo': {
    penduduk: { total: 6420, laki: 3180, perempuan: 3240, kk: 1605 },
    agama: [
      { name: 'Islam', count: 6200, percent: '96.6%' },
      { name: 'Kristen', count: 180, percent: '2.8%' },
      { name: 'Lainnya', count: 40, percent: '0.6%' }
    ],
    pekerjaan: [
      { name: 'Petani Karet', value: 2800, color: '#10b981' },
      { name: 'Buruh', value: 980, color: '#f59e0b' },
      { name: 'PNS', value: 320, color: '#3b82f6' },
      { name: 'IRT', value: 1420, color: '#ec4899' },
      { name: 'Pelajar', value: 900, color: '#8b5cf6' }
    ],
    pendidikan: [
      { name: 'Tidak/Belum Sekolah', count: 410, percent: '6.4%' },
      { name: 'SD/Sederajat', count: 1820, percent: '28.4%' },
      { name: 'SMP/Sederajat', count: 1650, percent: '25.7%' },
      { name: 'SMA/Sederajat', count: 1900, percent: '29.6%' },
      { name: 'Diploma/Sarjana+', count: 640, percent: '9.9%' }
    ],
    landUsage: [
      { name: 'Perkebunan Karet', value: 580, percent: '52.7%', color: '#10b981' },
      { name: 'Sawah', value: 180, percent: '16.4%', color: '#84cc16' },
      { name: 'Pemukiman', value: 180, percent: '16.4%', color: '#3b82f6' },
      { name: 'Hutan/Semak', value: 120, percent: '10.9%', color: '#047857' },
      { name: 'Lainnya', value: 40, percent: '3.6%', color: '#6b7280' }
    ],
    distriUsia: { labels: ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'], data: [480, 920, 1080, 2100, 1350, 490] },
    fasilitas: [
      { nama: 'Sekolah Dasar', jumlah: 2, ket: 'SD Negeri 1 & 2 Banjar Rejo' },
      { nama: 'Posyandu', jumlah: 4, ket: 'Raih penghargaan nasional 2024' },
      { nama: 'Balai Pertemuan', jumlah: 2, ket: 'Di dusun 1 dan 3' },
      { nama: 'Masjid/Musholla', jumlah: 6, ket: 'Aktif kegiatan keagamaan' }
    ],
    sosekRingkas: [
      { label: 'Mata Pencaharian Utama', value: 'Perkebunan Karet Rakyat' },
      { label: 'BUMDes', value: 'BUMDes Banjar Rejo Makmur (Aktif)' },
      { label: 'Rata-rata Penghasilan', value: 'Rp 2.3 Juta/bulan' },
      { label: 'Penerima PKH', value: '198 KK' }
    ]
  },
  Girimulyo: {
    penduduk: { total: 5120, laki: 2540, perempuan: 2580, kk: 1280 },
    agama: [
      { name: 'Islam', count: 4900, percent: '95.7%' },
      { name: 'Kristen', count: 150, percent: '2.9%' },
      { name: 'Lainnya', count: 70, percent: '1.4%' }
    ],
    pekerjaan: [
      { name: 'Peternak Unggas', value: 1600, color: '#f59e0b' },
      { name: 'Petani', value: 1200, color: '#10b981' },
      { name: 'Pedagang', value: 650, color: '#3b82f6' },
      { name: 'IRT', value: 980, color: '#ec4899' },
      { name: 'Pelajar', value: 690, color: '#8b5cf6' }
    ],
    pendidikan: [
      { name: 'Tidak/Belum Sekolah', count: 380, percent: '7.4%' },
      { name: 'SD/Sederajat', count: 1420, percent: '27.7%' },
      { name: 'SMP/Sederajat', count: 1380, percent: '27.0%' },
      { name: 'SMA/Sederajat', count: 1480, percent: '28.9%' },
      { name: 'Diploma/Sarjana+', count: 460, percent: '9.0%' }
    ],
    landUsage: [
      { name: 'Sawah/Rawa', value: 360, percent: '36.7%', color: '#10b981' },
      { name: 'Kandang/Peternakan', value: 220, percent: '22.4%', color: '#f59e0b' },
      { name: 'Pemukiman', value: 210, percent: '21.4%', color: '#3b82f6' },
      { name: 'Kebun', value: 140, percent: '14.3%', color: '#84cc16' },
      { name: 'Lainnya', value: 50, percent: '5.2%', color: '#6b7280' }
    ],
    distriUsia: { labels: ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'], data: [380, 740, 920, 1680, 1020, 380] },
    fasilitas: [
      { nama: 'Sekolah Dasar', jumlah: 2, ket: 'SD Negeri 1 & 2 Girimulyo' },
      { nama: 'Posyandu', jumlah: 3, ket: 'Di 3 dusun' },
      { nama: 'Masjid', jumlah: 5, ket: 'Aktif shalat Jumat' },
      { nama: 'Drainase', jumlah: 4, ket: '4 saluran utama' }
    ],
    sosekRingkas: [
      { label: 'Mata Pencaharian Utama', value: 'Peternakan Ayam & Pertanian' },
      { label: 'BUMDes', value: 'BUMDes Girimulyo Sejahtera (Rintisan)' },
      { label: 'Rata-rata Penghasilan', value: 'Rp 1.9 Juta/bulan' },
      { label: 'Penerima PKH', value: '215 KK' }
    ]
  },
  'Karya Makmur': {
    penduduk: { total: 7840, laki: 3920, perempuan: 3920, kk: 1960 },
    agama: [
      { name: 'Islam', count: 7600, percent: '96.9%' },
      { name: 'Kristen', count: 180, percent: '2.3%' },
      { name: 'Lainnya', count: 60, percent: '0.8%' }
    ],
    pekerjaan: [
      { name: 'Pedagang/UMKM', value: 3200, color: '#f59e0b' },
      { name: 'Petani', value: 1800, color: '#10b981' },
      { name: 'Pegawai', value: 680, color: '#3b82f6' },
      { name: 'IRT', value: 1560, color: '#ec4899' },
      { name: 'Pelajar', value: 600, color: '#8b5cf6' }
    ],
    pendidikan: [
      { name: 'Tidak/Belum Sekolah', count: 450, percent: '5.7%' },
      { name: 'SD/Sederajat', count: 2100, percent: '26.8%' },
      { name: 'SMP/Sederajat', count: 1980, percent: '25.3%' },
      { name: 'SMA/Sederajat', count: 2480, percent: '31.6%' },
      { name: 'Diploma/Sarjana+', count: 830, percent: '10.6%' }
    ],
    landUsage: [
      { name: 'Hortikultura/Palawija', value: 540, percent: '40.0%', color: '#84cc16' },
      { name: 'Sawah', value: 270, percent: '20.0%', color: '#10b981' },
      { name: 'Pemukiman', value: 280, percent: '20.7%', color: '#3b82f6' },
      { name: 'Kebun', value: 210, percent: '15.6%', color: '#f59e0b' },
      { name: 'Lainnya', value: 50, percent: '3.7%', color: '#6b7280' }
    ],
    distriUsia: { labels: ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'], data: [580, 1100, 1400, 2640, 1600, 520] },
    fasilitas: [
      { nama: 'Sekolah Dasar', jumlah: 3, ket: 'SD 1, 2, 3 Karya Makmur' },
      { nama: 'Pasar Desa', jumlah: 1, ket: 'Buka setiap hari, pusat UMKM' },
      { nama: 'Posyandu', jumlah: 4, ket: 'Aktif di 4 RW' },
      { nama: 'Lapangan Olahraga', jumlah: 2, ket: 'Sepak bola & voli' }
    ],
    sosekRingkas: [
      { label: 'Mata Pencaharian Utama', value: 'Perdagangan & UMKM Kuliner' },
      { label: 'BUMDes', value: 'BUMDes Karya Makmur Kreatif (Aktif)' },
      { label: 'Rata-rata Penghasilan', value: 'Rp 3.1 Juta/bulan' },
      { label: 'Penerima PKH', value: '162 KK' }
    ]
  },
  'Madu Condo': {
    penduduk: { total: 3680, laki: 1840, perempuan: 1840, kk: 920 },
    agama: [
      { name: 'Islam', count: 3560, percent: '96.7%' },
      { name: 'Kristen', count: 80, percent: '2.2%' },
      { name: 'Lainnya', count: 40, percent: '1.1%' }
    ],
    pekerjaan: [
      { name: 'Petani/Pencari Madu', value: 1420, color: '#10b981' },
      { name: 'Pekebun Buah', value: 820, color: '#f59e0b' },
      { name: 'Buruh', value: 480, color: '#6b7280' },
      { name: 'IRT', value: 680, color: '#ec4899' },
      { name: 'Pelajar', value: 280, color: '#8b5cf6' }
    ],
    pendidikan: [
      { name: 'Tidak/Belum Sekolah', count: 280, percent: '7.6%' },
      { name: 'SD/Sederajat', count: 1040, percent: '28.3%' },
      { name: 'SMP/Sederajat', count: 980, percent: '26.6%' },
      { name: 'SMA/Sederajat', count: 1020, percent: '27.7%' },
      { name: 'Diploma/Sarjana+', count: 360, percent: '9.8%' }
    ],
    landUsage: [
      { name: 'Kebun Buah/Madu', value: 480, percent: '45.7%', color: '#f59e0b' },
      { name: 'Hutan Produktif', value: 280, percent: '26.7%', color: '#047857' },
      { name: 'Pemukiman', value: 180, percent: '17.1%', color: '#3b82f6' },
      { name: 'Sawah', value: 60, percent: '5.7%', color: '#10b981' },
      { name: 'Lainnya', value: 50, percent: '4.8%', color: '#6b7280' }
    ],
    distriUsia: { labels: ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'], data: [260, 520, 680, 1200, 780, 240] },
    fasilitas: [
      { nama: 'Sekolah Dasar', jumlah: 1, ket: 'SD Negeri Madu Condo' },
      { nama: 'Posyandu', jumlah: 2, ket: 'Di dusun 1 dan 2' },
      { nama: 'Balai Desa', jumlah: 1, ket: 'Perlu renovasi' },
      { nama: 'Sumur Bor', jumlah: 3, ket: 'Air bersih komunal' }
    ],
    sosekRingkas: [
      { label: 'Mata Pencaharian Utama', value: 'Kebun Buah & Madu Hutan' },
      { label: 'BUMDes', value: 'BUMDes Madu Condo Lestari (Rintisan)' },
      { label: 'Rata-rata Penghasilan', value: 'Rp 1.6 Juta/bulan' },
      { label: 'Penerima PKH', value: '143 KK' }
    ]
  },
  Margokoyo: {
    penduduk: { total: 8650, laki: 4280, perempuan: 4370, kk: 2160 },
    agama: [
      { name: 'Islam', count: 8380, percent: '96.9%' },
      { name: 'Kristen', count: 210, percent: '2.4%' },
      { name: 'Lainnya', count: 60, percent: '0.7%' }
    ],
    pekerjaan: [
      { name: 'Petani Kopi', value: 3200, color: '#92400e' },
      { name: 'Pengrajin Batik', value: 1400, color: '#8b5cf6' },
      { name: 'Pedagang', value: 1200, color: '#f59e0b' },
      { name: 'IRT', value: 1650, color: '#ec4899' },
      { name: 'Pelajar', value: 1200, color: '#10b981' }
    ],
    pendidikan: [
      { name: 'Tidak/Belum Sekolah', count: 490, percent: '5.7%' },
      { name: 'SD/Sederajat', count: 2340, percent: '27.1%' },
      { name: 'SMP/Sederajat', count: 2100, percent: '24.3%' },
      { name: 'SMA/Sederajat', count: 2680, percent: '31.0%' },
      { name: 'Diploma/Sarjana+', count: 1040, percent: '12.0%' }
    ],
    landUsage: [
      { name: 'Perkebunan Kopi', value: 560, percent: '48.7%', color: '#92400e' },
      { name: 'Sawah', value: 210, percent: '18.3%', color: '#10b981' },
      { name: 'Pemukiman', value: 220, percent: '19.1%', color: '#3b82f6' },
      { name: 'Kebun Campuran', value: 120, percent: '10.4%', color: '#f59e0b' },
      { name: 'Lainnya', value: 40, percent: '3.5%', color: '#6b7280' }
    ],
    distriUsia: { labels: ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'], data: [620, 1180, 1540, 2840, 1820, 650] },
    fasilitas: [
      { nama: 'Sekolah Dasar', jumlah: 3, ket: 'SD 1, 2, 3 Margokoyo' },
      { nama: 'SMP', jumlah: 1, ket: 'SMP Negeri Margokoyo' },
      { nama: 'Pabrik Kopi Mini', jumlah: 2, ket: 'Pengolahan pasca-panen' },
      { nama: 'Posyandu', jumlah: 5, ket: 'Tersebar di 5 dusun' },
      { nama: 'Sanggar Batik', jumlah: 2, ket: 'Produksi aktif batik khas Belitang' }
    ],
    sosekRingkas: [
      { label: 'Mata Pencaharian Utama', value: 'Kopi Robusta & Batik Tulis' },
      { label: 'BUMDes', value: 'BUMDes Margokoyo Maju (Aktif)' },
      { label: 'Rata-rata Penghasilan', value: 'Rp 3.4 Juta/bulan' },
      { label: 'Penerima PKH', value: '174 KK' }
    ]
  }
};

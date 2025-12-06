export interface BmcItem {
  tag: string;
  content: string[];
}

export interface BmcCoordinates {
  lat: number;
  lon: number;
}

export interface Bmc {
  id: string; // UUID
  authorId: string; // UUID
  isPublic: boolean;
  coordinates: BmcCoordinates; // lokasi bisnis di Indonesia
  items: BmcItem[];
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export const dummyBmcs: Bmc[] = [
  // 1. Coffee Shop Lokal – Jakarta
  {
    id: '11111111-1111-1111-1111-111111111111',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -6.2, lon: 106.816666 }, // Jakarta
    createdAt: '2025-12-04T06:15:00.000Z',
    updatedAt: '2025-12-04T06:15:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Mahasiswa dan pekerja remote',
          'Warga sekitar yang suka nongkrong',
          'Komunitas kreatif dan hobi',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Kopi specialty dengan harga terjangkau',
          'Ruang kerja nyaman dengan WiFi cepat',
          'Tempat komunitas untuk event kecil',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Walk-in store',
          'Instagram dan TikTok',
          'Google Maps dan GoFood/GrabFood',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Program loyalty card',
          'Interaksi personal dengan barista',
          'Feedback rutin lewat media sosial',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Penjualan minuman dan makanan',
          'Penjualan biji kopi kemasan',
          'Sewa tempat untuk event komunitas',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Mesin espresso dan peralatan brewing',
          'Barista terlatih',
          'Brand dan desain interior yang unik',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Menyeduh dan menyajikan kopi',
          'Mengelola media sosial',
          'Mengadakan event komunitas',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Roastery lokal',
          'Platform ojek online',
          'Komunitas kreatif lokal',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Sewa tempat',
          'Gaji karyawan',
          'Bahan baku kopi dan makanan',
        ],
      },
    ],
  },

  // 2. Aplikasi Kursus Online SMA – Bandung
  {
    id: '22222222-2222-2222-2222-222222222222',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -6.914744, lon: 107.60981 }, // Bandung
    createdAt: '2025-12-04T07:30:00.000Z',
    updatedAt: '2025-12-04T07:30:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Siswa SMA kelas 10–12',
          'Orang tua yang ingin tambahan belajar untuk anak',
          'Calon mahasiswa yang mempersiapkan UTBK',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Video pembelajaran singkat dan mudah dipahami',
          'Latihan soal adaptif dengan pembahasan',
          'Mentoring online lewat chat dan live session',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Aplikasi mobile (Android, iOS)',
          'Media sosial (Instagram, TikTok, YouTube)',
          'Kemitraan dengan sekolah',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Grup komunitas belajar',
          'Customer support via chat',
          'Notifikasi progress belajar dan rekomendasi materi',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Langganan bulanan/paket',
          'Penjualan paket intensif UTBK',
          'Kerjasama B2B dengan sekolah',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Platform aplikasi dan server',
          'Tim pengajar berpengalaman',
          'Konten video dan bank soal',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Pengembangan fitur aplikasi',
          'Produksi dan update konten belajar',
          'Marketing digital dan onboarding user',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Sekolah-sekolah SMA',
          'Influencer pendidikan',
          'Penyedia payment gateway',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Gaji pengajar dan tim konten',
          'Biaya server dan infrastruktur',
          'Biaya marketing digital',
        ],
      },
    ],
  },

  // 3. Jasa Laundry Kiloan – Surabaya
  {
    id: '33333333-3333-3333-3333-333333333333',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -7.250445, lon: 112.768845 }, // Surabaya
    createdAt: '2025-12-04T08:45:00.000Z',
    updatedAt: '2025-12-04T08:45:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Mahasiswa kos',
          'Pekerja kantoran sibuk',
          'Keluarga di area padat penduduk',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Laundry cepat 1 hari selesai',
          'Layanan antar-jemput pakaian',
          'Pilihan paket cuci biasa dan premium',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Toko fisik di pemukiman',
          'WhatsApp dan katalog online',
          'Platform ojek online (fitur laundry)',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Sistem member dengan poin',
          'Chat langsung untuk komplain dan request khusus',
          'Reminder jadwal laundry rutin',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Cuci kering kiloan',
          'Layanan setrika saja',
          'Layanan khusus selimut, bedcover, dan jas',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Mesin cuci dan pengering',
          'Pegawai operasional',
          'Kendaraan antar-jemput',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Proses cuci, kering, dan setrika',
          'Penjadwalan antar-jemput',
          'Manajemen kualitas dan komplain',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Distributor deterjen dan parfum laundry',
          'Platform ojek online lokal',
          'Pemilik kos dan apartemen',
        ],
      },
      {
        tag: 'cost_structure',
        content: ['Listrik dan air', 'Gaji pegawai', 'Perawatan mesin'],
      },
    ],
  },

  // 4. Food Truck Burger – Yogyakarta
  {
    id: '44444444-4444-4444-4444-444444444444',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -7.79558, lon: 110.36949 }, // Yogyakarta
    createdAt: '2025-12-04T09:20:00.000Z',
    updatedAt: '2025-12-04T09:20:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Anak muda dan mahasiswa',
          'Wisatawan lokal dan mancanegara',
          'Pengunjung event dan konser',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Burger homemade dengan resep unik lokal',
          'Harga terjangkau untuk kantong mahasiswa',
          'Konsep food truck yang instagramable',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Lokasi food truck di area kampus dan event',
          'Instagram dan TikTok untuk info lokasi harian',
          'Aplikasi pesan-antar makanan',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Update lokasi realtime di media sosial',
          'Promo bundling dan diskon mahasiswa',
          'Interaksi langsung yang santai',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Penjualan burger dan minuman',
          'Paket catering untuk event kecil',
          'Kerjasama stand di festival kuliner',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Food truck dan peralatan masak',
          'Resep dan bahan baku',
          'Tim dapur dan kasir',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Produksi dan penjualan burger',
          'Riset menu baru',
          'Promosi digital harian',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Penyelenggara event dan kampus',
          'Supplier daging dan sayur lokal',
          'Influencer kuliner lokal',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Bahan baku makanan',
          'Operasional food truck (BBM, parkir)',
          'Gaji tim',
        ],
      },
    ],
  },

  // 5. Penyewaan Kamera & Studio Kecil – Denpasar
  {
    id: '55555555-5555-5555-5555-555555555555',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -8.65, lon: 115.216667 }, // Denpasar
    createdAt: '2025-12-04T10:00:00.000Z',
    updatedAt: '2025-12-04T10:00:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Fotografer pemula dan profesional',
          'Content creator dan YouTuber',
          'Agensi kecil dan UMKM',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Penyewaan kamera dan lensa dengan harga fleksibel',
          'Studio mini untuk foto produk dan portrait',
          'Paket bundling kamera + operator',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Website dan katalog online',
          'Instagram dan marketplace lokal',
          'Referensi dari komunitas fotografi',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Membership dengan harga sewa khusus',
          'Layanan konsultasi gear',
          'Layanan cepat via chat',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Sewa harian/mingguan kamera dan lensa',
          'Sewa studio per jam',
          'Jasa foto dan video',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Peralatan kamera, lensa, dan lighting',
          'Studio foto',
          'Sistem booking dan inventori',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Manajemen inventori dan maintenance peralatan',
          'Penjadwalan booking',
          'Promosi ke komunitas kreatif',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Komunitas fotografi dan videografi',
          'Brand kamera untuk event promosi',
          'Studio dan kreator lokal',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Perawatan dan pembelian peralatan',
          'Sewa tempat studio',
          'Gaji staf',
        ],
      },
    ],
  },

  // 6. Toko Tanaman Hias Online – Medan
  {
    id: '66666666-6666-6666-6666-666666666666',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: 3.589665, lon: 98.673447 }, // Medan
    createdAt: '2025-12-04T11:30:00.000Z',
    updatedAt: '2025-12-04T11:30:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Pecinta tanaman pemula',
          'Penghuni apartemen dan rumah minimalis',
          'Kantor yang ingin dekorasi hijau',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Tanaman hias siap kirim dengan panduan perawatan',
          'Paket starter kit untuk pemula',
          'Layanan konsultasi perawatan via chat',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Marketplace (Tokopedia, Shopee)',
          'Instagram Shop',
          'Website katalog tanaman',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Garansi tanaman 3–7 hari',
          'Grup WhatsApp/Telegram komunitas',
          'Konten edukasi rutin',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Penjualan tanaman hias',
          'Penjualan pot dan media tanam',
          'Jasa dekorasi tanaman untuk kantor/kafe',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Greenhouse/area pembibitan',
          'Stok tanaman dan perlengkapannya',
          'Tim pengiriman dan packing',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Perawatan tanaman dan pembibitan',
          'Pemotretan dan upload produk',
          'Pengemasan dan pengiriman',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Kurir pengiriman',
          'Supplier pot dan media tanam',
          'Influencer hobi tanaman',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Perawatan tanaman dan peralatan',
          'Biaya pengemasan',
          'Iklan di marketplace dan media sosial',
        ],
      },
    ],
  },

  // 7. Warung Makan Sehat – Makassar
  {
    id: '77777777-7777-7777-7777-777777777777',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -5.147665, lon: 119.432732 }, // Makassar
    createdAt: '2025-12-04T12:45:00.000Z',
    updatedAt: '2025-12-04T12:45:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Pekerja kantoran yang ingin makan sehat',
          'Mahasiswa yang diet atau olahraga',
          'Komunitas fitness dan gym',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Menu sehat dengan kalori terukur',
          'Paket makan siang berlangganan',
          'Pilihan menu lokal yang dimodifikasi lebih sehat',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Penjualan langsung di warung',
          'Pesan antar via aplikasi ojek online',
          'Instagram menu harian',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Langganan mingguan/bulanan',
          'Tracking kalori via Google Sheets atau aplikasi',
          'Feedback menu dari pelanggan',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Penjualan per porsi',
          'Paket catering sehat kantor',
          'Langganan makan harian/mingguan',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Dapur dan peralatan masak',
          'Chef yang paham menu sehat',
          'Sistem pemesanan dan pencatatan',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Persiapan dan memasak menu harian',
          'Pengiriman pesanan',
          'Riset dan update menu',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Gym dan studio olahraga',
          'Supplier sayur dan bahan segar',
          'Platform delivery makanan',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Bahan baku makanan',
          'Gaji karyawan dapur dan kurir',
          'Sewa tempat',
        ],
      },
    ],
  },

  // 8. Coworking Space Kecil – Samarinda
  {
    id: '88888888-8888-8888-8888-888888888888',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -0.502183, lon: 117.153801 }, // Samarinda
    createdAt: '2025-12-04T14:00:00.000Z',
    updatedAt: '2025-12-04T14:00:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Freelancer dan pekerja remote',
          'Startup kecil dan UMKM digital',
          'Komunitas teknologi dan kreatif',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Ruang kerja nyaman dengan internet cepat',
          'Ruang meeting kecil untuk presentasi',
          'Event rutin komunitas dan networking',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Website dan sistem booking online',
          'Instagram dan LinkedIn',
          'Partner dengan komunitas lokal',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Membership bulanan',
          'Diskon untuk komunitas tertentu',
          'Support onsite dari staff',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Sewa meja harian/bulanan',
          'Sewa ruang meeting',
          'Penyewaan ruang event',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Gedung/ruang coworking',
          'Perabotan dan fasilitas (AC, WiFi, projector)',
          'Tim operasional',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Operasional harian coworking',
          'Mengorganisir event dan meetup',
          'Promosi ke target market',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Komunitas startup dan tech',
          'Provider internet',
          'Sponsor event lokal',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Sewa/maintenance gedung',
          'Internet dan utilitas',
          'Gaji staff dan marketing',
        ],
      },
    ],
  },

  // 9. Jasa Pengembangan Website UMKM – Palembang
  {
    id: '99999999-9999-9999-9999-999999999999',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: -2.990934, lon: 104.756554 }, // Palembang
    createdAt: '2025-12-04T15:15:00.000Z',
    updatedAt: '2025-12-04T15:15:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'UMKM kuliner',
          'Toko pakaian dan butik',
          'Jasa layanan lokal (bengkel, salon, dll.)',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Paket pembuatan website murah dan cepat',
          'Website responsif dan SEO basic',
          'Layanan maintenance dan update konten',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Website portofolio',
          'LinkedIn dan Facebook Page',
          'Referensi dari klien sebelumnya',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Konsultasi awal gratis',
          'Group support via WhatsApp',
          'Laporan performa berkala',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Biaya pembuatan website',
          'Biaya maintenance bulanan',
          'Layanan tambahan (copywriting, foto produk)',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Tim developer dan designer',
          'Template dan library code',
          'Tool manajemen proyek',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Analisis kebutuhan klien',
          'Desain dan pengembangan website',
          'Testing dan deployment',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Penyedia hosting dan domain',
          'Fotografer produk',
          'Konsultan digital marketing',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Gaji tim',
          'Tool berbayar (software, plugin)',
          'Biaya marketing',
        ],
      },
    ],
  },

  // 10. Studio Musik & Podcast – Manado
  {
    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    authorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isPublic: true,
    coordinates: { lat: 1.47483, lon: 124.842079 }, // Manado
    createdAt: '2025-12-04T16:30:00.000Z',
    updatedAt: '2025-12-04T16:30:00.000Z',
    items: [
      {
        tag: 'customer_segments',
        content: [
          'Band lokal dan musisi indie',
          'Podcaster pemula dan profesional',
          'Brand lokal yang butuh jasa audio',
        ],
      },
      {
        tag: 'value_propositions',
        content: [
          'Studio akustik dengan peralatan rekaman standar industri',
          'Paket rekaman lagu dan mixing mastering',
          'Paket rekaman podcast lengkap dengan operator',
        ],
      },
      {
        tag: 'channels',
        content: [
          'Instagram dan TikTok',
          'Website dan Google Maps',
          'Komunitas musik dan radio lokal',
        ],
      },
      {
        tag: 'customer_relationships',
        content: [
          'Sesi konsultasi sebelum rekaman',
          'Paket langganan jam studio',
          'Follow-up untuk revisi hasil mixing/mastering',
        ],
      },
      {
        tag: 'revenue_streams',
        content: [
          'Sewa jam studio',
          'Jasa mixing dan mastering',
          'Paket produksi jingle dan audio iklan',
        ],
      },
      {
        tag: 'key_resources',
        content: [
          'Ruang studio kedap suara',
          'Peralatan audio dan software DAW',
          'Sound engineer dan operator',
        ],
      },
      {
        tag: 'key_activities',
        content: [
          'Proses rekaman dan produksi audio',
          'Editing, mixing, dan mastering',
          'Promosi ke komunitas musik dan brand lokal',
        ],
      },
      {
        tag: 'key_partnerships',
        content: [
          'Komunitas musik dan event organizer',
          'Radio lokal dan media online',
          'Supplier alat musik dan audio',
        ],
      },
      {
        tag: 'cost_structure',
        content: [
          'Perawatan dan upgrade peralatan',
          'Sewa/maintenance studio',
          'Gaji sound engineer dan staf',
        ],
      },
    ],
  },
];

export const dummyBmc_for_chat = {
  _id: {
    $oid: '6933cfe0bdcb900c0e9567a2',
  },
  coordinat: {
    lat: 0,
    long: 0,
    alt: 0,
  },
  authorId: 'user_36KxgJsnUEJlQuFxLmiO7sdpd91',
  chatId: 'ed961e9a-8516-4e41-a3f4-4d26a55fbea4',
  isPublic: false,
  items: [
    {
      tag: 'customer_segments',
      content:
        'Mahasiswa usia 18-25 tahun di area kampus dengan daya beli terbatas, mencari tempat nongkrong yang nyaman dan terjangkau. Segmen utama adalah mahasiswa aktif yang gemar bersosialisasi, belajar kelompok, atau sekedar bersantai di antara jadwal kuliah. Karakteristik: budget-conscious, tech-savvy, aktif di media sosial, mencari pengalaman sosial dan produk yang Instagrammable. Kebutuhan utama adalah tempat berkumpul dengan harga terjangkau, WiFi gratis, dan suasana nyaman untuk belajar atau diskusi kelompok.',
    },
    {
      tag: 'value_propositions',
      content:
        'Kopi susu kekinian berkualitas dengan harga mahasiswa-friendly 15-25 ribu rupiah, jauh lebih terjangkau dibanding kompetitor premium. Menawarkan tempat nongkrong nyaman dengan WiFi gratis, colokan listrik di setiap meja, dan suasana casual yang cocok untuk belajar atau bersosialisasi. Menu variatif dengan inovasi rasa yang mengikuti tren, porsi yang memuaskan, dan opsi customization. Lokasi strategis di area kampus memudahkan akses tanpa perlu transportasi jauh. Program loyalitas khusus mahasiswa dengan stamp card dan promo rutin di hari-hari tertentu.',
    },
    {
      tag: 'channels',
      content:
        'Outlet fisik di lokasi strategis area kampus dengan visibility tinggi dan mudah dijangkau mahasiswa. Media sosial aktif (Instagram, TikTok, WhatsApp Business) untuk promosi, menu update, dan engagement dengan customer. Kerjasama dengan komunitas mahasiswa dan organisasi kampus untuk event sponsorship dan catering. Word-of-mouth marketing melalui program referral dan konten user-generated yang viral. Delivery partnership dengan platform ojek online untuk jangkauan lebih luas ke area kos-kosan dan asrama mahasiswa.',
    },
    {
      tag: 'customer_relationships',
      content:
        'Personal assistance di outlet dengan barista ramah yang dapat berinteraksi dan memberikan rekomendasi produk. Self-service ordering system yang efisien untuk mengurangi antrian di jam sibuk. Komunitas online melalui grup WhatsApp dan Instagram untuk info promo eksklusif, feedback, dan engagement. Program loyalitas dengan stamp card digital yang memberikan reward setiap pembelian. Event rutin seperti open mic, study night, atau gathering komunitas untuk membangun sense of belonging. Respon cepat terhadap feedback dan complaint melalui media sosial untuk menunjukkan customer care.',
    },
    {
      tag: 'revenue_streams',
      content:
        'Penjualan langsung kopi susu kekinian dengan margin 60-70% per cup, harga jual 15-25 ribu rupiah sebagai produk utama. Penjualan snack ringan seperti pisang goreng, roti bakar, kentang goreng dengan margin 50-60%. Upselling dengan add-ons seperti extra shot, whipped cream, atau topping dengan harga tambahan 3-5 ribu rupiah. Catering untuk event kampus, seminar, atau gathering organisasi mahasiswa dengan paket bundling. Merchandise branded seperti tumbler, tote bag, dan sticker dengan margin tinggi. Future revenue dari membership premium yang memberikan benefit eksklusif seperti free delivery dan priority order.',
    },
    {
      tag: 'key_resources',
      content:
        'Lokasi strategis di area kampus dengan sewa terjangkau dan akses mudah bagi mahasiswa. Mesin kopi espresso, grinder, dan peralatan brewing berkualitas untuk konsistensi produk. Barista terlatih dengan skill latte art dan product knowledge yang baik, mampu bekerja cepat di jam ramai. Supplier kopi lokal dan bahan baku dengan harga kompetitif dan kualitas konsisten. Brand identity kuat yang relatable dengan target market mahasiswa, termasuk logo, desain outlet yang instagrammable. Database customer dan sistem loyalitas untuk retention dan personalized marketing.',
    },
    {
      tag: 'key_activities',
      content:
        'Produksi kopi dan snack dengan standar kualitas konsisten, recipe development untuk menu baru yang mengikuti tren. Operasional outlet sehari-hari meliputi inventory management, cash flow, dan quality control. Marketing dan promosi aktif di media sosial dengan konten engaging, kolaborasi dengan influencer mahasiswa. Customer service excellence untuk membangun loyalitas dan word-of-mouth positif. Partnership management dengan supplier, komunitas kampus, dan platform delivery. Training barista secara berkala untuk skill improvement dan service excellence. Event organizing untuk community building dan brand awareness di kalangan mahasiswa.',
    },
    {
      tag: 'key_partnerships',
      content:
        'Supplier kopi lokal dan distributor bahan baku dengan harga grosir dan sistem payment term yang fleksibel. Vendor snack dan pastry lokal untuk supply produk pendamping dengan konsinyasi atau kerjasama profit sharing. Platform delivery online seperti GoFood dan GrabFood untuk ekspansi channel penjualan tanpa investasi besar. Organisasi mahasiswa, BEM, dan komunitas kampus untuk event sponsorship dan promosi dari mulut ke mulut. Landlord atau pengelola area kampus untuk lokasi strategis dengan sewa kompetitif. Micro-influencer mahasiswa untuk promosi organik dan user-generated content. Bank atau fintech untuk sistem pembayaran digital dan kemungkinan program cashback yang menarik mahasiswa.',
    },
    {
      tag: 'cost_structure',
      content:
        'Biaya bahan baku kopi, susu, dan ingredients dengan persentase 25-30% dari revenue sebagai COGS terbesar. Sewa lokasi di area kampus berkisar 15-20% dari revenue tergantung lokasi strategis. Gaji barista dan staff operasional 2-3 orang per shift dengan upah kompetitif untuk retain talent. Utilitas bulanan meliputi listrik, air, gas, dan internet untuk operasional dan WiFi gratis customer. Marketing dan promosi digital termasuk paid ads, konten creator, dan program loyalitas sekitar 5-10% revenue. Maintenance peralatan, supplies operasional seperti cup, sedotan, tissue, dan packaging. Investasi awal untuk setup outlet, peralatan kopi, dan renovasi interior yang instagrammable dengan ROI period 12-18 bulan.',
    },
  ],
  createdAt: {
    $date: '2025-12-06T06:40:32.113Z',
  },
  updatedAt: {
    $date: '2025-12-06T06:40:32.113Z',
  },
  __v: 0,
};

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

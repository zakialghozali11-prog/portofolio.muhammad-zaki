/* ==========================================================================
   MZ — Liquid Glass Portfolio & Daily Finance App — script.js
   Vanilla JavaScript (ES6) murni: tanpa library, tanpa build, tanpa npm.
   Cukup buka index.html (atau pakai Live Server / GitHub Pages).

   Daftar isi
   1. DATA & SEED                    5. FINANCE ENGINE
   2. STATE & STORAGE                6. CHARTS (grafik SVG buatan sendiri)
   3. SPLASH CONTROLLER              7. PROJECTS & MODALS
   4. NAVIGATION & INTERACTION       8. PWA INSTALL & SERVICE WORKER
                                     9. INIT
   ========================================================================== */
(() => {
  "use strict";

  /* ======================================================================
     1. DATA & SEED  — bagian yang boleh kamu ubah (catatan keuangan mulai dari 0)
     ====================================================================== */
  const CONFIG = {
    email: "zaki.alghozali@mzstudio.id",
    formEndpoint: "", // (opsional) alamat Formspree, mis. "https://formspree.io/f/abcdwxyz". Kosong = pesan dibuka lewat aplikasi email.
    timezone: "Asia/Jakarta", // dipakai untuk sapaan Pagi / Siang / Sore / Malam
  };

  const PROFILE = {
    name: "Muhammad Zaki Al Ghozali",
    tagline: "Pelajar SMP • Vibe Coding Builder • Smart Daily Finance",
    bio: [
      "Sejak duduk di bangku SMP, Zaki memanfaatkan AI dan kreativitas desain untuk mengubah ide menjadi aplikasi yang benar-benar berfungsi. Ia merancang antarmuka, menyusun PRD yang presisi, lalu mengiterasinya bersama asisten AI sampai terasa halus di layar HP maupun laptop.",
      "Selain membangun produk digital, Zaki membiasakan diri mencatat pemasukan dan pengeluaran harian — karena kebiasaan finansial yang baik sebaiknya dimulai sedini mungkin.",
    ],
    tags: ["Vibe Coding", "AI Prompting", "UI/UX Liquid Glass", "HTML/CSS/JS", "PWA", "Daily Finance"],
  };

  const STACK = [
    { icon: "bot", name: "AI Coding Assistant" },
    { icon: "code-xml", name: "HTML/CSS/JS" },
    { icon: "droplet", name: "UI Liquid Glass" },
    { icon: "terminal", name: "Prompt Craft" },
    { icon: "smartphone", name: "PWA Mobile App" },
    { icon: "github", name: "GitHub Pages" },
  ];

  // Kartu "Fokus Karya": pct = tinggi batang (0–100)
  const FOCUS = {
    skill: [
      { label: "Vibe", value: "95%", pct: 95 },
      { label: "UI/UX", value: "91%", pct: 91 },
      { label: "Web", value: "88%", pct: 88 },
    ],
    jam: [
      { label: "Coding", value: "12 jam", pct: 86 },
      { label: "Belajar", value: "8 jam", pct: 57 },
      { label: "Desain", value: "5 jam", pct: 36 },
    ],
  };

  const STREAK_HEIGHTS = [34, 46, 28, 52, 40, 24, 48, 36, 54, 30, 44, 26, 50, 38, 22, 46, 34, 54, 28, 42, 50, 32, 44, 38];

  // Jadwal mingguan (1 = Senin … 7 = Minggu). Ubah sesuai jadwal aslimu.
  const SCHEDULE = {
    1: { school: ["07.00 – 14.00", "Matematika, IPA, Bahasa Indonesia"], vibe: ["19.30 – 20.30", "Susun PRD & rancang tampilan UI"] },
    2: { school: ["07.00 – 14.00", "IPS, Bahasa Inggris, Seni Budaya"], vibe: ["19.30 – 20.30", "Belajar JavaScript & latihan kode"] },
    3: { school: ["07.00 – 14.00", "Matematika, PJOK, Informatika"], vibe: ["19.30 – 21.00", "Bangun fitur baru bersama AI"] },
    4: { school: ["07.00 – 14.00", "IPA, Bahasa Indonesia, PKN"], vibe: ["19.30 – 20.30", "Eksperimen UI Liquid Glass"] },
    5: { school: ["07.00 – 11.30", "Pendidikan Agama, Bahasa Inggris, Prakarya"], vibe: ["19.30 – 21.00", "Iterasi AI & perapian detail"] },
    6: { school: ["Libur sekolah", "Waktu bebas & kegiatan ekstrakurikuler"], vibe: ["09.00 – 12.00", "Sesi proyek utama: MZ Liquid App"] },
    7: { school: ["Libur sekolah", "Istirahat & persiapan minggu depan"], vibe: ["16.00 – 17.30", "Review, upload GitHub & catat keuangan"] },
  };

  const ACTIVITY = {
    proyek: [
      { icon: "rocket", title: "MZ Liquid App v1.0", sub: "Penyempurnaan UI, animasi & PWA", chip: "Berjalan" },
      { icon: "piggy-bank", title: "Celengan Target Pro", sub: "Prototipe target tabungan", chip: "Prototipe" },
      { icon: "sparkles", title: "PromptCraft Studio", sub: "Menambah template prompt baru", chip: "Iterasi" },
    ],
    belajar: [
      { icon: "code-xml", title: "JavaScript: array & objek", sub: "Latihan 20 menit setiap hari", chip: "Rutin" },
      { icon: "droplet", title: "Prinsip UI Liquid Glass", sub: "Blur, kontras & bayangan", chip: "Proses" },
      { icon: "smartphone", title: "Cara kerja PWA", sub: "Service worker & manifest", chip: "Baru" },
    ],
    target: [
      { icon: "target", title: "Selesaikan 1 proyek baru bulan ini", sub: "Progres target", progress: 60 },
      { icon: "piggy-bank", goal: true },
      { icon: "github", title: "Upload semua karya ke GitHub Pages", sub: "Progres target", progress: 40 },
    ],
  };

  const PROJECT_FILTERS = ["Semua", "Web App", "Finance", "Eksperimen UI"];

  const PROJECTS = [
    {
      id: "mz-liquid-finance",
      title: "MZ Liquid Finance",
      category: "Finance",
      year: "2026",
      visual: "finance",
      tagline: "Aplikasi pencatat uang saku harian bergaya Liquid Glass.",
      problem: "Uang saku sering habis tanpa terasa karena mencatat di buku terlalu merepotkan, apalagi saat sedang di luar rumah.",
      approach: "Zaki menulis PRD yang detail, meminta AI membangun kerangka aplikasi, lalu memoles tiap iterasi: format Rupiah otomatis, tombol nominal cepat, dan grafik yang berubah langsung saat transaksi disimpan.",
      tech: ["HTML", "CSS Liquid Glass", "JavaScript", "PWA", "localStorage"],
      result: "Aplikasi keuangan yang bisa dipakai setiap hari di HP maupun laptop, tersimpan otomatis di perangkat, dan bisa dipasang di layar utama.",
      liveView: "finance",
    },
    {
      id: "studyvibe-ai-hub",
      title: "StudyVibe AI Hub",
      category: "Web App",
      year: "2026",
      visual: "study",
      tagline: "Web bantu merangkum catatan pelajaran SMP menjadi flashcard.",
      problem: "Merangkum catatan pelajaran satu per satu memakan waktu, apalagi menjelang ulangan saat materi menumpuk.",
      approach: "Zaki merancang alur prompt yang mengubah catatan mentah menjadi ringkasan, daftar istilah penting, dan kartu tanya-jawab, lalu menyetel tampilannya agar nyaman dibaca di HP.",
      tech: ["HTML", "CSS", "JavaScript", "AI Prompting"],
      result: "Prototipe web belajar yang membantu mengubah catatan menjadi ringkasan dan flashcard sebelum ulangan.",
    },
    {
      id: "aquaglass-ui-kit",
      title: "AquaGlass UI Kit",
      category: "Eksperimen UI",
      year: "2025",
      visual: "kit",
      tagline: "Koleksi komponen UI kaca putih-biru siap pakai.",
      problem: "Desain kaca sering terlihat keruh dan sulit dibaca bila blur, kontras, dan bayangan tidak seimbang.",
      approach: "Zaki bereksperimen dengan lapisan blur, saturasi, dan garis tepi reflektif sampai menemukan formula kaca putih-biru yang tetap terbaca di berbagai latar.",
      tech: ["CSS Variables", "backdrop-filter", "Animasi CSS"],
      result: "Kumpulan komponen kaca cair (kartu, tombol, tab, kapsul) yang kemudian dipakai langsung di MZ Liquid Finance.",
    },
    {
      id: "kelas8-schedule-app",
      title: "Kelas8 Schedule App",
      category: "Web App",
      year: "2025",
      visual: "schedule",
      tagline: "Aplikasi jadwal pelajaran, PR, dan piket kelas.",
      problem: "Jadwal pelajaran, PR, dan piket kelas tersebar di grup chat sehingga sering terlewat.",
      approach: "Zaki memetakan kebutuhan teman sekelas, menyusun PRD singkat, lalu membangun tampilan jadwal mingguan yang cepat dibuka dari HP.",
      tech: ["HTML", "CSS Grid", "JavaScript", "localStorage"],
      result: "Jadwal mingguan yang rapi dan mudah dicek sebelum berangkat sekolah.",
    },
    {
      id: "celengan-target-pro",
      title: "Celengan Target Pro",
      category: "Finance",
      year: "2026",
      visual: "timer",
      tagline: "Pelacak target tabungan dengan progres yang terlihat jelas.",
      problem: "Menabung untuk barang impian terasa lama dan membosankan karena kemajuannya tidak terlihat.",
      approach: "Zaki mengubah target tabungan menjadi indikator progres visual yang bergerak setiap kali saldo bertambah, lengkap dengan sisa nominal yang harus ditabung.",
      tech: ["HTML", "CSS", "JavaScript", "SVG"],
      result: "Prototipe target tabungan yang membuat progres menabung terlihat jelas; idenya dipakai pada kartu target di MZ Liquid Finance.",
      liveView: "finance",
    },
    {
      id: "promptcraft-studio",
      title: "PromptCraft Studio",
      category: "Eksperimen UI",
      year: "2026",
      visual: "prompt",
      tagline: "Template prompt Vibe Coding untuk membangun web lebih cepat.",
      problem: "Prompt yang kurang jelas membuat hasil AI berantakan sehingga harus diulang berkali-kali.",
      approach: "Zaki mengumpulkan pola prompt yang terbukti bekerja, merapikannya menjadi template, dan menyediakan ruang bermain untuk mengubah variabelnya dengan cepat.",
      tech: ["HTML", "CSS", "JavaScript", "AI Prompting"],
      result: "Koleksi template prompt untuk landing page, dashboard, dan komponen UI yang mempercepat proses Vibe Coding.",
    },
  ];

  const SKILLS = [
    { name: "Vibe Coding & AI Prompting", level: 95 },
    { name: "UI/UX Liquid Glass", level: 91 },
    { name: "HTML/CSS/JS Web App", level: 88 },
    { name: "Rapid Prototyping & PWA", level: 90 },
  ];

  const WORKFLOW = [
    { icon: "lightbulb", title: "Ide & Referensi", text: "Mulai dari masalah nyata dan kumpulan referensi tampilan yang ingin dicapai." },
    { icon: "file-text", title: "Susun PRD", text: "Menulis kebutuhan, aturan desain, dan checklist kualitas agar AI paham arah yang jelas." },
    { icon: "sparkles", title: "Iterasi AI", text: "Membangun bersama AI, lalu memoles detail tampilan dan gerakan sampai terasa halus." },
    { icon: "rocket", title: "Upload GitHub & Install HP", text: "Meluncurkan lewat GitHub Pages, lalu memasangnya di layar utama HP sebagai aplikasi." },
  ];

  const TIMELINE = [
    { year: "2024", title: "Mulai Mengenal Vibe Coding", text: "Pertama kali membangun halaman web sederhana dengan bantuan AI dan belajar menulis prompt yang jelas." },
    { year: "2025", title: "Proyek Pertama & Eksperimen UI", text: "Merilis beberapa proyek kecil, mendalami desain Liquid Glass, dan mulai menyusun PRD sebelum membangun." },
    { year: "2026", title: "MZ Liquid App", text: "Menggabungkan portofolio dan Daily Finance dalam satu aplikasi yang bisa dipasang di layar utama HP." },
  ];

  const INCOME_CATS = ["Uang Saku", "Proyek Vibe Coding", "Hadiah/Lomba", "Tabungan", "Lainnya"];
  const EXPENSE_CATS = ["Jajan & Makan", "Kuota & Tools AI", "Buku & Sekolah", "Transport", "Lainnya"];
  const CAT_ICONS = {
    "Uang Saku": "banknote",
    "Proyek Vibe Coding": "code-xml",
    "Hadiah/Lomba": "gift",
    "Tabungan": "piggy-bank",
    "Jajan & Makan": "utensils",
    "Kuota & Tools AI": "bot",
    "Buku & Sekolah": "book-open",
    "Transport": "bus",
    "Lainnya": "ellipsis",
  };
  const CAT_SHORT = {
    "Uang Saku": "Saku",
    "Proyek Vibe Coding": "Proyek",
    "Hadiah/Lomba": "Hadiah",
    "Tabungan": "Tabungan",
    "Jajan & Makan": "Jajan",
    "Kuota & Tools AI": "Kuota AI",
    "Buku & Sekolah": "Sekolah",
    "Transport": "Transport",
    "Lainnya": "Lainnya",
  };
  const QUICK_CHIPS = [
    { label: "+5.000", value: 5000 },
    { label: "+10.000", value: 10000 },
    { label: "+25.000", value: 25000 },
    { label: "+50.000", value: 50000 },
  ];
  const DEFAULT_GOAL = { title: "Upgrade Laptop Vibe Coding", targetAmount: 4500000 };
  const MAX_AMOUNT = 999999999999; // 12 digit

  const ROUTES = ["overview", "finance", "projects", "about", "contact"];
  const ROUTE_TITLES = { overview: "Overview", finance: "Daily Finance", projects: "Karya Vibe Coding", about: "Profil & Skill", contact: "Kontak & Install" };

  // Catatan keuangan dimulai dari nol (Rp 0, tanpa transaksi). Semua angka berubah setelah kamu mencatat transaksi.

  /* ======================================================================
     HELPER, IKON, TOAST & FORMAT (Rupiah, tanggal, sapaan)
     ====================================================================== */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESC_MAP[c]);
  const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

  // ---- Format Rupiah ----
  const groupDots = (n) => String(Math.abs(Math.trunc(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const rupiah = (n) => `${n < 0 ? "-" : ""}Rp ${groupDots(n)}`;
  const signedRupiah = (type, n) => `${type === "income" ? "+" : "-"}Rp ${groupDots(n)}`;
  function compact(n, withPrefix = true) {
    const a = Math.abs(n);
    const f = (v) => String(Math.round(v * 10) / 10).replace(".", ",");
    let body;
    if (a >= 1e12) body = `${f(a / 1e12)} T`;
    else if (a >= 1e9) body = `${f(a / 1e9)} M`;
    else if (a >= 1e6) body = `${f(a / 1e6)} jt`;
    else if (a >= 1e3) body = `${f(a / 1e3)} rb`;
    else body = String(a);
    return `${n < 0 ? "-" : ""}${withPrefix ? "Rp " : ""}${body}`;
  }
  const axisLabel = (n) => (n === 0 ? "0" : compact(n, false).replace(" ", ""));

  // ---- Tanggal (waktu lokal perangkat) ----
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const MONTHS_LONG = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const DAYS_LONG = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const todayISO = () => toISO(new Date());
  const shiftISO = (iso, days) => {
    const d = fromISO(iso);
    d.setDate(d.getDate() + days);
    return toISO(d);
  };
  const isValidISO = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && toISO(fromISO(s)) === s;
  const fmtShort = (iso) => {
    const d = fromISO(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };
  const fmtLong = (iso) => {
    const d = fromISO(iso);
    return `${DAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
  };
  const fmtTime = (ts) => {
    const d = new Date(ts);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  function dayLabel(iso) {
    const today = todayISO();
    if (iso === today) return "Hari Ini";
    if (iso === shiftISO(today, -1)) return "Kemarin";
    return fmtLong(iso);
  }

  // ---- Sapaan WIB ----
  function jakartaHour() {
    try {
      const h = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: CONFIG.timezone }).format(new Date());
      const n = Number(h);
      if (Number.isFinite(n)) return n;
    } catch (error) {
      /* pakai jam perangkat */
    }
    return new Date().getHours();
  }
  function greetingWord() {
    const h = jakartaHour();
    if (h >= 4 && h < 11) return "Selamat Pagi";
    if (h >= 11 && h < 15) return "Selamat Siang";
    if (h >= 15 && h < 18) return "Selamat Sore";
    return "Selamat Malam";
  }

  // ---- Ikon bergaya Lucide (garis 1.75, tanpa library) ----
  const ICON_PATHS = {
    "layout-dashboard": '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    "code-xml": '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "book-open": '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "arrow-down-right": '<path d="m7 7 10 10"/><path d="M17 7v10H7"/>',
    "trending-up": '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    "trending-down": '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
    minus: '<path d="M5 12h14"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    "trash-2": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    tiktok: '<circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
    share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>',
    "square-plus": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    "alert-circle": '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    "piggy-bank": '<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
    bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
    bus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
    gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
    ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    "graduation-cap": '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  };

  function svg(inner, size, stroke, fill) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill || "none"}" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
  }
  const icon = (name, size = 18, stroke = 1.75) => svg(ICON_PATHS[name] || "", size, stroke, "none");

  function hydrateIcons(root = document) {
    $$("[data-icon]", root).forEach((el) => {
      if (el.dataset.hydrated) return;
      el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 18, Number(el.dataset.stroke) || 1.75);
      el.dataset.hydrated = "1";
    });
  }

  // ---- Toast kaca cair (mendukung tombol aksi, mis. "Urungkan") ----
  function toast(message, options = {}) {
    const region = $("#toast-container");
    if (!region) return () => {};
    const el = document.createElement("div");
    el.className = "toast liquid-glass";
    const iconName = options.tone === "info" ? "info" : "check";
    el.innerHTML = `<span class="toast-ico${options.tone === "info" ? " is-info" : ""}">${icon(iconName, 15, 2.5)}</span><span class="toast-msg">${esc(message)}</span>`;
    let timer = 0;
    const dismiss = () => {
      window.clearTimeout(timer);
      if (!el.isConnected) return;
      el.classList.add("is-out");
      el.addEventListener("animationend", () => el.remove(), { once: true });
      window.setTimeout(() => el.remove(), 600);
    };
    if (options.action) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toast-action";
      btn.textContent = options.action.label;
      btn.addEventListener("click", () => {
        dismiss();
        options.action.onClick();
      });
      el.appendChild(btn);
    }
    region.appendChild(el);
    while (region.children.length > 3) region.firstElementChild.remove();
    timer = window.setTimeout(dismiss, options.duration || (options.action ? 6500 : 3200));
    return dismiss;
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      /* lanjut ke metode cadangan */
    }
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch (error) {
      return false;
    }
  }

  function setError(id, message, input) {
    const el = document.getElementById(id);
    if (!el) return;
    if (message) {
      el.innerHTML = `${icon("alert-circle", 15, 2)}<span>${esc(message)}</span>`;
      el.hidden = false;
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    } else {
      el.textContent = "";
      el.hidden = true;
    }
    if (input) {
      input.setAttribute("aria-invalid", message ? "true" : "false");
      if (message) input.setAttribute("aria-describedby", id);
    }
  }

  /* ======================================================================
     2. STATE & STORAGE — localStorage aman (try...catch), mulai dari Rp 0
     ====================================================================== */
  const KEYS = { tx: "mz.app.transactions.v4", goal: "mz.app.goal.v4" };
  const LEGACY_KEYS = ["mz.app.transactions.v3", "mz.app.goal.v3", "mz.app.transactions.v3.rusak", "mz.app.goal.v3.rusak"]; // versi lama berisi data contoh
  const storage = {
    warned: false,
    read(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    write(key, value) {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch (error) {
        return false;
      }
    },
  };

  // Baca JSON dengan aman: kosong / rusak tidak membuat aplikasi crash.
  function readJSON(key) {
    const raw = storage.read(key);
    if (raw == null || raw === "") return { found: false, value: null };
    try {
      return { found: true, value: JSON.parse(raw) };
    } catch (error) {
      storage.write(`${key}.rusak`, raw); // simpan salinan data rusak, siapa tahu masih bisa diselamatkan
      return { found: false, value: null };
    }
  }

  function persist(key, data) {
    const ok = storage.write(key, JSON.stringify(data));
    if (!ok && !storage.warned) {
      storage.warned = true;
      toast("Penyimpanan perangkat tidak tersedia — data hanya aman selama halaman ini terbuka.", { tone: "info", duration: 5000 });
    }
    return ok;
  }

  const state = {
    tx: [],
    goal: { ...DEFAULT_GOAL },
  };

  function sanitizeTx(raw) {
    if (!raw || typeof raw !== "object") return null;
    const type = raw.type === "income" || raw.type === "expense" ? raw.type : null;
    const amount = Math.round(Number(raw.amount));
    if (!type || !Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) return null;
    const category = typeof raw.category === "string" ? raw.category.trim().slice(0, 40) : "";
    if (!category) return null;
    if (!isValidISO(raw.date)) return null;
    const title = typeof raw.title === "string" ? raw.title.trim().slice(0, 60) : "";
    const createdAt = Number.isFinite(Number(raw.createdAt)) ? Number(raw.createdAt) : fromISO(raw.date).getTime();
    return {
      id: typeof raw.id === "string" && raw.id ? raw.id.slice(0, 40) : uid(),
      type,
      amount,
      category,
      title: title || category,
      date: raw.date,
      createdAt,
    };
  }

  function sanitizeTxList(list) {
    const seen = new Set();
    const out = [];
    (Array.isArray(list) ? list : []).forEach((item) => {
      const tx = sanitizeTx(item);
      if (!tx) return;
      if (seen.has(tx.id)) tx.id = uid();
      seen.add(tx.id);
      out.push(tx);
    });
    return out;
  }

  function sanitizeGoal(raw) {
    if (!raw || typeof raw !== "object") return { ...DEFAULT_GOAL };
    const title = typeof raw.title === "string" ? raw.title.trim().slice(0, 50) : "";
    const amount = Math.round(Number(raw.targetAmount));
    return {
      title: title || DEFAULT_GOAL.title,
      targetAmount: Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT ? amount : DEFAULT_GOAL.targetAmount,
    };
  }

  const saveTx = () => persist(KEYS.tx, state.tx);
  const saveGoal = () => persist(KEYS.goal, state.goal);

  function loadState() {
    try {
      LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
    } catch (error) {
      /* penyimpanan tidak tersedia: abaikan */
    }
    const t = readJSON(KEYS.tx);
    state.tx = t.found && Array.isArray(t.value) ? sanitizeTxList(t.value) : []; // mulai dari nol
    const g = readJSON(KEYS.goal);
    state.goal = g.found ? sanitizeGoal(g.value) : { ...DEFAULT_GOAL };
  }

  /* ======================================================================
     3. SPLASH CONTROLLER — animasi startup logo MZ (~2,1 detik)
     ====================================================================== */
  const splash = { el: null, leaveTimer: 0, removeTimer: 0, running: false, leaving: false };

  function setAppInert(on) {
    ["#app-shell", "#dock"].forEach((selector) => {
      const el = $(selector);
      if (el) el.inert = on;
    });
  }

  function startSplash() {
    const el = splash.el;
    if (!el) return;
    window.clearTimeout(splash.leaveTimer);
    window.clearTimeout(splash.removeTimer);
    splash.running = true;
    splash.leaving = false;
    el.hidden = false;
    el.classList.remove("is-leaving", "is-fast", "is-playing");
    void el.offsetWidth;
    el.classList.add("is-playing");
    setAppInert(true);
    fitAll();
    splash.leaveTimer = window.setTimeout(() => leaveSplash(false), prefersReduced() ? 700 : 1800); // 1,80 s → mulai melarut
  }

  function leaveSplash(fast) {
    const el = splash.el;
    if (!el || !splash.running || splash.leaving) return;
    splash.leaving = true;
    window.clearTimeout(splash.leaveTimer);
    el.classList.add("is-leaving"); // opacity 0 · scale 1.06 · blur 14px (0,35 s)
    if (fast) el.classList.add("is-fast");
    setAppInert(false);
    document.body.classList.remove("is-booting");
    redrawCharts(true);
    const ms = prefersReduced() ? 60 : fast ? 210 : 350; // total ≈ 2,15 s
    splash.removeTimer = window.setTimeout(() => {
      el.hidden = true; // display: none → tidak lagi menutupi layar
      el.classList.remove("is-leaving", "is-fast", "is-playing");
      splash.running = false;
      splash.leaving = false;
    }, ms);
  }

  function setupSplash() {
    splash.el = $("#startup-splash");
    if (!splash.el) {
      document.body.classList.remove("is-booting");
      return;
    }
    splash.el.addEventListener("pointerdown", () => leaveSplash(true)); // ketuk layar = langsung masuk
    document.addEventListener("keydown", (event) => {
      if (splash.running && (event.key === "Enter" || event.key === " " || event.key === "Escape")) leaveSplash(true);
    });
    startSplash();
  }

  /* ======================================================================
     4. NAVIGATION & INTERACTION — pill cair, router, dialog, teks 1 baris
     ====================================================================== */

  // ---- Teks 1 baris: nama lengkap & angka besar tidak pernah turun ke baris kedua ----
  function fitText(el) {
    if (!el || !el.isConnected) return;
    el.style.fontSize = "";
    const available = el.clientWidth;
    if (!available) return; // sedang tersembunyi → dihitung ulang saat tampil
    let needed = el.scrollWidth;
    if (needed <= available + 0.5) return;
    const min = Number(el.dataset.fit) || 10;
    let size = parseFloat(window.getComputedStyle(el).fontSize) || 16;
    size = Math.max(min, Math.floor(size * (available / needed) * 2) / 2);
    el.style.fontSize = `${size}px`;
    let guard = 24;
    while (guard-- > 0 && size > min && el.scrollWidth > el.clientWidth + 0.5) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }
  }
  const fitAll = (root = document) => $$("[data-fit]", root).forEach(fitText);

  // ---- Kapsul indikator yang meluncur (nav, tab, filter) ----
  // Posisi dihitung dari offsetLeft/offsetTop (tidak terpengaruh animasi scale pada halaman).
  const pills = [];
  function createPill(container, indicator, activeSelector) {
    const pill = { container, indicator, activeSelector };
    pills.push(pill);
    return pill;
  }

  function placePill(pill, instant) {
    const active = pill.container.querySelector(pill.activeSelector);
    if (!active || !active.offsetWidth) return; // tersembunyi: dihitung ulang saat tampil
    const ind = pill.indicator;
    const instantMove = instant || !ind.classList.contains("is-set") || prefersReduced();
    if (instantMove) ind.style.transition = "none";
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.height = `${active.offsetHeight}px`;
    ind.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    ind.classList.add("is-set");
    if (instantMove) {
      void ind.offsetWidth;
      requestAnimationFrame(() => {
        ind.style.transition = "";
      });
    }
  }
  const refreshPills = (instant) => pills.forEach((pill) => placePill(pill, instant));

  // Tab / radiogroup berkapsul cair dengan ARIA & navigasi panah
  function setupTabs(root, pillEl, attr, initial, onChange, buttonSelector = ".seg-btn") {
    if (!root || !pillEl) return null;
    const pill = createPill(root, pillEl, `${buttonSelector}.is-active`);
    const tabs = $$(buttonSelector, root);
    const isRadio = tabs.length > 0 && tabs[0].getAttribute("role") === "radio";
    const select = (value, silent) => {
      tabs.forEach((tab) => {
        const on = tab.dataset[attr] === value;
        tab.classList.toggle("is-active", on);
        tab.setAttribute(isRadio ? "aria-checked" : "aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      placePill(pill);
      const active = tabs.find((tab) => tab.classList.contains("is-active"));
      if (active && root.scrollWidth > root.clientWidth + 1) {
        const left = clamp(active.offsetLeft - (root.clientWidth - active.offsetWidth) / 2, 0, root.scrollWidth - root.clientWidth);
        root.scrollTo({ left, behavior: prefersReduced() ? "auto" : "smooth" });
      }
      if (!silent && onChange) onChange(value);
    };
    tabs.forEach((tab) => tab.addEventListener("click", () => select(tab.dataset[attr])));
    root.addEventListener("keydown", (event) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!dir) return;
      event.preventDefault();
      const index = Math.max(0, tabs.findIndex((tab) => tab.classList.contains("is-active")));
      const next = tabs[(index + dir + tabs.length) % tabs.length];
      next.focus();
      select(next.dataset[attr]);
    });
    select(initial, true);
    return { select, pill, tabs };
  }

  // ---- Router SPA: 5 halaman dengan transisi blur-to-sharp ----
  const BASE_TITLE = document.title;
  let currentView = "overview";
  let pendingSwap = null;
  const navPills = {};
  const viewHooks = {}; // fungsi yang dijalankan tiap halaman tampil

  function setActiveNav(view) {
    $$(".nav-btn, .dock-btn").forEach((btn) => {
      const on = btn.dataset.view === view;
      btn.classList.toggle("is-active", on);
      if (on) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
    Object.values(navPills).forEach((pill) => placePill(pill));
  }

  function onViewShown(view, userInitiated) {
    refreshPills(true);
    redrawCharts(true);
    fitAll();
    if (viewHooks[view]) viewHooks[view]();
    document.title = view === "overview" ? BASE_TITLE : `${ROUTE_TITLES[view]} — MZ App`;
    if (userInitiated) {
      window.scrollTo(0, 0);
      const main = $("#main");
      if (main) main.focus({ preventScroll: true });
    }
  }

  function showView(view, options = {}) {
    if (!ROUTES.includes(view)) view = "overview";
    if (view === currentView) return;
    if (pendingSwap) pendingSwap();
    const prevEl = $(`#view-${currentView}`);
    const nextEl = $(`#view-${view}`);
    if (!prevEl || !nextEl) return;
    currentView = view;
    setActiveNav(view);
    if (options.updateHash !== false && location.hash !== `#${view}`) location.hash = view;
    let timer = 0;
    const swap = () => {
      window.clearTimeout(timer);
      pendingSwap = null;
      prevEl.hidden = true;
      prevEl.classList.remove("is-active", "is-leaving");
      nextEl.hidden = false;
      nextEl.classList.add("is-active"); // memicu @keyframes liquidViewIn
      onViewShown(view, true);
    };
    if (prefersReduced() || options.immediate) {
      swap();
    } else {
      prevEl.classList.add("is-leaving");
      pendingSwap = swap;
      timer = window.setTimeout(swap, 200);
    }
  }

  // ---- Dialog / bottom sheet (modal) ----
  const overlay = { el: null, lastFocus: null, onClose: null, origin: null };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (root) => (root ? $$(FOCUSABLE, root).filter((el) => el.getClientRects().length > 0) : []);

  // Panel proyek "mekar" dari kartu yang diketuk (clip-path)
  function morphPanel(opening, origin, done) {
    const panel = $("#project-panel");
    const full = "inset(0px 0px 0px 0px round 28px)";
    if (!panel || prefersReduced() || !origin || !origin.isConnected || !panel.animate) {
      if (done) done();
      return;
    }
    const m = panel.getBoundingClientRect();
    const o = origin.getBoundingClientRect();
    if (!o.width || !o.height || !m.width) {
      if (done) done();
      return;
    }
    const radius = parseFloat(getComputedStyle(origin).borderTopLeftRadius) || 20;
    const from = `inset(${Math.max(0, o.top - m.top)}px ${Math.max(0, m.right - o.right)}px ${Math.max(0, m.bottom - o.bottom)}px ${Math.max(0, o.left - m.left)}px round ${radius}px)`;
    const anim = panel.animate(opening ? [{ clipPath: from }, { clipPath: full }] : [{ clipPath: full }, { clipPath: from }], {
      duration: opening ? 520 : 320,
      easing: opening ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: opening ? "none" : "both",
    });
    anim.onfinish = () => {
      if (done) done();
    };
  }

  function openOverlay(id, options = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    if (overlay.el) closeOverlay({ immediate: true, restore: false });
    overlay.el = el;
    overlay.lastFocus = options.returnFocus || document.activeElement;
    overlay.origin = options.origin || null;
    overlay.onClose = options.onClose || null;
    const openingPanel = $(".panel", el);
    if (openingPanel && openingPanel.getAnimations) openingPanel.getAnimations().forEach((animation) => animation.cancel()); // sisa animasi tutup sebelumnya
    el.hidden = false;
    el.classList.remove("is-closing");
    void el.offsetWidth;
    el.classList.add("is-open");
    document.body.classList.add("no-scroll");
    if (id === "modal-project") morphPanel(true, overlay.origin);
    window.setTimeout(() => {
      if (overlay.el !== el) return;
      const target = options.focus ? $(options.focus, el) : focusables($(".panel", el))[0];
      if (target) target.focus({ preventScroll: true });
    }, 80);
    requestAnimationFrame(() => refreshPills(true));
  }

  function closeOverlay(options = {}) {
    const el = overlay.el;
    if (!el) return;
    const { lastFocus, onClose, origin } = overlay;
    const restore = options.restore !== false;
    overlay.el = null;
    overlay.onClose = null;
    overlay.origin = null;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (overlay.el === el) return; // sudah dibuka lagi sebelum animasi tutup selesai
      el.hidden = true;
      el.classList.remove("is-open", "is-closing");
      const panel = $(".panel", el);
      if (panel && panel.getAnimations) panel.getAnimations().forEach((animation) => animation.cancel());
      if (!overlay.el) {
        document.body.classList.remove("no-scroll");
        if (restore && lastFocus && lastFocus.isConnected && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      }
    };
    if (typeof onClose === "function") onClose();
    if (options.immediate || prefersReduced()) {
      finish();
      return;
    }
    el.classList.add("is-closing");
    if (el.id === "modal-project") morphPanel(false, origin, finish);
    // cadangan berbasis timer: panel tidak mungkin tersangkut walau frame animasi tertunda
    window.setTimeout(finish, el.id === "modal-project" ? 420 : 240);
  }

  function setupOverlays() {
    document.addEventListener("click", (event) => {
      if (!overlay.el) return;
      if (event.target === overlay.el) closeOverlay();
      else if (event.target.closest("[data-close]") && overlay.el.contains(event.target)) closeOverlay();
    });
    document.addEventListener("keydown", (event) => {
      if (!overlay.el) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeOverlay();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables($(".panel", overlay.el));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!overlay.el.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  // Dialog konfirmasi kaca cair (pengganti confirm()) → Promise (nilai aksi, atau null bila ditutup)
  function confirmDialog({ title, text, actions }) {
    return new Promise((resolve) => {
      const titleEl = $("#confirm-title");
      const textEl = $("#confirm-text");
      const wrap = $("#confirm-actions");
      if (!titleEl || !textEl || !wrap) {
        resolve(null);
        return;
      }
      titleEl.textContent = title;
      textEl.textContent = text;
      wrap.innerHTML = "";
      let settled = false;
      const settle = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
      actions.forEach((action) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `btn ${action.kind === "primary" ? "btn-blue" : action.kind === "danger" ? "btn-cobalt" : "btn-outline"}`;
        btn.textContent = action.label;
        btn.addEventListener("click", () => {
          settle(action.value);
          closeOverlay();
        });
        wrap.appendChild(btn);
      });
      openOverlay("modal-confirm", { onClose: () => settle(null), focus: ".confirm-actions .btn" });
    });
  }

  // ---- Cursor specular glow: kilau radial biru langit mengikuti kursor ----
  function setupGlow() {
    let frame = 0;
    let last = null;
    document.addEventListener(
      "mousemove",
      (event) => {
        last = event;
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          if (!last || !last.target || !last.target.closest) return;
          let node = last.target.closest(".liquid-glass, .liquid-glass-blue");
          let depth = 0;
          while (node && depth < 3) {
            const rect = node.getBoundingClientRect();
            node.style.setProperty("--mx", `${Math.round(last.clientX - rect.left)}px`);
            node.style.setProperty("--my", `${Math.round(last.clientY - rect.top)}px`);
            node = node.parentElement ? node.parentElement.closest(".liquid-glass, .liquid-glass-blue") : null;
            depth++;
          }
        });
      },
      { passive: true },
    );
  }

  /* ======================================================================
     5. FINANCE ENGINE — kalkulasi, transaksi, KPI, riwayat, target
     ====================================================================== */
  const sumType = (list, type) => list.reduce((sum, t) => (t.type === type ? sum + t.amount : sum), 0);
  const countType = (list, type) => list.reduce((n, t) => (t.type === type ? n + 1 : n), 0);
  const totalsOf = (list) => {
    const income = sumType(list, "income");
    const expense = sumType(list, "expense");
    return { income, expense, net: income - expense };
  };
  const sortedTx = () => state.tx.slice().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  const txToday = () => state.tx.filter((t) => t.date === todayISO());
  // Rasio Tabungan = Math.round((Saldo / Pemasukan) * 100) — aman saat pemasukan 0, dibatasi 0–100
  const savingRatio = (income, net) => (income > 0 ? clamp(Math.round((net / income) * 100), 0, 100) : 0);
  const balance = () => totalsOf(state.tx).net;
  const goalPercent = () => {
    const target = state.goal.targetAmount;
    if (!(target > 0)) return 0;
    return clamp(Math.round((Math.max(0, balance()) / target) * 100), 0, 100);
  };

  function dailySeries(days) {
    const end = todayISO();
    const map = new Map();
    for (let i = days - 1; i >= 0; i--) map.set(shiftISO(end, -i), { date: shiftISO(end, -i), income: 0, expense: 0 });
    state.tx.forEach((t) => {
      const slot = map.get(t.date);
      if (slot) slot[t.type] += t.amount;
    });
    return Array.from(map.values());
  }

  function categoryTotals(list, type) {
    const map = new Map();
    list.forEach((t) => {
      if (t.type !== type) return;
      const slot = map.get(t.category) || { category: t.category, value: 0, count: 0 };
      slot.value += t.amount;
      slot.count += 1;
      map.set(t.category, slot);
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }

  const listeners = new Set();
  const onData = (fn) => listeners.add(fn);
  const emitData = () => listeners.forEach((fn) => fn());

  function addTx(data) {
    const tx = sanitizeTx({ ...data, id: uid(), createdAt: Date.now() });
    if (!tx) return null;
    state.tx.push(tx);
    saveTx();
    emitData();
    return tx;
  }

  function removeTx(id) {
    const index = state.tx.findIndex((t) => t.id === id);
    if (index < 0) return null;
    const [removed] = state.tx.splice(index, 1);
    saveTx();
    emitData();
    return removed;
  }

  function restoreTx(tx) {
    if (!tx || state.tx.some((t) => t.id === tx.id)) return;
    state.tx.push(tx);
    saveTx();
    emitData();
  }

  function replaceTx(list) {
    state.tx = list;
    saveTx();
    emitData();
  }

  // ---- Tampilan angka: KPI, widget Overview, sidebar, target tabungan ----
  function setText(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    if (el.hasAttribute("data-fit")) fitText(el);
  }

  function emptyBlock(iconName, title, text) {
    return `<div class="empty"><span class="empty-ico">${icon(iconName, 26)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
  }

  function renderGreeting() {
    setText("greeting-word", greetingWord());
  }

  function renderKpis() {
    const t = totalsOf(state.tx);
    setText("kpi-balance", rupiah(t.net));
    setText("kpi-balance-note", t.net < 0 ? "Pengeluaran melebihi pemasukan" : "Pemasukan − Pengeluaran");
    setText("kpi-income", rupiah(t.income));
    setText("kpi-income-count", `${countType(state.tx, "income")} transaksi`);
    setText("kpi-expense", rupiah(t.expense));
    setText("kpi-expense-count", `${countType(state.tx, "expense")} transaksi`);
    setText("kpi-ratio", `${savingRatio(t.income, t.net)}%`);
  }

  function renderLive() {
    const all = totalsOf(state.tx);
    const today = totalsOf(txToday());
    setText("ov-balance", rupiah(all.net));
    setText("ov-income-today", rupiah(today.income));
    setText("ov-expense-today", rupiah(today.expense));
    setText("sb-balance", rupiah(all.net));
    setText("sb-balance-note", state.tx.length ? `${state.tx.length} transaksi tercatat` : "Belum ada transaksi");
  }

  function renderGoal() {
    const target = state.goal.targetAmount;
    const saved = Math.max(0, balance());
    const pct = goalPercent();
    setText("goal-title", state.goal.title);
    setText("goal-percent", `${pct}%`);
    setText("goal-saved", rupiah(Math.min(saved, MAX_AMOUNT)));
    setText("goal-target", rupiah(target));
    const fill = $("#goal-fill");
    if (fill) fill.style.setProperty("--p", `${pct}%`);
    const track = $("#goal-track");
    if (track) track.setAttribute("aria-valuenow", String(pct));
    let hint = "Mulai menabung dari pemasukan berikutnya.";
    if (pct >= 100) hint = "Target tercapai — kerja bagus!";
    else if (saved > 0) hint = `Sisa ${rupiah(Math.max(0, target - saved))} lagi menuju target.`;
    setText("goal-hint", hint);
  }

  /* ---- Input nominal Rupiah pintar: hanya digit, titik ribuan otomatis, posisi kursor terjaga ---- */
  function readAmount(input) {
    const raw = input.value;
    const caret = input.selectionStart == null ? raw.length : input.selectionStart;
    const digitsBefore = raw.slice(0, caret).replace(/\D/g, "").length;
    const digits = raw.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12);
    const formatted = digits ? groupDots(Number(digits)) : "";
    input.value = formatted;
    let pos = 0;
    let seen = 0;
    while (pos < formatted.length && seen < digitsBefore) {
      if (/\d/.test(formatted[pos])) seen++;
      pos++;
    }
    try {
      if (document.activeElement === input) input.setSelectionRange(pos, pos);
    } catch (error) {
      /* tipe input tidak mendukung */
    }
    return digits ? Number(digits) : 0;
  }

  /* ---- Form catat transaksi: satu cetakan dipakai di halaman Finance DAN di modal ---- */
  const txForms = {};

  function createTxForm(mount, prefix, options = {}) {
    const tpl = $("#tpl-tx-form");
    if (!mount || !tpl || !tpl.content.firstElementChild) return null;
    const form = tpl.content.firstElementChild.cloneNode(true);
    $$("[data-id]", form).forEach((el) => {
      el.id = `${prefix}-${el.dataset.id}`;
    });
    $$("[data-for]", form).forEach((el) => el.setAttribute("for", `${prefix}-${el.dataset.for}`));
    mount.appendChild(form);
    hydrateIcons(form);

    const f = { type: "expense", category: EXPENSE_CATS[0], amount: 0 };
    const amountEl = $('[data-id="amount"]', form);
    const noteEl = $('[data-id="note"]', form);
    const dateEl = $('[data-id="date"]', form);
    const clearBtn = $('[data-role="amount-clear"]', form);
    const chipsEl = $('[data-role="chips"]', form);
    const catsEl = $('[data-role="cats"]', form);
    const typeRoot = $('[data-role="type"]', form);
    const typePill = $('[data-role="type-pill"]', form);
    const fieldError = (name, message, input) => setError(`${prefix}-${name}-err`, message, input);

    const renderCats = () => {
      const list = f.type === "income" ? INCOME_CATS : EXPENSE_CATS;
      catsEl.dataset.type = f.type;
      catsEl.innerHTML = list
        .map((c) => {
          const on = c === f.category;
          return `<button type="button" role="radio" class="cat-pill${on ? " is-active" : ""}" aria-checked="${on}" tabindex="${on ? 0 : -1}" data-cat="${esc(c)}">${icon(CAT_ICONS[c] || "ellipsis", 16)}<span>${esc(c)}</span></button>`;
        })
        .join("");
    };

    const setType = (type) => {
      f.type = type;
      const list = type === "income" ? INCOME_CATS : EXPENSE_CATS;
      if (!list.includes(f.category)) f.category = list[0];
      renderCats();
    };

    const typeTabs = setupTabs(typeRoot, typePill, "type", "expense", setType);
    chipsEl.innerHTML = QUICK_CHIPS.map((c) => `<button type="button" class="chip tabular" data-add="${c.value}">${c.label}</button>`).join("");

    amountEl.addEventListener("input", () => {
      f.amount = readAmount(amountEl);
      clearBtn.hidden = !(f.amount > 0);
      fieldError("amount", "", amountEl);
    });
    clearBtn.addEventListener("click", () => {
      f.amount = 0;
      amountEl.value = "";
      clearBtn.hidden = true;
      amountEl.focus();
    });
    chipsEl.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-add]");
      if (!chip) return;
      f.amount = Math.min(MAX_AMOUNT, f.amount + Number(chip.dataset.add));
      amountEl.value = groupDots(f.amount);
      clearBtn.hidden = !(f.amount > 0);
      fieldError("amount", "", amountEl);
    });
    catsEl.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-cat]");
      if (!btn) return;
      f.category = btn.dataset.cat;
      renderCats();
      const active = $(".cat-pill.is-active", catsEl);
      if (active) active.focus();
    });
    catsEl.addEventListener("keydown", (event) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!dir) return;
      event.preventDefault();
      const buttons = $$(".cat-pill", catsEl);
      const index = Math.max(0, buttons.findIndex((b) => b.classList.contains("is-active")));
      f.category = buttons[(index + dir + buttons.length) % buttons.length].dataset.cat;
      renderCats();
      const active = $(".cat-pill.is-active", catsEl);
      if (active) active.focus();
    });
    dateEl.addEventListener("input", () => fieldError("date", "", dateEl));

    const api = {
      reset(type, keepCategory) {
        f.amount = 0;
        amountEl.value = "";
        noteEl.value = "";
        clearBtn.hidden = true;
        dateEl.max = todayISO();
        dateEl.value = todayISO();
        const nextType = type || f.type;
        const previousCategory = f.category;
        f.type = nextType;
        f.category = keepCategory && (nextType === "income" ? INCOME_CATS : EXPENSE_CATS).includes(previousCategory) ? previousCategory : (nextType === "income" ? INCOME_CATS : EXPENSE_CATS)[0];
        if (typeTabs) typeTabs.select(nextType, true);
        renderCats();
        fieldError("amount", "", amountEl);
        fieldError("date", "", dateEl);
      },
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const amount = readAmount(amountEl);
      f.amount = amount;
      const date = dateEl.value;
      let amountError = "";
      let dateError = "";
      if (!(amount > 0)) amountError = "Masukkan nominal lebih dari Rp 0.";
      if (!isValidISO(date)) dateError = "Pilih tanggal yang valid.";
      else if (date > todayISO()) dateError = "Tanggal tidak boleh melewati hari ini.";
      fieldError("amount", amountError, amountEl);
      fieldError("date", dateError, dateEl);
      if (amountError) {
        amountEl.focus();
        return;
      }
      if (dateError) {
        dateEl.focus();
        return;
      }
      const title = noteEl.value.trim().slice(0, 60) || f.category;
      const saved = addTx({ type: f.type, amount, category: f.category, title, date });
      if (!saved) {
        toast("Transaksi tidak bisa disimpan. Periksa kembali isiannya.", { tone: "info" });
        return;
      }
      api.reset(f.type, true);
      toast(`${saved.type === "income" ? "Pemasukan" : "Pengeluaran"} ${signedRupiah(saved.type, saved.amount)} tersimpan`);
      if (options.onSaved) options.onSaved(saved);
    });

    api.reset("expense", false);
    return api;
  }

  function openTxModal(origin) {
    if (txForms.modal) txForms.modal.reset("expense", false);
    openOverlay("modal-tx", { focus: "#tx-modal-amount", origin });
  }

  /* ---- Target tabungan ---- */
  function openGoalModal() {
    const nameEl = $("#goal-name");
    const amountEl = $("#goal-amount");
    if (!nameEl || !amountEl) return;
    nameEl.value = state.goal.title;
    amountEl.value = groupDots(state.goal.targetAmount);
    setError("goal-name-err", "", nameEl);
    setError("goal-amount-err", "", amountEl);
    openOverlay("modal-goal", { focus: "#goal-name" });
  }

  function setupGoal() {
    const editBtn = $("#goal-edit");
    const form = $("#goal-form");
    const nameEl = $("#goal-name");
    const amountEl = $("#goal-amount");
    if (!editBtn || !form || !nameEl || !amountEl) return;
    editBtn.addEventListener("click", openGoalModal);
    amountEl.addEventListener("input", () => {
      readAmount(amountEl);
      setError("goal-amount-err", "", amountEl);
    });
    nameEl.addEventListener("input", () => setError("goal-name-err", "", nameEl));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = nameEl.value.trim();
      const amount = readAmount(amountEl);
      const titleError = title.length < 2 ? "Tulis nama target (minimal 2 karakter)." : "";
      const amountError = amount > 0 ? "" : "Masukkan nominal target lebih dari Rp 0.";
      setError("goal-name-err", titleError, nameEl);
      setError("goal-amount-err", amountError, amountEl);
      if (titleError) {
        nameEl.focus();
        return;
      }
      if (amountError) {
        amountEl.focus();
        return;
      }
      state.goal = { title: title.slice(0, 50), targetAmount: amount };
      saveGoal();
      emitData();
      closeOverlay();
      toast("Target tabungan diperbarui");
    });
  }

  /* ---- Riwayat transaksi: filter pil, pencarian real-time, hapus, Export CSV, reset ---- */
  const hist = { q: "", type: "all", known: new Set(), firstRender: true };

  function filteredTx() {
    const q = hist.q.trim().toLowerCase();
    return sortedTx().filter((t) => {
      if (hist.type !== "all" && t.type !== hist.type) return false;
      if (!q) return true;
      return `${t.title} ${t.category} ${t.amount} ${groupDots(t.amount)}`.toLowerCase().includes(q);
    });
  }

  function shorten(text, max = 28) {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }

  function txRow(t, isNew) {
    const today = todayISO();
    const when = t.date === today ? "Hari ini" : t.date === shiftISO(today, -1) ? "Kemarin" : fmtShort(t.date);
    const time = toISO(new Date(t.createdAt)) === t.date ? `, ${fmtTime(t.createdAt)}` : "";
    const arrow = t.type === "income" ? "arrow-up-right" : "arrow-down-right";
    return `<li class="tx${isNew ? " is-new" : ""}" data-id="${esc(t.id)}">
      <span class="tx-ico ${t.type}">${icon(CAT_ICONS[t.category] || "ellipsis", 20)}</span>
      <div class="tx-main"><p class="tx-title">${esc(t.title)}</p><p class="tx-meta"><span>${esc(t.category)}</span><span class="tx-dot"> · </span><span>${esc(when)}${esc(time)}</span></p></div>
      <div class="tx-side">
        <span class="tx-amount ${t.type} tabular">${icon(arrow, 14, 2.5)}${signedRupiah(t.type, t.amount)}</span>
        <button type="button" class="tx-del" data-del="${esc(t.id)}" aria-label="Hapus transaksi ${esc(t.title)}">${icon("trash-2", 14, 2)}<span>Hapus</span></button>
      </div>
    </li>`;
  }

  function renderHistory() {
    const list = $("#history-list");
    const countEl = $("#history-count");
    if (!list) return;
    const items = filteredTx();
    if (countEl) countEl.textContent = items.length === state.tx.length ? `${state.tx.length} transaksi` : `${items.length} dari ${state.tx.length} transaksi`;
    if (!items.length) {
      list.innerHTML = state.tx.length
        ? `<li>${emptyBlock("search", "Tidak ada hasil", "Coba kata kunci atau filter lain.")}</li>`
        : `<li>${emptyBlock("wallet", "Belum ada transaksi", "Catat pemasukan atau pengeluaran pertamamu lewat formulir di atas.")}</li>`;
    } else {
      list.innerHTML = items.map((t) => txRow(t, !hist.firstRender && !hist.known.has(t.id))).join("");
    }
    hist.known = new Set(state.tx.map((t) => t.id));
    hist.firstRender = false;
  }

  function handleDelete(id) {
    const row = $$("#history-list .tx").find((el) => el.dataset.id === id);
    if (row && row.classList.contains("is-leaving")) return;
    const commit = () => {
      const removed = removeTx(id);
      if (!removed) return;
      toast(`“${shorten(removed.title)}” dihapus`, {
        action: {
          label: "Urungkan",
          onClick: () => {
            restoreTx(removed);
            toast("Transaksi dikembalikan");
          },
        },
      });
    };
    if (row && !prefersReduced()) {
      row.classList.add("is-leaving");
      window.setTimeout(commit, 260);
    } else {
      commit();
    }
  }

  function downloadFile(filename, mime, content) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function csvText(value) {
    let s = String(value);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // cegah injeksi rumus saat dibuka di Excel / Sheets
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function exportCsv() {
    if (!state.tx.length) {
      toast("Belum ada transaksi untuk diekspor.", { tone: "info" });
      return;
    }
    const rows = [["Tanggal", "Jenis", "Kategori", "Catatan", "Nominal (Rp)", "Dicatat Pada"]];
    sortedTx().forEach((t) => {
      rows.push([t.date, t.type === "income" ? "Pemasukan" : "Pengeluaran", csvText(t.category), csvText(t.title), String(t.amount), `${toISO(new Date(t.createdAt))} ${fmtTime(t.createdAt)}`]);
    });
    const body = rows.map((r) => r.join(",")).join("\r\n");
    downloadFile(`mz-keuangan-${todayISO()}.csv`, "text/csv;charset=utf-8", `﻿${body}\r\n`);
    toast(`${state.tx.length} transaksi diekspor ke CSV`);
  }

  async function handleReset() {
    const goalIsDefault = state.goal.title === DEFAULT_GOAL.title && state.goal.targetAmount === DEFAULT_GOAL.targetAmount;
    if (!state.tx.length && goalIsDefault) {
      toast("Catatan keuangan sudah kosong (Rp 0)", { tone: "info" });
      return;
    }
    const choice = await confirmDialog({
      title: "Reset Semua Data ke 0?",
      text: "Semua transaksi akan dihapus sehingga saldo, pemasukan, dan pengeluaran kembali Rp 0, dan target tabungan kembali ke bawaan. Kamu masih bisa mengurungkannya sesaat setelah itu — atau Export CSV dulu untuk berjaga-jaga.",
      actions: [
        { label: "Ya, Reset ke 0", value: "reset", kind: "primary" },
        { label: "Batal", value: null, kind: "ghost" },
      ],
    });
    if (choice !== "reset") return;
    const beforeTx = state.tx.slice();
    const beforeGoal = { ...state.goal };
    state.goal = { ...DEFAULT_GOAL };
    saveGoal();
    replaceTx([]);
    toast("Semua data direset ke 0", {
      action: {
        label: "Urungkan",
        onClick: () => {
          state.goal = beforeGoal;
          saveGoal();
          replaceTx(beforeTx);
          toast("Data dikembalikan");
        },
      },
    });
  }

  function setupFinance() {
    txForms.inline = createTxForm($("#tx-inline-mount"), "tx-inline", {});
    txForms.modal = createTxForm($("#tx-modal-mount"), "tx-modal", { onSaved: () => closeOverlay() });
    setupGoal();

    setupTabs($("#history-filter"), $("#history-filter-pill"), "type", "all", (value) => {
      hist.type = value;
      renderHistory();
    });
    const searchEl = $("#history-search");
    if (searchEl) {
      searchEl.addEventListener("input", () => {
        hist.q = searchEl.value;
        renderHistory();
      });
    }
    const list = $("#history-list");
    if (list) {
      list.addEventListener("click", (event) => {
        const del = event.target.closest("[data-del]");
        if (del) handleDelete(del.dataset.del);
      });
    }
    const exportBtn = $("#export-csv");
    if (exportBtn) exportBtn.addEventListener("click", exportCsv);
    const resetBtn = $("#reset-data");
    if (resetBtn) resetBtn.addEventListener("click", handleReset);
  }

  /* ======================================================================
     6. CHARTS — grafik SVG buatan sendiri (bar harian & kategori, donat) + tooltip kaca
     ====================================================================== */
  let chartSeq = 0;
  const chartRegistry = new Map(); // elemen kontainer -> fungsi gambar(animate)
  let chartObserver = null;

  const r2 = (n) => Math.round(n * 100) / 100;

  function registerChart(box, draw) {
    chartRegistry.set(box, draw);
    if (chartObserver) chartObserver.observe(box);
  }
  const drawChart = (box, animate) => {
    const fn = chartRegistry.get(box);
    if (fn) fn(animate);
  };
  const redrawCharts = (animate) => chartRegistry.forEach((fn) => fn(animate));
  function setupChartObserver() {
    if (!("ResizeObserver" in window)) return;
    chartObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const box = entry.target;
        const width = Math.round(entry.contentRect.width);
        if (width > 0 && box._w !== width) drawChart(box, false);
      });
    });
    chartRegistry.forEach((_, box) => chartObserver.observe(box));
  }

  // Kurva halus monotone (tidak pernah "overshoot" di bawah 0)
  function smoothPath(pts) {
    const n = pts.length;
    if (!n) return "";
    if (n === 1) return `M${r2(pts[0].x)} ${r2(pts[0].y)}`;
    const dx = [];
    const m = [];
    for (let i = 0; i < n - 1; i++) {
      dx[i] = pts[i + 1].x - pts[i].x;
      m[i] = (pts[i + 1].y - pts[i].y) / dx[i];
    }
    const t = new Array(n).fill(0);
    t[0] = m[0];
    t[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) {
        t[i] = 0;
        t[i + 1] = 0;
        continue;
      }
      const a = t[i] / m[i];
      const b = t[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const k = 3 / Math.sqrt(s);
        t[i] = k * a * m[i];
        t[i + 1] = k * b * m[i];
      }
    }
    let d = `M${r2(pts[0].x)} ${r2(pts[0].y)}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += ` C${r2(pts[i].x + h)} ${r2(pts[i].y + t[i] * h)} ${r2(pts[i + 1].x - h)} ${r2(pts[i + 1].y - t[i + 1] * h)} ${r2(pts[i + 1].x)} ${r2(pts[i + 1].y)}`;
    }
    return d;
  }

  function niceTop(maxVal) {
    if (!(maxVal > 0)) return 100000;
    const exp = Math.pow(10, Math.floor(Math.log10(maxVal)));
    const f = maxVal / exp;
    const step = [1, 2, 4, 6, 8, 10].find((s) => f <= s + 1e-9) || 10;
    return step * exp;
  }

  // Tooltip kaca: dipasang di dalam kontainer grafik
  function placeTip(box, tip, html, x, y) {
    tip.innerHTML = html;
    tip.hidden = false;
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const W = box.clientWidth;
    const H = box.clientHeight;
    let left = x + 16;
    if (left + tw > W - 2) left = x - tw - 16;
    left = clamp(left, 2, Math.max(2, W - tw - 2));
    const top = clamp(y - th / 2, 2, Math.max(2, H - th - 2));
    tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  }

  // Interaksi bersama: hover/sentuh (pointer) + keyboard (panah) → indeks aktif
  function bindChartPointer(box, svgEl, count, xAt, show, clear) {
    let active = -1;
    let hideTimer = 0;
    const idxFromX = (px) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < count; i++) {
        const dist = Math.abs(xAt(i) - px);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    };
    const activate = (i, py) => {
      active = i;
      show(i, py);
    };
    const reset = () => {
      active = -1;
      clear();
    };
    const fromEvent = (event) => {
      window.clearTimeout(hideTimer);
      const rect = svgEl.getBoundingClientRect();
      activate(idxFromX(event.clientX - rect.left), event.clientY - rect.top);
    };
    svgEl.addEventListener("pointermove", fromEvent);
    svgEl.addEventListener("pointerdown", fromEvent);
    svgEl.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch" || event.pointerType === "pen") hideTimer = window.setTimeout(reset, 1800);
      else reset();
    });
    box.onkeydown = (event) => {
      if (!count) return;
      const keys = { ArrowRight: 1, ArrowLeft: -1 };
      if (event.key in keys) {
        event.preventDefault();
        activate(clamp((active < 0 ? count - 1 : active) + keys[event.key], 0, count - 1), box.clientHeight / 2);
      } else if (event.key === "Home") {
        event.preventDefault();
        activate(0, box.clientHeight / 2);
      } else if (event.key === "End") {
        event.preventDefault();
        activate(count - 1, box.clientHeight / 2);
      } else if (event.key === "Escape") reset();
    };
    box.onfocus = () => {
      if (count && active < 0 && box.matches(":focus-visible")) activate(count - 1, box.clientHeight / 2);
    };
    box.onblur = reset;
  }

  const wipeIn = (el, animate) => {
    if (!animate || prefersReduced() || !el.animate) return;
    el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 950, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  };

  /* ---- Bar chart (harian berpasangan & per kategori) ---- */
  function barPath(x, y0, w, h, r) {
    const rr = Math.min(r, w / 2, h);
    return `M${r2(x)} ${r2(y0)}V${r2(y0 - h + rr)}Q${r2(x)} ${r2(y0 - h)} ${r2(x + rr)} ${r2(y0 - h)}H${r2(x + w - rr)}Q${r2(x + w)} ${r2(y0 - h)} ${r2(x + w)} ${r2(y0 - h + rr)}V${r2(y0)}Z`;
  }

  function barChart(box, groups, opts, animate) {
    const W = box.clientWidth;
    const H = box.clientHeight;
    if (!W || !H) return;
    box._w = W;
    const n = groups.length;
    const slotMin = n ? (W - 58) / n : 99;
    const rotate = opts.mode === "category" && slotMin < 60;
    const padL = 46;
    const padR = 12;
    const padT = 14;
    const padB = rotate ? 56 : 30;
    const iw = Math.max(10, W - padL - padR);
    const ih = Math.max(10, H - padT - padB);
    const maxVal = Math.max(0, ...groups.flatMap((g) => g.bars.map((b) => b.value)));
    const top = niceTop(maxVal);
    const empty = maxVal === 0 || n === 0;
    const y = (v) => padT + ih - (v / top) * ih;
    const base = y(0);
    const slot = iw / Math.max(1, n);
    const per = n ? groups[0].bars.length : 1;
    const gap = per > 1 ? 2 : 0;
    const groupW = Math.min(slot * 0.76, per > 1 ? 48 : 44);
    const barW = Math.max(2.5, (groupW - gap * (per - 1)) / per);
    const realW = barW * per + gap * (per - 1);
    const cx = (i) => padL + slot * i + slot / 2;
    const id = ++chartSeq;

    let grid = "";
    for (let i = 0; i <= 4; i++) {
      const v = (top * i) / 4;
      const yy = r2(y(v));
      grid += `<line class="${i === 0 ? "base-line" : "grid-line"}" x1="${padL}" x2="${W - padR}" y1="${yy}" y2="${yy}"/><text class="axis-text" x="${padL - 8}" y="${yy + 3.5}" text-anchor="end">${axisLabel(v)}</text>`;
    }

    let bars = "";
    let bgs = "";
    let xl = "";
    const maxLabels = Math.max(2, Math.floor(iw / 46));
    const step = opts.mode === "category" ? 1 : Math.ceil(n / maxLabels);
    groups.forEach((g, i) => {
      bgs += `<rect class="bar-bg" data-i="${i}" x="${r2(padL + slot * i + 1)}" y="${padT}" width="${r2(slot - 2)}" height="${r2(ih)}" rx="10"/>`;
      g.bars.forEach((b, j) => {
        if (!(b.value > 0)) return;
        const h = Math.max(3, (b.value / top) * ih);
        const bx = cx(i) - realW / 2 + j * (barW + gap);
        const fill = b.kind === "income" ? `url(#bi${id})` : `url(#be${id})`;
        bars += `<path class="bar-shape" data-i="${i}" style="--k:${i}" d="${barPath(bx, base, barW, h, Math.min(5, barW / 2))}" fill="${fill}"/>`;
      });
      if ((n - 1 - i) % step !== 0) return;
      if (rotate) xl += `<text class="axis-text" x="${r2(cx(i) + 4)}" y="${r2(base + 14)}" text-anchor="end" transform="rotate(-32 ${r2(cx(i) + 4)} ${r2(base + 14)})">${esc(g.label)}</text>`;
      else xl += `<text class="axis-text" x="${r2(cx(i))}" y="${H - 8}" text-anchor="middle">${esc(g.label)}</text>`;
    });

    const emptyText = empty ? `<text class="chart-empty-text" x="${r2(padL + iw / 2)}" y="${r2(padT + ih / 2)}">${esc(opts.emptyText)}</text>` : "";
    box.innerHTML = `<svg class="chart-svg${animate && !prefersReduced() ? " chart-anim" : ""}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(opts.ariaLabel)}">
      <defs>
        <linearGradient id="bi${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#007BFF"/></linearGradient>
        <linearGradient id="be${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E3A8A"/><stop offset="1" stop-color="#0F2C7A"/></linearGradient>
      </defs>
      ${grid}${bgs}${xl}${bars}${emptyText}
      <rect class="hit-rect" x="${padL}" y="0" width="${r2(iw)}" height="${H}"/>
    </svg><div class="chart-tip liquid-glass" hidden></div>`;

    const svgEl = box.firstElementChild;
    const tip = box.lastElementChild;
    const clearTip = () => {
      tip.hidden = true;
      $$(".bar-bg", svgEl).forEach((el) => el.classList.remove("is-on"));
      $$(".bar-shape", svgEl).forEach((el) => el.classList.remove("is-dim"));
    };
    if (!empty) {
      bindChartPointer(
        box,
        svgEl,
        n,
        cx,
        (i, py) => {
          clearTip();
          const bg = $(`.bar-bg[data-i="${i}"]`, svgEl);
          if (bg) bg.classList.add("is-on");
          $$(".bar-shape", svgEl).forEach((el) => el.classList.toggle("is-dim", Number(el.dataset.i) !== i));
          placeTip(box, tip, groups[i].tip, cx(i), py);
        },
        clearTip,
      );
    } else {
      box.onkeydown = null;
      box.onfocus = null;
      box.onblur = null;
    }
  }

  /* ---- Donat: rasio dana tersimpan vs terpakai (persentase tersimpan di tengah) ---- */
  function donutChart(box, legendEl, segments, center, animate) {
    box._w = box.clientWidth;
    const total = segments.reduce((sum, g) => sum + g.value, 0);
    const R = 74;
    const SW = 24;
    segments.forEach((g) => {
      g.pct = total > 0 ? (g.value / total) * 100 : 0;
    });
    // persentase bulat dengan metode "sisa terbesar" agar jumlahnya selalu tepat 100%
    const shown = segments.map((g) => Math.floor(g.pct));
    let leftover = total > 0 ? 100 - shown.reduce((sum, n) => sum + n, 0) : 0;
    segments
      .map((g, i) => ({ i, rest: g.pct - Math.floor(g.pct) }))
      .sort((a, b) => b.rest - a.rest)
      .forEach(({ i }) => {
        if (leftover > 0 && segments[i].value > 0) {
          shown[i] += 1;
          leftover -= 1;
        }
      });
    segments.forEach((g, i) => {
      g.shown = shown[i];
    });
    const live = segments.map((g, i) => ({ g, i })).filter((item) => item.g.value > 0);
    const gap = live.length > 1 ? 1.2 : 0;
    let acc = 0;
    let arcs = "";
    live.forEach(({ g, i }) => {
      g.len = Math.max(0.2, g.pct - gap);
      arcs += `<circle class="donut-seg" data-i="${i}" cx="100" cy="100" r="${R}" pathLength="100" stroke="${g.color}" stroke-width="${SW}" stroke-dasharray="${r2(g.len)} ${r2(100 - g.len)}" stroke-dashoffset="${r2(-(acc + gap / 2))}" transform="rotate(-90 100 100)"/>`;
      acc += g.pct;
    });
    const label = total > 0
      ? `Rasio keuangan: ${segments.map((g) => `${g.label} ${g.shown} persen`).join(", ")}.`
      : "Belum ada pemasukan, rasio keuangan belum bisa dihitung.";
    box.innerHTML = `<svg class="donut-svg" viewBox="0 0 200 200" role="img" aria-label="${esc(label)}">
      <circle class="donut-ring" cx="100" cy="100" r="${R}" stroke-width="${SW}"/>
      ${arcs}
      <text class="donut-main" x="100" y="106">${esc(center.main)}</text>
      <text class="donut-sub" x="100" y="126">${esc(center.sub)}</text>
    </svg>`;

    const svgEl = box.firstElementChild;
    const mainEl = $(".donut-main", svgEl);
    const subEl = $(".donut-sub", svgEl);
    const segEls = $$(".donut-seg", svgEl);
    legendEl.innerHTML = total > 0
      ? segments
          .map(
            (g, i) => `<li data-i="${i}"><i style="background:${g.color}"></i><span class="dl-name">${esc(g.label)}</span><span class="dl-val tabular">${rupiah(g.value)}</span><span class="dl-pct tabular">${g.shown}%</span></li>`,
          )
          .join("")
      : '<li class="legend-empty">Belum ada pemasukan pada transaksi.</li>';
    const legendItems = $$("li[data-i]", legendEl);

    const highlight = (index) => {
      segEls.forEach((el) => {
        const on = Number(el.dataset.i) === index;
        el.classList.toggle("is-on", on);
        el.classList.toggle("is-dim", index >= 0 && !on);
      });
      legendItems.forEach((el) => el.classList.toggle("is-on", Number(el.dataset.i) === index));
      if (index >= 0 && segments[index]) {
        mainEl.textContent = `${segments[index].shown}%`;
        subEl.textContent = segments[index].label.toLowerCase();
      } else {
        mainEl.textContent = center.main;
        subEl.textContent = center.sub;
      }
    };
    [...segEls, ...legendItems].forEach((el) => {
      el.addEventListener("pointerenter", () => highlight(Number(el.dataset.i)));
      el.addEventListener("pointerleave", () => highlight(-1));
    });

    if (animate && !prefersReduced() && box.clientWidth > 0) {
      segEls.forEach((el, order) => {
        const g = segments[Number(el.dataset.i)];
        el.animate([{ strokeDasharray: "0 100" }, { strokeDasharray: `${r2(g.len)} ${r2(100 - g.len)}` }], {
          duration: 850,
          delay: order * 90,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        });
      });
    }
  }

  /* ---- Pendaftaran grafik: dihancurkan & digambar ulang bersih (tanpa glitch) ---- */
  const chartState = { mode: "daily" };

  function setupCharts() {
    const cashBox = $("#chart-cashflow");
    const donutBox = $("#chart-donut");
    const legend = $("#donut-legend");

    if (cashBox) {
      registerChart(cashBox, (animate) => {
        if (chartState.mode === "daily") {
          const series = dailySeries(7);
          const groups = series.map((s) => ({
            label: DAYS_SHORT[fromISO(s.date).getDay()],
            bars: [{ value: s.income, kind: "income" }, { value: s.expense, kind: "expense" }],
            tip: `<div class="tip-title">${esc(fmtLong(s.date))}</div><div class="tip-row"><span><i class="income"></i>Pemasukan</span><b>${rupiah(s.income)}</b></div><div class="tip-row"><span><i class="expense"></i>Pengeluaran</span><b>${rupiah(s.expense)}</b></div>`,
          }));
          const t = totalsOf(dailySeries(7).reduce((list, s) => list.concat([{ type: "income", amount: s.income }, { type: "expense", amount: s.expense }]), []));
          barChart(
            cashBox,
            groups,
            { mode: "daily", emptyText: "Belum ada transaksi pada 7 hari terakhir", ariaLabel: `Grafik batang 7 hari terakhir. Total pemasukan ${rupiah(t.income)}, total pengeluaran ${rupiah(t.expense)}.` },
            animate,
          );
        } else {
          const items = [
            ...categoryTotals(state.tx, "income").map((c) => ({ ...c, kind: "income" })),
            ...categoryTotals(state.tx, "expense").map((c) => ({ ...c, kind: "expense" })),
          ]
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
          const groups = items.map((c) => ({
            label: CAT_SHORT[c.category] || c.category.slice(0, 10),
            bars: [{ value: c.value, kind: c.kind }],
            tip: `<div class="tip-title">${esc(c.category)}</div><div class="tip-row"><span><i class="${c.kind}"></i>${c.kind === "income" ? "Pemasukan" : "Pengeluaran"}</span><b>${rupiah(c.value)}</b></div><div class="tip-row"><span>Jumlah transaksi</span><b>${c.count}×</b></div>`,
          }));
          barChart(cashBox, groups, { mode: "category", emptyText: "Belum ada transaksi untuk dikelompokkan", ariaLabel: "Grafik batang total tiap kategori." }, animate);
        }
      });
    }

    if (donutBox && legend) {
      registerChart(donutBox, (animate) => {
        const t = totalsOf(state.tx);
        const saved = Math.max(0, t.net);
        const spent = Math.max(0, t.income - saved);
        donutChart(
          donutBox,
          legend,
          [
            { label: "Tersimpan", value: saved, color: "#007BFF" },
            { label: "Terpakai", value: spent, color: "#1E3A8A" },
          ],
          { main: `${savingRatio(t.income, t.net)}%`, sub: "tersimpan" },
          animate,
        );
      });
    }

    setupTabs($("#chart-tabs"), $("#chart-tabs-pill"), "mode", "daily", (value) => {
      chartState.mode = value;
      const sub = $("#chart-sub");
      if (sub) sub.textContent = value === "daily" ? "Pemasukan vs pengeluaran 7 hari terakhir" : "Total tiap kategori dari seluruh transaksi";
      if (cashBox) drawChart(cashBox, true);
    });
  }

  /* ======================================================================
     7. PROJECTS & MODALS — Overview, Karya, Profil, Kontak
     ====================================================================== */
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  // ---- Overview: Core Vibe Coding Stack (grid 3×2) ----
  function renderStack() {
    const grid = $("#stack-grid");
    if (!grid) return;
    grid.innerHTML = STACK.map((s) => `<li class="stack-tile"><span class="stack-ico">${icon(s.icon, 20, 2)}</span><span class="stack-name">${esc(s.name)}</span></li>`).join("");
  }

  // ---- Overview: Fokus Karya (3 batang vertikal, tab Skill | Jam) ----
  const focus = { mode: "skill" };

  function buildFocus() {
    const box = $("#focus-bars");
    if (!box) return;
    box.innerHTML = [0, 1, 2]
      .map(() => '<div class="fbar"><b class="fbar-val tabular"></b><span class="fbar-track"><span class="fbar-fill"></span></span><span class="fbar-name"></span></div>')
      .join("");
  }

  function renderFocus(mode, fromZero) {
    const box = $("#focus-bars");
    if (!box) return;
    const items = FOCUS[mode] || [];
    const max = Math.max(...items.map((item) => item.pct));
    $$(".fbar", box).forEach((el, i) => {
      const item = items[i];
      if (!item) return;
      el.classList.toggle("is-main", item.pct === max);
      const val = $(".fbar-val", el);
      const name = $(".fbar-name", el);
      const fill = $(".fbar-fill", el);
      if (val) val.textContent = item.value;
      if (name) name.textContent = item.label;
      if (!fill) return;
      if (fromZero) {
        fill.style.transition = "none";
        fill.style.setProperty("--h", "0%");
        void fill.offsetWidth;
        fill.style.transition = "";
      }
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => fill.style.setProperty("--h", `${item.pct}%`)));
    });
  }

  // ---- Overview: Streak Coding (24 tick yang membesar saat di-hover / disentuh) ----
  function setupStreak() {
    const box = $("#streak-ticks");
    if (!box) return;
    box.innerHTML = STREAK_HEIGHTS.map((h) => `<i class="tick" style="--h:${h}%"></i>`).join("");
    const ticks = $$(".tick", box);
    let centers = [];
    let pitch = 1;
    let pointerX = null;
    let frame = 0;
    const measure = () => {
      centers = ticks.map((tick) => {
        const r = tick.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      pitch = centers.length > 1 ? (centers[centers.length - 1] - centers[0]) / (centers.length - 1) : 1;
    };
    const apply = () => {
      frame = 0;
      ticks.forEach((tick, i) => {
        if (pointerX == null || !pitch) {
          tick.style.setProperty("--m", "1");
          return;
        }
        const d = Math.abs(pointerX - centers[i]) / pitch;
        tick.style.setProperty("--m", (1 + 0.85 * Math.exp(-(d * d) / 5.5)).toFixed(3));
      });
    };
    const move = (event) => {
      if (pointerX == null) measure();
      pointerX = event.clientX;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    const leave = () => {
      pointerX = null;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    box.addEventListener("pointerenter", move);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerdown", move);
    box.addEventListener("pointerleave", leave);
    box.addEventListener("pointerup", leave);
    box.addEventListener("pointercancel", leave);
  }

  // ---- Overview: kapsul "Sedang Membangun" (Play / Pause + waveform) ----
  function setupBuild() {
    const wave = $("#build-wave");
    const btn = $("#build-toggle");
    const iconEl = $("#build-toggle-icon");
    if (!wave || !btn) return;
    wave.innerHTML = Array.from({ length: 18 }, (_, i) => `<i class="wbar" style="--i:${i}"></i>`).join("");
    let playing = true;
    const apply = () => {
      wave.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-pressed", String(playing));
      btn.setAttribute("aria-label", playing ? "Jeda animasi pembangunan" : "Putar animasi pembangunan");
      if (iconEl) iconEl.innerHTML = icon(playing ? "pause" : "play", 20, 2.25);
    };
    btn.addEventListener("click", () => {
      playing = !playing;
      apply();
    });
    apply();
  }

  // ---- Overview: strip jadwal mingguan Sen–Min ----
  const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const mondayBasedToday = () => {
    const d = new Date().getDay();
    return d === 0 ? 7 : d;
  };

  function renderSchedule(day) {
    const data = SCHEDULE[day];
    const box = $("#schedule-detail");
    if (!data || !box) return;
    box.innerHTML = `
      <div class="sched-row is-school"><span class="sched-ico">${icon("graduation-cap", 20, 2)}</span><div class="sched-text"><small>Sekolah</small><b>${esc(data.school[0])}</b><p>${esc(data.school[1])}</p></div></div>
      <div class="sched-row"><span class="sched-ico">${icon("code-xml", 20, 2)}</span><div class="sched-text"><small>Sesi Vibe Coding</small><b>${esc(data.vibe[0])}</b><p>${esc(data.vibe[1])}</p></div></div>`;
  }

  function setupSchedule() {
    const root = $("#schedule-days");
    if (!root) return;
    const today = mondayBasedToday();
    const monday = shiftISO(todayISO(), -(today - 1));
    $$(".day-btn", root).forEach((btn) => {
      const n = Number(btn.dataset.day);
      const date = fromISO(shiftISO(monday, n - 1)).getDate();
      const b = $("b", btn);
      if (b) b.textContent = String(date);
      btn.classList.toggle("is-today", n === today);
      btn.setAttribute("aria-label", `${DAY_NAMES[n - 1]}, tanggal ${date}${n === today ? " (hari ini)" : ""}`);
    });
    setupTabs(root, $("#schedule-pill"), "day", String(today), (value) => renderSchedule(Number(value)), ".day-btn");
    renderSchedule(today);
  }

  // ---- Overview: Karya Pilihan (3 kartu → modal studi kasus) ----
  function renderFeatured() {
    const list = $("#featured-list");
    if (!list) return;
    list.innerHTML = PROJECTS.slice(0, 3)
      .map(
        (p) => `<li><button type="button" class="featured-item" data-project="${esc(p.id)}" aria-haspopup="dialog" aria-label="Buka studi kasus ${esc(p.title)}">
          <span class="featured-thumb">${projectVisual(p.visual)}</span>
          <span class="featured-text"><b>${esc(p.title)}</b><small>${esc(p.category)} · ${esc(p.year)}</small></span>
          <span class="featured-go">${icon("arrow-up-right", 16, 2.25)}</span>
        </button></li>`,
      )
      .join("");
  }

  // ---- Overview: tab Aktivitas & Target (Proyek | Belajar | Target) ----
  const activityState = { tab: "proyek" };

  function activityItem(index, iconName, title, sub, chip, progress) {
    const meter = progress != null ? `<span class="act-meter"><span style="--p:0%" data-p="${progress}"></span></span>` : "";
    const tail = progress != null ? `<span class="act-chip tabular">${progress}%</span>` : chip ? `<span class="act-chip">${esc(chip)}</span>` : "";
    return `<li class="act-item" style="--i:${index}"><span class="act-ico">${icon(iconName, 18, 2)}</span><div class="act-text"><b>${esc(title)}</b><small>${esc(sub)}</small>${meter}</div>${tail}</li>`;
  }

  function renderActivity() {
    const list = $("#activity-list");
    if (!list) return;
    const items = ACTIVITY[activityState.tab] || [];
    list.innerHTML = items
      .map((item, i) => {
        if (item.goal) return activityItem(i, item.icon, state.goal.title, `${rupiah(Math.max(0, balance()))} dari ${rupiah(state.goal.targetAmount)}`, "", goalPercent());
        return activityItem(i, item.icon, item.title, item.sub, item.chip, item.progress);
      })
      .join("");
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        $$(".act-meter span", list).forEach((el) => el.style.setProperty("--p", `${el.dataset.p}%`));
      }),
    );
  }

  function setupOverview() {
    renderStack();
    buildFocus();
    renderFocus(focus.mode, false);
    setupTabs($("#focus-tabs"), $("#focus-tabs-pill"), "mode", focus.mode, (value) => {
      focus.mode = value;
      renderFocus(value, false);
    });
    setupStreak();
    setupBuild();
    setupSchedule();
    renderFeatured();
    setupTabs($("#activity-tabs"), $("#activity-tabs-pill"), "tab", activityState.tab, (value) => {
      activityState.tab = value;
      renderActivity();
    });
    renderActivity();
    viewHooks.overview = () => renderFocus(focus.mode, true);
  }

  // ---- Thumbnail proyek: mockup SVG putih & biru (tanpa gambar eksternal) ----

  let visualSeq = 0;
  function projectVisual(variant) {
    const id = `pv${++visualSeq}`;
    const ac = `url(#ac-${id})`;
    const scenes = {
      finance: `<g>
        <rect x="22" y="50" width="66" height="84" rx="14" fill="#fff"/>
        <rect x="32" y="62" width="30" height="5" rx="2.5" fill="#0F2C7A"/>
        <rect x="32" y="112" width="8" height="12" rx="3" fill="#BFDBFE"/><rect x="44" y="102" width="8" height="22" rx="3" fill="#38BDF8"/>
        <rect x="56" y="92" width="8" height="32" rx="3" fill="#007BFF"/><rect x="68" y="106" width="8" height="18" rx="3" fill="#1E3A8A"/>
        <rect x="232" y="62" width="66" height="84" rx="14" fill="#fff"/>
        <circle cx="265" cy="96" r="16" fill="none" stroke="#DBEAFE" stroke-width="9"/>
        <circle cx="265" cy="96" r="16" fill="none" stroke="#007BFF" stroke-width="9" stroke-dasharray="58 43" transform="rotate(-90 265 96)"/>
        <circle cx="265" cy="96" r="16" fill="none" stroke="#1E3A8A" stroke-width="9" stroke-dasharray="20 81" stroke-dashoffset="-60" transform="rotate(-90 265 96)"/>
        <rect x="244" y="126" width="42" height="5" rx="2.5" fill="#BFDBFE"/>
        <rect x="100" y="12" width="120" height="176" rx="20" fill="#0F2C7A"/>
        <rect x="105" y="18" width="110" height="164" rx="15" fill="#fff"/>
        <rect x="105" y="18" width="110" height="62" rx="15" fill="${ac}"/>
        <rect x="115" y="30" width="34" height="5" rx="2.5" fill="#fff" opacity=".75"/>
        <rect x="115" y="41" width="62" height="12" rx="4" fill="#fff"/>
        <path d="M115 72 C128 62 136 68 150 60 S172 64 186 54 S202 56 207 48 L207 76 L115 76Z" fill="#fff" opacity=".3"/>
        <rect x="115" y="90" width="90" height="26" rx="10" fill="#EFF6FF"/>
        <circle cx="127" cy="103" r="6.5" fill="#0EA5E9"/><rect x="138" y="97" width="32" height="5" rx="2.5" fill="#0F2C7A"/><rect x="138" y="106" width="20" height="4" rx="2" fill="#93C5FD"/><rect x="178" y="100" width="19" height="6" rx="3" fill="#0EA5E9"/>
        <rect x="115" y="122" width="90" height="26" rx="10" fill="#EFF6FF"/>
        <circle cx="127" cy="135" r="6.5" fill="#1E3A8A"/><rect x="138" y="129" width="30" height="5" rx="2.5" fill="#0F2C7A"/><rect x="138" y="138" width="22" height="4" rx="2" fill="#93C5FD"/><rect x="178" y="132" width="19" height="6" rx="3" fill="#1E3A8A"/>
        <rect x="115" y="156" width="90" height="18" rx="9" fill="${ac}"/><rect x="150" y="163" width="20" height="4" rx="2" fill="#fff"/>
      </g>`,
      study: `<g>
        <rect x="74" y="44" width="196" height="124" rx="18" fill="#93C5FD" opacity=".55" transform="rotate(7 172 106)"/>
        <rect x="62" y="36" width="196" height="124" rx="18" fill="#DBEAFE" transform="rotate(-5 160 98)"/>
        <rect x="52" y="30" width="196" height="124" rx="18" fill="#fff"/>
        <rect x="52" y="30" width="196" height="34" rx="18" fill="${ac}"/>
        <rect x="52" y="48" width="196" height="16" fill="${ac}"/>
        <circle cx="76" cy="47" r="9" fill="#fff" opacity=".9"/>
        <path d="M76 41 l2.2 4.6 5 .7 -3.6 3.5 .9 5 -4.5 -2.4 -4.5 2.4 .9 -5 -3.6 -3.5 5 -.7z" fill="#007BFF"/>
        <rect x="94" y="42" width="72" height="9" rx="4.5" fill="#fff"/>
        <rect x="68" y="80" width="150" height="9" rx="4.5" fill="#0F2C7A"/>
        <rect x="68" y="98" width="164" height="7" rx="3.5" fill="#BFDBFE"/>
        <rect x="68" y="112" width="132" height="7" rx="3.5" fill="#BFDBFE"/>
        <rect x="68" y="126" width="84" height="16" rx="8" fill="#EFF6FF" stroke="#93C5FD"/>
        <rect x="160" y="126" width="64" height="16" rx="8" fill="${ac}"/>
        <rect x="258" y="118" width="40" height="52" rx="10" fill="#fff"/>
        <rect x="266" y="128" width="24" height="5" rx="2.5" fill="#0F2C7A"/><rect x="266" y="139" width="18" height="4" rx="2" fill="#BFDBFE"/><rect x="266" y="148" width="22" height="4" rx="2" fill="#BFDBFE"/>
      </g>`,
      kit: `<g>
        <rect x="26" y="22" width="268" height="156" rx="20" fill="#fff" opacity=".9"/>
        <rect x="42" y="38" width="86" height="28" rx="14" fill="${ac}"/><rect x="62" y="49" width="46" height="6" rx="3" fill="#fff"/>
        <rect x="138" y="38" width="86" height="28" rx="14" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.5"/><rect x="158" y="49" width="46" height="6" rx="3" fill="#007BFF"/>
        <rect x="236" y="42" width="44" height="22" rx="11" fill="#007BFF"/><circle cx="269" cy="53" r="8" fill="#fff"/>
        <rect x="42" y="80" width="150" height="30" rx="15" fill="#DBEAFE"/>
        <rect x="46" y="84" width="48" height="22" rx="11" fill="#fff"/><rect x="58" y="92" width="24" height="6" rx="3" fill="#007BFF"/>
        <rect x="104" y="92" width="26" height="6" rx="3" fill="#93C5FD"/><rect x="146" y="92" width="30" height="6" rx="3" fill="#93C5FD"/>
        <rect x="204" y="80" width="76" height="30" rx="10" fill="#fff" stroke="#BFDBFE" stroke-width="2"/><rect x="214" y="92" width="34" height="6" rx="3" fill="#BFDBFE"/>
        <rect x="42" y="126" width="118" height="38" rx="14" fill="#EFF6FF"/>
        <circle cx="62" cy="145" r="10" fill="${ac}"/><rect x="80" y="137" width="58" height="7" rx="3.5" fill="#0F2C7A"/><rect x="80" y="149" width="40" height="6" rx="3" fill="#93C5FD"/>
        <rect x="172" y="132" width="108" height="6" rx="3" fill="#DBEAFE"/><rect x="172" y="132" width="70" height="6" rx="3" fill="#007BFF"/><circle cx="242" cy="135" r="8" fill="#fff" stroke="#007BFF" stroke-width="3"/>
        <rect x="172" y="152" width="46" height="14" rx="7" fill="#1E3A8A"/><rect x="226" y="152" width="54" height="14" rx="7" fill="#38BDF8"/>
      </g>`,
      schedule: `<g>
        <rect x="26" y="20" width="268" height="160" rx="18" fill="#fff"/>
        <rect x="26" y="20" width="268" height="30" rx="18" fill="${ac}"/><rect x="26" y="36" width="268" height="14" fill="${ac}"/>
        <rect x="44" y="30" width="62" height="8" rx="4" fill="#fff"/>
        <g fill="#fff" opacity=".8"><rect x="132" y="31" width="22" height="6" rx="3"/><rect x="164" y="31" width="22" height="6" rx="3"/><rect x="196" y="31" width="22" height="6" rx="3"/><rect x="228" y="31" width="22" height="6" rx="3"/><rect x="260" y="31" width="22" height="6" rx="3"/></g>
        <g fill="#BFDBFE"><rect x="42" y="62" width="14" height="6" rx="3"/><rect x="42" y="92" width="14" height="6" rx="3"/><rect x="42" y="122" width="14" height="6" rx="3"/><rect x="42" y="152" width="14" height="6" rx="3"/></g>
        <rect x="70" y="58" width="48" height="24" rx="9" fill="#DBEAFE"/><rect x="126" y="58" width="48" height="24" rx="9" fill="#007BFF"/><rect x="182" y="58" width="48" height="24" rx="9" fill="#EFF6FF" stroke="#BFDBFE"/><rect x="238" y="58" width="44" height="24" rx="9" fill="#38BDF8"/>
        <rect x="70" y="88" width="48" height="24" rx="9" fill="#38BDF8"/><rect x="126" y="88" width="48" height="24" rx="9" fill="#EFF6FF" stroke="#BFDBFE"/><rect x="182" y="88" width="48" height="24" rx="9" fill="#1E3A8A"/><rect x="238" y="88" width="44" height="24" rx="9" fill="#DBEAFE"/>
        <rect x="70" y="118" width="48" height="24" rx="9" fill="#EFF6FF" stroke="#BFDBFE"/><rect x="126" y="118" width="48" height="24" rx="9" fill="#DBEAFE"/><rect x="182" y="118" width="48" height="24" rx="9" fill="#007BFF"/><rect x="238" y="118" width="44" height="24" rx="9" fill="#EFF6FF" stroke="#BFDBFE"/>
        <rect x="70" y="148" width="100" height="22" rx="11" fill="#EFF6FF"/><circle cx="82" cy="159" r="5" fill="#1E3A8A"/><rect x="94" y="156" width="60" height="6" rx="3" fill="#93C5FD"/>
        <rect x="182" y="148" width="100" height="22" rx="11" fill="${ac}"/><rect x="198" y="156" width="56" height="6" rx="3" fill="#fff"/>
      </g>`,
      prompt: `<g>
        <rect x="28" y="22" width="264" height="156" rx="18" fill="#0F2C7A"/>
        <circle cx="48" cy="38" r="4" fill="#38BDF8"/><circle cx="62" cy="38" r="4" fill="#007BFF"/><circle cx="76" cy="38" r="4" fill="#93C5FD"/>
        <rect x="92" y="32" width="96" height="12" rx="6" fill="#1D4ED8"/>
        <path d="M44 66 l-9 8 9 8" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="54" y="70" width="78" height="8" rx="4" fill="#38BDF8"/><rect x="140" y="70" width="52" height="8" rx="4" fill="#fff"/>
        <rect x="54" y="88" width="48" height="8" rx="4" fill="#93C5FD"/><rect x="110" y="88" width="92" height="8" rx="4" fill="#fff" opacity=".85"/>
        <rect x="54" y="106" width="122" height="8" rx="4" fill="#fff" opacity=".85"/><rect x="184" y="106" width="40" height="8" rx="4" fill="#38BDF8"/>
        <rect x="54" y="124" width="64" height="8" rx="4" fill="#93C5FD"/><rect x="126" y="124" width="70" height="8" rx="4" fill="#fff" opacity=".85"/>
        <rect x="44" y="146" width="62" height="20" rx="10" fill="${ac}"/><rect x="114" y="146" width="62" height="20" rx="10" fill="#1D4ED8"/><rect x="184" y="146" width="48" height="20" rx="10" fill="#1D4ED8"/>
        <rect x="226" y="56" width="52" height="46" rx="12" fill="#fff"/>
        <path d="M242 70 l-8 7 8 7 M262 70 l8 7 -8 7" fill="none" stroke="#007BFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="240" y="108" width="38" height="8" rx="4" fill="#BFDBFE"/>
      </g>`,
      timer: `<g>
        <rect x="26" y="20" width="268" height="160" rx="22" fill="#fff" opacity=".92"/>
        <circle cx="116" cy="92" r="52" fill="none" stroke="#DBEAFE" stroke-width="14"/>
        <circle cx="116" cy="92" r="52" fill="none" stroke="${ac}" stroke-width="14" stroke-linecap="round" stroke-dasharray="232 327" transform="rotate(-90 116 92)"/>
        <rect x="90" y="80" width="52" height="14" rx="5" fill="#0F2C7A"/><rect x="98" y="102" width="36" height="6" rx="3" fill="#93C5FD"/>
        <circle cx="116" cy="156" r="14" fill="${ac}"/><path d="M112 150 l11 6 -11 6z" fill="#fff"/>
        <rect x="186" y="42" width="86" height="8" rx="4" fill="#0F2C7A"/><rect x="186" y="56" width="56" height="6" rx="3" fill="#BFDBFE"/>
        <g><rect x="188" y="126" width="12" height="30" rx="5" fill="#BFDBFE"/><rect x="206" y="108" width="12" height="48" rx="5" fill="#38BDF8"/><rect x="224" y="86" width="12" height="70" rx="5" fill="#007BFF"/><rect x="242" y="116" width="12" height="40" rx="5" fill="#1E3A8A"/><rect x="260" y="132" width="12" height="24" rx="5" fill="#BFDBFE"/></g>
        <rect x="186" y="162" width="86" height="4" rx="2" fill="#DBEAFE"/>
      </g>`,
    };
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustrasi proyek" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8FBFF"/><stop offset="1" stop-color="#BFDBFE"/></linearGradient><linearGradient id="ac-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#007BFF"/></linearGradient></defs><rect width="320" height="200" fill="url(#bg-${id})"/><circle cx="288" cy="26" r="48" fill="#fff" opacity=".55"/><circle cx="26" cy="196" r="62" fill="#93C5FD" opacity=".32"/>${scenes[variant] || scenes.finance}</svg>`;
  }

  // ---- Karya Vibe Coding: filter + 6 kartu + modal studi kasus ----
  const projState = { filter: "Semua" };

  function projectCard(p, index) {
    return `<button type="button" class="project-card liquid-glass" style="--i:${index}" data-project="${esc(p.id)}" aria-haspopup="dialog" aria-label="Buka studi kasus ${esc(p.title)}">
      <span class="pc-thumb">${projectVisual(p.visual)}<span class="pc-cat liquid-pill-ice">${esc(p.category)}</span></span>
      <span class="pc-body">
        <span class="pc-head"><span class="pc-title">${esc(p.title)}</span><span class="pc-year">${esc(p.year)}</span></span>
        <span class="pc-tag">${esc(p.tagline)}</span>
        <span class="pc-more">Lihat studi kasus ${icon("arrow-up-right", 14, 2.5)}</span>
      </span>
    </button>`;
  }

  function renderProjects() {
    const grid = $("#project-grid");
    const count = $("#project-count");
    if (!grid) return;
    const list = projState.filter === "Semua" ? PROJECTS : PROJECTS.filter((p) => p.category === projState.filter);
    if (count) count.textContent = `${list.length} karya`;
    grid.innerHTML = list.length ? list.map(projectCard).join("") : emptyBlock("code-xml", "Belum ada karya di kategori ini", "Pilih kategori lain untuk melihat karya Zaki yang lain.");
  }

  function setupProjects() {
    setupTabs($("#project-filter"), $("#project-filter-pill"), "filter", "Semua", (value) => {
      projState.filter = PROJECT_FILTERS.includes(value) ? value : "Semua";
      renderProjects();
    });
    renderProjects();
  }

  function openProject(id, origin) {
    const p = PROJECTS.find((item) => item.id === id);
    const shot = $("#project-shot");
    const body = $("#project-body");
    const scroll = $("#project-scroll");
    if (!p || !shot || !body) return;
    shot.innerHTML = projectVisual(p.visual);
    const action = p.liveView
      ? `<div class="m-actions"><button type="button" class="btn btn-blue" data-open-view="${esc(p.liveView)}">${icon("arrow-up-right", 16, 2.25)}<span>Buka Daily Finance</span></button></div>`
      : "";
    body.innerHTML = `
      <p class="m-meta">${esc(p.year)} · ${esc(p.category)}</p>
      <h2 class="m-title" id="project-title">${esc(p.title)}</h2>
      <p class="m-tagline">${esc(p.tagline)}</p>
      <div class="m-sec"><h3>${icon("alert-circle", 16, 2)}Masalah</h3><p>${esc(p.problem)}</p></div>
      <div class="m-sec"><h3>${icon("sparkles", 16, 2)}Pendekatan Vibe Coding</h3><p>${esc(p.approach)}</p></div>
      <div class="m-sec"><h3>${icon("code-xml", 16, 2)}Tech Stack</h3><ul class="m-tech">${p.tech.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
      <div class="m-sec"><h3>${icon("trophy", 16, 2)}Hasil</h3><p>${esc(p.result)}</p></div>
      ${action}`;
    body.classList.remove("is-in");
    void body.offsetWidth;
    body.classList.add("is-in");
    if (scroll) scroll.scrollTop = 0;
    openOverlay("modal-project", { origin });
  }

  // ---- Profil & Skill ----
  function renderAbout() {
    const bio = $("#about-bio");
    if (bio) bio.innerHTML = PROFILE.bio.map((text) => `<p>${esc(text)}</p>`).join("");
    const tags = $("#about-tags");
    if (tags) tags.innerHTML = PROFILE.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("");
    const skills = $("#about-skills");
    if (skills) {
      skills.innerHTML = SKILLS.map(
        (s) => `<li><div class="skill-top"><span>${esc(s.name)}</span><b>${s.level}%</b></div><div class="bar-track" role="progressbar" aria-label="${esc(s.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.level}"><span class="bar-fill" style="--p:${s.level}%"></span></div></li>`,
      ).join("");
    }
    const flow = $("#about-workflow");
    if (flow) {
      flow.innerHTML = WORKFLOW.map(
        (w, i) => `<li class="wf-card liquid-glass"><span class="wf-num" aria-hidden="true">${i + 1}</span><span class="wf-ico">${icon(w.icon, 22, 2)}</span><h3>${i + 1}. ${esc(w.title)}</h3><p>${esc(w.text)}</p></li>`,
      ).join("");
    }
    const timeline = $("#about-timeline");
    if (timeline) {
      timeline.innerHTML = TIMELINE.map(
        (t) => `<li class="tl-item"><span class="tl-year">${esc(t.year)}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`,
      ).join("");
    }
  }

  // ---- Kontak: formulir bervalidasi, salin email, kirim ----
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  const isPhone = (value) => /^\d{8,15}$/.test(value.replace(/[\s()+\-.]/g, ""));
  const contact = { busy: false };

  async function sendContact(payload) {
    if (CONFIG.formEndpoint) {
      const response = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return "sent";
    }
    if (isEmail((CONFIG.email || "").trim())) {
      const subject = `Pesan dari ${payload.name} via MZ App`;
      const body = `${payload.message}\n\n— ${payload.name}\nKontak: ${payload.contact}`;
      const link = document.createElement("a");
      link.href = `mailto:${CONFIG.email.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return "mailto";
    }
    await wait(900);
    return "demo";
  }

  function showContactSuccess(mode, name) {
    const title = $("#contact-success-title");
    const text = $("#contact-success-text");
    const form = $("#contact-form");
    const box = $("#contact-success");
    if (!title || !text || !form || !box) return;
    if (mode === "sent") {
      title.textContent = "Pesan terkirim!";
      text.textContent = `Terima kasih, ${name}! Pesanmu sudah sampai. Zaki akan membalas lewat kontak yang kamu tulis.`;
    } else if (mode === "mailto") {
      title.textContent = "Tinggal satu langkah lagi";
      text.textContent = `Terima kasih, ${name}! Aplikasi emailmu dibuka dengan pesan yang sudah terisi — tinggal tekan Kirim.`;
    } else {
      title.textContent = "Terima kasih!";
      text.textContent = `Terima kasih, ${name}! Formulir ini belum tersambung ke email Zaki, jadi pesanmu belum benar-benar terkirim.`;
    }
    form.hidden = true;
    box.hidden = false;
    box.tabIndex = -1;
    box.focus({ preventScroll: true });
  }

  function setupContact() {
    setText("email-address", CONFIG.email);

    const copyBtn = $("#copy-email");
    const copyLabel = $("#copy-email-label");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const email = CONFIG.email.trim();
        const ok = await copyText(email);
        toast(ok ? `Email disalin: ${email}` : `Salin manual: ${email}`, ok ? undefined : { tone: "info" });
        if (ok && copyLabel) {
          copyLabel.textContent = "Tersalin!";
          window.setTimeout(() => {
            copyLabel.textContent = "Salin Email 1-Klik";
          }, 1800);
        }
      });
    }

    const form = $("#contact-form");
    const nameEl = $("#contact-name");
    const reachEl = $("#contact-reach");
    const msgEl = $("#contact-message");
    const sendBtn = $("#contact-send");
    if (!form || !nameEl || !reachEl || !msgEl || !sendBtn) return;
    [["contact-name-err", nameEl], ["contact-reach-err", reachEl], ["contact-message-err", msgEl]].forEach(([errId, el]) => {
      el.addEventListener("input", () => setError(errId, "", el));
    });

    const sendHTML = sendBtn.innerHTML;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (contact.busy) return;
      const name = nameEl.value.trim();
      const reach = reachEl.value.trim();
      const message = msgEl.value.trim();
      const errors = [
        ["contact-name-err", nameEl, name.length < 2 ? "Tulis namamu (minimal 2 karakter)." : ""],
        ["contact-reach-err", reachEl, !reach ? "Isi email atau nomor WhatsApp-mu." : isEmail(reach) || isPhone(reach) ? "" : "Format belum sesuai. Contoh: nama@email.com atau 081234567890."],
        ["contact-message-err", msgEl, message.length < 10 ? "Tulis pesan minimal 10 karakter ya." : ""],
      ];
      errors.forEach(([errId, el, msg]) => setError(errId, msg, el));
      const firstBad = errors.find((e) => e[2]);
      if (firstBad) {
        firstBad[1].focus();
        toast("Periksa kembali isian formulir.", { tone: "info" });
        return;
      }
      contact.busy = true;
      sendBtn.disabled = true;
      sendBtn.setAttribute("aria-busy", "true");
      sendBtn.innerHTML = `<span class="spin">${icon("loader", 18, 2.25)}</span><span>Mengirim…</span>`;
      try {
        const mode = await sendContact({ name, contact: reach, message });
        showContactSuccess(mode, name);
        toast(mode === "sent" ? "Pesan terkirim!" : mode === "mailto" ? "Aplikasi email dibuka — tinggal tekan Kirim" : "Terima kasih atas pesanmu!", mode === "demo" ? { tone: "info" } : undefined);
        form.reset();
      } catch (error) {
        toast("Pesan belum terkirim. Periksa koneksi lalu coba lagi.", { tone: "info", duration: 4500 });
      } finally {
        contact.busy = false;
        sendBtn.disabled = false;
        sendBtn.removeAttribute("aria-busy");
        sendBtn.innerHTML = sendHTML;
      }
    });

    const again = $("#contact-again");
    if (again) {
      again.addEventListener("click", () => {
        const box = $("#contact-success");
        if (box) box.hidden = true;
        form.hidden = false;
        nameEl.focus();
      });
    }
  }

  /* ---- Klik global: navigasi, aksi cepat, kartu proyek ---- */
  function setupGlobalClicks() {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!target || !target.closest) return;
      const openView = target.closest("[data-open-view]");
      if (openView) {
        closeOverlay();
        showView(openView.dataset.openView);
        return;
      }
      const viewBtn = target.closest("[data-view]");
      if (viewBtn) {
        showView(viewBtn.dataset.view);
        return;
      }
      const act = target.closest("[data-action]");
      if (act) {
        const action = act.dataset.action;
        if (action === "add-tx") openTxModal(act);
        else if (action === "install") triggerInstall();
        else if (action === "replay-intro" && !splash.running) startSplash();
        return;
      }
      const proj = target.closest("[data-project]");
      if (proj) openProject(proj.dataset.project, proj);
    });
  }

  function setupLifecycle() {
    let lastDay = todayISO();
    const refreshIfNewDay = () => {
      const today = todayISO();
      renderGreeting();
      if (today !== lastDay) {
        lastDay = today;
        renderAllData();
        setupSchedule();
        redrawCharts(false);
      }
    };
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshIfNewDay();
    });
    window.setInterval(refreshIfNewDay, 60000);

    // Sinkronkan antar tab / jendela
    window.addEventListener("storage", (event) => {
      if (!event.key || !Object.values(KEYS).includes(event.key)) return;
      loadState();
      renderAllData();
      redrawCharts(false);
    });

    let resizeFrame = 0;
    const onResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        refreshPills(true);
        fitAll();
      });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        refreshPills(true);
        fitAll();
      });
    }
  }

  /* ======================================================================
     8. PWA INSTALL & SERVICE WORKER
     ====================================================================== */
  const pwa = { deferred: null };
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // Tombol "Install App": bila sudah berjalan sebagai aplikasi (standalone) → berubah menjadi badge "Terpasang di HP"
  function updateInstallUI() {
    const installed = isStandalone();
    $$('[data-action="install"]').forEach((btn) => {
      btn.classList.toggle("is-installed", installed);
      if (installed) {
        btn.setAttribute("aria-disabled", "true");
        btn.tabIndex = -1;
      } else {
        btn.removeAttribute("aria-disabled");
        btn.tabIndex = 0;
      }
      const label = $(".install-label", btn);
      if (label) {
        if (!label.dataset.defaultText) label.dataset.defaultText = label.textContent;
        label.textContent = installed ? "Terpasang di HP" : label.dataset.defaultText;
      }
      const ico = $("[data-icon]", btn);
      if (ico) {
        if (!ico.dataset.defaultIcon) ico.dataset.defaultIcon = ico.dataset.icon;
        ico.innerHTML = icon(installed ? "check" : ico.dataset.defaultIcon, Number(ico.dataset.size) || 18, installed ? 2.5 : 1.75);
      }
    });
  }

  function openInstallGuide() {
    const note = $("#install-modal-note");
    if (note) {
      if (isIOS()) note.textContent = "Di iPhone, pemasangan dilakukan manual lewat Safari — ikuti langkah di bawah.";
      else if (location.protocol === "file:") note.textContent = "Kamu membuka aplikasi dari file di komputer. Upload dulu ke GitHub Pages (https) agar tombol Install resmi aktif. Sementara itu, ikuti panduan di bawah.";
      else note.textContent = "Browser ini belum menampilkan dialog pemasangan otomatis. Ikuti langkah manual di bawah.";
    }
    openOverlay("modal-install");
  }

  async function triggerInstall() {
    if (isStandalone()) return;
    if (pwa.deferred) {
      const promptEvent = pwa.deferred;
      pwa.deferred = null;
      try {
        promptEvent.prompt(); // dialog pemasangan resmi 1-klik
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === "accepted") toast("MZ App sedang dipasang di perangkatmu");
      } catch (error) {
        /* pengguna menutup dialog */
      }
    } else {
      openInstallGuide(); // iPhone Safari, file:// atau browser tanpa beforeinstallprompt
    }
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    pwa.deferred = event;
  });

  window.addEventListener("appinstalled", () => {
    pwa.deferred = null;
    updateInstallUI();
    toast("MZ App berhasil dipasang!");
  });

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    const secure = location.protocol === "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
    if (!secure) return; // service worker hanya diizinkan di https / localhost
    const register = async () => {
      try {
        await navigator.serviceWorker.register("./sw.js");
      } catch (error) {
        /* tanpa service worker aplikasi tetap berjalan normal */
      }
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);
  }

  function setupConnectivityToasts() {
    window.addEventListener("offline", () => toast("Kamu sedang offline — data tetap tersimpan di perangkat.", { tone: "info", duration: 4200 }));
    window.addEventListener("online", () => toast("Kembali online"));
  }

  /* ======================================================================
     9. INIT
     ====================================================================== */
  function renderAllData() {
    renderKpis();
    renderLive();
    renderGoal();
    renderHistory();
    if (activityState.tab === "target") renderActivity();
  }

  function pillFor(containerSelector, pillSelector, activeSelector) {
    const container = $(containerSelector);
    const indicator = $(pillSelector);
    return container && indicator ? createPill(container, indicator, activeSelector) : null;
  }

  function init() {
    loadState();
    hydrateIcons();
    renderGreeting();

    navPills.desktop = pillFor("#sidebar-nav", "#sidebar-pill", ".nav-btn.is-active");
    navPills.mobile = pillFor("#dock-inner", "#dock-pill", ".dock-btn.is-active");
    Object.keys(navPills).forEach((key) => {
      if (!navPills[key]) delete navPills[key];
    });

    setupChartObserver();
    setupOverlays();
    setupGlow();
    setupCharts();
    setupFinance();
    setupOverview();
    setupProjects();
    renderAbout();
    setupContact();
    setupGlobalClicks();

    renderAllData();
    onData(() => {
      renderAllData();
      redrawCharts(true);
    });

    const initial = location.hash.replace("#", "");
    setActiveNav("overview");
    if (ROUTES.includes(initial) && initial !== "overview") showView(initial, { immediate: true, updateHash: false });
    window.addEventListener("hashchange", () => {
      const view = location.hash.replace("#", "");
      showView(ROUTES.includes(view) ? view : "overview", { updateHash: false });
    });

    redrawCharts(false);
    refreshPills(true);
    fitAll();
    setupLifecycle();
    updateInstallUI();
    if (window.matchMedia) {
      const mq = window.matchMedia("(display-mode: standalone)");
      if (mq.addEventListener) mq.addEventListener("change", updateInstallUI);
    }
    registerServiceWorker();
    setupConnectivityToasts();
    setupSplash();
  }

  try {
    init();
  } catch (error) {
    // Jaring pengaman: jangan biarkan splash menutupi layar bila ada galat tak terduga
    console.error("MZ App gagal dimulai:", error);
    document.body.classList.remove("is-booting");
    const stuck = document.getElementById("startup-splash");
    if (stuck) stuck.hidden = true;
    ["app-shell", "dock"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.inert = false;
    });
  }
})();
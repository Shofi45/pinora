import { useState } from "react";
import { Button } from "@/components/Button";
import { Icon, type IconName } from "@/components/Icon";
import { useGo } from "@/lib/nav";

const img = (name: string) => `/images/sc/${name}`;

const CHAPTERS = [
  {
    id: "bab-uang",
    no: "01",
    title: "Master Your Money",
  },
  {
    id: "bab-kpr",
    no: "02",
    title: "Your Dream, Your Home",
  },
  {
    id: "bab-sales",
    no: "03",
    title: "Discover Sales Center BTN",
  },
  {
    id: "bab-hitung",
    no: "04",
    title: "Can You Afford It?",
  },
];

const QUIZ = [
  { q: "Membeli makan siang karena lapar", answer: "need" },
  {
    q: "Checkout sepatu baru karena sedang diskon, padahal sepatu lama masih bagus",
    answer: "want",
  },
  {
    q: "Membayar biaya transportasi untuk pergi kuliah atau bekerja",
    answer: "need",
  },
  { q: "Membeli kopi kekinian setiap hari karena ikut tren", answer: "want" },
] as const;

type Choice = "need" | "want";

const DEBT_TIPS = [
  ["Pay on time!", "Bayar cicilan sesuai tanggal jatuh tempo."],
  [
    "Know your limits.",
    "Jangan mengambil pinjaman melebihi kemampuan membayar.",
  ],
  [
    "Track your debt.",
    "Catat semua cicilan agar nggak ada pembayaran yang terlewat.",
  ],
  [
    "Think before you borrow.",
    "Pastikan pinjaman memang dibutuhkan dan kamu paham biaya serta risikonya.",
  ],
];

const READY = [
  [
    "Check your income.",
    "Pastikan penghasilan cukup untuk kebutuhan sehari-hari dan cicilan.",
  ],
  [
    "Save for the down payment.",
    "Mulai sisihkan uang untuk uang muka (DP) dan biaya awal pembelian rumah.",
  ],
  [
    "Build your emergency fund.",
    "Siapkan dana darurat untuk menghadapi kebutuhan tak terduga.",
  ],
  [
    "Calculate your affordability.",
    "Hitung perkiraan cicilan yang sesuai dengan kemampuan keuanganmu.",
  ],
  [
    "Plan for the long run.",
    "Ingat, KPR adalah komitmen jangka panjang yang perlu direncanakan dengan matang.",
  ],
];

const PURPOSES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "document",
    title: "Pengajuan lebih terarah",
    text: "Membantu proses KPR untuk proyek perumahan rekanan BTN.",
  },
  {
    icon: "building",
    title: "Terhubung dengan developer",
    text: "Mendukung koordinasi antara calon pembeli, developer, dan BTN.",
  },
  {
    icon: "chart",
    title: "Info KPR lebih jelas",
    text: "Mengenal pilihan pembiayaan dan ketentuannya.",
  },
  {
    icon: "shield",
    title: "Persiapan lebih matang",
    text: "Tahu dokumen dan langkah yang perlu disiapkan sebelum mengajukan KPR.",
  },
];

const COMPARE = [
  [
    "Fokus layanan",
    "Fokus pada KPR non-subsidi untuk segmen dan proyek perumahan pilihan.",
    "Melayani pengajuan KPR sesuai produk yang tersedia di kantor cabang.",
  ],
  [
    "Pilihan developer",
    "Berfokus pada developer yang bekerja sama dengan Sales Center.",
    "Pilihan properti mengikuti ketentuan produk KPR yang diajukan.",
  ],
  [
    "Proses pengajuan",
    "Bisa mendapat dukungan pemrosesan khusus jika memenuhi ketentuan.",
    "Mengikuti prosedur pengajuan dan analisis kredit yang berlaku.",
  ],
  [
    "Program dan benefit",
    "Bisa ada program atau benefit khusus sesuai proyek dan ketentuan yang berlaku.",
    "Mengikuti program dan benefit dari produk KPR yang dipilih.",
  ],
  [
    "Tenor cicilan",
    "KPR BTN Platinum dapat memiliki tenor hingga 30 tahun, sesuai ketentuan dan persetujuan BTN.",
    "KPR BTN Platinum juga dapat memiliki tenor hingga 30 tahun, sesuai ketentuan dan persetujuan BTN.",
  ],
];

const KPR_TYPES = [
  {
    image: "sc-15-primary.jpg",
    alt: "Rumah baru dari developer",
    tag: "PRIMARY",
    title: "KPR Rumah Baru",
    text: "Punya incaran rumah baru dari developer? KPR Primary bisa menjadi salah satu pilihan untuk membiayainya. Sebelum mengajukan, pastikan kamu sudah menghitung uang muka (DP), biaya awal, cicilan bulanan, dan kemampuan finansialmu.",
  },
  {
    image: "sc-16-secondary.jpg",
    alt: "Rumah bekas",
    tag: "SECONDARY",
    title: "KPR Rumah Bekas",
    text: "Mau beli rumah yang sudah pernah dimiliki orang lain? KPR Secondary merupakan pembiayaan untuk pembelian rumah bekas. Namun, pengajuannya tetap bergantung pada kondisi properti, persyaratan bank, dan ketersediaan layanan yang berlaku.",
  },
  {
    image: "sc-17-takeover.jpg",
    alt: "Rumah untuk alih kredit",
    tag: "TAKE OVER",
    title: "KPR Alih Kredit",
    text: "Sudah punya cicilan rumah di bank lain dan ingin mempertimbangkan pindah ke BTN? KPR Take Over memungkinkan pengalihan pembiayaan jika memenuhi persyaratan. Sebelum memutuskan, cek dulu sisa utang, biaya pengalihan, suku bunga, tenor, dan total cicilan yang perlu dibayar.",
  },
];

const WHY: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "home",
    title: "Temukan Jalan Menuju Rumah Impian",
    text: "Punya incaran rumah dari developer rekanan? Cari tahu informasi pembiayaan KPR non-subsidi yang sesuai dengan proyek dan kebutuhanmu.",
  },
  {
    icon: "building",
    title: "Lebih Dekat dengan Developer",
    text: "Dapatkan informasi terkait rumah dan proses pembiayaan melalui layanan yang menghubungkan kebutuhan calon pembeli dengan developer rekanan.",
  },
  {
    icon: "book",
    title: "Nggak Bingung Mulai dari Mana",
    text: "Masih punya banyak pertanyaan soal KPR? Kamu bisa mencari tahu persyaratan, dokumen yang perlu disiapkan, hingga tahapan pengajuan melalui petugas Sales Center.",
  },
  {
    icon: "spark",
    title: "Cari Tahu Program yang Tersedia",
    text: "Ada kemungkinan program bunga atau penawaran biaya tertentu pada proyek dan periode tertentu. Tanyakan langsung agar kamu tahu syarat dan manfaat yang bisa diperoleh.",
  },
];

function Pager({
  active,
  onPick,
}: {
  active: number;
  onPick: (i: number) => void;
}) {
  const prev = CHAPTERS[active - 1];
  const next = CHAPTERS[active + 1];
  return (
    <div className="chapter-pager">
      {prev ? (
        <button onClick={() => onPick(active - 1)}>
          <small>Sebelumnya</small>
          <b>{prev.title}</b>
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button className="next" onClick={() => onPick(active + 1)}>
          <small>Selanjutnya</small>
          <b>{next.title}</b>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

export default function ScBtn() {
  const go = useGo();
  const [answers, setAnswers] = useState<Record<number, Choice>>({});
  const [active, setActive] = useState(0);

  const choose = (i: number) => {
    setActive(i);
    document
      .getElementById("course-top")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const answered = Object.keys(answers).length;
  const correct = QUIZ.filter((item, i) => answers[i] === item.answer).length;

  return (
    <section id="sc-btn" className="section sc-section">
      <div className="container">
        <div className="sc-hero">
          <div className="sc-copy">
            <div className="section-kicker light">SALES CENTER BTN</div>
            <h2>
              Home Sweet Future
              <br />
              ft. Sales Center BTN!
            </h2>
            <p>
              Dari smart money menuju dream home. Empat subbab untuk mengenali
              kondisi keuangan, memahami KPR, mengenal Sales Center BTN, dan
              menghitung kemampuanmu.
            </p>
            <Button onClick={() => choose(3)}>
              Cek kemampuan anggaran <Icon name="arrow" />
            </Button>
          </div>
          <div
            className="sc-hero-photo grid place-items-center"
            aria-hidden="true"
          >
            <div className="relative grid size-56 place-items-center rounded-full border border-white/30 bg-white/10 text-[#ffc400]">
              <div className="absolute size-44 rounded-full border border-white/20" />
              <Icon name="home" size={88} />
              <span className="absolute -bottom-3 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#064a91] shadow-lg">
                Rumah impian dimulai dari rencana
              </span>
            </div>
          </div>
        </div>

        <div className="course-layout" id="course-top">
          <aside className="course-sidebar">
            <div className="course-label">DAFTAR MATERI</div>
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                className={active === i ? "active" : ""}
                onClick={() => choose(i)}
              >
                <span>{c.no}</span>
                <div>
                  <b>{c.title}</b>
                </div>
                <Icon name="chevron" size={16} />
              </button>
            ))}
            <div className="course-progress">
              <div>
                <span>Progres materi</span>
                <b>{active + 1} dari 4</b>
              </div>
              <div className="progress">
                <i style={{ width: `${((active + 1) / 4) * 100}%` }} />
              </div>
            </div>
          </aside>

          <div className="course-content">
            {/* ============ 1. MASTER YOUR MONEY ============ */}
            {active === 0 && (
              <article id="bab-uang" className="chapter-card">
                <header className="chapter-header">
                  <span>01</span>
                  <div>
                    <small>SUBBAB 1</small>
                    <h2>Master Your Money</h2>
                  </div>
                  <div className="chapter-status">
                    <Icon name="book" size={16} /> Belajar keuangan
                  </div>
                </header>

                <div className="split">
                  <div>
                    <div className="section-kicker">
                      SMART MONEY, BETTER FUTURE!
                    </div>
                    <p>
                      Pernah nggak, baru gajian rasanya jadi the richest person
                      ever, tapi beberapa hari kemudian malah bingung uangnya ke
                      mana? Tenang, kamu nggak sendirian!
                    </p>
                    <p>
                      Mengatur keuangan itu bukan soal harus punya uang banyak,
                      tapi soal gimana kamu mengelola uang yang kamu punya.
                      Mulai dari memenuhi kebutuhan sehari-hari, menyisihkan
                      tabungan, menyiapkan dana darurat, sampai mewujudkan
                      impian punya rumah sendiri.
                    </p>
                    <p>
                      Lewat materi ini, kamu bakal belajar jadi lebih aware sama
                      kondisi keuanganmu, mengatur pengeluaran dengan lebih
                      bijak, dan mulai menyusun strategi keuangan untuk masa
                      depan. So, let&apos;s get your money right!
                    </p>
                  </div>
                  <figure className="figure">
                    <img
                      src={img("sc-01-smart-money.jpg")}
                      alt="Kolase orang menghitung uang dan grafik naik"
                      loading="lazy"
                    />
                  </figure>
                </div>

                <h3 className="sub-title">
                  Track Your Money: Uangmu Ke Mana Aja?
                </h3>
                <div className="split reverse">
                  <figure className="figure">
                    <img
                      src={img("sc-02-track.jpg")}
                      alt="Kolase celengan, grafik, dan kalkulator"
                      loading="lazy"
                    />
                  </figure>
                  <div>
                    <p>
                      Sebelum mulai mengatur keuangan, kamu perlu tahu dulu
                      uangmu datang dari mana dan pergi ke mana. Catat pemasukan
                      seperti gaji, uang saku, atau penghasilan tambahan, lalu
                      bandingkan dengan pengeluaranmu setiap bulan.
                    </p>
                    <p>
                      Coba biasakan mencatat setiap transaksi, mulai dari bayar
                      transportasi, beli makan, sampai checkout barang saat
                      scrolling online shop. Dari sini, kamu bisa tahu kebiasaan
                      belanjamu dan menemukan pengeluaran yang sebenarnya bisa
                      dikurangi.
                    </p>
                  </div>
                </div>
                <div className="money-tip">
                  <Icon name="spark" />
                  <p>
                    <b>Money tip</b> Jangan tunggu uang habis baru mengecek
                    saldo. Make your money work for you, bukan malah
                    bertanya-tanya uangmu ke mana!
                  </p>
                </div>
                <button className="inline-link" onClick={() => go("calculate")}>
                  Kamu bisa klik di sini untuk memudahkan pembagian anggaranmu{" "}
                  <Icon name="arrow" size={17} />
                </button>

                <h3 className="sub-title">
                  Needs vs. Wants: Jangan Sampai Kalap!
                </h3>
                <div className="split">
                  <div>
                    <p>
                      Pernah beli sesuatu karena lagi viral, padahal sebenarnya
                      nggak butuh-butuh banget? Nah, ini saatnya belajar
                      membedakan needs dan wants!
                    </p>
                    <div className="nw-grid">
                      <div className="nw need">
                        <b>Needs (kebutuhan)</b>
                        <p>
                          Hal yang penting untuk kehidupan sehari-hari, seperti
                          makanan, transportasi, biaya kuliah, dan tagihan.
                        </p>
                      </div>
                      <div className="nw want">
                        <b>Wants (keinginan)</b>
                        <p>
                          Hal yang bikin happy, tetapi masih bisa ditunda,
                          seperti membeli baju baru padahal lemari masih penuh
                          atau jajan karena ikut tren.
                        </p>
                      </div>
                    </div>
                    <p>
                      Bukan berarti kamu nggak boleh treat yourself, ya! Kamu
                      tetap boleh menikmati hasil kerja kerasmu, asalkan
                      pengeluarannya sesuai budget dan nggak mengorbankan
                      kebutuhan utama.
                    </p>
                  </div>
                  <figure className="figure">
                    <img
                      src={img("sc-03-needs-wants.jpg")}
                      alt="Orang mengamati dengan teropong di depan grafik"
                      loading="lazy"
                    />
                  </figure>
                </div>

                <div className="quiz-card quiz-wide">
                  <div className="quiz-progress">
                    <span>MINI CHALLENGE</span>
                    <b>{answered} dari 4 dijawab</b>
                  </div>
                  <div className="quiz-head">
                    <span>
                      <Icon name="briefcase" />
                    </span>
                    <div>
                      <small>KUIS SINGKAT</small>
                      <h3>Need or Want?</h3>
                    </div>
                  </div>
                  <div className="quiz-list">
                    {QUIZ.map((item, i) => {
                      const picked = answers[i];
                      const right = picked === item.answer;
                      return (
                        <div key={item.q} className="quiz-item">
                          <p>
                            <b>{i + 1}.</b> {item.q}
                          </p>
                          <div className="quiz-options row">
                            {(["need", "want"] as const).map((c) => (
                              <button
                                key={c}
                                disabled={Boolean(picked)}
                                className={
                                  picked === c
                                    ? `selected ${right ? "correct" : "wrong"}`
                                    : ""
                                }
                                onClick={() =>
                                  setAnswers((a) => ({ ...a, [i]: c }))
                                }
                              >
                                <span>{c === "need" ? "N" : "W"}</span>
                                <div>
                                  <b>{c === "need" ? "Need" : "Want"}</b>
                                </div>
                              </button>
                            ))}
                          </div>
                          {picked && (
                            <div
                              className={`quiz-feedback ${right ? "correct" : "wrong"}`}
                            >
                              <Icon
                                name={right ? "check" : "close"}
                                size={18}
                              />{" "}
                              {right
                                ? "Tepat!"
                                : `Belum tepat. Ini termasuk ${item.answer === "need" ? "Need (kebutuhan)" : "Want (keinginan)"}.`}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="quiz-foot">
                    <span>
                      {answered === 4
                        ? `Skormu ${correct} dari 4`
                        : "Jawab semua pertanyaan untuk melihat skor."}
                    </span>
                    <button onClick={() => setAnswers({})}>Ulangi</button>
                  </div>
                </div>

                <figure className="figure mt-5">
                  <img
                    src={img("sc-04-needs-wants-quiz.png")}
                    alt="Contoh tampilan kuis singkat Need or Want"
                    loading="lazy"
                  />
                </figure>

                <div className="split reverse">
                  <figure className="figure small">
                    <img
                      src={img("sc-04-remember.jpg")}
                      alt="Kucing memegang uang dan kalkulator"
                      loading="lazy"
                    />
                  </figure>
                  <div>
                    <div className="money-tip">
                      <Icon name="spark" />
                      <p>
                        <b>Remember</b> Sebelum membeli sesuatu, coba tanya diri
                        sendiri, &ldquo;Do I really need this, or do I just want
                        it?&rdquo; Kalau ternyata cuma keinginan, nggak ada
                        salahnya menunda dan memasukkannya ke daftar belanja
                        bulan depan.
                      </p>
                    </div>
                    <p className="closing">
                      <b>Small habits, big impact!</b> Kebiasaan kecil dalam
                      mengelola uang bisa jadi langkah awal untuk membangun masa
                      depan finansial yang lebih aman, termasuk mempersiapkan
                      rumah impianmu.
                    </p>
                  </div>
                </div>
                <Pager active={0} onPick={choose} />
              </article>
            )}

            {/* ============ 2. YOUR DREAM, YOUR HOME ============ */}
            {active === 1 && (
              <article id="bab-kpr" className="chapter-card">
                <header className="chapter-header">
                  <span>02</span>
                  <div>
                    <small>SUBBAB 2</small>
                    <h2>Your Dream, Your Home</h2>
                  </div>
                  <div className="chapter-status">
                    <Icon name="home" size={16} /> Persiapan memiliki rumah
                  </div>
                </header>

                <div className="split">
                  <div>
                    <div className="section-kicker">
                      UNDERSTAND YOUR KPR: BUNGA, CICILAN &amp; TENOR
                    </div>
                    <p>
                      Punya impian punya rumah sendiri? Jangan cuma fokus sama
                      harga rumahnya, kamu juga perlu paham cara kerja KPR!
                      Sebelum commit untuk cicilan jangka panjang, kenali dulu
                      tiga hal penting ini:
                    </p>
                  </div>
                  <figure className="figure">
                    <img
                      src={img("sc-05-dream-home.jpg")}
                      alt="Meme: buy a house, they said"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="concept-grid">
                  <div>
                    <span>
                      <Icon name="chart" />
                    </span>
                    <b>Bunga KPR</b>
                    <p>Biaya yang kamu bayarkan atas pinjaman dari bank.</p>
                  </div>
                  <div>
                    <span>
                      <Icon name="wallet" />
                    </span>
                    <b>Cicilan bulanan</b>
                    <p>
                      Jumlah uang yang perlu kamu bayar setiap bulan untuk
                      melunasi pinjaman.
                    </p>
                  </div>
                  <div>
                    <span>
                      <Icon name="document" />
                    </span>
                    <b>Tenor</b>
                    <p>
                      Jangka waktu untuk melunasi KPR. Semakin panjang tenor,
                      cicilan bulanan biasanya lebih ringan, tetapi total bunga
                      yang dibayarkan bisa lebih besar.
                    </p>
                  </div>
                </div>
                <div className="money-tip">
                  <Icon name="spark" />
                  <p>
                    <b>Money tip</b> Jangan langsung tergiur cicilan yang
                    terlihat kecil. Cek juga suku bunga, biaya tambahan, dan
                    total pembayaran sampai lunas. Be a smart homebuyer!
                  </p>
                </div>

                <h3 className="sub-title">
                  Manage Your Debt: Keep Your Credit Healthy!
                </h3>
                <div className="split reverse">
                  <figure className="figure">
                    <img
                      src={img("sc-06-manage-debt.jpg")}
                      alt="Pria santai di atas tumpukan uang"
                      loading="lazy"
                    />
                  </figure>
                  <div>
                    <p>
                      Punya cicilan bukan berarti keuanganmu berantakan, kok!
                      Yang penting, kamu tahu batas kemampuan dan bertanggung
                      jawab membayar tepat waktu.
                    </p>
                    <p>
                      Riwayat pembayaran kredit juga penting, terutama kalau
                      suatu hari kamu ingin mengajukan KPR. Di Indonesia,
                      informasi terkait riwayat kredit dapat dilihat melalui{" "}
                      <b>SLIK OJK</b>.
                    </p>
                    <p>
                      <b>Supaya riwayat kredit tetap terjaga:</b>
                    </p>
                  </div>
                </div>
                <ul className="tip-list">
                  {DEBT_TIPS.map(([t, d]) => (
                    <li key={t}>
                      <Icon name="check" size={18} />
                      <p>
                        <b>{t}</b> {d}
                      </p>
                    </li>
                  ))}
                </ul>

                <h3 className="sub-title">Get Ready for Your Dream Home!</h3>
                <p>
                  Punya rumah sendiri itu exciting banget! Tapi, sebelum mulai
                  berburu rumah impian, pastikan kondisi keuanganmu sudah cukup
                  siap. Jangan sampai rumahnya bikin happy, tetapi cicilannya
                  malah bikin financial stress.
                </p>
                <p>Yuk, cek beberapa hal yang perlu kamu persiapkan:</p>
                <ul className="tip-list">
                  {READY.map(([t, d], i) => (
                    <li key={t}>
                      <span className="num">{i + 1}</span>
                      <p>
                        <b>{t}</b> {d}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="photo-pair">
                  <figure className="figure">
                    <img
                      src={img("sc-07-economy.jpg")}
                      alt="Tulisan: in this economy??"
                      loading="lazy"
                    />
                  </figure>
                  <figure className="figure">
                    <img
                      src={img("sc-08-house.jpg")}
                      alt="Rumah impian dua lantai"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <Pager active={1} onPick={choose} />
              </article>
            )}

            {/* ============ 3. DISCOVER SALES CENTER BTN ============ */}
            {active === 2 && (
              <article
                id="bab-sales"
                className="chapter-card sales-center-block"
              >
                <header className="chapter-header">
                  <span>03</span>
                  <div>
                    <small>SUBBAB 3</small>
                    <h2>Discover Sales Center BTN</h2>
                  </div>
                  <div className="chapter-status">
                    <Icon name="building" size={16} /> Mengenal Sales Center BTN
                  </div>
                </header>

                <div className="split">
                  <div>
                    <div className="section-kicker">
                      PATHWAY TO YOUR DREAM HOME.
                    </div>
                    <p>
                      Memiliki rumah merupakan impian bagi semua orang. Namun
                      impian tersebut harus diimbangi dengan perencanaan
                      keuangan yang matang. Calon pembeli perlu memahami terkait
                      pembiayaan yang dibutuhkan dalam membeli rumah.
                    </p>
                    <p>
                      Bank Tabungan Negara atau yang biasa kita kenal dengan
                      &ldquo;BTN&rdquo; hadir untuk membantu masyarakat dalam
                      membiayai kepemilikan rumah. Salah satu layanan bergengsi
                      yang diberikan ialah &ldquo;Sales Center BTN&rdquo; yang
                      berfokus pada penyaluran KPR Non-Subsidi melalui
                      pengelolaan dan kerja sama dengan developer atau
                      pengembang perumahan tertentu.
                    </p>
                    <p>Jadi, let us learn about Sales Center BTN!</p>
                  </div>
                  <figure className="figure logo">
                    <img
                      src={img("sc-09-btn-logo.png")}
                      alt="Logo BTN"
                      loading="lazy"
                    />
                  </figure>
                </div>

                <figure className="figure small mt-5">
                  <img
                    src={img("sc-10-who-can.jpg")}
                    alt="Ilustrasi calon nasabah yang sedang mempertimbangkan KPR"
                    loading="lazy"
                  />
                </figure>
                <h3 className="sub-title">
                  Let me show you what is &ldquo;Sales Center BTN&rdquo;
                </h3>
                <div className="split reverse">
                  <figure className="figure">
                    <img
                      src={img("sc-11-sales-center.jpg")}
                      alt="Peresmian Sales Center KPR BTN"
                      loading="lazy"
                    />
                  </figure>
                  <div>
                    <p>
                      Sales Center KPR BTN adalah layanan dari Bank BTN yang
                      fokus membantu masyarakat mendapatkan pembiayaan rumah
                      melalui KPR non-subsidi. Layanan ini ditujukan terutama
                      bagi segmen <i>emerging affluent</i>, yaitu orang-orang
                      yang kondisi keuangannya mulai mapan dan sedang
                      merencanakan kepemilikan rumah. Sales Center juga bekerja
                      sama dengan developer dan proyek perumahan pilihan untuk
                      mendukung kebutuhan pembiayaan calon pembeli rumah.
                    </p>
                  </div>
                </div>

                <div className="split">
                  <div>
                    <h4 className="mini-title">
                      Apa sih tujuan Sales Center KPR BTN?
                    </h4>
                    <p>
                      Sales Center KPR BTN hadir untuk bikin perjalanan menuju
                      rumah impian jadi lebih terarah!
                    </p>
                  </div>
                  <figure className="figure small">
                    <img
                      src={img("sc-12-purpose.jpg")}
                      alt="Kucing dengan kaca pembesar"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="benefit-grid">
                  {PURPOSES.map((p) => (
                    <article key={p.title}>
                      <span>
                        <Icon name={p.icon} />
                      </span>
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-6">
                  <div>
                    <h4 className="mini-title">
                      Siapa aja yang bisa memanfaatkan layanan ini?
                    </h4>
                    <p>
                      Sales Center KPR BTN bisa menjadi pilihan buat kamu yang
                      sedang merencanakan pembelian rumah melalui KPR
                      non-subsidi, terutama jika rumah yang kamu incar berasal
                      dari developer rekanan BTN yang bekerja sama dengan Sales
                      Center.
                    </p>
                    <p>
                      Tapi, perlu diingat, ya! Pengajuan KPR tetap harus
                      memenuhi persyaratan yang berlaku dan melalui proses
                      analisis kredit dari BTN. Jadi, meskipun kamu sudah
                      menemukan rumah impian, pastikan juga kondisi keuanganmu
                      siap untuk mengambil cicilan jangka panjang.
                    </p>
                  </div>
                </div>

                <h3 className="sub-title">Discover the Difference</h3>
                <div className="split">
                  <div>
                    <h4 className="mini-title">
                      Sales Center KPR BTN vs KPR Reguler
                    </h4>
                    <p>
                      Sama-sama bisa bantu kamu punya rumah impian, tapi ada
                      beberapa hal yang membedakan kedua layanan ini, lho!
                    </p>
                  </div>
                  <figure className="figure small">
                    <img
                      src={img("sc-13-difference.png")}
                      alt="Ilustrasi kolase uang"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="table-wrap">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th>Yang Dibandingkan</th>
                        <th>Sales Center KPR BTN</th>
                        <th>KPR Reguler BTN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE.map(([a, b, c]) => (
                        <tr key={a}>
                          <th scope="row">{a}</th>
                          <td>{b}</td>
                          <td>{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="split reverse">
                  <figure className="figure small">
                    <img
                      src={img("sc-14-compare.jpg")}
                      alt="Ilustrasi pengumuman"
                      loading="lazy"
                    />
                  </figure>
                  <div>
                    <h4 className="mini-title">Jadi, apa bedanya?</h4>
                    <p>
                      Sales Center lebih berfokus pada KPR non-subsidi dan
                      proyek perumahan rekanan tertentu, sedangkan KPR Reguler
                      melayani pengajuan melalui jalur kantor cabang sesuai
                      produk yang tersedia.
                    </p>
                    <p>
                      Untuk tenor, keduanya bisa sama-sama mencapai 30 tahun
                      jika menggunakan produk KPR BTN Platinum dan memenuhi
                      ketentuan yang berlaku. Jadi, bukan berarti pengajuan
                      lewat Sales Center otomatis lebih cepat disetujui atau
                      punya tenor lebih panjang, ya!
                    </p>
                  </div>
                </div>

                <h3 className="sub-title">
                  KPR yang bisa kalian ajukan di Sales Center
                </h3>
                <div className="kpr-types">
                  {KPR_TYPES.map((k) => (
                    <article key={k.tag}>
                      <img src={img(k.image)} alt={k.alt} loading="lazy" />
                      <div>
                        <small>{k.tag}</small>
                        <h4>{k.title}</h4>
                        <p>{k.text}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <figure className="figure small mt-6">
                  <img
                    src={img("sc-18-megaphone.png")}
                    alt="Ilustrasi ajakan mencari informasi Sales Center BTN"
                    loading="lazy"
                  />
                </figure>
                <h3 className="sub-title">Why Choose BTN Sales Center?</h3>
                <div className="split">
                  <div>
                    <p>
                      Rumah impian nggak harus cuma jadi angan-angan! Yuk, mulai
                      langkahmu menuju rumah idaman bersama Sales Center KPR
                      BTN. Kamu bisa mengenal pilihan pembiayaan rumah
                      non-subsidi, mencari tahu proses pengajuan, dan
                      mempersiapkan diri sebelum mengambil keputusan besar.
                    </p>
                  </div>
                  <figure className="figure small">
                    <img
                      src={img("sc-19-why.png")}
                      alt="Orang berpikir dengan banyak tanda tanya"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="benefit-grid two">
                  {WHY.map((w) => (
                    <article key={w.title}>
                      <span>
                        <Icon name={w.icon} />
                      </span>
                      <h3>{w.title}</h3>
                      <p>{w.text}</p>
                    </article>
                  ))}
                </div>

                <div className="final-cta">
                  <img
                    src={img("sc-20-ready.jpg")}
                    alt="Kolase keuangan dan rumah"
                    loading="lazy"
                  />
                  <div>
                    <h3>Siap Melangkah Menuju Rumah Impian?</h3>
                    <p>
                      Jangan cuma fokus mencari rumah yang bagus, pastikan
                      pembiayaannya juga sesuai kemampuanmu. Kenali pilihan KPR,
                      hitung perkiraan cicilan, dan konsultasikan kebutuhanmu
                      melalui Sales Center KPR BTN.
                    </p>
                  </div>
                </div>
                <div className="important-note">
                  <Icon name="shield" />
                  <p>
                    <b>Catatan penting</b> Program dan layanan mengikuti
                    ketentuan BTN yang berlaku. Setiap pengajuan melalui
                    analisis kredit dan tidak menjamin persetujuan.
                  </p>
                </div>
                <Pager active={2} onPick={choose} />
              </article>
            )}

            {/* ============ 4. CAN YOU AFFORD IT? ============ */}
            {active === 3 && (
              <article id="bab-hitung" className="chapter-card">
                <header className="chapter-header">
                  <span>04</span>
                  <div>
                    <small>SUBBAB 4</small>
                    <h2>Can You Afford It?</h2>
                  </div>
                  <div className="chapter-status">
                    <Icon name="calculator" size={16} /> Kalkulator kemampuan
                    anggaran
                  </div>
                </header>
                <p className="chapter-intro">
                  Masukkan penghasilan, kebutuhan pokok, cicilan yang sedang
                  berjalan, dan perkiraan cicilan rumah. Kalkulator akan
                  menunjukkan sisa anggaran bulananmu dan apakah rasio
                  cicilannya masih aman.
                </p>
                <figure className="figure my-6">
                  <img
                    src={img("sc-22-next-step.png")}
                    alt="Contoh tampilan simulasi anggaran bulanan dan sisa keuangan"
                    loading="lazy"
                  />
                </figure>
                <div className="course-cta">
                  <span>
                    <Icon name="calculator" />
                  </span>
                  <div>
                    <small>LANGKAH TERAKHIR</small>
                    <h3>Sudah siap menghitung kemampuanmu?</h3>
                    <p>
                      Coba simulasi berdasarkan kondisi keuanganmu saat ini.
                    </p>
                  </div>
                  <Button onClick={() => go("calculate")}>
                    Buka kalkulator <Icon name="arrow" />
                  </Button>
                </div>
                <Pager active={3} onPick={choose} />
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

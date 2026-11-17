import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useGo } from "@/lib/nav";

const img = (name: string) => `/images/akad/${name}`;

const SECTIONS = [
  { no: "01", title: "Mengenal Signing Officer" },
  {
    no: "02",
    title: "Apa itu akad kredit?",
  },
  {
    no: "03",
    title: "Siapa yang hadir saat akad?",
  },
  { no: "04", title: "Alur dari SP3K sampai dana cair" },
  {
    no: "05",
    title: "Penilaian agunan (appraisal)",
  },
  { no: "06", title: "Dokumen yang perlu disiapkan" },
  { no: "07", title: "Biaya yang perlu disiapkan" },
  { no: "08", title: "Saat tanda tangan" },
  { no: "09", title: "Isi perjanjian kredit" },
  { no: "10", title: "Hak dan kewajiban debitur" },
  {
    no: "11",
    title: "Hal yang perlu ditanyakan",
  },
];

const SO_TASKS = [
  [
    "Memeriksa kelengkapan dokumen.",
    "Mengumpulkan dan mengecek kelengkapan dokumen fisik setelah keputusan kredit keluar.",
  ],
  [
    "Memproses pelaksanaan akad.",
    "Mengurus kegiatan akad yang melibatkan kamu, pihak luar seperti notaris dan pengembang, serta bagian lain di bank.",
  ],
  [
    "Memproses pencairan.",
    "Mengajukan pencairan dana setelah seluruh persyaratan dokumen akad terpenuhi, baik kelengkapan maupun kesesuaian dokumennya.",
  ],
  [
    "Menyerahkan dokumen.",
    "Menyerahkan dokumen fisik kredit ke bagian penyimpanan dokumen kredit bank, supaya tersimpan dengan aman.",
  ],
];

const ASK_SO = [
  "Dokumen apa saja yang masih kurang",
  "Isi perjanjian kredit dan istilah yang belum kamu pahami",
  "Biaya yang perlu disiapkan saat akad",
  "Proses dan waktu pencairan dana",
];

const FLOW = [
  "Pengajuan",
  "Persetujuan (terbit SP3K)",
  "Akad kredit",
  "Pencairan",
];

const WHO = [
  {
    image: "akad-04-petugas.png",
    alt: "Petugas bank di meja kerja",
    title: "Petugas bank (Signing Officer)",
    text: "Petugas yang melaksanakan akad kredit, menjelaskan isinya, dan memastikan dokumenmu lengkap.",
  },
  {
    image: "akad-05-pasangan.png",
    alt: "Calon debitur dan pasangan",
    title: "Kamu dan pasangan",
    text: "Calon debitur yang menerima fasilitas kredit, bersama pasangan jika sudah menikah. Jika belum menikah, tanyakan ke cabang apakah perlu didampingi wali.",
  },
  {
    image: "akad-06-developer.png",
    alt: "Pengembang menunjukkan rumah",
    title: "Pengembang (developer) atau penjual",
    text: "Pihak yang membangun atau menjual rumah. Penjual wajib menunjukkan dokumen rumah yang asli dan tidak bermasalah.",
  },
  {
    image: "akad-07-notaris.png",
    alt: "Notaris dengan stempel dan dokumen",
    title: "Notaris/PPAT",
    text: "Pejabat umum yang berwenang membuat akta otentik dan melegalisasi perjanjian.",
  },
];

const STEPS: { title: string; text: string; image?: string; alt?: string }[] = [
  {
    title: "Menerima hasil persetujuan",
    text: "Kamu menerima informasi hasil SP3K dan jadwal akad dari petugas bank.",
    image: "akad-08-sp3k.png",
    alt: "Menerima hasil persetujuan (SP3K)",
  },
  {
    title: "Persiapan",
    text: "Lengkapi dokumen persyaratan akad, pastikan saldo tabungan cukup untuk biaya pra realisasi (BiPra), dan pastikan biaya asuransi serta dana jaminan yang ditahan sudah sesuai.",
  },
  {
    title: "Pemeriksaan dokumen",
    text: "Signing Officer memeriksa kelengkapan dokumen sesuai daftar periksa. Jika ada yang kurang, kamu diminta melengkapinya lewat petugas bank.",
    image: "akad-09-periksa.png",
    alt: "Pemeriksaan kelengkapan dokumen",
  },
  {
    title: "Hari akad",
    text: "Identitasmu dan pasangan dicek, isi akad dijelaskan, lalu perjanjian ditandatangani bersama pihak bank dan notaris.",
    image: "akad-10-tandatangan.png",
    alt: "Penandatanganan akad bersama bank dan notaris",
  },
  {
    title: "Setelah akad",
    text: "Dokumen akad diproses dan diserahkan ke bagian terkait di bank.",
  },
  {
    title: "Pencairan",
    text: "Bank memverifikasi persyaratan pencairan, lalu dana dicairkan setelah dipotong dana jaminan yang ditahan. Pada KPR, dana umumnya dicairkan ke rekening pengembang. Tanyakan kepastiannya ke petugas.",
    image: "akad-11-pencairan.png",
    alt: "Pencairan dana",
  },
];

const APPRAISAL_CHECK = [
  "Kebenaran lokasi dan data agunan",
  "Keadaan fisik rumah atau bangunan",
  "Pemilik dan penghuni agunan",
  "Nilai agunan",
  "Dokumen penting yang berkaitan dengan agunan",
];

const APPRAISAL_KNOW = [
  "Penilai dapat mengunjungi lokasi rumah untuk melihat langsung kondisinya",
  "Ada biaya jasa penilaian. Tanyakan besarnya ke petugas bank",
  "Hasil penilaian memiliki masa berlaku. Jika akad tertunda cukup lama, penilaian ulang mungkin diperlukan, jadi tanyakan ketentuannya ke petugas",
];

const DOCS = [
  "KTP kamu dan pasangan (fotokopi dan asli untuk dicocokkan)",
  "Kartu Keluarga",
  "Surat nikah, jika sudah menikah",
  "NPWP",
  "Slip gaji atau bukti penghasilan terbaru",
  "Surat persetujuan kredit (SP3K)",
  "Saldo tabungan yang cukup untuk biaya pra realisasi (BiPra)",
];

const COSTS = [
  [
    "Uang muka (DP)",
    "Dibayar di awal transaksi jual beli rumah. Biasanya porsi terbesar dari biaya awal.",
  ],
  [
    "Biaya pra realisasi (BiPra)",
    "Biaya awal yang perlu tersedia di tabunganmu sebelum akad.",
  ],
  [
    "Provisi dan administrasi",
    "Biaya jasa persetujuan kredit dan biaya administrasi bank.",
  ],
  [
    "Notaris, APHT, dan BPHTB",
    "Biaya jasa notaris, pengikatan hak tanggungan atas rumah, dan pajak perolehan hak atas tanah dan bangunan.",
  ],
  [
    "Biaya penilaian agunan (appraisal)",
    "Biaya jasa penilaian rumah oleh bank atau penilai independen.",
  ],
  [
    "Asuransi kerugian",
    "Melindungi rumah dari risiko kebakaran, bencana, dan kerusakan lain.",
  ],
  [
    "Asuransi jiwa kredit",
    "Jika debitur meninggal dunia, sisa pokok pinjaman dilunasi asuransi dan tidak dibebankan ke ahli waris.",
  ],
  [
    "Angsuran pertama",
    "Cicilan pertama, biasanya jatuh tempo sekitar 1 bulan setelah akad.",
  ],
];

const SIGN = [
  [
    "Pengecekan identitas.",
    "Petugas memastikan kamu dan pasangan yang hadir adalah orang yang benar.",
  ],
  [
    "Penjelasan akad.",
    "Signing Officer menjelaskan isi akad, termasuk hak dan kewajibanmu.",
  ],
  [
    "Penandatanganan.",
    "Kamu, pasangan, dan pejabat bank menandatangani perjanjian. Perjanjian dilegalisasi oleh notaris.",
  ],
  [
    "Pemeriksaan akhir.",
    "Petugas memastikan perjanjian dan dokumen pendukungnya sudah lengkap.",
  ],
];

const CONTRACT = [
  ["Para pihak", "Identitas bank dan debitur yang membuat perjanjian."],
  ["Fasilitas kredit", "Jenis dan jumlah (plafon) kredit yang diberikan."],
  ["Jangka waktu", "Lamanya kredit harus dilunasi (tenor)."],
  ["Bunga dan biaya", "Besaran bunga serta biaya yang harus dibayar debitur."],
  [
    "Jaminan (agunan)",
    "Barang yang dijadikan jaminan, misalnya rumah yang dibeli.",
  ],
  ["Pelunasan", "Cara dan ketentuan pembayaran angsuran sampai lunas."],
  [
    "Ketentuan lain",
    "Hal yang terjadi bila kewajiban tidak dipenuhi, serta aturan tambahan.",
  ],
];

const RIGHTS = [
  "Mendapat penjelasan yang jelas mengenai isi perjanjian sebelum menandatangani",
  "Menerima fasilitas kredit sesuai yang disepakati dalam perjanjian",
  "Memperoleh salinan perjanjian dan informasi mengenai kewajiban pembayaran",
  "Mendapat kembali dokumen jaminan setelah kredit dilunasi sesuai ketentuan",
];

const DUTIES = [
  "Melunasi kredit sesuai jangka waktu, bunga, dan biaya yang disepakati",
  "Membayar angsuran tepat waktu",
  "Menjaga dan memelihara agunan yang dijaminkan",
  "Menyampaikan kepada bank bila ada perubahan data atau kondisi yang memengaruhi kredit",
];

const KEEP = [
  "Perjanjian Kredit, sebagai acuan jika terjadi kesalahpahaman selama masa kredit",
  "Polis asuransi kebakaran dan polis asuransi jiwa kredit",
  "Salinan dokumen pengikatan jaminan, seperti SKMHT atau APHT",
  "Setelah kredit lunas: surat pelunasan dan sertifikat asli dari bank",
];

const QUESTIONS = [
  "Berapa total biaya yang harus saya bayar saat akad?",
  "Berapa besar cicilan, jangka waktu (tenor), dan bunga kredit saya?",
  "Apa yang terjadi jika saya terlambat membayar angsuran (denda dan sanksi)?",
  "Dokumen apa saja yang akan saya terima salinannya?",
  "Kapan penilaian rumah dilakukan, dan berapa biayanya?",
  "Kapan dan ke rekening mana dana kredit akan dicairkan?",
  "Apa arti istilah dalam perjanjian yang belum saya pahami?",
  "Apakah nama, nomor identitas, dan data agunan pada dokumen sudah benar?",
];

const REMEMBER = [
  "Pastikan identitas dan datamu benar.",
  "Pahami isi perjanjian sebelum menandatangani.",
  "Jangan ragu bertanya kepada Signing Officer.",
];

/** Daftar centang yang tersimpan di browser pengunjung. */
function Checklist({
  storeKey,
  items,
  doneLabel,
}: {
  storeKey: string;
  items: string[];
  doneLabel: string;
}) {
  const key = `finora_akad_${storeKey}`;
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown;
      if (Array.isArray(raw)) return items.map((_, i) => raw[i] === true);
    } catch {
      /* abaikan */
    }
    return items.map(() => false);
  });
  const toggle = (i: number) => {
    const next = checked.map((v, j) => (j === i ? !v : v));
    setChecked(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* abaikan */
    }
  };
  const done = checked.filter(Boolean).length;
  return (
    <div className="checklist">
      <ul>
        {items.map((t, i) => (
          <li key={t}>
            <label className={checked[i] ? "on" : ""}>
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
              />
              <span className="box">
                {checked[i] && <Icon name="check" size={14} />}
              </span>
              <span>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="checklist-foot">
        <span>
          {done} dari {items.length} {doneLabel}
        </span>
        <i style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="tip-list plain">
      {items.map((t) => (
        <li key={t}>
          <Icon name="check" size={18} />
          <p>{t}</p>
        </li>
      ))}
    </ul>
  );
}

function NumberList({ items }: { items: string[][] }) {
  return (
    <ul className="tip-list">
      {items.map(([t, d], i) => (
        <li key={t}>
          <span className="num">{i + 1}</span>
          <p>
            <b>{t}</b> {d}
          </p>
        </li>
      ))}
    </ul>
  );
}

function InfoTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: string[][];
}) {
  return (
    <div className="table-wrap">
      <table className="compare-table two">
        <thead>
          <tr>
            <th>{head[0]}</th>
            <th>{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <th scope="row">{a}</th>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AkadKpr() {
  const go = useGo();
  const [active, setActive] = useState(0);

  const pick = (i: number) => {
    setActive(i);
    document
      .getElementById("akad-top")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const prev = SECTIONS[active - 1];
  const next = SECTIONS[active + 1];
  const cur = SECTIONS[active];

  return (
    <section id="akad-kpr" className="section sc-section">
      <div className="container">
        <button className="inline-link back-link" onClick={() => go("learn")}>
          ← Semua materi
        </button>
        <div className="sc-hero akad-hero">
          <div className="sc-copy">
            <div className="section-kicker light">
              KPR DI BTN · SIGNING OFFICER DAN AKAD KREDIT
            </div>
            <h2>
              Kredit saya sudah disetujui, lalu apa yang terjadi saat akad?
            </h2>
            <p>
              Setelah pengajuan kredit disetujui, perjalananmu belum selesai.
              Masih ada satu tahap penting: akad kredit. Di tahap inilah
              kesepakatan antara kamu dan bank dituangkan secara tertulis. Kamu
              akan didampingi Signing Officer (SO), petugas bank yang memproses
              akad, memeriksa kelengkapan dokumen, dan menyiapkan proses
              pencairan.
            </p>
          </div>
          <figure className="sc-hero-photo">
            <img
              src={img("akad-01-intro.png")}
              alt="Ilustrasi rumah dan perjanjian kredit"
            />
          </figure>
        </div>

        <div className="course-layout" id="akad-top">
          <aside className="course-sidebar">
            <div className="course-label">DAFTAR MATERI</div>
            {SECTIONS.map((s, i) => (
              <button
                key={s.no}
                className={active === i ? "active" : ""}
                onClick={() => pick(i)}
              >
                <span>{s.no}</span>
                <div>
                  <b>{s.title}</b>
                </div>
                <Icon name="chevron" size={16} />
              </button>
            ))}
            <div className="course-progress">
              <div>
                <span>Progres materi</span>
                <b>
                  {active + 1} dari {SECTIONS.length}
                </b>
              </div>
              <div className="progress">
                <i
                  style={{
                    width: `${((active + 1) / SECTIONS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </aside>

          <div className="course-content">
            <article className="chapter-card">
              <header className="chapter-header">
                <span>{cur.no}</span>
                <div>
                  <small>
                    MATERI {active + 1} DARI {SECTIONS.length}
                  </small>
                  <h2>{cur.title}</h2>
                </div>
                <div className="chapter-status">
                  <Icon name="document" size={16} /> Akad kredit KPR
                </div>
              </header>

              {active === 0 && (
                <>
                  <div className="split">
                    <div>
                      <div className="section-kicker">
                        SIAPA SIH SIGNING OFFICER (SO) ITU?
                      </div>
                      <p>
                        Signing Officer (SO) adalah petugas bank yang
                        mendampingimu di tahap akad kredit sampai persiapan
                        pencairan. Kamu akan berhubungan dengan SO saat
                        dokumenmu diperiksa, saat akad ditandatangani, dan saat
                        dana akan dicairkan.
                      </p>
                    </div>
                    <figure className="figure">
                      <img
                        src={img("akad-02-so.jpg")}
                        alt="Signing Officer bekerja di meja dengan laptop"
                        loading="lazy"
                      />
                    </figure>
                  </div>
                  <h3 className="sub-title">Tanggung jawab Signing Officer</h3>
                  <NumberList items={SO_TASKS} />
                  <h3 className="sub-title">
                    Apa yang bisa kamu tanyakan ke SO
                  </h3>
                  <BulletList items={ASK_SO} />
                </>
              )}

              {active === 1 && (
                <>
                  <div className="split">
                    <div>
                      <p>
                        Akad kredit adalah proses penandatanganan Perjanjian
                        Kredit dan/atau akta lainnya oleh bank dan debitur atas
                        pemberian kredit, dengan persyaratan yang telah
                        disepakati. Dengan akad, debitur wajib melunasi kredit
                        dalam jangka waktu tertentu, disertai bunga dan biaya
                        yang disepakati.
                      </p>
                    </div>
                    <figure className="figure">
                      <img
                        src={img("akad-03-akad.jpg")}
                        alt="Calon debitur membaca dokumen perjanjian"
                        loading="lazy"
                      />
                    </figure>
                  </div>
                  <div className="money-tip">
                    <Icon name="spark" />
                    <p>
                      <b>Singkatnya</b> Akad adalah saat janji antara kamu dan
                      bank dibuat secara tertulis dan sah. Setelah
                      ditandatangani, isi perjanjian mengikat kedua pihak.
                    </p>
                  </div>
                  <h3 className="sub-title">Posisi akad dalam alur kredit</h3>
                  <ol className="flow-chips">
                    {FLOW.map((f, i) => (
                      <li key={f} className={i === 2 ? "hl" : ""}>
                        <span>{i + 1}</span>
                        {f}
                      </li>
                    ))}
                  </ol>
                  <p>Pada tahap akad inilah Signing Officer mendampingimu.</p>
                </>
              )}

              {active === 2 && (
                <div className="who-grid">
                  {WHO.map((w) => (
                    <article key={w.title}>
                      <img src={img(w.image)} alt={w.alt} loading="lazy" />
                      <div>
                        <h4>{w.title}</h4>
                        <p>{w.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {active === 3 && (
                <>
                  <p>
                    Setelah kredit disetujui, bank menerbitkan Surat Persetujuan
                    Pemberian Kredit (SP3K). Setelah itu prosesnya berjalan
                    seperti berikut.
                  </p>
                  <ol className="step-list">
                    {STEPS.map((s, i) => (
                      <li key={s.title}>
                        <span className="step-no">{i + 1}</span>
                        <div className="step-body">
                          <h4>
                            Langkah {i + 1}: {s.title}
                          </h4>
                          <p>{s.text}</p>
                          {s.image && (
                            <img
                              src={img(s.image)}
                              alt={s.alt}
                              loading="lazy"
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="important-note">
                    <Icon name="shield" />
                    <p>
                      <b>Perlu diketahui</b> Akad dilakukan setelah biaya dana
                      jaminan yang ditahan (misalnya bestek, listrik, air, JKK,
                      sertifikat, dan IMB) sudah sesuai. Keterlambatan dokumen
                      dari developer dapat menunda pencairan.
                    </p>
                  </div>
                </>
              )}

              {active === 4 && (
                <>
                  <div className="split">
                    <div>
                      <p>
                        Penilaian agunan adalah proses pemeriksaan untuk
                        memastikan rumah yang kamu beli, yang menjadi jaminan
                        kredit, benar data dan kondisinya. Hasilnya menjadi
                        dasar bank dalam memutuskan kredit. Penilaian dilakukan
                        oleh bank atau penilai independen (appraisal).
                      </p>
                    </div>
                    <figure className="figure">
                      <img
                        src={img("akad-12-appraisal.png")}
                        alt="Penilaian rumah sebagai agunan"
                        loading="lazy"
                      />
                    </figure>
                  </div>
                  <h3 className="sub-title">Apa saja yang diperiksa?</h3>
                  <BulletList items={APPRAISAL_CHECK} />
                  <h3 className="sub-title">
                    Pemeriksaan akhir sebelum akad (LPA)
                  </h3>
                  <p>
                    Pada pembelian rumah dari developer, bank juga membuat
                    Laporan Pemeriksaan Akhir (LPA) untuk memastikan kesiapan
                    fisik bangunan serta sarana dan prasarananya sebelum akad.
                    Hal ini penting karena rumah menjadi jaminan kredit. Akad
                    dilaksanakan setelah LPA selesai.
                  </p>
                  <h3 className="sub-title">Yang perlu kamu ketahui</h3>
                  <BulletList items={APPRAISAL_KNOW} />
                </>
              )}

              {active === 5 && (
                <>
                  <p>
                    Syarat akhir mengikuti ketentuan cabang tempat kamu
                    mengajukan.
                  </p>
                  <h3 className="sub-title">Dokumen dari kamu</h3>
                  <Checklist
                    storeKey="dokumen"
                    items={DOCS}
                    doneLabel="dokumen siap"
                  />
                  <div className="money-tip">
                    <Icon name="spark" />
                    <p>
                      Dokumen agunan seperti sertifikat, IMB/PBG, dan bukti
                      pembayaran PBB disiapkan oleh penjual atau pengembang
                      bersama bank. Kamu cukup memastikan nama dan data di semua
                      dokumen sudah sama.
                    </p>
                  </div>
                </>
              )}

              {active === 6 && (
                <>
                  <p>
                    Besarnya berbeda-beda tergantung produk, bank, dan nilai
                    rumah. Tanyakan rinciannya ke petugas sebelum akad.
                  </p>
                  <InfoTable
                    head={["Biaya", "Penjelasan singkat"]}
                    rows={COSTS}
                  />
                </>
              )}

              {active === 7 && (
                <>
                  <NumberList items={SIGN} />
                  <div className="money-tip">
                    <Icon name="spark" />
                    <p>
                      <b>Tips</b> Baca seluruh isi dokumen, periksa kesesuaian
                      nama dan angka, dan jangan ragu bertanya sebelum tanda
                      tangan. Jika persyaratan terasa memberatkan, kamu berhak
                      mempertimbangkannya kembali sebelum menandatangani.
                    </p>
                  </div>
                </>
              )}

              {active === 8 && (
                <>
                  <p>
                    Perjanjian Kredit adalah dokumen utama yang ditandatangani
                    saat akad.
                  </p>
                  <InfoTable
                    head={["Bagian", "Penjelasan sederhana"]}
                    rows={CONTRACT}
                  />
                </>
              )}

              {active === 9 && (
                <>
                  <p>
                    Setelah akad, kamu dan bank sama-sama terikat pada isi
                    perjanjian.
                  </p>
                  <div className="pair-lists">
                    <div className="nw need">
                      <b>Hak debitur</b>
                      <ul>
                        {RIGHTS.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="nw want">
                      <b>Kewajiban debitur</b>
                      <ul>
                        {DUTIES.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <h3 className="sub-title">
                    Dokumen yang kamu terima dan simpan
                  </h3>
                  <BulletList items={KEEP} />
                </>
              )}

              {active === 10 && (
                <>
                  <p>
                    Pastikan semua pertanyaanmu sudah terjawab. Beberapa
                    pertanyaan yang baik untuk diajukan kepada Signing Officer:
                  </p>
                  <Checklist
                    storeKey="pertanyaan"
                    items={QUESTIONS}
                    doneLabel="pertanyaan sudah ditanyakan"
                  />
                  <h3 className="sub-title">Tiga hal yang perlu diingat</h3>
                  <ol className="remember">
                    {REMEMBER.map((r, i) => (
                      <li key={r}>
                        <span>{i + 1}</span>
                        <p>{r}</p>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              <div className="chapter-pager">
                {prev ? (
                  <button onClick={() => pick(active - 1)}>
                    <small>Sebelumnya</small>
                    <b>{prev.title}</b>
                  </button>
                ) : (
                  <span />
                )}
                {next ? (
                  <button className="next" onClick={() => pick(active + 1)}>
                    <small>Selanjutnya</small>
                    <b>{next.title}</b>
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

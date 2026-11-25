import { Link } from "react-router"

import { Icon } from "@/components/Icon"

import { LessonReader } from "@/components/LessonReader"

const CONTENT = `## Dasar Keuangan Pribadi

### Kenali arus uangmu

Keuangan pribadi dimulai dari memahami uang yang masuk dan keluar. Catat penghasilan, kebutuhan rutin, cicilan, tabungan, dan pengeluaran lain agar keputusan dibuat berdasarkan kondisi nyata.

### Susun prioritas

Penuhi kebutuhan pokok dan kewajiban terlebih dahulu, siapkan dana untuk kebutuhan tak terduga, lalu tentukan target tabungan dan keinginan. Pembagian anggaran adalah panduan yang bisa disesuaikan dengan situasi setiap orang.

## Pencatatan Keuangan

### Catat setiap transaksi

Tuliskan tanggal, keterangan, jumlah, dan jenis transaksi sesegera mungkin. Catatan kecil untuk transportasi, makan, tagihan, dan belanja membantu melihat pola pengeluaran yang sering terlewat.

### Kelompokkan dengan konsisten

Pisahkan pemasukan, pengeluaran, dan tabungan. Tandai pengeluaran sebagai kebutuhan atau keinginan supaya lebih mudah menentukan bagian yang dapat disesuaikan.

## Evaluasi Keuangan

### Tinjau hasil setiap bulan

Bandingkan total pemasukan dengan pengeluaran, cicilan, dan tabungan. Perhatikan sisa uang, target tabungan yang tercapai, serta perubahan dibandingkan bulan sebelumnya.

### Ambil langkah berikutnya

Jika pengeluaran lebih besar dari pemasukan, cari pos yang bisa dikurangi dan susun ulang anggaran. Jika target tercapai, lanjutkan kebiasaan yang membantu dan sesuaikan target berikutnya. Evaluasi rutin lebih berguna daripada menunggu sampai muncul masalah.`

export default function PersonalFinance() {
  return (
    <section className="lesson-detail min-h-screen py-10 sm:py-14">
      <div className="lesson-reader-container mx-auto">
        <Link
          className="back-link inline-flex items-center gap-2 font-semibold text-[#064a91] transition hover:gap-3"
          to="/learn"
        >
          <Icon name="back" size={17} />
          Semua tema
        </Link>

        <header className="lesson-detail-head">
          <div className="lesson-detail-badge">
            <Icon name="wallet" size={15} />
            TEMA BELAJAR
          </div>
          <h1 className="lesson-title">Keuangan Pribadi</h1>
          <p className="lesson-lead">
            Pelajari dasar mengatur uang, membiasakan pencatatan, dan
            mengevaluasi kondisi keuangan secara berkala.
          </p>
          <div className="lesson-reading-meta">
            <span>
              <Icon name="document" size={15} />3 bab
            </span>
            <span>
              <Icon name="check" size={15} />
              Materi singkat dan bisa langsung dipraktikkan
            </span>
          </div>
        </header>

        <div className="lesson-detail-body">
          <LessonReader text={CONTENT} />
        </div>

        <div className="mt-8 rounded-3xl bg-[#064a91] p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div>
            <h2 className="font-[Plus_Jakarta_Sans] text-xl font-extrabold">
              Siap mencoba mencatat?
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Buka kalkulator untuk mencatat transaksi dan melihat ringkasan
              keuanganmu.
            </p>
          </div>
          <Link
            className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ffc400] px-5 py-3 text-sm font-extrabold text-[#064a91] transition hover:bg-yellow-300 sm:mt-0"
            to="/calculate"
          >
            Buka kalkulator
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

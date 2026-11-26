import { getMediaUrl } from "@/lib/media";

export type RelatedMaterial =
  | {
      title: string;
      summary: string;
      target: "lesson";
      slug: string;
    }
  | {
      title: string;
      summary: string;
      target: "calculate" | "sc-btn";
    };

export type MaterialBlock =
  | {
      type: "text";
      content: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption: string;
    };

export type MaterialSubchapter = {
  title: string;
  blocks: MaterialBlock[];
  related?: RelatedMaterial[];
};

export type MaterialChapter = {
  slug: string;
  title: string;
  summary: string;
  subchapters: MaterialSubchapter[];
};

const text = (content: string): MaterialBlock => ({ type: "text", content });

const image = (
  fileName: string,
  alt: string,
  caption: string,
): MaterialBlock => ({
  type: "image",
  src: getMediaUrl(`materi/investasi-deposito/${fileName}`),
  alt,
  caption,
});

export const INVESTMENT_CHAPTERS: MaterialChapter[] = [
  {
    slug: "investasi",
    title: "BAB 1: Investasi",
    summary:
      "Kenali pengertian, tujuan, jenis aset, risiko, dan jangka waktu investasi.",
    subchapters: [
      {
        title: "1 Menit Kenal Investasi",
        blocks: [
          text(
            "Investasi adalah kegiatan menempatkan uang atau sumber daya pada suatu aset saat ini dengan harapan memperoleh manfaat ekonomi pada masa mendatang. Manfaat tersebut dapat berupa pendapatan berkala atau peningkatan nilai aset.\n\nSederhananya, investasi merupakan salah satu cara untuk mempersiapkan kebutuhan keuangan di masa depan. Dana yang dimiliki saat ini direncanakan dan dialokasikan agar dapat membantu mencapai tujuan tertentu di kemudian hari.\n\nCatatan: investasi bukan sekadar menyimpan uang dan menunggu hasil. Setiap pilihan memiliki karakteristik, potensi imbal hasil, jangka waktu, dan risiko yang perlu dipahami. Hasil investasi tidak selalu pasti, sehingga keputusan sebaiknya didasarkan pada tujuan dan kondisi keuangan, bukan hanya pada besarnya potensi keuntungan.",
          ),
        ],
      },
      {
        title: "Tujuan Investasi",
        blocks: [
          text(
            "Tujuan investasi membantu menentukan pilihan aset, jangka waktu, serta tingkat risiko yang sesuai. Beberapa tujuan yang umum antara lain:\n\n- **Mempersiapkan masa depan:** mengalokasikan dana untuk kebutuhan yang direncanakan.\n- **Menjaga daya beli:** mempertimbangkan pengaruh inflasi terhadap nilai uang.\n- **Memperoleh manfaat ekonomi:** mengharapkan bunga, kupon, pembagian hasil, atau kenaikan nilai aset sesuai karakteristik instrumen.\n- **Memenuhi kebutuhan dan keinginan:** menyusun rencana pendanaan untuk tujuan tertentu.\n- **Memperhitungkan hasil bersih:** melihat hasil setelah pajak, biaya, dan faktor lain yang berlaku.",
          ),
          text(
            "Sebelum berinvestasi, pastikan kebutuhan rutin dan dana darurat tetap tersedia. Sesuaikan rencana dengan kondisi keuangan dan jangan hanya berfokus pada potensi keuntungan.",
          ),
        ],
        related: [
          {
            title: "Keuangan Pribadi",
            summary:
              "Catat pemasukan dan pengeluaran untuk menyusun target keuangan.",
            target: "calculate",
          },
        ],
      },
      {
        title: "Proses Keputusan Investasi",
        blocks: [
          text(
            "Sebelum memilih instrumen, investor perlu menjalani proses keputusan investasi secara bertahap:\n\n1. **Menentukan tujuan:** tetapkan kebutuhan, nominal dana, dan waktu penggunaan.\n2. **Menentukan kebijakan investasi:** pahami profil risiko, kemampuan dana, fleksibilitas waktu, serta pengetahuan yang dimiliki.\n3. **Memilih strategi dan aset:** susun pilihan aset atau portofolio yang sesuai dengan tujuan dan toleransi risiko.\n4. **Mengukur dan mengevaluasi:** tinjau kinerja dan kesesuaian investasi terhadap tujuan secara berkala.",
          ),
          text(
            "Portofolio yang beragam dapat membantu menyebar penempatan, tetapi tidak menghilangkan seluruh risiko. Evaluasi juga tidak berarti hasil investasi akan selalu positif.",
          ),
        ],
      },
      {
        title: "Jenis Aset Investasi",
        blocks: [
          text(
            "Secara sederhana, aset investasi dapat dibedakan menjadi aset riil dan aset keuangan.\n\n- **Aset riil (real asset):** memiliki wujud fisik dan dapat dimanfaatkan untuk memenuhi kebutuhan atau mendukung kegiatan ekonomi. Contohnya tanah, bangunan, emas, mesin, dan kendaraan operasional.\n- **Aset keuangan (financial asset):** memberikan hak atau klaim keuangan kepada pemiliknya berdasarkan ketentuan atau hubungan kontraktual tertentu. Contohnya saham, obligasi, dan instrumen simpanan seperti deposito.\n\nMeskipun sama-sama termasuk aset keuangan, deposito, saham, dan obligasi memiliki mekanisme serta karakteristik yang berbeda.",
          ),
        ],
      },
      {
        title: "Imbal Hasil dan Daya Beli",
        blocks: [
          text(
            "Uang yang dimiliki saat ini belum tentu memiliki daya beli yang sama pada masa mendatang. Karena itu, imbal hasil dan inflasi perlu dipertimbangkan saat merencanakan kebutuhan keuangan.\n\n**Imbal hasil (return)** adalah manfaat ekonomi dari penempatan dana. Bentuknya dapat berupa bunga, kupon, pembagian hasil, atau kenaikan nilai aset. **Inflasi** adalah kenaikan harga barang dan jasa secara umum dan berkelanjutan. Ketika harga naik, jumlah uang yang sama dapat membeli lebih sedikit barang atau jasa dibandingkan sebelumnya.",
          ),
        ],
      },
      {
        title: "Risiko Investasi",
        blocks: [
          text(
            "Risiko investasi adalah kemungkinan hasil yang diterima berbeda dari harapan, termasuk kemungkinan kehilangan sebagian nilai dana. Setiap instrumen memiliki karakteristik risiko yang berbeda.\n\n- **Risiko pasar:** nilai instrumen dapat berubah mengikuti kondisi pasar. Harga obligasi di pasar sekunder, misalnya, dapat berubah karena kondisi pasar dan suku bunga.\n- **Risiko likuiditas:** aset mungkin tidak mudah dicairkan ketika dana dibutuhkan.\n- **Risiko gagal bayar:** penerbit atau pihak yang berkewajiban membayar tidak memenuhi kewajibannya.\n- **Risiko inflasi:** imbal hasil tidak mampu mengimbangi kenaikan harga barang dan jasa.\n- **Risiko suku bunga:** perubahan suku bunga dapat memengaruhi nilai atau daya tarik instrumen.\n- **Risiko operasional atau penipuan:** kerugian dapat terjadi akibat kesalahan proses, penyalahgunaan, atau tawaran investasi ilegal.\n- **Risiko nilai tukar:** perubahan kurs dapat memengaruhi nilai dana ketika dikonversi ke mata uang lain.",
          ),
          text(
            "Pahami risiko sebelum memilih instrumen dan waspadai tawaran yang menjanjikan keuntungan pasti. Deposito dengan mata uang asing juga memiliki risiko kurs ketika dana dikonversi kembali ke Rupiah.",
          ),
        ],
      },
      {
        title: "Jangka Waktu Investasi",
        blocks: [
          text(
            "Jangka waktu investasi sebaiknya disesuaikan dengan kapan dana akan digunakan. Berikut gambaran sederhana untuk menyusun tujuan:",
          ),
          text(
            "| Jangka waktu | Contoh tujuan | Hal yang perlu dipertimbangkan |\n| --- | --- | --- |\n| Pendek - kurang dari 1 tahun | Biaya pendidikan dalam beberapa bulan atau kebutuhan terencana | Sesuaikan waktu pencairan dan risiko dengan kebutuhan |\n| Menengah - 1 hingga 5 tahun | Uang muka rumah, pendidikan lanjutan, atau modal usaha | Sesuaikan instrumen dengan jadwal dan kemampuan menerima risiko |\n| Panjang - lebih dari 5 tahun | Dana pensiun atau tujuan keuangan jangka panjang | Jangka waktu panjang tidak menjamin keuntungan; pahami risikonya |",
          ),
          text(
            "Deposito dapat dipertimbangkan ketika dana belum akan digunakan selama periode tertentu. Sesuaikan tenor dengan tanggal kebutuhan dana karena pencairan sebelum jatuh tempo dapat memiliki konsekuensi.",
          ),
        ],
        related: [
          {
            title: "KPR di BTN",
            summary:
              "Pelajari pembiayaan rumah sebagai salah satu tujuan jangka panjang.",
            target: "lesson",
            slug: "kpr-di-btn",
          },
          {
            title: "SC BTN",
            summary:
              "Persiapkan anggaran sebelum merencanakan rumah impian.",
            target: "sc-btn",
          },
          {
            title: "Dokumen Kredit",
            summary:
              "Kenali dokumen yang mungkin diperlukan saat mengajukan kredit.",
            target: "lesson",
            slug: "dokumen-kredit",
          },
        ],
      },
    ],
  },
  {
    slug: "deposito-berjangka",
    title: "BAB 2: Instrumen Investasi Deposito Berjangka",
    summary:
      "Pelajari cara kerja deposito, istilah penting, simulasi bunga, dan penjaminan LPS.",
    subchapters: [
      {
        title: "Pengenalan Deposito Berjangka",
        blocks: [
          image(
            "01.png",
            "Ilustrasi brankas dan kalender untuk menggambarkan penempatan dana deposito dalam jangka waktu tertentu",
            "Deposito menggabungkan penempatan dana dan jangka waktu yang disepakati.",
          ),
          text(
            "Deposito berjangka merupakan produk simpanan perbankan yang penarikannya hanya dapat dilakukan pada waktu tertentu sesuai perjanjian antara nasabah dan bank. Nasabah menempatkan sejumlah dana untuk jangka waktu yang disepakati dan memperoleh bunga sesuai ketentuan produk.\n\nBerbeda dengan tabungan yang umumnya dapat ditarik kapan saja, deposito memiliki jangka waktu atau tenor. Karena itu, deposito dapat dipertimbangkan untuk dana yang sudah memiliki tujuan penggunaan tetapi belum dibutuhkan dalam waktu dekat.\n\nPerlu diketahui: deposito merupakan produk simpanan perbankan, bukan instrumen pasar modal.",
          ),
        ],
      },
      {
        title: "Karakteristik Deposito",
        blocks: [
          text(
            "Karakteristik yang perlu dipahami sebelum membuka deposito:\n\n- **Risiko relatif rendah:** deposito merupakan produk simpanan bank dan dapat memperoleh penjaminan LPS jika memenuhi persyaratan. Penjaminan tidak berarti semua simpanan otomatis dijamin dalam setiap kondisi.\n- **Bunga lebih mudah diperkirakan:** bunga mengikuti ketentuan produk, nominal, tenor, dan kebijakan bank. Perhitungan aktual mengikuti metode bank serta pajak dan biaya yang berlaku.\n- **Memiliki tenor tertentu:** pilihan tenor bergantung pada produk. Sesuaikan tenor dengan waktu penggunaan dana.\n- **Likuiditas terbatas:** dana tidak sebebas tabungan untuk ditarik kapan saja. Pencairan sebelum jatuh tempo dapat menimbulkan konsekuensi.\n- **Potensi imbal hasil relatif terbatas:** kesesuaian deposito tidak hanya ditentukan oleh bunga, tetapi juga tujuan dan kebutuhan likuiditas.\n- **Memiliki risiko daya beli dan suku bunga:** bunga bersih dapat lebih rendah daripada inflasi, sementara bunga untuk penempatan baru atau perpanjangan dapat berubah.\n- **Deposito valas memiliki risiko nilai tukar:** nilai dana dalam Rupiah dapat berubah saat dikonversi.\n- **Dapat memiliki fasilitas agunan:** deposito tertentu dapat digunakan sebagai agunan apabila fasilitas tersedia dan persyaratan bank dipenuhi.",
          ),
          text(
            "Fitur dan ketentuan dapat berbeda antarproduk. Periksa informasi resmi bank sebelum menempatkan dana.",
          ),
        ],
        related: [
          {
            title: "Menabung di BTN",
            summary:
              "Bandingkan tabungan dengan deposito sebelum memilih tempat menyimpan dana.",
            target: "lesson",
            slug: "menabung-di-btn",
          },
        ],
      },
      {
        title: "Istilah Penting dalam Deposito",
        blocks: [
          text(
            "- **Nominal penempatan:** jumlah dana yang disetorkan untuk membuka deposito.\n- **Tenor:** jangka waktu penyimpanan dana yang disepakati.\n- **Suku bunga deposito:** persentase bunga yang diberikan bank; dapat berbeda berdasarkan nominal, tenor, produk, dan kebijakan bank.\n- **Jatuh tempo:** tanggal berakhirnya tenor. Nasabah dapat mencairkan atau memperpanjang deposito sesuai ketentuan.\n- **Automatic Roll Over (ARO):** fasilitas perpanjangan otomatis ketika jatuh tempo. Suku bunga dan ketentuan perpanjangan mengikuti kebijakan yang berlaku saat itu.\n- **Bunga bruto:** bunga sebelum pajak atau potongan.\n- **Bunga bersih:** bunga setelah pajak dan potongan yang berlaku.\n- **Pencairan:** pengambilan dana deposito sesuai ketentuan produk.",
          ),
        ],
      },
      {
        title: "Bagaimana Deposito Bekerja",
        blocks: [
          image(
            "02.png",
            "Infografik tentang nominal penempatan, tenor, bunga, dan tanggal jatuh tempo deposito",
            "Empat hal yang perlu diperiksa saat merencanakan deposito.",
          ),
          text(
            "Secara umum, proses penempatan deposito meliputi langkah berikut:\n\n1. **Menentukan dana:** pilih jumlah yang dapat ditempatkan tanpa mengganggu kebutuhan rutin dan dana darurat.\n2. **Memilih tenor:** sesuaikan jangka waktu yang tersedia dengan tanggal penggunaan dana.\n3. **Memahami bunga dan ketentuan:** periksa suku bunga, metode pembayaran bunga, pajak, biaya, dan ketentuan pencairan.\n4. **Menempatkan dana:** setorkan dana sesuai tenor dan ketentuan yang disepakati dengan bank.\n5. **Menunggu jatuh tempo:** dana ditempatkan hingga jangka waktu berakhir.\n6. **Mencairkan atau memperpanjang:** tentukan langkah saat jatuh tempo sesuai ketentuan produk.",
          ),
          text(
            "Jika deposito dicairkan sebelum jatuh tempo, bank dapat menerapkan penalti atau biaya pencairan, mengurangi atau tidak membayar bunga berjalan, atau menerapkan konsekuensi lain sesuai perjanjian. Kebijakan setiap bank dapat berbeda, jadi pastikan memahami ketentuannya sebelum membuka deposito.",
          ),
        ],
      },
      {
        title: "Simulasi Bunga Deposito",
        blocks: [
          text(
            "Bunga deposito dihitung berdasarkan nominal penempatan, suku bunga, dan lamanya dana disimpan. Pembayaran bunga dapat dilakukan secara berkala atau pada saat jatuh tempo, bergantung pada ketentuan produk.\n\n**Rumus ilustrasi bunga bruto:**\n\nBunga = Nominal deposito x Suku bunga tahunan x (Jangka waktu dalam bulan / 12)\n\nContoh: Rina menempatkan Rp10.000.000 dengan suku bunga ilustratif 4% per tahun selama 3 bulan.\n\n- Bunga bruto: Rp10.000.000 x 4% x (3 / 12) = Rp100.000\n- Jika dikenai PPh final 20%: Rp20.000\n- Ilustrasi bunga bersih: Rp80.000\n\nTotal dana pada saat jatuh tempo menjadi Rp10.080.000 jika bunga dibayarkan bersama pokok dan tidak ada biaya atau ketentuan lain.\n\nCatatan: angka bunga dan pajak di atas hanya untuk ilustrasi, bukan penawaran suku bunga atau perhitungan resmi bank. Perhitungan aktual dapat mengikuti metode penghitungan hari, ketentuan pajak, biaya, dan aturan masing-masing bank. Bandingkan hasil bersih, bukan hanya suku bunga sebelum pajak.",
          ),
          image(
            "03.png",
            "Contoh tampilan input simulasi bunga deposito dengan nominal sepuluh juta rupiah, bunga ilustratif empat persen, dan tenor tiga bulan",
            "Contoh masukan pada simulasi bunga deposito.",
          ),
          image(
            "04.png",
            "Contoh ringkasan hasil simulasi bunga bruto seratus ribu rupiah, ilustrasi pajak dua puluh ribu rupiah, dan bunga bersih delapan puluh ribu rupiah",
            "Contoh hasil bunga bruto dan bersih dalam simulasi.",
          ),
        ],
      },
      {
        title: "Penjaminan LPS",
        blocks: [
          text(
            "Deposito termasuk jenis simpanan bank yang dapat memperoleh penjaminan dari Lembaga Penjamin Simpanan (LPS), tetapi penjaminan tidak berlaku otomatis untuk semua kondisi. Secara umum, simpanan perlu memenuhi persyaratan 3T:\n\n- **Tercatat:** simpanan tercatat dalam pembukuan bank.\n- **Tingkat bunga:** bunga yang diterima tidak melebihi Tingkat Bunga Penjaminan LPS yang berlaku.\n- **Tidak merugikan bank:** nasabah tidak melakukan tindakan yang menyebabkan simpanan tidak memenuhi ketentuan penjaminan.\n\nBatas penjaminan dan seluruh persyaratannya mengikuti ketentuan LPS yang berlaku. Tingkat bunga penjaminan dapat berubah secara berkala, jadi periksa informasi terbaru dari LPS dan bank sebelum menempatkan dana.",
          ),
        ],
      },
      {
        title: "Kesimpulan Deposito",
        blocks: [
          text(
            "| Kelebihan | Hal yang perlu diperhatikan |\n| --- | --- |\n| Memiliki tenor dan ketentuan bunga sesuai produk | Dana tidak sebebas tabungan untuk ditarik sewaktu-waktu |\n| Membantu merencanakan penempatan dana | Pencairan sebelum jatuh tempo dapat menimbulkan konsekuensi |\n| Tidak mengalami fluktuasi harga harian seperti efek yang diperdagangkan | Bunga dapat dikenai pajak sesuai ketentuan |\n| Dapat memperoleh penjaminan LPS jika memenuhi persyaratan | Hasil bersih perlu dibandingkan dengan inflasi |\n| Produk tertentu tersedia dalam beberapa mata uang | Deposito valas memiliki risiko nilai tukar |",
          ),
          text(
            "Suku bunga, tenor, minimum penempatan, biaya, dan ketentuan produk dapat berubah. Selalu periksa informasi resmi sebelum melakukan transaksi.",
          ),
        ],
      },
    ],
  },
  {
    slug: "produk-deposito-btn",
    title: "BAB 3: Produk Deposito BTN",
    summary:
      "Kenali deposito BTN untuk nasabah perorangan, lembaga, dan penempatan on call.",
    subchapters: [
      {
        title: "Mengenal Produk Deposito BTN",
        blocks: [
          text(
            "Bank BTN menyediakan produk deposito ritel dalam mata uang Rupiah dan mata uang asing. Produk ini dapat dipelajari oleh nasabah yang ingin menempatkan dana untuk jangka waktu tertentu sesuai tujuan keuangannya.\n\nSetiap produk memiliki segmen nasabah, mata uang, pilihan pengelolaan bunga, persyaratan, dan mekanisme pencairan yang berbeda.",
          ),
          image(
            "05.png",
            "Ringkasan Deposito BTN Ritel dan Deposito BTN Lembaga",
            "Gambaran dua kelompok produk deposito BTN.",
          ),
          image(
            "06.png",
            "Ringkasan produk Deposito BTN Lembaga untuk perusahaan atau badan usaha",
            "Deposito BTN Lembaga ditujukan untuk kebutuhan penempatan dana organisasi.",
          ),
        ],
      },
      {
        title: "Deposito BTN Ritel",
        blocks: [
          text(
            "Deposito BTN Ritel merupakan produk simpanan berjangka yang ditujukan bagi nasabah perorangan untuk mengelola dana yang tidak perlu digunakan dalam waktu dekat. Produk ini dapat dipertimbangkan setelah kebutuhan sehari-hari dan dana darurat disiapkan.",
          ),
          image(
            "07.png",
            "Identitas produk Deposito BTN Ritel Rupiah",
            "Contoh tampilan produk Deposito BTN Ritel Rupiah pada materi sumber.",
          ),
          text(
            "### Deposito BTN Ritel Rupiah\n\nDeposito ini menggunakan Rupiah sebagai mata uang penempatan. Sesuaikan nominal dan tenor dengan tujuan dana, lalu periksa bunga, metode pembayaran, pencairan, dan kanal pembukaan yang tersedia. Materi sumber menyebutkan pembukaan melalui kantor cabang dan e-Deposito melalui balé by BTN; periksa kembali ketersediaan serta ketentuannya sebelum digunakan.\n\n### Deposito BTN Ritel Valas\n\nDeposito ini memungkinkan nasabah perorangan menempatkan dana dalam mata uang asing yang tersedia. Mata uang yang tercantum dalam materi sumber antara lain USD, SGD, AUD, JPY, CNY, EUR, dan GBP. Pilihan yang tersedia dapat berubah.\n\nBunga deposito valas dihitung dalam mata uang penempatan, bukan otomatis dalam Rupiah. Jika dana dikonversi kembali, nilai akhirnya dipengaruhi kurs dan biaya konversi. Pilih mata uang berdasarkan kebutuhan penggunaan dana, bukan hanya tingkat bunganya.\n\n### Fitur dan bukti kepemilikan\n\nPilihan pengelolaan bunga dapat mencakup kapitalisasi ke pokok atau pemindahbukuan sesuai produk. Bukti kepemilikan dapat berbentuk dokumen digital maupun fisik. Deposito tertentu juga dapat digunakan sebagai agunan Kredit Swadana sesuai syarat bank.\n\nMinimum penempatan, daftar mata uang, kanal layanan, bunga, dan fitur dapat berubah. Konfirmasikan informasi terbaru melalui kanal resmi BTN.",
          ),
        ],
      },
      {
        title: "Deposito BTN Lembaga",
        blocks: [
          text(
            "Deposito BTN Lembaga ditujukan bagi perusahaan atau lembaga yang ingin mengelola dana yang belum digunakan untuk kegiatan operasional atau kebutuhan keuangan tertentu. Sebelum menentukan nominal dan tenor, susun arus kas agar dana untuk kebutuhan dekat dan kewajiban organisasi tetap tersedia.\n\n### Deposito BTN Lembaga Rupiah\n\nPenempatan dilakukan dalam Rupiah untuk jangka waktu tertentu. Organisasi perlu mempertimbangkan jadwal penggunaan dana, persyaratan legalitas, pihak yang berwenang, bunga, dokumen kepemilikan, dan mekanisme pencairan.\n\n### Deposito BTN Lembaga Valas\n\nPenempatan dilakukan dalam mata uang asing sesuai ketersediaan dan ketentuan BTN. Sesuaikan mata uang deposito dengan sumber dana atau kewajiban organisasi dan perhitungkan risiko perubahan kurs serta biaya konversi.\n\n### Pencatatan dan pemantauan\n\nCatat nama pemilik, nominal, tanggal pembukaan, tenor, jatuh tempo, bunga, bukti kepemilikan, dan status pencairan atau perpanjangan. Pencatatan membantu organisasi memantau dana dan mengambil tindakan sebelum jatuh tempo.\n\n### Persyaratan dan dokumen\n\nDokumen yang mungkin diminta mencakup formulir, dokumen legalitas usaha atau lembaga, NPWP jika dipersyaratkan, identitas pengurus atau pihak berwenang, serta dokumen pendukung. Persyaratan dan kanal pembukaan dapat berubah; konfirmasikan langsung kepada BTN.\n\nKetentuan tentang minimum penempatan, tenor, bunga, biaya, penalti, dan dokumen bergantung pada jenis produk serta kebijakan BTN yang berlaku. Jangan mengandalkan angka pada materi lama tanpa konfirmasi terbaru.",
          ),
        ],
      },
      {
        title: "Deposito On Call (DOC)",
        blocks: [
          text(
            "Deposito On Call (DOC) adalah simpanan berjangka dengan periode penempatan relatif singkat, umumnya kurang dari satu bulan. Pencairannya memerlukan pemberitahuan terlebih dahulu kepada bank. Waktu pemberitahuan, tanggal pencairan, tenor, dan imbal hasil mengikuti kesepakatan serta ketentuan produk.\n\nDOC dapat dipertimbangkan bagi perusahaan atau lembaga yang memiliki dana sementara belum digunakan, misalnya dana yang menunggu jadwal pembayaran atau realisasi proyek. Nasabah perlu menyusun perkiraan arus kas dan memastikan waktu pemberitahuan pencairan sesuai dengan kebutuhan.\n\nDOC tidak berarti dana selalu dapat dicairkan seketika atau otomatis diperpanjang. Minimum penempatan, bunga, dan mekanisme pencairan harus diperiksa pada informasi produk BTN terbaru.",
          ),
        ],
      },
      {
        title: "Perbandingan Produk Deposito BTN",
        blocks: [
          text(
            "| Produk | Segmen | Mata uang | Pertimbangan utama |\n| --- | --- | --- | --- |\n| Deposito BTN Ritel Rupiah | Perorangan | Rupiah | Tujuan dana, tenor, bunga bersih, dan pencairan |\n| Deposito BTN Ritel Valas | Perorangan | Valas yang tersedia | Kebutuhan mata uang, risiko kurs, tenor, dan biaya konversi |\n| Deposito BTN Lembaga Rupiah | Perusahaan atau lembaga | Rupiah | Arus kas, kewajiban operasional, tenor, dan persyaratan |\n| Deposito BTN Lembaga Valas | Perusahaan atau lembaga | Valas sesuai ketentuan | Kebutuhan mata uang, risiko kurs, arus kas, dan persyaratan |\n| Deposito On Call (DOC) | Perusahaan atau lembaga | Mengikuti ketentuan produk | Nominal, tenor, bunga, dan mekanisme pemberitahuan pencairan |",
          ),
          text(
            "Informasi produk, persyaratan, bunga, dan ketersediaan layanan dapat berubah. Gunakan materi ini sebagai pengenalan dan periksa ketentuan resmi BTN sebelum melakukan transaksi.",
          ),
        ],
      },
    ],
  },
  {
    slug: "investasi-pasar-modal",
    title: "BAB 4: Investasi Pasar Modal",
    summary:
      "Pelajari dasar obligasi dan reksa dana, termasuk potensi hasil dan risikonya.",
    subchapters: [
      {
        title: "Obligasi",
        blocks: [
          text(
            "Obligasi adalah surat berharga yang menunjukkan bahwa investor memberikan dana kepada pihak penerbit, seperti pemerintah atau perusahaan. Sebagai imbalannya, investor dapat menerima kupon sesuai ketentuan produk serta pengembalian pokok pada saat jatuh tempo, dengan memperhatikan risiko penerbit.\n\nObligasi dapat menjadi pilihan untuk memperoleh pendapatan berkala dan membantu menyeimbangkan portofolio. Namun, harga obligasi dapat berubah sebelum jatuh tempo, antara lain karena perubahan suku bunga, kondisi pasar, dan kualitas kredit penerbit.\n\nContoh surat berharga negara yang dikenal masyarakat antara lain Obligasi Negara Ritel Indonesia (ORI), Sukuk Ritel (SR), Savings Bond Ritel (SBR), dan Sukuk Tabungan (ST). Setiap produk memiliki ketentuan dan risiko yang perlu dibaca pada dokumen resminya.",
          ),
        ],
      },
      {
        title: "Reksa Dana",
        blocks: [
          text(
            "Reksa dana adalah wadah untuk menghimpun dana dari masyarakat pemodal, kemudian menginvestasikannya ke dalam portofolio efek oleh Manajer Investasi. Dengan membeli unit penyertaan, investor memiliki bagian atas portofolio reksa dana, bukan membeli langsung setiap saham atau obligasi di dalamnya. Aset disimpan dan diadministrasikan oleh Bank Kustodian sesuai ketentuan.\n\nReksa dana dapat menjadi alternatif bagi masyarakat yang memiliki keterbatasan waktu, pengetahuan, atau dana untuk mengelola investasi langsung. Portofolio yang terdiversifikasi tidak menghilangkan seluruh risiko.\n\n### Reksa Dana Pasar Uang (RDPU)\n\nMenempatkan dana pada instrumen pasar uang dan/atau efek utang berjangka pendek sesuai ketentuan. Nilainya tetap dapat berubah dan tidak dijamin. Contoh yang tercantum dalam materi sumber antara lain TRIM Kas 2 Kelas A, Bahana Dana Likuid, dan Sucorinvest Money Market Fund.\n\n### Reksa Dana Pendapatan Tetap (RDPT)\n\nSekurang-kurangnya 80% dari Nilai Aktiva Bersih ditempatkan pada efek bersifat utang. Istilah pendapatan tetap menjelaskan dominasi aset dalam portofolio, bukan jaminan bahwa investor memperoleh hasil tetap. Contoh dalam materi sumber antara lain TRIM Dana Tetap 2 dan Sucorinvest Monthly Income Fund.\n\n### Reksa Dana Saham (RDS)\n\nSekurang-kurangnya 80% dari Nilai Aktiva Bersih ditempatkan pada efek bersifat ekuitas, terutama saham. Nilai aktiva bersih dapat berfluktuasi dan hasilnya tidak dijamin. Contoh dalam materi sumber antara lain TRIM Kapital Plus, Bahana Dana Ekuitas Prima, dan Syailendra Equity Opportunity Fund Kelas A.\n\nNama produk merupakan contoh dari materi sumber, bukan rekomendasi. Ketersediaan dan kebijakan produk dapat berubah. Pahami prospektus, biaya, tujuan, dan risiko sebelum berinvestasi.",
          ),
        ],
      },
    ],
  },
];

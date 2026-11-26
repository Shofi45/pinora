import { useEffect, useState } from "react"
import { Icon } from "@/components/Icon"

type QuizQuestion = {
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

const questions: QuizQuestion[] = [
  {
    question: "Produk mana yang cocok untuk membangun rumah di atas tanah sendiri?",
    options: [
      "KPR BTN Platinum",
      "Kredit Bangun Rumah (KBR) BTN",
      "KPA BTN Platinum",
      "KPR BTN Tapera",
    ],
    answerIndex: 1,
    explanation: "Kredit Bangun Rumah (KBR) BTN digunakan untuk membangun rumah di atas tanah milik sendiri.",
  },
  {
    question: "Berapa uang muka KPR BTN Tapera?",
    options: ["0%", "1%", "5%", "10%"],
    answerIndex: 0,
    explanation: "KPR BTN Tapera menyediakan uang muka 0%, sesuai ketentuan produk.",
  },
  {
    question: "Apa kepanjangan KRING BTN?",
    options: [
      "Kredit Ringan BTN",
      "Kredit Rumah BTN",
      "Kredit Rencana BTN",
      "Kredit Residensi BTN",
    ],
    answerIndex: 0,
    explanation: "KRING BTN adalah Kredit Ringan BTN untuk pegawai yang memenuhi syarat.",
  },
  {
    question: "Mana yang benar untuk membeli apartemen?",
    options: ["KPR", "KPA", "KAR", "KRING"],
    answerIndex: 1,
    explanation: "KPA digunakan untuk membeli apartemen, sedangkan KPR umumnya digunakan untuk rumah.",
  },
  {
    question: "Dokumen apa yang diminta pada KPR Sejahtera FLPP?",
    options: [
      "SK Pegawai",
      "Rekening koran tabungan tiga bulan terakhir",
      "Surat tanah",
      "Akta Pemberian Hak Tanggungan",
    ],
    answerIndex: 1,
    explanation: "Contoh dokumennya meliputi rekening koran tabungan tiga bulan terakhir, slip gaji, dan surat keterangan bekerja.",
  },
]

export function KprMiniQuiz() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState<Record<number, number>>({})

  useEffect(() => {
    if (openIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [openIndex])

  const close = () => {
    setOpenIndex(null)
    setSelectedIndex(null)
  }

  const chooseAnswer = (index: number) => {
    if (openIndex === null || answered[openIndex] !== undefined) return
    setSelectedIndex(index)
    setAnswered((current) => ({ ...current, [openIndex]: index }))
  }

  const answeredCount = Object.keys(answered).length

  return (
    <section className="kpr-mini-quiz" aria-labelledby="kpr-mini-quiz-title">
      <h3>Kuis: seberapa paham kamu soal kredit BTN?</h3>
      <p className="kpr-mini-quiz-progress">
        {answeredCount} dari {questions.length} soal sudah dijawab
      </p>

      <div className="kpr-mini-quiz-list">
        {questions.map((item, index) => {
          const answer = answered[index]
          const isCorrect = answer === item.answerIndex
          const isOpen = openIndex === index
          return (
            <div className="kpr-mini-quiz-item" key={item.question}>
              <button
                className={`kpr-mini-quiz-card${answer !== undefined ? (isCorrect ? " correct" : " wrong") : ""}`}
                aria-expanded={isOpen}
                aria-controls={`kpr-quiz-answer-${index}`}
                onClick={() => {
                  setOpenIndex(isOpen ? null : index)
                  setSelectedIndex(answer ?? null)
                }}
              >
                <span className="kpr-mini-quiz-number">{index + 1}</span>
                <span className="kpr-mini-quiz-card-text">
                  <span className="kpr-mini-quiz-question">{item.question}</span>
                  {answer !== undefined && (
                    <span className="kpr-mini-quiz-answer">
                      <b>{isCorrect ? "Jawaban benar:" : "Jawaban:"}</b>{" "}
                      {item.options[item.answerIndex]}
                    </span>
                  )}
                </span>
                {answer !== undefined && (
                  <span className="kpr-mini-quiz-status">
                    <Icon name={isCorrect ? "check" : "close"} size={16} />
                  </span>
                )}
              </button>
              {isOpen && (
                <div
                  className="kpr-quiz-popover"
                  id={`kpr-quiz-answer-${index}`}
                  role="dialog"
                  aria-labelledby={`kpr-quiz-question-${index}`}
                >
                  <div className="kpr-quiz-popover-head">
                    <span>Soal {index + 1}</span>
                    <button type="button" onClick={close} aria-label="Tutup">
                      <Icon name="close" size={18} />
                    </button>
                  </div>
                  <h3 id={`kpr-quiz-question-${index}`}>{item.question}</h3>
                  <div className="kpr-quiz-options">
                    {item.options.map((option, optionIndex) => {
                      const isChecked = answer !== undefined
                      const isSelected = selectedIndex === optionIndex
                      const isAnswer = optionIndex === item.answerIndex
                      const state =
                        isChecked && isAnswer
                          ? " correct"
                          : isChecked && isSelected
                            ? " wrong"
                            : isSelected
                              ? " selected"
                              : ""
                      return (
                        <button
                          type="button"
                          key={option}
                          className={`kpr-quiz-option${state}`}
                          onClick={() => chooseAnswer(optionIndex)}
                          disabled={isChecked}
                        >
                          <span>{String.fromCharCode(65 + optionIndex)}</span>
                          {option}
                        </button>
                      )
                    })}
                  </div>
                  {answer !== undefined && (
                    <div className={`kpr-quiz-feedback ${isCorrect ? "correct" : "wrong"}`}>
                      <b>{isCorrect ? "Jawaban benar." : "Belum tepat."}</b>
                      <p>{item.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="kpr-mini-quiz-close">
        <h3>Siap melangkah ke rumah pertamamu?</h3>
        <p>Pilih produk, siapkan dokumen, dan ajukan. Kami temani dari awal sampai akad.</p>
      </div>

    </section>
  )
}

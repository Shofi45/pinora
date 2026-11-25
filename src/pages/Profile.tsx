import { Icon, type IconName } from "@/components/Icon"

const profilePoints: [IconName, string][] = [
  ["book", "Materi praktis"],
  ["shield", "Data privat"],
  ["bot", "Dukungan AI"],
]

export default function Profile() {
  return (
    <section
      id="profile"
      className="bg-[#064a91] px-5 pt-20 pb-16 text-white sm:pt-24 sm:pb-20"
    >
      <div className="mx-auto grid max-w-7xl items-end gap-9 lg:grid-cols-2 lg:gap-24">
        <div className="scroll-reveal">
          <p className="section-kicker light">TENTANG KAMI</p>
          <h2 className="max-w-xl font-[Plus_Jakarta_Sans] text-4xl leading-tight font-extrabold tracking-[-0.04em] sm:text-5xl">
            Teman bertumbuh dalam setiap langkah keuanganmu.
          </h2>
        </div>
        <div className="scroll-reveal">
          <p className="text-base leading-7 text-[#abc0d4] sm:text-lg">
            Finwise hadir untuk membuat literasi finansial terasa dekat, relevan,
            dan mudah dipraktikkan oleh siapa pun.
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:gap-6">
            {profilePoints.map(([icon, label]) => (
              <span
                className="flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-sky-200 motion-reduce:transition-none"
                key={label}
              >
                <span className="text-sky-300">
                  <Icon name={icon} />
                </span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState } from "react"
import { Icon } from "@/components/Icon"
import { supabase } from "@/lib/supabase"
import {
  DEVELOPER_PROFILES,
  getDeveloperPhotoUrl,
  type DeveloperProfile,
} from "@/lib/developer-profiles"

export default function Profile() {
  const [profiles, setProfiles] = useState(DEVELOPER_PROFILES)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const client = supabase
    if (!client) return

    let cancelled = false
    const loadProfiles = async () => {
      const { data, error } = await client
        .from("developer_profiles")
        .select(
          "slug, full_name, title, internship_unit, bio, purpose, focus_areas, quote, email, instagram, photo_path, sort_order",
        )
        .eq("is_published", true)
        .order("sort_order", { ascending: true })

      if (cancelled) return
      if (error) {
        console.error("Gagal memuat profil pengembang dari Supabase.", error)
        setLoadError(
          "Profil dari Supabase belum dapat dimuat. Jalankan supabase/developer_profiles.sql; profil bawaan tetap ditampilkan.",
        )
        return
      }

      setProfiles(data ?? [])
    }

    void loadProfiles()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="profile" className="bg-[#064a91] pt-20 pb-16 sm:pt-24">
      <div className="container">
        <div className="grid items-end gap-9 lg:grid-cols-2 lg:gap-24">
          <div className="scroll-reveal">
            <p className="section-kicker light !text-[#ffc400]">TENTANG KAMI</p>
            <h2 className="max-w-xl font-[Plus_Jakarta_Sans] text-4xl leading-tight font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
              Teman bertumbuh dalam setiap langkah keuanganmu.
            </h2>
          </div>
          <div className="scroll-reveal">
            <p className="text-base leading-7 text-blue-100 sm:text-lg">
              Finwise hadir untuk membuat literasi finansial terasa dekat,
              relevan, dan mudah dipraktikkan oleh siapa pun.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {["Belajar", "Catat", "Rencanakan"].map((item) => (
                <span
                  className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-3 scroll-reveal">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#ffc400] text-[#064a91]">
            <Icon name="book" size={21} />
          </span>
          <div>
            <h3 className="font-[Plus_Jakarta_Sans] text-2xl font-extrabold text-white sm:text-3xl">
              Tim dan kontributor
            </h3>
            <p className="mt-1 text-sm text-blue-100">
              Kenali orang-orang di balik materi dan website Finwise.
            </p>
          </div>
        </div>

        {loadError && (
          <p
            className="mt-6 rounded-xl border border-[#ffc400]/50 bg-[#ffc400]/10 px-4 py-3 text-sm text-white"
            role="status"
          >
            {loadError}
          </p>
        )}

        <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => (
            <DeveloperCard key={profile.slug} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DeveloperCard({ profile }: { profile: DeveloperProfile }) {
  const photoUrl = getDeveloperPhotoUrl(profile.photo_path)

  return (
    <article className="scroll-reveal overflow-hidden rounded-3xl bg-white text-slate-700 shadow-xl shadow-[#031d3b]/20">
      <div className="relative h-64 bg-blue-50">
        <img
          className="h-full w-full object-cover object-center"
          src={photoUrl}
          alt={`Foto ${profile.full_name}`}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#064a91]/90 to-transparent px-5 pt-12 pb-4">
          <p className="text-xs font-bold tracking-[0.12em] text-[#ffc400] uppercase">
            {profile.internship_unit}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-xs font-bold tracking-wide text-[#064a91]/70 uppercase">
          {profile.title}
        </p>
        <h4 className="mt-1 font-[Plus_Jakarta_Sans] text-xl leading-snug font-extrabold text-[#064a91]">
          {profile.full_name}
        </h4>
        <p className="mt-3 text-sm leading-6">{profile.bio}</p>

        <div className="mt-4 rounded-2xl bg-blue-50 p-4">
          <p className="text-xs font-extrabold tracking-wide text-[#064a91] uppercase">
            Tujuan
          </p>
          <p className="mt-1 text-sm leading-6">{profile.purpose}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {profile.focus_areas.map((area) => (
            <span
              className="rounded-full bg-[#ffc400]/20 px-3 py-1.5 text-xs font-semibold text-[#064a91]"
              key={area}
            >
              {area}
            </span>
          ))}
        </div>

        <blockquote className="mt-5 border-l-2 border-[#ffc400] pl-3 text-sm leading-6 text-slate-600 italic">
          “{profile.quote}”
        </blockquote>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm font-semibold">
          {profile.email && (
            <a
              className="text-[#064a91] underline decoration-[#ffc400] underline-offset-4 hover:text-[#04396f]"
              href={`mailto:${profile.email}`}
            >
              Email
            </a>
          )}
          {profile.instagram && (
            <a
              className="text-[#064a91] underline decoration-[#ffc400] underline-offset-4 hover:text-[#04396f]"
              href={`https://www.instagram.com/${profile.instagram}/`}
              target="_blank"
              rel="noreferrer"
            >
              @{profile.instagram}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

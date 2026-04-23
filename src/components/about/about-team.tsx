import Image from 'next/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';
import type { TeamMember } from '@/types/sanity';

interface AboutTeamProps {
  eyebrow: string;
  heading: string;
  members: TeamMember[];
  locale: Locale;
}

export function AboutTeam({ eyebrow, heading, members, locale }: AboutTeamProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
          {heading}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {members.map((member, idx) => {
            const isLead = idx % 2 === 0;
            const name = member.name;
            const role = resolveLocaleField(member.role, locale);
            const bio = member.bio ? resolveLocaleField(member.bio, locale) : null;
            const photoUrl = member.photo?.asset
              ? urlFor(member.photo).width(isLead ? 1200 : 600).quality(85).url()
              : null;

            return (
              <div
                key={member._id}
                className={isLead ? 'md:col-span-2' : 'md:col-span-1'}
              >
                <div
                  className={`group relative overflow-hidden bg-[#1E2128] ${
                    isLead ? 'aspect-[16/9]' : 'aspect-[3/4] md:aspect-auto md:h-full'
                  }`}
                  style={!isLead ? { minHeight: '280px' } : undefined}
                >
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="font-serif text-xl font-semibold text-[#F7F7F5]">{name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
                      {role}
                    </p>
                    {isLead && bio ? (
                      <p className="mt-3 line-clamp-3 max-w-sm text-sm leading-relaxed text-[#C8C7C2]">
                        {bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

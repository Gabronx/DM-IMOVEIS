import Image from "next/image";
import Link from "next/link";
import { empresa } from "@/content/site";

/** Logo da DM (Deborah Moreira), só o símbolo; o nome fica no aria-label. `claro` = versão branca, sobre fundos escuros. */
export default function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap"aria-label={`${empresa.nome} — página inicial`}>
      <span className="relative block h-6 w-[2.7rem] md:h-7 md:w-[3.15rem]">
        {/* As duas versões ficam sobrepostas e trocam com um esmaecido quando o cabeçalho muda de fundo */}
        <Image
          src="/img/logo-dm-branca.png"
          alt=""
          fill
          sizes="56px"
          loading="eager"
          className={`object-contain transition-opacity duration-500 ${claro ? "opacity-100" : "opacity-0"}`}
        />
        <Image
          src="/img/logo-dm-preta.png"
          alt=""
          fill
          sizes="56px"
          loading="eager"
          className={`object-contain transition-opacity duration-500 ${claro ? "opacity-0" : "opacity-100"}`}
        />
      </span>
    </Link>
  );
}

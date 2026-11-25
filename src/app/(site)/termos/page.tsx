import type { Metadata } from "next";
import Link from "next/link";
import PaginaTexto, { Pendente } from "@/components/layout/PaginaTexto";
import { empresa } from "@/content/site";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: `Condições de uso do site da ${empresa.nome}.`,
  alternates: { canonical: "/termos" },
};

/** TODO: MODELO — revisar com assessoria jurídica antes de publicar. */
export default function Termos() {
  return (
    <PaginaTexto eyebrow="Institucional" titulo="Termos de uso" atualizacao="24 de novembro de 2026">
      <p>
        Ao usar este site, mantido pela <strong>{empresa.nome}</strong> ({empresa.creci},{" "}
        <Pendente>CNPJ a preencher</Pendente>), você concorda com as condições abaixo.
      </p>

      <h2>1. Sobre as informações dos imóveis</h2>
      <p>
        As informações, valores, metragens e fotos dos imóveis são fornecidas por proprietários e parceiros e têm caráter
        informativo. Elas podem mudar sem aviso prévio e devem ser confirmadas com a consultora antes de qualquer decisão.
        A disponibilidade dos imóveis está sujeita a venda ou locação prévia.
      </p>
      <p>
        A localização exibida no mapa é aproximada. O endereço exato é informado no agendamento da visita.
      </p>

      <h2>2. Não constitui oferta vinculante</h2>
      <p>
        O conteúdo do site não constitui proposta ou oferta vinculante. Toda negociação é formalizada por instrumento
        próprio, assinado pelas partes.
      </p>

      <h2>3. Uso do site</h2>
      <ul>
        <li>Use o site apenas para fins lícitos e pessoais.</li>
        <li>Não copie, reproduza ou distribua textos, fotos e marcas sem autorização.</li>
        <li>Não envie informações falsas ou de terceiros nos formulários.</li>
      </ul>

      <h2>4. Propriedade intelectual</h2>
      <p>
        Textos, marca, layout e fotos deste site pertencem à {empresa.nome} ou a seus parceiros e são protegidos pela
        legislação de direitos autorais e de propriedade industrial.
      </p>

      <h2>5. Links externos</h2>
      <p>
        O site pode conter links para serviços de terceiros (como WhatsApp, Google Maps e redes sociais), que têm políticas
        próprias. Não nos responsabilizamos pelo conteúdo desses serviços.
      </p>

      <h2>6. Privacidade</h2>
      <p>
        O tratamento dos seus dados pessoais é descrito na <Link href="/privacidade">Política de privacidade</Link>.
      </p>

      <h2>7. Contato e foro</h2>
      <p>
        Dúvidas sobre estes termos podem ser enviadas pela página de <Link href="/contato">contato</Link>. Fica eleito o foro
        da comarca de {empresa.endereco.cidade}/{empresa.endereco.uf} para resolver eventuais questões relacionadas a este
        site.
      </p>
    </PaginaTexto>
  );
}

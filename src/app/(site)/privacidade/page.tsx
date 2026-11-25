import type { Metadata } from "next";
import Link from "next/link";
import PaginaTexto, { Pendente } from "@/components/layout/PaginaTexto";
import { empresa } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Como a ${empresa.nome} coleta, usa e protege seus dados pessoais, conforme a LGPD (Lei 13.709/2018).`,
  alternates: { canonical: "/privacidade" },
};

/**
 * TODO: MODELO — revisar com assessoria jurídica antes de publicar.
 * Preencher CNPJ / razão social, e-mail do encarregado (DPO) e prazos de retenção.
 */
export default function Privacidade() {
  return (
    <PaginaTexto eyebrow="LGPD" titulo="Política de privacidade" atualizacao="24 de novembro de 2026">
      <p>
        Esta política explica como a <strong>{empresa.nome}</strong> ({empresa.creci}
        {", "}
        <Pendente>CNPJ a preencher</Pendente>), com endereço na {empresa.endereco.logradouro}, {empresa.endereco.cidade}/
        {empresa.endereco.uf}, trata os dados pessoais de quem usa este site, em conformidade com a Lei Geral de Proteção
        de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
      </p>

      <h2>1. Quais dados coletamos</h2>
      <ul>
        <li>
          <strong>Dados que você nos envia</strong> pelos formulários de interesse, contato e anúncio: nome, telefone,
          e-mail, mensagem e informações sobre o imóvel.
        </li>
        <li>
          <strong>Dados de navegação</strong>, apenas se você aceitar os cookies de análise: páginas visitadas, tempo de
          visita, tipo de dispositivo e cidade aproximada, coletados por ferramentas como Google Analytics e Meta Pixel.
        </li>
      </ul>

      <h2>2. Para que usamos</h2>
      <ul>
        <li>Responder ao seu contato e prestar o atendimento solicitado (compra, venda, locação ou avaliação).</li>
        <li>Agendar visitas e enviar informações sobre imóveis do seu interesse.</li>
        <li>Entender como o site é usado e melhorar a experiência, quando houver consentimento.</li>
        <li>Cumprir obrigações legais e regulatórias da atividade imobiliária.</li>
      </ul>

      <h2>3. Bases legais</h2>
      <p>
        Tratamos seus dados com base no seu <strong>consentimento</strong> (formulários e cookies de análise), na execução
        de procedimentos preliminares a um contrato solicitados por você e no cumprimento de obrigações legais.
      </p>

      <h2>4. Compartilhamento</h2>
      <p>
        Não vendemos seus dados. Eles podem ser compartilhados apenas com fornecedores que nos ajudam a operar o site e o
        atendimento (hospedagem, envio de e-mails, sistema de gestão de imóveis e ferramentas de análise), sempre limitados
        ao necessário, ou com autoridades, quando exigido por lei.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Usamos cookies essenciais para o funcionamento do site. Cookies de análise e marketing só são ativados se você
        clicar em “Aceitar” no aviso de cookies. Você pode mudar sua escolha a qualquer momento em “Preferências de
        cookies”, no rodapé do site. O mapa de localização é fornecido pelo Google Maps, que pode usar cookies próprios.
      </p>

      <h2>6. Por quanto tempo guardamos</h2>
      <p>
        Mantemos os dados pelo tempo necessário para o atendimento e para cumprir obrigações legais. Depois disso, eles são
        excluídos ou anonimizados. <Pendente>Definir prazos de retenção</Pendente>
      </p>

      <h2>7. Seus direitos</h2>
      <p>Você pode, a qualquer momento, solicitar:</p>
      <ul>
        <li>confirmação e acesso aos seus dados;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>anonimização, bloqueio ou exclusão de dados desnecessários;</li>
        <li>portabilidade e informação sobre compartilhamentos;</li>
        <li>revogação do consentimento.</li>
      </ul>

      <h2>8. Como falar conosco</h2>
      <p>
        Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelo e-mail{" "}
        <Pendente>e-mail do encarregado (DPO) a preencher</Pendente>, pelo WhatsApp {empresa.telefoneExibicao} ou pela
        página de <Link href="/contato">contato</Link>.
      </p>

      <h2>9. Alterações</h2>
      <p>Esta política pode ser atualizada. A data da última revisão fica sempre indicada no topo da página.</p>
    </PaginaTexto>
  );
}

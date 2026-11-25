"use client";

import { useActionState, useId } from "react";
import { enviarContato, type EstadoForm } from "@/app/acoes";
import {
  AlertaErro,
  BotaoEnviar,
  Campo,
  Consentimento,
  Honeypot,
  Sucesso,
  a11y,
  campoCls,
  selectCls,
  useAntispam,
} from "./Campos";

const inicial: EstadoForm = { status: "inicial" };
const assuntos = ["Quero comprar", "Quero alugar", "Quero vender ou alugar meu imóvel", "Avaliação de imóvel", "Outro assunto"];

export default function FormContato() {
  const [estado, acao, enviando] = useActionState(enviarContato, inicial);
  const enviar = useAntispam(acao);
  const id = useId();
  const v = estado.valores ?? {};
  const e = estado.erros ?? {};

  if (estado.status === "ok") {
    return <Sucesso titulo="Mensagem enviada." texto="Obrigado pelo contato. A consultora vai retornar em breve." />;
  }

  return (
    <form action={enviar} noValidate className="space-y-5">
      <Honeypot />
      <Campo id={`${id}-assunto`} rotulo="Assunto">
        <select id={`${id}-assunto`} name="assunto" defaultValue={v.assunto ?? assuntos[0]} className={selectCls}>
          {assuntos.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </Campo>
      <Campo id={`${id}-nome`} rotulo="Nome" erro={e.nome}>
        <input name="nome" autoComplete="name" defaultValue={v.nome} className={campoCls} {...a11y(`${id}-nome`, e.nome)} />
      </Campo>
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={`${id}-tel`} rotulo="Telefone / WhatsApp" erro={e.telefone}>
          <input
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(41) 90000-0000"
            defaultValue={v.telefone}
            className={campoCls}
            {...a11y(`${id}-tel`, e.telefone)}
          />
        </Campo>
        <Campo id={`${id}-email`} rotulo="E-mail" erro={e.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={v.email}
            className={campoCls}
            {...a11y(`${id}-email`, e.email)}
          />
        </Campo>
      </div>
      <Campo id={`${id}-msg`} rotulo="Mensagem" erro={e.mensagem}>
        <textarea
          name="mensagem"
          rows={5}
          defaultValue={v.mensagem}
          className={`${campoCls} resize-y`}
          {...a11y(`${id}-msg`, e.mensagem)}
        />
      </Campo>
      <Consentimento id={`${id}-lgpd`} erro={e.consentimento} texto="Concordo em ser contatado(a) pela DM Consultoria" />
      <AlertaErro texto={estado.mensagem} />
      <BotaoEnviar enviando={enviando} texto="Enviar mensagem" />
    </form>
  );
}

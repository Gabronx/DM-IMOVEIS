"use client";

import { useActionState, useId } from "react";
import { enviarAnuncio, type EstadoForm } from "@/app/acoes";
import { tiposAnuncio } from "@/content/site";
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

export default function FormAnuncie() {
  const [estado, acao, enviando] = useActionState(enviarAnuncio, inicial);
  const enviar = useAntispam(acao);
  const id = useId();
  const v = estado.valores ?? {};
  const e = estado.erros ?? {};

  if (estado.status === "ok") {
    return (
      <Sucesso
        titulo="Recebemos os dados do seu imóvel."
        texto="A consultora vai entrar em contato para conversar sobre os próximos passos."
      />
    );
  }

  return (
    <form action={enviar} noValidate className="space-y-5">
      <Honeypot />

      <fieldset>
        <legend className="text-[0.875rem]">Finalidade</legend>
        <div className="mt-2 flex flex-wrap gap-2" {...(e.finalidade ? { "aria-describedby": `${id}-fin-erro` } : {})}>
          {["Venda", "Locação", "Venda ou locação"].map((op) => (
            <label
              key={op}
              className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-[0.875rem] transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
            >
              <input type="radio" name="finalidade" value={op} defaultChecked={v.finalidade === op} className="sr-only" />
              {op}
            </label>
          ))}
        </div>
        {e.finalidade && (
          <p id={`${id}-fin-erro`} className="mt-1.5 text-[0.8125rem] text-red-700">
            {e.finalidade}
          </p>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={`${id}-tipo`} rotulo="Tipo de imóvel" erro={e.tipo}>
          <select name="tipo" defaultValue={v.tipo ?? ""} className={selectCls} {...a11y(`${id}-tipo`, e.tipo)}>
            <option value="" disabled>
              Selecione
            </option>
            {tiposAnuncio.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo id={`${id}-bairro`} rotulo="Bairro" erro={e.bairro}>
          <input name="bairro" defaultValue={v.bairro} className={campoCls} {...a11y(`${id}-bairro`, e.bairro)} />
        </Campo>
        <Campo id={`${id}-cidade`} rotulo="Cidade">
          <input name="cidade" defaultValue={v.cidade ?? "Curitiba"} className={campoCls} id={`${id}-cidade`} />
        </Campo>
        <Campo id={`${id}-end`} rotulo="Endereço" opcional>
          <input
            name="endereco"
            autoComplete="street-address"
            defaultValue={v.endereco}
            className={campoCls}
            id={`${id}-end`}
          />
        </Campo>
      </div>

      <div className="border-t border-line pt-5">
        <p className="mb-4 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-graphite">Seus dados</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id={`${id}-nome`} rotulo="Nome" erro={e.nome}>
              <input name="nome" autoComplete="name" defaultValue={v.nome} className={campoCls} {...a11y(`${id}-nome`, e.nome)} />
            </Campo>
          </div>
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
      </div>

      <Campo id={`${id}-obs`} rotulo="Observações" opcional>
        <textarea
          id={`${id}-obs`}
          name="observacoes"
          rows={4}
          placeholder="Metragem, número de quartos, valor pretendido, melhor horário para contato…"
          defaultValue={v.observacoes}
          className={`${campoCls} resize-y`}
        />
      </Campo>

      <Consentimento
        id={`${id}-lgpd`}
        erro={e.consentimento}
        texto="Concordo em ser contatado(a) pela DM Consultoria sobre o meu imóvel"
      />
      <AlertaErro texto={estado.mensagem} />
      <BotaoEnviar enviando={enviando} texto="Enviar dados do imóvel" />
    </form>
  );
}

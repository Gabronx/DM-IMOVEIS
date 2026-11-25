"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import { enviarInteresse, type EstadoForm } from "@/app/acoes";

const inicial: EstadoForm = { status: "inicial" };

const campoCls =
  "mt-1.5 w-full rounded-[6px] border border-line bg-white px-3.5 py-3 text-[0.9375rem] text-ink transition-colors placeholder:text-graphite/60 hover:border-graphite/50 focus-visible:border-gold aria-[invalid=true]:border-red-700";

function Erro({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.8125rem] text-red-700">
      {texto}
    </p>
  );
}

export default function FormInteresse({ codigo }: { codigo: string }) {
  const [estado, acao, enviando] = useActionState(enviarInteresse, inicial);
  const inicio = useRef(0);
  const id = useId();
  const v = estado.valores ?? {};
  const e = estado.erros ?? {};

  // Marca a hora em que o formulário ficou visível (antispam por tempo mínimo).
  useEffect(() => {
    inicio.current = Date.now();
  }, []);
  const enviar = (dados: FormData) => {
    dados.set("inicio", String(inicio.current));
    return acao(dados);
  };

  if (estado.status === "ok") {
    return (
      <div role="status" className="rounded-[6px] border border-line bg-white p-8 text-center">
        <p className="font-serif text-[1.75rem] leading-tight">Recebemos o seu contato.</p>
        <p className="mt-3 text-graphite">A consultora vai retornar em breve pelo telefone ou e-mail informado.</p>
      </div>
    );
  }

  return (
    <form action={enviar} noValidate className="space-y-4">
      <input type="hidden" name="codigo" value={codigo} />
      {/* Campo invisível para pegar robôs (honeypot) */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Site <input type="text" name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-graphite">Quero</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Agendar uma visita", "Mais informações", "Fazer uma proposta"].map((op, i) => (
            <label
              key={op}
              className="cursor-pointer rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.8125rem] transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
            >
              <input type="radio" name="assunto" value={op} defaultChecked={i === 0} className="sr-only" />
              {op}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-nome`} className="text-[0.875rem]">
          Nome
        </label>
        <input
          id={`${id}-nome`}
          name="nome"
          autoComplete="name"
          defaultValue={v.nome}
          aria-invalid={!!e.nome}
          aria-describedby={e.nome ? `${id}-nome-erro` : undefined}
          className={campoCls}
          required
        />
        <Erro id={`${id}-nome-erro`} texto={e.nome} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-tel`} className="text-[0.875rem]">
            Telefone / WhatsApp
          </label>
          <input
            id={`${id}-tel`}
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(41) 90000-0000"
            defaultValue={v.telefone}
            aria-invalid={!!e.telefone}
            aria-describedby={e.telefone ? `${id}-tel-erro` : undefined}
            className={campoCls}
            required
          />
          <Erro id={`${id}-tel-erro`} texto={e.telefone} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-[0.875rem]">
            E-mail
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={v.email}
            aria-invalid={!!e.email}
            aria-describedby={e.email ? `${id}-email-erro` : undefined}
            className={campoCls}
            required
          />
          <Erro id={`${id}-email-erro`} texto={e.email} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-msg`} className="text-[0.875rem]">
          Mensagem <span className="text-graphite">(opcional)</span>
        </label>
        <textarea
          id={`${id}-msg`}
          name="mensagem"
          rows={3}
          defaultValue={v.mensagem ?? `Olá! Tenho interesse no imóvel cód. ${codigo}.`}
          className={`${campoCls} resize-y`}
        />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-graphite">
          <input
            type="checkbox"
            name="consentimento"
            aria-invalid={!!e.consentimento}
            aria-describedby={e.consentimento ? `${id}-lgpd-erro` : undefined}
            className="mt-0.5 size-4 shrink-0 accent-[var(--color-gold)]"
          />
          <span>
            Concordo em ser contatado(a) pela DM Consultoria sobre este imóvel, conforme a{" "}
            <Link href="/privacidade" className="text-ink underline underline-offset-2">
              Política de privacidade
            </Link>
            .
          </span>
        </label>
        <Erro id={`${id}-lgpd-erro`} texto={e.consentimento} />
      </div>

      {estado.mensagem && (
        <p role="alert" className="rounded-[6px] bg-red-50 px-4 py-3 text-[0.875rem] text-red-800">
          {estado.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-ink py-3.5 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-gold disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}

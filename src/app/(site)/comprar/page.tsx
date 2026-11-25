import type { Metadata } from "next";
import PaginaListagem from "@/components/listagem/PaginaListagem";

export const metadata: Metadata = {
  title: "Imóveis à venda em Curitiba",
  description:
    "Apartamentos, coberturas e sobrados à venda em Curitiba e região, selecionados pela DM Consultoria Patrimonial. Filtre por bairro, quartos, vagas, preço e área.",
  alternates: { canonical: "/comprar" },
};

export default function Comprar({ searchParams }: PageProps<"/comprar">) {
  return <PaginaListagem finalidade="venda" searchParams={searchParams} />;
}

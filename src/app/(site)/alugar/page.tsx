import type { Metadata } from "next";
import PaginaListagem from "@/components/listagem/PaginaListagem";

export const metadata: Metadata = {
  title: "Imóveis para alugar em Curitiba",
  description:
    "Imóveis para locação em Curitiba e região com a DM Consultoria Patrimonial. Filtre por bairro, quartos, vagas, preço e área.",
  alternates: { canonical: "/alugar" },
};

export default function Alugar({ searchParams }: PageProps<"/alugar">) {
  return <PaginaListagem finalidade="aluguel" searchParams={searchParams} />;
}

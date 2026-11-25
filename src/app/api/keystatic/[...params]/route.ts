import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
import { painelAtivo } from "@/lib/painel";

const handlers = makeRouteHandler({ config });
const desativado = () => new Response("Painel desativado nesta publicação.", { status: 404 });

export const GET = painelAtivo ? handlers.GET : desativado;
export const POST = painelAtivo ? handlers.POST : desativado;

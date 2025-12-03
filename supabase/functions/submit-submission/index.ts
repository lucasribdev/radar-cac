import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

type SubmissionPayload = {
	process_type: "CR" | "AUTORIZACAO_COMPRA" | "CRAF" | "GUIA_TRAFEGO";
	om_name: string;
	result: "DEFERIDO" | "INDEFERIDO";
	date_protocol: string;
	date_decision: string;
	captchaToken: string;
};

const allowedProcessTypes = new Set<SubmissionPayload["process_type"]>([
	"CR",
	"AUTORIZACAO_COMPRA",
	"CRAF",
	"GUIA_TRAFEGO",
]);
const allowedResults = new Set<SubmissionPayload["result"]>([
	"DEFERIDO",
	"INDEFERIDO",
]);

function errorResponse(status: number, message: string) {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { ...corsHeaders, "Content-Type": "application/json" },
	});
}

function parseDate(value: string) {
	if (!value) return null;
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function validateRecaptcha(token: string) {
	const secret =
		Deno.env.get("RECAPTCHA_SECRET_KEY") ?? Deno.env.get("RECAPTCHA_SECRET");

	if (!secret) {
		console.error("Missing RECAPTCHA_SECRET_KEY");
		return { ok: false, reason: "reCAPTCHA não configurado" };
	}

	const params = new URLSearchParams({
		secret,
		response: token,
	});

	try {
		const response = await fetch(
			"https://www.google.com/recaptcha/api/siteverify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params.toString(),
			},
		);

		if (!response.ok) {
			console.error("recaptcha request failed", await response.text());
			return { ok: false, reason: "Falha ao validar captcha" };
		}

		const data = (await response.json()) as { success?: boolean; score?: number };
		if (!data.success) {
			return { ok: false, reason: "Captcha inválido" };
		}

		return { ok: true as const };
	} catch (error) {
		console.error("recaptcha error", error);
		return { ok: false, reason: "Erro ao validar captcha" };
	}
}

serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	if (req.method !== "POST") {
		return errorResponse(405, "Método não permitido");
	}

	let payload: SubmissionPayload;
	try {
		payload = (await req.json()) as SubmissionPayload;
	} catch {
		return errorResponse(400, "JSON inválido");
	}

	const {
		process_type,
		om_name,
		result,
		date_protocol,
		date_decision,
		captchaToken,
	} = payload;

	if (
		!process_type ||
		!allowedProcessTypes.has(process_type) ||
		!result ||
		!allowedResults.has(result)
	) {
		return errorResponse(400, "Tipo de processo ou resultado inválido");
	}

	const omNormalized = om_name?.trim().toUpperCase();
	if (!omNormalized || omNormalized.length < 3) {
		return errorResponse(400, "OM inválida");
	}

	if (!date_protocol || !date_decision) {
		return errorResponse(400, "Datas são obrigatórias");
	}

	const protocolDate = parseDate(date_protocol);
	const decisionDate = parseDate(date_decision);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (!protocolDate || !decisionDate) {
		return errorResponse(400, "Formato de datas inválido");
	}
	if (protocolDate > today || decisionDate > today) {
		return errorResponse(400, "Datas futuras não são permitidas");
	}
	if (decisionDate < protocolDate) {
		return errorResponse(
			400,
			"A data de decisão deve ser maior ou igual à de protocolo",
		);
	}

	if (!captchaToken) {
		return errorResponse(400, "Captcha obrigatório");
	}

	const captcha = await validateRecaptcha(captchaToken);
	if (!captcha.ok) {
		return errorResponse(400, captcha.reason ?? "Captcha inválido");
	}

	const supabaseUrl = Deno.env.get("SUPABASE_URL");
	const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

	if (!supabaseUrl || !supabaseServiceRoleKey) {
		return errorResponse(500, "Supabase não configurado");
	}

	const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false },
	});

	const { error } = await supabaseClient.from("submissions").insert({
		process_type,
		om_name: omNormalized,
		result,
		date_protocol,
		date_decision,
	});

	if (error) {
		console.error("insert error", error);
		return errorResponse(500, "Não foi possível salvar o envio");
	}

	return new Response(JSON.stringify({ success: true }), {
		status: 201,
		headers: { ...corsHeaders, "Content-Type": "application/json" },
	});
});

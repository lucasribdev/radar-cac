/** biome-ignore-all lint/correctness/noChildrenProp: <usamos a prop children no tanstack form> */
import type { AnyFieldApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Combobox } from "@/components/Combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabaseClient } from "@/lib/supabaseClient";
import { fetchOms } from "@/services/oms";
import {
	PROCESS_RESULT_OPTIONS,
	type ProcessResultEnum,
	TYPE_OPTIONS,
	type TypeEnum,
} from "@/types/enums";
import { toOmOption } from "@/types/oms";

export const Route = createFileRoute("/submission/")({ component: Submission });

const typeOptions = TYPE_OPTIONS;
const processResultOptions = PROCESS_RESULT_OPTIONS;
type FormData = {
	type: TypeEnum | "";
	omId: string;
	dateProtocol: string;
	dateDecision: string;
	result: ProcessResultEnum | "";
};

type SubmissionPayload = {
	type: TypeEnum;
	om_id: number;
	result: ProcessResultEnum;
	date_protocol: string;
	date_decision: string;
};

type SubmissionRequest = SubmissionPayload & {
	captchaToken: string;
};

async function submitViaEdgeFunction(payload: SubmissionRequest) {
	const { error } = await supabaseClient.functions.invoke("submit-submission", {
		body: payload,
	});

	if (error) {
		throw error;
	}
}

function parseDate(value: string) {
	if (!value) return null;
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<em>{field.state.meta.errors.join(", ")}</em>
			) : null}
			<em>{field.state.meta.isValidating ? "Validando..." : null}</em>
		</>
	);
}

function Submission() {
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();
	const { mutateAsync: submitProcess, isPending } = useMutation({
		mutationFn: submitViaEdgeFunction,
	});
	const {
		data: oms = [],
		isFetching: isLoadingOms,
		error: omsError,
	} = useQuery({
		queryKey: ["oms"],
		queryFn: fetchOms,
	});

	const omOptions = useMemo(() => oms.map(toOmOption), [oms]);

	const defaultValues: FormData = {
		type: "",
		omId: "",
		dateProtocol: "",
		dateDecision: "",
		result: "",
	};

	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			if (!captchaToken) {
				toast({
					variant: "destructive",
					title: "Erro",
					description: "Confirme o captcha.",
				});
				return;
			}

			if (!acceptTerms) {
				toast({
					variant: "destructive",
					title: "Erro",
					description: "Você precisa aceitar os termos para enviar o processo.",
				});
				return;
			}

			if (!value.type || !value.result || !value.omId) {
				toast({
					variant: "destructive",
					title: "Erro",
					description: "Preencha todos os campos obrigatórios antes de enviar.",
				});
				return;
			}

			const omId = Number(value.omId);
			if (!Number.isInteger(omId) || omId <= 0) {
				toast({
					variant: "destructive",
					title: "Erro",
					description: "Selecione uma OM válida.",
				});
				return;
			}

			const protocolDate = parseDate(value.dateProtocol);
			const decisionDate = parseDate(value.dateDecision);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (!protocolDate || !decisionDate) {
				toast({
					variant: "destructive",
					title: "Erro",
					description: "Datas inválidas. Verifique o formato.",
				});
				return;
			}

			if (protocolDate > today || decisionDate > today) {
				toast({
					variant: "destructive",
					title: "Erro",
					description: "Datas futuras não são permitidas.",
				});
				return;
			}

			if (decisionDate < protocolDate) {
				toast({
					variant: "destructive",
					title: "Erro",
					description:
						"A data de decisão deve ser maior ou igual à data de protocolo.",
				});
				return;
			}

			const payload: SubmissionPayload = {
				type: value.type,
				om_id: omId,
				result: value.result,
				date_protocol: value.dateProtocol,
				date_decision: value.dateDecision,
			};

			try {
				await submitProcess({
					...payload,
					captchaToken,
				});
				toast({
					title: "Processo enviado com sucesso!",
					description: "Obrigado por contribuir com a comunidade.",
				});
				navigate({ to: "/" });
			} catch (error) {
				console.error(error);
				toast({
					variant: "destructive",
					title: "Erro ao enviar processo",
					description:
						error instanceof Error
							? error.message
							: "Não foi possível salvar no momento.",
				});
			}
		},
	});

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-foreground mb-2">
					Enviar Processo
				</h1>
				<p className="text-muted-foreground">
					Compartilhe o prazo do seu processo para ajudar a comunidade.
				</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Dados do Processo</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<div className="space-y-2">
							<form.Field
								name="type"
								validators={{
									onChange: ({ value }) =>
										!value ? "O tipo de processo é obrigatório" : undefined,
									onChangeAsyncDebounceMs: 500,
								}}
								children={(field) => {
									return (
										<>
											<Label htmlFor={field.name}>Tipo de Processo *</Label>
											<Select
												name={field.name}
												value={field.state.value}
												onValueChange={(value) =>
													field.handleChange(value as FormData["type"])
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Selecione o tipo" />
												</SelectTrigger>
												<SelectContent>
													{typeOptions.map((tipo) => (
														<SelectItem key={tipo.value} value={tipo.value}>
															{tipo.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldInfo field={field} />
										</>
									);
								}}
							/>
						</div>

						<div className="space-y-2">
							<form.Field
								name="omId"
								validators={{
									onChange: ({ value }) =>
										!value ? "A OM é obrigatória" : undefined,
									onChangeAsyncDebounceMs: 500,
								}}
								children={(field) => {
									return (
										<>
											<Label htmlFor={field.name}>
												OM da Polícia Federal *
											</Label>
											<Combobox
												options={omOptions}
												value={field.state.value}
												onChange={(value) =>
													field.handleChange(value as FormData["omId"])
												}
												placeholder={
													isLoadingOms
														? "Carregando OMs..."
														: omsError
															? "Erro ao carregar OMs"
															: "Selecione a OM"
												}
												searchPlaceholder="Pesquisar a OM"
												emptyMessage={
													omsError
														? "Erro ao carregar OMs."
														: isLoadingOms
															? "Carregando OMs..."
															: "Nenhuma OM encontrada."
												}
											/>
											{omsError ? (
												<p className="text-sm text-destructive">
													Não foi possível carregar a lista de OMs.
												</p>
											) : null}
											<FieldInfo field={field} />
										</>
									);
								}}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<form.Field
									name="dateProtocol"
									validators={{
										onChange: ({ value }) => {
											const parsed = parseDate(value);
											const today = new Date();
											today.setHours(0, 0, 0, 0);

											return !value
												? "A data do protocolo é obrigatória"
												: !parsed
													? "Data inválida"
													: parsed > today
														? "Data futura não permitida"
														: undefined;
										},
										onChangeAsyncDebounceMs: 500,
									}}
									children={(field) => {
										return (
											<>
												<Label htmlFor={field.name}>Data do Protocolo *</Label>
												<Input
													id={field.name}
													name={field.name}
													type="date"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<FieldInfo field={field} />
											</>
										);
									}}
								/>
							</div>

							<div className="space-y-2">
								<form.Field
									name="dateDecision"
									validators={{
										onChange: ({ value }) => {
											const parsed = parseDate(value);
											const today = new Date();
											today.setHours(0, 0, 0, 0);

											return !value
												? "A data do deferimento é obrigatória"
												: !parsed
													? "Data inválida"
													: parsed > today
														? "Data futura não permitida"
														: undefined;
										},
										onChangeAsyncDebounceMs: 500,
									}}
									children={(field) => {
										return (
											<>
												<Label htmlFor={field.name}>
													Data do Deferimento/Indeferimento *
												</Label>
												<Input
													id={field.name}
													name={field.name}
													type="date"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<FieldInfo field={field} />
											</>
										);
									}}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<form.Field
								name="result"
								validators={{
									onChange: ({ value }) =>
										!value ? "O resultado é obrigatório" : undefined,
								}}
								children={(field) => {
									return (
										<>
											<Label htmlFor={field.name}>Resultado *</Label>
											<Select
												name={field.name}
												value={field.state.value}
												onValueChange={(value) =>
													field.handleChange(value as FormData["result"])
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Selecione o resultado" />
												</SelectTrigger>
												<SelectContent>
													{processResultOptions.map((resultado) => (
														<SelectItem
															key={resultado.value}
															value={resultado.value}
														>
															{resultado.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldInfo field={field} />
										</>
									);
								}}
							/>
						</div>

						<div className="flex items-start space-x-2 p-4 bg-muted rounded-lg">
							<Checkbox
								id={"terms"}
								checked={acceptTerms}
								onCheckedChange={(checked) =>
									setAcceptTerms(checked as boolean)
								}
								className="mt-1"
							/>
							<Label
								htmlFor="terms"
								className="text-sm leading-relaxed text-muted-foreground cursor-pointer"
							>
								Os dados são fornecidos voluntariamente pela comunidade. Ao
								enviar, você concorda em compartilhar estas informações
								publicamente.
							</Label>
						</div>

						<div className="flex justify-center">
							<ReCAPTCHA
								sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
								onChange={(token) => setCaptchaToken(token)}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							size="lg"
							disabled={isPending}
						>
							{!isPending ? <Send className="mr-2 h-4 w-4" /> : null}
							{isPending ? "Enviando..." : "Enviar Processo"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

/** biome-ignore-all lint/correctness/noChildrenProp: <usamos a prop children no tanstack form> */
import type { AnyFieldApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
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
import {
	PROCESS_RESULT_ENUM,
	PROCESS_TYPE_ENUM,
	type ProcessResultEnum,
	type ProcessTypeEnum,
} from "@/types/enums";

export const Route = createFileRoute("/submission/")({ component: Submission });

const processTypeLabels: Record<ProcessTypeEnum, string> = {
	CR: "CR",
	AUTORIZACAO_COMPRA: "Autorização de Compra",
	CRAF: "CRAF",
	GUIA_TRAFEGO: "Guia de Tráfego",
};

const processResultLabels: Record<ProcessResultEnum, string> = {
	DEFERIDO: "Deferido",
	INDEFERIDO: "Indeferido",
};

const processTypeOptions = PROCESS_TYPE_ENUM.map((value) => ({
	value,
	label: processTypeLabels[value],
}));

const processResultOptions = PROCESS_RESULT_ENUM.map((value) => ({
	value,
	label: processResultLabels[value],
}));

type FormData = {
	processType: ProcessTypeEnum | "";
	om: string;
	dateProtocol: string;
	dateDecision: string;
	result: ProcessResultEnum | "";
};

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
	const navigate = useNavigate();
	const { toast } = useToast();
	const [aceiteTermos, setAceiteTermos] = useState(false);

	const form = useForm({
		defaultValues: {
			processType: "",
			om: "",
			dateProtocol: "",
			dateDecision: "",
			result: "",
		} as FormData,
		onSubmit: async ({ value }) => {
			console.log(value);

			if (!aceiteTermos) {
				toast({
					variant: "destructive",
					title: "Erro",
					description: "Você precisa aceitar os termos para enviar o processo.",
				});
				return;
			}

			// Simulação de envio
			toast({
				title: "Processo enviado com sucesso!",
				description: "Obrigado por contribuir com a comunidade.",
			});

			setTimeout(() => {
				navigate({ to: "/" });
			}, 1500);
		},
	});

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-foreground mb-2">
					Enviar Processo
				</h1>
				<p className="text-muted-foreground">
					Compartilhe o prazo do seu processo e ajude a comunidade
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
								name="processType"
								validators={{
									onChange: ({ value }) =>
										!value ? "O tipo de processo é obrigatório" : undefined,
									onChangeAsyncDebounceMs: 500,
								}}
								children={(field) => {
									// Avoid hasty abstractions. Render props are great!
									return (
										<>
											<Label htmlFor={field.name}>Tipo de Processo *</Label>
											<Select
												name={field.name}
												value={field.state.value}
												onValueChange={(value) =>
													field.handleChange(value as ProcessTypeEnum)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Selecione o tipo" />
												</SelectTrigger>
												<SelectContent>
													{processTypeOptions.map((tipo) => (
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
								name="om"
								validators={{
									onChange: ({ value }) =>
										!value
											? "A OM é obrigatória"
											: value.length < 3
												? "A OM deve ter ao menos 3 caracteres"
												: undefined,
									onChangeAsyncDebounceMs: 500,
								}}
								children={(field) => {
									// Avoid hasty abstractions. Render props are great!
									return (
										<>
											<Label htmlFor={field.name}>
												OM da Polícia Federal *
											</Label>
											<Input
												id={field.name}
												name={field.name}
												type="text"
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<form.Field
									name="dateProtocol"
									validators={{
										onChange: ({ value }) =>
											!value ? "A data do procolo é obrigatória" : undefined,
										onChangeAsyncDebounceMs: 500,
									}}
									children={(field) => {
										// Avoid hasty abstractions. Render props are great!
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
										onChange: ({ value }) =>
											!value
												? "A data do deferimento é obrigatória"
												: undefined,
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
													field.handleChange(value as ProcessResultEnum)
												}
											>
												<SelectTrigger>
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
								checked={aceiteTermos}
								onCheckedChange={(checked) =>
									setAceiteTermos(checked as boolean)
								}
							/>
							<label
								htmlFor="terms"
								className="text-sm leading-relaxed text-muted-foreground cursor-pointer"
							>
								Este site não é oficial da Polícia Federal e os dados são
								fornecidos voluntariamente pela comunidade. Ao enviar, você
								concorda em compartilhar estas informações publicamente.
							</label>
						</div>

						<Button type="submit" className="w-full" size="lg">
							<Send className="mr-2 h-4 w-4" />
							Enviar Processo
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

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
	tipoProcesso: ProcessTypeEnum | "";
	om: string;
	dataProtocolo: string;
	dataDeferimento: string;
	resultado: ProcessResultEnum | "";
};

const omsPoliciaFederal: { sigla: string; nome: string }[] = [];

function Submission() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [formData, setFormData] = useState<FormData>({
		tipoProcesso: "",
		om: "",
		dataProtocolo: "",
		dataDeferimento: "",
		resultado: "",
	});
	const [aceiteTermos, setAceiteTermos] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

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
	};

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
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="tipoProcesso">Tipo de Processo *</Label>
							<Select
								value={formData.tipoProcesso}
								onValueChange={(value) =>
									setFormData({
										...formData,
										tipoProcesso: value as ProcessTypeEnum,
									})
								}
								required
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
						</div>

						<div className="space-y-2">
							<Label htmlFor="om">OM da Polícia Federal *</Label>
							<Input
								type="text"
								value={formData.om}
								onChange={(e) =>
									setFormData({ ...formData, om: e.target.value })
								}
								required
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="dataProtocolo">Data do Protocolo *</Label>
								<Input
									type="date"
									value={formData.dataProtocolo}
									onChange={(e) =>
										setFormData({ ...formData, dataProtocolo: e.target.value })
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="dataDeferimento">
									Data do Deferimento/Indeferimento *
								</Label>
								<Input
									type="date"
									value={formData.dataDeferimento}
									onChange={(e) =>
										setFormData({
											...formData,
											dataDeferimento: e.target.value,
										})
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="resultado">Resultado *</Label>
							<Select
								value={formData.resultado}
								onValueChange={(value) =>
									setFormData({
										...formData,
										resultado: value as ProcessResultEnum,
									})
								}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o resultado" />
								</SelectTrigger>
								<SelectContent>
									{processResultOptions.map((resultado) => (
										<SelectItem key={resultado.value} value={resultado.value}>
											{resultado.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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

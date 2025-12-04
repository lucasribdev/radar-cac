import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Option = {
	value: string;
	label: string;
};

type ComboboxProps = {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
};

export function Combobox({
	options,
	value,
	onChange,
	placeholder = "Selecione...",
	searchPlaceholder = "Pesquisar...",
	emptyMessage = "Nenhum resultado encontrado.",
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const selectedLabel = value
		? options.find((option) => option.value === value)?.label
		: undefined;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between font-normal"
				>
					{selectedLabel ?? placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="p-0"
				style={{ width: "var(--radix-popper-anchor-width)" }}
			>
				<Command>
					<CommandInput placeholder={searchPlaceholder} className="h-9" />
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										const newValue = currentValue === value ? "" : currentValue;
										onChange(newValue);
										setOpen(false);
									}}
								>
									{option.label}
									<Check
										className={cn(
											"ml-auto",
											value === option.value ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

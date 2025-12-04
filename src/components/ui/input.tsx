import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
	className,
	type,
	onChange,
	...props
}: React.ComponentProps<"input">) {
	const isDate = type === "date";
	const [hasValue, setHasValue] = React.useState(() => {
		if (!isDate) return true;
		const initialValue = (props.value ?? props.defaultValue ?? "") as string;
		return initialValue !== "";
	});

	React.useEffect(() => {
		if (!isDate) return;
		const nextHasValue =
			((props.value ?? props.defaultValue ?? "") as string) !== "";
		setHasValue((current) => (current === nextHasValue ? current : nextHasValue));
	}, [isDate, props.defaultValue, props.value]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (isDate) {
			setHasValue(event.target.value !== "");
		}
		onChange?.(event);
	};

	return (
		<input
			type={type}
			data-slot="input"
			onChange={handleChange}
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				isDate && !hasValue && "text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };

import type { ReactNode } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastVariant = "default" | "destructive";

type ToastProps = ExternalToast & {
	title?: ReactNode;
	description?: ReactNode;
	variant?: ToastVariant;
};

// Wrapper to keep the same call signature used across the app
const toast = ({ title, description, variant = "default", ...props }: ToastProps) => {
	const message = title ?? description ?? "";
	const options: ExternalToast = {
		...props,
		description: title ? description : undefined,
	};

	if (variant === "destructive") {
		return sonnerToast.error(message, options);
	}

	return sonnerToast(message, options);
};

function useToast() {
	return {
		toast,
		dismiss: sonnerToast.dismiss,
	};
}

export { toast, useToast };
export type { ToastProps, ToastVariant };

"use client"; // Next.js: this component runs on the client (uses hooks via react-hook-form)

import React from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import { cva, type VariantProps } from "class-variance-authority";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { formatNumber, parseCurrency } from "@/lib/formatter";

/* -------------------------------------------------------------------------- */
/*  Styling variants                                                          */
/* -------------------------------------------------------------------------- */

// cva builds the class string from the `size` and `floating` props.
// "peer" is REQUIRED: the sibling <label> elements below use peer-focus / peer-[...]
// selectors, which only work if the input has the "peer" class.
const inputVariants = cva(
    "peer w-full placeholder-transparent dark:text-white focus:outline-none text-center",
    {
        variants: {
            size: {
                default: "",
                md: "h-10 !text-md",
                lg: "h-14 !text-xl",
            },
            // Extra top padding so the floating label doesn't overlap the typed text
            floating: {
                true: "pt-2",
                false: "",
            },
        },
        defaultVariants: {
            size: "default",
            floating: false,
        },
    }
);

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Props extends VariantProps<typeof inputVariants> {
    id: string; // Field name in the form AND the HTML id of the input
    label: string; // Text shown as label (static or floating)
    control: Control<any>; // react-hook-form control object
    placeHolder?: string;
    isNumber?: boolean; // Format as number with thousand separators
    isNumberWithoutDot?: boolean; // Format as number without separators
    isCurrency?: boolean; // Same as isNumber, plus the "Rp" prefix
    isFloating?: boolean; // Use the floating-label style
    isTextArea?: boolean; // Render a <textarea> instead of <input>
    disabled?: boolean;
    error?: FieldError; // Validation error from react-hook-form
    addComp?: React.ReactNode; // Extra element rendered inside the wrapper (e.g. an icon/button)
    maxLength?: number;
}

/* -------------------------------------------------------------------------- */
/*  Pure helpers (no React, easy to unit test)                                */
/* -------------------------------------------------------------------------- */

// Value shown inside the field: formatted for number modes, raw for plain text.
function getDisplayValue(
    rawValue: any,
    { isNumber, isNumberWithoutDot, isCurrency }: Pick<
        Props,
        "isNumber" | "isNumberWithoutDot" | "isCurrency"
    >
) {
    if (isNumberWithoutDot) return formatNumber(rawValue, true);
    if (isNumber || isCurrency) return formatNumber(rawValue);
    return rawValue;
}

// Value stored in the form: parsed back to a clean number for number modes,
// otherwise the text exactly as typed. Also enforces maxLength.
function getStoredValue(
    input: string,
    {
        isNumber,
        isCurrency,
        maxLength,
    }: Pick<Props, "isNumber" | "isCurrency" | "maxLength">
) {
    // Cut the text if it is longer than maxLength
    const trimmed = maxLength ? input.slice(0, maxLength) : input;

    // Strip formatting (dots, etc.) when the field is numeric
    return isNumber || isCurrency ? parseCurrency(trimmed) : trimmed;
}

/* -------------------------------------------------------------------------- */
/*  Small presentational sub-components                                       */
/* -------------------------------------------------------------------------- */

// "Rp" prefix that fades in on focus or when the field has a value.
// It is positioned absolutely, so it must stay a SIBLING right after the input (peer).
function CurrencyPrefix() {
    return (
        <label
            className="absolute left-3 -translate-y-1/2 top-1/2 text-base text-gray-400 text-center
                opacity-0 peer-focus:opacity-100 peer-[&:not(:placeholder-shown)]:opacity-100
                transition-opacity duration-200
                peer-[&:not(:placeholder-shown)]:text-xs"
        >
            Rp
        </label>
    );
}

// Floating label: sits in the middle of the field, then moves to the top and
// shrinks when the input is focused or filled (placeholder is " " in floating mode).
function FloatingLabel({ id, label }: { id: string; label: string }) {
    return (
        <label
            htmlFor={id}
            className="absolute left-1/2 -translate-x-1/2 top-4 text-base text-gray-400 transition-all text-center
                peer-focus:top-0 peer-focus:text-xs
                peer-[&:not(:placeholder-shown)]:top-0.5 peer-[&:not(:placeholder-shown)]:text-xs"
        >
            {label}
        </label>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export function CustomInput({
    id,
    label,
    error,
    control,
    placeHolder = "setPlaceHolder", // Default kept from the original code
    isNumber = false,
    isNumberWithoutDot = false,
    isCurrency = false,
    isFloating = false,
    isTextArea = false,
    disabled = false,
    size,
    className,
    addComp,
    maxLength,
    ...divProps // Remaining props (onClick, data-*, etc.) go to the outer <div>
}: Props & React.ComponentProps<"div">) {
    // Group the number-related flags once so the helpers can share them
    const formatOptions = { isNumber, isNumberWithoutDot, isCurrency, maxLength };

    return (
        <div className="flex flex-col w-full" {...divProps}>
            <div className="relative w-full">
                {/* Static label: only shown when NOT using the floating style */}
                {!isFloating && (
                    <Label className="pb-2" htmlFor={id}>
                        {label}
                    </Label>
                )}

                {/* Connects the input to react-hook-form */}
                <Controller
                    name={id}
                    control={control}
                    render={({ field }) => {
                        // Props shared by <Input> and <Textarea>
                        const inputProps = {
                            id,
                            disabled,
                            // Floating mode needs " " so :placeholder-shown works for the label animation
                            placeholder: isFloating ? " " : placeHolder,
                            className: cn(
                                inputVariants({ size, floating: isFloating }),
                                className
                            ),
                            // Show formatted value, but keep the raw value in the form
                            value: getDisplayValue(field.value ?? "", formatOptions),
                            onChange: (
                                e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) =>
                                field.onChange(
                                    getStoredValue(e.target.value, formatOptions)
                                ),
                            onBlur: field.onBlur,
                            name: field.name,
                            ref: field.ref,
                            maxLength,
                        };

                        // Pick the element type; `type="text"` is used even for numbers
                        // because formatting (dots) is not valid in type="number"
                        return isTextArea ? (
                            <Textarea {...inputProps} />
                        ) : (
                            <Input type="text" {...inputProps} />
                        );
                    }}
                />

                {/* Decorations: must come AFTER the input so the peer-* selectors work */}
                {isCurrency && !isTextArea && <CurrencyPrefix />}
                {isFloating && <FloatingLabel id={id} label={label} />}

                {/* Optional extra element supplied by the parent */}
                {addComp}
            </div>

            {/* Validation message from react-hook-form */}
            {error && (
                <span className="text-sm text-red-500">{error.message}</span>
            )}
        </div>
    );
}

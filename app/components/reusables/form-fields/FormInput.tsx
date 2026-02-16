"use client";

import { useFormContext } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

import { RegisterOptions } from "react-hook-form";

type FormInputProps = {
    name: string;
    label?: string;
    labelHelper?: string;
    placeholder?: string;
    vertical?: boolean;
    rules?: RegisterOptions; // ✅ ADD THIS
} & InputProps;

const FormInput = ({
    name,
    label,
    labelHelper,
    placeholder,
    vertical = false,
    rules,
    ...props
}: FormInputProps) => {
    const { control } = useFormContext();

    const verticalInput = (
        <FormField
            control={control}
            name={name}
            rules={rules} // ✅ IMPORTANT
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{`${label}:`}</FormLabel>}

                    {labelHelper && (
                        <span className="text-xs">{labelHelper}</span>
                    )}

                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeholder}
                            className="w-[13rem]"
                            {...props}
                        />
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const horizontalInput = (
        <FormField
            control={control}
            name={name}
            rules={rules} // ✅ IMPORTANT
            render={({ field }) => (
                <FormItem>
                    <div className="flex w-full gap-5 items-center text-sm">
                        {label && (
                            <FormLabel className="flex-1">
                                {`${label}:`}
                            </FormLabel>
                        )}

                        <div className="flex-1">
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={placeholder}
                                    className="w-[13rem]"
                                    {...props}
                                />
                            </FormControl>

                            <FormMessage />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    );

    return vertical ? verticalInput : horizontalInput;
};

export default FormInput;

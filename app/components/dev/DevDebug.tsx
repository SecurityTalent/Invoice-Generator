"use client";

// Next
import { Link } from "@/i18n/navigation";

// RHF
import { useFormContext } from "react-hook-form";

// Component
import { BaseButton } from "@/app/components";

// Variables
import { FORM_FILL_VALUES } from "@/lib/variables";

type DevDebugProps = {};

const DevDebug = ({}: DevDebugProps) => {
    const { reset, formState } = useFormContext();
    // console.log(formState);

    return (
        <div className="flex border-2 border-red-500 rounded-md p-2 gap-2">
            <div className="flex flex-col">
                <b style={{margin: '6px 60px 18px 40px',}}>DEV: <a href="http://securitytalent.net">MD Mehedi Hasan</a></b>
                {/* Form: {formState.isDirty ? "Dirty" : "Clean"} */}

                
                <BaseButton
                
                    tooltipLabel="Form Test Fill"
                    variant="outline"
                    onClick={() => reset(FORM_FILL_VALUES)}
                >
                    Fill in the form
                </BaseButton>
            </div>

            {/* <div className="flex flex-col">
               <Link
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm 
                                hover:bg-gray-100 hover:border-gray-600 
                                transition-all duration-200 mb-4 p-4"
                    href={`/template/1`}
                    >
                    Template 1
                    </Link>

                    <Link
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm 
                                hover:bg-gray-100 hover:border-gray-600 
                                transition-all duration-200 p-4"
                    href={`/template/2`}
                    >
                    Template 2
                </Link>
            </div> */}
        </div>
    );
};

export default DevDebug;

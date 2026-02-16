import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplate2 = (data: InvoiceType) => {
    const { sender, receiver, details } = data;

    return (
        <InvoiceLayout data={data}>
            {/* Header */}
            <div className="flex justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                        Invoice #
                    </h2>
                    <span className="mt-1 block text-gray-500">
                        {details.invoiceNumber}
                    </span>

                    {details.invoiceLogo && (
                        <img
                            src={details.invoiceLogo}
                            width={140}
                            height={100}
                            alt={`Logo of ${sender.name}`}
                        />
                    )}

                    <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600">
                        {sender.name}
                    </h1>
                </div>

                <div className="text-right">
                    <address className="mt-4 not-italic text-gray-800">
                        {sender.address}
                        <br />
                        {sender.zipCode}, {sender.city}
                        <br />
                        {sender.country}
                    </address>
                </div>
            </div>

            {/* Bill To */}
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Bill to:
                    </h3>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {receiver.name}
                    </h3>
                    <address className="mt-2 not-italic text-gray-500">
                        {receiver.address}, {receiver.zipCode}
                        <br />
                        {receiver.city}, {receiver.country}
                    </address>
                </div>

                <div className="sm:text-right space-y-2">
                    <dl className="grid sm:grid-cols-6 gap-x-3">
                        <dt className="col-span-3 font-semibold text-gray-800">
                            Invoice date:
                        </dt>
                        <dd className="col-span-3 text-gray-500">
                            {new Date(details.invoiceDate).toLocaleDateString(
                                "en-US",
                                DATE_OPTIONS
                            )}
                        </dd>
                    </dl>

                    <dl className="grid sm:grid-cols-6 gap-x-3">
                        <dt className="col-span-3 font-semibold text-gray-800">
                            Due date:
                        </dt>
                        <dd className="col-span-3 text-gray-500">
                            {new Date(details.dueDate).toLocaleDateString(
                                "en-US",
                                DATE_OPTIONS
                            )}
                        </dd>
                    </dl>
                </div>
            </div>

            {/* Items */}
            <div className="mt-6 border border-gray-200 rounded-lg p-2">
                {details.items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-4 border-b border-gray-300 py-2"
                    >
                        <div>{item.name}</div>
                        <div>{item.quantity}</div>
                        <div>
                            {item.unitPrice} {details.currency}
                        </div>
                        <div className="text-right">
                            {item.total} {details.currency}
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals Section */}
            <div className="mt-6 sm:flex sm:justify-end">
                <div className="w-full max-w-md space-y-2">

                    {/* Subtotal */}
                    <div className="flex justify-between">
                        <span className="font-semibold">Subtotal:</span>
                        <span>
                            {formatNumberWithCommas(
                                Number(details.subTotal)
                            )}{" "}
                            {details.currency}
                        </span>
                    </div>

                    {/* Discount */}
                    {details.discountDetails?.amount > 0 && (
                        <div className="flex justify-between">
                            <span className="font-semibold">Discount:</span>
                            <span>
                                - {details.discountDetails.amount}
                                {details.discountDetails.amountType === "amount"
                                    ? ` ${details.currency}`
                                    : "%"}
                            </span>
                        </div>
                    )}

                    {/* ✅ Advance (Previously Tax) */}
                    {details.taxDetails?.amount > 0 && (
                        <div className="flex justify-between">
                            <span className="font-semibold">Advance:</span>
                            <span>
                                + {details.taxDetails.amount}
                                {details.taxDetails.amountType === "amount"
                                    ? ` ${details.currency}`
                                    : "%"}
                            </span>
                        </div>
                    )}

                    {/* Shipping */}
                    {details.shippingDetails?.cost > 0 && (
                        <div className="flex justify-between">
                            <span className="font-semibold">Shipping:</span>
                            <span>
                                + {details.shippingDetails.cost}
                                {details.shippingDetails.costType === "amount"
                                    ? ` ${details.currency}`
                                    : "%"}
                            </span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>
                            {formatNumberWithCommas(
                                Number(details.totalAmount)
                            )}{" "}
                            {details.currency}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
                {details.additionalNotes && (
                    <>
                        <p className="font-semibold">Additional notes:</p>
                        <p>{details.additionalNotes}</p>
                    </>
                )}

                {details.paymentTerms && (
                    <>
                        <p className="font-semibold mt-3">
                            Payment terms:
                        </p>
                        <p>{details.paymentTerms}</p>
                    </>
                )}
            </div>

            {/* Signature */}
            {details?.signature?.data && isDataUrl(details.signature.data) && (
                <div className="mt-6">
                    <p className="font-semibold">Signature:</p>
                    <img
                        src={details.signature.data}
                        width={120}
                        height={60}
                        alt="Signature"
                    />
                </div>
            )}
        </InvoiceLayout>
    );
};

export default InvoiceTemplate2;

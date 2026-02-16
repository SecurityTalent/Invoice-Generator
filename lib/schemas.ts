import { z } from "zod";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// ------------------------------
// Field Validators
// ------------------------------
const fieldValidators = {
  name: z.string().min(2, "Must be at least 2 characters").max(50, "Must be at most 50 characters"),
  address: z.string().min(2, "Must be at least 2 characters").max(70, "Must be between 2 and 70 characters"),

  // Optional fields with conditional validation
  zipCode: z.string().optional().refine(val => !val || (val.length >= 2 && val.length <= 20), {
    message: "Must be between 2 and 20 characters"
  }),
  city: z.string().optional().refine(val => !val || (val.length >= 1 && val.length <= 50), {
    message: "Must be between 1 and 50 characters"
  }),
  country: z.string().min(1, "Country is required").max(70, "Must be between 1 and 70 characters"),

  email: z.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Email must be a valid email"
  }),

  phone: z.string().min(1, "Phone number is required").max(50, "Must be between 1 and 50 characters"),

  // Dates
  date: z.date().transform(date => new Date(date).toLocaleDateString("en-US", DATE_OPTIONS)),

  // Items
  quantity: z.coerce.number().gt(0, "Must be a number greater than 0"),
  unitPrice: z.coerce.number().gt(0, "Must be a number greater than 0").lte(Number.MAX_SAFE_INTEGER, `Must be ≤ ${Number.MAX_SAFE_INTEGER}`),

  // Strings
  string: z.string(),
  stringMin1: z.string().min(1, "Must be at least 1 character"),
  stringOptional: z.string().optional(),
  stringToNumber: z.coerce.number(),

  // Charges
  stringToNumberWithMax: z.coerce.number().max(1000000),

  nonNegativeNumber: z.coerce.number().nonnegative("Must be a positive number"),
  numWithCommas: z.coerce.number().nonnegative("Must be a positive number").transform(formatNumberWithCommas),
};

// ------------------------------
// Custom Inputs
// ------------------------------
const CustomInputSchema = z.object({
  key: z.string(),
  value: z.string(),
});

// ------------------------------
// Sender / Receiver Schema
// ------------------------------
const InvoiceSenderSchema = z.object({
  name: fieldValidators.name,
  address: fieldValidators.address,
  zipCode: fieldValidators.zipCode,
  city: fieldValidators.city,
  country: fieldValidators.country,
  email: fieldValidators.email,
  phone: fieldValidators.phone,
  customInputs: z.array(CustomInputSchema).optional(),
});

const InvoiceReceiverSchema = z.object({
  name: fieldValidators.name,
  address: fieldValidators.address,
  zipCode: fieldValidators.zipCode,
  city: fieldValidators.city,
  country: fieldValidators.country,
  email: fieldValidators.email,
  phone: fieldValidators.phone,
  customInputs: z.array(CustomInputSchema).optional(),
});

// ------------------------------
// Item Schema
// ------------------------------
const ItemSchema = z.object({
  name: fieldValidators.stringMin1,
  description: fieldValidators.stringOptional,
  quantity: fieldValidators.quantity,
  unitPrice: fieldValidators.unitPrice,
  total: fieldValidators.stringToNumber,
});

// ------------------------------
// Payment / Tax / Discount / Shipping
// ------------------------------

// Payment Information optional & conditional validation
const PaymentInformationSchema = z
  .object({
    bankName: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // যদি কোনো field filled হয়, তাহলে সব field validate হবে min 1 char
    const filled = data.bankName || data.accountName || data.accountNumber;
    if (filled) {
      if (!data.bankName || data.bankName.trim().length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bank Name must be at least 1 character",
          path: ["bankName"],
        });
      }
      if (!data.accountName || data.accountName.trim().length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Account Name must be at least 1 character",
          path: ["accountName"],
        });
      }
      if (!data.accountNumber || data.accountNumber.trim().length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Account Number must be at least 1 character",
          path: ["accountNumber"],
        });
      }
    }
  })
  .optional();

// Other schemas
const DiscountDetailsSchema = z.object({
  amount: fieldValidators.stringToNumberWithMax,
  amountType: fieldValidators.string,
});

const TaxDetailsSchema = z.object({
  amount: fieldValidators.stringToNumberWithMax,
  taxID: fieldValidators.string,
  amountType: fieldValidators.string,
});

const ShippingDetailsSchema = z.object({
  cost: fieldValidators.stringToNumberWithMax,
  costType: fieldValidators.string,
});

// ------------------------------
// Signature & Invoice Details
// ------------------------------
const SignatureSchema = z.object({
  data: fieldValidators.string,
  fontFamily: fieldValidators.string.optional(),
});

const InvoiceDetailsSchema = z.object({
  invoiceLogo: fieldValidators.stringOptional,
  invoiceNumber: fieldValidators.stringMin1,
  invoiceDate: fieldValidators.date,
  dueDate: fieldValidators.date,
  purchaseOrderNumber: fieldValidators.stringOptional,
  currency: fieldValidators.string,
  language: fieldValidators.string,
  items: z.array(ItemSchema),
  paymentInformation: PaymentInformationSchema, // ✅ optional
  taxDetails: TaxDetailsSchema.optional(),
  discountDetails: DiscountDetailsSchema.optional(),
  shippingDetails: ShippingDetailsSchema.optional(),
  subTotal: fieldValidators.nonNegativeNumber,
  totalAmount: fieldValidators.nonNegativeNumber,
  totalAmountInWords: fieldValidators.string,
  additionalNotes: fieldValidators.stringOptional,
  paymentTerms: fieldValidators.stringMin1,
  signature: SignatureSchema.optional(),
  updatedAt: fieldValidators.stringOptional,
  pdfTemplate: z.number(),
});

// ------------------------------
// Full Invoice Schema
// ------------------------------
const InvoiceSchema = z.object({
  sender: InvoiceSenderSchema,
  receiver: InvoiceReceiverSchema,
  details: InvoiceDetailsSchema,
});

export { InvoiceSchema, ItemSchema };

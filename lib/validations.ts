import { z } from "zod";

// Common regex patterns that support Turkish characters
const nameRegex = /^[A-Za-zÇçĞğİıÖöŞşÜü' -]+$/;
const usernameRegex = /^[a-z0-9_.]+$/;
const phoneRegex = /^\+?[0-9 ()-]{7,20}$/;

export const validationMessages = {
	name: {
		required: "Ad alanı zorunludur.",
		format: "Ad yalnızca harf, boşluk ve (') içerebilir.",
		length: "Ad 2 ile 50 karakter arasında olmalıdır."
	},
	username: {
		required: "Kullanıcı adı zorunludur.",
		format: "Kullanıcı adı küçük harf, rakam, '.' ve '_' içerebilir.",
		length: "Kullanıcı adı 3 ile 30 karakter arasında olmalıdır."
	},
	email: {
		required: "E‑posta adresi zorunludur.",
		format: "Geçerli bir e‑posta adresi girin."
	},
	password: {
		required: "Parola zorunludur.",
		length: "Parola en az 8 karakter olmalıdır.",
		complexity: "Parola en az bir büyük, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
	},
	title: {
		required: "Başlık zorunludur.",
		length: "Başlık 5 ile 120 karakter arasında olmalıdır."
	},
	description: {
		length: "Açıklama en fazla 2000 karakter olmalıdır."
	},
	content: {
		required: "İçerik zorunludur.",
		length: "İçerik çok uzun. Lütfen kısaltın."
	},
	url: {
		format: "Geçerli bir URL girin."
	},
	phone: {
		format: "Geçerli bir telefon numarası girin."
	}
} as const;

export const schemas = {
	name: z
		.string({ required_error: validationMessages.name.required })
		.min(2, validationMessages.name.length)
		.max(50, validationMessages.name.length)
		.regex(nameRegex, validationMessages.name.format)
		.transform((v) => v.trim()),

	username: z
		.string({ required_error: validationMessages.username.required })
		.min(3, validationMessages.username.length)
		.max(30, validationMessages.username.length)
		.regex(usernameRegex, validationMessages.username.format),

	email: z
		.string({ required_error: validationMessages.email.required })
		.email(validationMessages.email.format)
		.transform((v) => v.toLowerCase().trim()),

	password: z
		.string({ required_error: validationMessages.password.required })
		.min(8, validationMessages.password.length)
		.refine((v) => /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v), {
			message: validationMessages.password.complexity
		}),

	title: z
		.string({ required_error: validationMessages.title.required })
		.min(5, validationMessages.title.length)
		.max(120, validationMessages.title.length)
		.transform((v) => v.trim()),

	descriptionOptional: z
		.string()
		.max(2000, validationMessages.description.length)
		.optional()
		.transform((v) => (typeof v === "string" ? v.trim() : v)),

	plainTextOptional: (max: number) =>
		z
			.string()
			.max(max, validationMessages.content.length)
			.optional()
			.transform((v) => (typeof v === "string" ? v.trim() : v)),

	urlOptional: z.string().url(validationMessages.url.format).optional(),

	phoneOptional: z
		.string()
		.regex(phoneRegex, validationMessages.phone.format)
		.optional(),

	intId: z.string().regex(/^[0-9]+$/, "Geçersiz kimlik."),
	cuid: z.string().cuid("Geçersiz kimlik.")
};

export type InferSafe<T extends z.ZodTypeAny> = z.infer<T>;

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  role: z.literal("candidate").default("candidate").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(1, "Şifre gerekli"),
});

export const guestPurchaseSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz").transform((v) => v.toLowerCase().trim()),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır").max(50, "İsim en fazla 50 karakter olabilir"),
  planType: z.enum(["TEMEL", "PRO", "VIP"], { required_error: "Geçersiz plan türü" }),
  durationMonths: z.number().min(1).max(24).default(12).optional(),
});


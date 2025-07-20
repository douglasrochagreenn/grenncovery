import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

// Função para criar o mapeamento de erros personalizado com tipos
function createCustomErrorMap(): z.ZodErrorMap {
  return (issue, _ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_type) {
      // console.info(`Esperado ${issue.expected}, mas recebido ${issue.received}`);
      return { message: "Campo obrigatório!" };
    }
    if (issue.code === z.ZodIssueCode.custom) {
      return { message: `Erro customizado: ${issue.message}` };
    }
    if (issue.code === z.ZodIssueCode.too_small) {
      if (issue.type === "string") {
        return { message: "Campo obrigatório!" };
      }
    }
    return { message: _ctx.defaultError };
  };
}

// Configurando o Zod para usar o mapeamento de erros personalizado
z.setErrorMap(createCustomErrorMap());

// Função para validar o dígito verificador do CPF
function isValidCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica se todos os dígitos são iguais

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10 || firstDigit === 11) firstDigit = 0;
  if (firstDigit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10 || secondDigit === 11) secondDigit = 0;
  if (secondDigit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Regex para validar a extensão do email
const emailRegex = /\.[a-zA-Z]{2,4}$/;

// Esquema para o campo de Nome
const nameSchema = z.string().min(1, "Nome é obrigatório");

// Esquema para o campo de CPF
const cpfSchema = z
  .string()
  .min(1, "CPF é obrigatório")
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato ###.###.###-##")
  .refine(isValidCPF, { message: "CPF inválido" });

// Esquema para o campo de CEP
const cepSchema = z
  .string()
  .min(1, "CEP é obrigatório")
  .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato #####-###");

// Esquema para o campo de Cidade/Estado ( REMOVER AO VALIDAR USER UPDATE !!!!!)
const cityAndStateSchema = z.string().min(1, "Cidade/Estado é obrigatório");

// Esquema para o campo de Estado
const stateSchema = z.string().min(1, "Estado é obrigatório");

// Esquema para o campo de Cidade
const citySchema = z.string().min(1, "Cidade é obrigatório");

// Esquema para o campo de Telefone
const phoneSchema = z.string().min(1, "Telefone é obrigatório");

// Esquema para o campo de Email
const emailSchema = z
  .string()
  .email("Email inválido")
  .min(1, "Email é obrigatório")
  .regex(emailRegex, "Email deve terminar com um domínio válido");

// Esquema para o campo de Senha
const passwordSchema = z
  .string()
  .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  .regex(/[A-Z]/, {
    message: "A senha deve conter pelo menos uma letra maiúscula",
  })
  .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "A senha deve conter pelo menos um caractere especial",
  });

// Esquema para o campo de confirmar Senha
const passwordConfirmedSchema = z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" });

// Esquema para o campo de Senha ( Login )
const passwordLoginSchema = z.string();

// Esquema para o campo de CNPJ
const cnpjSchema = z.string().min(1, "CNPJ é obrigatório");

// Esquema para o campo de Arquivos
const fileSchema = z
  .instanceof(File, {
    message: "Arquivo é obrigatório e deve ser um arquivo válido",
  })
  .refine((file) => file.size <= 5000000, { message: "Arquivo deve ter no máximo 5MB" }) // Tamanho máximo de 5MB
  .refine((file) => ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.type), {
    message: "Tipo de arquivo inválido, deve ser PNG, JPPG, JPEG ou WEBP",
  });

// Esquema para o campo de Arquivos com PDF
const fileWithPdfSchema = z
  .instanceof(File, {
    message: "Arquivo é obrigatório e deve ser um arquivo válido",
  })
  .refine((file) => file.size <= 5000000, { message: "Arquivo deve ter no máximo 5MB" }) // Tamanho máximo de 5MB
  .refine((file) => ["image/png", "image/jpg", "image/jpeg", "image/webp", "application/pdf"].includes(file.type), {
    message: "Tipo de arquivo inválido, deve ser PNG, JPG, JPEG, WEBP ou PDF",
  });

// Esquema para o campo tipo de contas
const documentTypeSchema = z.enum(["CPF", "CNPJ"]).default("CPF");

// Esquema para o campo de Razão Social
const corporateSchema = z.string().min(1, "Razão Social é obrigatório");

// Esquema para o campo de Nome Fantasia
const fantasyNameSchema = z.string().min(1, "Nome Fantasia é obrigatório");
// ------------------------------------------------------------------------------------->>> CREATE AND UPDATE ADDRESS COMPANY
const ruaSchema = z.string().min(1, "Rua é obrigatório");
const NumeroSchema = z.string().min(1, "Número é obrigatório");
const complementoSchema = z.string().min(1, "Complemento é obrigatório").optional();
const bairroSchema = z.string().min(1, "Bairro é obrigatório");
const cidadeSchema = z.string().min(1, "Cidade é obrigatório");
const estadoSchema = z.string().min(1, "Estado é obrigatório");

// Esquemas para criar o anúncio
// ------------------------------------------------------------------------------------->>> CREATE ADS STEPS
// --------------------------------->>> STEP 1
const brandSchema = z.string().min(1, "Marca é obrigatório");
const modelSchema = z.string().min(1, "Modelo é obrigatório");
const modelYearSchema = z.string().min(1, "Ano do modelo é obrigatório");
const manufacturingYearSchema = z.string().min(1, "Ano de fabricação é obrigatório");
const versionSchema = z.string().min(1, "Versão é obrigatório");
const armorSchema = z.string().min(1, "Blindagem é obrigatório");
const colorSchema = z.string().min(1, "Cor é obrigatório");
// --------------------------------->>> STEP 2
const bodyworkSchema = z.string().min(1, "Carroceria é obrigatório");
const fuelSchema = z.string().min(1, "Combustível é obrigatório");
const acceptsTradeSchema = z.string().min(1, "Aceitar troca é obrigatório");
const endPlateSchema = z.string().min(1, "Final da placa é obrigatório");
const mileageSchema = z.string().min(1, "Quilometragem do veículo é obrigatório");
const vechicleDescriptionSchema = z.string().min(1, "Descrição do veículo é obrigatório");
const VechileValueSchema = z.string().min(1, "Valor do veículo é obrigatório");
const vechicleInformationSchema = z.string().min(1, "Demais informações do veículo é obrigatório");
// --------------------------------->>> STEP 3
const optionalSchema = z.array(z.string()).nonempty("Os opcionais não podem estar vazio");

// ------------------------------------------------------------------------------------->>> PANEL ADM CREATE BRANDS
const brandNameSchema = z.string().min(1, "Nome da marca é obrigatório");
const brandCountrySchema = z.string().min(1, "País da marca é obrigatório");
// ------------------------------------------------------------------------------------->>> PANEL ADM CREATE VECHICLE
const vechicleTypeSchema = z.string().min(1, "Tipo do veículo é obrigatorio").default("Carro");

const transmissionSchema = z.string().min(1, "O tipo de câmbio é obrigatório");
const doorsSchema = z.string().min(1, "Número de portas é obrigatório").default("2");

export const rawSchemaSignupPF = z.object({
  username: nameSchema,
  documentNumber: cpfSchema,
  zipCode: cepSchema,
  addressStreetName: ruaSchema,
  addressNumber: NumeroSchema,
  addressComplement: complementoSchema,
  neighborhood: bairroSchema,
  state: cityAndStateSchema,
  city: cityAndStateSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
  documentType: documentTypeSchema.optional(),
});
export const schemaSignupPF = toTypedSchema(rawSchemaSignupPF);
export type ISignupPF = z.infer<typeof rawSchemaSignupPF>;

export const rawSchemaSignupPJ = z.object({
  username: nameSchema,
  cpf: cpfSchema,
  zipCode: cepSchema,
  addressStreetName: ruaSchema,
  addressNumber: NumeroSchema,
  addressComplement: complementoSchema,
  neighborhood: bairroSchema,
  state: cityAndStateSchema,
  city: cityAndStateSchema,
  email: emailSchema,
  password: passwordSchema,
  corporateReason: corporateSchema,
  fantasyName: fantasyNameSchema,
  documentNumber: cnpjSchema,
  phone: phoneSchema,
  documentType: documentTypeSchema,
  file: fileWithPdfSchema,
});
export const schemaSignupPJ = toTypedSchema(rawSchemaSignupPJ);
export type ISignupPJ = z.infer<typeof rawSchemaSignupPJ>;

export const rawSchemaLogin = z.object({
  email: emailSchema,
  password: passwordLoginSchema,
});
export const schemaLogin = toTypedSchema(rawSchemaLogin);
export type ILogin = z.infer<typeof rawSchemaLogin>;

export const rawSchemaRecoverPassword = z.object({
  email: emailSchema,
});
export const schemaRecoverPassword = toTypedSchema(rawSchemaRecoverPassword);
export type IRecoverPassword = z.infer<typeof rawSchemaRecoverPassword>;

export const rawSchemaNewPassword = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordConfirmedSchema,
    token: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["password_confirm"], // O erro será anexado ao campo 'password_confirm'
  });
export const schemaNewPassword = toTypedSchema(rawSchemaNewPassword);
export type INewPassword = z.infer<typeof rawSchemaNewPassword>;

export const schemaUserUpdate = toTypedSchema(
  z.object({
    username: nameSchema,
    documentNumber: cpfSchema,
    zipCode: cepSchema,
    city: cityAndStateSchema,
    phone: phoneSchema,
    email: emailSchema,
  })
);

export const schemaCompanyUpdate = toTypedSchema(
  z.object({
    corporateReason: corporateSchema,
    fantasyName: fantasyNameSchema,
    documentNumber: cnpjSchema,
  })
);

export const schemaUserAddress = toTypedSchema(
  z.object({
    zipCode: cepSchema,
    addressStreetName: ruaSchema,
    addressNumber: NumeroSchema,
    addressComplement: complementoSchema,
    neighborhood: bairroSchema,
    city: cidadeSchema,
    state: estadoSchema,
  })
);

export const schemaAddAdsStep1 = toTypedSchema(
  z.object({
    brandId: brandSchema,
    model: modelSchema,
    ModelYear: modelYearSchema,
    manufacturingYear: manufacturingYearSchema,
    vehicleVersionId: versionSchema,
    transmission: transmissionSchema,
    doors: doorsSchema,
    armor: armorSchema,
    color: colorSchema,
    state: stateSchema,
    city: citySchema,
  })
);

export const schemaAddAdsStep2 = toTypedSchema(
  z.object({
    bodywork: bodyworkSchema,
    fuel: fuelSchema,
    acceptsTrade: acceptsTradeSchema,
    endPlate: endPlateSchema,
    mileage: mileageSchema,
    vechicleDescription: vechicleDescriptionSchema,
    VechileValue: VechileValueSchema,
    vechicleInformation: vechicleInformationSchema,
  })
);

export const schemaAddAdsStep3 = toTypedSchema(
  z.object({
    optionals: optionalSchema,
  })
);

export const schemaPanelAdmFilterBrand = toTypedSchema(
  z.object({
    brand: brandSchema,
    model: z.string().optional(),
    year: z.string().optional(),
    version: z.string().optional(),
  })
);

export const schemaPanelAdmCreateBrand = toTypedSchema(
  z.object({
    name: brandNameSchema,
    country: brandCountrySchema,
    file: fileSchema.optional(),
  })
);

export const schemaPanelAdmCreateVechicle = toTypedSchema(
  z.object({
    brandId: brandNameSchema,
    model: modelSchema,
    fuelType: fuelSchema,
    transmission: transmissionSchema,
    type: vechicleTypeSchema,
    versions: z.array(
      z.object({
        versionName: versionSchema,
      })
    ),
    modality: z.object({
      modality: bodyworkSchema,
    }),
    year: modelYearSchema,
  })
);

export const schemaAdvertisementLead = toTypedSchema(
  z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
  })
);

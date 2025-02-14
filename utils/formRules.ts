import type { ArrayElement } from "type-fest/source/internal";
import type { VValidation } from "vuetify/components";

// @NOTE: Vuetify 3 doesn't export ValidationRule type...
// So we'll hack our way through to grab the type from a component
type ValidationRule = ArrayElement<NonNullable<InstanceType<typeof VValidation>["$props"]["rules"]>>;

type FormFieldValue = string | string[];

export const formRules: {
  required: ValidationRule;
  requireAtMostNCharacters: (n: number) => ValidationRule;
} = {
  required: (value: FormFieldValue) => value.length > 0 || "Required",
  requireAtMostNCharacters: (n) => (value: FormFieldValue) => value.length <= n || `Max ${n} characters`,
};

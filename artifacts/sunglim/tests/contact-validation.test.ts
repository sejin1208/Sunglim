import assert from "node:assert/strict";
import test from "node:test";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "../src/lib/contact-schema";

const resolve = (values: ContactFormValues, criteriaMode: "all" | "firstError" = "firstError") =>
  zodResolver(contactSchema)(values, undefined, {
    criteriaMode,
    fields: {},
    shouldUseNativeValidation: false,
  });

const valid: ContactFormValues = {
  name: "테스트 학교",
  phone: "000-0000-0000",
  subject: "교구 문의",
  message: "학교 책상과 의자 견적을 문의합니다.",
};

test("empty contact form returns inline errors instead of rejecting", async () => {
  const result = await resolve({ name: "", phone: "", email: "", subject: "", message: "" });
  assert.deepEqual(result.values, {});
  assert.equal(result.errors.name?.message, "이름을 입력해주세요");
  assert.equal(result.errors.phone?.message, "연락처를 입력해주세요");
  assert.equal(result.errors.subject?.message, "제목을 입력해주세요");
  assert.equal(result.errors.message?.message, "내용을 10자 이상 입력해주세요");
  assert.equal(result.errors.email, undefined);
});

test("malformed email union returns a field error in both criteria modes", async () => {
  for (const mode of ["firstError", "all"] as const) {
    const result = await resolve({ ...valid, email: "not-an-email" }, mode);
    assert.deepEqual(result.values, {});
    assert.equal(result.errors.email?.message, "올바른 이메일 형식이어야 합니다");
  }
});

test("short messages return the existing inline error", async () => {
  const result = await resolve({ ...valid, message: "짧음" });
  assert.equal(result.errors.message?.message, "내용을 10자 이상 입력해주세요");
});

test("valid contacts support omitted, blank, and populated email addresses", async () => {
  for (const values of [valid, { ...valid, email: "" }, { ...valid, email: "school@example.invalid" }]) {
    const result = await resolve(values);
    assert.deepEqual(result.errors, {});
    assert.deepEqual(result.values, values);
  }
});

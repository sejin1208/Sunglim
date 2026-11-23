import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  company: z.string().optional(),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이어야 합니다").optional().or(z.literal("")),
  subject: z.string().min(1, "제목을 입력해주세요"),
  message: z.string().min(10, "내용을 10자 이상 입력해주세요"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

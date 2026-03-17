import { Layout } from "@/components/layout/Layout";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Schema matching the ContactRequest definition
const contactSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  company: z.string().optional(),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이어야 합니다").optional().or(z.literal('')),
  subject: z.string().min(1, "제목을 입력해주세요"),
  message: z.string().min(10, "내용을 10자 이상 입력해주세요")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const submitMutation = useSubmitContact();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormValues) => {
    submitMutation.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "문의가 접수되었습니다.",
          description: "담당자가 확인 후 빠른 시일 내에 연락 드리겠습니다.",
        });
        reset();
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "오류 발생",
          description: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-secondary/30 pt-20 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            고객센터 및 오시는 길
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            궁금하신 점이나 견적 문의를 남겨주시면 친절하게 안내해 드리겠습니다.
          </p>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info & Maps */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <MapPin className="text-primary" /> 사업장 위치
                </h2>
                
                <div className="space-y-8">
                  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold text-primary mb-4">본사</h3>
                    <p className="text-foreground font-medium mb-2">경기도 의정부시 오목로225번길 105. 604호 (민락동)</p>
                    <a
                      href="https://map.naver.com/v5/search/경기도 의정부시 오목로225번길 105"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-48 bg-primary/5 border-2 border-primary/20 rounded-xl mt-4 flex flex-col items-center justify-center gap-3 hover:bg-primary/10 transition-colors group cursor-pointer"
                    >
                      <MapPin className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                      <span className="bg-primary text-white px-5 py-2 rounded-lg font-bold shadow-lg text-sm">네이버 지도 보기</span>
                    </a>
                  </div>

                  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold text-primary mb-4">공장</h3>
                    <p className="text-foreground font-medium mb-2">경기도 양주시 광적면 현석로 58-20</p>
                    <a
                      href="https://map.naver.com/v5/search/경기도 양주시 광적면 현석로 58-20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-48 bg-primary/5 border-2 border-primary/20 rounded-xl mt-4 flex flex-col items-center justify-center gap-3 hover:bg-primary/10 transition-colors group cursor-pointer"
                    >
                      <MapPin className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                      <span className="bg-primary text-white px-5 py-2 rounded-lg font-bold shadow-lg text-sm">네이버 지도 보기</span>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">고객 상담 안내</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">전화 번호</p>
                      <p className="font-bold text-lg">02-766-1496</p>
                      <p className="text-sm text-muted-foreground">FAX: 02-765-4602</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">운영 시간</p>
                      <p className="font-bold">평일 09:00 - 16:30</p>
                      <p className="text-sm text-muted-foreground">주말 및 공휴일 휴무</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-card p-8 md:p-10 rounded-3xl shadow-xl border border-border sticky top-32">
                <h2 className="text-2xl font-bold mb-2">온라인 문의</h2>
                <p className="text-muted-foreground mb-8">
                  제품 견적이나 기타 문의사항을 남겨주세요.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">이름 / 담당자명 <span className="text-destructive">*</span></label>
                      <input 
                        {...register("name")}
                        className={`w-full px-4 py-3 rounded-xl bg-background border-2 transition-all ${errors.name ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'} focus:outline-none focus:ring-4`}
                        placeholder="홍길동"
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">기관명 / 회사명</label>
                      <input 
                        {...register("company")}
                        className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                        placeholder="ㅇㅇ초등학교"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">연락처 <span className="text-destructive">*</span></label>
                      <input 
                        {...register("phone")}
                        className={`w-full px-4 py-3 rounded-xl bg-background border-2 transition-all ${errors.phone ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'} focus:outline-none focus:ring-4`}
                        placeholder="010-0000-0000"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">이메일</label>
                      <input 
                        {...register("email")}
                        className={`w-full px-4 py-3 rounded-xl bg-background border-2 transition-all ${errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'} focus:outline-none focus:ring-4`}
                        placeholder="example@email.com"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">문의 제목 <span className="text-destructive">*</span></label>
                    <input 
                      {...register("subject")}
                      className={`w-full px-4 py-3 rounded-xl bg-background border-2 transition-all ${errors.subject ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'} focus:outline-none focus:ring-4`}
                      placeholder="견적 문의드립니다."
                    />
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">문의 내용 <span className="text-destructive">*</span></label>
                    <textarea 
                      {...register("message")}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl bg-background border-2 transition-all resize-none ${errors.message ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'} focus:outline-none focus:ring-4`}
                      placeholder="필요하신 품목, 수량 등을 자세히 적어주시면 더 정확한 상담이 가능합니다."
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {submitMutation.isPending ? "접수 중..." : "문의 접수하기"}
                    {!submitMutation.isPending && <Send className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
}

import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Users, Target } from "lucide-react";

export default function Company() {
  const values = [
    {
      icon: ShieldCheck,
      title: "신뢰와 품질",
      desc: "수십 년간 쌓아온 신뢰를 바탕으로 가장 안전하고 우수한 품질의 교구를 제공합니다."
    },
    {
      icon: Users,
      title: "고객 중심",
      desc: "선생님과 학생들의 편의를 최우선으로 생각하여 맞춤형 솔루션을 제안합니다."
    },
    {
      icon: Target,
      title: "미래 지향",
      desc: "빠르게 변화하는 교육 환경에 발맞춰 혁신적이고 선진화된 제품을 연구합니다."
    }
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-secondary/30 pt-20 pb-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
          >
            회사소개
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            교육의 질을 높이는 든든한 동반자, 성림교구의 발자취를 소개합니다.
          </motion.p>
        </div>
      </div>

      {/* CEO Greeting */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 border-8 border-white/20 z-10 rounded-3xl mix-blend-overlay pointer-events-none" />
                <img 
                  src={`${import.meta.env.BASE_URL}images/company-building.png`} 
                  alt="Sunglim Building" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-6"
            >
              <h2 className="text-3xl font-bold text-primary mb-2">인사말</h2>
              <h3 className="text-2xl font-semibold mb-6">
                "미래를 이끌어갈 인재들의<br/>바른 배움터를 만듭니다."
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  안녕하십니까? (주)성림교구 홈페이지를 방문해주셔서 진심으로 감사합니다.
                </p>
                <p>
                  저희 성림교구는 창립 이래 오직 '교육 환경 개선'이라는 한 길만을 걸어오며, 학교 및 교육기관에 필요한 최고 품질의 교재, 교구, 학용품, 가구류를 공급해왔습니다. 
                </p>
                <p>
                  선생님들께서 가르침에만 전념하실 수 있도록, 그리고 우리 아이들이 더 안전하고 쾌적한 환경에서 꿈을 키울 수 있도록 돕는 것이 저희의 사명이자 기쁨입니다.
                </p>
                <p>
                  앞으로도 변함없는 정직함과 성실함으로 고객 여러분의 믿음에 보답하는 기업이 되겠습니다. 감사합니다.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border">
                <p className="font-bold text-lg text-foreground">(주)성림교구 대표이사</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">핵심 가치</h2>
            <p className="text-muted-foreground">성림교구가 지켜나가는 세 가지 약속입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-card p-10 rounded-3xl border border-border shadow-sm text-center hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <val.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">연혁</h2>
            <p className="text-muted-foreground">성림교구의 지나온 길</p>
          </div>

          <div className="space-y-12">
            {[
              { year: "2020s", events: ["경기 물류창고 확장 이전", "교육청 우수 납품업체 선정", "디지털 교구 사업부 신설"] },
              { year: "2010s", events: ["(주)성림교구 법인 전환", "ISO 9001 품질경영시스템 인증", "친환경 가구 라인업 런칭"] },
              { year: "2000s", events: ["전국 주요 초/중/고등학교 납품망 구축", "체육용품 전문 브랜드 취급 시작"] },
              { year: "1990s", events: ["성림교구 창립 (서울 은평구)", "학용품 및 기본 교구 도매 시작"] },
            ].map((period, idx) => (
              <motion.div 
                key={period.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-6 md:gap-12"
              >
                <div className="md:w-32 flex-shrink-0 md:text-right">
                  <span className="text-3xl font-display font-black text-primary/20">{period.year}</span>
                </div>
                <div className="flex-grow border-l-2 border-primary/20 pl-8 pb-8 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-primary -left-[9px] top-2" />
                  <ul className="space-y-4 mt-1">
                    {period.events.map((event, eIdx) => (
                      <li key={eIdx} className="text-lg text-foreground font-medium flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

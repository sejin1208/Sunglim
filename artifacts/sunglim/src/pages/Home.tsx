import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, PenTool, Dumbbell } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Home() {
  const categories = [
    {
      title: "학생용책상",
      description: "학생들의 학습 환경을 위한 다양한 학생용 책상",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      link: "/products?category=teaching",
      image: `${import.meta.env.BASE_URL}images/teaching-materials.png`
    },
    {
      title: "교실용걸상",
      description: "바른 자세를 도와주는 튼튼한 교실용 걸상",
      icon: PenTool,
      color: "bg-emerald-50 text-emerald-600",
      link: "/products?category=stationery",
      image: `${import.meta.env.BASE_URL}images/stationery.png`
    },
    {
      title: "키높이책상",
      description: "성장기 학생에게 맞춘 높이 조절 가능한 키높이책상",
      icon: Dumbbell,
      color: "bg-orange-50 text-orange-600",
      link: "/products?category=sports",
      image: `${import.meta.env.BASE_URL}images/sports-equip.png`
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Sunglim Edu Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wider mb-6">
                SINCE 2000
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                미래를 키우는<br />
                <span className="text-gradient">바른 교육 환경</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
                전국 초등, 중등, 고등학교에서 필요한 학생용책걸상을 최고의 품질로 공급하며 대한민국의 교육환경 발전과 함께 성장해왔습니다.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products"
                  className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  제품 둘러보기
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact"
                  className="px-8 py-4 rounded-xl font-bold bg-white text-foreground border border-border shadow-sm hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300"
                >
                  견적 문의하기
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">주요 취급 품목</h2>
            <p className="text-muted-foreground text-lg"></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-subtle hover:shadow-hover transition-all duration-500"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-8">
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-6 -mt-14 relative z-20 shadow-lg border-4 border-card`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {cat.description}
                  </p>
                  <Link 
                    href={cat.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all"
                  >
                    자세히 보기 <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick About CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                수십 년간 축적된 노하우로<br />
                최상의 교육 파트너가 되겠습니다.
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl">
                관공서 및 수많은 학교 납품 실적을 보유한 (주)성림교구입니다. 
                단순한 판매를 넘어 교육 환경의 개선을 위해 함께 고민합니다.
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-start lg:justify-end">
              <Link 
                href="/company"
                className="px-8 py-4 rounded-xl font-bold bg-white text-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                회사소개 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

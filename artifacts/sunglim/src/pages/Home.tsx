import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, PenTool, Dumbbell, ClipboardCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useSEO } from "@/hooks/useSEO";

export default function Home() {
  const [shouldPlayHeroVideo, setShouldPlayHeroVideo] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setShouldPlayHeroVideo(event.matches);
    };

    setShouldPlayHeroVideo(motionPreference.matches);
    motionPreference.addEventListener("change", updateMotionPreference);
    return () => motionPreference.removeEventListener("change", updateMotionPreference);
  }, []);

  useSEO({
    title: "학교 책걸상 전문 (주)성림교구 | 학교 책상·걸상·학생용 책걸상 납품",
    description: "학교 책상, 학교 걸상, 학생용 책걸상 전문 기업 (주)성림교구. KS인증·친환경인증·조달청 등록. 전국 초·중·고등학교 납품 실적. 높낮이조절형 친환경 학교 가구. TEL 02-766-1496",
    canonical: "https://www.sunglim.co.kr/",
  });
  const categories = [
    {
      title: "학생용책상",
      description: "성장기 학생의 체형에 맞춘 높이 조절형 프리미엄 학생용 책상",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      link: "/products?category=teaching",
      image: `${import.meta.env.BASE_URL}images/student-desk.jpg`,
      featured: true,
    },
    {
      title: "교실용걸상",
      description: "바른 자세를 도와주는 튼튼한 교실용 걸상",
      icon: PenTool,
      color: "bg-emerald-50 text-emerald-600",
      link: "/products?category=stationery",
      image: `${import.meta.env.BASE_URL}images/classroom-chair.jpg`,
      featured: true,
    },
    {
      title: "스탠딩책상",
      description: "수업 중 졸린 학생을 위한 스탠딩책상",
      icon: Dumbbell,
      color: "bg-orange-50 text-orange-600",
      link: "/products?category=sports",
      image: `${import.meta.env.BASE_URL}images/height-desk.jpg`,
      featured: true,
    },
    {
      title: "감독용걸상",
      description: "수능 시험 감독을 위한 편안하고 안정적인 걸상",
      icon: ClipboardCheck,
      color: "bg-violet-50 text-violet-600",
      link: "/products?category=supervision",
      image: `${import.meta.env.BASE_URL}images/SLC-8.jpg`,
      featured: true,
    },
  ];

  return (
    <Layout>
      {/* Hero Video */}
      <section className="mx-auto aspect-video w-full max-w-[1300px] overflow-hidden bg-black md:aspect-[2/1]" aria-label="성림교구 홍보 영상">
        {shouldPlayHeroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={`${import.meta.env.BASE_URL}images/classroom-hero.jpg`}
            className="block h-full w-full object-contain md:object-cover"
          >
            <source src={`${import.meta.env.BASE_URL}videos/sunglim-promo.mp4`} type="video/mp4" />
          </video>
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}images/classroom-hero.jpg`}
            alt="성림교구 홍보 영상"
            className="block h-full w-full object-contain md:object-cover"
          />
        )}
      </section>

      <section className="bg-background py-4 sm:py-6">
        <div className="mx-auto flex max-w-7xl flex-nowrap justify-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-primary px-2 py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-none sm:gap-2 sm:px-8 sm:py-4 sm:text-base"
          >
            제품 둘러보기
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/contact"
            className="flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-border bg-white px-2 py-3 text-center text-xs font-bold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary sm:flex-none sm:px-8 sm:py-4 sm:text-base"
          >
            견적 문의하기
          </Link>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
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
                className={`group relative bg-card rounded-3xl overflow-hidden border transition-all duration-500 ${
                cat.featured
                  ? "border-primary/30 shadow-lg shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
                  : "border-border shadow-subtle hover:shadow-hover"
              }`}
              >
                {cat.featured && (
                  <div className="absolute top-4 right-4 z-20 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
                    PREMIUM
                  </div>
                )}
                <div className={`overflow-hidden relative ${cat.featured ? "h-64" : "h-48"}`}>
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    cat.featured
                      ? "bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/10"
                      : "bg-black/20 group-hover:bg-transparent"
                  }`} />
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                        cat.featured ? "object-contain bg-gray-50 p-4" : "object-contain bg-gray-50 p-3"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-sm font-medium text-muted-foreground">
                      사진 준비 중
                    </div>
                  )}
                </div>
                <div className={`p-8 ${cat.featured ? "bg-gradient-to-b from-card to-primary/5" : ""}`}>
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-6 -mt-14 relative z-20 shadow-lg border-4 border-card`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${cat.featured ? "text-primary" : ""}`}>{cat.title}</h3>
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

    </Layout>
  );
}

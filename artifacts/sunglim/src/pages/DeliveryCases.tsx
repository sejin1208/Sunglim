import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Building2, CalendarDays, Package, Search } from "lucide-react";

interface DeliveryCase {
  id: number;
  schoolName: string;
  deliveryDate: string;
  modelNames: string;
  imageUrl: string | null;
  note: string | null;
}

async function fetchDeliveryCases(): Promise<DeliveryCase[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}api/delivery-cases`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function DeliveryCases() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["delivery-cases"],
    queryFn: fetchDeliveryCases,
  });

  const filtered = cases.filter(
    (c) =>
      c.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.modelNames.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-secondary/30 pt-20 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">납품사례</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            전국 초·중·고등학교에 납품된 성림교구의 실적을 확인하세요.
          </p>
        </div>
      </div>

      <section className="py-12 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-end mb-10">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="학교명 또는 모델명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filtered.map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] bg-secondary/30 overflow-hidden relative">
                      {c.imageUrl ? (
                        <img
                          src={`${import.meta.env.BASE_URL}${c.imageUrl.replace(/^\//, "")}`}
                          alt={c.schoolName}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-3">{c.schoolName}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                          <span>{c.deliveryDate}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Package className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="flex flex-col gap-0.5">
                            {c.modelNames.split(",").map((m, i) => (
                              <span key={i}>{m.trim()}</span>
                            ))}
                          </span>
                        </div>
                        {c.note && (
                          <p className="text-xs text-muted-foreground pt-1 border-t border-border">{c.note}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {searchQuery ? "검색 결과가 없습니다" : "등록된 납품사례가 없습니다"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ? "다른 검색어를 입력해보세요." : "납품사례를 추가해주세요."}
              </p>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}

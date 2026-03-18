import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CalendarDays, Package, Search } from "lucide-react";

interface DeliveryCase {
  id: number;
  schoolName: string;
  deliveryDate: string;
  modelNames: string;
  imageUrl: string | null;
  note?: string | null;
}

const DELIVERY_CASES: DeliveryCase[] = [
  // 최신순
  { id: 11, schoolName: "심학고등학교",     deliveryDate: "2026-01-16", modelNames: "SLD-0773C-B,SLC-0657",   imageUrl: "/images/delivery/심학고등학교_20260116.jpg" },
  { id: 10, schoolName: "마석중학교",       deliveryDate: "2026-01-16", modelNames: "SLD-0714C,SLC-0656",     imageUrl: "/images/delivery/마석중학교_20260116.jpg" },
  { id: 9,  schoolName: "고진중학교",       deliveryDate: "2026-01-15", modelNames: "SLD-0773-B,SLC-0657",    imageUrl: "/images/delivery/고진중학교_20260115.jpg" },
  { id: 8,  schoolName: "다산한강중학교",   deliveryDate: "2026-01-14", modelNames: "SLD-0725,SLC-0657-L",    imageUrl: "/images/delivery/다산한강중학교_20260114.jpg" },
  { id: 7, schoolName: "원흥중학교",       deliveryDate: "2026-01-08", modelNames: "SLD-0773C,SLC-0657-L",   imageUrl: "/images/delivery/원흥중학교_20260108.jpg" },
  { id: 6, schoolName: "단원고등학교",     deliveryDate: "2025-01-13", modelNames: "SLD-0757-B,SLC-0657",    imageUrl: "/images/delivery/단원고등학교_20250113.jpg" },
  { id: 5, schoolName: "판교중학교",       deliveryDate: "2025-01-13", modelNames: "SLD-0725,SLC-0653",      imageUrl: "/images/delivery/판교중학교_20250113.jpg" },
  { id: 4, schoolName: "고촌중학교",       deliveryDate: "2025-01-09", modelNames: "SLD-0773-B,SLC-0653",    imageUrl: "/images/delivery/고촌중학교_20250109.jpg" },
  { id: 3, schoolName: "버들개초등학교",   deliveryDate: "2025-01-07", modelNames: "SLD-0773,SLC-0653",      imageUrl: "/images/delivery/버들개초등학교_20250107.jpg" },
  { id: 2, schoolName: "시흥장현초등학교", deliveryDate: "2025-01-07", modelNames: "SLD-0773,SLC-0656",      imageUrl: "/images/delivery/장현초등학교_20250107.jpg" },
  { id: 1, schoolName: "잠원중학교",       deliveryDate: "2025-01-07", modelNames: "SLD-0714C-B,SLC-0657-L", imageUrl: "/images/delivery/잠원중학교_20250107.jpg" },
];

function modelLabel(model: string): string {
  const m = model.trim();
  if (m.startsWith("SLD-")) return `학생용책상 ${m}`;
  if (m.startsWith("SLC-")) return `교실용걸상 ${m}`;
  return m;
}

export default function DeliveryCases() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = DELIVERY_CASES.filter(
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

          {filtered.length > 0 ? (
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
                              <span key={i}>{modelLabel(m)}</span>
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
                {searchQuery ? "다른 검색어를 입력해보세요." : ""}
              </p>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}

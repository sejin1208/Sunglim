import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useSearch } from "wouter";

// Mock Product Data
const MOCK_PRODUCTS = [
  // 학생용책상
  { id: 12, name: "친환경 높낮이조절형 강화유리 중고등생 앞가림판 넓은 상판 책상", category: "teaching", price: "82,000원", image: "SLD-17577-B.jpg", model: "SLD-17577-B", specs: "700×500×700~820mm", g2b: "25987920" },
  { id: 13, name: "친환경 높낮이조절형 강화유리 중고등생 앞가림판 책상", category: "teaching", price: "77,500원", image: "SLD-17727-B.jpg", model: "SLD-17727-B", specs: "650×450×700~820mm", g2b: "25987913" },
  { id: 11, name: "친환경 높낮이조절형 강화유리 넓은 상판 책상", category: "teaching", price: "76,000원", image: "SLD-1757.jpg", model: "SLD-1757", specs: "700×500×580~760mm", g2b: "25987918" },
  { id: 10, name: "친환경 높낮이조절형 강화유리 책상", category: "teaching", price: "70,500원", image: "SLD-1772.jpg", model: "SLD-1772", specs: "650×450×580~760mm", g2b: "25987910" },
  { id: 8, name: "친환경 높낮이조절형 세라믹 상판 책상", category: "teaching", price: "76,000원", image: "SLD-17127-B.jpg", model: "SLD-17127-B", specs: "650×450×700~820mm", g2b: "25987909" },
  { id: 9, name: "친환경 높낮이조절형 세라믹 상판 책상", category: "teaching", price: "69,500원", image: "SLD-1712.jpg", model: "SLD-1712", specs: "650×450×580~760mm", g2b: "25987910" },
  // 교실용걸상
  { id: 20, name: "친환경 높낮이조절형 팔걸이 걸상", category: "stationery", price: "50,500원", image: "SLC-06587.jpg", model: "SLC-06587", specs: "435×420×420~500mm", g2b: "25560953" },
  { id: 21, name: "친환경 높낮이조절형 중고등생 사출 걸상", category: "stationery", price: "43,000원", image: "SLC-16577D.jpg", model: "SLC-16577D", specs: "430×420×420~500mm", g2b: "25987893" },
  { id: 22, name: "친환경 높낮이조절형 사출 걸상", category: "stationery", price: "42,500원", image: "SLC-1657.jpg", model: "SLC-1657", specs: "430×420×340~460mm", g2b: "25987872" },
  // 키높이책상
  { id: 30, name: "친환경 높낮이조절형 키높이책상", category: "sports", price: "85,000원", image: "SLD-2712-A.jpg", model: "SLD-2712-A", specs: "650×450×940~1120mm", g2b: "25166812" },
  { id: 31, name: "친환경 키높이책상", category: "sports", price: "77,000원", image: "SLD-2413-A.jpg", model: "SLD-2413-A", specs: "650×450×1050mm", g2b: "25166811" },
  { id: 15, name: "친환경 높낮이조절형 세라믹 중고등생 앞가림판 넓은 상판 책상", category: "teaching", price: "81,000원", image: "SLD-17517-B.jpg", model: "SLD-17517-B", specs: "700×500×700~820mm", g2b: "25987917" },
  { id: 14, name: "친환경 높낮이조절형 세라믹 넓은 상판 책상", category: "teaching", price: "75,000원", image: "SLD-1751.jpg", model: "SLD-1751", specs: "700×500×580~760mm", g2b: "25987915" },
];

const CATEGORIES = [
  { id: "all", name: "전체보기" },
  { id: "teaching", name: "학생용책상" },
  { id: "stationery", name: "교실용걸상" },
  { id: "sports", name: "키높이책상" },
];

export default function Products() {
  const search = useSearch();
  const urlCategory = new URLSearchParams(search).get("category") ?? "all";
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-secondary/30 pt-20 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            제품소개
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            교육 현장에 꼭 필요한 고품질의 다양한 제품들을 만나보세요.
          </p>
        </div>
      </div>

      <section className="py-12 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.id 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="제품명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/${product.image}`} 
                        alt={product.name}
                        className="w-full h-full object-contain bg-white p-3 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-wider mb-2 block">
                        {CATEGORIES.find(c => c.id === product.category)?.name}
                      </span>
                      <h3 className="font-bold text-lg mb-1 text-foreground line-clamp-2">{product.name}</h3>
                      {'model' in product && product.model && (
                        <p className="text-xs text-muted-foreground mb-0.5">모델명: {product.model}</p>
                      )}
                      {'specs' in product && product.specs && (
                        <p className="text-xs text-muted-foreground mb-0.5">규격: {product.specs}</p>
                      )}
                      {'g2b' in product && product.g2b && (
                        <p className="text-xs text-muted-foreground">G2B: {product.g2b}</p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-primary font-bold">{product.price}</span>
                        <button className="text-sm font-semibold text-primary hover:text-blue-700 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                          문의하기
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">검색 결과가 없습니다</h3>
              <p className="text-muted-foreground">다른 검색어를 입력하거나 카테고리를 변경해보세요.</p>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}

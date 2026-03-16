import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-white/80 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-display font-bold text-xl text-white">
                성림교구
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              최고의 품질과 서비스로 교육 환경의 미래를 만들어갑니다. 성림교구는 언제나 고객의 만족을 최우선으로 생각합니다.
            </p>
          </div>

          {/* Links Col */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-6">빠른 메뉴</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">홈</Link></li>
              <li><Link href="/company" className="hover:text-white transition-colors">회사소개</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">제품소개</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">고객센터</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white font-semibold mb-6">오시는 길 & 연락처</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="font-semibold text-white min-w-[60px]">본사/매장</span>
                <span className="text-white/70">서울특별시 은평구 역촌동 34</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold text-white min-w-[60px]">창고</span>
                <span className="text-white/70">경기도 고양시 덕양구 행신동 46-3</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold text-white min-w-[60px]">연락처</span>
                <span className="text-white/70">
                  TEL: 02-766-1496<br />
                  FAX: 02-383-5183
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>상호: (주)성림교구 | 사업자등록번호: 준비중</p>
          <p>&copy; {new Date().getFullYear()} Sunglim Edu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

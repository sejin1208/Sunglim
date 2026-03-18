import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Building2, CalendarDays, Package, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryCase {
  id: number;
  schoolName: string;
  deliveryDate: string;
  modelNames: string;
  imageUrl: string | null;
  note: string | null;
}

const API = `${import.meta.env.BASE_URL}api/delivery-cases`;

async function fetchCases(): Promise<DeliveryCase[]> {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function DeliveryAdmin() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ schoolName: "", deliveryDate: "", modelNames: "", note: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: cases = [], isLoading } = useQuery({ queryKey: ["delivery-cases"], queryFn: fetchCases });

  const addMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("schoolName", form.schoolName);
      fd.append("deliveryDate", form.deliveryDate);
      fd.append("modelNames", form.modelNames);
      fd.append("note", form.note);
      if (imageFile) fd.append("image", imageFile);
      const res = await fetch(API, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-cases"] });
      setForm({ schoolName: "", deliveryDate: "", modelNames: "", note: "" });
      setImageFile(null);
      setPreview(null);
      toast({ title: "납품사례가 등록되었습니다." });
    },
    onError: () => toast({ variant: "destructive", title: "오류", description: "등록에 실패했습니다." }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-cases"] });
      toast({ title: "삭제되었습니다." });
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.schoolName || !form.deliveryDate || !form.modelNames) {
      toast({ variant: "destructive", title: "필수 항목을 입력해주세요." });
      return;
    }
    addMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">납품사례 관리</h1>

        {/* Add Form */}
        <div className="bg-card rounded-3xl border border-border shadow-sm p-8 mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> 새 납품사례 등록</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold block mb-1">학교명 <span className="text-destructive">*</span></label>
                <input value={form.schoolName} onChange={e => setForm(f => ({ ...f, schoolName: e.target.value }))}
                  placeholder="ㅇㅇ초등학교"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">납품일자 <span className="text-destructive">*</span></label>
                <input type="date" value={form.deliveryDate} onChange={e => setForm(f => ({ ...f, deliveryDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">모델명 <span className="text-destructive">*</span></label>
              <input value={form.modelNames} onChange={e => setForm(f => ({ ...f, modelNames: e.target.value }))}
                placeholder="SLD-0714C-B, SLC-0657-L"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">비고</label>
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="추가 설명 (선택)"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold block mb-2">납품 사진</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
              >
                {preview ? (
                  <img src={preview} className="h-full w-full object-contain p-2 rounded-xl" />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">클릭하여 사진 선택</span>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            <button type="submit" disabled={addMutation.isPending}
              className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 transition-all">
              {addMutation.isPending ? "등록 중..." : "납품사례 등록"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">등록된 납품사례 ({cases.length}건)</h2>
          {isLoading ? (
            <p className="text-muted-foreground">불러오는 중...</p>
          ) : cases.length === 0 ? (
            <p className="text-muted-foreground">등록된 납품사례가 없습니다.</p>
          ) : (
            cases.map((c) => (
              <div key={c.id} className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
                {c.imageUrl ? (
                  <img src={`${import.meta.env.BASE_URL}${c.imageUrl.replace(/^\//, "")}`} className="w-20 h-20 object-cover rounded-xl shrink-0 bg-muted" />
                ) : (
                  <div className="w-20 h-20 bg-muted rounded-xl shrink-0 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">{c.schoolName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><CalendarDays className="w-3.5 h-3.5" />{c.deliveryDate}</p>
                  <div className="flex items-start gap-1 mt-0.5">
                    <Package className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="flex flex-col text-sm text-muted-foreground">
                      {c.modelNames.split(",").map((m, i) => {
                        const model = m.trim();
                        const label = model.startsWith("SLD-") ? "학생용책상" : model.startsWith("SLC-") ? "교실용걸상" : null;
                        return <span key={i}>{label ? `${label} ${model}` : model}</span>;
                      })}
                    </span>
                  </div>
                  {c.note && <p className="text-xs text-muted-foreground mt-1">{c.note}</p>}
                </div>
                <button
                  onClick={() => { if (confirm("삭제하시겠습니까?")) deleteMutation.mutate(c.id); }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

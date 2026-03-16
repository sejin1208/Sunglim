import { Layout } from "@/components/layout/Layout";
import { useListContacts } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Mail, Phone, Building, User, Calendar } from "lucide-react";

export default function ContactList() {
  const { data: contacts, isLoading, error } = useListContacts();

  return (
    <Layout>
      <div className="bg-secondary/30 pt-20 pb-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">관리자: 문의 내역</h1>
          <p className="text-muted-foreground">온라인으로 접수된 고객 문의 목록입니다.</p>
        </div>
      </div>

      <section className="py-12 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-6 rounded-xl border border-destructive/20 text-center">
              데이터를 불러오는 중 오류가 발생했습니다. (API가 연결되어 있는지 확인해주세요)
            </div>
          )}

          {contacts && contacts.length === 0 && (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">접수된 문의가 없습니다</h3>
            </div>
          )}

          {contacts && contacts.length > 0 && (
            <div className="space-y-6">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-card rounded-2xl border border-border shadow-sm p-6 lg:p-8 transition-shadow hover:shadow-md">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    
                    <div className="flex-grow space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-1">{contact.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(contact.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/50 p-4 rounded-xl text-foreground whitespace-pre-wrap leading-relaxed">
                        {contact.message}
                      </div>
                    </div>

                    <div className="lg:w-72 flex-shrink-0 bg-background p-5 rounded-xl border border-border space-y-3 h-fit">
                      <h4 className="font-bold text-sm text-foreground/70 uppercase tracking-wider border-b border-border pb-2 mb-3">연락처 정보</h4>
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{contact.name}</span>
                      </div>
                      {contact.company && (
                        <div className="flex items-center gap-3 text-sm">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{contact.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{contact.phone}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{contact.email}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

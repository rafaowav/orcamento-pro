"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Briefcase,
  User,
  FileText,
  PlusCircle,
  Percent,
  FileDown,
  Sparkles,
  ArrowRight,
  Trash2,
  Crown,
  Upload,
  Check,
} from "lucide-react";
import InvoicePDF from "@/components/InvoicePDF";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import PdfPreview from "@/components/PdfPreview";

interface Servico {
  description: string;
  quantity: number;
  unitPrice: number;
}

function emptyServico(): Servico {
  return { description: "", quantity: 1, unitPrice: 0 };
}

const defaultEmpresa = {
  name: "",
  phone: "",
  address: "",
  whatsapp: "",
  email: "",
  cnpj: "",
};

const defaultCliente = {
  name: "",
  address: "",
  cep: "",
  email: "",
  cpfCnpj: "",
  cidade: "",
  telefone: "",
  rgInscricao: "",
  bairro: "",
  estado: "",
  celular: "",
};

const defaultServicos: Servico[] = [emptyServico()];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function maskCPFCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 9) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function maskRG(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`w-full h-12 px-4 rounded-xl border border-[#d1d5db] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0058be]/30 focus:border-[#0058be] transition-all duration-200 text-[#111827] placeholder:text-[#9ca3af] ${className}`}
      {...props}
    />
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`text-[11px] font-bold uppercase tracking-wider text-[#4b5563] ml-1 ${className}`}>
      {children}
    </label>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#e5e7eb] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div className="w-8 h-8 rounded-lg bg-[#0058be]/10 flex items-center justify-center">
        <Icon size={16} className="text-[#0058be]" />
      </div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#374151]">
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  const [empresa, setEmpresa] = useState(defaultEmpresa);
  const [cliente, setCliente] = useState(defaultCliente);
  const [servicos, setServicos] = useState<Servico[]>(defaultServicos);
  const [descontoPercent, setDescontoPercent] = useState(0);
  const [observacoes, setObservacoes] = useState("");
  const [numeroPedido, setNumeroPedido] = useState("");
  const [dataPedido, setDataPedido] = useState(
    new Date().toLocaleDateString("pt-BR")
  );
  const [isPremium, setIsPremium] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [premiumEmail, setPremiumEmail] = useState("");
  const [restoreInput, setRestoreInput] = useState("");
  const [restoreMode, setRestoreMode] = useState<"session" | "email">("email");
  const [lastSessionId, setLastSessionId] = useState("");
  const [copied, setCopied] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifySession = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`/api/verify-session?session_id=${sid}`);
      const data = await res.json();
      if (data.premium) {
        setIsPremium(true);
        localStorage.setItem("orcafacil_sid", sid);
        if (data.email) {
          setPremiumEmail(data.email);
          localStorage.setItem("orcafacil_email", data.email);
        }
        return true;
      }
    } catch {}
    return false;
  }, []);

  const verifyEmail = useCallback(async (eml: string) => {
    try {
      const res = await fetch(`/api/verify-session?email=${encodeURIComponent(eml)}`);
      const data = await res.json();
      if (data.premium) {
        setIsPremium(true);
        setPremiumEmail(eml);
        localStorage.setItem("orcafacil_email", eml);
        if (data.session_id) {
          setSessionId(data.session_id);
          localStorage.setItem("orcafacil_sid", data.session_id);
        }
        return true;
      }
    } catch {}
    return false;
  }, []);

  useEffect(() => {
    const storedSid = localStorage.getItem("orcafacil_sid");
    const storedEmail = localStorage.getItem("orcafacil_email");

    if (storedSid) {
      setSessionId(storedSid);
      verifySession(storedSid);
    } else if (storedEmail) {
      setPremiumEmail(storedEmail);
      verifyEmail(storedEmail);
    }

    const storedLogo = localStorage.getItem("orcafacil_logo");
    if (storedLogo) {
      setLogoUrl(storedLogo);
    }
  }, [verifySession, verifyEmail]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "success" && params.get("session_id")) {
      const sid = params.get("session_id")!;
      setLastSessionId(sid);
      verifySession(sid).then((ok) => {
        if (ok) setSessionId(sid);
      });
      window.history.replaceState({}, "", "/");
    }
  }, [verifySession]);

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem("orcafacil_logo", logoUrl);
    }
  }, [logoUrl]);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handlePremiumCheckout() {
    setLoadingPremium(true);
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: checkoutEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || "Erro ao iniciar pagamento");
          setLoadingPremium(false);
        }
      })
      .catch(() => {
        alert("Erro ao conectar com Stripe");
        setLoadingPremium(false);
      });
  }

  function updateEmpresa(field: string, value: string) {
    setEmpresa((prev) => ({ ...prev, [field]: value }));
  }

  function updateCliente(field: string, value: string) {
    setCliente((prev) => ({ ...prev, [field]: value }));
  }

  function updateServico(index: number, field: keyof Servico, value: string) {
    setServicos((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "description" ? value : Number(value) || 0,
      };
      return next;
    });
  }

  function addServico() {
    setServicos((prev) => [...prev, emptyServico()]);
  }

  function removeServico(index: number) {
    setServicos((prev) => prev.filter((_, i) => i !== index));
  }

  const pdfProps = {
    empresa,
    cliente,
    servicos,
    isPremium,
    logoUrl,
    descontoPercent,
    observacoes,
    numeroPedido,
    dataPedido,
  };

  const subtotal = servicos.reduce(
    (acc, s) => acc + s.quantity * s.unitPrice,
    0,
  );

  const descontoValue = subtotal * (descontoPercent / 100);
  const totalFinal = subtotal - descontoValue;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#f0f4f9]">
      {/* Left Column — Form */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">

          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0058be] via-[#1a6dce] to-[#2563eb] p-8 md:p-10 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-white/80">
                  Orçafácil
                </span>
              </div>
              <h1 className="text-[34px] md:text-[42px] font-extrabold leading-[1.1] tracking-tight mt-1">
                Gerador de Orçamentos
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-xl leading-relaxed">
                Crie orçamentos profissionais em PDF em segundos. Rápido, fácil e gratuito.
              </p>
            </div>
          </div>

          {/* Dados do Profissional/Empresa */}
          <SectionCard>
            <SectionHeader icon={Briefcase} title="Dados do Profissional/Empresa" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Nome ou Razão Social</Label>
                <Input placeholder="Nome da empresa" value={empresa.name} onChange={(e) => updateEmpresa("name", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Documento (CPF/CNPJ)</Label>
                <Input placeholder="00.000.000/0000-00" value={empresa.cnpj} onChange={(e) => updateEmpresa("cnpj", maskCPFCNPJ(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Endereço</Label>
                <Input placeholder="Endereço completo" value={empresa.address} onChange={(e) => updateEmpresa("address", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Telefone</Label>
                <Input placeholder="(11) 3333-4444" value={empresa.phone} onChange={(e) => updateEmpresa("phone", maskPhone(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>WhatsApp</Label>
                <Input placeholder="(11) 99999-8888" value={empresa.whatsapp} onChange={(e) => updateEmpresa("whatsapp", maskPhone(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>E-mail</Label>
                <Input placeholder="vendas@exemplo.com.br" value={empresa.email} onChange={(e) => updateEmpresa("email", e.target.value)} />
              </div>
            </div>
          </SectionCard>

          {/* Dados do Cliente */}
          <SectionCard>
            <SectionHeader icon={User} title="Dados do Cliente" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Nome do Cliente</Label>
                <Input placeholder="Ex: Maria Oliveira" value={cliente.name} onChange={(e) => updateCliente("name", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>E-mail</Label>
                <Input placeholder="cliente@email.com" value={cliente.email} onChange={(e) => updateCliente("email", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Endereço</Label>
                <Input placeholder="Rua das Flores, 200" value={cliente.address} onChange={(e) => updateCliente("address", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Bairro</Label>
                <Input placeholder="Centro" value={cliente.bairro} onChange={(e) => updateCliente("bairro", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Cidade</Label>
                <Input placeholder="São Paulo" value={cliente.cidade} onChange={(e) => updateCliente("cidade", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Estado</Label>
                <Input placeholder="SP" value={cliente.estado} onChange={(e) => updateCliente("estado", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>CEP</Label>
                <Input placeholder="01234-567" value={cliente.cep} onChange={(e) => updateCliente("cep", maskCEP(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Telefone</Label>
                <Input placeholder="(11) 4444-5555" value={cliente.telefone} onChange={(e) => updateCliente("telefone", maskPhone(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Celular</Label>
                <Input placeholder="(11) 98888-7777" value={cliente.celular} onChange={(e) => updateCliente("celular", maskPhone(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>CPF / CNPJ</Label>
                <Input placeholder="123.456.789-00" value={cliente.cpfCnpj} onChange={(e) => updateCliente("cpfCnpj", maskCPFCNPJ(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>RG / Insc. Estadual</Label>
                <Input placeholder="12.345.678-9" value={cliente.rgInscricao} onChange={(e) => updateCliente("rgInscricao", maskRG(e.target.value))} />
              </div>
            </div>
          </SectionCard>

          {/* Itens do Orçamento */}
          <SectionCard>
            <div className="flex items-center justify-between mb-6">
              <SectionHeader icon={FileText} title="Itens do Orçamento" />
              <button
                onClick={addServico}
                className="h-9 px-4 rounded-xl bg-[#0058be]/10 text-[#0058be] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#0058be]/20 transition-all duration-200 active:scale-95"
              >
                <PlusCircle size={14} /> Adicionar
              </button>
            </div>

            <div className="overflow-x-auto -mx-6 md:-mx-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="py-4 pl-6 md:pl-8 pr-2 text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Serviço / Produto</th>
                    <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider text-[#6b7280] text-center w-20">Qtd</th>
                    <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider text-[#6b7280] w-36">Valor Unit.</th>
                    <th className="py-4 pr-6 md:pr-8 pl-2 text-[11px] font-bold uppercase tracking-wider text-[#6b7280] text-right">Total</th>
                    <th className="py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((s, i) => (
                    <tr key={i} className={`border-b border-[#e5e7eb] transition-colors ${i % 2 === 1 ? "bg-[#f9fafb]" : ""} hover:bg-[#f3f6fc]`}>
                      <td className="py-3 pl-6 md:pl-8 pr-2">
                        <input
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-[#111827] placeholder:text-[#9ca3af]"
                          placeholder="Descrição do item"
                          value={s.description}
                          onChange={(e) => updateServico(i, "description", e.target.value)}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          min={1}
                          className="w-14 h-9 text-center rounded-lg border border-[#d1d5db] bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0058be]/30 focus:border-[#0058be] transition-all"
                          value={s.quantity}
                          onChange={(e) => updateServico(i, "quantity", e.target.value)}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-[#6b7280]">R$</span>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            className="w-full h-9 px-3 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0058be]/30 focus:border-[#0058be] transition-all"
                            value={s.unitPrice}
                            onChange={(e) => updateServico(i, "unitPrice", e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-6 md:pr-8 pl-2 text-right text-sm font-semibold text-[#111827]">
                        {formatCurrency(s.quantity * s.unitPrice)}
                      </td>
                      <td className="py-3 text-center">
                        {servicos.length > 1 && (
                          <button
                            onClick={() => removeServico(i)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                            title="Remover item"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Número e Data do Pedido */}
          <SectionCard>
            <SectionHeader icon={FileText} title="Dados do Pedido" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Número do Pedido</Label>
                <Input placeholder="Ex: 001/2026" value={numeroPedido} onChange={(e) => setNumeroPedido(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Data do Pedido</Label>
                <Input type="date" value={dataPedido.split("/").reverse().join("-")} onChange={(e) => {
                  const d = e.target.value;
                  if (d) {
                    const [year, month, day] = d.split("-");
                    setDataPedido(`${day}/${month}/${year}`);
                  }
                }} />
              </div>
            </div>
          </SectionCard>

          {/* Observações */}
          <SectionCard>
            <SectionHeader icon={FileText} title="Observações" />
            <textarea
              className="w-full h-28 px-4 py-3.5 rounded-xl border border-[#d1d5db] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#0058be]/30 focus:border-[#0058be] transition-all duration-200 text-[#111827] placeholder:text-[#9ca3af] resize-vertical"
              placeholder="Condições de pagamento, prazo de entrega, garantia, etc."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </SectionCard>

          {/* Premium */}
          <SectionCard>
            <SectionHeader icon={Crown} title={isPremium ? "Premium Ativo" : "Seja Premium"} />
            {isPremium ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 rounded-xl px-5 py-4 border border-[#f59e0b]/20">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-sm">
                    <Crown size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">Conta Premium</p>
                    <p className="text-xs text-[#6b7280]">Sem marca d'água nos PDFs</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-[#059669] text-xs font-bold">
                    <Check size={14} /> Ativo
                  </div>
                </div>
                {lastSessionId && (
                  <div className="bg-[#f0fdf4] rounded-xl px-4 py-3 border border-[#bbf7d0]">
                    <p className="text-[11px] font-bold text-[#15803d] mb-1">Pagamento confirmado!</p>
                    <p className="text-[10px] text-[#166534]">
                      Seu acesso vitalício está ativo. Você pode refazer o download do PDF sem marca d'água quantas vezes quiser.
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label>Logo da Empresa</Label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <div className="w-16 h-16 rounded-xl border border-[#d1d5db] overflow-hidden flex items-center justify-center bg-white">
                        <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl border border-dashed border-[#d1d5db] flex items-center justify-center bg-[#f9fafb]">
                        <Upload size={18} className="text-[#9ca3af]" />
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="h-10 px-5 rounded-xl bg-[#0058be]/10 text-[#0058be] text-xs font-bold uppercase tracking-wider hover:bg-[#0058be]/20 transition-all active:scale-95"
                    >
                      {logoUrl ? "Trocar Logo" : "Upload Logo"}
                    </button>
                    {logoUrl && (
                      <button
                        onClick={() => { setLogoUrl(""); localStorage.removeItem("orcafacil_logo"); }}
                        className="h-10 px-4 rounded-xl text-[#ef4444] text-xs font-bold hover:bg-red-50 transition-all active:scale-95"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Remova a marca d'água dos PDFs e adicione o logo da sua empresa por apenas <strong className="text-[#111827]">R$ 9,90</strong> (pagamento único vitalício).
                </p>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        className={checkoutEmail && !isValidEmail(checkoutEmail) ? "border-red-400 focus:ring-red-300 focus:border-red-400" : ""}
                      />
                      {checkoutEmail && !isValidEmail(checkoutEmail) && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1">Email inválido</p>
                      )}
                    </div>
                    <button
                      onClick={handlePremiumCheckout}
                      disabled={!isValidEmail(checkoutEmail) || loadingPremium}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 shrink-0 flex items-center gap-2"
                    >
                      {loadingPremium ? (
                        <span>Carregando...</span>
                      ) : (
                        <><Crown size={16} /> Assinar</>
                      )}
                    </button>
                  </div>
                </div>
                <details className="group">
                  <summary className="text-[11px] text-[#9ca3af] cursor-pointer hover:text-[#6b7280] transition-colors select-none">
                    Já pagou? Restaurar acesso
                  </summary>
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex gap-1.5 text-[10px] text-[#9ca3af]">
                        <button
                          onClick={() => setRestoreMode("email")}
                          className={`px-2 py-0.5 rounded ${restoreMode === "email" ? "bg-[#0058be]/10 text-[#0058be] font-bold" : "hover:text-[#6b7280]"}`}
                        >
                          Email
                        </button>
                        <button
                          onClick={() => setRestoreMode("session")}
                          className={`px-2 py-0.5 rounded ${restoreMode === "session" ? "bg-[#0058be]/10 text-[#0058be] font-bold" : "hover:text-[#6b7280]"}`}
                        >
                          Código
                        </button>
                      </div>
                      {restoreMode === "email" ? (
                        <Input
                          placeholder="seu@email.com"
                          value={restoreInput}
                          onChange={(e) => setRestoreInput(e.target.value)}
                        />
                      ) : (
                        <Input
                          placeholder="session_id"
                          value={restoreInput}
                          onChange={(e) => setRestoreInput(e.target.value)}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (restoreMode === "email") {
                          verifyEmail(restoreInput);
                        } else {
                          verifySession(restoreInput);
                        }
                      }}
                      disabled={!restoreInput}
                      className="h-12 px-5 rounded-xl bg-[#0058be] text-white text-xs font-bold hover:bg-[#004a9e] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0 self-end"
                    >
                      Restaurar
                    </button>
                  </div>
                </details>
              </div>
            )}
          </SectionCard>

          {/* Discount + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                    <Percent size={14} className="text-[#f59e0b]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#374151]">Desconto</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    className="flex-1 h-11 px-4 rounded-xl border border-[#d1d5db] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#f59e0b] transition-all text-[#111827]"
                    placeholder="0"
                    value={descontoPercent || ""}
                    onChange={(e) => setDescontoPercent(Number(e.target.value) || 0)}
                  />
                  <span className="text-sm font-bold text-[#6b7280]">%</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-[#111827] to-[#1f2937] text-white p-6 md:p-7 rounded-2xl shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Subtotal</span>
                <span className="text-base font-semibold text-white/90">{formatCurrency(subtotal)}</span>
              </div>
              {descontoPercent > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Desconto ({descontoPercent}%)</span>
                  <span className="text-base font-semibold text-[#fbbf24]">-{formatCurrency(descontoValue)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-white/20 pt-4">
                <span className="text-sm font-bold uppercase tracking-wider text-white/90">Valor Total</span>
                <span className="text-2xl font-extrabold text-white">{formatCurrency(totalFinal)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center md:justify-end pt-2 pb-8">
            <PdfDownloadButton
              document={<InvoicePDF {...pdfProps} />}
              fileName="orcamento.pdf"
              className="group relative w-full md:w-auto min-w-[240px] bg-gradient-to-r from-[#0058be] to-[#2563eb] text-white text-base font-bold py-4 px-9 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <FileDown size={22} className="relative z-10" />
              <span className="relative z-10">Gerar PDF e Baixar</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            </PdfDownloadButton>
          </div>

          <div className="text-center pb-4">
            <p className="text-xs text-[#9ca3af]">
              Seus dados não são salvos em servidores. Tudo é processado localmente no seu navegador.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column — PDF Preview */}
      <div className="flex-1 lg:sticky lg:top-0 lg:h-screen bg-[#e5e9ef] p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#0058be]/10 flex items-center justify-center">
            <FileText size={14} className="text-[#0058be]" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#374151]">Pré-visualização</h2>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#d1d5db]">
          <PdfPreview
            style={{ width: "100%", height: "calc(100vh - 10rem)", border: "none", borderRadius: "16px" }}
          >
            <InvoicePDF {...pdfProps} />
          </PdfPreview>
        </div>
      </div>
    </div>
  );
}
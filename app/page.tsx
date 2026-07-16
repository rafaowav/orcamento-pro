"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
} from "lucide-react";
import InvoicePDF from "@/components/InvoicePDF";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

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
    isPremium: false,
    descontoPercent,
    observacoes,
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
                  OrçamentoPRO
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
                <Input placeholder="00.000.000/0000-00" value={empresa.cnpj} onChange={(e) => updateEmpresa("cnpj", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Endereço</Label>
                <Input placeholder="Endereço completo" value={empresa.address} onChange={(e) => updateEmpresa("address", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Telefone</Label>
                <Input placeholder="(11) 3333-4444" value={empresa.phone} onChange={(e) => updateEmpresa("phone", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>WhatsApp</Label>
                <Input placeholder="(11) 99999-8888" value={empresa.whatsapp} onChange={(e) => updateEmpresa("whatsapp", e.target.value)} />
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
                <Input placeholder="01234-567" value={cliente.cep} onChange={(e) => updateCliente("cep", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Telefone</Label>
                <Input placeholder="(11) 4444-5555" value={cliente.telefone} onChange={(e) => updateCliente("telefone", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Celular</Label>
                <Input placeholder="(11) 98888-7777" value={cliente.celular} onChange={(e) => updateCliente("celular", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>CPF / CNPJ</Label>
                <Input placeholder="123.456.789-00" value={cliente.cpfCnpj} onChange={(e) => updateCliente("cpfCnpj", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>RG / Insc. Estadual</Label>
                <Input placeholder="12.345.678-9" value={cliente.rgInscricao} onChange={(e) => updateCliente("rgInscricao", e.target.value)} />
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
            <PDFDownloadLink
              document={<InvoicePDF {...pdfProps} />}
              fileName="orcamento.pdf"
              className="group relative w-full md:w-auto min-w-[240px] bg-gradient-to-r from-[#0058be] to-[#2563eb] text-white text-base font-bold py-4 px-9 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <FileDown size={22} className="relative z-10" />
              <span className="relative z-10">Gerar PDF e Baixar</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            </PDFDownloadLink>
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
          <PDFViewer
            style={{ width: "100%", height: "calc(100vh - 10rem)", border: "none", borderRadius: "16px" }}
          >
            <InvoicePDF {...pdfProps} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
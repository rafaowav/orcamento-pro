import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

interface Servico {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface EmpresaData {
  name: string;
  phone: string;
  address?: string;
  whatsapp?: string;
  email?: string;
  cnpj?: string;
}

interface ClienteData {
  name: string;
  address?: string;
  cep?: string;
  email?: string;
  cpfCnpj?: string;
  cidade?: string;
  telefone?: string;
  rgInscricao?: string;
  bairro?: string;
  estado?: string;
  celular?: string;
}

interface InvoicePDFProps {
  empresa: EmpresaData;
  cliente: ClienteData;
  servicos: Servico[];
  isPremium?: boolean;
  logoUrl?: string;
  descontoPercent?: number;
  observacoes?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#000",
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 6,
    marginBottom: 6,
  },
  headerLeft: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBox: {
    width: 78,
    height: 55,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoImage: {
    width: 53,
    height: 53,
    objectFit: "contain",
  },
  logoText: {
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoCaption: {
    fontSize: 5,
    marginTop: 1,
    textAlign: "center",
    color: "#000",
  },
  watermarkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  watermarkStamp: {
    transform: "rotate(-25deg)",
    borderWidth: 1,
    borderColor: "#c00",
    borderRadius: 1,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  watermarkText: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#c00",
    letterSpacing: 0.3,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  companyName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 2,
  },
  companyInfoLine: {
    fontSize: 6.5,
    marginBottom: 1,
  },
  headerRight: {
    width: 110,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  docMetaLine: {
    fontSize: 6.5,
    marginBottom: 1,
    textAlign: "right",
  },
  title: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 8,
    marginTop: 2,
  },
  clienteSection: {
    marginBottom: 8,
  },
  clienteRow: {
    flexDirection: "row",
  },
  clienteColumn: {
    flex: 1,
  },
  clienteLine: {
    fontSize: 6.5,
    marginBottom: 1,
  },
  itemsLabel: {
    textAlign: "center",
    fontSize: 7.5,
    fontWeight: "bold",
    marginBottom: 3,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeaderCell: {
    fontSize: 6.5,
    fontWeight: "bold",
    paddingVertical: 3,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  tableHeaderBorderRight: {
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    fontSize: 6.5,
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  tableCellBorderRight: {
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  colQtdDesc: {
    flex: 3,
  },
  colUnit: {
    flex: 1.2,
    textAlign: "right",
  },
  colTotal: {
    flex: 1.2,
    textAlign: "right",
  },
  totalsWrapper: {
    alignItems: "flex-end",
    marginTop: 6,
  },
  totalsBox: {
    borderWidth: 1,
    borderColor: "#000",
    width: 190,
  },
  totalsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  totalsRowLast: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  totalsLabel: {
    flex: 1,
    fontSize: 7,
    fontWeight: "bold",
  },
  totalsValue: {
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "right",
  },
  totalsFinalLabel: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
  },
  totalsFinalValue: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "right",
  },
  observacoesBox: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 8,
    minHeight: 70,
    padding: 5,
  },
  observacoesTitle: {
    fontSize: 7,
    fontWeight: "bold",
    marginBottom: 2,
  },
  observacoesContent: {
    fontSize: 7,
    lineHeight: 1.4,
  },
});

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function InvoicePDF({
  empresa,
  cliente,
  servicos,
  isPremium = false,
  logoUrl,
  descontoPercent = 0,
  observacoes = "",
}: InvoicePDFProps) {
  const subtotal = servicos.reduce(
    (acc, s) => acc + s.quantity * s.unitPrice,
    0,
  );
  const desconto = subtotal * (descontoPercent / 100);
  const totalFinal = subtotal - desconto;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              {isPremium && logoUrl ? (
                <Image style={styles.logoImage} src={logoUrl} />
              ) : isPremium ? (
                <Text style={styles.logoText}>LOGO</Text>
              ) : (
                <Text style={styles.logoText}>LOGO</Text>
              )}
              {!isPremium && (
                <View style={styles.watermarkOverlay}>
                  <View style={styles.watermarkStamp}>
                    <Text style={styles.watermarkText}>Versão gratuita — OrçamentoPro</Text>
                  </View>
                </View>
              )}
            </View>
            <Text style={styles.logoCaption}>Marca da Empresa</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>{empresa.name}</Text>
            <Text style={styles.companyInfoLine}>
              End.: {empresa.address || "Rua Exemplo, 123"}
            </Text>
            <Text style={styles.companyInfoLine}>
              Tel.: {empresa.phone} | WhatsApp: {empresa.whatsapp || empresa.phone}
            </Text>
            <Text style={styles.companyInfoLine}>
              E-mail: {empresa.email || "contato@exemplo.com.br"}
            </Text>
            <Text style={styles.companyInfoLine}>
              CNPJ: {empresa.cnpj || "00.000.000/0001-00"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docMetaLine}>Página 1 de 1</Text>
            <Text style={styles.docMetaLine}>Número: 25</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Orçamento</Text>

        {/* Cliente */}
        <View style={styles.clienteSection}>
          <View style={styles.clienteRow}>
            <View style={styles.clienteColumn}>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>Cliente: </Text>
                {cliente.name}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>Endereço: </Text>
                {cliente.address || "Rua do Cliente, 456"}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>CEP: </Text>
                {cliente.cep || "00000-000"}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>E-mail: </Text>
                {cliente.email || "cliente@email.com"}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>CPF/CNPJ: </Text>
                {cliente.cpfCnpj || "000.000.000-00"}
              </Text>
            </View>
            <View style={styles.clienteColumn}>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>Cidade: </Text>
                {cliente.cidade || "Cidade Exemplo"}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>Telefone: </Text>
                {cliente.telefone || "(00) 0000-0000"}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>RG / Insc. Estadual: </Text>
                {cliente.rgInscricao || "00.000.000-0"}
              </Text>
            </View>
            <View style={styles.clienteColumn}>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>Bairro: </Text>
                {cliente.bairro || "Centro"}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>Estado: </Text>
                {cliente.estado || "SP"}
              </Text>
              <Text style={styles.clienteLine}>
                <Text style={{ fontWeight: "bold" }}>Celular: </Text>
                {cliente.celular || "(00) 99999-0000"}
              </Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <Text style={styles.itemsLabel}>ITENS</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colQtdDesc, styles.tableHeaderBorderRight]}>
              Quantidade X Descrição
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit, styles.tableHeaderBorderRight]}>
              Valor Unitário
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>
              Valor Total
            </Text>
          </View>
          {servicos.map((servico, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, styles.colQtdDesc, styles.tableCellBorderRight]}>
                {servico.quantity} x {servico.description}
              </Text>
              <Text style={[styles.tableCell, styles.colUnit, styles.tableCellBorderRight]}>
                {formatCurrency(servico.unitPrice)}
              </Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {formatCurrency(servico.quantity * servico.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatCurrency(subtotal)}</Text>
            </View>
            {descontoPercent > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Desconto ({descontoPercent}%)</Text>
                <Text style={styles.totalsValue}>{formatCurrency(desconto)}</Text>
              </View>
            )}
            <View style={styles.totalsRowLast}>
              <Text style={styles.totalsFinalLabel}>Total Final</Text>
              <Text style={styles.totalsFinalValue}>
                {formatCurrency(totalFinal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Observações */}
        <View style={styles.observacoesBox}>
          <Text style={styles.observacoesTitle}>Observações:</Text>
          <Text style={styles.observacoesContent}>{observacoes}</Text>
        </View>
      </Page>
    </Document>
  );
}
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - Orçafácil",
  description:
    "Saiba como o Orçafácil coleta, usa e protege suas informações. Compromisso com a transparência e segurança dos seus dados.",
  openGraph: {
    title: "Política de Privacidade - Orçafácil",
    description:
      "Saiba como o Orçafácil coleta, usa e protege suas informações.",
  },
};

export default function PoliticaDePrivacidade() {
  return (
    <main className="min-h-screen bg-[#f0f4f9]">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Política de Privacidade
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: Julho de 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed text-gray-700">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                1. Introdução
              </h2>
              <p>
                O Orçafácil respeita sua privacidade. Esta Política de
                Privacidade descreve como lidamos com as informações quando você
                utiliza nossa ferramenta de geração de orçamentos em PDF.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                2. Dados Processados Localmente
              </h2>
              <p>
                Todos os dados inseridos no Orçafácil (informações da empresa,
                cliente, serviços, valores) são processados <strong>
                  exclusivamente
                </strong>{" "}
                no seu navegador. Nenhum dado inserido nos formulários é
                enviado, armazenado ou processado em nossos servidores. Isso
                significa que:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Os dados desaparecem ao fechar a página ou limpar o cache do
                  navegador
                </li>
                <li>
                  Não temos acesso às informações dos seus clientes ou
                  orçamentos
                </li>
                <li>Não vendemos, compartilhamos ou processamos seus dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                3. Cookies e Armazenamento Local
              </h2>
              <p>
                Utilizamos o armazenamento local do navegador (localStorage)
                apenas para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Salvar sua preferência de consentimento de cookies
                </li>
                <li>
                  Armazenar o identificador da sua sessão premium (se aplicável)
                </li>
                <li>
                  Salvar o logo da sua empresa (apenas para usuários premium)
                </li>
                <li>
                  Registrar sua aceitação dos Termos de Serviço e Política de
                  Privacidade
                </li>
              </ul>
              <p className="mt-2">
                Nenhum cookie de rastreamento, publicidade ou análise de
                terceiros é utilizado.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                4. Pagamentos (Stripe)
              </h2>
              <p>
                O processamento de pagamentos do plano premium é realizado
                exclusivamente pela{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0058be] underline"
                >
                  Stripe, Inc.
                </a>{" "}
                O Orçafácil não coleta, armazena ou processa dados de cartão de
                crédito ou qualquer outra informação financeira. A Stripe segue
                padrão PCI DSS de segurança.
              </p>
              <p className="mt-2">
                Durante o checkout, informamos à Stripe apenas seu e-mail para
                referência da compra.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                5. Serviços de Terceiros
              </h2>
              <p>
                Os seguintes serviços de terceiros são utilizados pelo
                Orçafácil:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>Stripe</strong> — processamento de pagamentos (
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0058be] underline"
                  >
                    política de privacidade
                  </a>
                </li>
                <li>
                  <strong>Vercel</strong> — hospedagem do site (
                  <a
                    href="https://vercel.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0058be] underline"
                  >
                    política de privacidade
                  </a>
                  )
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                6. Seus Direitos
              </h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir qualquer
                informação pessoal que esteja armazenada em seu navegador. Como
                não armazenamos dados em servidores, você pode exercer esses
                direitos simplesmente limpando o cache e armazenamento local do
                seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                7. Alterações nesta Política
              </h2>
              <p>
                Reservamo-nos o direito de modificar esta política a qualquer
                momento. As alterações serão publicadas nesta página com a data
                de atualização revisada.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                8. Contato
              </h2>
              <p>
                Em caso de dúvidas sobre esta Política de Privacidade, entre em
                contato pelo e-mail disponível na página inicial.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

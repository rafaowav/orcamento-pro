import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Serviço - Orçafácil",
  description:
    "Leia os Termos de Serviço do Orçafácil, o gerador de orçamentos PDF grátis.",
  openGraph: {
    title: "Termos de Serviço - Orçafácil",
    description:
      "Leia os Termos de Serviço do Orçafácil, o gerador de orçamentos PDF grátis.",
  },
};

export default function TermosDeUso() {
  return (
    <main className="min-h-screen bg-[#f0f4f9]">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Termos de Serviço
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: Julho de 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed text-gray-700">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao utilizar o Orçafácil, você declara que leu, compreendeu e
                concorda com todos os termos e condições descritos neste
                documento. Se você não concordar com algum destes termos, não
                utilize a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                2. Descrição do Serviço
              </h2>
              <p>
                O Orçafácil é uma ferramenta online que permite a criação de
                orçamentos em formato PDF. O processamento dos dados é realizado
                inteiramente no navegador do usuário, sem armazenamento em
                servidores.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                3. Plano Gratuito e Premium
              </h2>
              <p>
                O Orçafácil oferece um plano gratuito com funcionalidades
                básicas e um plano premium (pagamento único) que inclui:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Remoção da marca d&apos;água dos PDFs</li>
                <li>Upload do logo da empresa</li>
              </ul>
              <p className="mt-2">
                O pagamento do plano premium é processado exclusivamente pela
                Stripe, Inc. O Orçafácil não armazena dados de pagamento.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                4. Direitos de Uso
              </h2>
              <p>
                O usuário concede ao Orçafácil uma licença não-exclusiva,
                gratuita e mundial para usar, exibir e reproduzir o conteúdo
                gerado na plataforma para fins de operação do serviço. O usuário
                mantém todos os direitos sobre seus dados e informações
                inseridas na ferramenta.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                5. Privacidade e Dados
              </h2>
              <p>
                Todos os dados inseridos no Orçafácil são processados
                localmente no navegador do usuário e não são enviados ou
                armazenados em nossos servidores. Consulte nossa{" "}
                <a
                  href="/politica-de-privacidade"
                  className="text-[#0058be] underline"
                >
                  Política de Privacidade
                </a>{" "}
                para mais informações.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                6. Limitação de Responsabilidade
              </h2>
              <p>
                O Orçafácil é fornecido &quot;como está&quot;, sem garantias de
                qualquer tipo, expressas ou implícitas. Em nenhuma hipótese o
                Orçafácil será responsável por danos diretos, indiretos,
                incidentais ou consequenciais decorrentes do uso ou da
                incapacidade de usar o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                7. Alterações nos Termos
              </h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer
                momento. As alterações entram em vigor imediatamente após a
                publicação. O uso continuado do serviço após as alterações
                constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
                8. Contato
              </h2>
              <p>
                Em caso de dúvidas sobre estes termos, entre em contato pelo
                e-mail disponível na página inicial.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

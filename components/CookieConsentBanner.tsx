"use client";

import { useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "orcafacil_cookie_consent";

function isConsentNeeded(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem(CONSENT_KEY);
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(isConsentNeeded);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6 animate-fade-in">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 hidden sm:flex">
            <Cookie size={20} className="text-[#0058be]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 mb-1">
              Cookies e Privacidade
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Usamos cookies para melhorar sua experiência. Ao continuar, você
              aceita nossa{" "}
              <Link
                href="/politica-de-privacidade"
                className="text-[#0058be] underline hover:text-blue-700 font-medium"
              >
                Política de Privacidade
              </Link>{" "}
              e nossos{" "}
              <Link
                href="/termos-de-uso"
                className="text-[#0058be] underline hover:text-blue-700 font-medium"
              >
                Termos de Serviço
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              Recusar
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0058be] hover:bg-[#004a9e] rounded-xl transition-all shadow-sm"
            >
              Aceitar
            </button>
            <button
              onClick={decline}
              className="sm:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

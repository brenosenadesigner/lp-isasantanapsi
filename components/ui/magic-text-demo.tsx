import * as React from "react";
import { MagicText } from "@/components/ui/magic-text";

export const Demo = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[150vh] px-4 py-24 bg-[#7A2E2B] text-[#F9F6F1]">
      <div className="max-w-3xl p-8 rounded-lg bg-[#ECE5DC] text-[#2A211D] shadow-2xl">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C9935A] mb-3 block">
          Filosofia Clínica & Ressignificação
        </span>
        <MagicText
          text="Seus padrões atuais não são defeitos. Eles começaram como formas de proteção. Em algum momento da sua trajetória, calar o que sentia, agradar para ser aceito ou assumir o controle total foram estratégias indispensáveis para se proteger. Esses mecanismos cumpriram seu papel no passado, mas hoje geram aprisionamento, culpa e ansiedade."
          className="text-xl md:text-2xl font-serif text-[#7A2E2B] leading-relaxed"
        />
      </div>
      <p className="mt-8 text-sm uppercase tracking-wider text-[#DFB281] animate-bounce">
        Scroll Down 👇
      </p>
    </div>
  );
};

export { Demo };
export default Demo;

import Image from "next/image";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5531999352065"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-2xl shadow-orange-500/30 transition duration-300 hover:-translate-y-1 hover:bg-orange-400 md:bottom-8 md:right-8"
    >
      <Image src="/wpp.png" alt="WhatsApp" width={30} height={30} className="h-7 w-7" />
    </a>
  );
}

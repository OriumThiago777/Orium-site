import Image from "next/image";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5531999352065"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center transition duration-300 hover:-translate-y-1 hover:scale-105 md:bottom-8 md:right-8"
    >
      <Image
        src="/wpp.png"
        alt="WhatsApp"
        width={64}
        height={64}
        className="h-16 w-16 object-contain drop-shadow-2xl"
      />
    </a>
  );
}
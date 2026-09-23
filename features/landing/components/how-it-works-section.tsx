const STEPS = [
  {
    step: "01",
    title: "Pesan",
    description:
      "Ceritakan acaranya lewat WhatsApp — pilih buket, tema, dan kirim foto serta video yang ingin dimasukkan.",
  },
  {
    step: "02",
    title: "Rangkai",
    description:
      "Tim kami merangkai bunga dan greeting digital, lalu mengirim preview untuk persetujuan Anda.",
  },
  {
    step: "03",
    title: "Buket Selesai",
    description:
      "Buket tiba bersama kartu QR. Memindainya membuka experience yang sudah jadi — khusus untuk penerima.",
  },
  {
    step: "04",
    title: "Rayakan",
    description:
      "Penerima membuka greeting privat yang bisa dikunjungi kembali — surat, foto, video, dan photobooth.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">Proses</p>
          <h2>Cara kerjanya.</h2>
        </header>
        <div className="grid-4 process-steps">
          {STEPS.map((item) => (
            <article key={item.step}>
              <p className="step">{item.step}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

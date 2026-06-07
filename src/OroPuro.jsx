import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: "miel-wildflower",
    name: "Flor Silvestre",
    subtitle: "Miel Multifloral Premium",
    price: 24.99,
    oldPrice: 34.99,
    weight: "500g",
    color: "#C8841A",
    badge: "MÁS VENDIDO",
    badgeColor: "#C8841A",
    stock: 23,
    maxStock: 50,
    views: 143,
    description: "Cosechada de praderas vírgenes. Notas florales intensas con final aterciopelado.",
    benefits: ["Antioxidante natural", "Sin pasteurizar", "Origen trazable"],
  },
  {
    id: "miel-bosque",
    name: "Reserva del Bosque",
    subtitle: "Miel de Bosque Ancestral",
    price: 39.99,
    oldPrice: 54.99,
    weight: "350g",
    color: "#7A4E10",
    badge: "EDICIÓN LIMITADA",
    badgeColor: "#4A6741",
    stock: 8,
    maxStock: 30,
    views: 89,
    description: "De colmenas en bosques milenarios. Perfil amaderado con matices de resina y tierra húmeda.",
    benefits: ["Antibacteriana", "Enzimas activas", "Cosecha única"],
  },
  {
    id: "miel-azahar",
    name: "Néctar de Azahar",
    subtitle: "Miel Monofloral de Naranjo",
    price: 29.99,
    oldPrice: 39.99,
    weight: "450g",
    color: "#E8A832",
    badge: "FAVORITO",
    badgeColor: "#8B6914",
    stock: 15,
    maxStock: 40,
    views: 127,
    description: "De los naranjos en flor. Textura sedosa, dulzura equilibrada y aroma cítrico embriagador.",
    benefits: ["Relajante natural", "Cristalización fina", "Aroma único"],
  },
];

const BUNDLES = [
  {
    id: "bundle-degustacion",
    name: "Pack Degustación",
    description: "Una unidad de cada miel. Descubre los tres sabores.",
    products: ["miel-wildflower", "miel-bosque", "miel-azahar"],
    discount: 0.10,
    badge: "POPULAR",
  },
  {
    id: "bundle-familia",
    name: "Pack Familia",
    description: "Dos botes de Flor Silvestre, perfecta para el día a día.",
    products: ["miel-wildflower", "miel-wildflower"],
    discount: 0.15,
    badge: "AHORRO",
  },
  {
    id: "bundle-gourmet",
    name: "Pack Gourmet",
    description: "Los tres productos premium. El regalo perfecto.",
    products: ["miel-wildflower", "miel-bosque", "miel-azahar", "miel-bosque"],
    discount: 0.20,
    badge: "MEJOR VALOR",
  },
];

const TESTIMONIALS = [
  { name: "María G.", text: "Jamás probé una miel así. Es como líquido dorado del paraíso.", rating: 5, location: "Madrid" },
  { name: "Carlos R.", text: "Mi familia ya no acepta otra miel. Doreé cambió nuestro estándar para siempre.", rating: 5, location: "Barcelona" },
  { name: "Ana L.", text: "El packaging es impecable y el sabor... indescriptible. Regalo perfecto.", rating: 5, location: "Ciudad de México" },
  { name: "Pedro M.", text: "La Reserva del Bosque tiene un perfil aromático increíble. Soy sommelier y esto es arte.", rating: 5, location: "Sevilla" },
  { name: "Laura V.", text: "Llevo 6 meses pidiendo cada mes. El mejor producto que he comprado online.", rating: 5, location: "Valencia" },
  { name: "Diego S.", text: "La pureza se nota en el primer golpe. Nunca volveré a comprar miel del supermercado.", rating: 5, location: "Buenos Aires" },
];

const SOCIAL_PROOF = [
  "🍯 María de Madrid acaba de comprar Flor Silvestre",
  "🌿 Carlos de Barcelona agregó Reserva del Bosque al carrito",
  "✨ Ana de CDMX compró el Pack Gourmet",
  "🐝 Pedro de Sevilla acaba de comprar Néctar de Azahar",
  "🛡️ Laura de Valencia repitió su pedido mensual",
  "🍯 Diego de Buenos Aires adquirió el Pack Degustación",
  "🌿 Sofía de Bogotá compró 2 botes de Flor Silvestre",
  "✨ Miguel de Lima agregó el Pack Familia",
];

const FAQS = [
  {
    q: "¿Es realmente pura, sin mezclas ni aditivos?",
    a: "100%. Doreé nunca mezcla mieles de distintos orígenes ni añade azúcares, aromas artificiales ni conservantes. Cada bote contiene exactamente lo que la naturaleza produjo, sin más.",
  },
  {
    q: "¿Cómo debo conservar la miel para que dure?",
    a: "En un lugar fresco y seco, lejos de la luz directa del sol, a temperatura ambiente. No necesita refrigeración. Si cristaliza (señal de pureza), simplemente coloca el bote en agua tibia para que vuelva a su estado líquido.",
  },
  {
    q: "¿Cuál es la diferencia entre los tres tipos de miel?",
    a: "Flor Silvestre es multifloral, equilibrada y versátil para el día a día. Reserva del Bosque tiene un perfil intenso, amaderado y mineral, ideal para maridajes. Néctar de Azahar es monofloral, delicada y cítrica, perfecta para infusiones y postres.",
  },
  {
    q: "¿Cuánto tarda el envío y cuánto cuesta?",
    a: "Enviamos en 24–48h laborables. El envío es gratuito en pedidos superiores a $50. Para pedidos menores, el coste es de $4.99. Enviamos a toda España y Latinoamérica.",
  },
  {
    q: "¿Qué pasa si no me convence el producto?",
    a: "Tienes 30 días desde la recepción para devolverlo sin preguntas y sin coste alguno. Te devolvemos el 100% del importe. Así de seguros estamos de nuestra miel.",
  },
];

const FREE_SHIPPING_THRESHOLD = 50;

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        setDone(true);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return (
    <span ref={ref} style={done ? { display: "inline-block", animation: "counterBounce 0.6s ease-out forwards" } : {}}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── SVG COMPONENTS ──────────────────────────────────────────────────────────

function HoneycombBg({ opacity = 0.04 }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hc" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
          <path d="M28 66L0 50V16L28 0L56 16V50L28 66ZM28 100L0 84V50L28 34L56 50V84L28 100Z" fill="none" stroke="#C8841A" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hc)" />
    </svg>
  );
}

function WaveDivider({ flip = false, color = "#1A120A" }) {
  return (
    <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, marginTop: -1, transform: flip ? "scaleY(-1)" : "none" }}>
      <svg viewBox="0 0 1440 70" style={{ width: "100%", display: "block" }}>
        <path
          d="M0,35 C120,70 240,0 360,35 C480,70 600,0 720,35 C840,70 960,0 1080,35 C1200,70 1320,0 1440,35 L1440,70 L0,70 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

function HoneyJarSVG({ color = "#C8841A", size = 120, animated = false }) {
  const fillId = `fill-${color.replace("#", "")}-${size}`;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={animated ? { animation: "floatJar 4s ease-in-out infinite" } : {}}>
      <defs>
        <clipPath id={fillId}>
          <rect x="18" y="35" width="64" height="65" rx="10" />
        </clipPath>
        <linearGradient id={`jar-honey-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7A4E10" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`jar-glass-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F8F0E0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F8F0E0" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {/* Lid */}
      <rect x="24" y="22" width="52" height="16" rx="5" fill="#5A3A0A" />
      <rect x="28" y="24" width="44" height="12" rx="4" fill="#7A5220" />
      {/* Jar body */}
      <rect x="18" y="35" width="64" height="65" rx="10" fill={`url(#jar-glass-${size})`} stroke="rgba(200,132,26,0.4)" strokeWidth="1.5" />
      {/* Honey fill */}
      <rect x="18" y="55" width="64" height="45" rx="0" fill={`url(#jar-honey-${size})`} clipPath={`url(#${fillId})`}
        style={animated ? { animation: "honeyRise 3s ease-out forwards" } : {}} />
      {/* Honey surface wave */}
      <ellipse cx="50" cy="55" rx="28" ry="5" fill={color} opacity="0.8"
        style={animated ? { animation: "honeySurface 3s ease-in-out infinite" } : {}} />
      {/* Glass reflection */}
      <rect x="22" y="38" width="6" height="55" rx="3" fill="white" opacity="0.08" />
      <rect x="72" y="38" width="4" height="55" rx="2" fill="white" opacity="0.05" />
      {/* Label */}
      <rect x="28" y="62" width="44" height="26" rx="3" fill="rgba(240,222,180,0.12)" stroke="rgba(200,132,26,0.25)" strokeWidth="0.8" />
      <line x1="32" y1="70" x2="68" y2="70" stroke="rgba(200,132,26,0.3)" strokeWidth="0.6" />
      <line x1="34" y1="75" x2="66" y2="75" stroke="rgba(200,132,26,0.2)" strokeWidth="0.5" />
      <line x1="36" y1="80" x2="64" y2="80" stroke="rgba(200,132,26,0.15)" strokeWidth="0.4" />
    </svg>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────

function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#1A120A", zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "loadingFadeOut 0.4s 0.9s forwards",
    }}>
      <div style={{ animation: "loadingPulse 1.6s ease-in-out infinite" }}>
        <HoneyJarSVG size={90} color="#C8841A" animated={false} />
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900,
        letterSpacing: 6, color: "#C8841A", marginTop: "1.5rem",
        animation: "fadeUp 0.8s 0.3s both",
      }}>
        DOR<span style={{ color: "#F8F0E0", fontWeight: 400 }}>EÉ</span>
      </div>
      <div style={{
        width: 120, height: 2, background: "rgba(200,132,26,0.2)", borderRadius: 2, marginTop: "1.2rem", overflow: "hidden",
      }}>
        <div style={{ height: "100%", background: "var(--amber)", animation: "loadingBar 0.9s ease-out forwards", width: 0 }} />
      </div>
    </div>
  );
}

// ─── HERO PARTICLES ───────────────────────────────────────────────────────────

function HeroParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 768;

    // Pollen — amber, upward drift
    for (let i = 0; i < (isMobile ? 18 : 35); i++) {
      particles.push({ x: Math.random() * 2000, y: Math.random() * 1000, r: Math.random() * 2 + 1, dx: (Math.random() - 0.5) * 0.3, dy: -(Math.random() * 0.3 + 0.1), o: Math.random() * 0.5 + 0.3, type: "pollen", phase: Math.random() * Math.PI * 2, phaseSpeed: Math.random() * 0.015 + 0.005 });
    }
    // Dust motes — cream, orbital
    for (let i = 0; i < (isMobile ? 4 : 10); i++) {
      particles.push({ x: Math.random() * 2000, y: Math.random() * 1000, r: Math.random() * 2.5 + 2, dx: (Math.random() - 0.5) * 0.06, dy: (Math.random() - 0.5) * 0.06, o: Math.random() * 0.15 + 0.08, type: "dust", angle: Math.random() * Math.PI * 2, angleSpeed: (Math.random() - 0.5) * 0.005 });
    }
    // Forest spores — green, more visible
    for (let i = 0; i < (isMobile ? 12 : 22); i++) {
      particles.push({ x: Math.random() * 2000, y: Math.random() * 1000, r: Math.random() * 3 + 1.5, dx: (Math.random() - 0.5) * 0.2, dy: -(Math.random() * 0.2 + 0.08), o: Math.random() * 0.45 + 0.25, type: "spore", phase: Math.random() * Math.PI * 2, phaseSpeed: Math.random() * 0.01 + 0.004 });
    }
    // Large leaf particles — bright green, slow
    for (let i = 0; i < (isMobile ? 4 : 8); i++) {
      particles.push({ x: Math.random() * 2000, y: Math.random() * 1000, r: Math.random() * 4 + 4, dx: (Math.random() - 0.5) * 0.12, dy: -(Math.random() * 0.12 + 0.04), o: Math.random() * 0.35 + 0.2, type: "leaf", angle: Math.random() * Math.PI * 2, angleSpeed: (Math.random() - 0.5) * 0.008, phase: Math.random() * Math.PI * 2, phaseSpeed: Math.random() * 0.007 + 0.003 });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        if (p.type === "leaf") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.scale(1, 0.5);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(90,140,74,${p.o})`;
          ctx.fill();
          ctx.restore();
          p.angle += p.angleSpeed;
          p.phase += p.phaseSpeed;
          p.x += p.dx + Math.sin(p.phase) * 0.3;
          p.y += p.dy;
          if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        } else if (p.type === "spore") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74,103,65,${p.o})`;
          ctx.fill();
          p.phase += p.phaseSpeed;
          p.x += p.dx + Math.sin(p.phase) * 0.35;
          p.y += p.dy;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.type === "dust" ? `rgba(240,222,180,${p.o})` : `rgba(200,132,26,${p.o})`;
          ctx.fill();
          if (p.type === "pollen") {
            p.phase += p.phaseSpeed;
            p.x += p.dx + Math.sin(p.phase) * 0.4;
            p.y += p.dy;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
          } else {
            p.angle += p.angleSpeed;
            p.x += Math.cos(p.angle) * 0.2 + p.dx;
            p.y += Math.sin(p.angle) * 0.15 + p.dy;
            if (p.x < -20) p.x = canvas.width + 20;
            if (p.x > canvas.width + 20) p.x = -20;
            if (p.y < -20) p.y = canvas.height + 20;
            if (p.y > canvas.height + 20) p.y = -20;
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />;
}

// ─── FADE SECTION ─────────────────────────────────────────────────────────────

function FadeSection({ children, className = "", style = {}, delay = 0 }) {
  const [ref, visible] = useInView(0.08);
  return (
    <div
      ref={ref}
      className={`fade-section ${visible ? "visible" : ""} ${className}`}
      style={{ ...style, transitionDelay: visible ? `${delay}s` : "0s" }}
    >
      {children}
    </div>
  );
}

// ─── BEE ELEMENT ──────────────────────────────────────────────────────────────

function BeeElement() {
  const [active, setActive] = useState(false);
  const [fromBottom, setFromBottom] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setFromBottom(Math.random() > 0.5);
      setActive(true);
      setTimeout(() => setActive(false), 7000);
    };
    const first = setTimeout(trigger, 10000);
    const interval = setInterval(trigger, 22000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (!active) return null;
  return (
    <div style={{
      position: "fixed",
      top: fromBottom ? "70%" : "25%",
      left: 0,
      zIndex: 1600,
      fontSize: "2rem",
      pointerEvents: "none",
      animation: "beeFlight 7s cubic-bezier(0.4,0,0.6,1) forwards",
      filter: "drop-shadow(0 0 6px rgba(200,132,26,0.5))",
    }}>
      🐝
    </div>
  );
}

// ─── SOCIAL TOAST ─────────────────────────────────────────────────────────────

function SocialToast() {
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    const show = () => {
      idx.current = (idx.current + 1) % SOCIAL_PROOF.length;
      setToast(SOCIAL_PROOF[idx.current]);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };
    const first = setTimeout(show, 5000);
    const interval = setInterval(show, 14000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  return (
    <div className="social-toast-mobile" style={{
      position: "fixed", bottom: "1.5rem", left: "1.5rem", zIndex: 1500,
      background: "rgba(26,18,10,0.95)", border: "1px solid rgba(200,132,26,0.35)",
      backdropFilter: "blur(12px)", padding: "0.85rem 1.2rem",
      fontSize: "0.78rem", color: "#F0DEB4", maxWidth: 300,
      borderRadius: 2,
      transform: visible ? "translateY(0)" : "translateY(120px)",
      opacity: visible ? 1 : 0,
      transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.4s",
      pointerEvents: "none",
    }}>
      {toast}
    </div>
  );
}

// ─── FLOATING CTA ─────────────────────────────────────────────────────────────

function FloatingCTA({ showCart, onScroll }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!show || showCart) return null;
  return (
    <button
      onClick={onScroll}
      className="floating-cta-mobile"
      style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 1500,
        background: "var(--amber)", color: "var(--bark)",
        border: "none", padding: "14px 28px",
        fontSize: "0.72rem", letterSpacing: 3, textTransform: "uppercase",
        fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
        cursor: "pointer", borderRadius: 2,
        boxShadow: "0 8px 30px rgba(200,132,26,0.45)",
        animation: "organicGlow 3s ease-in-out infinite",
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      🍯 Comprar Ahora
    </button>
  );
}

// ─── PROCESS SECTION ──────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { icon: "🐝", title: "La Colmena", desc: "Abejas libres en entornos prístinos, lejos de pesticidas y contaminación." },
  { icon: "🌸", title: "La Cosecha", desc: "Recolectamos solo cuando la miel alcanza su punto óptimo de maduración natural." },
  { icon: "🫙", title: "El Filtrado", desc: "Filtrado en frío que conserva enzimas, polen y toda la riqueza nutricional." },
  { icon: "📦", title: "Tu Mesa", desc: "Envasado artesanal y enviado directamente a tu hogar en 24–48 horas." },
];

function ProcessSection() {
  return (
    <section className="section" style={{ background: "var(--bark)", position: "relative" }}>
      <HoneycombBg opacity={0.025} />
      <FadeSection>
        <h2 className="section-title">Del <em>Panal</em> a Tu Mesa</h2>
        <p className="section-subtitle">Transparencia total en cada paso del proceso</p>
      </FadeSection>
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <div style={{
          position: "absolute", top: "50px", left: "10%", right: "10%", height: 2,
          background: "linear-gradient(90deg, transparent, rgba(200,132,26,0.4), rgba(200,132,26,0.4), transparent)",
          display: "none",
        }} className="process-line" />
        <div className="process-grid-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
          {PROCESS_STEPS.map((step, i) => (
            <FadeSection key={step.title} delay={i * 0.12}>
              <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(61,92,53,0.18)", border: "1px solid rgba(90,140,74,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.8rem", margin: "0 auto 1rem",
                  transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
                  boxShadow: "0 0 0 rgba(90,140,74,0)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(61,92,53,0.35)"; e.currentTarget.style.borderColor = "rgba(90,140,74,0.7)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(90,140,74,0.3)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(61,92,53,0.18)"; e.currentTarget.style.borderColor = "rgba(90,140,74,0.35)"; e.currentTarget.style.boxShadow = "0 0 0 rgba(90,140,74,0)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {step.icon}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", color: "var(--amber)", fontSize: "0.65rem", letterSpacing: 3, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Paso {i + 1}
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--ivory)", marginBottom: "0.6rem" }}>{step.title}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BUNDLE SECTION ───────────────────────────────────────────────────────────

function BundleSection({ onAddBundle }) {
  return (
    <section className="section section-dark" style={{ position: "relative" }}>
      <HoneycombBg opacity={0.035} />
      <FadeSection>
        <h2 className="section-title">Ahorra con <em>Packs</em></h2>
        <p className="section-subtitle">Combina y multiplica el ahorro — cuanto más, mejor</p>
      </FadeSection>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: 1000, margin: "0 auto" }}>
        {BUNDLES.map((bundle, i) => {
          const bundleProducts = bundle.products.map(id => PRODUCTS.find(p => p.id === id));
          const originalTotal = bundleProducts.reduce((s, p) => s + p.price, 0);
          const discountedTotal = originalTotal * (1 - bundle.discount);
          const savings = originalTotal - discountedTotal;
          return (
            <FadeSection key={bundle.id} delay={i * 0.1}>
              <div style={{
                background: "var(--bark-card)", border: "1px solid var(--bark-border)",
                padding: "2rem", position: "relative", transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,132,26,0.4)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(0,0,0,0.4), 0 0 40px rgba(200,132,26,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bark-border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: "linear-gradient(90deg, transparent, var(--amber-glow), transparent)",
                  opacity: i === 2 ? 1 : 0.4,
                }} />
                <div style={{ display: "inline-block", background: i === 2 ? "var(--amber)" : "rgba(200,132,26,0.15)", color: i === 2 ? "var(--bark)" : "var(--amber)", padding: "3px 10px", fontSize: "0.6rem", letterSpacing: 2, fontWeight: 700, marginBottom: "1rem" }}>
                  {bundle.badge}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "0.5rem", color: "var(--ivory)" }}>{bundle.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>{bundle.description}</p>
                <div style={{ marginBottom: "1.2rem" }}>
                  {[...new Set(bundle.products)].map(id => {
                    const count = bundle.products.filter(x => x === id).length;
                    const prod = PRODUCTS.find(p => p.id === id);
                    return (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "3px 0", fontSize: "0.75rem", color: "var(--parchment)" }}>
                        <span style={{ color: "var(--amber)", fontSize: "0.5rem" }}>◆</span>
                        {count > 1 ? `${count}x ` : ""}{prod.name} ({prod.weight})
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: "0.4rem" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "var(--amber)" }}>${discountedTotal.toFixed(2)}</span>
                  <span style={{ color: "#6B5540", fontSize: "0.85rem", textDecoration: "line-through" }}>${originalTotal.toFixed(2)}</span>
                  <span style={{ background: "rgba(200,132,26,0.18)", color: "var(--amber)", padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700 }}>-{(bundle.discount * 100).toFixed(0)}%</span>
                </div>
                <div style={{ color: "var(--fern)", fontSize: "0.72rem", letterSpacing: 1, marginBottom: "1.2rem" }}>
                  Ahorras ${savings.toFixed(2)}
                </div>
                <button
                  className="buy-btn"
                  onClick={() => onAddBundle(bundle)}
                  style={{ width: "100%" }}
                >
                  Añadir Pack al Carrito
                </button>
              </div>
            </FadeSection>
          );
        })}
      </div>
    </section>
  );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────────────────

function FaqSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="section" style={{ background: "var(--bark)" }}>
      <FadeSection>
        <h2 className="section-title">Preguntas <em>Frecuentes</em></h2>
        <p className="section-subtitle">Todo lo que necesitas saber antes de pedir</p>
      </FadeSection>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {FAQS.map((faq, i) => (
          <FadeSection key={i} delay={i * 0.07}>
            <div style={{
              borderBottom: "1px solid var(--bark-border)", overflow: "hidden",
              marginBottom: "0.2rem",
            }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none",
                  padding: "1.3rem 0", display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "var(--ivory)", paddingRight: "1rem" }}>{faq.q}</span>
                <span style={{
                  color: "var(--amber)", fontSize: "1.2rem", flexShrink: 0,
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: open === i ? 200 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.23,1,0.32,1)",
              }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.87rem", lineHeight: 1.8, paddingBottom: "1.3rem" }}>{faq.a}</p>
              </div>
            </div>
          </FadeSection>
        ))}
      </div>
    </section>
  );
}

// ─── AVATAR SVG ───────────────────────────────────────────────────────────────

function AvatarSVG({ name, size = 44 }) {
  const colors = ["#C8841A", "#4A6741", "#7A4E10", "#8B6914", "#6B8F5E"];
  const idx = name.charCodeAt(0) % colors.length;
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="22" fill={colors[idx]} opacity="0.25" />
      <circle cx="22" cy="22" r="21" fill="none" stroke={colors[idx]} strokeWidth="1" opacity="0.5" />
      <text x="22" y="27" textAnchor="middle" fill={colors[idx]} fontSize="14" fontFamily="'Playfair Display', serif" fontWeight="600">{initials}</text>
    </svg>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, onAdd }) {
  const cardRef = useRef(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)";
  }, []);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAdd(product);
    setAdded(true);
    if (cardRef.current) {
      cardRef.current.style.animation = "popIn 0.35s ease-out";
      setTimeout(() => { if (cardRef.current) cardRef.current.style.animation = ""; }, 350);
    }
    setTimeout(() => setAdded(false), 1800);
  };

  const stockPct = Math.max(0, Math.min(100, (product.stock / product.maxStock) * 100));

  return (
    <div
      ref={cardRef}
      className="product-card"
      style={{ transition: "transform 0.15s ease-out, box-shadow 0.4s, border-color 0.4s" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${product.color}, transparent)`, opacity: 0 }} className="card-top-line" />
      <div style={{ display: "inline-block", background: product.badgeColor, color: "#F8F0E0", padding: "4px 12px", fontSize: "0.6rem", letterSpacing: 2, fontWeight: 700, marginBottom: "1.2rem" }}>
        {product.badge}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <HoneyJarSVG size={100} color={product.color} animated />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <div style={{ fontSize: "0.7rem", color: "var(--fern)", letterSpacing: 1, marginBottom: "0.3rem" }}>
        👁 {product.views} personas lo ven ahora
      </div>
      <div className="product-sub">{product.subtitle} · {product.weight}</div>
      <p className="product-desc">{product.description}</p>
      <ul className="product-benefits">
        {product.benefits.map((b) => <li key={b}>{b}</li>)}
      </ul>
      <div className="product-pricing">
        <span className="product-price">${product.price}</span>
        <span className="product-old-price">${product.oldPrice}</span>
        <span style={{ background: "rgba(200,132,26,0.18)", color: "var(--amber)", padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: 1 }}>
          -{Math.round((1 - product.price / product.oldPrice) * 100)}%
        </span>
      </div>

      {/* Stock bar */}
      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <div className="product-stock">
            <span className="stock-dot" />
            Solo quedan {product.stock} unidades
          </div>
        </div>
        <div style={{ height: 4, background: "rgba(200,132,26,0.12)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${stockPct}%`, background: stockPct < 30 ? "#B8432A" : "var(--amber)", borderRadius: 2, transition: "width 1s ease" }} />
        </div>
      </div>

      {/* Qty selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: 1, color: "var(--text-muted)", textTransform: "uppercase" }}>Cantidad:</span>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(200,132,26,0.25)", borderRadius: 2 }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", color: "var(--amber)", padding: "4px 10px", cursor: "pointer", fontSize: "1rem" }}>−</button>
          <span style={{ color: "var(--ivory)", minWidth: 24, textAlign: "center", fontSize: "0.85rem" }}>{qty}</span>
          <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ background: "none", border: "none", color: "var(--amber)", padding: "4px 10px", cursor: "pointer", fontSize: "1rem" }}>+</button>
        </div>
      </div>

      <button className="buy-btn" onClick={handleAdd}>
        {added ? "✓ Añadido" : "Agregar al Carrito"}
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function OroPuro() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [urgency, setUrgency] = useState(15 * 60);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setUrgency((u) => (u > 0 ? u - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(urgency / 60);
  const secs = urgency % 60;
  const urgentPulse = urgency < 300;

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCart(true);
  }, []);

  const addBundle = useCallback((bundle) => {
    bundle.products.forEach(id => {
      const prod = PRODUCTS.find(p => p.id === id);
      if (prod) addToCart({ ...prod, price: +(prod.price * (1 - bundle.discount)).toFixed(2), bundleId: bundle.id });
    });
  }, [addToCart]);

  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p));
  const cartTotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingPct = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const upsellProduct = cart.length > 0
    ? PRODUCTS.find(p => !cart.some(c => c.id === p.id))
    : null;

  const css = `
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --amber:        #C8841A;
      --amber-light:  #F2C96E;
      --amber-pale:   #F5D78E;
      --amber-dark:   #7A4E10;
      --amber-glow:   #E8A832;
      --bark:         #1A120A;
      --bark-soft:    #1C1E10;
      --bark-card:    #231E10;
      --bark-border:  #3A3020;
      --parchment:    #F0DEB4;
      --ivory:        #F8F0E0;
      --text-muted:   #9E9070;
      --moss:         #4A6741;
      --fern:         #6B8F5E;
      --sage:         #8FAF7E;
      --forest-dark:  #2D3F28;
      --forest-mid:   #3D5C35;
      --leaf-bright:  #5A8C4A;
      --dew:          #A8C89A;
      --earth:        #2E1E0F;
      --stock-red:    #B8432A;
    }

    html { scroll-behavior: smooth; }
    body { background: var(--bark); color: var(--ivory); font-family: 'Montserrat', sans-serif; overflow-x: hidden; }

    .oro-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(26,18,10,0.90); backdrop-filter: blur(24px) saturate(180%);
      border-bottom: 1px solid rgba(200,132,26,0.12);
      padding: 0 2rem; height: 70px;
      display: flex; align-items: center; justify-content: space-between;
      transition: all 0.3s;
    }
    .oro-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; letter-spacing: 3px; color: var(--amber); cursor: pointer; transition: opacity 0.2s; }
    .oro-logo:hover { opacity: 0.8; }
    .oro-logo span { color: var(--ivory); font-weight: 400; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a {
      color: var(--text-muted); text-decoration: none; font-size: 0.75rem;
      letter-spacing: 2px; text-transform: uppercase; font-weight: 500; cursor: pointer;
      position: relative; padding-bottom: 2px; transition: color 0.3s;
    }
    .nav-links a::after {
      content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px;
      background: var(--amber); transition: width 0.3s;
    }
    .nav-links a:hover { color: var(--amber); }
    .nav-links a:hover::after { width: 100%; }
    .cart-btn {
      position: relative; background: none; border: 1px solid rgba(200,132,26,0.35);
      color: var(--amber); padding: 8px 18px; cursor: pointer; font-size: 0.75rem;
      letter-spacing: 2px; text-transform: uppercase; font-family: 'Montserrat', sans-serif;
      transition: all 0.3s;
    }
    .cart-btn:hover { background: var(--amber); color: var(--bark); }
    .cart-badge {
      position: absolute; top: -8px; right: -8px; background: var(--amber);
      color: var(--bark); width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700;
      animation: popIn 0.3s ease-out;
    }

    .hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; text-align: center;
      background:
        radial-gradient(ellipse at 50% 95%, rgba(200,132,26,0.22) 0%, transparent 50%),
        radial-gradient(ellipse at 5% 30%, rgba(45,63,40,0.50) 0%, transparent 50%),
        radial-gradient(ellipse at 95% 20%, rgba(61,92,53,0.40) 0%, transparent 45%),
        radial-gradient(ellipse at 50% 10%, rgba(74,103,65,0.25) 0%, transparent 40%),
        radial-gradient(ellipse at 80% 80%, rgba(232,168,50,0.10) 0%, transparent 40%),
        linear-gradient(160deg, #0D130A 0%, #1A120A 45%, #131A0D 100%);
      animation: forestBreath 20s ease-in-out infinite;
    }
    .hero::after {
      content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1;
      background: linear-gradient(135deg, transparent 0%, rgba(200,132,26,0.03) 50%, transparent 100%);
      background-size: 400% 400%;
      animation: honeyDrizzle 14s ease-in-out infinite;
    }
    .hero-content { position: relative; z-index: 3; padding: 2rem; max-width: 900px; }
    .hero-eyebrow {
      font-size: 0.68rem; letter-spacing: 7px; text-transform: uppercase; color: var(--amber-light);
      margin-bottom: 1.5rem; font-weight: 500;
      opacity: 0; transform: translateY(20px);
      animation: fadeUp 0.8s 0.4s forwards;
    }
    .hero-title {
      font-family: 'Playfair Display', serif; font-size: clamp(3.5rem, 9vw, 8rem);
      font-weight: 900; line-height: 0.95; margin-bottom: 0.6rem;
      background: linear-gradient(135deg, var(--amber-light) 0%, var(--amber-glow) 30%, var(--amber) 55%, var(--amber-dark) 80%, var(--amber-glow) 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: fadeUp 0.9s 0.6s forwards, shimmer 5s ease-in-out infinite;
      opacity: 0; transform: translateY(30px);
    }
    .hero-subtitle {
      font-family: 'Cormorant Garamond', serif; font-size: clamp(1.1rem, 2.5vw, 1.65rem);
      color: var(--parchment); font-weight: 300; font-style: italic; margin-bottom: 2.8rem;
      opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s 0.8s forwards;
    }
    .hero-cta {
      display: inline-block; padding: 20px 52px; background: var(--amber);
      color: var(--bark); font-size: 0.78rem; letter-spacing: 4px; text-transform: uppercase;
      font-weight: 700; cursor: pointer; border: none; text-decoration: none;
      font-family: 'Montserrat', sans-serif; position: relative; overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      opacity: 0; animation: fadeUp 0.8s 1s forwards, organicGlow 3.5s 2s ease-in-out infinite;
    }
    .hero-cta:hover { transform: translateY(-3px); box-shadow: 0 16px 50px rgba(200,132,26,0.45); }
    .hero-cta::after {
      content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
      animation: sweepShine 3.5s 2s infinite;
    }
    .hero-scroll-cue {
      position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
      z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;
      opacity: 0; animation: fadeUp 0.8s 1.4s forwards;
    }
    .hero-scroll-cue span { font-size: 0.6rem; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); }
    .scroll-arrow { width: 20px; height: 20px; border-right: 1px solid var(--amber); border-bottom: 1px solid var(--amber); transform: rotate(45deg); animation: scrollBounce 1.6s ease-in-out infinite; }

    .urgency-bar {
      padding: 13px; text-align: center; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase;
      color: var(--amber-light); border-top: 1px solid rgba(200,132,26,0.18); border-bottom: 1px solid rgba(200,132,26,0.18);
      background: linear-gradient(90deg, rgba(200,132,26,0.05), rgba(200,132,26,0.14), rgba(200,132,26,0.05));
      display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;
    }
    .urgency-timer { font-weight: 700; font-size: 0.9rem; font-family: 'Playfair Display', serif; }
    .urgency-timer.pulse { animation: timerPulse 1s ease-in-out infinite; color: #E05540; }

    .section { padding: 6rem 2rem; position: relative; }
    .section-dark { background: var(--bark-soft); }
    .section-title {
      font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3.2rem);
      text-align: center; margin-bottom: 0.8rem; color: var(--ivory); line-height: 1.15;
    }
    .section-title em { color: var(--amber); font-style: italic; }
    .section-subtitle {
      text-align: center; color: var(--text-muted); font-size: 0.82rem;
      letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 4rem;
    }

    .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto; }
    .product-card {
      background: var(--bark-card); border: 1px solid var(--bark-border);
      padding: 2.5rem 2rem; position: relative; overflow: hidden;
      transition: border-color 0.4s, box-shadow 0.4s;
      will-change: transform;
    }
    .product-card:hover { border-color: rgba(200,132,26,0.45); box-shadow: 0 24px 70px rgba(10,15,8,0.75), 0 0 60px rgba(200,132,26,0.12), 0 0 30px rgba(90,140,74,0.08); }
    .product-card:hover .card-top-line { opacity: 1 !important; transition: opacity 0.4s; }
    .product-name { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 0.25rem; }
    .product-sub { color: var(--text-muted); font-size: 0.73rem; letter-spacing: 1px; margin-bottom: 1rem; }
    .product-desc { color: var(--parchment); font-size: 1rem; line-height: 1.7; margin-bottom: 1.2rem; font-family: 'Cormorant Garamond', serif; opacity: 0.85; }
    .product-benefits { list-style: none; margin-bottom: 1.4rem; }
    .product-benefits li { color: var(--text-muted); font-size: 0.74rem; padding: 4px 0 4px 16px; position: relative; letter-spacing: 0.5px; }
    .product-benefits li::before { content: '◆'; color: var(--amber); position: absolute; left: 0; font-size: 0.5rem; top: 6px; }
    .product-pricing { display: flex; align-items: baseline; gap: 10px; margin-bottom: 0.6rem; }
    .product-price { font-family: 'Playfair Display', serif; font-size: 1.9rem; color: var(--amber); }
    .product-old-price { color: #6B5540; font-size: 0.9rem; text-decoration: line-through; }
    .product-stock { font-size: 0.7rem; color: var(--stock-red); display: flex; align-items: center; gap: 6px; }
    .stock-dot { width: 6px; height: 6px; background: var(--stock-red); border-radius: 50%; display: inline-block; animation: breathe 2.4s ease-in-out infinite; }
    .buy-btn {
      width: 100%; padding: 14px; background: transparent; border: 1px solid var(--amber);
      color: var(--amber); font-size: 0.73rem; letter-spacing: 3px; text-transform: uppercase;
      cursor: pointer; font-family: 'Montserrat', sans-serif; font-weight: 600;
      transition: all 0.3s; position: relative; overflow: hidden;
    }
    .buy-btn:hover { background: var(--amber); color: var(--bark); }
    .buy-btn:active { transform: scale(0.97); }

    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto; }
    .benefit-card {
      text-align: center; padding: 2.2rem 1.5rem;
      border: 1px solid rgba(90,140,74,0.18);
      transition: all 0.45s cubic-bezier(0.23,1,0.32,1);
      background: rgba(45,63,40,0.06);
    }
    .benefit-card:hover {
      border-color: rgba(90,140,74,0.5);
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 18px 50px rgba(0,0,0,0.5), 0 0 40px rgba(90,140,74,0.2), 0 0 20px rgba(200,132,26,0.08);
      background: rgba(45,63,40,0.12);
    }
    .benefit-card:hover .benefit-icon { animation: iconSpin 0.6s cubic-bezier(0.23,1,0.32,1) forwards; }
    .benefit-icon { font-size: 2.5rem; margin-bottom: 1rem; display: inline-block; animation: leafDrift 6s ease-in-out infinite; }
    .benefit-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 0.6rem; color: var(--amber); }
    .benefit-text { color: var(--text-muted); font-size: 0.83rem; line-height: 1.7; }

    .stats-row { display: flex; justify-content: center; gap: 0; flex-wrap: wrap; padding: 4rem 2rem; }
    .stat {
      text-align: center; flex: 1; min-width: 140px; padding: 1.5rem;
      position: relative; transition: background 0.3s;
    }
    .stat:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 25%; height: 50%; width: 1px; background: var(--bark-border); }
    .stat:hover { background: rgba(200,132,26,0.03); }
    .stat-number { font-family: 'Playfair Display', serif; font-size: 3rem; color: var(--amber); line-height: 1; }
    .stat-label { color: var(--text-muted); font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 0.4rem; }

    .testimonials-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .testimonial {
      background: var(--bark-card); border: 1px solid var(--bark-border); padding: 2rem;
      position: relative; transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    }
    .testimonial:hover { border-color: rgba(200,132,26,0.3); transform: translateY(-4px); box-shadow: 0 12px 35px rgba(0,0,0,0.4); }
    .testimonial::before { content: '"'; font-family: 'Playfair Display', serif; font-size: 5rem; color: rgba(200,132,26,0.14); position: absolute; top: 5px; left: 12px; line-height: 1; }
    .testimonial-text { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: var(--parchment); line-height: 1.75; margin-bottom: 1.2rem; position: relative; z-index: 1; font-style: italic; opacity: 0.9; }
    .testimonial-author { font-size: 0.75rem; letter-spacing: 1px; color: var(--amber-light); font-weight: 600; }
    .testimonial-loc { font-size: 0.68rem; color: var(--text-muted); margin-top: 2px; }
    .testimonial-stars { color: var(--amber-glow); font-size: 0.8rem; margin-bottom: 0.9rem; letter-spacing: 3px; }

    .guarantee-box {
      max-width: 700px; margin: 0 auto; text-align: center;
      border: 1px solid rgba(200,132,26,0.28); padding: 3.5rem;
      background: radial-gradient(ellipse at center, rgba(200,132,26,0.06) 0%, transparent 70%);
      position: relative; overflow: hidden;
    }
    .guarantee-box::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(200,132,26,0.03) 0%, transparent 50%, rgba(200,132,26,0.03) 100%);
      pointer-events: none;
    }
    .guarantee-box h3 { font-family: 'Playfair Display', serif; font-size: 1.9rem; margin-bottom: 1rem; }
    .guarantee-box p { color: var(--text-muted); line-height: 1.85; font-size: 0.9rem; }
    .guarantee-points { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-top: 1.8rem; }
    .guarantee-point { font-size: 0.72rem; color: var(--amber-light); letter-spacing: 1.5px; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }

    .footer {
      padding: 4rem 2rem 2rem;
      background: linear-gradient(180deg, var(--forest-dark) 0%, #1A1F10 100%);
      border-top: 1px solid rgba(90,140,74,0.2);
    }
    .footer-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem; }
    .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--amber); letter-spacing: 4px; margin-bottom: 0.8rem; }
    .footer-tagline { color: var(--text-muted); font-size: 0.78rem; line-height: 1.7; }
    .footer-heading { font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase; color: var(--amber); margin-bottom: 1rem; font-weight: 600; }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .footer-links a { color: var(--text-muted); font-size: 0.8rem; text-decoration: none; cursor: pointer; transition: color 0.2s; }
    .footer-links a:hover { color: var(--amber-light); }
    .footer-newsletter { display: flex; gap: 0.5rem; margin-top: 0.8rem; }
    .footer-email-input {
      flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(200,132,26,0.2);
      color: var(--ivory); padding: 9px 12px; font-size: 0.75rem; font-family: 'Montserrat', sans-serif;
      outline: none; transition: border-color 0.3s;
    }
    .footer-email-input:focus { border-color: rgba(200,132,26,0.45); }
    .footer-email-btn {
      background: var(--amber); color: var(--bark); border: none; padding: 9px 16px;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; cursor: pointer;
      font-family: 'Montserrat', sans-serif; transition: opacity 0.2s;
    }
    .footer-email-btn:hover { opacity: 0.85; }
    .footer-bottom { text-align: center; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid rgba(200,132,26,0.08); color: var(--text-muted); font-size: 0.7rem; }
    .social-links { display: flex; gap: 1rem; margin-top: 0.8rem; }
    .social-link { width: 34px; height: 34px; border: 1px solid rgba(200,132,26,0.25); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.9rem; text-decoration: none; transition: all 0.3s; cursor: pointer; }
    .social-link:hover { border-color: var(--amber); color: var(--amber); background: rgba(200,132,26,0.08); }

    .cart-panel {
      position: fixed; top: 0; right: 0; width: 400px; max-width: 92vw; height: 100vh;
      background: var(--bark-soft); border-left: 1px solid rgba(200,132,26,0.18);
      z-index: 2000; padding: 2rem; overflow-y: auto;
      transform: translateX(100%); transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .cart-panel.open { transform: translateX(0); }
    .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1999; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
    .cart-overlay.open { opacity: 1; pointer-events: all; }
    .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--bark-border); padding-bottom: 1rem; }
    .cart-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; }
    .cart-close { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.6rem; transition: color 0.2s; }
    .cart-close:hover { color: var(--ivory); }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--bark-border); gap: 0.8rem; }
    .cart-item-info { flex: 1; min-width: 0; }
    .cart-item-name { font-size: 0.85rem; font-weight: 500; margin-bottom: 2px; }
    .cart-item-price { color: var(--amber); font-family: 'Playfair Display', serif; font-size: 1rem; }
    .cart-item-qty-controls { display: flex; align-items: center; gap: 4px; }
    .qty-btn { background: none; border: 1px solid rgba(200,132,26,0.25); color: var(--amber); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .qty-btn:hover { background: rgba(200,132,26,0.1); }
    .qty-display { font-size: 0.8rem; min-width: 20px; text-align: center; }
    .cart-item-remove { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.65rem; letter-spacing: 1px; text-transform: uppercase; transition: color 0.3s; display: block; margin-top: 3px; }
    .cart-item-remove:hover { color: var(--stock-red); }
    .shipping-bar { margin: 1rem 0; padding: 0.8rem; background: rgba(74,103,65,0.12); border: 1px solid rgba(74,103,65,0.2); }
    .shipping-bar-text { font-size: 0.72rem; color: var(--sage); margin-bottom: 0.5rem; letter-spacing: 0.5px; }
    .shipping-bar-track { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
    .shipping-bar-fill { height: 100%; background: var(--fern); border-radius: 2px; transition: width 0.6s ease; }
    .cart-total { display: flex; justify-content: space-between; padding: 1.2rem 0; }
    .cart-total-label { letter-spacing: 2px; text-transform: uppercase; font-size: 0.75rem; color: var(--text-muted); }
    .cart-total-amount { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--amber); }
    .checkout-btn {
      width: 100%; padding: 16px; background: linear-gradient(90deg, var(--amber) 0%, var(--forest-mid) 100%); color: var(--ivory);
      border: none; font-size: 0.78rem; letter-spacing: 3px; text-transform: uppercase;
      font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif;
      margin-top: 0.8rem; transition: all 0.3s; position: relative; overflow: hidden;
    }
    .checkout-btn:hover { box-shadow: 0 8px 30px rgba(200,132,26,0.4), 0 4px 20px rgba(90,140,74,0.2); }
    .checkout-btn::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: sweepShine 2.5s 1s infinite; }
    .stripe-note { text-align: center; color: var(--text-muted); font-size: 0.63rem; margin-top: 0.7rem; letter-spacing: 1px; }
    .empty-cart { text-align: center; color: var(--text-muted); padding: 3rem 0; font-style: italic; }
    .upsell-box { margin-top: 1.5rem; padding: 1rem; border: 1px solid rgba(200,132,26,0.18); background: rgba(200,132,26,0.04); }
    .upsell-label { font-size: 0.62rem; letter-spacing: 2px; text-transform: uppercase; color: var(--amber); margin-bottom: 0.6rem; }
    .upsell-item { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .upsell-name { font-size: 0.8rem; color: var(--parchment); }
    .upsell-btn { background: none; border: 1px solid rgba(200,132,26,0.35); color: var(--amber); padding: 4px 12px; font-size: 0.65rem; letter-spacing: 1px; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s; white-space: nowrap; }
    .upsell-btn:hover { background: var(--amber); color: var(--bark); }

    .fade-section { opacity: 0; transform: translateY(72px) scale(0.96); transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1); }
    .fade-section.visible { opacity: 1; transform: translateY(0) scale(1); }

    .burger { display: none; background: none; border: none; color: var(--amber); font-size: 1.5rem; cursor: pointer; }

    @media (max-width: 768px) {
      /* NAV */
      .nav-links { display: none; }
      .burger { display: block; }

      /* HERO */
      .hero-content { padding: 1.2rem 1rem; }
      .hero-eyebrow { font-size: 0.58rem; letter-spacing: 4px; margin-bottom: 1rem; }
      .hero-title { font-size: clamp(2.8rem, 14vw, 4.5rem); gap: 0 0.1em !important; }
      .hero-subtitle { font-size: 1rem; margin-bottom: 2rem; }
      .hero-cta { padding: 16px 36px; font-size: 0.72rem; letter-spacing: 3px; }
      .hero-scroll-cue { bottom: 1.2rem; }

      /* SECTIONS */
      .section { padding: 3.5rem 1.2rem; }
      .section-title { font-size: clamp(1.7rem, 7vw, 2.4rem); }
      .section-subtitle { font-size: 0.72rem; letter-spacing: 1.5px; margin-bottom: 2.5rem; }

      /* STATS — 2x2 grid */
      .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
      .stat { padding: 1.2rem 0.8rem; }
      .stat:not(:last-child)::after { display: none; }
      .stat-number { font-size: 2.2rem; }
      .stat-label { font-size: 0.6rem; }

      /* PRODUCTS */
      .products-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .product-card { padding: 2rem 1.4rem; }

      /* BENEFITS */
      .benefits-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
      .benefit-card { padding: 1.5rem 1rem; }
      .benefit-icon { font-size: 2rem; }
      .benefit-title { font-size: 0.95rem; }
      .benefit-text { font-size: 0.78rem; }

      /* TESTIMONIALS */
      .testimonials-grid { grid-template-columns: 1fr; }
      .testimonial { padding: 1.5rem; }

      /* GUARANTEE */
      .guarantee-box { padding: 2rem 1.4rem; }
      .guarantee-points { flex-direction: column; align-items: center; gap: 1rem; }

      /* FOOTER */
      .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
      .footer-newsletter { flex-direction: column; }
      .footer-email-input { width: 100%; }
      .footer-email-btn { width: 100%; padding: 12px; }

      /* CART */
      .cart-panel { width: 100vw; max-width: 100vw; }

      /* SOCIAL TOAST */
      .social-toast-mobile { left: 0.8rem !important; right: 0.8rem !important; max-width: calc(100vw - 1.6rem) !important; }

      /* FLOATING CTA */
      .floating-cta-mobile { bottom: 1rem !important; right: 1rem !important; padding: 12px 20px !important; font-size: 0.68rem !important; }

      /* FADE — less intense on mobile */
      .fade-section { transform: translateY(40px) scale(0.98); }

      /* PROCESS */
      .process-grid-mobile { grid-template-columns: 1fr 1fr !important; }
    }

    @media (max-width: 480px) {
      .benefits-grid { grid-template-columns: 1fr; }
      .process-grid-mobile { grid-template-columns: 1fr !important; }
      .stats-row { grid-template-columns: 1fr 1fr; }
      .hero-title { font-size: clamp(2.4rem, 16vw, 3.5rem); }
    }

    /* Disable 3D tilt hover on touch devices */
    @media (hover: none) {
      .product-card { transform: none !important; }
      .benefit-card:hover { transform: translateY(-4px) scale(1) !important; }
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .fade-section { transition: opacity 0.4s ease !important; transform: none !important; }
      .fade-section.visible { transform: none !important; }
      * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
    }

    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer {
      0%   { background-position: 0% 50%;   filter: brightness(1); }
      40%  { background-position: 80% 50%;  filter: brightness(1.12); }
      100% { background-position: 0% 50%;   filter: brightness(1); }
    }
    @keyframes sweepShine { 0% { left: -100%; } 18% { left: 110%; } 100% { left: 110%; } }
    @keyframes breathe {
      0%   { opacity: 1;   transform: scale(1); }
      50%  { opacity: 0.4; transform: scale(0.6); }
      100% { opacity: 1;   transform: scale(1); }
    }
    @keyframes drip {
      0%   { transform: translateY(-40px) scaleX(1);    opacity: 0; }
      6%   { transform: translateY(0px)   scaleX(1);    opacity: 0.8; }
      65%  { transform: translateY(60vh)  scaleX(0.8);  opacity: 0.65; }
      90%  { transform: translateY(92vh)  scaleX(0.65); opacity: 0.3; }
      100% { transform: translateY(115vh) scaleX(0.55); opacity: 0; }
    }
    @keyframes organicGlow {
      0%   { box-shadow: 0 0 10px rgba(200,132,26,0.25), 0 4px 22px rgba(200,132,26,0.18); }
      50%  { box-shadow: 0 0 28px rgba(232,168,50,0.55), 0 8px 42px rgba(200,132,26,0.38); }
      100% { box-shadow: 0 0 10px rgba(200,132,26,0.25), 0 4px 22px rgba(200,132,26,0.18); }
    }
    @keyframes leafDrift {
      0%   { transform: translate(0,0) rotate(0deg); }
      25%  { transform: translate(3px,-4px) rotate(4deg); }
      50%  { transform: translate(-2px,2px) rotate(-3deg); }
      75%  { transform: translate(4px,-1px) rotate(5deg); }
      100% { transform: translate(0,0) rotate(0deg); }
    }
    @keyframes honeyDrizzle {
      0%   { background-position: 0% 0%;   }
      50%  { background-position: 100% 100%; }
      100% { background-position: 0% 0%;   }
    }
    @keyframes popIn {
      0%   { transform: scale(0.92); }
      55%  { transform: scale(1.04); }
      100% { transform: scale(1); }
    }
    @keyframes floatJar {
      0%   { transform: translateY(0px) rotate(0deg); }
      30%  { transform: translateY(-8px) rotate(1deg); }
      60%  { transform: translateY(-14px) rotate(-0.5deg); }
      80%  { transform: translateY(-8px) rotate(1.5deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes honeyRise {
      0%   { clip-path: inset(100% 0 0 0); }
      100% { clip-path: inset(0% 0 0 0); }
    }
    @keyframes honeySurface {
      0%, 100% { rx: 28; opacity: 0.8; }
      50%       { rx: 30; opacity: 1; }
    }
    @keyframes scrollBounce {
      0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.8; }
      50%       { transform: rotate(45deg) translateY(5px); opacity: 0.4; }
    }
    @keyframes timerPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }
    @keyframes loadingPulse {
      0%, 100% { transform: scale(1);    opacity: 1;   }
      50%       { transform: scale(1.08); opacity: 0.85; }
    }
    @keyframes loadingFadeOut {
      to { opacity: 0; pointer-events: none; visibility: hidden; }
    }
    @keyframes loadingBar {
      to { width: 100%; }
    }
    @keyframes sealRotate {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes beeFlight {
      0%   { transform: translateX(-60px)  translateY(0px); opacity: 0; }
      5%   { opacity: 1; }
      25%  { transform: translateX(25vw)   translateY(-60px); }
      50%  { transform: translateX(50vw)   translateY(40px); }
      75%  { transform: translateX(75vw)   translateY(-30px); }
      95%  { opacity: 1; }
      100% { transform: translateX(110vw)  translateY(20px); opacity: 0; }
    }
    @keyframes forestBreath {
      0%   { filter: brightness(1) saturate(1); }
      40%  { filter: brightness(1.04) saturate(1.08); }
      100% { filter: brightness(1) saturate(1); }
    }
    @keyframes iconSpin {
      0%   { transform: scale(1) rotate(0deg); }
      40%  { transform: scale(1.3) rotate(15deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes letterPop {
      0%   { opacity: 0; transform: translateY(-30px) scale(0.4); }
      60%  { opacity: 1; transform: translateY(6px) scale(1.15); }
      80%  { transform: translateY(-3px) scale(0.97); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes counterBounce {
      0%   { transform: scale(1); color: var(--amber); }
      40%  { transform: scale(1.18); color: var(--sage); }
      70%  { transform: scale(0.95); color: var(--amber-glow); }
      100% { transform: scale(1); color: var(--amber); }
    }
    @keyframes greenGlowPulse {
      0%   { box-shadow: 0 0 10px rgba(90,140,74,0.2), 0 4px 22px rgba(200,132,26,0.15); }
      50%  { box-shadow: 0 0 35px rgba(90,140,74,0.45), 0 8px 42px rgba(200,132,26,0.3); }
      100% { box-shadow: 0 0 10px rgba(90,140,74,0.2), 0 4px 22px rgba(200,132,26,0.15); }
    }
  `;

  return (
    <>
      <style>{css}</style>
      {loading ? <LoadingScreen onDone={() => setLoading(false)} /> : <>

      <SocialToast />
      <BeeElement />
      <FloatingCTA showCart={showCart} onScroll={() => scrollTo("productos")} />

      {/* NAV */}
      <nav className="oro-nav">
        <div className="oro-logo" onClick={() => scrollTo("hero")}>DOR<span>EÉ</span></div>
        <ul className="nav-links">
          <li><a onClick={() => scrollTo("productos")}>Colección</a></li>
          <li><a onClick={() => scrollTo("proceso")}>Origen</a></li>
          <li><a onClick={() => scrollTo("beneficios")}>Beneficios</a></li>
          <li><a onClick={() => scrollTo("packs")}>Packs</a></li>
          <li><a onClick={() => scrollTo("testimonios")}>Testimonios</a></li>
        </ul>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button className="cart-btn" onClick={() => setShowCart(true)}>
            Carrito
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 70, left: 0, right: 0, background: "rgba(26,18,10,0.97)", zIndex: 999, padding: "2rem", borderBottom: "1px solid rgba(200,132,26,0.12)" }}>
          {["productos", "proceso", "beneficios", "packs", "testimonios"].map(id => (
            <div key={id} onClick={() => scrollTo(id)} style={{ padding: "0.9rem 0", color: "var(--text-muted)", fontSize: "0.82rem", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", borderBottom: "1px solid rgba(200,132,26,0.06)" }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </div>
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="hero" id="hero">
        <HoneycombBg opacity={0.06} />
        <HeroParticles />
        <div className="hero-content">
          <div className="hero-eyebrow">· Miel Artesanal de Origen ·</div>
          <h1 className="hero-title" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 0.15em", letterSpacing: "0.05em" }}>
            {"DOREÉ".split("").map((ch, i) => (
              <span key={i} style={{
                display: "inline-block",
                opacity: 0,
                background: "linear-gradient(135deg, var(--amber-light) 0%, var(--amber-glow) 30%, var(--amber) 55%, var(--amber-dark) 80%, var(--amber-glow) 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                animation: `letterPop 0.6s ${0.5 + i * 0.08}s cubic-bezier(0.16,1,0.3,1) forwards, shimmer 5s ${1.5 + i * 0.1}s ease-in-out infinite`,
              }}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
          <p className="hero-subtitle">
            La miel más exclusiva, cosechada con la paciencia que la naturaleza exige.
            <br />Un lujo que la tierra creó para ti.
          </p>
          <button className="hero-cta" onClick={() => scrollTo("productos")}>
            Descubrir la Colección
          </button>
        </div>

        {/* Amber drips — fewer on mobile */}
        {[0,1,2,3,4,5,6,7].map((i) => {
          const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
          if (isMobile && i > 4) return null;
          return (
            <div key={`a${i}`} style={{
              position: "absolute",
              width: isMobile ? 12 + (i % 3) * 4 : 18 + (i % 3) * 6,
              height: isMobile ? 18 + (i % 3) * 5 : 26 + (i % 3) * 8,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: `linear-gradient(180deg, ${i % 2 === 0 ? "#F2C96E" : "#E8A832"}, #7A4E10)`,
              left: `${5 + i * 12}%`, top: -30,
              animation: `drip ${8 + i * 1.1}s ${i * 1.6}s infinite cubic-bezier(0.2,0,0.8,1)`,
              opacity: 0.85,
              filter: "drop-shadow(0 0 8px rgba(200,132,26,0.55))",
              zIndex: 1,
            }} />
          );
        })}
        {/* Green / forest drips — fewer on mobile */}
        {[0,1,2,3,4].map((i) => {
          const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
          if (isMobile && i > 2) return null;
          return (
            <div key={`g${i}`} style={{
              position: "absolute",
              width: isMobile ? 10 + i * 3 : 14 + i * 4,
              height: isMobile ? 14 + i * 4 : 20 + i * 5,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: `linear-gradient(180deg, #8FAF7E, #2D3F28)`,
              left: `${10 + i * 18}%`, top: -30,
              animation: `drip ${10 + i * 1.3}s ${3 + i * 2}s infinite cubic-bezier(0.2,0,0.8,1)`,
              opacity: 0.7,
              filter: "drop-shadow(0 0 6px rgba(90,140,74,0.45))",
              zIndex: 1,
            }} />
          );
        })}

        <div className="hero-scroll-cue">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* URGENCY BAR */}
      <div className="urgency-bar">
        <span>🌿 Oferta exclusiva termina en</span>
        <span className={`urgency-timer${urgentPulse ? " pulse" : ""}`}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
        <span>— Envío gratis en pedidos +${FREE_SHIPPING_THRESHOLD}</span>
      </div>

      <WaveDivider color="#221810" />

      {/* STATS */}
      <FadeSection>
        <div className="stats-row" style={{ background: "var(--bark-soft)", borderBottom: "1px solid var(--bark-border)", borderTop: "1px solid var(--bark-border)" }}>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={12847} suffix="+" /></div>
            <div className="stat-label">Clientes Felices</div>
          </div>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={98} suffix="%" /></div>
            <div className="stat-label">Tasa de Recompra</div>
          </div>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={49} prefix="" suffix="" /><span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "var(--amber)" }}>/5</span></div>
            <div className="stat-label">Valoración Media</div>
          </div>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={15} /></div>
            <div className="stat-label">Años de Tradición</div>
          </div>
        </div>
      </FadeSection>

      <WaveDivider flip color="var(--bark-soft)" />

      {/* PRODUCTS */}
      <section className="section" id="productos" style={{ background: "var(--bark)" }}>
        <FadeSection>
          <h2 className="section-title">Nuestra <em>Colección</em></h2>
          <p className="section-subtitle">Tres expresiones únicas de la naturaleza en su forma más pura</p>
        </FadeSection>
        <div className="products-grid">
          {PRODUCTS.map((p, i) => (
            <FadeSection key={p.id} delay={i * 0.13}>
              <ProductCard product={p} onAdd={addToCart} />
            </FadeSection>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <div id="proceso">
        <WaveDivider color="#1C1E10" />
        <ProcessSection />
        <WaveDivider flip color="var(--bark)" />
      </div>

      {/* BENEFITS */}
      <section className="section section-dark" id="beneficios" style={{ position: "relative" }}>
        <HoneycombBg opacity={0.04} />
        <FadeSection>
          <h2 className="section-title">¿Por qué <em>Doreé</em>?</h2>
          <p className="section-subtitle">Lo que nos hace diferentes no es lo que hacemos, es lo que nunca haríamos</p>
        </FadeSection>
        <FadeSection>
          <div className="benefits-grid">
            {[
              { icon: "🐝", title: "100% Pura", text: "Sin aditivos, sin mezclas, sin pasteurización excesiva. Directa del panal a tu mesa." },
              { icon: "🌿", title: "Origen Verificado", text: "Cada frasco tiene trazabilidad completa. Sabes exactamente de dónde viene tu miel." },
              { icon: "🏔️", title: "Cosecha Selectiva", text: "Solo recolectamos en el momento óptimo de maduración para garantizar el mejor perfil aromático." },
              { icon: "♻️", title: "Sustentable", text: "Apicultura regenerativa que protege a las abejas y los ecosistemas que las rodean." },
            ].map((b, i) => (
              <div className="benefit-card" key={b.title}>
                <div className="benefit-icon" style={{ animationDelay: `${i * 1.3}s` }}>{b.icon}</div>
                <h4 className="benefit-title">{b.title}</h4>
                <p className="benefit-text">{b.text}</p>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* BUNDLES */}
      <div id="packs">
        <BundleSection onAddBundle={addBundle} />
      </div>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonios" style={{ background: "var(--bark)" }}>
        <FadeSection>
          <h2 className="section-title">Lo que dicen de <em>nosotros</em></h2>
          <p className="section-subtitle">Miles de hogares ya eligieron Doreé</p>
        </FadeSection>
        <FadeSection>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginTop: "0.8rem" }}>
                  <AvatarSVG name={t.name} size={38} />
                  <div>
                    <div className="testimonial-author">{t.name}</div>
                    <div className="testimonial-loc">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* GUARANTEE */}
      <section className="section section-dark" id="garantia">
        <FadeSection>
          <div className="guarantee-box">
            <div style={{ position: "relative", display: "inline-block", marginBottom: "1.5rem" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: "sealRotate 20s linear infinite", opacity: 0.15, position: "absolute", top: -10, left: -10 }}>
                <circle cx="40" cy="40" r="36" fill="none" stroke="var(--amber)" strokeWidth="1" strokeDasharray="4 6" />
              </svg>
              <div style={{ fontSize: "3rem" }}>🛡️</div>
            </div>
            <h3>Garantía <span style={{ color: "var(--amber)" }}>Doreé</span></h3>
            <p style={{ marginBottom: "0.5rem", marginTop: "1rem" }}>
              Si no es la mejor miel que has probado en tu vida, te devolvemos el 100% de tu dinero.
              Sin preguntas. Sin complicaciones. Tienes 30 días para decidir.
            </p>
            <div className="guarantee-points">
              <div className="guarantee-point"><span style={{ color: "var(--amber)" }}>◆</span> Reembolso total</div>
              <div className="guarantee-point"><span style={{ color: "var(--amber)" }}>◆</span> Sin preguntas</div>
              <div className="guarantee-point"><span style={{ color: "var(--amber)" }}>◆</span> 30 días</div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* FINAL CTA */}
      <section className="section" style={{ textAlign: "center", background: "radial-gradient(ellipse at center, rgba(200,132,26,0.1) 0%, var(--bark) 65%)" }}>
        <FadeSection>
          <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🍯</div>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>Tu momento <em>dorado</em> es ahora</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.85, fontSize: "1.05rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
            Cada frasco de Doreé es una promesa de pureza, tradición y excelencia que la naturaleza tardó estaciones enteras en crear.
          </p>
          <button className="hero-cta" onClick={() => scrollTo("productos")} style={{ opacity: 1, animation: "organicGlow 3.5s ease-in-out infinite" }}>
            Comprar Ahora
          </button>
        </FadeSection>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">DOREÉ</div>
            <p className="footer-tagline">Miel artesanal de origen.<br />Hecha con amor por la naturaleza.</p>
            <div className="social-links">
              <span className="social-link" title="Instagram">📷</span>
              <span className="social-link" title="WhatsApp">💬</span>
              <span className="social-link" title="Facebook">📘</span>
            </div>
          </div>
          <div>
            <div className="footer-heading">Navegación</div>
            <ul className="footer-links">
              <li><a onClick={() => scrollTo("productos")}>Colección</a></li>
              <li><a onClick={() => scrollTo("packs")}>Packs y Bundles</a></li>
              <li><a onClick={() => scrollTo("beneficios")}>Beneficios</a></li>
              <li><a onClick={() => scrollTo("testimonios")}>Testimonios</a></li>
              <li><a onClick={() => scrollTo("garantia")}>Garantía</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">Newsletter</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.6, marginBottom: "0.8rem" }}>Recibe descuentos exclusivos y novedades de temporada.</p>
            {emailSent ? (
              <p style={{ color: "var(--fern)", fontSize: "0.78rem" }}>✓ ¡Gracias! Te hemos añadido a la lista.</p>
            ) : (
              <div className="footer-newsletter">
                <input
                  className="footer-email-input"
                  type="email"
                  placeholder="tu@email.com"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                />
                <button
                  className="footer-email-btn"
                  onClick={() => { if (emailInput.includes("@")) setEmailSent(true); }}
                >
                  →
                </button>
              </div>
            )}
            <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              {["🔒 Stripe", "📦 Envío seguro", "↩️ 30 días"].map(b => (
                <span key={b} style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: 0.5 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Doreé. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* CART OVERLAY */}
      <div className={`cart-overlay ${showCart ? "open" : ""}`} onClick={() => setShowCart(false)} />

      {/* CART PANEL */}
      <div className={`cart-panel ${showCart ? "open" : ""}`}>
        <div className="cart-header">
          <span className="cart-title">Tu Carrito</span>
          <button className="cart-close" onClick={() => setShowCart(false)}>×</button>
        </div>

        {/* Free shipping bar */}
        <div className="shipping-bar">
          <div className="shipping-bar-text">
            {toFreeShipping > 0
              ? `🌿 Añade $${toFreeShipping.toFixed(2)} más para envío gratis`
              : "✓ ¡Tienes envío gratis!"}
          </div>
          <div className="shipping-bar-track">
            <div className="shipping-bar-fill" style={{ width: `${freeShippingPct}%` }} />
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">Tu carrito está vacío</div>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div style={{ marginRight: "0.3rem", flexShrink: 0 }}>
                  <HoneyJarSVG size={36} color={item.color} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-qty-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="qty-display">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                </div>
                <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}

            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => alert("Conecta Stripe con: stripe.redirectToCheckout({ lineItems: [...] })")}
            >
              Pagar con Stripe →
            </button>
            <div className="stripe-note">🔒 Pago seguro encriptado con Stripe</div>

            {/* Upsell */}
            {upsellProduct && (
              <div className="upsell-box">
                <div className="upsell-label">También te puede interesar</div>
                <div className="upsell-item">
                  <span className="upsell-name">{upsellProduct.name} – ${upsellProduct.price}</span>
                  <button className="upsell-btn" onClick={() => addToCart(upsellProduct)}>+ Añadir</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </>}
    </>
  );
}

import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  {
    id: "miel-wildflower",
    name: "Flor Silvestre",
    subtitle: "Miel Multifloral Premium",
    price: 24.99,
    oldPrice: 34.99,
    weight: "500g",
    image: "🍯",
    badge: "MÁS VENDIDO",
    stock: 23,
    description: "Cosechada de praderas vírgenes. Notas florales intensas con final aterciopelado.",
    benefits: ["Antioxidante natural", "Sin pasteurizar", "Origen trazable"],
  },
  {
    id: "miel-manuka",
    name: "Reserva del Bosque",
    subtitle: "Miel de Bosque Ancestral",
    price: 39.99,
    oldPrice: 54.99,
    weight: "350g",
    image: "🫙",
    badge: "EDICIÓN LIMITADA",
    stock: 8,
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
    image: "✨",
    badge: "FAVORITO",
    stock: 15,
    description: "De los naranjos en flor. Textura sedosa, dulzura equilibrada y aroma cítrico embriagador.",
    benefits: ["Relajante natural", "Cristalización fina", "Aroma único"],
  },
];

const TESTIMONIALS = [
  { name: "María G.", text: "Jamás probé una miel así. Es como líquido dorado del paraíso.", rating: 5, location: "Madrid" },
  { name: "Carlos R.", text: "Mi familia ya no acepta otra miel. Oro Puro cambió nuestro estándar.", rating: 5, location: "Barcelona" },
  { name: "Ana L.", text: "El packaging es impecable y el sabor... indescriptible. Regalo perfecto.", rating: 5, location: "CDMX" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

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

    // Type A: Pollen (30) — amber, sinusoidal organic upward drift
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.8,
        dx: (Math.random() - 0.5) * 0.25,
        dy: -(Math.random() * 0.25 + 0.15),
        o: Math.random() * 0.4 + 0.3,
        type: "pollen",
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.015 + 0.005,
        angle: 0, angleSpeed: 0,
      });
    }
    // Type B: Dust Motes (15) — pale cream, slow orbital drift
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 2,
        dx: (Math.random() - 0.5) * 0.08,
        dy: (Math.random() - 0.5) * 0.08,
        o: Math.random() * 0.12 + 0.08,
        type: "dust",
        phase: 0, phaseSpeed: 0,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.006,
      });
    }
    // Type C: Forest Spores (5) — sage green, elongated slow diagonal
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 1.5,
        dx: (Math.random() - 0.5) * 0.15,
        dy: -(Math.random() * 0.2 + 0.05),
        o: Math.random() * 0.2 + 0.15,
        type: "spore",
        phase: 0, phaseSpeed: 0,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: Math.random() * 0.008 + 0.003,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        if (p.type === "spore") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.scale(1, 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(107,143,94,${p.o})`;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.type === "dust"
            ? `rgba(240,222,180,${p.o})`
            : `rgba(200,132,26,${p.o})`;
          ctx.fill();
        }

        if (p.type === "pollen") {
          p.phase += p.phaseSpeed;
          p.x += p.dx + Math.sin(p.phase) * 0.4;
          p.y += p.dy;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; p.phase = Math.random() * Math.PI * 2; }
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        } else if (p.type === "dust") {
          p.angle += p.angleSpeed;
          p.x += Math.cos(p.angle) * 0.2 + p.dx;
          p.y += Math.sin(p.angle) * 0.15 + p.dy;
          if (p.x < -20) p.x = canvas.width + 20;
          if (p.x > canvas.width + 20) p.x = -20;
          if (p.y < -20) p.y = canvas.height + 20;
          if (p.y > canvas.height + 20) p.y = -20;
        } else {
          p.angle += p.angleSpeed;
          p.x += p.dx;
          p.y += p.dy;
          if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />;
}

function HoneycombBg() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hc" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
          <path d="M28 66L0 50V16L28 0L56 16V50L28 66ZM28 100L0 84V50L28 34L56 50V84L28 100Z" fill="none" stroke="#C8841A" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hc)" />
    </svg>
  );
}

function GoldDrip() {
  return (
    <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, marginTop: -1 }}>
      <svg viewBox="0 0 1440 60" style={{ width: "100%", display: "block" }}>
        <path d="M0,0 Q60,55 120,20 Q180,55 240,15 Q300,50 360,20 Q420,55 480,10 Q540,50 600,25 Q660,55 720,15 Q780,50 840,20 Q900,55 960,10 Q1020,50 1080,25 Q1140,55 1200,15 Q1260,50 1320,20 Q1380,55 1440,10 L1440,0 Z"
          fill="#1A120A" />
      </svg>
    </div>
  );
}

function FadeSection({ children, className = "", style = {} }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} className={`fade-section ${visible ? "visible" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function OroPuro() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [urgency, setUrgency] = useState(15 * 60);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 200); }, []);

  useEffect(() => {
    const t = setInterval(() => setUrgency((u) => (u > 0 ? u - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(urgency / 60);
  const secs = urgency % 60;

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const cartTotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --amber:        #C8841A;
      --amber-light:  #F2C96E;
      --amber-pale:   #F5D78E;
      --amber-dark:   #7A4E10;
      --amber-glow:   #E8A832;
      --bark:         #1A120A;
      --bark-soft:    #221810;
      --bark-card:    #2A1E12;
      --bark-border:  #3D2E1A;
      --parchment:    #F0DEB4;
      --ivory:        #F8F0E0;
      --text-muted:   #9E8060;
      --moss:         #4A6741;
      --fern:         #6B8F5E;
      --sage:         #8FAF7E;
      --forest-dark:  #2D3F28;
      --stock-red:    #B8432A;
    }

    html { scroll-behavior: smooth; }
    body { background: var(--bark); color: var(--ivory); font-family: 'Montserrat', sans-serif; overflow-x: hidden; }

    .oro-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(26,18,10,0.88); backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(200,132,26,0.12);
      padding: 0 2rem; height: 70px;
      display: flex; align-items: center; justify-content: space-between;
      transition: all 0.3s;
    }
    .oro-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; letter-spacing: 3px; color: var(--amber); cursor: pointer; }
    .oro-logo span { color: var(--ivory); font-weight: 400; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; transition: color 0.3s; font-weight: 500; cursor: pointer; }
    .nav-links a:hover { color: var(--amber); }
    .cart-btn { position: relative; background: none; border: 1px solid rgba(200,132,26,0.35); color: var(--amber); padding: 8px 18px; cursor: pointer; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; font-family: 'Montserrat', sans-serif; transition: all 0.3s; border-radius: 0; }
    .cart-btn:hover { background: var(--amber); color: var(--bark); }
    .cart-badge { position: absolute; top: -8px; right: -8px; background: var(--amber); color: var(--bark); width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; }

    .hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; text-align: center;
      background:
        radial-gradient(ellipse at 50% 85%, rgba(200,132,26,0.12) 0%, transparent 55%),
        radial-gradient(ellipse at 15% 25%, rgba(74,103,65,0.06) 0%, transparent 45%),
        radial-gradient(ellipse at 85% 15%, rgba(232,168,50,0.05) 0%, transparent 40%),
        var(--bark);
    }
    .hero::after {
      content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1;
      background: linear-gradient(135deg, transparent 0%, rgba(200,132,26,0.025) 35%, rgba(232,168,50,0.04) 50%, rgba(200,132,26,0.025) 65%, transparent 100%);
      background-size: 400% 400%;
      animation: honeyDrizzle 12s ease-in-out infinite;
    }
    .hero-content { position: relative; z-index: 3; padding: 2rem; max-width: 900px; }
    .hero-eyebrow {
      font-size: 0.7rem; letter-spacing: 6px; text-transform: uppercase; color: var(--amber-light);
      margin-bottom: 1.5rem; font-weight: 500;
      opacity: 0; transform: translateY(20px);
      animation: fadeUp 0.8s 0.5s forwards;
    }
    .hero-title {
      font-family: 'Playfair Display', serif; font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 900; line-height: 1; margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--amber-light) 0%, var(--amber-glow) 25%, var(--amber) 50%, var(--amber-dark) 75%, var(--amber-glow) 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: fadeUp 0.8s 0.7s forwards, shimmer 4s ease-in-out infinite;
      opacity: 0; transform: translateY(30px);
    }
    .hero-subtitle {
      font-family: 'Cormorant Garamond', serif; font-size: clamp(1.1rem, 2.5vw, 1.6rem);
      color: var(--parchment); font-weight: 300; font-style: italic; margin-bottom: 2.5rem;
      opacity: 0; transform: translateY(20px);
      animation: fadeUp 0.8s 0.9s forwards;
    }
    .hero-cta {
      display: inline-block; padding: 18px 48px; background: var(--amber);
      color: var(--bark); font-size: 0.8rem; letter-spacing: 4px; text-transform: uppercase;
      font-weight: 700; cursor: pointer; border: none; text-decoration: none;
      font-family: 'Montserrat', sans-serif; position: relative; overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      opacity: 0; animation: fadeUp 0.8s 1.1s forwards, organicGlow 3.5s 2s ease-in-out infinite;
    }
    .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 45px rgba(200,132,26,0.4); }
    .hero-cta::after {
      content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      animation: sweepShine 3s 2s infinite;
    }

    .urgency-bar {
      background: linear-gradient(90deg, rgba(200,132,26,0.08), rgba(200,132,26,0.18), rgba(200,132,26,0.08));
      padding: 12px; text-align: center; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase;
      color: var(--amber-light); border-top: 1px solid rgba(200,132,26,0.18); border-bottom: 1px solid rgba(200,132,26,0.18);
    }
    .urgency-bar strong { font-weight: 700; font-size: 0.85rem; }

    .section { padding: 6rem 2rem; position: relative; }
    .section-dark { background: var(--bark-soft); }
    .section-title {
      font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem);
      text-align: center; margin-bottom: 0.8rem; color: var(--ivory);
    }
    .section-title em { color: var(--amber); font-style: italic; }
    .section-subtitle {
      text-align: center; color: var(--text-muted); font-size: 0.85rem;
      letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4rem;
    }

    .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto; }
    .product-card {
      background: var(--bark-card); border: 1px solid var(--bark-border);
      padding: 2.5rem 2rem; position: relative; overflow: hidden;
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .product-card:hover {
      border-color: rgba(200,132,26,0.35);
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(15,8,0,0.6), 0 0 50px rgba(200,132,26,0.08);
    }
    .product-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--amber-glow), var(--amber), transparent);
      opacity: 0; transition: opacity 0.5s;
    }
    .product-card:hover::before { opacity: 1; }
    .product-badge {
      display: inline-block; background: var(--amber); color: var(--bark);
      padding: 4px 12px; font-size: 0.6rem; letter-spacing: 2px; font-weight: 700;
      margin-bottom: 1.5rem;
    }
    .product-emoji { font-size: 4rem; display: block; margin-bottom: 1.5rem; filter: saturate(1.2); }
    .product-name { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 0.3rem; }
    .product-sub { color: var(--text-muted); font-size: 0.75rem; letter-spacing: 1px; margin-bottom: 1rem; }
    .product-desc { color: var(--parchment); font-size: 1rem; line-height: 1.7; margin-bottom: 1.2rem; font-family: 'Cormorant Garamond', serif; opacity: 0.85; }
    .product-benefits { list-style: none; margin-bottom: 1.5rem; }
    .product-benefits li {
      color: var(--text-muted); font-size: 0.75rem; padding: 4px 0; padding-left: 16px;
      position: relative; letter-spacing: 0.5px;
    }
    .product-benefits li::before { content: '◆'; color: var(--amber); position: absolute; left: 0; font-size: 0.5rem; top: 6px; }
    .product-pricing { display: flex; align-items: baseline; gap: 10px; margin-bottom: 0.5rem; }
    .product-price { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--amber); }
    .product-old-price { color: #6B5540; font-size: 0.9rem; text-decoration: line-through; }
    .product-weight { color: var(--text-muted); font-size: 0.7rem; letter-spacing: 1px; margin-bottom: 1rem; }
    .product-stock { font-size: 0.7rem; color: var(--stock-red); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 6px; }
    .stock-dot { width: 6px; height: 6px; background: var(--stock-red); border-radius: 50%; display: inline-block; animation: breathe 2.4s ease-in-out infinite; }
    .buy-btn {
      width: 100%; padding: 14px; background: transparent; border: 1px solid var(--amber);
      color: var(--amber); font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase;
      cursor: pointer; font-family: 'Montserrat', sans-serif; font-weight: 600;
      transition: all 0.3s; position: relative; overflow: hidden;
    }
    .buy-btn:hover { background: var(--amber); color: var(--bark); }
    .buy-btn:active { transform: scale(0.98); }

    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto; }
    .benefit-item { text-align: center; padding: 2rem; }
    .benefit-icon { font-size: 2.5rem; margin-bottom: 1rem; display: inline-block; animation: leafDrift 6s ease-in-out infinite; }
    .benefit-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--amber); }
    .benefit-text { color: var(--text-muted); font-size: 0.85rem; line-height: 1.6; }

    .stats-row { display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap; padding: 4rem 2rem; }
    .stat { text-align: center; }
    .stat-number { font-family: 'Playfair Display', serif; font-size: 3rem; color: var(--amber); }
    .stat-label { color: var(--text-muted); font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 0.3rem; }

    .testimonials { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .testimonial {
      background: var(--bark-card); border: 1px solid var(--bark-border); padding: 2rem;
      position: relative; transition: all 0.4s;
    }
    .testimonial:hover { animation: textureRipple 1.8s ease-in-out; }
    .testimonial::before { content: '"'; font-family: 'Playfair Display', serif; font-size: 4rem; color: rgba(200,132,26,0.18); position: absolute; top: 10px; left: 15px; line-height: 1; }
    .testimonial-text { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: var(--parchment); line-height: 1.7; margin-bottom: 1rem; position: relative; z-index: 1; font-style: italic; opacity: 0.9; }
    .testimonial-author { font-size: 0.75rem; letter-spacing: 1px; color: var(--amber-light); font-weight: 600; }
    .testimonial-loc { font-size: 0.7rem; color: var(--text-muted); }
    .testimonial-stars { color: var(--amber-glow); font-size: 0.8rem; margin-bottom: 0.8rem; letter-spacing: 2px; }

    .guarantee {
      max-width: 700px; margin: 0 auto; text-align: center;
      border: 1px solid rgba(200,132,26,0.25); padding: 3rem;
      background: radial-gradient(ellipse at center, rgba(200,132,26,0.05) 0%, transparent 70%);
    }
    .guarantee h3 { font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1rem; }
    .guarantee p { color: var(--text-muted); line-height: 1.8; font-size: 0.9rem; }

    .footer {
      padding: 3rem 2rem; text-align: center;
      border-top: 1px solid rgba(200,132,26,0.12);
      color: var(--text-muted); font-size: 0.75rem;
    }
    .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--amber); letter-spacing: 3px; margin-bottom: 1rem; }

    .cart-panel {
      position: fixed; top: 0; right: 0; width: 380px; max-width: 90vw; height: 100vh;
      background: var(--bark-soft); border-left: 1px solid rgba(200,132,26,0.18);
      z-index: 2000; padding: 2rem; overflow-y: auto;
      transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .cart-panel.open { transform: translateX(0); }
    .cart-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 1999;
      opacity: 0; pointer-events: none; transition: opacity 0.3s;
    }
    .cart-overlay.open { opacity: 1; pointer-events: all; }
    .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--bark-border); padding-bottom: 1rem; }
    .cart-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; }
    .cart-close { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.5rem; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--bark-border); }
    .cart-item-name { font-size: 0.85rem; font-weight: 500; }
    .cart-item-price { color: var(--amber); font-family: 'Playfair Display', serif; }
    .cart-item-qty { color: var(--text-muted); font-size: 0.75rem; }
    .cart-item-remove { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase; transition: color 0.3s; }
    .cart-item-remove:hover { color: var(--stock-red); }
    .cart-total { display: flex; justify-content: space-between; padding: 1.5rem 0; font-size: 1rem; }
    .cart-total-label { letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; color: var(--text-muted); }
    .cart-total-amount { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--amber); }
    .checkout-btn {
      width: 100%; padding: 16px; background: var(--amber); color: var(--bark);
      border: none; font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase;
      font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif;
      margin-top: 1rem; transition: all 0.3s;
    }
    .checkout-btn:hover { box-shadow: 0 8px 30px rgba(200,132,26,0.4); animation: organicGlow 2.5s ease-in-out infinite; }
    .stripe-note { text-align: center; color: var(--text-muted); font-size: 0.65rem; margin-top: 0.8rem; letter-spacing: 1px; }
    .empty-cart { text-align: center; color: var(--text-muted); padding: 3rem 0; font-style: italic; }

    .fade-section { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
    .fade-section.visible { opacity: 1; transform: translateY(0); }

    .burger { display: none; background: none; border: none; color: var(--amber); font-size: 1.5rem; cursor: pointer; }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .burger { display: block; }
      .hero-content { padding: 1rem; }
      .section { padding: 4rem 1.2rem; }
      .stats-row { gap: 2rem; }
      .products-grid { grid-template-columns: 1fr; }
    }

    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer {
      0%   { background-position: 0%   50%; filter: brightness(1); }
      30%  { background-position: 60%  50%; filter: brightness(1.1); }
      50%  { background-position: 100% 50%; filter: brightness(1.05); }
      100% { background-position: 0%   50%; filter: brightness(1); }
    }
    @keyframes sweepShine { 0% { left: -100%; } 20% { left: 100%; } 100% { left: 100%; } }
    @keyframes sway {
      0%   { transform: translateY(0px)    rotate(0deg); }
      20%  { transform: translateY(-4px)   rotate(1.5deg); }
      50%  { transform: translateY(-9px)   rotate(-1deg); }
      80%  { transform: translateY(-4px)   rotate(2deg); }
      100% { transform: translateY(0px)    rotate(0deg); }
    }
    @keyframes breathe {
      0%   { opacity: 1;   transform: scale(1); }
      35%  { opacity: 0.5; transform: scale(0.7); }
      65%  { opacity: 0.3; transform: scale(0.55); }
      100% { opacity: 1;   transform: scale(1); }
    }
    @keyframes drip {
      0%   { transform: translateY(-30px) scaleX(1);    opacity: 0; }
      8%   { transform: translateY(0px)   scaleX(1);    opacity: 0.7; }
      60%  { transform: translateY(55vh)  scaleX(0.85); opacity: 0.6; }
      85%  { transform: translateY(88vh)  scaleX(0.7);  opacity: 0.3; }
      100% { transform: translateY(110vh) scaleX(0.6);  opacity: 0; }
    }
    @keyframes organicGlow {
      0%   { box-shadow: 0 0 8px  rgba(200,132,26,0.2),  0 4px  20px rgba(200,132,26,0.15); }
      50%  { box-shadow: 0 0 22px rgba(232,168,50,0.5),   0 8px  38px rgba(200,132,26,0.35); }
      100% { box-shadow: 0 0 8px  rgba(200,132,26,0.2),  0 4px  20px rgba(200,132,26,0.15); }
    }
    @keyframes leafDrift {
      0%   { transform: translate(0, 0)      rotate(0deg);  }
      25%  { transform: translate(3px, -3px) rotate(4deg);  }
      50%  { transform: translate(-2px, 2px) rotate(-3deg); }
      75%  { transform: translate(4px, -1px) rotate(5deg);  }
      100% { transform: translate(0, 0)      rotate(0deg);  }
    }
    @keyframes honeyDrizzle {
      0%   { background-position: 0%   0%;   opacity: 0.6; }
      33%  { background-position: 100% 50%;  opacity: 1;   }
      66%  { background-position: 50%  100%; opacity: 0.7; }
      100% { background-position: 0%   0%;   opacity: 0.6; }
    }
    @keyframes textureRipple {
      0%   { box-shadow: 0 0 0px  rgba(200,132,26,0);    border-color: var(--bark-border); }
      50%  { box-shadow: 0 0 25px rgba(200,132,26,0.12); border-color: rgba(200,132,26,0.3); }
      100% { box-shadow: 0 0 0px  rgba(200,132,26,0);    border-color: var(--bark-border); }
    }
  `;

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="oro-nav">
        <div className="oro-logo" onClick={() => scrollTo("hero")}>
          ORO <span>PURO</span>
        </div>
        <ul className="nav-links">
          <li><a onClick={() => scrollTo("productos")}>Colección</a></li>
          <li><a onClick={() => scrollTo("beneficios")}>Beneficios</a></li>
          <li><a onClick={() => scrollTo("testimonios")}>Testimonios</a></li>
          <li><a onClick={() => scrollTo("garantia")}>Garantía</a></li>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <a onClick={() => scrollTo("productos")} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Colección</a>
            <a onClick={() => scrollTo("beneficios")} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Beneficios</a>
            <a onClick={() => scrollTo("testimonios")} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Testimonios</a>
            <a onClick={() => scrollTo("garantia")} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Garantía</a>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero" id="hero">
        <HoneycombBg />
        <HeroParticles />
        <div className="hero-content">
          <div className="hero-eyebrow">· Miel Artesanal de Origen ·</div>
          <h1 className="hero-title">Oro Puro</h1>
          <p className="hero-subtitle">
            La miel más exclusiva, cosechada con la paciencia que la naturaleza exige.
            <br />Un lujo que la tierra creó para ti.
          </p>
          <button className="hero-cta" onClick={() => scrollTo("productos")}>
            Descubrir la Colección
          </button>
        </div>
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: 8, height: 12, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: "linear-gradient(180deg, var(--amber-light), var(--amber-dark))",
            left: `${8 + i * 14}%`, top: -20,
            animation: `drip ${5 + i * 1.2}s ${i * 1.8}s infinite cubic-bezier(0.2,0,0.8,1)`,
            opacity: 0.7,
          }} />
        ))}
      </section>

      {/* URGENCY BAR */}
      <div className="urgency-bar">
        🌿 Oferta exclusiva termina en <strong>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</strong> — Envío gratis en pedidos +$50
      </div>

      <GoldDrip />

      {/* STATS */}
      <FadeSection>
        <div className="stats-row" style={{ borderBottom: "1px solid var(--bark-border)" }}>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={12847} suffix="+" /></div>
            <div className="stat-label">Clientes Satisfechos</div>
          </div>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={98} suffix="%" /></div>
            <div className="stat-label">Recompra</div>
          </div>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={4} suffix=".9" /></div>
            <div className="stat-label">Valoración Media</div>
          </div>
          <div className="stat">
            <div className="stat-number"><AnimatedCounter end={15} /></div>
            <div className="stat-label">Años de Tradición</div>
          </div>
        </div>
      </FadeSection>

      {/* PRODUCTS */}
      <section className="section" id="productos">
        <FadeSection>
          <h2 className="section-title">Nuestra <em>Colección</em></h2>
          <p className="section-subtitle">Tres expresiones únicas de la naturaleza en su forma más pura</p>
        </FadeSection>
        <div className="products-grid">
          {PRODUCTS.map((p, i) => (
            <FadeSection key={p.id} style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="product-card">
                <div className="product-badge">{p.badge}</div>
                <span className="product-emoji" style={{ animation: `sway ${3.5 + i * 0.7}s ease-in-out infinite` }}>{p.image}</span>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-sub">{p.subtitle} · {p.weight}</div>
                <p className="product-desc">{p.description}</p>
                <ul className="product-benefits">
                  {p.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <div className="product-pricing">
                  <span className="product-price">${p.price}</span>
                  <span className="product-old-price">${p.oldPrice}</span>
                  <span style={{ background: "rgba(200,132,26,0.18)", color: "var(--amber)", padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: 1 }}>
                    -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                  </span>
                </div>
                <div className="product-stock">
                  <span className="stock-dot" />
                  Solo quedan {p.stock} unidades
                </div>
                <button className="buy-btn" onClick={() => addToCart(p)}>
                  Agregar al Carrito
                </button>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section section-dark" id="beneficios" style={{ position: "relative" }}>
        <HoneycombBg />
        <FadeSection>
          <h2 className="section-title">¿Por qué <em>Oro Puro</em>?</h2>
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
              <div className="benefit-item" key={b.title}>
                <div className="benefit-icon" style={{ animationDelay: `${i * 1.2}s` }}>{b.icon}</div>
                <h4 className="benefit-title">{b.title}</h4>
                <p className="benefit-text">{b.text}</p>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonios">
        <FadeSection>
          <h2 className="section-title">Lo que dicen de <em>nosotros</em></h2>
          <p className="section-subtitle">Miles de hogares ya eligieron Oro Puro</p>
        </FadeSection>
        <FadeSection>
          <div className="testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial" key={i}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">{t.name}</div>
                <div className="testimonial-loc">{t.location}</div>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* GUARANTEE */}
      <section className="section section-dark" id="garantia">
        <FadeSection>
          <div className="guarantee">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛡️</div>
            <h3>Garantía <span style={{ color: "var(--amber)" }}>Oro Puro</span></h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Si no es la mejor miel que has probado en tu vida, te devolvemos el 100% de tu dinero.
              Sin preguntas. Sin complicaciones. Tienes 30 días para decidir.
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--amber-light)", letterSpacing: 2, textTransform: "uppercase" }}>
              Riesgo cero · Satisfacción total
            </p>
          </div>
        </FadeSection>
      </section>

      {/* FINAL CTA */}
      <section className="section" style={{ textAlign: "center", background: "radial-gradient(ellipse at center, rgba(200,132,26,0.08) 0%, var(--bark) 70%)" }}>
        <FadeSection>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>Tu momento <em>dorado</em> es ahora</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: 500, margin: "0 auto 2rem", lineHeight: 1.8, fontSize: "0.9rem" }}>
            Cada frasco de Oro Puro es una promesa de pureza, tradición y excelencia que la naturaleza tardó estaciones enteras en crear.
          </p>
          <button className="hero-cta" onClick={() => scrollTo("productos")} style={{ opacity: 1, animation: "organicGlow 3.5s ease-in-out infinite" }}>
            Comprar Ahora
          </button>
        </FadeSection>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">ORO PURO</div>
        <p style={{ marginBottom: "0.5rem" }}>Miel artesanal de origen · Hecha con amor por la naturaleza</p>
        <p>© 2026 Oro Puro. Todos los derechos reservados.</p>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: 1, color: "var(--text-muted)" }}>Pagos seguros con Stripe</span>
          <span style={{ fontSize: "0.65rem", letterSpacing: 1, color: "var(--text-muted)" }}>Envío asegurado</span>
          <span style={{ fontSize: "0.65rem", letterSpacing: 1, color: "var(--text-muted)" }}>Atención 24/7</span>
        </div>
      </footer>

      {/* CART PANEL */}
      <div className={`cart-overlay ${showCart ? "open" : ""}`} onClick={() => setShowCart(false)} />
      <div className={`cart-panel ${showCart ? "open" : ""}`}>
        <div className="cart-header">
          <span className="cart-title">Tu Carrito</span>
          <button className="cart-close" onClick={() => setShowCart(false)}>×</button>
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart">Tu carrito está vacío</div>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-qty">Cantidad: {item.qty}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => alert("Aquí se conecta Stripe Checkout con tu clave pk_live_... \n\nIntegra stripe.redirectToCheckout() con tus productos.")}>
              Pagar con Stripe →
            </button>
            <div className="stripe-note">🔒 Pago seguro encriptado con Stripe</div>
          </>
        )}
      </div>
    </>
  );
}

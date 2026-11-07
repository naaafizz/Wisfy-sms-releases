"use client";

/* ============================================================
   Animation & effect primitives (react-bits / threeui style)
   — Aurora GLSL background, SplitText, CountUp, SpotlightCard,
   Magnetic button, plus the live-manifest hook.
   MIT-style copy-paste components, adapted for Wisfy.
   ============================================================ */

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import { MANIFEST, fetchLiveManifest, type Manifest } from "../lib/data";

/* ---------------------------------------------------------- Aurora */

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform float uAmp;
uniform vec3 uColorBase;
uniform vec3 uColorGreen;
uniform vec3 uColorAmber;
uniform vec3 uColorDeep;

/* Ashima 2D simplex noise */
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.yx,x12.yx)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p);
    amp *= 0.5;
    p *= 2.0;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 st = uv * uRes / min(uRes.x, uRes.y);

  float t = uTime * 0.05;
  float n1 = fbm(st * vec2(1.3, 1.9) + vec2(t, -t * 0.6));
  float n2 = fbm(st * vec2(2.4, 1.2) - vec2(t * 0.7, t * 0.4));

  float wave = n1 + n2 * 0.5 + 0.5;              /* 0..~1.5 */
  float curtain = smoothstep(0.35, 1.05, wave);   /* aurora curtains */
  float glow = smoothstep(0.1, 0.8, n2 + 0.5) * 0.6;

  vec3 col = uColorBase;
  col = mix(col, uColorGreen, curtain * uAmp);
  col = mix(col, uColorDeep, smoothstep(0.55, 1.0, curtain) * 0.35 * uAmp);
  col = mix(col, uColorAmber, glow * 0.22 * uAmp);

  /* fade edges so it melts into the ivory page */
  float edgeX = smoothstep(0.0, 0.16, uv.x) * smoothstep(0.0, 0.16, 1.0 - uv.x);
  float edgeY = smoothstep(0.0, 0.12, uv.y);
  col = mix(uColorBase, col, edgeX * edgeY);

  gl_FragColor = vec4(col, 1.0);
}`;

type AuroraProps = { className?: string; amplitude?: number };

export function Aurora({ className = "", amplitude = 0.4 }: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), canvas, alpha: false });
    const gl = renderer.gl;
    gl.clearColor(0.97, 0.965, 0.94, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [gl.canvas.width, gl.canvas.height] },
        uAmp: { value: amplitude },
        uColorBase: { value: new Color("#f7f6f0") },
        uColorGreen: { value: new Color("#bfe0a4") },
        uColorAmber: { value: new Color("#efdcae") },
        uColorDeep: { value: new Color("#8fbf70") },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      (program.uniforms as any).uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      const time = (now - start) / 1000;
      const u = program.uniforms as any;
      u.uTime.value = time;
      const boost = (Math.abs(mouse.current.x) + Math.abs(mouse.current.y)) * 0.15;
      u.uAmp.value = amplitude + boost;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(render);

    if (reduced) {
      cancelAnimationFrame(raf);
      uTimeOnce(program);
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("pointermove", onMove);

    function uTimeOnce(prog: typeof program) {
      const u = prog.uniforms as any;
      u.uTime.value = 40;
      renderer.render({ scene: mesh });
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude]);

  return <canvas ref={canvasRef} className={`aurora-canvas ${className}`} aria-hidden="true" />;
}

/* ---------------------------------------------------------- SplitText */

type SplitTextProps = {
  text: ReactNode;
  className?: string;
  italicWords?: string[];
  delay?: number;
};

export function SplitText({ text, className = "", italicWords = [], delay = 0 }: SplitTextProps) {
  const words = typeof text === "string" ? text.split(" ") : [];
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.035, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: "115%", rotate: 3, opacity: 0 },
    show: {
      y: "0%",
      rotate: 0,
      opacity: 1,
      transition: { type: "spring", damping: 16, stiffness: 120 },
    },
  };
  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      aria-label={typeof text === "string" ? text : undefined}
      style={{ display: "inline-block" }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            paddingBottom: "0.08em",
            marginBottom: "-0.08em",
          }}
        >
          <motion.span
            variants={word}
            style={{ display: "inline-block", transformOrigin: "0 100%", willChange: "transform" }}
          >
            {italicWords.includes(w) ? <em className="accent-italic">{w}</em> : w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ---------------------------------------------------------- CountUp */

type CountUpProps = {
  to: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
};

export function CountUp({ to, decimals = 0, duration = 1400, prefix = "", suffix = "" }: CountUpProps) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------- SpotlightCard */

export function SpotlightCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={ref}
      className={`spot ${className}`}
      style={style}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------- Reveal wrapper */

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------- Live manifest */

export function useLiveManifest(): Manifest {
  const [m, setM] = useState<Manifest>(MANIFEST);
  useEffect(() => {
    let alive = true;
    let timeout: ReturnType<typeof setTimeout>;
    let checking = false;

    const check = async () => {
      if (checking) return;
      checking = true;
      try {
        const live = await fetchLiveManifest();
        if (alive && live) {
          setM((current) => live.versionCode >= current.versionCode ? live : current);
        }
      } finally {
        checking = false;
        if (alive) timeout = setTimeout(check, 60_000);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timeout);
        void check();
      }
    };

    void check();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      alive = false;
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
  return m;
}

/* ---------------------------------------------------------- Scroll helpers */

export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function usePastHero(offset = 560) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return past;
}

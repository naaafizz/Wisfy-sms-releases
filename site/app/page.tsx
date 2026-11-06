"use client";

import { Aurora, SplitText, CountUp, SpotlightCard, Reveal, useLiveManifest, useScrolled, usePastHero } from "../components/fx";
import { IMG, RELEASES, ROLLING_APK, NOTES, type Manifest } from "../lib/data";

/* ---------------- shared bits ---------------- */

const DL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
  </svg>
);

const BRAND_ICON = (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 8.5C4 6 7.6 4 12 4s8 2 8 4.5v7C20 18 16.4 20 12 20s-8-2-8-4.5v-7Z" stroke="#fff" strokeWidth="1.7" />
    <path d="M8.5 12.5h7" stroke="#7cb850" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M9.5 9.3h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
  </svg>
);

function Brand({ home = false }: { home?: boolean }) {
  return (
    <a className="brand" href={home ? "#top" : "#top"}>
      <span className="brand-badge">
        <img src={IMG("Logo.svg")} alt="" />
      </span>
      <span>
        Wisfy SMS<small>Open Source Gateway</small>
      </span>
    </a>
  );
}

/* ---------------- NAV ---------------- */

function Nav() {
  const scrolled = useScrolled(40);
  const m = useLiveManifest();
  return (
    <div className="nav-shell">
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} id="top">
        <Brand home />
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#releases">Releases</a>
          <a className="btn btn-dark btn-sm" href={m.downloadUrl} download>
            {DL_ICON} Download
          </a>
        </div>
      </nav>
    </div>
  );
}

/* ---------------- STICKY BAR ---------------- */

function StickyBar() {
  const past = usePastHero(520);
  const m = useLiveManifest();
  return (
    <div className="sticky-bar">
      <div className={`sticky-inner ${past ? "sticky-show" : "sticky-hide"}`}>
        <span className="s-ver">
          Latest build <b>{m.versionName}</b> · {m.versionCode ? `code ${m.versionCode}` : ""}
        </span>
        <a className="btn btn-green btn-sm" href={m.downloadUrl} download>
          {DL_ICON} Download APK
        </a>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero({ m }: { m: Manifest }) {
  const apkSize = "32.8 MB";
  return (
    <header className="hero">
      <Aurora amplitude={0.45} />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Reveal y={16}>
            <span className="eyebrow">
              <span className="dot" />
              Live OTA channel · {m.versionName} · No backend needed
            </span>
          </Reveal>

          <h1>
            <SplitText text="Payment SMS, straight to your webhook." italicWords={["webhook."]} />
          </h1>

          <p className="lede">
            Wisfy SMS watches your merchant phone for bKash, Nagad, Rocket &amp; Upay messages — then
            instantly POSTs clean, deduplicated payment events to any URL you own. No servers. No
            accounts. No fees.
          </p>

          <div className="hero-cta">
            <a className="btn btn-dark btn-lg" href={m.downloadUrl} download>
              {DL_ICON} Download APK · {apkSize}
            </a>
            <a className="btn btn-ghost btn-lg" href="#releases">
              All releases
            </a>
          </div>

          <div className="hero-status">
            <span className="s-dot" />
            Direct download · the same feed your in-app updater reads
          </div>

          <div className="stat-grid">
            <Reveal delay={0.05}>
              <div className="stat">
                <b>{m.versionName}</b>
                <span>Version</span>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="stat">
                <b><CountUp to={m.versionCode} /></b>
                <span>Version code</span>
              </div>
            </Reveal>
            <Reveal delay={0.19}>
              <div className="stat">
                <b>32.8 MB</b>
                <span>APK size</span>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="stat">
                <b>MIT</b>
                <span>Open source</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* phone stage */}
        <div className="hero-stage">
          <div className="float-chip chip-a">
            <span className="chip-ico" style={{ background: "var(--green-soft)", color: "var(--green-ink)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <span>Delivered · 200 OK<small>Latency 120 ms</small></span>
          </div>
          <div className="float-chip chip-b">
            <span className="chip-ico" style={{ background: "var(--amber-soft)", color: "var(--amber-ink)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
            </span>
            <span>OTP filtered<small>2FA codes never forwarded</small></span>
          </div>
          <div className="float-chip chip-c">
            <span className="chip-ico" style={{ background: "#f1e9e4", color: "#7a4b32" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 8h18" /><path d="M7 15h4" /></svg>
            </span>
            <span>event_id reused<small>Idempotent retries</small></span>
          </div>

          <div className="phone">
            <div className="phone-screen">
              <div className="phone-notch" />
              <div className="phone-title">Live Events</div>
              <div className="phone-sub">Pipeline · Sim 1 · Active</div>

              <div className="sms-card">
                <div className="sms-row-top">
                  <span className="sms-logo" style={{ background: "#e2136e" }}>bK</span>
                  <span className="sms-sender">bKash</span>
                  <span className="sms-time">18:30</span>
                </div>
                <div className="sms-body">You have received Tk 2,500.00 from 01712******8. Fee Tk 0.00. TrxID 9K8A7L6M2P</div>
                <div className="sms-tags">
                  <span className="tag tag-ok">✓ Parsed · BDT 2,500.00</span>
                  <span className="tag tag-ok">TrxID extracted</span>
                </div>
              </div>

              <div className="sms-card">
                <div className="sms-row-top">
                  <span className="sms-logo" style={{ background: "#f6921e" }}>NG</span>
                  <span className="sms-sender">Nagad</span>
                  <span className="sms-time">18:26</span>
                </div>
                <div className="sms-body">Cash In Tk 1,000.00 successful. Fee Tk 5.00. Balance Tk 12,480.50. TrxID 4H2P8Q1R9T</div>
                <div className="sms-tags">
                  <span className="tag tag-ok">✓ Parsed · BDT 1,000.00</span>
                  <span className="tag tag-warn">Unverified</span>
                </div>
              </div>

              <div className="sms-card" style={{ opacity: 0.85 }}>
                <div className="sms-row-top">
                  <span className="sms-logo" style={{ background: "#8a2482" }}>RK</span>
                  <span className="sms-sender">Rocket</span>
                  <span className="sms-time">18:12</span>
                </div>
                <div className="sms-body">Payment Tk 850.00 received from 01822******4. TrxID 6D1K3N7V5B</div>
                <div className="sms-tags">
                  <span className="tag tag-ok">✓ Webhook 200 OK</span>
                  <span className="tag tag-ok">Dedup clean</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- PROVIDER MARQUEE ---------------- */

function Providers() {
  const logos = [...PROVIDERS_LIST, ...PROVIDERS_LIST];
  return (
    <section className="strip">
      <div className="wrap">
        <Reveal>
          <div className="strip-card">
            <span className="strip-label">Localized for the providers you actually use</span>
            <div className="marquee">
              {logos.map((p, i) => (
                <span className="provider always" key={i}>
                  <img src={p.img} alt={p.name} />
                  <b>{p.name}</b>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */

function Features() {
  return (
    <section className="sec" id="features">
      <div className="wrap">
        <Reveal>
          <span className="sec-kicker">Features</span>
          <h2>
            <SplitText text="The smartest way to automate mobile payments" italicWords={["automate"]} />
          </h2>
          <p className="sec-sub">
            Every payment SMS on your merchant SIM becomes a structured, signed-off event in your
            stack — in under a second.
          </p>
        </Reveal>

        <div className="cards-3">
          <Reveal delay={0.05}>
            <SpotlightCard>
              <div className="feature-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3Z" stroke="#4d9c2c" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M9.5 12.3 11.2 14l3.4-3.8" stroke="#1c1b14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Backend-Free &amp; Local-First</h3>
              <p>No accounts, no cloud, no telemetry. Your queue, logs and configuration live entirely on your own device.</p>
              <span className="f-tag">Zero telemetry</span>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.12}>
            <SpotlightCard>
              <div className="feature-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M13 3 5 13.5h5L9.5 21 19 10h-6l0-7Z" stroke="#1c1b14" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx="18.5" cy="18.5" r="3" stroke="#4d9c2c" strokeWidth="1.8" />
                </svg>
              </div>
              <h3>Instant Payment Parsing</h3>
              <p>Amount, currency, TrxID and provider are auto-extracted from each SMS — marked <b>unverified</b> so your server stays the judge.</p>
              <span className="f-tag">&lt; 1 second</span>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.19}>
            <SpotlightCard>
              <div className="feature-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 12a8 8 0 1 1-2.3-5.6" stroke="#1c1b14" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M20 4v4h-4" stroke="#1c1b14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12.3l2.2 2.2 4-4.5" stroke="#4d9c2c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Two-Layer Dedup &amp; Retries</h3>
              <p>SHA-256 broadcast fingerprints plus <b>provider:trxID</b> keys guarantee zero double-posted payments — with manual retry for transient failures.</p>
              <span className="f-tag">Zero double-posts</span>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function How() {
  const steps = [
    {
      t: "Point Wisfy at any URL",
      d: (
        <>
          Your domain, <code>IP:port</code>, or an ngrok tunnel — any path works. Open{" "}
          <b>Endpoints → Connect Webhook</b> and paste it in.
        </>
      ),
    },
    {
      t: "Pair with the QR & one-time key",
      d: (
        <>
          The app shows a live pairing QR and a rotating <code>whsec_temp_…</code> secret — nothing
          static to leak from your <code>.env</code>.
        </>
      ),
    },
    {
      t: "Test, then go live",
      d: (
        <>
          Tap <b>Test Webhook</b> to fire a synthetic <code>wisfy.test</code> ping, confirm the 200
          OK, and SIM routing makes sure only the merchant SIM is watched.
        </>
      ),
    },
  ];
  return (
    <section className="sec" id="how">
      <div className="wrap">
        <Reveal>
          <span className="sec-kicker">Setup</span>
          <h2><SplitText text="3 steps to connect your store" italicWords={["connect"]} /></h2>
          <p className="sec-sub">From install to live payments in under two minutes.</p>
        </Reveal>
        <div className="steps-3">
          {steps.map((s, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <div className="step">
                <span className="step-num">{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DARK SCHEMA BAND ---------------- */

function Schema() {
  const items = [
    { t: "Signed, structured payloads", d: "Authorization headers + idempotency keys so replay and retries stay safe." },
    { t: "Format-aware parsing", d: "Regex parser tuned for bKash, Nagad, Rocket, Upay & bank alert SMS formats." },
    { t: "Server stays the judge", d: "Amounts arrive flagged unverified — verify against your merchant API." },
  ];
  return (
    <div className="wrap">
      <section className="dark-band">
        <div className="dark-grid">
          <div>
            <Reveal>
              <span className="sec-kicker">Event Schema v1.1</span>
              <h2>What your server receives</h2>
              <p className="sec-sub">One clean HTTPS POST per payment SMS — headers tell the story, the body tells your books.</p>
              <div className="dark-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
                <div>
                  <h4>Payments safety by design</h4>
                  <p>An SMS is never authoritative proof of payment. Sender labels can be spoofed on cellular networks — always verify against your merchant API or reconciliation before fulfilling orders.</p>
                </div>
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal delay={0.1}>
              <div className="code-card">
                <div className="code-head"><i /><i /><i /></div>
                <pre>{`POST /your-any-path  <span class="c-dim">HTTP/1.1</span>
Authorization: Bearer whsec_temp_xxx
X-Wisfy-Event: sms.received
X-Wisfy-Event-Id: evt_l9a4k1_8f93

{
  <span class="c-key">"event_id"</span>:  <span class="c-str">"evt_l9a4k1_8f93"</span>,
  <span class="c-key">"payment_candidate"</span>: {
    <span class="c-key">"provider"</span>:       <span class="c-str">"bkash"</span>,
    <span class="c-key">"amount"</span>:         <span class="c-str">"2500.00"</span>,
    <span class="c-key">"currency"</span>:       <span class="c-str">"BDT"</span>,
    <span class="c-key">"transaction_id"</span>: <span class="c-str">"9K8A7L6M2P"</span>,
    <span class="c-key">"server_verified"</span>: <span class="c-str">false</span>
  },
  <span class="c-key">"deduplication"</span>: { <span class="c-key">"idempotency_key"</span>: <span class="c-str">"bkash:9K8A7L6M2P"</span> }
}`}</pre>
              </div>
              <div className="dark-list" style={{ marginTop: 22 }}>
                {items.map((it, i) => (
                  <div className="dl-item" key={i}>
                    <span className="dl-dot">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </span>
                    <div>
                      <b>{it.t}</b>
                      <span>{it.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- RELEASE NOTES + RELEASES ---------------- */

function Releases({ m }: { m: Manifest }) {
  return (
    <section className="sec" id="releases">
      <div className="wrap">
        <Reveal>
          <span className="sec-kicker">Changelog</span>
          <h2>Every release stays here</h2>
          <p className="sec-sub">
            Versioned APKs are kept permanently. The rolling <b>Wis-sms.apk</b> build always points at
            the newest artifact — pinned at the bottom.
          </p>
        </Reveal>

        {/* release notes */}
        <Reveal delay={0.08}>
          <div className="notes-card" id="notes">
            <div className="notes-head">
              <h3>Release Notes <span className="ver-chip">{m.versionName}</span></h3>
              <a className="btn btn-dark btn-sm" href={m.downloadUrl} download>{DL_ICON} Download APK</a>
            </div>
            <ul className="notes-list">
              {NOTES(m.releaseNotes).map((n, i) => (
                <li key={i}>
                  <span className="check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* all releases — newest first, rolling latest pinned at the bottom */}
        <div className="rel-rows">
          {RELEASES.map((r) => (
            <Reveal key={r.file} y={18}>
              <div className={`rel-row ${r.latest ? "latest-rel" : ""} ${r.rolling ? "rolling" : ""}`}>
                <span className="rel-ico">{DL_ICON}</span>
                <div className="rel-main">
                  <b>
                    {r.file}
                    {r.latest && <span className="rel-badge">Latest</span>}
                    {r.rolling && <span className="rel-badge">Rolling</span>}
                  </b>
                  <div className="rel-sub">{r.sub}</div>
                </div>
                <span className="rel-size">{r.size}</span>
                <a className="rel-dl" href={r.url} download>
                  Download
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* install guide */}
        <div className="mini-guide">
          {[
            { t: "Allow this source", d: "When Android asks, allow installs from your browser for the first launch only." },
            { t: "Keep the same keystore", d: "Updating over an existing install always preserves your configured endpoints and keys." },
            { t: "Updates happen in-app", d: "Next release arrives via Settings → Software & In-App Updates, no reinstall needed." },
          ].map((g, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <div className="mini">
                <span className="mini-num">{i + 1}</span>
                <b>{g.t}</b>
                <span>{g.d}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA (sobar niche) ---------------- */

function FinalCta() {
  return (
    <section className="final">
      <div className="wrap">
        <Reveal>
          <div className="final-card">
            <div className="final-inner">
              <img className="final-logo" src={IMG("Logo.svg")} alt="Wisfy SMS" />
              <h2>
                <SplitText text="The latest build, always one tap away" italicWords={["one"]} />
              </h2>
              <p className="sub">
                The rolling release binary — the freshest artifact in the repository, kept at the very
                bottom of the feed so it is always within reach.
              </p>
              <span className="apk-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M9 9.5v5m0-5h2.4a2.05 2.05 0 0 1 0 4.1H9" /></svg>
                <b>{ROLLING_APK.file}</b> · {ROLLING_APK.size} · rolling latest
              </span>
              <div className="final-cta">
                <a className="btn btn-green btn-lg" href={ROLLING_APK.url} download>
                  {DL_ICON} Download Wis-sms.apk
                </a>
                <a className="btn btn-ghost btn-lg" style={{ background: "rgba(244,242,233,.06)", color: "var(--dark-ink)", borderColor: "var(--dark-line)" }} href="https://github.com/naaafizz/Wisfy-sms-releases" target="_blank" rel="noopener">
                  View on GitHub
                </a>
              </div>
              <div className="final-meta">
                <span><span className="m-dot" /> Official OTA feed</span>
                <span><span className="m-dot" /> Same keystore, in-place updates</span>
                <span><span className="m-dot" /> MIT licensed</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Brand />
        <span>
          Developed by <b>Shahria Nafiz Sajjad</b> · MIT License
        </span>
        <div className="footer-links">
          <a href="#notes">Release notes</a>
          <a href="https://github.com/naaafizz/Wisfy-sms-releases" target="_blank" rel="noopener">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- PAGE ---------------- */

export default function Page() {
  const m = useLiveManifest();
  return (
    <>
      <Nav />
      <StickyBar />
      <main>
        <Hero m={m} />
        <Providers />
        <Features />
        <How />
        <Schema />
        <Releases m={m} />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/* provider list lives below the sections that use it (hoisted via const) */
const PROVIDERS_LIST = [
  { name: "bKash", img: IMG("BKASH.png") },
  { name: "Nagad", img: IMG("nAGAD.png") },
  { name: "Rocket", img: IMG("ROCKET.png") },
  { name: "Upay", img: IMG("uPAY.png") },
  { name: "Cellfin", img: IMG("cellfin.png") },
  { name: "DBBL", img: IMG("dbbl.png") },
  { name: "City Bank", img: IMG("city-bank.png") },
];

import { useEffect, useRef, useState } from "react";
import { SITE } from "./config.js";
import { useTheme } from "./useTheme.js";

/* ---------- Icon nhỏ (inline SVG, không cần thư viện) ---------- */
const I = {
  sun: (
    <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  auto: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  github: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  ),
  download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />,
  play: <path d="M8 5v14l11-7Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18" />
    </>
  ),
  save: <path d="M5 4h11l3 3v13H5ZM8 4v5h7V4M8 20v-6h8v6" />,
  cloud: (
    <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.500 4.300 4.300 0 0 1 17 18Zm5-7v6m0 0-2-2m2 2 2-2" />
  ),
  flag: <path d="M5 21V4m0 0h12l-2 4 2 4H5" />,
  chat: <path d="M4 5h16v11H9l-5 4Z" />,
  discord: (
    <path d="M6 11h4m-2-2v4m7-1h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-3.9 3.2L2 15a3 3 0 0 0 5.2 2.4L9 16h6l1.8 1.4A3 3 0 0 0 22 15l-.8-6.8A4 4 0 0 0 17.3 5Z" />
  ),
  cpu: (
    <path d="M8 8h8v8H8ZM4 10h2m-2 4h2m12-4h2m-2 4h2M10 4v2m4-2v2m-4 12v2m4-2v2" />
  ),
  shield: <path d="M12 3 5 6v6c0 4.500 3 7.500 7 9 4-1.500 7-4.500 7-9V6Z" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  check: <path d="m5 12.500 4.500 4.500L19 7" />,
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {I[name]}
    </svg>
  );
}

/* ---------- Hook: hiện dần khi cuộn tới ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- Thẻ kính có đốm sáng bám theo chuột ---------- */
function Glass({ className = "", children, ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={`glass ${className}`} onPointerMove={onMove} {...rest}>
      {children}
    </div>
  );
}

/* ---------- Nút đổi theme ---------- */
const MODE_LABEL = { auto: "Tự động theo giờ", light: "Sáng", dark: "Tối" };

function ThemeToggle({ mode, theme, onCycle }) {
  const icon = mode === "auto" ? "auto" : mode === "light" ? "sun" : "moon";
  return (
    <button
      className="icon-btn"
      onClick={onCycle}
      title={`Giao diện: ${MODE_LABEL[mode]} (đang hiển thị ${theme === "dark" ? "tối" : "sáng"}). Bấm để đổi.`}
      aria-label={`Đổi giao diện, hiện tại: ${MODE_LABEL[mode]}`}
    >
      <Icon name={icon} />
      <span className="icon-btn-label">{MODE_LABEL[mode]}</span>
    </button>
  );
}

/* ---------- Nền aurora ---------- */
function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="grain" />
    </div>
  );
}

/* ---------- Thanh điều hướng ---------- */
function Nav({ themeApi }) {
  return (
    <header className="nav-wrap">
      <nav className="nav glass-flat">
        <a className="brand" href="#top">
          <img
            className="logo-img"
            src="./favicon.png"
            alt=""
            width="30"
            height="30"
          />
          <span>{SITE.name}</span>
        </a>
        <div className="nav-links">
          <a href="#features">Tính năng</a>
          <a href="#start">Bắt đầu</a>
          <a href="#discord">Discord</a>
          <a href="#tech">Công nghệ</a>
        </div>
        <div className="nav-actions">
          <ThemeToggle
            mode={themeApi.mode}
            theme={themeApi.theme}
            onCycle={themeApi.cycle}
          />
          <a
            className="icon-btn"
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Icon name="github" />
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Mô phỏng cửa sổ launcher ---------- */
function LauncherMock() {
  const tabs = [
    ["play", "Chơi ngay"],
    ["globe", "Danh sách server"],
    ["save", "Chơi offline"],
    ["chat", "Forum"],
    ["discord", "Cài đặt"],
  ];
  const [active, setActive] = useState(0);
  return (
    <Glass className="mock">
      <div className="mock-bar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="mock-title">AetherLaunch</span>
      </div>
      <div className="mock-body">
        <aside className="mock-side">
          {tabs.map(([ic, label], i) => (
            <button
              key={label}
              className={i === active ? "on" : ""}
              onClick={() => setActive(i)}
            >
              <Icon name={ic} size={16} />
              <span>{label}</span>
            </button>
          ))}
        </aside>
        <div className="mock-main">
          <div className="mock-hero">
            <div className="mock-chip">
              <img
                className="flag"
                src="https://flagsapi.com/VN/flat/32.png"
                srcSet="https://flagsapi.com/VN/flat/32.png 1x, https://flagsapi.com/VN/flat/64.png 2x"
                width="20"
                height="20"
                alt=""
                loading="lazy"
              />
              Việt Nam
            </div>
            <h3>GTA Việt Roleplay</h3>
            <p className="mono">sv.gtaviet.net:7777</p>
            <div className="mock-stats">
              <div>
                <b>187</b>
                <small>/ 500 người</small>
              </div>
              <div>
                <b>32ms</b>
                <small>ping</small>
              </div>
              <div>
                <b>0.3.7</b>
                <small>phiên bản</small>
              </div>
            </div>
          </div>
          <div className="mock-row">
            <div className="field">
              <small>Tên nhân vật</small>
              <span>Max_Bennett</span>
            </div>
            <button className="btn primary sm">
              <Icon name="play" size={16} /> Vào chơi
            </button>
          </div>
        </div>
      </div>
    </Glass>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <Reveal className="pill">
          <span className="pulse" /> Tauri v2 · Rust · Windows 10/11
        </Reveal>
        <Reveal as="h1" delay={80}>
          Launcher <span className="nowrap">SA-MP</span>
          <br />
          <span className="grad">đẹp như kính.</span>
        </Reveal>
        <Reveal as="p" className="lead" delay={160}>
          Phong cách Anime + Material + Liquid Glass. Chơi online, chơi offline,
          quản lý save, tải dữ liệu game, hiện cờ quốc gia của máy chủ và
          Discord Rich Presence, gói gọn trong một ứng dụng nhẹ.
        </Reveal>
        <Reveal className="cta" delay={240}>
          <a
            className="btn primary"
            href={SITE.releases}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="download" /> Tải về
          </a>
          <a
            className="btn ghost"
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" /> Xem trên GitHub
          </a>
        </Reveal>
        <Reveal className="meta" delay={320}>
          <span>Mã nguồn mở</span>
          <i />
          <span>Không cần bundler phía giao diện</span>
          <i />
          <span>Bộ cài NSIS</span>
        </Reveal>
      </div>
      <Reveal className="hero-visual" delay={200}>
        <LauncherMock />
      </Reveal>
    </section>
  );
}

/* ---------- Tính năng ---------- */
const FEATURES = [
  {
    icon: "play",
    title: "Chơi ngay",
    text: "Truy vấn UDP (i/r/d/p) cho thông tin server, danh sách người chơi và ping. Helper x86 chạy gta_sa.exe ở chế độ suspended rồi nạp samp.dll.",
  },
  {
    icon: "save",
    title: "Chơi offline & quản lý save",
    text: "Chạy chế độ cốt truyện, 8 slot GTASAsfN.b được kiểm tra kích thước, chữ ký và checksum. Luôn có bản sao lưu an toàn để hoàn tác.",
  },
  {
    icon: "cloud",
    title: "Tải dữ liệu game",
    text: "Tải và cập nhật từ server của bạn qua manifest, xác minh SHA-256 và hỗ trợ tải tiếp khi đứt mạng.",
  },
  {
    icon: "flag",
    title: "Cờ & quốc gia của server",
    text: "Tra quốc gia qua ipinfo, ảnh cờ từ FlagCDN (dự phòng FlagsAPI), nhớ kết quả 7 ngày. IP nội bộ không bao giờ bị gửi ra ngoài.",
  },
  {
    icon: "chat",
    title: "Forum tích hợp",
    text: "Mỗi server có danh sách link forum riêng, mở trong cửa sổ trình duyệt tích hợp, chỉ nhận http/https và không có quyền gọi API Tauri.",
  },
  {
    icon: "discord",
    title: "Discord Rich Presence",
    text: "Hiện server, nhân vật, số người chơi, thời gian chơi và nút tác giả. Chỉ cần Application ID, không cần bot hay OAuth.",
  },
];

function Features() {
  return (
    <section className="section" id="features">
      <Reveal className="section-head">
        <span className="eyebrow">Tính năng</span>
        <h2>Mọi thứ bạn cần để vào game.</h2>
        <p>Nhẹ, nhanh và gọn gàng, mỗi tab làm tốt đúng một việc.</p>
      </Reveal>
      <div className="grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <Glass className="card">
              <span className="card-icon">
                <Icon name={f.icon} size={22} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Glass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Khối code có nút sao chép ---------- */
function CodeBlock({ lines }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        lines.map((l) => l.replace(/\s+#.*$/, "")).join("\n"),
      );
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard bị chặn */
    }
  };
  return (
    <div className="code">
      <button className="copy" onClick={copy} aria-label="Sao chép lệnh">
        <Icon name={done ? "check" : "copy"} size={16} />
      </button>
      <pre>
        <code>{lines.join("\n")}</code>
      </pre>
    </div>
  );
}

/* ---------- Bắt đầu ---------- */
function Start() {
  return (
    <section className="section" id="start">
      <Reveal className="section-head">
        <span className="eyebrow">Bắt đầu</span>
        <h2>Chạy trong ba bước.</h2>
        <p>
          Cần Windows 10/11 (WebView2), Rust ≥ 1.90, Node.js và MSVC Build
          Tools.
        </p>
      </Reveal>
      <div className="steps">
        <Reveal delay={0}>
          <Glass className="step">
            <span className="num">1</span>
            <h3>Cài phụ thuộc</h3>
            <CodeBlock
              lines={["npm install", "npm run tauri icon app-icon.png"]}
            />
          </Glass>
        </Reveal>
        <Reveal delay={90}>
          <Glass className="step">
            <span className="num">2</span>
            <h3>Chạy thử</h3>
            <CodeBlock lines={["npm run tauri dev"]} />
            <p className="note">
              Lần đầu mở app sẽ hỏi chọn thư mục game hoặc tải dữ liệu game.
            </p>
          </Glass>
        </Reveal>
        <Reveal delay={180}>
          <Glass className="step">
            <span className="num">3</span>
            <h3>Đóng gói</h3>
            <CodeBlock lines={["npm run tauri build"]} />
            <p className="note">
              Ra bộ cài NSIS, người dùng không cần file .env.
            </p>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Discord ---------- */
function DiscordSection() {
  return (
    <section className="section" id="discord">
      <div className="split">
        <Reveal>
          <span className="eyebrow">Discord Rich Presence</span>
          <h2>Cho bạn bè thấy bạn đang chơi gì.</h2>
          <ul className="ticks">
            <li>
              <Icon name="check" size={18} /> Tạo ứng dụng trên Discord
              Developer Portal, copy Application ID
            </li>
            <li>
              <Icon name="check" size={18} /> Tải 2 ảnh <code>aether_logo</code>{" "}
              và <code>gta_sa</code> vào Art Assets
            </li>
            <li>
              <Icon name="check" size={18} /> Dán ID vào{" "}
              <code>DISCORD_CLIENT_ID</code> trong <code>.env</code>
            </li>
            <li>
              <Icon name="check" size={18} /> Có thể tắt bất cứ lúc nào bằng
              công tắc trong Cài đặt
            </li>
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <Glass className="presence">
            <div className="presence-top">
              <span className="presence-img">A</span>
              <div>
                <small>Đang chơi AetherLaunch</small>
                <b>GTA Việt Roleplay</b>
                <span>Max_Bennett · 187 of 500</span>
                <span className="mono">sv.gtaviet.net:7777</span>
              </div>
            </div>
            <div className="presence-btn">Created by {SITE.author}</div>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Công nghệ ---------- */
const TECH = [
  [
    "cpu",
    "Rust + Tauri v2",
    "Lệnh query_server, check_game, launch_game, open_forum chạy ở phía Rust.",
  ],
  [
    "globe",
    "HTML / CSS / JS thuần",
    "Giao diện không cần bundler, nạp nhanh trong WebView2.",
  ],
  [
    "shield",
    "An toàn mặc định",
    "CSP không đổi, gọi mạng ở Rust, kiểm tra input trước khi chạy game.",
  ],
];

function Tech() {
  return (
    <section className="section" id="tech">
      <Reveal className="section-head">
        <span className="eyebrow">Công nghệ</span>
        <h2>Xây dựng gọn, chạy nhẹ.</h2>
      </Reveal>
      <div className="grid three">
        {TECH.map(([ic, t, d], i) => (
          <Reveal key={t} delay={i * 80}>
            <Glass className="card">
              <span className="card-icon">
                <Icon name={ic} size={22} />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Glass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- CTA cuối trang ---------- */
function FinalCta() {
  return (
    <section className="section">
      <Reveal>
        <Glass className="final">
          <h2>Sẵn sàng vào game?</h2>
          <p>Tải AetherLaunch hoặc xem mã nguồn trên GitHub.</p>
          <div className="cta center">
            <a
              className="btn primary"
              href={SITE.releases}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="download" /> Tải bản mới nhất
            </a>
            <a
              className="btn ghost"
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
            >
              Xem mã nguồn <Icon name="arrow" size={18} />
            </a>
          </div>
        </Glass>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>
        © {new Date().getFullYear()} {SITE.name} · Tác giả{" "}
        <a href={SITE.authorLink} target="_blank" rel="noreferrer">
          {SITE.author} ({SITE.handle})
        </a>
      </span>
      <span>Giao diện tự đổi sáng/tối theo giờ của bạn.</span>
    </footer>
  );
}

export default function App() {
  const themeApi = useTheme();
  return (
    <>
      <Backdrop />
      <Nav themeApi={themeApi} />
      <main>
        <Hero />
        <Features />
        <Start />
        <DiscordSection />
        <Tech />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

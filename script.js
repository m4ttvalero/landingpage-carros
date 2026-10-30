"use strict";
/* ===== CONFIGURAÇÃO (edite aqui) ===== */
const WHATSAPP = "5500000000000"; // SUBSTITUIR: DDI + DDD + número, só dígitos (placeholder de demonstração)
const REDES = {
  Instagram: "https://www.instagram.com/",
  Facebook: "https://www.facebook.com/",
}; // SUBSTITUIR pelos perfis

/* ===== DADOS (fotos em assets/carros/<id>-1.jpg, -2.jpg, -3.jpg) ===== */
const VEICULOS = [
  {
    id: "porsche-911",
    marca: "Porsche",
    modelo: "911 Carrera",
    versao: "3.0 Turbo PDK",
    cat: "Esportivo",
    ano: 2022,
    km: 18400,
    cambio: "Automático PDK",
    comb: "Gasolina",
    motor: "3.0 biturbo, 6 cilindros",
    cor: "Cinza",
    preco: 989900,
    destaque: true,
    desc: "Esportivo de dois lugares com proposta de uso diário e desempenho de pista.",
  },
  {
    id: "bmw-320i",
    marca: "BMW",
    modelo: "320i",
    versao: "M Sport",
    cat: "Sedã",
    ano: 2021,
    km: 36200,
    cambio: "Automático 8 marchas",
    comb: "Gasolina",
    motor: "2.0 turbo, 4 cilindros",
    cor: "Preto",
    preco: 239900,
    destaque: false,
    desc: "Sedã esportivo com interior bem equipado e condução equilibrada.",
  },
  {
    id: "audi-q5",
    marca: "Audi",
    modelo: "Q5",
    versao: "Prestige 2.0 TFSI",
    cat: "SUV",
    ano: 2021,
    km: 41800,
    cambio: "Automático S tronic",
    comb: "Gasolina",
    motor: "2.0 turbo, 4 cilindros",
    cor: "Branco",
    preco: 289900,
    destaque: true,
    desc: "SUV médio com espaço para a família e acabamento de nível premium.",
  },
  {
    id: "golf-gti",
    marca: "Volkswagen",
    modelo: "Golf GTI",
    versao: "2.0 TSI",
    cat: "Hatch",
    ano: 2020,
    km: 52300,
    cambio: "Automático DSG",
    comb: "Gasolina",
    motor: "2.0 turbo, 4 cilindros",
    cor: "Vermelho",
    preco: 199900,
    destaque: false,
    desc: "Hatch esportivo que une uso urbano e resposta rápida ao acelerar.",
  },
  {
    id: "hilux-srx",
    marca: "Toyota",
    modelo: "Hilux",
    versao: "SRX 2.8 4x4",
    cat: "Picape",
    ano: 2022,
    km: 33700,
    cambio: "Automático 6 marchas",
    comb: "Diesel",
    motor: "2.8 turbo diesel",
    cor: "Prata",
    preco: 329900,
    destaque: false,
    desc: "Picape média com tração 4x4, para trabalho pesado e viagens longas.",
  },
  {
    id: "mustang-gt",
    marca: "Ford",
    modelo: "Mustang GT",
    versao: "5.0 V8",
    cat: "Esportivo",
    ano: 2019,
    km: 29500,
    cambio: "Automático 10 marchas",
    comb: "Gasolina",
    motor: "5.0 V8 aspirado",
    cor: "Azul",
    preco: 399900,
    destaque: true,
    desc: "Cupê americano com motor V8 aspirado e som inconfundível.",
  },
].map((v) => ({
  ...v,
  fotos: [1, 2, 3].map((n) => `assets/carros/${v.id}-${n}.jpg`),
}));

/* ===== UTILITÁRIOS ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = (n) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
const km = (n) => n.toLocaleString("pt-BR") + " km";
const wa = (m) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(m)}`;
const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const nome = (v) => `${v.marca} ${v.modelo}`;
const ph = (t) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1c21"/><stop offset="1" stop-color="#0b0b0d"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><g fill="none" stroke="#3a3a42" stroke-width="5" stroke-linejoin="round"><path d="M130 320Q135 280 210 265L290 205Q315 190 350 190H470Q510 190 540 215L600 265Q680 272 690 320V345H130Z"/><circle cx="240" cy="345" r="38"/><circle cx="580" cy="345" r="38"/></g><text x="400" y="440" fill="#6b6b75" font-family="Arial" font-size="26" text-anchor="middle">${t}</text></svg>`,
  );
const img = (src, alt, lazy = true) =>
  `<img src="${src}" alt="${alt}" ${lazy ? 'loading="lazy"' : ""} onerror="this.onerror=null;this.src=ph(this.alt)">`;

/* ===== REVELAÇÃO AO ROLAR ===== */
const io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12 },
      )
    : null;
const revelar = () =>
  $$(".rv:not(.in)").forEach((el) =>
    io ? io.observe(el) : el.classList.add("in"),
  );

/* ===== ESTOQUE E FILTROS ===== */
const card = (v) => `<article class="cd rv" data-id="${v.id}">
  <div class="im">${v.destaque ? '<span class="tag">Destaque</span>' : ""}${img(v.fotos[0], `${nome(v)} ${v.versao}, ${v.cor}`)}</div>
  <div class="ci"><p class="mt">${v.cat} · ${v.ano}</p><h3>${nome(v)}</h3><p class="vs">${v.versao}</p>
  <ul class="sp"><li>${km(v.km)}</li><li>${v.cambio}</li><li>${v.comb}</li></ul>
  <p class="pr">${brl(v.preco)}</p><button class="btn ghost" type="button" data-id="${v.id}">Ver detalhes</button></div></article>`;

function filtrar() {
  const q = norm($("#q").value.trim()),
    c = $("#ct").value,
    a = +$("#an").value || 0;
  const mn = +$("#pmin").value || 0,
    mx = +$("#pmax").value || Infinity;
  const r = VEICULOS.filter(
    (v) =>
      (!q || norm(`${v.marca} ${v.modelo} ${v.versao}`).includes(q)) &&
      (!c || v.cat === c) &&
      v.ano >= a &&
      v.preco >= mn &&
      v.preco <= mx,
  );
  $("#gd").innerHTML = r.map(card).join("");
  $("#vz").hidden = r.length > 0;
  $("#rs").textContent =
    `${r.length} ${r.length === 1 ? "veículo encontrado" : "veículos encontrados"}`;
  revelar();
}
function iniciarFiltros() {
  [...new Set(VEICULOS.map((v) => v.cat))]
    .sort()
    .forEach((c) =>
      $("#ct").insertAdjacentHTML("beforeend", `<option>${c}</option>`),
    );
  [...new Set(VEICULOS.map((v) => v.ano))]
    .sort((a, b) => b - a)
    .forEach((a) =>
      $("#an").insertAdjacentHTML("beforeend", `<option>${a}</option>`),
    );
  const f = $("#fl");
  f.addEventListener("input", filtrar);
  f.addEventListener("submit", (e) => e.preventDefault());
  f.addEventListener("reset", () => setTimeout(filtrar));
  $("#gd").addEventListener("click", (e) => {
    const el = e.target.closest("[data-id]");
    if (el) abrir(el.dataset.id);
  });
  filtrar();
}

/* ===== MODAL E GALERIA ===== */
const md = $("#md");
let cur = null,
  fi = 0;
function foto(i) {
  fi = (i + cur.fotos.length) % cur.fotos.length;
  const g = $("#gi");
  g.onerror = () => {
    g.onerror = null;
    g.src = ph(g.alt);
  };
  g.alt = `${nome(cur)}, foto ${fi + 1} de ${cur.fotos.length}`;
  g.src = cur.fotos[fi];
  $$("#th button").forEach((b, k) => b.setAttribute("aria-current", k === fi));
}
function abrir(id) {
  cur = VEICULOS.find((v) => v.id === id);
  if (!cur) return;
  $("#me").textContent = `${cur.cat} · ${cur.ano}`;
  $("#mt").textContent = `${nome(cur)} ${cur.versao}`;
  $("#mpr").textContent = brl(cur.preco);
  $("#mds").textContent = cur.desc;
  $("#mdl").innerHTML = [
    ["Ano", cur.ano],
    ["Quilometragem", km(cur.km)],
    ["Câmbio", cur.cambio],
    ["Combustível", cur.comb],
    ["Motor", cur.motor],
    ["Cor", cur.cor],
    ["Categoria", cur.cat],
  ]
    .map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`)
    .join("");
  $("#mw").href = wa(
    `Olá! Tenho interesse no ${nome(cur)} ${cur.versao} (${cur.ano}), anunciado por ${brl(cur.preco)}. Ainda está disponível?`,
  );
  $("#th").innerHTML = cur.fotos
    .map(
      (f, i) =>
        `<button type="button" data-f="${i}" aria-label="Ver foto ${i + 1}">${img(f, `${nome(cur)}, miniatura ${i + 1}`)}</button>`,
    )
    .join("");
  foto(0);
  md.showModal();
  document.body.classList.add("lock");
}
function iniciarModal() {
  $("#mx").onclick = () => md.close();
  md.addEventListener("click", (e) => {
    if (e.target === md) md.close();
  });
  md.addEventListener("close", () => document.body.classList.remove("lock"));
  $("#gp").onclick = () => foto(fi - 1);
  $("#gn").onclick = () => foto(fi + 1);
  $("#th").addEventListener("click", (e) => {
    const b = e.target.closest("[data-f]");
    if (b) foto(+b.dataset.f);
  });
  document.addEventListener("keydown", (e) => {
    if (!md.open) return;
    if (e.key === "ArrowLeft") foto(fi - 1);
    if (e.key === "ArrowRight") foto(fi + 1);
  });
}

/* ===== HEADER, MENU E SEÇÃO ATIVA ===== */
function iniciarNav() {
  const hd = $("#hd"),
    nv = $("#nv"),
    bg = $("#bg");
  const sc = () => hd.classList.toggle("solid", scrollY > 40);
  sc();
  addEventListener("scroll", sc, { passive: true });
  const fechar = () => {
    nv.classList.remove("open");
    bg.setAttribute("aria-expanded", "false");
    bg.setAttribute("aria-label", "Abrir menu");
  };
  bg.onclick = () => {
    const a = nv.classList.toggle("open");
    bg.setAttribute("aria-expanded", a);
    bg.setAttribute("aria-label", a ? "Fechar menu" : "Abrir menu");
  };
  nv.addEventListener("click", (e) => {
    if (e.target.closest("a")) fechar();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fechar();
  });
  if (!("IntersectionObserver" in window)) return;
  const so = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting)
          $$("#nv a:not(.btn)").forEach((a) =>
            a.toggleAttribute(
              "aria-current",
              a.getAttribute("href") === "#" + e.target.id,
            ),
          );
      }),
    { rootMargin: "-45% 0px -50% 0px" },
  );
  ["inicio", "estoque", "diferenciais", "sobre", "contato"].forEach((id) =>
    so.observe($("#" + id)),
  );
}

/* ===== INICIALIZAÇÃO ===== */
$$("[data-wa]").forEach((a) => (a.href = wa(a.dataset.wa)));
$("#rd").innerHTML = Object.entries(REDES)
  .map(
    ([n, u]) =>
      `<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`,
  )
  .join("");
$("#ano").textContent = new Date().getFullYear();
iniciarFiltros();
iniciarModal();
iniciarNav();
revelar();

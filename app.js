(function(){
"use strict";
const {useState,useMemo,useEffect,useCallback,createContext,useContext}=React;
const _c={};const motion=new Proxy({},{get:(_,tag)=>_c[tag]||(_c[tag]=(props)=>{const {initial,animate,exit,transition,whileHover,whileTap,layout,className,style,...rest}=props;let st=style,cls=className||"";if(initial)cls+=" enter";if(whileHover)cls+=" lift";if(animate&&animate.width!==undefined)st={...style,width:animate.width,transition:"width .5s"};if(animate&&Array.isArray(animate.left))cls+=" scan";return React.createElement(tag,{...rest,className:cls,style:st});})});
const AnimatePresence=({children})=>React.createElement(React.Fragment,null,children);
function animate(from,to,o){let raf,t0=performance.now();const f=(t)=>{const k=Math.min(1,(t-t0)/(o.duration*1000));o.onUpdate(from+(to-from)*(1-Math.pow(1-k,3)));if(k<1)raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f);return{stop:()=>cancelAnimationFrame(raf)}}
"use strict";
const LETTERS = "АВЕКМНОРСТУХ".split("");
const REGIONS = ["01", "102", "02", "702", "03", "103", "04", "05", "06", "07", "08", "09", "109", "10", "11", "111", "12", "13", "113", "14", "15", "16", "116", "716", "17", "18", "19", "20", "95", "21", "121", "22", "122", "23", "93", "123", "223", "24", "84", "88", "124", "25", "125", "26", "126", "27", "28", "29", "30", "31", "32", "33", "34", "134", "35", "36", "136", "37", "38", "85", "138", "39", "91", "40", "41", "82", "42", "142", "43", "44", "45", "46", "47", "147", "48", "49", "50", "90", "150", "190", "750", "51", "52", "152", "53", "54", "154", "55", "155", "56", "57", "58", "59", "81", "159", "60", "61", "161", "761", "62", "63", "163", "763", "64", "164", "65", "66", "96", "196", "67", "68", "69", "70", "71", "72", "73", "173", "74", "174", "774", "75", "80", "76", "77", "97", "99", "177", "197", "199", "777", "797", "799", "78", "98", "178", "198", "79", "83", "86", "186", "87", "89", "92", "94"];
const RARE_REGIONS = ["77", "97", "99", "177", "197", "199", "777", "799", "78", "178"];
const TIERS = {
    common: { label: "Обычный", color: "#8b95a5", min: 0 }, uncommon: { label: "Необычный", color: "#3ecf8e", min: 12 },
    rare: { label: "Редкий", color: "#4d8dff", min: 24 }, epic: { label: "Эпический", color: "#b36bff", min: 42 },
    legendary: { label: "Легендарный", color: "#ffb020", min: 65 }, mythic: { label: "Мифический", color: "#ff4d6d", min: 90 }
};
const ORDER = Object.keys(TIERS);
const plateText = (p) => `${p.letters[0]}${p.digits}${p.letters.slice(1)}`;
const SPECIAL = ["001", "007", "100", "111", "222", "333", "444", "555", "666", "777", "888", "999", "123", "321", "101", "700"];
/** Балл редкости: сумма бонусов за узор цифр, букв и региона. */
function calculateRarity(p) {
    const d = p.digits, l = p.letters;
    let s = 0;
    if (d[0] === d[1] && d[1] === d[2])
        s += 38;
    else if (d[0] === d[1] || d[1] === d[2] || d[0] === d[2])
        s += 10;
    if (d[0] === d[2] && d[0] !== d[1])
        s += 14;
    if (Number(d[1]) === Number(d[0]) + 1 && Number(d[2]) === Number(d[1]) + 1)
        s += 18;
    if (Number(d[1]) === Number(d[0]) - 1 && Number(d[2]) === Number(d[1]) - 1)
        s += 14;
    if (SPECIAL.includes(d))
        s += 14;
    if (d === "777" || d === "888" || d === "999")
        s += 8;
    if (d.startsWith("00"))
        s += 12;
    if (l[0] === l[1] && l[1] === l[2])
        s += 26;
    else if (l[1] === l[2])
        s += 10;
    if (l[0] === l[1] && l[1] === l[2] && d[0] === d[1] && d[1] === d[2])
        s += 20;
    if (RARE_REGIONS.includes(p.region))
        s += 8;
    if (p.region.length === 3)
        s += 3;
    if (d.includes("7"))
        s += 3;
    const rarity = [...ORDER].reverse().find(r => s >= TIERS[r].min);
    const estimatedValue = Math.round(10 + s * s * 0.6 + s * 4);
    return { rarity, score: s, estimatedValue };
}
function makePlate(letters, digits, region, rnd = Math.random) {
    const r = calculateRarity({ letters, digits, region });
    return { id: "P" + Math.floor(rnd() * 1e9).toString(36).toUpperCase(), letters, digits, region, series: letters.slice(1), rarity: r.rarity, score: r.score, value: r.estimatedValue };
}
function generatePlate(rnd = Math.random, lock = {}) {
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const digits = rnd() < 0.14 ? pick(SPECIAL) : String(1 + Math.floor(rnd() * 999)).padStart(3, "0");
    let L = rnd() < 0.05 ? pick(LETTERS).repeat(3) : Array.from({ length: 3 }, () => pick(LETTERS)).join("");
    if (rnd() < 0.08)
        L = L[0] + pick(LETTERS).repeat(2);
    const region = lock.region || (rnd() < 0.2 ? pick(RARE_REGIONS) : pick(REGIONS));
    return makePlate(lock.letters || L, lock.digits || digits, region, rnd);
}
function generateMin(min) { for (let i = 0; i < 3000; i++) {
    const p = generatePlate();
    if (ORDER.indexOf(p.rarity) >= ORDER.indexOf(min))
        return p;
} return generatePlate(); }
function seeded(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const OPEN_COST = 0;
const REWARDS = [
    { day: 1, label: "Номер", kind: "plate", min: "common" }, { day: 2, label: "Необычный", kind: "plate", min: "uncommon" },
    { day: 3, label: "Редкий", kind: "plate", min: "rare" }, { day: 4, label: "Редкий", kind: "plate", min: "rare" },
    { day: 5, label: "Эпический", kind: "plate", min: "epic" }, { day: 6, label: "Эпический", kind: "plate", min: "epic" },
    { day: 7, label: "Легендарный", kind: "plate", min: "legendary" }
];
const rareCount = (s) => s.plates.filter(p => ORDER.indexOf(p.rarity) >= 2).length;
const ACHIEVEMENTS = [
    { id: "first", title: "Первый номер", desc: "Получите первый номер", ok: (s) => s.plates.length >= 1 },
    { id: "collector", title: "Коллекционер", desc: "Соберите 10 номеров", ok: (s) => s.plates.length >= 10 },
    { id: "hundred", title: "100 номеров", desc: "Соберите 100 номеров", ok: (s) => s.plates.length >= 100 },
    { id: "legend", title: "Первая легендарка", desc: "Получите легендарный номер", ok: (s) => s.plates.some(p => ORDER.indexOf(p.rarity) >= 4) },
    { id: "sevens", title: "Охотник за семёрками", desc: "3 номера с цифрой 7", ok: (s) => s.plates.filter(p => p.digits.includes("7")).length >= 3 },
    { id: "repeats", title: "Мастер повторов", desc: "3 номера с тремя одинаковыми цифрами", ok: (s) => s.plates.filter(p => new Set(p.digits).size === 1).length >= 3 },
    { id: "region", title: "Региональный эксперт", desc: "Номера из 5 разных регионов", ok: (s) => new Set(s.plates.map(p => p.region)).size >= 5 },
    { id: "rares", title: "Редкий улов", desc: "5 редких и выше", ok: (s) => rareCount(s) >= 5 }
];
const level = (xp) => Math.floor(xp / 100) + 1;
const worth = (ps) => ps.reduce((a, p) => a + p.value, 0);
const today = () => new Date().toISOString().slice(0, 10);
const KEY = "znak.v1";
const fresh = () => ({ coins: 500, xp: 0, plates: [], streak: 0, lastClaim: "", ach: [], joined: today(), log: [] });
/** Моковые игроки. В продакшене заменяются запросом GET /api/players. */
function makePlayers() {
    const names = ["Артём_77", "NightDriver", "Мадина", "Коллекционер_01", "Рустам", "KingOfSevens", "Зарема", "Plate_Hunter", "Ахмед", "Лиза_Х"];
    return names.map((name, i) => { const r = seeded(i * 991 + 7); return { name, plates: Array.from({ length: 8 + Math.floor(r() * 30) }, () => generatePlate(r)) }; });
}
const C = createContext(null);
const useGame = () => useContext(C);
function Provider({ children }) {
    const [s, set] = useState(fresh());
    const [ready, setReady] = useState(false);
    const [players, setPlayers] = useState([]);
    const [toast, setToast] = useState("");
    useEffect(() => { try {
        const raw = localStorage.getItem(KEY);
        if (raw)
            set(JSON.parse(raw));
    }
    catch { } setPlayers(makePlayers()); setTimeout(() => setReady(true), 350); }, []);
    useEffect(() => { if (ready)
        try {
            localStorage.setItem(KEY, JSON.stringify(s));
        }
        catch { } }, [s, ready]);
    const say = useCallback((m) => { setToast(m); setTimeout(() => setToast(""), 3200); }, []);
    const withAch = (n) => { const got = ACHIEVEMENTS.filter(a => !n.ach.includes(a.id) && a.ok(n)); if (got.length) {
        setTimeout(() => say(`Достижение: ${got[0].title}`), 1800);
        return { ...n, ach: [...n.ach, ...got.map(a => a.id)], xp: n.xp + 50 * got.length };
    } return n; };
    const addPlate = (n, p, why) => ({ ...n, plates: [p, ...n.plates], xp: n.xp + 10 + Math.round(p.value / 20), log: [{ t: why + " " + plateText(p), d: 0, at: new Date().toISOString() }, ...n.log].slice(0, 50) });
    const openPlate = (lock) => { const p = generatePlate(Math.random, lock); set(x => withAch(addPlate({ ...x, coins: x.coins - OPEN_COST }, p, "Открыт"))); return p; };
    const canClaim = s.lastClaim !== today();
    const claim = () => {
        if (!canClaim)
            return;
        const gap = s.lastClaim ? (Date.parse(today()) - Date.parse(s.lastClaim)) / 864e5 : 99;
        const streak = gap === 1 ? (s.streak % 7) + 1 : 1;
        const r = REWARDS[streak - 1];
        if (r.kind === "plate") {
            const p = generateMin(r.min);
            set(x => withAch(addPlate({ ...x, streak, lastClaim: today() }, p, "Награда дня")));
            say(`Награда дня: номер ${plateText(p)}`);
        }
        else {
            set(x => ({ ...x, streak, lastClaim: today(), coins: x.coins + r.n, log: [{ t: "Награда дня", d: r.n, at: new Date().toISOString() }, ...x.log] }));
            say(`Награда дня: +${r.n} монет`);
        }
    };
    const trade = (give, get, who) => {
        const ids = new Set(give.map(p => p.id));
        set(x => withAch({ ...x, plates: [...get, ...x.plates.filter(p => !ids.has(p.id))], xp: x.xp + 25, log: [{ t: `Обмен с ${who}`, d: 0, at: new Date().toISOString() }, ...x.log] }));
        setPlayers(ps => ps.map(pl => pl.name === who ? { ...pl, plates: [...give, ...pl.plates.filter(p => !get.some(g => g.id === p.id))] } : pl));
        say("Обмен успешно завершён");
    };
    return React.createElement(C.Provider, { value: { s, ready, players, toast, say, openPlate, claim, trade, canClaim } }, children);
}
const W = { sm: "w-[168px] h-[38px] text-[24px]", md: "w-[236px] h-[52px] text-[34px]", lg: "w-[min(92vw,420px)] h-[92px] text-[60px]" };
function LicensePlate({ plate, size = "md", selected, onClick, interactive = true }) {
    const t = TIERS[plate.rarity];
    const hot = plate.rarity === "legendary" || plate.rarity === "mythic";
    return React.createElement(motion.div, { role: onClick ? "button" : undefined, tabIndex: onClick ? 0 : undefined, onClick: onClick, onKeyDown: e => e.key === "Enter" && (onClick === null || onClick === void 0 ? void 0 : onClick()), whileHover: interactive ? { y: -4 } : undefined, transition: { type: "spring", stiffness: 400, damping: 24 }, style: { boxShadow: `0 ${size === "lg" ? 18 : 8}px ${size === "lg" ? 50 : 22}px -8px ${t.color}${plate.rarity === "common" ? "33" : "88"}`, outline: selected ? "3px solid #ffb020" : undefined }, "aria-label": `Номер ${plateText(plate)} ${plate.region}`, className: `relative inline-flex shrink-0 items-stretch overflow-hidden rounded-[10px] border-2 border-black bg-plate font-plate font-semibold text-black ${W[size]} ${hot ? "sheen" : ""} ${onClick ? "cursor-pointer" : ""}` },
        React.createElement("span", { className: "flex flex-1 items-center justify-center leading-none tracking-[0.08em]" }, plateText(plate)),
        React.createElement("span", { className: "flex w-[27%] flex-col items-center justify-center border-l-2 border-black leading-none" },
            React.createElement("span", { className: size === "sm" ? "text-[17px]" : size === "md" ? "text-[26px]" : "text-[44px]" }, plate.region),
            React.createElement("span", { className: "mt-0.5 flex items-center gap-1 text-[0.28em] font-medium" },
                "RUS",
                React.createElement("i", { className: "inline-block h-[0.9em] w-[1.3em]", style: { background: "linear-gradient(#fff 33%,#1f4fd8 33% 66%,#d52b1e 66%)", outline: "1px solid #0003" } }))));
}
const NAV = [["home", "Главная"], ["collection", "Коллекция"], ["find", "Найти"], ["trade", "Обмен"], ["rank", "Рейтинг"], ["ach", "Достижения"]];
const card = "rounded-2xl border border-line bg-graphite";
const btn = "rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95";
const primary = `${btn} bg-amber text-black hover:brightness-110`;
const ghost = `${btn} border border-line hover:bg-white/5`;
function Count({ v }) {
    const [n, setN] = useState(v);
    useEffect(() => {
        const c = animate(n, v, { duration: .6, onUpdate: x => setN(Math.round(x)) });
        return () => c.stop(); // eslint-disable-next-line
    }, [v]);
    return React.createElement(React.Fragment, null, n.toLocaleString("ru-RU"));
}
const Badge = ({ r }) => React.createElement("span", { className: "rounded-full px-2 py-0.5 text-xs font-semibold", style: { background: TIERS[r].color + "22", color: TIERS[r].color } }, TIERS[r].label);
function PlateModal({ p, owner, onClose }) {
    return React.createElement(motion.div, { className: "fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose },
        React.createElement(motion.div, { className: `${card} w-full max-w-md p-6`, initial: { y: 24, scale: .96 }, animate: { y: 0, scale: 1 }, exit: { y: 24, opacity: 0 }, onClick: e => e.stopPropagation(), role: "dialog", "aria-modal": true },
            React.createElement("div", { className: "flex justify-center py-4" },
                React.createElement(LicensePlate, { plate: p, size: "lg", interactive: false })),
            React.createElement("dl", { className: "mt-4 grid grid-cols-2 gap-3 text-sm" }, [["Редкость", React.createElement(Badge, { key: "r", r: p.rarity })], ["Стоимость", `${p.value.toLocaleString("ru-RU")} монет`], ["Балл редкости", p.score], ["Регион", p.region], ["Серия", p.series], ["ID", p.id], ["Владелец", owner !== null && owner !== void 0 ? owner : "Вы"]].map(([k, v]) => React.createElement("div", { key: k },
                React.createElement("dt", { className: "text-white/50" }, k),
                React.createElement("dd", { className: "font-semibold" }, v)))),
            React.createElement("button", { className: `${ghost} mt-6 w-full`, onClick: onClose }, "\u0417\u0430\u043A\u0440\u044B\u0442\u044C")));
}
function Daily() {
    const { s, claim, canClaim } = useGame();
    const next = canClaim ? ((Date.now() - Date.parse(s.lastClaim || "2000-01-01")) / 864e5 < 2 ? s.streak % 7 : 0) : s.streak % 7;
    return React.createElement("section", { className: `${card} p-5` },
        React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("h2", { className: "font-bold" }, "\u0415\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u0430\u044F \u043D\u0430\u0433\u0440\u0430\u0434\u0430"),
            React.createElement("button", { className: canClaim ? primary : `${ghost} opacity-50`, disabled: !canClaim, onClick: claim }, canClaim ? "Забрать" : "Приходите завтра")),
        React.createElement("div", { className: "mt-4 grid grid-cols-7 gap-2" }, REWARDS.map((r, i) => {
            const done = i < (canClaim ? next : s.streak), cur = canClaim && i === next;
            return React.createElement("div", { key: r.day, className: `rounded-xl border p-2 text-center text-[11px] leading-tight ${cur ? "border-amber bg-amber/10" : "border-line"} ${done ? "opacity-40" : ""}` },
                React.createElement("div", { className: "text-lg font-bold" }, done ? "✓" : r.day),
                React.createElement("div", { className: "mt-1 text-white/70" }, r.label));
        })));
}
function Home({ go, setM }) {
    const { s } = useGame();
    const rare = s.plates.filter(p => ORDER.indexOf(p.rarity) >= 2).length;
    return React.createElement("div", { className: "space-y-5" },
        React.createElement("section", { className: `${card} p-6 md:p-10` },
            React.createElement("h1", { className: "max-w-xl text-3xl font-extrabold leading-tight md:text-5xl" }, "\u0421\u043E\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E \u0440\u0435\u0434\u043A\u0438\u0445 \u043D\u043E\u043C\u0435\u0440\u043E\u0432"),
            React.createElement("p", { className: "mt-3 max-w-md text-white/60" }, "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0439\u0442\u0435 \u043D\u043E\u043C\u0435\u0440\u0430, \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u044B \u0438 \u0437\u0435\u0440\u043A\u0430\u043B\u0430, \u043C\u0435\u043D\u044F\u0439\u0442\u0435\u0441\u044C \u0441 \u0438\u0433\u0440\u043E\u043A\u0430\u043C\u0438. \u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0439\u0442\u0435 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0445\u043E\u0442\u0438\u0442\u0435: \u044D\u0442\u043E \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E \u0438 \u0431\u0435\u0437 \u043B\u0438\u043C\u0438\u0442\u0430."),
            React.createElement("div", { className: "mt-6 flex flex-wrap gap-2" },
                React.createElement("button", { className: `${primary} px-6 py-3 text-base`, onClick: () => go("open") }, "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440"),
                [["collection", "Моя коллекция"], ["find", "Найти номер"], ["trade", "Обмен"], ["rank", "Рейтинг"]].map(([v, l]) => React.createElement("button", { key: v, className: ghost, onClick: () => go(v) }, l)))),
        React.createElement("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4" }, [["Номеров", s.plates.length], ["Редких и выше", rare], ["Легендарных и выше", s.plates.filter(p => ORDER.indexOf(p.rarity) >= 4).length], ["Стоимость коллекции", worth(s.plates)]].map(([k, v]) => React.createElement("div", { key: k, className: `${card} p-4` },
            React.createElement("div", { className: "text-sm text-white/50" }, k),
            React.createElement("div", { className: "mt-1 text-2xl font-extrabold" },
                React.createElement(Count, { v: v }))))),
        React.createElement("section", { className: `${card} p-5` },
            React.createElement("div", { className: "flex justify-between text-sm" },
                React.createElement("span", { className: "font-bold" },
                    "\u0423\u0440\u043E\u0432\u0435\u043D\u044C ",
                    level(s.xp)),
                React.createElement("span", { className: "text-white/50" },
                    s.xp % 100,
                    "/100 \u043E\u043F\u044B\u0442\u0430")),
            React.createElement("div", { className: "mt-2 h-2 overflow-hidden rounded-full bg-white/10" },
                React.createElement(motion.div, { className: "h-full bg-amber", animate: { width: `${s.xp % 100}%` } }))),
        React.createElement(Daily, null),
        React.createElement("section", null,
            React.createElement("h2", { className: "mb-3 font-bold" }, "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043D\u043E\u043C\u0435\u0440\u0430"),
            s.plates.length ? React.createElement("div", { className: "flex gap-4 overflow-x-auto pb-3" }, s.plates.slice(0, 8).map(p => React.createElement("div", { key: p.id, className: "space-y-2" },
                React.createElement(LicensePlate, { plate: p, onClick: () => setM(p) }),
                React.createElement("div", { className: "flex justify-between text-xs" },
                    React.createElement(Badge, { r: p.rarity }),
                    React.createElement("span", null,
                        p.value,
                        " \u043C.")))))
                : React.createElement("div", { className: `${card} p-6 text-white/60` }, "\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u043F\u0443\u0441\u0442\u0430. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u00AB\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440\u00BB, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0435\u0440\u0432\u044B\u0439.")));
}
function Reel({ ch, pool, spin, dur }) {
    const [go, setGo] = useState(false);
    const strip = useMemo(() => spin ? [...Array.from({ length: 16 }, () => pool[Math.floor(Math.random() * pool.length)]), ch] : [ch], [ch, spin]);
    useEffect(() => { const t = setTimeout(() => setGo(true), 60); return () => clearTimeout(t); }, []);
    return React.createElement("span", { className: "relative inline-block overflow-hidden align-middle", style: { height: "1.15em", width: "0.62em" } },
        React.createElement("span", { className: "flex flex-col items-center", style: { transform: go ? `translateY(-${(strip.length - 1) * 1.15}em)` : "none", transition: `transform ${dur}ms cubic-bezier(.2,.75,.25,1)` } }, strip.map((c, i) => React.createElement("span", { key: i, style: { height: "1.15em", lineHeight: "1.15em" } }, c))));
}
function ReelPlate({ p, sp }) {
    const D = "0123456789".split("");
    let i = 0;
    const d = () => 700 + (i++) * 190;
    const cell = (c, pool, spin, k) => React.createElement(Reel, { key: k, ch: c, pool: pool, spin: spin, dur: spin ? d() : 0 });
    return React.createElement("div", { className: "relative inline-flex h-[92px] w-[min(92vw,420px)] items-stretch overflow-hidden rounded-[10px] border-2 border-black bg-plate font-plate text-[60px] font-semibold text-black shadow-2xl" },
        React.createElement("span", { className: "flex flex-1 items-center justify-center leading-none tracking-[0.04em]" },
            cell(p.letters[0], LETTERS, sp.letters, "a"),
            [0, 1, 2].map(n => cell(p.digits[n], D, sp.digits, "d" + n)),
            [1, 2].map(n => cell(p.letters[n], LETTERS, sp.letters, "l" + n))),
        React.createElement("span", { className: "flex w-[27%] flex-col items-center justify-center border-l-2 border-black leading-none" },
            React.createElement("span", { className: "text-[44px]" }, p.region.split("").map((c, n) => cell(c, D, sp.region, "r" + n))),
            React.createElement("span", { className: "mt-0.5 flex items-center gap-1 text-[17px] font-medium" },
                "RUS",
                React.createElement("i", { className: "inline-block h-[0.9em] w-[1.3em]", style: { background: "linear-gradient(#fff 33%,#1f4fd8 33% 66%,#d52b1e 66%)", outline: "1px solid #0003" } }))));
}
function Open({ setM }) {
    const { openPlate } = useGame();
    const [st, setSt] = useState("idle");
    const [p, setP] = useState(null);
    const [mode, setMode] = useState("all");
    const [lv, setLv] = useState("");
    const [reg, setReg] = useState("");
    const [sp, setSp] = useState({ letters: true, digits: true, region: true });
    const LAT = "ABEKMHOPCTYX";
    const clean = (v, m) => m === "letters" ? v.toUpperCase().split("").map(c => LAT.includes(c) ? LETTERS[LAT.indexOf(c)] : c).filter(c => LETTERS.includes(c)).join("").slice(0, 3) : v.replace(/\D/g, "").slice(0, 3);
    const valid = mode === "all" || (lv.length === 3 && lv !== "000");
    const pick = (m, v = "") => { setMode(m); setLv(v); };
    const run = () => { if (!valid)
        return; const n = openPlate({ ...(mode === "letters" ? { letters: lv } : mode === "digits" ? { digits: lv } : {}), ...(reg ? { region: reg } : {}) }); if (!n)
        return; setP(n); setSp({ letters: mode !== "letters", digits: mode !== "digits", region: !reg }); setSt("scan"); setTimeout(() => setSt("done"), 2500); };
    const hot = p && ORDER.indexOf(p.rarity) >= 4;
    const label = mode === "letters" ? "Крутить цифры" : mode === "digits" ? "Крутить буквы" : "Открыть номер";
    return React.createElement("div", { className: "grid min-h-[60vh] place-items-center text-center" },
        React.createElement("div", { className: "w-full" },
            React.createElement("div", { className: "mb-6 flex flex-wrap justify-center gap-2" }, [["all", "Буквы и цифры случайно"], ["letters", "Мои буквы"], ["digits", "Мои цифры"]].map(([k, l]) => React.createElement("button", { key: k, className: mode === k ? primary : ghost, onClick: () => pick(k, k === mode ? lv : "") }, l))),
            mode !== "all" && React.createElement("div", { className: "mb-6" },
                React.createElement("input", { value: lv, onChange: e => setLv(clean(e.target.value, mode)), maxLength: 3, placeholder: mode === "letters" ? "АВС" : "777", "aria-label": mode === "letters" ? "Ваши буквы" : "Ваши цифры", className: "w-40 rounded-xl border border-line bg-asphalt px-3 py-2.5 text-center font-plate text-3xl tracking-[0.15em]" }),
                React.createElement("p", { className: "mt-2 text-sm text-white/50" }, mode === "letters" ? "Введите 3 буквы: А В Е К М Н О Р С Т У Х. Будут меняться цифры и регион." : "Введите 3 цифры от 001 до 999. Будут меняться буквы и регион.")),
            React.createElement("div", { className: "mb-6" },
                React.createElement("select", { value: reg, onChange: e => setReg(e.target.value), "aria-label": "\u0420\u0435\u0433\u0438\u043E\u043D", className: "rounded-xl border border-line bg-asphalt px-3 py-2.5 text-sm" },
                    React.createElement("option", { value: "" }, "\u041B\u044E\u0431\u043E\u0439 \u0440\u0435\u0433\u0438\u043E\u043D"),
                    [...REGIONS].sort((a, b) => Number(a) - Number(b)).map(x => React.createElement("option", { key: x, value: x },
                        "\u0420\u0435\u0433\u0438\u043E\u043D ",
                        x)))),
            React.createElement(AnimatePresence, { mode: "wait" },
                st === "idle" && React.createElement(motion.div, { key: "i", exit: { opacity: 0 } },
                    React.createElement("div", { className: "mx-auto mb-6 grid h-24 w-[280px] place-items-center rounded-xl border-2 border-dashed border-line font-plate text-4xl text-white/30" }, "? ??? ??"),
                    React.createElement("button", { className: `${primary} px-8 py-3 text-base`, style: { opacity: valid ? 1 : .4 }, disabled: !valid, onClick: run }, label),
                    React.createElement("p", { className: "mt-3 text-sm text-white/50" }, "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E \u0438 \u0431\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0439")),
                st === "scan" && p && React.createElement(motion.div, { key: "s", className: "space-y-4" },
                    React.createElement("div", { className: "flex justify-center" },
                        React.createElement(ReelPlate, { p: p, sp: sp })),
                    React.createElement("p", { className: "text-white/50" }, "\u041A\u0440\u0443\u0442\u0438\u043C \u0431\u0430\u0440\u0430\u0431\u0430\u043D\u2026")),
                st === "done" && p && React.createElement(motion.div, { key: "d", initial: { scale: .7, opacity: 0, rotateX: 40 }, animate: { scale: 1, opacity: 1, rotateX: 0 }, transition: { type: "spring", stiffness: 180, damping: 16 }, className: "space-y-4" },
                    hot && React.createElement(motion.div, { className: "fixed inset-0 -z-0 pointer-events-none", style: { background: `radial-gradient(circle at center,${TIERS[p.rarity].color}33,transparent 60%)` }, initial: { opacity: 0 }, animate: { opacity: [0, 1, .5] }, transition: { duration: 1.6 } }),
                    React.createElement("div", { className: "flex justify-center" },
                        React.createElement(LicensePlate, { plate: p, size: "lg", interactive: false })),
                    React.createElement("div", { className: "flex items-center justify-center gap-2" },
                        React.createElement(Badge, { r: p.rarity }),
                        React.createElement("span", { className: "font-bold" },
                            "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: ",
                            p.value)),
                    React.createElement("div", { className: "flex flex-wrap justify-center gap-2" },
                        React.createElement("button", { className: primary, style: { opacity: valid ? 1 : .4 }, disabled: !valid, onClick: run }, mode === "all" ? "Открыть ещё" : label),
                        React.createElement("button", { className: ghost, onClick: () => pick("letters", p.letters) }, "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0431\u0443\u043A\u0432\u044B"),
                        React.createElement("button", { className: ghost, onClick: () => pick("digits", p.digits) }, "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0446\u0438\u0444\u0440\u044B"),
                        React.createElement("button", { className: ghost, onClick: () => setReg(p.region) }, "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D"),
                        React.createElement("button", { className: ghost, onClick: () => setM(p) }, "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435"))))));
}
function Filters({ q, setQ, r, setR, extra }) {
    const f = "rounded-xl border border-line bg-asphalt px-3 py-2.5 text-sm";
    return React.createElement("div", { className: "flex flex-wrap gap-2" },
        React.createElement("input", { className: `${f} min-w-[180px] flex-1`, placeholder: "\u041D\u043E\u043C\u0435\u0440, \u0446\u0438\u0444\u0440\u044B, \u0431\u0443\u043A\u0432\u044B \u0438\u043B\u0438 \u0440\u0435\u0433\u0438\u043E\u043D", value: q, onChange: e => setQ(e.target.value) }),
        React.createElement("select", { className: f, value: r, onChange: e => setR(e.target.value), "aria-label": "\u0420\u0435\u0434\u043A\u043E\u0441\u0442\u044C" },
            React.createElement("option", { value: "" }, "\u041B\u044E\u0431\u0430\u044F \u0440\u0435\u0434\u043A\u043E\u0441\u0442\u044C"),
            ORDER.map(x => React.createElement("option", { key: x, value: x }, TIERS[x].label))),
        extra);
}
const match = (p, q, r) => { const t = plateText(p) + " " + p.region + " " + TIERS[p.rarity].label; return (!r || p.rarity === r) && (!q || t.toLowerCase().replace(/\s/g, "").includes(q.toLowerCase().replace(/\s/g, ""))); };
function Collection({ setM }) {
    const { s, ready } = useGame();
    const [q, setQ] = useState(""), [r, setR] = useState(""), [reg, setReg] = useState(""), [sort, setSort] = useState("new"), [list, setList] = useState(false), [max, setMax] = useState("");
    const items = useMemo(() => {
        const a = s.plates.filter(p => match(p, q, r) && (!reg || p.region === reg) && (!max || p.value <= Number(max)));
        return sort === "val" ? [...a].sort((x, y) => y.value - x.value) : sort === "rar" ? [...a].sort((x, y) => y.score - x.score) : a;
    }, [s.plates, q, r, reg, sort, max]);
    const f = "rounded-xl border border-line bg-asphalt px-3 py-2.5 text-sm";
    return React.createElement("div", { className: "space-y-4" },
        React.createElement("h1", { className: "text-2xl font-extrabold" }, "\u041C\u043E\u044F \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F"),
        React.createElement(Filters, { q: q, setQ: setQ, r: r, setR: setR, extra: React.createElement(React.Fragment, null,
                React.createElement("select", { className: f, value: reg, onChange: e => setReg(e.target.value), "aria-label": "\u0420\u0435\u0433\u0438\u043E\u043D" },
                    React.createElement("option", { value: "" }, "\u041B\u044E\u0431\u043E\u0439 \u0440\u0435\u0433\u0438\u043E\u043D"),
                    REGIONS.map(x => React.createElement("option", { key: x }, x))),
                React.createElement("input", { className: `${f} w-28`, type: "number", placeholder: "\u0426\u0435\u043D\u0430 \u0434\u043E", value: max, onChange: e => setMax(e.target.value) }),
                React.createElement("select", { className: f, value: sort, onChange: e => setSort(e.target.value), "aria-label": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430" },
                    React.createElement("option", { value: "new" }, "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u043E\u0432\u044B\u0435"),
                    React.createElement("option", { value: "val" }, "\u041F\u043E \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438"),
                    React.createElement("option", { value: "rar" }, "\u041F\u043E \u0440\u0435\u0434\u043A\u043E\u0441\u0442\u0438")),
                React.createElement("button", { className: ghost, onClick: () => setList(!list) }, list ? "Сетка" : "Список")) }),
        !ready ? React.createElement("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4" }, Array.from({ length: 8 }).map((_, i) => React.createElement("div", { key: i, className: "h-28 animate-pulse rounded-2xl bg-graphite" })))
            : !items.length ? React.createElement("div", { className: `${card} p-8 text-center text-white/60` }, s.plates.length ? "Ничего не найдено. Сбросьте фильтры." : "Здесь появятся ваши номера. Откройте первый.")
                : React.createElement("div", { className: list ? "space-y-2" : "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3" }, items.map(p => React.createElement(motion.div, { layout: true, key: p.id, className: `${card} flex ${list ? "items-center justify-between gap-3 p-3" : "flex-col items-center gap-3 p-4"}` },
                    React.createElement(LicensePlate, { plate: p, size: list ? "sm" : "md" }),
                    React.createElement("div", { className: `flex items-center gap-3 text-sm ${list ? "" : "w-full justify-between"}` },
                        React.createElement(Badge, { r: p.rarity }),
                        React.createElement("span", null,
                            p.value,
                            " \u043C."),
                        React.createElement("span", { className: "text-white/40" }, "\u0412 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438"),
                        React.createElement("button", { className: ghost, onClick: () => setM(p) }, "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440"))))));
}
function Find({ setM }) {
    const { s, players } = useGame();
    const [q, setQ] = useState("777"), [r, setR] = useState("");
    const all = useMemo(() => [...s.plates.map(p => ({ p, o: "Вы" })), ...players.flatMap(pl => pl.plates.map(p => ({ p, o: pl.name })))], [s.plates, players]);
    const res = all.filter(x => match(x.p, q, r)).slice(0, 60);
    return React.createElement("div", { className: "space-y-4" },
        React.createElement("h1", { className: "text-2xl font-extrabold" }, "\u041D\u0430\u0439\u0442\u0438 \u043D\u043E\u043C\u0435\u0440"),
        React.createElement(Filters, { q: q, setQ: setQ, r: r, setR: setR }),
        React.createElement("p", { className: "text-sm text-white/50" },
            "\u041D\u0430\u0439\u0434\u0435\u043D\u043E: ",
            res.length,
            res.length === 60 ? "+" : ""),
        React.createElement("div", { className: "space-y-2" }, res.map(({ p, o }) => React.createElement("div", { key: p.id, className: `${card} flex flex-wrap items-center justify-between gap-3 p-3` },
            React.createElement(LicensePlate, { plate: p, size: "sm" }),
            React.createElement("div", { className: "flex flex-1 flex-wrap items-center justify-end gap-3 text-sm" },
                React.createElement(Badge, { r: p.rarity }),
                React.createElement("span", null, o),
                React.createElement("span", null,
                    p.value,
                    " \u043C."),
                React.createElement("span", { className: "text-white/40" }, o === "Вы" ? "У вас" : "Не продаётся"),
                React.createElement("button", { className: ghost, onClick: () => setM(p, o) }, "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435"))))));
}
function Trade() {
    var _a, _b, _c, _d;
    const { s, players, trade } = useGame();
    const [who, setWho] = useState((_b = (_a = players[0]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""), [mine, setMine] = useState([]), [theirs, setTheirs] = useState([]), [ok, setOk] = useState(false);
    const pl = players.find(p => p.name === who);
    const give = s.plates.filter(p => mine.includes(p.id)), get = (_c = pl === null || pl === void 0 ? void 0 : pl.plates.filter(p => theirs.includes(p.id))) !== null && _c !== void 0 ? _c : [];
    const tog = (a, set, id) => set(a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
    const diff = worth(get) - worth(give);
    const List = ({ ps, sel, set }) => React.createElement("div", { className: "flex max-h-72 flex-col gap-2 overflow-y-auto pr-1" }, ps.slice(0, 40).map(p => React.createElement("div", { key: p.id, className: "flex items-center justify-between gap-2" },
        React.createElement(LicensePlate, { plate: p, size: "sm", selected: sel.includes(p.id), onClick: () => tog(sel, set, p.id) }),
        React.createElement("span", { className: "text-xs text-white/60" },
            p.value,
            " \u043C."))));
    return React.createElement("div", { className: "space-y-4" },
        React.createElement("h1", { className: "text-2xl font-extrabold" }, "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u043E\u0431\u043C\u0435\u043D"),
        React.createElement("select", { className: "rounded-xl border border-line bg-asphalt px-3 py-2.5", value: who, onChange: e => { setWho(e.target.value); setTheirs([]); }, "aria-label": "\u0418\u0433\u0440\u043E\u043A" }, players.map(p => React.createElement("option", { key: p.name }, p.name))),
        React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
            React.createElement("div", { className: `${card} p-4` },
                React.createElement("h2", { className: "mb-3 font-bold" }, "\u041C\u043E\u0438 \u043D\u043E\u043C\u0435\u0440\u0430"),
                s.plates.length ? React.createElement(List, { ps: s.plates, sel: mine, set: setMine }) : React.createElement("p", { className: "text-white/60" }, "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043D\u043E\u043C\u0435\u0440\u0430.")),
            React.createElement("div", { className: `${card} p-4` },
                React.createElement("h2", { className: "mb-3 font-bold" },
                    "\u041D\u043E\u043C\u0435\u0440\u0430 \u0438\u0433\u0440\u043E\u043A\u0430 ",
                    who),
                React.createElement(List, { ps: (_d = pl === null || pl === void 0 ? void 0 : pl.plates) !== null && _d !== void 0 ? _d : [], sel: theirs, set: setTheirs }))),
        React.createElement("button", { className: primary, disabled: !give.length || !get.length, style: { opacity: give.length && get.length ? 1 : .4 }, onClick: () => setOk(true) }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435"),
        React.createElement(AnimatePresence, null, ok && React.createElement(motion.div, { className: "fixed inset-0 z-50 grid place-items-center bg-black/70 p-4", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
            React.createElement(motion.div, { className: `${card} w-full max-w-md space-y-4 p-6`, initial: { y: 20 }, animate: { y: 0 } },
                React.createElement("h2", { className: "text-lg font-bold" },
                    "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043E\u0431\u043C\u0435\u043D \u0441 ",
                    who),
                React.createElement("div", null,
                    React.createElement("div", { className: "mb-2 text-sm text-white/50" },
                        "\u0412\u044B \u043E\u0442\u0434\u0430\u0451\u0442\u0435 (",
                        worth(give),
                        " \u043C.)"),
                    React.createElement("div", { className: "flex flex-wrap gap-2" }, give.map(p => React.createElement(LicensePlate, { key: p.id, plate: p, size: "sm", interactive: false })))),
                React.createElement("div", null,
                    React.createElement("div", { className: "mb-2 text-sm text-white/50" },
                        "\u0412\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0435 (",
                        worth(get),
                        " \u043C.)"),
                    React.createElement("div", { className: "flex flex-wrap gap-2" }, get.map(p => React.createElement(LicensePlate, { key: p.id, plate: p, size: "sm", interactive: false })))),
                React.createElement("p", { className: `text-sm ${diff < 0 ? "text-amber" : "text-white/60"}` },
                    diff < 0 ? `Вы теряете ${-diff} стоимости. ` : "",
                    "\u041E\u0431\u043C\u0435\u043D \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C."),
                React.createElement("div", { className: "flex gap-2" },
                    React.createElement("button", { className: ghost, onClick: () => setOk(false) }, "\u041E\u0442\u043C\u0435\u043D\u0430"),
                    React.createElement("button", { className: `${primary} flex-1`, onClick: () => { trade(give, get, who); setOk(false); setMine([]); setTheirs([]); } }, "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043E\u0431\u043C\u0435\u043D"))))));
}
function Rank() {
    const { s, players } = useGame();
    const [m, setM] = useState("count");
    const rows = [...players.map(p => ({ n: p.name, pl: p.plates, xp: p.plates.length * 40 })), { n: "Вы", pl: s.plates, xp: s.xp }].map(x => ({ n: x.n, count: x.pl.length, val: worth(x.pl), rare: x.pl.filter(p => ORDER.indexOf(p.rarity) >= 2).length, lvl: level(x.xp) }));
    const key = { count: "count", val: "val", rare: "rare", lvl: "lvl" }[m];
    const sorted = [...rows].sort((a, b) => b[key] - a[key]).slice(0, 10);
    return React.createElement("div", { className: "space-y-4" },
        React.createElement("h1", { className: "text-2xl font-extrabold" }, "\u0420\u0435\u0439\u0442\u0438\u043D\u0433"),
        React.createElement("div", { className: "flex flex-wrap gap-2" }, [["count", "По количеству"], ["val", "По стоимости"], ["rare", "По редким"], ["lvl", "По уровню"]].map(([k, l]) => React.createElement("button", { key: k, className: m === k ? primary : ghost, onClick: () => setM(k) }, l))),
        React.createElement("ol", { className: "space-y-2" }, sorted.map((r, i) => React.createElement("li", { key: r.n, className: `${card} flex items-center gap-4 p-3 ${r.n === "Вы" ? "border-amber" : ""}` },
            React.createElement("span", { className: "w-6 text-center font-bold" }, i + 1),
            React.createElement("span", { className: "flex-1 font-semibold" }, r.n),
            React.createElement("span", { className: "font-bold" }, r[key].toLocaleString("ru-RU"))))));
}
function Ach() {
    const { s } = useGame();
    return React.createElement("div", { className: "space-y-4" },
        React.createElement("h1", { className: "text-2xl font-extrabold" },
            "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F \u00B7 ",
            s.ach.length,
            "/",
            ACHIEVEMENTS.length),
        React.createElement("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4" }, ACHIEVEMENTS.map(a => { const on = s.ach.includes(a.id); return React.createElement("div", { key: a.id, className: `${card} p-4 ${on ? "border-amber" : "opacity-50"}` },
            React.createElement("div", { className: `mb-3 grid h-10 w-10 place-items-center rounded-full ${on ? "bg-amber text-black" : "bg-white/10"}` }, on ? "★" : "🔒"),
            React.createElement("div", { className: "font-bold" }, a.title),
            React.createElement("div", { className: "text-sm text-white/60" }, a.desc)); })),
        React.createElement("h2", { className: "pt-4 font-bold" }, "\u0418\u0441\u0442\u043E\u0440\u0438\u044F"),
        React.createElement("ul", { className: "space-y-1 text-sm text-white/60" }, s.log.slice(0, 10).map((l, i) => React.createElement("li", { key: i },
            l.t,
            l.d ? ` · +${l.d} монет` : ""))));
}
function Shell() {
    const { s, toast } = useGame();
    const [v, setV] = useState("home");
    const [m, setM] = useState(null);
    const open = (p, o) => setM({ p, o });
    return React.createElement("div", { className: "min-h-screen pb-24 md:pb-0" },
        React.createElement("header", { className: "sticky top-0 z-40 border-b border-line bg-asphalt/85 backdrop-blur" },
            React.createElement("div", { className: "mx-auto flex max-w-6xl items-center gap-6 px-4 py-3" },
                React.createElement("button", { className: "text-xl font-extrabold", onClick: () => setV("home") }, "\u0417\u043D\u0430\u043A"),
                React.createElement("nav", { className: "hidden flex-1 gap-1 md:flex", "aria-label": "\u0420\u0430\u0437\u0434\u0435\u043B\u044B" }, NAV.map(([k, l]) => React.createElement("button", { key: k, onClick: () => setV(k), className: `rounded-lg px-3 py-1.5 text-sm ${v === k ? "bg-white/10 font-semibold" : "text-white/60 hover:text-white"}` }, l))),
                React.createElement("div", { className: "ml-auto flex items-center gap-3 text-sm" },
                    React.createElement("span", { className: "font-bold text-amber" },
                        React.createElement(Count, { v: worth(s.plates) }),
                        " \u20BD"),
                    React.createElement("span", { className: "text-white/60" },
                        "\u0423\u0440. ",
                        level(s.xp)),
                    React.createElement("span", { className: "grid h-8 w-8 place-items-center rounded-full bg-flag font-bold" }, "\u042F")))),
        React.createElement("main", { className: "mx-auto max-w-6xl px-4 py-6" },
            React.createElement(AnimatePresence, { mode: "wait" },
                React.createElement(motion.div, { key: v, initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: .18 } },
                    v === "home" && React.createElement(Home, { go: setV, setM: open }),
                    v === "collection" && React.createElement(Collection, { setM: open }),
                    v === "open" && React.createElement(Open, { setM: open }),
                    v === "find" && React.createElement(Find, { setM: open }),
                    v === "trade" && React.createElement(Trade, null),
                    v === "rank" && React.createElement(Rank, null),
                    v === "ach" && React.createElement(Ach, null)))),
        React.createElement("nav", { className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-asphalt/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden", "aria-label": "\u0420\u0430\u0437\u0434\u0435\u043B\u044B" },
            NAV.filter(([k]) => k !== "ach").map(([k, l]) => React.createElement("button", { key: k, onClick: () => setV(k), className: `py-3 text-xs ${v === k ? "font-bold text-amber" : "text-white/60"}` }, l)),
            React.createElement("button", { onClick: () => setV("ach"), className: `py-3 text-xs ${v === "ach" ? "font-bold text-amber" : "text-white/60"}` }, "\u041D\u0430\u0433\u0440\u0430\u0434\u044B")),
        React.createElement(AnimatePresence, null, m && React.createElement(PlateModal, { p: m.p, owner: m.o, onClose: () => setM(null) })),
        React.createElement(AnimatePresence, null, toast && React.createElement(motion.div, { role: "status", className: "fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-sm rounded-xl bg-plate px-4 py-3 text-center text-sm font-semibold text-black shadow-xl md:bottom-6", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { opacity: 0 } }, toast)));
}
function Game() { return React.createElement(Provider, null,
    React.createElement(Shell, null)); }

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Game));
})();

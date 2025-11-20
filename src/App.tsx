import { useEffect, useRef, useState } from "react";

type Entry = { id: string; text: string; at: string };
type Emotion = { emotion_id: number; emotion_name: string; polarity: number; strength: number };

// --- Sidebar width constants
const LS_SIDEBAR_W = "jewel_sidebar_w";
const MIN_W = 200;
const MAX_W = 420;

export default function App() {
    /* ------------------------------
            STATES
    ------------------------------ */
    const [text, setText] = useState("");
    const [list, setList] = useState<Entry[]>([]);
    const [emotions, setEmotions] = useState<Emotion[]>([]);
    const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
        const saved = Number(localStorage.getItem(LS_SIDEBAR_W));
        return Number.isFinite(saved)
            ? Math.min(MAX_W, Math.max(MIN_W, saved))
            : 256;
    });

    const resizingRef = useRef(false);

    /* ------------------------------
            Fetch emotion list from API
    ------------------------------ */
    useEffect(() => {
        async function loadEmotions() {
            try {
                const res = await fetch("http://localhost:3000/emotion");
                const data = await res.json();
                console.log("Emotion API:", data);
                setEmotions(data);
            } catch (err) {
                console.error("Emotion API error:", err);
            }
        }
        loadEmotions();
    }, []);

    /* ------------------------------
            Sidebar width persistence
    ------------------------------ */
    useEffect(() => {
        localStorage.setItem(LS_SIDEBAR_W, String(sidebarWidth));
    }, [sidebarWidth]);

    /* ------------------------------
            Drag resize logic
    ------------------------------ */
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!resizingRef.current) return;
            setSidebarWidth((w) =>
                Math.max(MIN_W, Math.min(MAX_W, w + e.movementX))
            );
        };

        const onUp = () => {
            resizingRef.current = false;
            document.body.style.cursor = "";
            document.body.classList.remove("select-none");
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    const startResize = () => {
        resizingRef.current = true;
        document.body.style.cursor = "col-resize";
        document.body.classList.add("select-none");
    };

    /* ------------------------------
            Add a timeline entry
    ------------------------------ */
    const logIt = () => {
        const v = text.trim();
        if (!v) return;
        setList((prev) => [
            { id: crypto.randomUUID(), text: v, at: new Date().toLocaleTimeString() },
            ...prev,
        ]);
        setText("");
    };

    /* ------------------------------
            UI
    ------------------------------ */
    return (
        <div className="h-screen flex bg-backBlack text-textWhite">
            {/* ===== Sidebar ===== */}
            <aside
                style={{ width: sidebarWidth }}
                className="shrink-0 border-r border-darkGray/60 bg-subBlack/60 backdrop-blur-sm flex flex-col"
            >
                <div className="p-4">
                    <h1 className="text-xl font-semibold">Jewel Notes 💎</h1>
                </div>

                <nav className="px-2 space-y-1">
                    <NavItem label="Home" active />
                    <NavItem label="Timeline" />
                    <NavItem label="Search" />
                    <NavItem label="Settings" />
                </nav>

                {/* --- Emotion List Section --- */}
                <div className="px-3 mt-6">
                    <h2 className="text-sm font-semibold text-textGray/70 mb-2">
                        Emotions
                    </h2>

                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {emotions.map((e) => (
                            <div
                                key={e.emotion_id}
                                className="rounded-lg bg-lightBlack/60 px-3 py-2 border border-darkGray/40"
                            >
                                <div className="flex justify-between text-xs">
                                    <span>{e.emotion_name}</span>
                                    <span
                                        className={
                                            e.polarity > 0
                                                ? "text-green-400"
                                                : e.polarity < 0
                                                ? "text-red-400"
                                                : "text-textGray"
                                        }
                                    >
                                        {e.strength}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-4 text-xs text-textGray/80">
                    v0.1.0 • local
                </div>
            </aside>

            {/* Resize handle */}
            <div
                onMouseDown={startResize}
                title="Drag to resize"
                className="w-1 cursor-col-resize hover:bg-orbsIndigo/30 active:bg-orbsIndigo/40"
            />

            {/* ===== Main ===== */}
            <section className="flex-1 flex flex-col">
                <header className="px-6 py-4 border-b border-darkGray/60">
                    <h2 className="text-2xl font-bold">What’s happening now?</h2>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {list.length === 0 ? (
                        <p className="text-textGray">
                            No entries yet. Drop your first one below.
                        </p>
                    ) : (
                        list.map((e) => (
                            <article
                                key={e.id}
                                className="rounded-xl bg-subBlack/60 border border-darkGray/50 px-4 py-3"
                            >
                                <div className="text-sm text-textGray">{e.at}</div>
                                <div className="mt-1">{e.text}</div>
                            </article>
                        ))
                    )}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        logIt();
                    }}
                    className="sticky bottom-0 bg-backBlack/70 backdrop-blur px-4 py-3"
                >
                    <div className="mx-auto max-w-3xl flex gap-2">
                        <input
                            value={text}
                            onChange={(e) => setText(e.currentTarget.value)}
                            placeholder="Drop what’s happening…"
                            className="flex-1 bg-lightBlack border border-darkGray/60 rounded-xl px-4 py-2 placeholder-textGray focus:outline-none focus:ring-2 focus:ring-orbsIndigo/60"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-orbsPurple hover:opacity-90 text-white shadow"
                        >
                            Log it
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

/* ------------------------------
        Sidebar item component
------------------------------ */
function NavItem({ label, active = false }: { label: string; active?: boolean }) {
    return (
        <button
            className={[
                "w-full text-left px-3 py-2 rounded-lg",
                active
                    ? "bg-lightBlack border border-darkGray/60"
                    : "hover:bg-lightBlack/70",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

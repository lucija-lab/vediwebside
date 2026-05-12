"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

interface Delivery { id: string; userId: string; plan: string; address: string; city: string; scheduledDate: string; timeSlot: string; status: string; notes: string; clientName?: string; clientPhone?: string; }

const STATUS_COLOR: Record<string, string> = {
  pending: "#c8963e", assigned: "#3a7a52", delivered: "#6a9a7a", skipped: "#8a9a8a", failed: "#dc2626",
};

export default function LivreurPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"today" | "all">("all");

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "livreur") {
        router.replace("/prijava");
        return;
      }
      const dRes = await fetch("/api/deliveries");
      const dData = await dRes.json();
      setDeliveries(dData.deliveries || []);
      setLoading(false);
    })();
  }, [router]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/deliveries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setDeliveries(d => d.map(x => x.id === id ? { ...x, status } : x));
  };

  const today = new Date().toISOString().split("T")[0];
  const displayed = filter === "today"
    ? deliveries.filter(d => d.scheduledDate === today && d.status !== "delivered" && d.status !== "skipped")
    : deliveries.filter(d => d.status !== "delivered" && d.status !== "skipped");

  const done = deliveries.filter(d => d.scheduledDate === today && (d.status === "delivered" || d.status === "skipped"));

  const planLabel = (p: string) => ({ taman: "Košara Taman", eko: "Košara Eko", super: "Košara Super" }[p] || p);
  const statusLabel: Record<string, string> = {
    pending: lang === "hr" ? "Na čekanju" : "Pending",
    assigned: lang === "hr" ? "Dodijeljeno" : "Assigned",
    delivered: lang === "hr" ? "Dostavljeno" : "Delivered",
    skipped: lang === "hr" ? "Preskočeno" : "Skipped",
    failed: lang === "hr" ? "Neuspješno" : "Failed",
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#0f1f16", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#6a9a7a" }}>Učitavanje...</p>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0f1f16", color: "#e8f0e4" }}>

      {/* Top bar */}
      <div style={{ background: "#1c3a28", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a4a38" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#c8ddc0", fontFamily: "Georgia, serif" }}>Verdi</span>
          <span style={{ background: "#c8963e33", color: "#c8963e", fontSize: 10, fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {lang === "hr" ? "Livreur" : "Driver"}
          </span>
        </div>
        <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); router.push("/"); }} style={{ background: "none", border: "1px solid #2a4a38", color: "#6a9a7a", padding: "0.4rem 1rem", borderRadius: 50, fontSize: 13, cursor: "pointer" }}>
          {lang === "hr" ? "Odjava" : "Log out"}
        </button>
      </div>

      <div style={{ padding: "1.5rem" }}>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "#1c3a28", borderRadius: 12, padding: "1rem", textAlign: "center", border: "1px solid #2a4a38" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#c8963e" }}>{displayed.length}</p>
            <p style={{ fontSize: 11, color: "#6a9a7a", marginTop: "0.2rem" }}>{lang === "hr" ? "Za danas" : "Today"}</p>
          </div>
          <div style={{ background: "#1c3a28", borderRadius: 12, padding: "1rem", textAlign: "center", border: "1px solid #2a4a38" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#3a7a52" }}>{done.length}</p>
            <p style={{ fontSize: 11, color: "#6a9a7a", marginTop: "0.2rem" }}>{lang === "hr" ? "Završeno" : "Done"}</p>
          </div>
          <div style={{ background: "#1c3a28", borderRadius: 12, padding: "1rem", textAlign: "center", border: "1px solid #2a4a38" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#c8ddc0" }}>{deliveries.length}</p>
            <p style={{ fontSize: 11, color: "#6a9a7a", marginTop: "0.2rem" }}>{lang === "hr" ? "Ukupno" : "Total"}</p>
          </div>
        </div>

        {/* Filter toggle */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["today", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.5rem 1.25rem", borderRadius: 50, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: filter === f ? "#3a7a52" : "#1c3a28", color: filter === f ? "white" : "#6a9a7a" }}>
              {f === "today" ? (lang === "hr" ? "Danas" : "Today") : (lang === "hr" ? "Sve" : "All")}
            </button>
          ))}
        </div>

        {/* Delivery cards */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6a9a7a", fontSize: 15 }}>
            {lang === "hr" ? "Nema dostava za prikaz." : "No deliveries to show."}
          </div>
        ) : displayed.map((d, i) => (
          <div key={d.id} style={{ background: "#1c3a28", borderRadius: 16, padding: "1.5rem", marginBottom: "1rem", border: "1px solid #2a4a38" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontSize: 11, color: "#6a9a7a", marginBottom: "0.25rem" }}>#{i + 1}</p>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#e8f0e4" }}>{planLabel(d.plan)}</p>
              </div>
              <span style={{ background: STATUS_COLOR[d.status] + "33", color: STATUS_COLOR[d.status], padding: "0.3rem 0.8rem", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                {statusLabel[d.status] || d.status}
              </span>
            </div>

            {/* Client info */}
            {(d.clientName || d.clientPhone) && (
              <div style={{ background: "#162d1e", borderRadius: 10, padding: "1rem", marginBottom: "0.75rem" }}>
                <p style={{ fontSize: 13, color: "#6a9a7a", marginBottom: "0.25rem" }}>{lang === "hr" ? "Klijent" : "Client"}</p>
                {d.clientName && <p style={{ fontSize: 15, fontWeight: 600, color: "#e8f0e4" }}>{d.clientName}</p>}
                {d.clientPhone && <p style={{ fontSize: 14, color: "#c8963e" }}>{d.clientPhone}</p>}
              </div>
            )}

            {/* Address */}
            <div style={{ background: "#162d1e", borderRadius: 10, padding: "1rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: 13, color: "#6a9a7a", marginBottom: "0.25rem" }}>{lang === "hr" ? "Adresa dostave" : "Delivery address"}</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#e8f0e4" }}>{d.address}</p>
              <p style={{ fontSize: 14, color: "#c8ddc0" }}>{d.city}</p>
            </div>

            {/* Time slot */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, background: "#162d1e", borderRadius: 10, padding: "0.75rem" }}>
                <p style={{ fontSize: 11, color: "#6a9a7a", marginBottom: "0.2rem" }}>{lang === "hr" ? "Datum" : "Date"}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#e8f0e4" }}>{new Date(d.scheduledDate).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-GB")}</p>
              </div>
              <div style={{ flex: 1, background: "#162d1e", borderRadius: 10, padding: "0.75rem" }}>
                <p style={{ fontSize: 11, color: "#6a9a7a", marginBottom: "0.2rem" }}>{lang === "hr" ? "Termin" : "Time slot"}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#e8f0e4" }}>{d.timeSlot}</p>
              </div>
            </div>

            {/* Actions */}
            {(d.status === "pending" || d.status === "assigned") && (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => updateStatus(d.id, "delivered")} style={{ flex: 1, background: "#3a7a52", color: "white", border: "none", padding: "0.85rem", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  ✓ {lang === "hr" ? "Dostavljeno" : "Delivered"}
                </button>
                <button onClick={() => updateStatus(d.id, "failed")} style={{ background: "#dc262622", color: "#dc2626", border: "1px solid #dc262644", padding: "0.85rem 1.25rem", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {lang === "hr" ? "Problem" : "Issue"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

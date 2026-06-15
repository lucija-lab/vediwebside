"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

interface User { id: string; firstName: string; lastName: string; email: string; phone: string; address: string; city: string; role: string; createdAt: string; }
interface Subscription { userId: string; plan: string; status: string; currentPeriodEnd: string; createdAt: string; }
interface Delivery { id: string; userId: string; plan: string; address: string; city: string; scheduledDate: string; timeSlot: string; status: string; notes: string; livreurId?: string; }

const PLAN_PRICE: Record<string, number> = { taman: 62, eko: 66.5, super: 71 };
const PLAN_LABEL: Record<string, string> = { taman: "Taman", eko: "Eko", super: "Super" };

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  active:    { bg: "#dcfce7", text: "#166534" },
  canceled:  { bg: "#fee2e2", text: "#991b1b" },
  past_due:  { bg: "#fef3c7", text: "#92400e" },
  pending:   { bg: "#fef3c7", text: "#92400e" },
  assigned:  { bg: "#dbeafe", text: "#1e40af" },
  delivered: { bg: "#dcfce7", text: "#166534" },
  skipped:   { bg: "#f3f4f6", text: "#6b7280" },
  failed:    { bg: "#fee2e2", text: "#991b1b" },
};

function Badge({ s }: { s: string }) {
  const c = STATUS_COLOR[s] || { bg: "#f3f4f6", text: "#6b7280" };
  return <span style={{ background: c.bg, color: c.text, padding: "0.25rem 0.7rem", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{s}</span>;
}

export default function AdminPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDelivery, setShowNewDelivery] = useState(false);
  const [newDel, setNewDel] = useState({ userId: "", plan: "taman", scheduledDate: "", timeSlot: "09:00–13:00", notes: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "admin") { router.replace("/prijava"); return; }
      const [uRes, sRes, dRes] = await Promise.all([fetch("/api/admin/users"), fetch("/api/admin/subscriptions"), fetch("/api/deliveries")]);
      const [ud, sd, dd] = await Promise.all([uRes.json(), sRes.json(), dRes.json()]);
      setUsers(ud.users || []);
      setSubs(sd.subscriptions || []);
      setDeliveries(dd.deliveries || []);
      setLoading(false);
    })();
  }, [router]);

  const clients = users.filter(u => u.role === "client");
  const livreurs = users.filter(u => u.role === "livreur");
  const activeSubs = subs.filter(s => s.status === "active");
  const monthlyRevenue = activeSubs.reduce((sum, s) => sum + (PLAN_PRICE[s.plan] || 0), 0);
  const today = new Date().toISOString().split("T")[0];
  const todayDeliveries = deliveries.filter(d => d.scheduledDate === today);
  const upcomingDeliveries = deliveries.filter(d => d.status === "pending" || d.status === "assigned");

  const getUserName = (id: string) => { const u = users.find(x => x.id === id); return u ? `${u.firstName} ${u.lastName}` : "—"; };
  const getUserAddress = (userId: string) => { const u = users.find(x => x.id === userId); return u ? `${u.address}, ${u.city}` : "—"; };

  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    await fetch("/api/deliveries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...updates }) });
    setDeliveries(d => d.map(x => x.id === id ? { ...x, ...updates } : x));
  };

  const deleteDelivery = async (id: string) => {
    if (!confirm(lang === "hr" ? "Obrisati ovu dostavu?" : "Delete this delivery?")) return;
    await fetch("/api/deliveries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setDeliveries(d => d.filter(x => x.id !== id));
  };

  const createDelivery = async () => {
    if (!newDel.userId || !newDel.scheduledDate) return;
    setCreating(true);
    const u = users.find(x => x.id === newDel.userId);
    const res = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newDel, address: u?.address || "", city: u?.city || "", status: "pending" }),
    });
    const data = await res.json();
    if (data.delivery) setDeliveries(d => [...d, data.delivery]);
    setShowNewDelivery(false);
    setNewDel({ userId: "", plan: "taman", scheduledDate: "", timeSlot: "09:00–13:00", notes: "" });
    setCreating(false);
  };

  const tabs = lang === "hr" ? ["Pregled", "Pretplatnici", "Dostave", "Prihodi"] : ["Overview", "Subscribers", "Deliveries", "Revenue"];

  if (loading) return <main style={{ minHeight: "100vh", background: "#0f1f16", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#6a9a7a" }}>Učitavanje...</p></main>;

  return (
    <main style={{ minHeight: "100vh", background: "#0f1f16", color: "#e8f0e4" }}>

      {/* Top bar */}
      <div style={{ background: "#1c3a28", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a4a38" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#c8ddc0", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}>Verdi</span>
          <span style={{ background: "#3a7a52", color: "#c8ddc0", fontSize: 10, fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin</span>
        </div>
        <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); router.push("/"); }} style={{ background: "none", border: "1px solid #2a4a38", color: "#6a9a7a", padding: "0.4rem 1rem", borderRadius: 50, fontSize: 13, cursor: "pointer" }}>
          {lang === "hr" ? "Odjava" : "Log out"}
        </button>
      </div>

      {/* Tab nav */}
      <div style={{ background: "#162d1e", borderBottom: "1px solid #2a4a38", padding: "0 2rem" }}>
        <div style={{ display: "flex" }}>
          {tabs.map((label, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ padding: "1rem 1.5rem", background: "none", border: "none", borderBottom: tab === i ? "2px solid #3a7a52" : "2px solid transparent", fontSize: 14, fontWeight: tab === i ? 700 : 400, color: tab === i ? "#c8ddc0" : "#6a9a7a", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>

        {/* ── TAB 0: Overview ── */}
        {tab === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              {[
                { label: lang === "hr" ? "Aktivnih klijenata" : "Active clients", value: clients.length, color: "#c8ddc0" },
                { label: lang === "hr" ? "Aktivnih pretplata" : "Active subscriptions", value: activeSubs.length, color: "#3a7a52" },
                { label: lang === "hr" ? "Prihod/mj." : "Revenue/mo.", value: monthlyRevenue.toFixed(2) + "€", color: "#c8963e" },
                { label: lang === "hr" ? "Dostave danas" : "Deliveries today", value: todayDeliveries.length, color: "#6a9a7a" },
              ].map((stat, i) => (
                <div key={i} style={{ background: "#1c3a28", borderRadius: 16, padding: "1.5rem", border: "1px solid #2a4a38" }}>
                  <p style={{ fontSize: 11, color: "#6a9a7a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#1c3a28", borderRadius: 16, padding: "1.5rem", border: "1px solid #2a4a38" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8ddc0" }}>{lang === "hr" ? "Nadolazeće dostave" : "Upcoming deliveries"}</h3>
                <button onClick={() => { setTab(2); setShowNewDelivery(true); }} style={{ background: "#3a7a52", color: "white", border: "none", padding: "0.45rem 1rem", borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  + {lang === "hr" ? "Nova dostava" : "New delivery"}
                </button>
              </div>
              {upcomingDeliveries.slice(0, 6).map(d => (
                <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #2a4a38", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <p style={{ fontSize: 14, color: "#e8f0e4", fontWeight: 600 }}>{getUserName(d.userId)} — {PLAN_LABEL[d.plan] || d.plan}</p>
                    <p style={{ fontSize: 12, color: "#6a9a7a" }}>{d.scheduledDate} · {d.timeSlot} · {d.address}, {d.city}</p>
                  </div>
                  <Badge s={d.status} />
                </div>
              ))}
              {upcomingDeliveries.length === 0 && <p style={{ color: "#6a9a7a", fontSize: 14 }}>{lang === "hr" ? "Nema nadolazećih dostava." : "No upcoming deliveries."}</p>}
            </div>
          </div>
        )}

        {/* ── TAB 1: Subscribers ── */}
        {tab === 1 && (
          <div style={{ background: "#1c3a28", borderRadius: 16, border: "1px solid #2a4a38", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "#162d1e" }}>
                  {["Ime i prezime", "Email", "Telefon", "Plan", "Status", "Grad", "Datum"].map((h, i) => (
                    <th key={i} style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6a9a7a", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#6a9a7a", fontSize: 14 }}>{lang === "hr" ? "Nema klijenata." : "No clients yet."}</td></tr>
                )}
                {clients.map(u => {
                  const userSub = subs.find(s => s.userId === u.id);
                  return (
                    <tr key={u.id} style={{ borderTop: "1px solid #2a4a38" }}>
                      <td style={{ padding: "0.85rem 1rem", fontSize: 14, color: "#e8f0e4", fontWeight: 600, whiteSpace: "nowrap" }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: 13, color: "#6a9a7a" }}>{u.email}</td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: 13, color: "#6a9a7a" }}>{u.phone || "—"}</td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: 13, color: "#c8ddc0", fontWeight: 600 }}>{userSub ? PLAN_LABEL[userSub.plan] || userSub.plan : "—"}</td>
                      <td style={{ padding: "0.85rem 1rem" }}>{userSub ? <Badge s={userSub.status} /> : <span style={{ color: "#6a9a7a", fontSize: 13 }}>—</span>}</td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: 13, color: "#6a9a7a" }}>{u.city}</td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: 13, color: "#6a9a7a", whiteSpace: "nowrap" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 2: Deliveries ── */}
        {tab === 2 && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
              <button onClick={() => setShowNewDelivery(true)} style={{ background: "#3a7a52", color: "white", border: "none", padding: "0.6rem 1.5rem", borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                + {lang === "hr" ? "Nova dostava" : "New delivery"}
              </button>
            </div>

            {/* New delivery modal */}
            {showNewDelivery && (
              <div style={{ background: "#1c3a28", borderRadius: 16, padding: "1.75rem", marginBottom: "1.5rem", border: "1px solid #3a7a52" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8ddc0", marginBottom: "1.25rem" }}>{lang === "hr" ? "Nova dostava" : "New delivery"}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={lbl}>Klijent</label>
                    <select value={newDel.userId} onChange={e => setNewDel(f => ({ ...f, userId: e.target.value }))} style={sel}>
                      <option value="">— Odaberi klijenta —</option>
                      {clients.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.city})</option>)}
                    </select>
                    {newDel.userId && <p style={{ fontSize: 11, color: "#6a9a7a", marginTop: "0.3rem" }}>{getUserAddress(newDel.userId)}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Panier</label>
                    <select value={newDel.plan} onChange={e => setNewDel(f => ({ ...f, plan: e.target.value }))} style={sel}>
                      <option value="taman">Taman — 62€</option>
                      <option value="eko">Eko — 66,50€</option>
                      <option value="super">Super — 71€</option>
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Datum dostave</label>
                    <input type="date" value={newDel.scheduledDate} onChange={e => setNewDel(f => ({ ...f, scheduledDate: e.target.value }))} style={sel} />
                  </div>
                  <div>
                    <label style={lbl}>Termin</label>
                    <select value={newDel.timeSlot} onChange={e => setNewDel(f => ({ ...f, timeSlot: e.target.value }))} style={sel}>
                      <option>09:00–13:00</option>
                      <option>13:00–17:00</option>
                      <option>17:00–20:00</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={lbl}>Napomena (opcija)</label>
                  <input type="text" value={newDel.notes} onChange={e => setNewDel(f => ({ ...f, notes: e.target.value }))} placeholder="npr. ostaviti pred vratima" style={{ ...sel, width: "100%", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={createDelivery} disabled={creating || !newDel.userId || !newDel.scheduledDate} style={{ background: "#3a7a52", color: "white", border: "none", padding: "0.7rem 1.75rem", borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: creating ? 0.6 : 1 }}>
                    {creating ? "..." : lang === "hr" ? "Kreiraj dostavu" : "Create delivery"}
                  </button>
                  <button onClick={() => setShowNewDelivery(false)} style={{ background: "none", border: "1px solid #2a4a38", color: "#6a9a7a", padding: "0.7rem 1.25rem", borderRadius: 50, fontSize: 14, cursor: "pointer" }}>
                    {lang === "hr" ? "Odustani" : "Cancel"}
                  </button>
                </div>
              </div>
            )}

            {/* Delivery list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {deliveries.length === 0 && <p style={{ color: "#6a9a7a", fontSize: 14, padding: "2rem", textAlign: "center" }}>{lang === "hr" ? "Nema dostava." : "No deliveries."}</p>}
              {deliveries.map(d => (
                <div key={d.id} style={{ background: "#1c3a28", borderRadius: 16, padding: "1.25rem 1.5rem", border: "1px solid #2a4a38", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#e8f0e4", marginBottom: "0.25rem" }}>
                      {getUserName(d.userId)} — <span style={{ color: "#c8ddc0" }}>{PLAN_LABEL[d.plan] || d.plan}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#6a9a7a" }}>{d.scheduledDate} · {d.timeSlot} · {d.address}, {d.city}</p>
                    {d.notes && <p style={{ fontSize: 12, color: "#c8963e", marginTop: "0.2rem" }}>📝 {d.notes}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <Badge s={d.status} />
                    {d.status === "pending" && livreurs.length > 0 && (
                      <select
                        defaultValue=""
                        onChange={e => { if (e.target.value) updateDelivery(d.id, { status: "assigned", livreurId: e.target.value }); }}
                        style={{ background: "#3a7a52", color: "white", border: "none", padding: "0.4rem 0.75rem", borderRadius: 50, fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                      >
                        <option value="" disabled>{lang === "hr" ? "Dodijeli livreru ▾" : "Assign driver ▾"}</option>
                        {livreurs.map(l => <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>)}
                      </select>
                    )}
                    {d.status === "pending" && livreurs.length === 0 && (
                      <button onClick={() => updateDelivery(d.id, { status: "assigned" })} style={{ background: "#3a7a52", color: "white", border: "none", padding: "0.4rem 1rem", borderRadius: 50, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                        {lang === "hr" ? "Dodijeli" : "Assign"}
                      </button>
                    )}
                    <button onClick={() => deleteDelivery(d.id)} title="Supprimer" style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", padding: "0.3rem", borderRadius: 8, display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: Revenue ── */}
        {tab === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Taman × " + activeSubs.filter(s => s.plan === "taman").length, value: (activeSubs.filter(s => s.plan === "taman").length * 62).toFixed(2) + "€", color: "#c8ddc0" },
                { label: "Eko × " + activeSubs.filter(s => s.plan === "eko").length, value: (activeSubs.filter(s => s.plan === "eko").length * 66.5).toFixed(2) + "€", color: "#6a9a7a" },
                { label: "Super × " + activeSubs.filter(s => s.plan === "super").length, value: (activeSubs.filter(s => s.plan === "super").length * 71).toFixed(2) + "€", color: "#c8963e" },
                { label: lang === "hr" ? "Ukupno/mj." : "Total/mo.", value: monthlyRevenue.toFixed(2) + "€", color: "#3a7a52" },
              ].map((stat, i) => (
                <div key={i} style={{ background: "#1c3a28", borderRadius: 16, padding: "1.5rem", border: "1px solid #2a4a38" }}>
                  <p style={{ fontSize: 12, color: "#6a9a7a", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</p>
                  <p style={{ fontSize: 30, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#1c3a28", borderRadius: 16, padding: "1.75rem", border: "1px solid #2a4a38" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c8ddc0", marginBottom: "1.25rem" }}>{lang === "hr" ? "Pretplate po planu" : "Subscriptions by plan"}</h3>
              {["taman", "eko", "super"].map(plan => {
                const planSubs = activeSubs.filter(s => s.plan === plan);
                return planSubs.length > 0 ? (
                  <div key={plan} style={{ marginBottom: "1.5rem" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#c8ddc0", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {PLAN_LABEL[plan]} — {PLAN_PRICE[plan]}€/mj.
                    </p>
                    {planSubs.map(s => {
                      const u = users.find(x => x.id === s.userId);
                      return (
                        <div key={s.userId} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #2a4a38", alignItems: "center" }}>
                          <span style={{ fontSize: 13, color: "#e8f0e4" }}>{u ? `${u.firstName} ${u.lastName}` : s.userId}</span>
                          <span style={{ fontSize: 13, color: "#c8963e", fontWeight: 700 }}>{PLAN_PRICE[plan]}€</span>
                        </div>
                      );
                    })}
                  </div>
                ) : null;
              })}
              {activeSubs.length === 0 && <p style={{ color: "#6a9a7a", fontSize: 14 }}>{lang === "hr" ? "Nema aktivnih pretplata." : "No active subscriptions."}</p>}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#6a9a7a", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" };
const sel: React.CSSProperties = { background: "#162d1e", border: "1px solid #2a4a38", color: "#e8f0e4", padding: "0.6rem 0.75rem", borderRadius: 8, fontSize: 13, width: "100%" };

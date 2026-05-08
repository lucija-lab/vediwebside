"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: {
    loading: "Učitavanje vašeg računa...",
    tabs: ["Pretplata", "Dostave", "Profil"],
    noSub: "Još niste pretplatnik",
    noSubDesc: "Odaberite košaricu i počnite primati svježe sezonsko povrće svaka 2 tjedna.",
    choosePlan: "Pogledaj košarice",
    plan: "Vaš plan", nextBilling: "Sljedeća naplata", since: "Pretplatnik od",
    active: "Aktivan", canceled: "Otkazan", past_due: "Kašnjenje plaćanja", paused: "Pauzirano",
    taman: "Košara Taman", super: "Košara Super",
    tamanDesc: "min. 7 kg · 6+ kultura · svaka 2 tjedna",
    superDesc: "min. 10,5 kg · 7+ kultura · svaka 2 tjedna",
    manageBilling: "Upravljanje plaćanjem (Stripe)",
    noDeliveries: "Nema planiranih dostava",
    upcoming: "Nadolazeće dostave", past: "Prošle dostave",
    skip: "Preskoči dostavu", skipped: "Preskočeno",
    delivered: "Dostavljeno", pending: "Planirano", failed: "Neuspješno", assigned: "U tijeku",
    editSlot: "Promijeniti termin", saveSlot: "Spremi", cancelEdit: "Odustani",
    livreurContact: "Kontakt livreur",
    profileTitle: "Moji podaci",
    firstName: "Ime", lastName: "Prezime", email: "E-mail adresa", phone: "Broj telefona",
    address: "Adresa dostave", city: "Grad",
    save: "Spremi promjene", saving: "Spremanje...", saved: "✓ Promjene spremljene",
    logout: "Odjava",
    verifying: "Provjera pretplate...",
  },
  en: {
    loading: "Loading your account...",
    tabs: ["Subscription", "Deliveries", "Profile"],
    noSub: "No active subscription",
    noSubDesc: "Choose a basket and start receiving fresh seasonal vegetables every 2 weeks.",
    choosePlan: "View baskets",
    plan: "Your plan", nextBilling: "Next billing", since: "Member since",
    active: "Active", canceled: "Canceled", past_due: "Payment overdue", paused: "Paused",
    taman: "Taman Basket", super: "Super Basket",
    tamanDesc: "min. 7 kg · 6+ varieties · every 2 weeks",
    superDesc: "min. 10.5 kg · 7+ varieties · every 2 weeks",
    manageBilling: "Manage billing (Stripe)",
    noDeliveries: "No scheduled deliveries",
    upcoming: "Upcoming deliveries", past: "Past deliveries",
    skip: "Skip delivery", skipped: "Skipped",
    delivered: "Delivered", pending: "Scheduled", failed: "Failed", assigned: "In progress",
    editSlot: "Change slot", saveSlot: "Save", cancelEdit: "Cancel",
    livreurContact: "Driver contact",
    profileTitle: "My details",
    firstName: "First name", lastName: "Last name", email: "Email address", phone: "Phone number",
    address: "Delivery address", city: "City",
    save: "Save changes", saving: "Saving...", saved: "✓ Changes saved",
    logout: "Log out",
    verifying: "Verifying subscription...",
  },
};

interface User { id: string; firstName: string; lastName: string; email: string; phone: string; address: string; city: string; role: string; }
interface Subscription { plan: string; status: string; currentPeriodEnd: string; createdAt: string; stripeCustomerId: string; }
interface Delivery { id: string; plan: string; scheduledDate: string; timeSlot: string; status: string; address: string; city: string; livreurPhone?: string; livreurName?: string; }

export default function ComptePage() {
  const { lang } = useLang();
  const tx = t[lang];
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", address: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "client") {
        router.replace("/prijava?redirect=/compte");
        return;
      }
      setUser(meData.user);
      setForm({
        firstName: meData.user.firstName,
        lastName: meData.user.lastName,
        phone: meData.user.phone || "",
        address: meData.user.address,
        city: meData.user.city,
      });

      // Load local subscription data
      const [subRes, delRes] = await Promise.all([
        fetch("/api/subscription"),
        fetch("/api/deliveries"),
      ]);
      const subData = await subRes.json();
      const delData = await delRes.json();
      setDeliveries(delData.deliveries || []);

      if (subData.subscriptions?.length > 0) {
        setSubs(subData.subscriptions);
        setPageLoading(false);
      } else {
        // Sync with Stripe
        setSyncing(true);
        setPageLoading(false);
        try {
          const syncRes = await fetch("/api/sync-subscription", { method: "POST" });
          const syncData = await syncRes.json();
          if (syncData.subscriptions?.length > 0) {
            setSubs(syncData.subscriptions);
            const delRes2 = await fetch("/api/deliveries");
            const delData2 = await delRes2.json();
            setDeliveries(delData2.deliveries || []);
          }
        } finally {
          setSyncing(false);
        }
      }
    })();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (pageLoading) return (
    <>
      <Header />
      <main style={{ paddingTop: 68, minHeight: "100vh", background: "#faf7f0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e2d9c8", borderTop: "3px solid #3a7a52", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#5a7a62", fontSize: 14 }}>{tx.loading}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
      <Footer />
    </>
  );

  const upcoming = deliveries.filter(d => d.status === "pending" || d.status === "assigned");
  const past = deliveries.filter(d => ["delivered", "skipped", "failed"].includes(d.status));
  const planLabel = (p: string) => ({ taman: tx.taman, eko: lang === "hr" ? "Košara Eko" : "Eko Basket", super: tx.super }[p] || p);
  const planDesc = (p: string) => ({ taman: tx.tamanDesc, eko: lang === "hr" ? "~8 kg · Eko certificirano · svaka 2 tjedna" : "~8 kg · Eco certified · every 2 weeks", super: tx.superDesc }[p] || "");
  const planPrice = (p: string) => ({ taman: "62€", eko: "66,50€", super: "71€" }[p] || "");

  const statusBadge = (s: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      active: { bg: "#dcfce7", text: "#166534" },
      canceled: { bg: "#fee2e2", text: "#991b1b" },
      past_due: { bg: "#fef3c7", text: "#92400e" },
      pending: { bg: "#dbeafe", text: "#1e40af" },
      assigned: { bg: "#fef3c7", text: "#92400e" },
      delivered: { bg: "#dcfce7", text: "#166534" },
      skipped: { bg: "#f3f4f6", text: "#6b7280" },
      failed: { bg: "#fee2e2", text: "#991b1b" },
    };
    const c = colors[s] || { bg: "#f3f4f6", text: "#6b7280" };
    const label = (tx as unknown as Record<string, string>)[s] || s;
    return (
      <span style={{ background: c.bg, color: c.text, padding: "0.3rem 0.85rem", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
        {label}
      </span>
    );
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: 68, background: "#f5f3ee", minHeight: "100vh" }}>

        {/* Hero band */}
        <div style={{ background: "linear-gradient(135deg, #1c3a28 0%, #2d5a3d 100%)", padding: "2.5rem 1.5rem" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#c8ddc0", fontWeight: 700, fontFamily: "Georgia, serif" }}>
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
              <div>
                <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#faf7f0", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 700, marginBottom: "0.2rem" }}>
                  {user?.firstName} {user?.lastName}
                </h1>
                <p style={{ color: "rgba(250,247,240,0.6)", fontSize: 13 }}>{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(250,247,240,0.8)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.55rem 1.25rem", borderRadius: 50, fontSize: 13, cursor: "pointer" }}>
              {tx.logout}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ background: "white", borderBottom: "1px solid #e8e4dc", position: "sticky", top: 68, zIndex: 10 }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", padding: "0 1.5rem" }}>
            {tx.tabs.map((label, i) => (
              <button key={i} onClick={() => setTab(i)} style={{ padding: "1rem 1.5rem", background: "none", border: "none", borderBottom: tab === i ? "2.5px solid #3a7a52" : "2.5px solid transparent", fontSize: 14, fontWeight: tab === i ? 700 : 500, color: tab === i ? "#1c3a28" : "#9a9a8a", cursor: "pointer", transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* ── TAB 0: Subscription ── */}
          {tab === 0 && (
            <div>
              {syncing && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: 14, color: "#92400e" }}>
                  <div style={{ width: 18, height: 18, border: "2px solid #fde68a", borderTop: "2px solid #92400e", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                  {tx.verifying}
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {subs.length === 0 ? (
                <div style={{ background: "white", borderRadius: 20, padding: "3rem 2rem", textAlign: "center", boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0f7f3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: 30 }}>🥦</div>
                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, color: "#1c3a28", marginBottom: "0.75rem" }}>{tx.noSub}</h2>
                  <p style={{ color: "#6a8a72", fontSize: 15, marginBottom: "2rem", lineHeight: 1.7, maxWidth: 360, margin: "0 auto 2rem" }}>{tx.noSubDesc}</p>
                  <Link href="/kosarice" style={{ display: "inline-block", background: "#3a7a52", color: "white", textDecoration: "none", padding: "0.9rem 2.5rem", borderRadius: 50, fontSize: 15, fontWeight: 600 }}>{tx.choosePlan}</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {subs.map((sub, idx) => (
                    <div key={idx} style={{ background: "white", borderRadius: 20, padding: "2rem", boxShadow: "0 1px 12px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f0f7f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧺</div>
                          <div>
                            <p style={{ fontSize: 11, color: "#9a9a8a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2rem" }}>{tx.plan}</p>
                            <p style={{ fontSize: 20, fontWeight: 700, color: "#1c3a28", fontFamily: "var(--font-playfair), Georgia, serif" }}>{planLabel(sub.plan)}</p>
                            <p style={{ fontSize: 13, color: "#6a8a72", marginTop: "0.1rem" }}>{planDesc(sub.plan)}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {statusBadge(sub.status)}
                          <p style={{ fontSize: 24, fontWeight: 800, color: "#1c3a28", marginTop: "0.5rem" }}>{planPrice(sub.plan)}<span style={{ fontSize: 13, fontWeight: 400, color: "#9a9a8a" }}>/mj.</span></p>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px solid #f0ede5", paddingTop: "1.5rem" }}>
                        <div style={{ background: "#faf9f7", borderRadius: 12, padding: "1rem" }}>
                          <p style={{ fontSize: 11, color: "#9a9a8a", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tx.nextBilling}</p>
                          <p style={{ fontSize: 16, fontWeight: 700, color: "#1c3a28" }}>{new Date(sub.currentPeriodEnd).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                        </div>
                        <div style={{ background: "#faf9f7", borderRadius: 12, padding: "1rem" }}>
                          <p style={{ fontSize: 11, color: "#9a9a8a", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tx.since}</p>
                          <p style={{ fontSize: 16, fontWeight: 700, color: "#1c3a28" }}>{new Date(sub.createdAt).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <a href="mailto:lucija@verdihrvatska.com?subject=Otkaz pretplate&body=Poštovana Lucija, želim otkazati svoju pretplatu." style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "white", border: "1.5px solid #e2d9c8", color: "#9a9a8a", textDecoration: "none", padding: "0.85rem 1.75rem", borderRadius: 50, fontSize: 14, fontWeight: 500, width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    {lang === "hr" ? "Otkazati pretplatu? Kontaktirajte nas" : "Cancel subscription? Contact us"}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 1: Deliveries ── */}
          {tab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 18, color: "#1c3a28", marginBottom: "1.25rem" }}>{tx.upcoming}</h2>
                {upcoming.length === 0 ? (
                  <div style={{ background: "white", borderRadius: 16, padding: "2.5rem", textAlign: "center", color: "#9a9a8a", fontSize: 14, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>{tx.noDeliveries}</div>
                ) : upcoming.map(d => (
                  <div key={d.id} style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", marginBottom: "0.75rem", border: "1px solid #f0ede5" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0f7f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🥕</div>
                        <div>
                          <p style={{ fontWeight: 700, color: "#1c3a28", fontSize: 15, marginBottom: "0.25rem" }}>{planLabel(d.plan)}</p>
                          <p style={{ fontSize: 13, color: "#6a8a72" }}>{new Date(d.scheduledDate).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
                          <p style={{ fontSize: 12, color: "#9a9a8a", marginTop: "0.1rem" }}>{d.address}, {d.city}</p>
                          {d.livreurPhone && (
                            <p style={{ fontSize: 12, color: "#3a7a52", marginTop: "0.3rem", fontWeight: 600 }}>
                              📞 {tx.livreurContact}: <a href={`tel:${d.livreurPhone}`} style={{ color: "#3a7a52" }}>{d.livreurPhone}</a>
                            </p>
                          )}
                        </div>
                      </div>
                      {statusBadge(d.status)}
                    </div>
                  </div>
                ))}
              </div>

              {past.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 18, color: "#1c3a28", marginBottom: "1.25rem" }}>{tx.past}</h2>
                  {past.map(d => (
                    <div key={d.id} style={{ background: "white", borderRadius: 16, padding: "1.25rem 1.5rem", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", opacity: 0.65, border: "1px solid #f0ede5" }}>
                      <div>
                        <p style={{ fontWeight: 600, color: "#1c3a28", fontSize: 14 }}>{planLabel(d.plan)}</p>
                        <p style={{ fontSize: 12, color: "#9a9a8a", marginTop: "0.2rem" }}>{new Date(d.scheduledDate).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-GB")}</p>
                      </div>
                      {statusBadge(d.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: Profile ── */}
          {tab === 2 && (
            <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", boxShadow: "0 1px 12px rgba(0,0,0,0.06)", maxWidth: 540, border: "1px solid #eee" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, color: "#1c3a28", marginBottom: "2rem" }}>{tx.profileTitle}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={lbl}>{tx.firstName}</label>
                    <input style={inp} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={lbl}>{tx.lastName}</label>
                    <input style={inp} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>{tx.email}</label>
                  <input style={{ ...inp, background: "#f5f3ee", color: "#9a9a8a" }} value={user?.email || ""} disabled />
                </div>
                <div>
                  <label style={lbl}>{tx.phone}</label>
                  <input style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label style={lbl}>{tx.address}</label>
                  <input style={inp} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div>
                  <label style={lbl}>{tx.city}</label>
                  <input style={inp} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <button onClick={handleSave} disabled={saving} style={{ background: savedMsg ? "#166534" : "#3a7a52", color: "white", border: "none", padding: "0.9rem", borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: "0.5rem", transition: "background 0.2s" }}>
                  {savedMsg ? tx.saved : saving ? tx.saving : tx.save}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#3d2b1a", marginBottom: "0.5rem" };
const inp: React.CSSProperties = { width: "100%", padding: "0.85rem 1rem", border: "1.5px solid #e8e4dc", borderRadius: 10, fontSize: 15, color: "#1c3a28", background: "white", outline: "none", boxSizing: "border-box" };

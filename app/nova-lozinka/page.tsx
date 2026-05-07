"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError("Nevažeći link za resetiranje lozinke.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 znakova.");
      return;
    }
    if (password !== confirm) {
      setError("Lozinke se ne podudaraju.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Greška. Pokušajte ponovo.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/prijava"), 3000);
      }
    } catch {
      setError("Greška. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8faf8",
      fontFamily: "Georgia, serif",
      padding: "20px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "48px 40px",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <img src="/images/logo.png" alt="Verdi" style={{ height: 36, marginBottom: 32 }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1c3a28", marginBottom: 8 }}>
          Nova lozinka
        </h1>
        <p style={{ fontSize: 15, color: "#4a6a52", marginBottom: 28 }}>
          Unesite svoju novu lozinku.
        </p>

        {success ? (
          <div style={{
            background: "#f0f7f0",
            borderRadius: 12,
            padding: "20px 24px",
            color: "#2d6a2d",
            fontSize: 15,
          }}>
            ✓ Lozinka je uspješno promijenjena. Preusmjeravamo vas na prijavu...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "#4a6a52", marginBottom: 6, fontWeight: 600 }}>
                Nova lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Najmanje 6 znakova"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1.5px solid #d0e4d0",
                  fontSize: 15,
                  color: "#1c3a28",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, color: "#4a6a52", marginBottom: 6, fontWeight: 600 }}>
                Potvrdi lozinku
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Ponovite lozinku"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1.5px solid #d0e4d0",
                  fontSize: 15,
                  color: "#1c3a28",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <p style={{ color: "#c0392b", fontSize: 14, marginBottom: 16 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              style={{
                width: "100%",
                background: loading ? "#a0c4a0" : "#2d6a2d",
                color: "white",
                border: "none",
                borderRadius: 50,
                padding: "14px 0",
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              {loading ? "Spremanje..." : "Spremi novu lozinku"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function NovaLozinkaPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
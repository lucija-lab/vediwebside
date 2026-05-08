import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM || "lucija@verdihrvatska.com";

export async function sendPasswordResetEmail(email: string, firstName: string, resetLink: string) {
  await resend.emails.send({
    from: `Verdi Hrvatska <${FROM}>`,
    to: email,
    subject: "Zahtjev za resetiranje lozinke",
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #1c3a28;">
        <img src="https://verdihrvatska.com/images/logo.png" alt="Verdi" style="height: 36px; margin-bottom: 32px;" />
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Pozdrav, ${firstName}!</h1>
        <p style="font-size: 16px; line-height: 1.7; color: #4a6a52; margin-bottom: 24px;">
          Primili smo zahtjev za resetiranje lozinke za Vaš Verdi račun.<br/>
          Kliknite na gumb ispod kako biste postavili novu lozinku.
        </p>
        <a href="${resetLink}" style="display: inline-block; background: #2d6a2d; color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 600; margin-bottom: 24px;">
          Resetiraj lozinku
        </a>
        <p style="font-size: 13px; color: #8ab09a; margin-bottom: 8px;">
          Veza vrijedi 1 sat. Ako niste tražili resetiranje lozinke, možete ignorirati ovaj e-mail.
        </p>
        <hr style="border: none; border-top: 1px solid #e0ede0; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8ab09a;">© ${new Date().getFullYear()} Verdi Hrvatska · LMB 1759 Export d.o.o. · OIB: 23568488873</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  await resend.emails.send({
    from: `Verdi Hrvatska <${FROM}>`,
    to: email,
    subject: "Dobrodošli u Verdi Hrvatska! 🌱",
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #1c3a28;">
        <img src="https://verdihrvatska.com/images/logo.png" alt="Verdi" style="height: 36px; margin-bottom: 32px;" />
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Dobrodošli, ${firstName}!</h1>
        <p style="font-size: 16px; line-height: 1.7; color: #4a6a52; margin-bottom: 24px;">
          Vaš Verdi račun je uspješno kreiran.<br/>
          Sada možete odabrati svoju košaricu i naručiti svježe povrće direktno od naših OPG-ova.
        </p>
        <div style="background: #f0f7f0; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #4a6a52;">✓ &nbsp;Svježe sezonsko povrće svaka 2 tjedna</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #4a6a52;">✓ &nbsp;Direktno od lokalnih OPG-ova</p>
          <p style="margin: 0; font-size: 14px; color: #4a6a52;">✓ &nbsp;Dostava na kućnu ili poslovnu adresu</p>
        </div>
        <a href="https://verdihrvatska.com/kosarice" style="display: inline-block; background: #2d6a2d; color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 600; margin-bottom: 24px;">
          Odaberite svoju košaricu
        </a>
        <p style="font-size: 13px; color: #8ab09a;">Za pitanja pišite na lucija@verdihrvatska.com ili nazovite 099 821 6219.</p>
        <hr style="border: none; border-top: 1px solid #e0ede0; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8ab09a;">© ${new Date().getFullYear()} Verdi Hrvatska · LMB 1759 Export d.o.o. · OIB: 23568488873</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(email: string, firstName: string, plan: string) {
  const planNames: Record<string, string> = {
    taman: "Taman Košara",
    super: "Super Košara",
    eko: "Eko Košara",
  };
  const planName = planNames[plan] ?? plan;

  await resend.emails.send({
    from: `Verdi Hrvatska <${FROM}>`,
    to: email,
    subject: "Hvala na pretplati — Verdi Hrvatska",
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #1c3a28;">
        <img src="https://verdihrvatska.com/images/logo.png" alt="Verdi" style="height: 36px; margin-bottom: 32px;" />
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Hvala, ${firstName}!</h1>
        <p style="font-size: 16px; line-height: 1.7; color: #4a6a52; margin-bottom: 24px;">
          Vaša pretplata na <strong>${planName}</strong> je uspješno aktivirana.<br/>
          Dobrodošli u Verdi obitelj!
        </p>
        <div style="background: #f0f7f0; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #4a6a52;">✓ &nbsp;Primit ćete obavijest prije svake dostave</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #4a6a52;">✓ &nbsp;Prva dostava stiže za 2 tjedna</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #4a6a52;">✓ &nbsp;Fiskalizirani račun bit će Vam poslan nakon svake dostave</p>
          <p style="margin: 0; font-size: 14px; color: #4a6a52;">✓ &nbsp;Za pitanja pišite na lucija@verdihrvatska.com</p>
        </div>
        <a href="https://verdihrvatska.com" style="display: inline-block; background: #2d6a2d; color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 600;">
          Posjetite naš web
        </a>
        <hr style="border: none; border-top: 1px solid #e0ede0; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8ab09a;">© ${new Date().getFullYear()} Verdi Hrvatska · LMB 1759 Export d.o.o. · OIB: 23568488873</p>
      </div>
    `,
  });
}

export async function sendInvoiceEmail(
  email: string,
  firstName: string,
  plan: string,
  invoiceNumber: string,
  deliveryDate: string,
) {
  const planNames: Record<string, string> = {
    taman: "Taman Košara",
    super: "Super Košara",
    eko: "Eko Košara",
  };
  const planName = planNames[plan] ?? plan;

  await resend.emails.send({
    from: `Verdi Hrvatska <${FROM}>`,
    to: email,
    subject: `Račun br. ${invoiceNumber} — Verdi Hrvatska`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #1c3a28;">
        <img src="https://verdihrvatska.com/images/logo.png" alt="Verdi" style="height: 36px; margin-bottom: 32px;" />
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Vaš račun je spreman, ${firstName}!</h1>
        <p style="font-size: 16px; line-height: 1.7; color: #4a6a52; margin-bottom: 24px;">
          U prilogu se nalazi Vaš račun za pretplatu na <strong>${planName}</strong>.<br/>
          Datum dostave: <strong>${deliveryDate}</strong>
        </p>
        <div style="background: #f0f7f0; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #4a6a52;">Broj računa</p>
          <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #1c3a28;">${invoiceNumber}</p>
          <p style="margin: 0 0 4px; font-size: 13px; color: #4a6a52;">Usluga</p>
          <p style="margin: 0; font-size: 15px; color: #1c3a28;">${planName} — Verdi Hrvatska</p>
        </div>
        <p style="font-size: 13px; color: #8ab09a;">Za pitanja pišite na lucija@verdihrvatska.com ili nazovite 099 821 6219.</p>
        <hr style="border: none; border-top: 1px solid #e0ede0; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8ab09a;">© ${new Date().getFullYear()} Verdi Hrvatska · LMB 1759 Export d.o.o. · OIB: 23568488873</p>
      </div>
    `,
  });
}

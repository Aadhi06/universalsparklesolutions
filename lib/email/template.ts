import { getSiteUrl, site } from "@/lib/site";

const NAVY = "#102342";
const BLUE = "#146dad";
const GOLD = "#d6b66e";
const SURFACE = "#eef2f7";
const BODY = "#4a5a73";
const WHITE = "#ffffff";
const LINE = "#d7deea";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function emailParagraphs(text: string) {
  return escapeHtml(text)
    .split("\n")
    .map((line) =>
      line.trim()
        ? `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:${NAVY};">${line}</p>`
        : `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;">&nbsp;</p>`,
    )
    .join("");
}

export function emailDetails(
  rows: Array<{ label: string; value: string; href?: string }>,
) {
  const cells = rows
    .filter((row) => row.value.trim())
    .map((row) => {
      const value = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:${BLUE};text-decoration:none;font-weight:600;">${escapeHtml(row.value)}</a>`
        : escapeHtml(row.value);
      return `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:34%;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${BODY};font-weight:700;">${escapeHtml(row.label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${LINE};vertical-align:top;font-size:16px;color:${NAVY};">${value}</td>
</tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${cells}</table>`;
}

export function emailButton(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
  <tr>
    <td style="border-radius:6px;background:${BLUE};">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 22px;font-size:15px;font-weight:700;color:${WHITE};text-decoration:none;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

export function renderEmail(input: {
  preheader?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
  secondaryLink?: { label: string; href: string };
}) {
  const origin = getSiteUrl();
  const logoUrl = `${origin}/icon-192.png`;
  const phones = site.phones.map((phone) => phone.label).join(" · ");
  const preheader = escapeHtml(input.preheader || input.intro || input.title);
  const eyebrow = escapeHtml(input.eyebrow || site.shortName);
  const title = escapeHtml(input.title);
  const intro = input.intro
    ? `<p style="margin:0 0 18px;font-size:16px;line-height:1.55;color:${BODY};">${escapeHtml(input.intro)}</p>`
    : "";
  const cta = input.cta ? emailButton(input.cta.label, input.cta.href) : "";
  const footerNote = input.footerNote
    ? `<p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:${BODY};">${escapeHtml(input.footerNote)}</p>`
    : "";
  const secondaryLink = input.secondaryLink
    ? `<p style="margin:16px 0 0;font-size:13px;line-height:1.5;"><a href="${escapeHtml(input.secondaryLink.href)}" style="color:${BLUE};text-decoration:underline;">${escapeHtml(input.secondaryLink.label)}</a></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${SURFACE};color:${NAVY};font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse;">
          <tr>
            <td style="background:${NAVY};border-radius:10px 10px 0 0;padding:22px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;width:56px;">
                    <img src="${escapeHtml(logoUrl)}" width="48" height="48" alt="${escapeHtml(site.shortName)}" style="display:block;border:0;border-radius:8px;" />
                  </td>
                  <td style="vertical-align:middle;padding-left:14px;">
                    <p style="margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD};font-weight:700;">${eyebrow}</p>
                    <p style="margin:6px 0 0;font-size:20px;line-height:1.25;color:${WHITE};font-weight:700;">${escapeHtml(site.shortName)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background:${WHITE};padding:28px 24px 24px;">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:${NAVY};font-weight:700;">${title}</h1>
              ${intro}
              ${input.bodyHtml}
              ${cta}
              ${footerNote}
              ${secondaryLink}
            </td>
          </tr>
          <tr>
            <td style="background:${NAVY};border-radius:0 0 10px 10px;padding:20px 24px;">
              <p style="margin:0;font-size:14px;line-height:1.5;color:${WHITE};font-weight:700;">${escapeHtml(site.shortName)}</p>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#c9d6e8;">
                ${escapeHtml(site.serviceArea)}<br />
                <a href="mailto:${escapeHtml(site.email)}" style="color:${GOLD};text-decoration:none;">${escapeHtml(site.email)}</a><br />
                ${escapeHtml(phones)}
              </p>
              <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#9fb0c8;">
                <a href="${escapeHtml(origin)}" style="color:#9fb0c8;text-decoration:underline;">${escapeHtml(origin.replace(/^https?:\/\//, ""))}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

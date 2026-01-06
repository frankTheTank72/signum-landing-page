// functions/_middleware.js
const BOT_UA =
  /facebookexternalhit|Twitterbot|Slackbot|Discordbot|TelegramBot|WhatsApp/i;

function metaFor(pathname) {
  // TODO: mappe deine wichtigsten Routen
  if (pathname === "/")
    return {
      title: "Signum Network - Powering a calmer kind of crypto",
      desc: "Sustainable payments, tokens, messages & smart contracts — secured by disk space since 2014.",
      image: "https://www.signum.network/og/Signum_blue.png",
    };
  if (pathname.startsWith("/mining"))
    return {
      title: "Signum Mining — ...",
      desc: "How to mine Signum...",
      image: "https://www.signum.network/og/mining.png",
    };
  return {
    title: "Signum Network",
    desc: "…",
    image: "https://www.signum.network/og/Signum_blue.png",
  };
}

export async function onRequest({ request, next }) {
  const res = await next();
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return res;

  const ua = request.headers.get("user-agent") || "";
  if (!BOT_UA.test(ua)) return res; // optional: nur bots rewriten

  const url = new URL(request.url);
  const { title, desc, image } = metaFor(url.pathname);

  return new HTMLRewriter()
    .on("head", {
      element(e) {
        e.append(
          `
          <title>${title}</title>
          <meta name="description" content="${desc}">
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${desc}">
          <meta property="og:image" content="${image}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${desc}">
          <meta name="twitter:image" content="${image}">
        `,
          { html: true }
        );
      },
    })
    .transform(res);
}

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
      title: "Signum Mining — Just add disk space",
      desc: "Mine Signa on everyday machines. No GPUs. No noise. Storage does the work.",
      image: "https://www.signum.network/og/mining.png",
    };
  if (pathname.startsWith("/payments"))
    return {
      title: "Signum Payments — fast, fair, global",
      desc: "Accept SIGNA on web, POS or with simple links. Low fees, real on-chain finality, and sustainable PoC+.",
      image: "https://www.signum.network/og/mining.png",
    };
  if (pathname.startsWith("/tokens"))
    return {
      title: "Signum Tokens — simple, on-chain, everywhere",
      desc: "Create and transfer on-chain tokens with low fees. Built-in market, distributions to up to 1.2M holders per block. Sustainable PoC+",
      image: "https://www.signum.network/og/mining.png",
    };
  if (pathname.startsWith("/smartcontracts"))
    return {
      title: "Signum Smart Contracts - Self-running, efficient, on-chain",
      desc: "Self-executing smart contracts (AT) on Signum: schedule by block height, interoperate on-chain with SIP-38 Maps, and run with human-scale fees.",
      image: "https://www.signum.network/og/mining.png",
    };
  if (pathname.startsWith("/messages"))
    return {
      title: "Signum Messages — public or encrypted, on-chain",
      desc: "Attach notes to payments and transfers, or send message-only transactions. Public or end-to-end encrypted. Low fees, global reach.",
      image: "https://www.signum.network/og/mining.png",
    };
  if (pathname.startsWith("/aliases"))
    return {
      title: "Signum Aliases — human-readable names on-chain",
      desc: "Claim a human-readable alias on Signum and point it to an account, a URL, or a text record.",
      image: "https://www.signum.network/og/mining.png",
    };
  return {
    title: "Signum Network - Powering a calmer kind of crypto",
    desc: "Sustainable payments, tokens, messages & smart contracts — secured by disk space since 2014.",
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

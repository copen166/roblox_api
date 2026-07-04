// Vercel serverless-функция. Все запросы вида /{service}/{путь}
// прилетают сюда благодаря rewrite-правилу в vercel.json.

const ALLOWED_SUBDOMAINS = new Set([
  "inventory",
  "economy",
  "users",
  "thumbnails",
  "badges",
  "groups",
  "catalog",
  "games",
  "friends",
  "avatar",
  "presence",
]);

module.exports = async (req, res) => {
  // req.url здесь — это оригинальный путь запроса, например:
  // /inventory/v1/users/123/assets/collectibles?limit=100
  const url = new URL(req.url, "https://placeholder.local");
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    res.status(200).json({ status: "ok", message: "Roblox API Proxy работает" });
    return;
  }

  const service = segments[0];
  const restPath = segments.slice(1).join("/");

  if (!ALLOWED_SUBDOMAINS.has(service)) {
    res.status(400).json({ error: `Сервис '${service}' не разрешён` });
    return;
  }

  const targetUrl = `https://${service}.roblox.com/${restPath}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
    });

    const contentType = response.headers.get("content-type") || "";

    res.status(response.status);
    if (contentType.includes("application/json")) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (err) {
    console.error("Ошибка прокси:", err);
    res.status(502).json({
      error: "Не удалось достучаться до Roblox API",
      details: err.message,
    });
  }
};

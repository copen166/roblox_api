const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Разрешённые поддомены roblox.com — можно расширять по мере надобности.
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

// Пример использования из Roblox (Lua):
//   https://<твой-домен>/inventory/v1/users/123/assets/collectibles?limit=100
// проксируется в:
//   https://inventory.roblox.com/v1/users/123/assets/collectibles?limit=100
app.get("/:service/*", async (req, res) => {
  const { service } = req.params;

  if (!ALLOWED_SUBDOMAINS.has(service)) {
    return res.status(400).json({ error: `Сервис '${service}' не разрешён` });
  }

  const path = req.params[0];
  const queryIndex = req.originalUrl.indexOf("?");
  const query = queryIndex !== -1 ? req.originalUrl.slice(queryIndex) : "";
  const targetUrl = `https://${service}.roblox.com/${path}${query}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (err) {
    console.error("Ошибка прокси:", err);
    res.status(502).json({
      error: "Не удалось достучаться до Roblox API",
      details: err.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Roblox API Proxy работает" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Прокси запущен на порту ${PORT}`);
});

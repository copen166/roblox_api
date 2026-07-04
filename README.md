# Roblox API Proxy

Простой прокси-сервер для обхода блокировки, которую Roblox `HttpService`
накладывает на прямые запросы к доменам `*.roblox.com`.

Работает как reverse-proxy: запрос на твой домен вида

```
/{service}/{остальной путь}
```

пробрасывается на

```
https://{service}.roblox.com/{остальной путь}
```

со всеми query-параметрами.

## Установка и запуск локально

```bash
npm install
npm start
```

Сервер поднимется на `http://localhost:3000`.

## Деплой

Подойдёт любой хостинг, поддерживающий Node.js:

### Render.com (проще всего, есть бесплатный тариф)

1. Залей этот репозиторий на GitHub.
2. На render.com: **New → Web Service**, подключи репозиторий.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. После деплоя получишь URL вида `https://твой-сервис.onrender.com`.

### Railway.app / Fly.io / любой другой Node-хостинг

Аналогично — просто `npm install && npm start`, порт берётся из `process.env.PORT`.

> ⚠️ Бесплатные тарифы Render иногда "засыпают" при простое, и первый запрос
> после паузы может идти на несколько секунд дольше обычного. Если это
> критично, стоит взять платный тариф или другой хостинг.

## Использование в Roblox (Lua)

Раньше:

```lua
local baseUrl = "https://inventory.roblox.com/v1/users/%d/assets/collectibles?limit=100&sortOrder=Asc"
```

Меняешь на:

```lua
local baseUrl = "https://твой-сервис.onrender.com/inventory/v1/users/%d/assets/collectibles?limit=100&sortOrder=Asc"
```

Больше ничего в модуле `PlayerInventoryModule` менять не нужно — формат
ответа полностью идентичен оригинальному API Roblox, курсор пагинации
(`nextPageCursor`) тоже пробрасывается как есть.

## Разрешённые сервисы

По умолчанию открыты только нужные поддомены (см. `ALLOWED_SUBDOMAINS` в
`index.js`): `inventory`, `economy`, `users`, `thumbnails`, `badges`,
`groups`, `catalog`, `games`, `friends`, `avatar`, `presence`.

Это сделано специально — сервер не работает как открытый прокси на
произвольные адреса, а пробрасывает запросы только на конкретные Roblox API.
Если понадобится другой сервис Roblox — просто добавь его название в
`ALLOWED_SUBDOMAINS`.

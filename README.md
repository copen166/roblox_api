# Roblox API Proxy (Vercel)

Прокси-сервер для обхода блокировки, которую Roblox `HttpService`
накладывает на прямые запросы к доменам `*.roblox.com`. Эта версия
адаптирована под деплой на Vercel (serverless-функции вместо постоянного
Express-сервера).

Запрос вида:

```
https://твой-проект.vercel.app/inventory/v1/users/123/assets/collectibles?limit=100
```

пробрасывается на:

```
https://inventory.roblox.com/v1/users/123/assets/collectibles?limit=100
```

## Деплой на Vercel

### Вариант A — через сайт (без установки чего-либо)

1. Залей папку этого проекта в новый репозиторий на GitHub.
2. Зайди на vercel.com → **Add New → Project**.
3. Выбери свой репозиторий, framework preset оставь **Other**.
4. Никаких дополнительных build-команд не нужно — жми **Deploy**.
5. После деплоя получишь адрес вида `https://твой-проект.vercel.app`.

### Вариант B — через CLI

```bash
npm install -g vercel
cd roblox-api-proxy-vercel
vercel
```

Дальше следуй инструкциям в терминале (логин, привязка проекта).

## Использование в Roblox (Lua)

В `PlayerInventoryModule` меняешь базовый URL:

```lua
local baseUrl = "https://твой-проект.vercel.app/inventory/v1/users/%d/assets/collectibles?limit=100&sortOrder=Asc"
```

Формат ответа и пагинация (`nextPageCursor`) полностью идентичны
оригинальному Roblox API — остальной код модуля трогать не нужно.

## Разрешённые сервисы

По умолчанию открыты только: `inventory`, `economy`, `users`, `thumbnails`,
`badges`, `groups`, `catalog`, `games`, `friends`, `avatar`, `presence`
(список — в `ALLOWED_SUBDOMAINS` внутри `api/proxy.js`). Прокси не работает
как открытый шлюз на произвольные адреса — только на конкретные поддомены
roblox.com. Если нужен ещё один сервис — просто добавь его в этот список.

## Важный нюанс бесплатного тарифа Vercel

На хобби-тарифе serverless-функции ограничены по времени выполнения
(обычно 10 секунд) и по количеству вызовов в месяц. Для одиночных запросов
инвентаря этого более чем достаточно, но если планируешь очень частые или
массовые запросы — учитывай лимиты в личном кабинете Vercel.

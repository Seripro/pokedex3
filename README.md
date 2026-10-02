# ポケモン図鑑アプリ

## 概要

PokeAPIから取得したポケモンの情報を一覧表示し、名前で検索できるアプリケーションです。
バックエンドではRedisを使用して取得結果をキャッシュし、APIへの不要なリクエストを減らします。

## 機能

- ポケモンの画像と名前を一覧表示できる
- ポケモンの名前で絞り込み検索できる
- PokeAPIから最大1,000匹のポケモン情報を取得できる
- 取得したポケモン情報をRedisに1時間キャッシュできる

## 使用技術

- React（TypeScript）
- Hono（TypeScript）
- Redis
- Docker
- Docker Compose
- PokeAPI

## セットアップ

### 1. リポジトリをクローン

```bash
git clone git@github.com:Seripro/pokedex3.git
cd pokedex3
```

### 2. Docker Composeで起動

依存関係のインストールと、フロントエンド・バックエンド・Redisの起動をDocker Composeが行います。

```bash
docker compose up
```

それぞれ以下のポートで立ち上がっています。

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:3000
- Redis: http://localhost:6379

### 停止

```bash
docker compose down
```

## API

### ポケモン一覧取得（Redisキャッシュあり）

```text
GET http://localhost:3000/api/v3/pokemons
```

初回アクセス時にPokeAPIからポケモン情報を取得し、Redisの `pokemons` キーに1時間保存します。2回目以降はキャッシュされたデータを返します。

### ポケモン一覧取得（逐次取得）

```text
GET http://localhost:3000/api/v1/pokemons
```

### ポケモン一覧取得（並列取得）

```text
GET http://localhost:3000/api/v2/pokemons
```

# Vite

## 開発時

👉 ソースコードは esbuild で処理された Native ESM がそのまま Browser に読み込まれる。<br>
👉`import { hello } from './hello'`は esbuild によって`import { hello } from './hello.ts'`と**拡張子が付与される形に変換される**ので**Native ESM として問題なく動作する。**<br><br>

## 本番ビルド時

👉 rollup でバンドルする。`import { hello } from './hello'` のように拡張子がない形でも自動補完してくれるので問題ない。 <br>
👉 デフォルトで Typescript コンパイラを使うが、plugin で esbuild にすることも可能。

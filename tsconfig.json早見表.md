# tsconfig.json

## target

- 変換する JS の ES バージョン。

## lib

- 型定義ファイル。
- target に指定している ES バージョンの型定義ファイルは自動で含まれている。

## module

- トランスパイル後の JS のモジュールタイプ
- 構文を変換するだけで、実際に「"./hello"」が存在するかどうかまでとかは関係ない。

## moduleResolution

- 実際にトランスパイルするときに、"./hello"を参照するときに拡張子を補完するかどうか等を制御するオプション。
- node -> cjs と同じ制御となる=「.js」「.cjs」を自動補完して探しに行く。あれば OK。

```json
{
  // TSコンパイル対象
  // ・拡張子指定なし -> Defaultで .ts, .tsx, .d.ts を対象
  // ・compilerOptions.allowJsがtrueの場合、.js, .jsx も対象
  "include": ["src"],
  // 読み込む@typesフォルダを指定する。デフォルトでは見えるもの全て。
  // ↓だと ./node_modules/@types/node と /node_modules/@types/jest が読み込まれる。
  "types": ["node", "vitest/globals"],
  // TSコンパイル除外対象
  // ・Default値：["node_modules", "outDirで指定するディレクトリ配下"]
  // ＝ excludeを使うときは、明示的にビルドディレクトリを指定すること。
  // ・src/hoge.ts が src/fuga.ts をimportしていたら、excludeにsrc/fuga.tsを指定してもコンパイルされる。
  "exclude": ["node_modules", "build"],
  "compilerOptions": {
    // コンパイル後のJS(ECMAScript)のバージョン
    // ・ModernブラウザはES6機能をサポートしているのでES6が無難。
    // ・各NodeJSバージョンが、どのECMAScriptバージョンまで対応しているかnode.greenで確認可能。
    //   https://node.green/
    "target": "es6",
    // Targetバージョンにないけど、TypeScriptで書きたい(JS出力時に補完)機能を設定する。
    // ・es2020で追加された「dom」
    // ・esnext全般の機能
    // をTypeScriptで記述して、target(es6)にコンパイル
    "lib": ["dom", "esnext"],
    // TSソース内のimport/export → JSでimport/export か require/exports に変換する。
    // バックエンド(NodeJS)かフロントエンド(ESModule対応ブラウザ上でJS実行)かで異なってくる。
    // NodeJSはrequire/exportsを使う"CommonJS" -> commomjs
    // Browserはimport/exportを使う"ESModules" -> es2015, es2020, esnext
    // "node16","nodeNext"は、TSコンパイルで【NativeESM】を出力する。
    //  node16, nodeNext ★NodeJSでESModulesをNativeに扱いたい話と関連★
    // ・Native ESM: ESM形式のファイルを、そのままNodeJSまたはブラウザ上で実行する形式。
    // ・擬似 ESM: ESM形式で記述されたファイルを実行前にTS/Babel でCJSに変換。
    //             NodeJS上では変換後のCJSファイルを実行する方式。
    // ✅そもそもNodeJSは
    // 参考1：https://zenn.dev/teppeis/articles/2021-10-typescript-45-esm
    // 参考2：https://quramy.medium.com/typescript-4-7-%E3%81%A8-native-node-js-esm-189753a19ba8
    "module": "esnext",
    // 【モジュール解決】TSコンパイル時にImport対象のソースコード・型定義ファイルをどのように検索するか
    // ★「module」の値によってデフォルト値が決まるから、基本気にしなくていい。
    //  "classic": node_modulesの概念なし。昔からのresolution strategy.
    //  "node": Default値。絶対パスのときnode_modules配下を見に行く。
    //  "node16": Native ESMにコンパイルするときの解決方法。
    "moduleResolution": "node",
    // TSファイル →importする→ JSファイル
    // を可能にする。
    // 新しく追加したTSファイルが、既存のJSファイルに依存(import)するのをOKにする。
    // This flag can be used as a way to incrementally add TypeScript files into JS projects by allowing the .ts and .tsx files
    // to live along-side existing JavaScript files.
    // https://www.typescriptlang.org/tsconfig#allowJs
    "allowJs": true,
    // TS→JSへコンパイルして実行＆エラーが起きた時に「JSファイルの何行目でエラーが起きたか」
    // ではなく「TSファイルの何行目でエラーが起きたか」を教えてくれる。
    "sourceMap": true,
    // TypeScriptでJSXをコンパイルするためのオプション。
    // JSXからの変換結果がReact17以降で以下のように代わっている。
    // 17以前：JSX記法 → React.createElement()
    // 17以降：JSX記法 → _jsxs()
    // https://zenn.dev/uhyo/articles/react17-new-jsx-transform
    // 17以前：React.createElement()だから、import React from "react" をコーディングしておく必要がある。
    // 17以降：__jsxs()は トランスパイラによって自動でインポートされる。
    // -------------------
    // ・preserve（変換しない）
    // ・react（React17以前の旧変換）
    // ・react-jsxdev（React17新変換inDEVビルド）
    // ・react-jsx（React17新変換inPRODビルド）
    // -------------------
    "jsx": "react-jsx",
    // TSではEnum使えるがJSでは使えない。
    // TS→JSコンパイル時にEnumを保持するかどうか。
    "preserveConstEnums": false,
    // TSコンパイル結果の出力先
    "outDir": "./build",
    // importで参照可能なTOPディレクトリを指定。
    // 対象；自分で書いた.tsファイル
    // Specify the root folder within your source files.
    // ↓の設定値だと、srcフォルダより上のものをimport/参照できない。
    // = プロジェクト内のモジュールだけ参照できるように
    "rootDir": "./src",
    // 絶対パスの場合にどこを基準にするか。
    // Specify the base directory to resolve non-relative module names.
    // ★★★★★★server/server.ts のところで1時間くらいはまった★★★★★★

    "baseUrl": "./",
    // 相対パスの場合 参照元/先 のどちらかのファイルの場所が代わると path も修正必要となる。
    // それを防ぐためにpath aliasを定義しておくのがこれや。
    // ...
    // ただこれをそのまま使うと、ESLintに「@pages/Topなんてパス存在せんぞ」と怒られるので
    // eslint-import-resolver-typescript を利用する。
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@images/*": ["src/images/*"]
    },
    // CommonJSはexport defaultという概念がない。
    // なので、 ESMモジュール ← import hoge from "hoge" ← Hoge(CommonJS)
    // は普通できない。が、これを実現するためのヘルパーメソッドを生成してくれる。
    // { "default": hoge} みたいなオブジェクトをexportsしてくれる感じ。
    "esModuleInterop": true,
    // 【DefaultエクスポートしてないCJSモジュールだけどコンパイルOKしてあげるよ】オプション。
    // これは”esModuleInterop"でTSコンパイル後にヘルパーメソッドが生成される前提ってことや。
    // "esModuleInterop"をtrueにすると、このオプションもtrueになる。
    // 参考：https://numb86-tech.hatenablog.com/entry/2020/07/11/160159
    "allowSyntheticDefaultImports": true,
    // TS→JSコメント時に削除する。デフォルト false
    "removeComments": false,
    // TypeScriptコンパイラ(tsc)、コンパイルせずに型チェックだけしたい場合。
    "noEmit": true,
    // 型定義ファイル(*.d.ts)のチェックをスキップする
    // △ 型定義ファイルでエラーが出ても無視する。
    // ○  各ライブラリの型定義ファイルのコンパイル時間の削減
    "skipLibCheck": false,
    // コンパイル対象のファイル間の関係性を一切無視して、
    // 全てのファイルを1つのモジュールとしてコンパイルする。使うこれ？
    "isolatedModules": false,
    // strictをtrueにすると以下のオプションが有効になる。
    // --noImplicitAny   :暗黙的にanyになる値をエラーにする
    // --noImplicitThis  :使われているthisの型が暗黙的にanyになる場合にエラーにする。
    // --alwaysStrict    :"use strict";を必ず全てのファイルの先頭行に付与する。
    // --strictBindCallApply  :bind, call, applyを使用する際に、より厳密に型チェックが行われるようになる。
    // --strictNullChecks     :null・undefinedの代入がエラーとなる。型指定されてばOK like let name: string | null;
    // --strictFunctionTypes  :TypeScriptのデフォルトはBivariantlyな挙動だが、このオプションをtrueにするとContravariantlyに型チェックが走るようになる。
    // --strictPropertyInitialization :クラス定義時、インスタンス変数の初期化が宣言時、もしくはコンストラクタのどちらでも行われていない場合にエラーになる。
    "strict": true
  }
}
```

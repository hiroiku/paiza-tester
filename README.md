# paiza スキルチェックテスター

paiza のスキルチェックの問題を解くための支援ツールです。
ソースコードに対して自身でテストケースを作成して，それらが通るかチェックすることができます。

自身で phar をアーカイブするか，[Release](https://github.com/hiroiku/paiza-tester/releases) からダウンロードして使用してください。

## 実行環境要件

- PHP >= 7.0.0

## 使い方

```sh
./test.phar -c "php ./source.php" -t "./X001/*"
```

実行結果

```
command: php ./X001/source.php
   test: ./X001/cases/*
  debug: false

./X001/cases/1.txt OK 0.024385 sec
./X001/cases/2.txt OK 0.024078 sec
```

## 標準出力付きで実行

標準出力しながら実行するには，`-d`または`--debug`オプションを追加します。

```sh
./test.phar -c "php ./source.php" -t "./X001/*" -d
```

実行結果

```
command: php ./X001/source.php
   test: ./X001/cases/*
  debug: true

./X001/cases/1.txt OK 0.025508 sec
6

./X001/cases/2.txt OK 0.024643 sec
0
```

## オプション

| Option | Description |
| --- | --- |
| -c, --command | 実行するコマンドを指定します。|
| -t, --test | globでテストケースを指定します。 |
| -d, --debug | テストするソースコードの標準出力を表示します。<br>値は必要ありません。 |

## test.phar をコマンドとして使う場合

```sh
cp ./test.phar /usr/local/bin/paiza
```

```sh
paiza -l php -s ./source.php -t "./X001/*" -d
```

## LICENSE

MIT

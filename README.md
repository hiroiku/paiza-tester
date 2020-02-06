# paiza スキルチェックテスター

paiza のスキルチェックの問題を解くための支援ツールです。  
ソースコードに対して自身でテストケースを作成して，それらが通るかチェックすることができます。  
各言語のサンプルは言語名のディレクトリ内にあります。

## 実行環境要件

- PHP >= 7.0.0

## 使い方

```sh
./test -c "php ./main.php" -t "./cases/*"
```

実行結果

```
command: php ./cases/main.php
   test: ./cases/*
  debug: false

./cases/1.txt OK 0.031216 sec
./cases/2.txt OK 0.033773 sec
./cases/3.txt OK 0.031775 sec
```

## 標準出力付きで実行

標準出力しながら実行するには，`-d` または `--debug` オプションを追加します。

```sh
./test -c "php ./main.php" -t "./cases/*" -d
```

実行結果

```
command: php ./cases/main.php
   test: ./cases/*
  debug: true

./cases/1.txt OK 0.031216 sec
60

./cases/2.txt OK 0.033773 sec
45

./cases/3.txt OK 0.031775 sec
0
```

## オプション

| Option        | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| -c, --command | 実行するコマンドを指定します。                                         |
| -t, --test    | glob でテストケースを指定します。                                      |
| -d, --debug   | テストするソースコードの標準出力を表示します。<br>値は必要ありません。 |

## LICENSE

MIT

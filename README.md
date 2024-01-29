# Beelzebub

## Desktop App

### serve

1. apps/desktop-app/.env.example をコピーし、apps/desktop-app/.env ファイルを作成
1. apps/desktop-app/.env ファイルの中身を編集(値は管理者に問い合わせてください)
1. 下記コマンドを実行し local で起動

   ```
   $ npx nx run desktop-app:serve
   ```

## 新弾対応

1. カード情報とカード画像を card-fetcher で取得
1. supabase storage の app-static-resources bucket に配置
   - https://app.supabase.com/project/dpqtsdpnxddmnvofamtu/storage/buckets/app-static-resources
1. /cards ページにて、新しいカードの登録操作を実施
   - categoryId と categoryName を指定する必要あり
   - 指定する json ファイルは、1 の手順で取得したファイルを指定

## ユーザ登録

- cookie を set するリクエストをブラウザから実行
- Google アカウントでログイン
- supabase DB の users テーブルに手動でユーザ情報を登録

## Tmp

test1


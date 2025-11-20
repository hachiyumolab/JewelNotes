# Jewel Notes Logger: Database Specification

**ファイル名**：`JNL_CORE_DEV_DB_Spec.md`    
**作成日**：2025-11-12    
**作成者**：池辺千怜（Chisato Ikebe）    
**対象システム**：JNL_CORE_DEV（開発環境データベース）

---

## 1. データベース概要

| 項目 | 内容 |
|------|------|
| データベース名 | `JNL_CORE_DEV` |
| システム略号 | JNL（Jewel Notes Logger） |
| 用途 | Jewel Notesアプリの開発環境用データベース |
| 所有者 | `postgres` |
| 環境 | 開発環境（DEV） |
| 作成日時 | 2025-11-12 |
| 作成者 | postgres（DBA） |

---

## 2. 作成SQL

```sql
CREATE DATABASE JNL_CORE_DEV
    WITH OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Japanese_Japan.932'
    LC_CTYPE = 'Japanese_Japan.932'
    TEMPLATE = template0;

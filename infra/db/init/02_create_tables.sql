-- =========================================
-- JewelNotes - Table Data
-- =========================================


--------------------------------------------------------------------
-- マスタ系テーブル
--------------------------------------------------------------------

-- 感情マスタ
CREATE TABLE mst.mst_emotion (
    emotion_id      SERIAL PRIMARY KEY,
    emotion_name    VARCHAR(50) NOT NULL UNIQUE,
    description     TEXT,
    polarity        SMALLINT NOT NULL CHECK (polarity IN (1, -1)),
    strength        NUMERIC(3,2) NOT NULL CHECK (strength >= 0.00 AND strength <= 1.00),
    sort_order      SMALLINT
);

--------------------------------------------------------------------

-- 天気マスタ
CREATE TABLE mst.mst_weather (
    weather_id      SERIAL PRIMARY KEY,
    weather_name    VARCHAR(50) NOT NULL UNIQUE,
    description     TEXT,
    sort_order      SMALLINT
);

--------------------------------------------------------------------

-- 食品マスタ
CREATE TABLE mst.mst_food (
    food_id         SERIAL PRIMARY KEY,
    food_name       VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    unit            VARCHAR(50),
    calories        NUMERIC(6,2) NOT NULL,
    protein         NUMERIC(6,2) NOT NULL,
    fat             NUMERIC(6,2) NOT NULL,
    carbohydrate    NUMERIC(6,2) NOT NULL,
    sort_order      SMALLINT
);

--------------------------------------------------------------------
-- トランザクション系テーブル
--------------------------------------------------------------------

-- エントリ（投稿）
CREATE TABLE trn.trn_entry (
    entry_id            BIGSERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL,
    body                TEXT,
    entry_datetime_utc  TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------

-- 感情ログ（1エントリ1件）
CREATE TABLE trn.trn_entry_emotion (
    entry_id            BIGINT PRIMARY KEY,
    emotion_id          INTEGER NOT NULL,
    emotion_strength    SMALLINT NOT NULL CHECK (emotion_strength BETWEEN 1 AND 100),
    FOREIGN KEY (entry_id)   REFERENCES trn.trn_entry(entry_id),
    FOREIGN KEY (emotion_id) REFERENCES mst.mst_emotion(emotion_id)
);

--------------------------------------------------------------------

-- 食品ログ（複数可）
CREATE TABLE trn.trn_entry_food (
    entry_id    BIGINT NOT NULL,
    food_id     INTEGER NOT NULL,
    food_lot    NUMERIC(5,2) NOT NULL CHECK (food_lot > 0),
    PRIMARY KEY(entry_id, food_id),
    FOREIGN KEY (entry_id) REFERENCES trn.trn_entry(entry_id),
    FOREIGN KEY (food_id)  REFERENCES mst.mst_food(food_id)
);

--------------------------------------------------------------------

-- 天気ログ（1エントリ1件）
CREATE TABLE trn.trn_entry_weather (
    entry_id    BIGINT PRIMARY KEY,
    weather_id  INTEGER NOT NULL,
    FOREIGN KEY (entry_id)   REFERENCES trn.trn_entry(entry_id),
    FOREIGN KEY (weather_id) REFERENCES mst.mst_weather(weather_id)
);

--------------------------------------------------------------------

-- 体重・体脂肪ログ
CREATE TABLE trn.trn_entry_body (
    entry_id        BIGINT PRIMARY KEY,
    weight_kg       NUMERIC(5,2),
    body_fat_percent NUMERIC(4,1),
    FOREIGN KEY (entry_id) REFERENCES trn.trn_entry(entry_id)
);

--------------------------------------------------------------------

-- 睡眠ログ
CREATE TABLE trn.trn_entry_sleep (
    entry_id     BIGINT PRIMARY KEY,
    woke_up_at   TIMESTAMP,
    went_to_bed_at TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES trn.trn_entry(entry_id)
);

--------------------------------------------------------------------
-- 監査ログ（audit）
--------------------------------------------------------------------

CREATE TABLE aud.audit_log (
    audit_id    BIGSERIAL PRIMARY KEY,
    action      VARCHAR(50) NOT NULL,
    detail      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

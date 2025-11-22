-- =========================================
-- JewelNotes - Master Seed Data
-- =========================================


-- =========================================
-- EMOTION MASTER
-- =========================================
INSERT INTO mst.mst_emotion (emotion_name, description, polarity, strength, sort_order)
VALUES
    ('happy',       '嬉しい・幸福感',               1, 1.00, 1),
    ('excited',     '楽しい・高揚感',               1, 0.90, 2),
    ('energetic',   'やる気',                       1, 0.85, 3),
    ('relaxed',     '落ち着き・安心感',             1, 0.70, 4),

    ('neutral',     '無風・特に強い感情なし',       1, 0.00, 5),

    ('tired',       '疲労感・倦怠感',               -1, 0.60, 6),
    ('confused',    'モヤモヤ',                     -1, 0.75, 7),
    ('anxious',     '不安',                         -1, 0.85, 8),
    ('lonely',      'さみしい',                     -1, 0.90, 9),
    ('sad',         '悲しい・しょんぼり',           -1, 1.00, 10),
    ('angry',       '怒り・イライラ',               -1, 1.00, 11);


-- =========================================
-- WEATHER MASTER
-- =========================================
INSERT INTO mst.mst_weather (weather_name, description, sort_order)
VALUES
    ('sunny',   '晴れ', 1),
    ('cloudy',  '曇り', 2),
    ('rain',    '雨', 3),
    ('snow',    '雪', 4),
    ('storm',   '強風', 5),
    ('typhoon', '台風', 6),
    ('foggy',   '濃霧', 7);


-- =========================================
-- FOOD MASTER（ちぃが今入れた 2 件のみ）
-- =========================================
INSERT INTO mst.mst_food (food_name, description, unit, calories, protein, fat, carbohydrate, sort_order)
VALUES
    ('rice100',   'ごはん',  '100g', 156, 2.5, 0.3, 36.8, 1),
    ('cabbage',   'キャベツ', '100g',  23, 1.3, 0.2,  5.2, 2);

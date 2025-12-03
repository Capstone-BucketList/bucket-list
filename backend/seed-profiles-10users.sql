-- Seed Data: 10 Test Users for Wanderlist App
-- Created with valid Argon2id password hashes
-- All passwords use pattern: welcome1, welcome2, ..., welcome10
-- All users are pre-activated (activation_token = '')
-- Profile pictures use DiceBear API for generated avatars

INSERT INTO profile (id, activation_token, bio, date_created, email, password_hash, profile_picture, user_name, visibility) VALUES
    ('019ae4fe-9d15-7179-8d20-35580b43fc06', '', 'Adventure seeker and world explorer.', CURRENT_DATE, 'wanderer_alex@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$IMDVJCxqwTD/exDv8lG+Fw$InflV0Qb2FeENpzMynFfRstV6HCNTjFaBGYggoF4rf0', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wanderer_alex', 'wanderer_alex', 'public'),
    ('019ae4fe-9d16-7768-865c-b2b6059c03e5', '', 'City hopper discovering hidden urban gems.', CURRENT_DATE, 'urban_explorer@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$cJ7gIcMgucYjDylGQCBtvA$jYUSF0yaKzLgaX+2Curki1FtSR8UHEd1qhabA8huv8U', 'https://api.dicebear.com/7.x/avataaars/svg?seed=urban_explorer', 'urban_explorer', 'public'),
    ('019ae4fe-9d16-7768-865c-b53e3ee3382b', '', 'Mountain lover and hiking enthusiast.', CURRENT_DATE, 'trail_blazer@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$ijisDIgANbd8/erKv6aPDQ$vUAoBF44um4CYsb1IKXYwClvAx8bfWSCvllt38uEpjE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=trail_blazer', 'trail_blazer', 'public'),
    ('019ae4fe-9d16-7768-865c-b9117a3eebb6', '', 'Coastal wanderer chasing sunsets.', CURRENT_DATE, 'beach_bum@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$DgCTJ5l8Gccywfr+9qOWUQ$DrNHz+ol7G6i2MpufAivHfnFtaHcG3BsIqoW71xW3h4', 'https://api.dicebear.com/7.x/avataaars/svg?seed=beach_bum', 'beach_bum', 'public'),
    ('019ae4fe-9d16-7768-865c-bc8e97f2b10e', '', 'Culinary explorer and food blogger.', CURRENT_DATE, 'foodie_travels@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$ZPVwzBj1NU37rhcyR4cksg$+PJTdWlehmhpWAge3XuNHU4UsH4J3V6S/nYZe6iJWb8', 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_travels', 'foodie_travels', 'public'),
    ('019ae4fe-9d16-7768-865c-c1311c192e9c', '', 'Travel photographer capturing beautiful moments.', CURRENT_DATE, 'photo_nomad@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$KrgEpBSYr/1Q9t80V09+tg$69RMGnHvRI4fc6cZPkEkiKzzYKvlAg18OTfj34aeaFE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=photo_nomad', 'photo_nomad', 'public'),
    ('019ae4fe-9d16-7768-865c-c5339511ded0', '', 'Museum hopper and cultural heritage enthusiast.', CURRENT_DATE, 'culture_seeker@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$hhkrVkbpZ5pEjeo0pg0tJQ$3mwfvQHxICrjjceIe59ZrwPg2l8DpxUcfQuotZeNyFk', 'https://api.dicebear.com/7.x/avataaars/svg?seed=culture_seeker', 'culture_seeker', 'public'),
    ('019ae4fe-9d16-7768-865c-cbc9d0b23d10', '', 'Budget traveler finding amazing deals worldwide.', CURRENT_DATE, 'budget_backpack@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$5rVV+VdoEF6vkF0d5SsgJg$9Wv94lncgkLGSCTI/8B6EQ/8+jTX6BnHkKT1n+r8v5o', 'https://api.dicebear.com/7.x/avataaars/svg?seed=budget_backpack', 'budget_backpack', 'public'),
    ('019ae4fe-9d16-7768-865c-cc3de94b2a63', '', 'National parks explorer and wildlife watcher.', CURRENT_DATE, 'nature_lover@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$Ucl4AlGtuc8Vri1TV5qCFw$mkHUSOXmAS4b8AAubQlDwj/nVLLMWoYbXfuY5P3uvzM', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature_lover', 'nature_lover', 'public'),
    ('019ae4fe-9d16-7768-865c-d06dae75c47e', '', 'Urban guide discovering unique city experiences.', CURRENT_DATE, 'city_guide@wanderlist.dev', '$argon2id$v=19$m=65536,t=3,p=4$ZIPXBcD2HqWzO+FEkY+Scw$avJ06NfhmThJsrDr5q99QxqrPMe8dm82WOt8sVvIVTw', 'https://api.dicebear.com/7.x/avataaars/svg?seed=city_guide', 'city_guide', 'public');

-- LOGIN CREDENTIALS FOR TESTING
-- Username | Email | Password
-- wanderer_alex | wanderer_alex@wanderlist.dev | welcome1
-- urban_explorer | urban_explorer@wanderlist.dev | welcome2
-- trail_blazer | trail_blazer@wanderlist.dev | welcome3
-- beach_bum | beach_bum@wanderlist.dev | welcome4
-- foodie_travels | foodie_travels@wanderlist.dev | welcome5
-- photo_nomad | photo_nomad@wanderlist.dev | welcome6
-- culture_seeker | culture_seeker@wanderlist.dev | welcome7
-- budget_backpack | budget_backpack@wanderlist.dev | welcome8
-- nature_lover | nature_lover@wanderlist.dev | welcome9
-- city_guide | city_guide@wanderlist.dev | welcome10

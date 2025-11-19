-- Profile Seed Data
-- Generated from seed-data-for-profile.json
-- Generated at: 2025-11-16T16:12:32.811Z
-- Total users: 80
-- This script is compatible with new-seed-data.sql
-- Assumes PostgreSQL with pgcrypto and JSONB support

BEGIN;

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Defer constraint checks until COMMIT
-- This allows inserting data with foreign key references
-- that may not exist yet in the database
SET CONSTRAINTS ALL DEFERRED;

-- Insert users
INSERT INTO "app_users" (
    "id",
    "email",
    "password",
    "name",
    "role",
    "profileImage",
    "createdAt",
    "updatedAt"
) VALUES
    (
        'user-mehmet-keskin-1',
        'mehmet.keskin9@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Mehmet Keskin',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-10.jpg',
        TIMESTAMP '2025-11-13 11:18:59.014',
        TIMESTAMP '2025-11-15 02:13:10.038'
    ),
    (
        'user-ahmet-avci-2',
        'ahmet-avci.1@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Ahmet Avcı',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-102.jpg',
        TIMESTAMP '2025-11-14 08:26:25.471',
        TIMESTAMP '2025-11-15 14:15:04.307'
    ),
    (
        'user-mustafa-bulut-3',
        'mustafa.bulut@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Mustafa Bulut',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-11.jpg',
        TIMESTAMP '2025-10-20 13:38:11.853',
        TIMESTAMP '2025-11-01 00:55:36.023'
    ),
    (
        'user-huseyin-erdogan-4',
        'hüseyin.erdoğan19@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Hüseyin Erdoğan',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-112.jpg',
        TIMESTAMP '2025-10-17 16:56:10.128',
        TIMESTAMP '2025-10-27 12:01:52.471'
    ),
    (
        'user-emre-aksoy-5',
        'emre-aksoy.7@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Emre Aksoy',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-113.jpg',
        TIMESTAMP '2025-11-11 10:35:29.880',
        TIMESTAMP '2025-11-14 11:52:31.320'
    ),
    (
        'user-burak-bozkurt-6',
        'burak-bozkurt.37@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Burak Bozkurt',
        'employer',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-129.jpg',
        TIMESTAMP '2025-10-30 00:07:16.324',
        TIMESTAMP '2025-11-07 10:19:49.163'
    ),
    (
        'user-cem-gunes-7',
        'cem-gunes.38@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Cem Güneş',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-154.jpg',
        TIMESTAMP '2025-11-12 04:23:30.388',
        TIMESTAMP '2025-11-14 05:41:19.769'
    ),
    (
        'user-can-tas-8',
        'can-tas.5@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Can Taş',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-155.jpg',
        TIMESTAMP '2025-11-16 08:09:16.630',
        TIMESTAMP '2025-11-16 15:48:05.720'
    ),
    (
        'user-ozan-tekin-9',
        'ozan-tekin.40@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Ozan Tekin',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-164.jpg',
        TIMESTAMP '2025-10-28 21:59:11.387',
        TIMESTAMP '2025-11-03 07:22:10.057'
    ),
    (
        'user-eren-sari-10',
        'eren-sari.11@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Eren Sarı',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-183.jpg',
        TIMESTAMP '2025-10-25 16:00:50.187',
        TIMESTAMP '2025-11-15 03:37:27.369'
    ),
    (
        'user-deniz-kaplan-11',
        'deniz-kaplan.6@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Deniz Kaplan',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-184.jpg',
        TIMESTAMP '2025-11-10 18:23:52.072',
        TIMESTAMP '2025-11-15 12:03:34.578'
    ),
    (
        'user-hakan-ozcan-12',
        'hakan-ozcan.72@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Hakan Özcan',
        'employer',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-187.jpg',
        TIMESTAMP '2025-11-10 17:03:49.981',
        TIMESTAMP '2025-11-16 14:05:39.752'
    ),
    (
        'user-onur-polat-13',
        'onur-polat.48@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Onur Polat',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-187.png',
        TIMESTAMP '2025-10-30 08:36:51.753',
        TIMESTAMP '2025-11-10 13:10:58.993'
    ),
    (
        'user-tolga-ozdemir-14',
        'tolga-ozdemir.3@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Tolga Özdemir',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-188.jpg',
        TIMESTAMP '2025-11-07 10:22:36.828',
        TIMESTAMP '2025-11-11 18:23:42.921'
    ),
    (
        'user-yasin-kurt-15',
        'yasin.kurt85@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Yasin Kurt',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-19.jpg',
        TIMESTAMP '2025-11-14 00:34:05.178',
        TIMESTAMP '2025-11-14 14:32:33.381'
    ),
    (
        'user-kerem-koc-16',
        'kerem.koç58@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Kerem Koç',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-21.jpg',
        TIMESTAMP '2025-10-27 09:48:40.836',
        TIMESTAMP '2025-10-31 19:25:23.297'
    ),
    (
        'user-umut-kara-17',
        'umut-kara.19@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Umut Kara',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-23.jpg',
        TIMESTAMP '2025-10-20 03:01:50.526',
        TIMESTAMP '2025-10-27 14:58:21.558'
    ),
    (
        'user-murat-aslan-18',
        'murat-aslan.32@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Murat Aslan',
        'employer',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-25.jpg',
        TIMESTAMP '2025-11-15 10:35:44.993',
        TIMESTAMP '2025-11-15 17:46:01.067'
    ),
    (
        'user-gokhan-kilic-19',
        'gokhan-kilic.87@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Gökhan Kılıç',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-27.jpg',
        TIMESTAMP '2025-11-06 10:06:23.963',
        TIMESTAMP '2025-11-08 03:10:37.159'
    ),
    (
        'user-kaan-dogan-20',
        'kaan-dogan.3@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Kaan Doğan',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-28.jpg',
        TIMESTAMP '2025-11-05 20:22:15.339',
        TIMESTAMP '2025-11-07 11:14:02.570'
    ),
    (
        'user-baran-arslan-21',
        'baran.arslan92@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Baran Arslan',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-32.jpg',
        TIMESTAMP '2025-11-01 12:53:21.476',
        TIMESTAMP '2025-11-14 15:27:21.735'
    ),
    (
        'user-bora-ozturk-22',
        'bora-ozturk.58@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Bora Öztürk',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-34.jpg',
        TIMESTAMP '2025-11-03 01:00:31.052',
        TIMESTAMP '2025-11-08 16:04:21.318'
    ),
    (
        'user-halil-aydin-23',
        'halil.aydın@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Halil Aydın',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-35.jpg',
        TIMESTAMP '2025-10-19 21:25:12.396',
        TIMESTAMP '2025-10-29 21:10:19.530'
    ),
    (
        'user-suat-yildirim-24',
        'suat-yildirim.80@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Suat Yıldırım',
        'employer',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-40.jpg',
        TIMESTAMP '2025-11-11 04:16:51.781',
        TIMESTAMP '2025-11-13 19:32:08.716'
    ),
    (
        'user-serkan-yildiz-25',
        'serkan.yıldız@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Serkan Yıldız',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-41.jpg',
        TIMESTAMP '2025-11-04 05:51:01.377',
        TIMESTAMP '2025-11-09 19:29:19.169'
    ),
    (
        'user-berk-celik-26',
        'berk-celik.9@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Berk Çelik',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-44.jpg',
        TIMESTAMP '2025-10-19 04:07:11.179',
        TIMESTAMP '2025-10-24 08:37:06.611'
    ),
    (
        'user-mert-sahin-27',
        'mert-sahin.1@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Mert Şahin',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-47.jpg',
        TIMESTAMP '2025-11-06 00:53:09.488',
        TIMESTAMP '2025-11-12 04:13:47.082'
    ),
    (
        'user-kadir-demir-28',
        'kadir-demir.58@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Kadir Demir',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-48.jpg',
        TIMESTAMP '2025-11-01 16:49:34.661',
        TIMESTAMP '2025-11-12 19:28:16.519'
    ),
    (
        'user-furkan-kaya-29',
        'furkan.kaya@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Furkan Kaya',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-51.jpg',
        TIMESTAMP '2025-11-08 06:49:19.456',
        TIMESTAMP '2025-11-09 22:46:40.166'
    ),
    (
        'user-cagri-yilmaz-30',
        'cagri-yilmaz.3@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Çağrı Yılmaz',
        'employer',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-53.jpg',
        TIMESTAMP '2025-10-20 17:27:27.476',
        TIMESTAMP '2025-11-04 12:47:11.350'
    ),
    (
        'user-mehmet-oz-31',
        'mehmet-oz.41@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Mehmet Öz',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-62.jpg',
        TIMESTAMP '2025-11-06 22:28:05.780',
        TIMESTAMP '2025-11-13 01:43:00.422'
    ),
    (
        'user-ahmet-gokmen-32',
        'ahmet-gokmen.1@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Ahmet Gökmen',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-67.jpg',
        TIMESTAMP '2025-10-25 07:34:31.275',
        TIMESTAMP '2025-10-29 03:33:41.785'
    ),
    (
        'user-mustafa-kuzu-33',
        'mustafa-kuzu.1@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Mustafa Kuzu',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-76.jpg',
        TIMESTAMP '2025-11-10 16:26:26.062',
        TIMESTAMP '2025-11-15 05:14:06.974'
    ),
    (
        'user-huseyin-karaca-34',
        'huseyin-karaca.7@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Hüseyin Karaca',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-8.jpg',
        TIMESTAMP '2025-11-04 03:45:04.226',
        TIMESTAMP '2025-11-08 09:21:23.962'
    ),
    (
        'user-emre-duman-35',
        'emre-duman.39@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Emre Duman',
        'candidate',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-92.jpg',
        TIMESTAMP '2025-10-23 04:46:17.979',
        TIMESTAMP '2025-10-24 15:06:58.133'
    ),
    (
        'user-burak-oztuna-36',
        'burak-oztuna.38@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Burak Öztuna',
        'employer',
        '/Photos/ProfilePhotos/Man/piclooks-avatar-94.jpg',
        TIMESTAMP '2025-10-25 23:27:25.208',
        TIMESTAMP '2025-11-06 22:11:29.201'
    ),
    (
        'user-derya-toprak-37',
        'derya-toprak.9@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Derya Toprak',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-100.jpg',
        TIMESTAMP '2025-11-15 05:44:14.802',
        TIMESTAMP '2025-11-16 02:50:26.070'
    ),
    (
        'user-gizem-bayrak-38',
        'gizem-bayrak.35@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Gizem Bayrak',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-106.jpg',
        TIMESTAMP '2025-10-19 05:16:17.455',
        TIMESTAMP '2025-10-22 21:44:57.386'
    ),
    (
        'user-busra-erdogdu-39',
        'büşra.erdoğdu@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Büşra Erdoğdu',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-109.jpg',
        TIMESTAMP '2025-11-14 03:26:13.734',
        TIMESTAMP '2025-11-15 05:31:18.763'
    ),
    (
        'user-sibel-ozkan-40',
        'sibel-ozkan.59@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Sibel Özkan',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-115.jpg',
        TIMESTAMP '2025-10-18 18:17:46.304',
        TIMESTAMP '2025-10-29 15:13:20.925'
    ),
    (
        'user-ece-ucar-41',
        'ece.uçar94@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Ece Uçar',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-116.jpg',
        TIMESTAMP '2025-11-05 10:53:10.403',
        TIMESTAMP '2025-11-06 02:43:02.278'
    ),
    (
        'user-pelin-bal-42',
        'pelin.bal@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Pelin Bal',
        'employer',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-117.jpg',
        TIMESTAMP '2025-11-09 01:16:39.280',
        TIMESTAMP '2025-11-11 04:07:00.871'
    ),
    (
        'user-hande-karaaslan-43',
        'hande-karaaslan.5@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Hande Karaaslan',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-118.jpg',
        TIMESTAMP '2025-11-01 15:02:03.644',
        TIMESTAMP '2025-11-08 00:45:53.228'
    ),
    (
        'user-sevgi-dinc-44',
        'sevgi-dinc.15@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Sevgi Dinç',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-13.jpg',
        TIMESTAMP '2025-10-25 14:11:40.667',
        TIMESTAMP '2025-11-09 04:47:30.683'
    ),
    (
        'user-i-rem-sezer-45',
        'i-rem-sezer.62@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'İrem Sezer',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-14.jpg',
        TIMESTAMP '2025-10-31 12:09:47.687',
        TIMESTAMP '2025-11-09 17:38:56.119'
    ),
    (
        'user-tugce-eren-46',
        'tugce-eren.1@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Tuğçe Eren',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-146.jpg',
        TIMESTAMP '2025-11-02 08:28:50.180',
        TIMESTAMP '2025-11-09 02:55:17.342'
    ),
    (
        'user-asli-cetin-47',
        'asli-cetin.5@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Aslı Çetin',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-148.jpg',
        TIMESTAMP '2025-11-08 22:54:34.400',
        TIMESTAMP '2025-11-10 15:26:45.915'
    ),
    (
        'user-nisan-ceylan-48',
        'nisan-ceylan.9@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Nisan Ceylan',
        'employer',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-150.jpg',
        TIMESTAMP '2025-11-02 21:18:25.504',
        TIMESTAMP '2025-11-08 23:55:53.403'
    ),
    (
        'user-melis-yalcin-49',
        'melis.yalçın@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Melis Yalçın',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-151.jpg',
        TIMESTAMP '2025-11-04 19:08:58.792',
        TIMESTAMP '2025-11-10 02:49:17.615'
    ),
    (
        'user-cansu-isik-50',
        'cansu.işık@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Cansu Işık',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-152.jpg',
        TIMESTAMP '2025-11-16 08:04:09.940',
        TIMESTAMP '2025-11-16 16:08:34.451'
    ),
    (
        'user-naz-keskin-51',
        'naz.keskin@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Naz Keskin',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-157.jpg',
        TIMESTAMP '2025-11-15 10:11:53.187',
        TIMESTAMP '2025-11-16 07:32:44.454'
    ),
    (
        'user-yasemin-avci-52',
        'yasemin.avcı@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Yasemin Avcı',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-158.jpg',
        TIMESTAMP '2025-10-31 21:49:05.747',
        TIMESTAMP '2025-11-05 13:50:00.757'
    ),
    (
        'user-kubra-bulut-53',
        'kübra.bulut@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Kübra Bulut',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-160.jpg',
        TIMESTAMP '2025-11-12 12:54:12.282',
        TIMESTAMP '2025-11-12 23:16:28.605'
    ),
    (
        'user-nil-erdogan-54',
        'nil-erdogan.3@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Nil Erdoğan',
        'employer',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-163.jpg',
        TIMESTAMP '2025-10-26 12:51:51.528',
        TIMESTAMP '2025-11-02 08:12:11.900'
    ),
    (
        'user-gul-aksoy-55',
        'gul-aksoy.1@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Gül Aksoy',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-17.png',
        TIMESTAMP '2025-11-11 11:33:42.794',
        TIMESTAMP '2025-11-15 21:16:00.847'
    ),
    (
        'user-sena-bozkurt-56',
        'sena-bozkurt.12@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Sena Bozkurt',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-18.jpg',
        TIMESTAMP '2025-10-25 08:31:20.333',
        TIMESTAMP '2025-11-06 06:06:37.373'
    ),
    (
        'user-esra-gunes-57',
        'esra.güneş@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Esra Güneş',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-20.jpg',
        TIMESTAMP '2025-11-03 04:45:31.979',
        TIMESTAMP '2025-11-08 23:48:11.997'
    ),
    (
        'user-hale-tas-58',
        'hale-tas.46@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Hale Taş',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-24.jpg',
        TIMESTAMP '2025-10-26 23:01:25.366',
        TIMESTAMP '2025-11-11 02:11:28.474'
    ),
    (
        'user-selin-tekin-59',
        'selin-tekin.9@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Selin Tekin',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-26.jpg',
        TIMESTAMP '2025-11-10 04:35:53.874',
        TIMESTAMP '2025-11-16 04:46:06.056'
    ),
    (
        'user-gonca-sari-60',
        'gonca-sari.5@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Gonca Sarı',
        'employer',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-30.jpg',
        TIMESTAMP '2025-11-01 02:30:07.023',
        TIMESTAMP '2025-11-15 08:30:15.845'
    ),
    (
        'user-ayse-kaplan-61',
        'ayse-kaplan.76@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Ayşe Kaplan',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-42.jpg',
        TIMESTAMP '2025-10-24 12:23:24.877',
        TIMESTAMP '2025-11-01 17:29:44.790'
    ),
    (
        'user-zeynep-ozcan-62',
        'zeynep.özcan29@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Zeynep Özcan',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-43.jpg',
        TIMESTAMP '2025-10-29 15:26:44.833',
        TIMESTAMP '2025-11-13 03:08:23.287'
    ),
    (
        'user-elif-polat-63',
        'elif.polat59@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Elif Polat',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-46.jpg',
        TIMESTAMP '2025-11-03 05:07:58.099',
        TIMESTAMP '2025-11-03 05:58:10.040'
    ),
    (
        'user-fatma-ozdemir-64',
        'fatma-ozdemir.8@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Fatma Özdemir',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-49.jpg',
        TIMESTAMP '2025-11-04 13:23:13.240',
        TIMESTAMP '2025-11-10 13:55:35.766'
    ),
    (
        'user-merve-kurt-65',
        'merve-kurt.40@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Merve Kurt',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-5.jpg',
        TIMESTAMP '2025-11-01 08:31:23.592',
        TIMESTAMP '2025-11-12 08:29:34.599'
    ),
    (
        'user-seda-koc-66',
        'seda-koc.83@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Seda Koç',
        'employer',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-50.jpg',
        TIMESTAMP '2025-10-17 19:34:46.430',
        TIMESTAMP '2025-11-16 08:39:48.972'
    ),
    (
        'user-derya-kara-67',
        'derya.kara63@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Derya Kara',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-52.jpg',
        TIMESTAMP '2025-11-07 23:58:36.279',
        TIMESTAMP '2025-11-11 08:09:41.846'
    ),
    (
        'user-gizem-aslan-68',
        'gizem-aslan.49@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Gizem Aslan',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-55.jpg',
        TIMESTAMP '2025-11-03 19:20:08.704',
        TIMESTAMP '2025-11-14 07:00:40.946'
    ),
    (
        'user-busra-kilic-69',
        'büşra.kılıç94@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Büşra Kılıç',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-58.jpg',
        TIMESTAMP '2025-10-27 20:30:32.742',
        TIMESTAMP '2025-10-29 00:47:02.091'
    ),
    (
        'user-sibel-dogan-70',
        'sibel-dogan.6@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Sibel Doğan',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-60.jpg',
        TIMESTAMP '2025-10-31 01:15:59.082',
        TIMESTAMP '2025-11-13 21:40:31.536'
    ),
    (
        'user-ece-arslan-71',
        'ece.arslan@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Ece Arslan',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-65.jpg',
        TIMESTAMP '2025-11-02 07:45:43.523',
        TIMESTAMP '2025-11-09 17:19:26.009'
    ),
    (
        'user-pelin-ozturk-72',
        'pelin.öztürk@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Pelin Öztürk',
        'employer',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-68.jpg',
        TIMESTAMP '2025-11-06 20:23:25.360',
        TIMESTAMP '2025-11-15 18:40:52.586'
    ),
    (
        'user-hande-aydin-73',
        'hande.aydın@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Hande Aydın',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-69.jpg',
        TIMESTAMP '2025-10-29 04:42:54.603',
        TIMESTAMP '2025-11-09 17:11:50.762'
    ),
    (
        'user-sevgi-yildirim-74',
        'sevgi-yildirim.27@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Sevgi Yıldırım',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-71.jpg',
        TIMESTAMP '2025-10-19 19:00:28.518',
        TIMESTAMP '2025-10-20 20:32:10.344'
    ),
    (
        'user-i-rem-yildiz-75',
        'i-rem-yildiz.8@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'İrem Yıldız',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-72.jpg',
        TIMESTAMP '2025-11-11 17:29:11.651',
        TIMESTAMP '2025-11-16 12:55:55.536'
    ),
    (
        'user-tugce-celik-76',
        'tuğçe.çelik@gmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Tuğçe Çelik',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-78.jpg',
        TIMESTAMP '2025-11-12 07:47:02.020',
        TIMESTAMP '2025-11-12 13:08:07.623'
    ),
    (
        'user-asli-sahin-77',
        'aslı.şahin28@outlook.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Aslı Şahin',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-83.jpg',
        TIMESTAMP '2025-10-30 09:21:37.131',
        TIMESTAMP '2025-11-04 23:22:19.636'
    ),
    (
        'user-nisan-demir-78',
        'nisan-demir.4@hotmail.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Nisan Demir',
        'employer',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-86.jpg',
        TIMESTAMP '2025-10-28 15:48:52.136',
        TIMESTAMP '2025-10-30 21:17:13.497'
    ),
    (
        'user-melis-kaya-79',
        'melis-kaya.9@yahoo.com',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Melis Kaya',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-88.jpg',
        TIMESTAMP '2025-11-12 23:56:36.842',
        TIMESTAMP '2025-11-16 02:16:55.879'
    ),
    (
        'user-cansu-yilmaz-80',
        'cansu.yılmaz@proton.me',
        '$2b$10$defaultpasswordhashedvalueforseeddatageneration',
        'Cansu Yılmaz',
        'candidate',
        '/Photos/ProfilePhotos/Woman/piclooks-avatar-98.jpg',
        TIMESTAMP '2025-11-10 00:38:56.749',
        TIMESTAMP '2025-11-11 20:28:18.491'
    )
ON CONFLICT ("id") DO NOTHING;

-- Insert user badges
INSERT INTO "user_badges" (
    "id",
    "userId",
    "badgeId",
    "earnedAt",
    "isDisplayed",
    "featuredOrder"
) VALUES
    (
        'userbadge-mehmet-keskin-badge-react-track',
        'user-mehmet-keskin-1',
        'badge-react-track',
        TIMESTAMP '2025-11-16 02:26:45.007',
        TRUE,
        1
    ),
    (
        'userbadge-mehmet-keskin-badge-angular-track',
        'user-mehmet-keskin-1',
        'badge-angular-track',
        TIMESTAMP '2025-11-16 13:55:03.638',
        TRUE,
        2
    ),
    (
        'userbadge-mehmet-keskin-badge-testing-guru',
        'user-mehmet-keskin-1',
        'badge-testing-guru',
        TIMESTAMP '2025-11-15 17:53:35.357',
        FALSE,
        NULL
    ),
    (
        'userbadge-mehmet-keskin-badge-go-track',
        'user-mehmet-keskin-1',
        'badge-go-track',
        TIMESTAMP '2025-11-15 22:11:54.318',
        FALSE,
        NULL
    ),
    (
        'userbadge-ahmet-avci-badge-angular-track',
        'user-ahmet-avci-2',
        'badge-angular-track',
        TIMESTAMP '2025-11-16 06:30:19.610',
        TRUE,
        1
    ),
    (
        'userbadge-ahmet-avci-badge-vue-track',
        'user-ahmet-avci-2',
        'badge-vue-track',
        TIMESTAMP '2025-11-16 14:13:04.704',
        TRUE,
        2
    ),
    (
        'userbadge-ahmet-avci-badge-react-track',
        'user-ahmet-avci-2',
        'badge-react-track',
        TIMESTAMP '2025-11-14 19:38:43.833',
        FALSE,
        NULL
    ),
    (
        'userbadge-ahmet-avci-badge-go-track',
        'user-ahmet-avci-2',
        'badge-go-track',
        TIMESTAMP '2025-11-14 19:27:28.408',
        FALSE,
        NULL
    ),
    (
        'userbadge-mustafa-bulut-badge-vue-track',
        'user-mustafa-bulut-3',
        'badge-vue-track',
        TIMESTAMP '2025-10-23 15:46:43.968',
        TRUE,
        1
    ),
    (
        'userbadge-mustafa-bulut-badge-react-track',
        'user-mustafa-bulut-3',
        'badge-react-track',
        TIMESTAMP '2025-11-15 04:16:17.554',
        TRUE,
        2
    ),
    (
        'userbadge-huseyin-erdogan-badge-python-track',
        'user-huseyin-erdogan-4',
        'badge-python-track',
        TIMESTAMP '2025-11-11 13:13:56.572',
        TRUE,
        1
    ),
    (
        'userbadge-huseyin-erdogan-badge-flutter-track',
        'user-huseyin-erdogan-4',
        'badge-flutter-track',
        TIMESTAMP '2025-10-25 10:09:42.414',
        TRUE,
        2
    ),
    (
        'userbadge-huseyin-erdogan-badge-perf-expert',
        'user-huseyin-erdogan-4',
        'badge-perf-expert',
        TIMESTAMP '2025-11-05 00:28:25.977',
        FALSE,
        NULL
    ),
    (
        'userbadge-huseyin-erdogan-badge-react-track',
        'user-huseyin-erdogan-4',
        'badge-react-track',
        TIMESTAMP '2025-11-14 22:11:19.415',
        FALSE,
        NULL
    ),
    (
        'userbadge-emre-aksoy-badge-angular-track',
        'user-emre-aksoy-5',
        'badge-angular-track',
        TIMESTAMP '2025-11-16 12:28:56.878',
        TRUE,
        1
    ),
    (
        'userbadge-emre-aksoy-badge-rn-track',
        'user-emre-aksoy-5',
        'badge-rn-track',
        TIMESTAMP '2025-11-13 17:57:04.070',
        TRUE,
        2
    ),
    (
        'userbadge-emre-aksoy-badge-flutter-track',
        'user-emre-aksoy-5',
        'badge-flutter-track',
        TIMESTAMP '2025-11-13 10:56:52.946',
        FALSE,
        NULL
    ),
    (
        'userbadge-emre-aksoy-badge-java-track',
        'user-emre-aksoy-5',
        'badge-java-track',
        TIMESTAMP '2025-11-12 10:17:35.331',
        FALSE,
        NULL
    ),
    (
        'userbadge-burak-bozkurt-badge-vue-track',
        'user-burak-bozkurt-6',
        'badge-vue-track',
        TIMESTAMP '2025-11-06 19:49:42.697',
        TRUE,
        1
    ),
    (
        'userbadge-burak-bozkurt-badge-angular-track',
        'user-burak-bozkurt-6',
        'badge-angular-track',
        TIMESTAMP '2025-11-03 01:56:48.816',
        TRUE,
        2
    ),
    (
        'userbadge-burak-bozkurt-badge-java-track',
        'user-burak-bozkurt-6',
        'badge-java-track',
        TIMESTAMP '2025-10-30 00:58:34.522',
        FALSE,
        NULL
    ),
    (
        'userbadge-burak-bozkurt-badge-testing-guru',
        'user-burak-bozkurt-6',
        'badge-testing-guru',
        TIMESTAMP '2025-11-06 00:55:43.625',
        FALSE,
        NULL
    ),
    (
        'userbadge-cem-gunes-badge-react-track',
        'user-cem-gunes-7',
        'badge-react-track',
        TIMESTAMP '2025-11-14 17:11:59.049',
        TRUE,
        1
    ),
    (
        'userbadge-cem-gunes-badge-flutter-track',
        'user-cem-gunes-7',
        'badge-flutter-track',
        TIMESTAMP '2025-11-16 14:42:10.379',
        TRUE,
        2
    ),
    (
        'userbadge-cem-gunes-badge-node-track',
        'user-cem-gunes-7',
        'badge-node-track',
        TIMESTAMP '2025-11-14 19:29:48.186',
        FALSE,
        NULL
    ),
    (
        'userbadge-can-tas-badge-angular-track',
        'user-can-tas-8',
        'badge-angular-track',
        TIMESTAMP '2025-11-16 09:00:07.776',
        TRUE,
        1
    ),
    (
        'userbadge-can-tas-badge-perf-expert',
        'user-can-tas-8',
        'badge-perf-expert',
        TIMESTAMP '2025-11-16 09:21:24.824',
        TRUE,
        2
    ),
    (
        'userbadge-can-tas-badge-testing-guru',
        'user-can-tas-8',
        'badge-testing-guru',
        TIMESTAMP '2025-11-16 09:09:14.356',
        FALSE,
        NULL
    ),
    (
        'userbadge-can-tas-badge-java-track',
        'user-can-tas-8',
        'badge-java-track',
        TIMESTAMP '2025-11-16 09:45:06.270',
        FALSE,
        NULL
    ),
    (
        'userbadge-ozan-tekin-badge-flutter-track',
        'user-ozan-tekin-9',
        'badge-flutter-track',
        TIMESTAMP '2025-11-10 13:56:28.011',
        TRUE,
        1
    ),
    (
        'userbadge-ozan-tekin-badge-react-track',
        'user-ozan-tekin-9',
        'badge-react-track',
        TIMESTAMP '2025-11-07 00:55:11.010',
        TRUE,
        2
    ),
    (
        'userbadge-ozan-tekin-badge-python-track',
        'user-ozan-tekin-9',
        'badge-python-track',
        TIMESTAMP '2025-11-03 19:00:35.751',
        FALSE,
        NULL
    ),
    (
        'userbadge-ozan-tekin-badge-perf-expert',
        'user-ozan-tekin-9',
        'badge-perf-expert',
        TIMESTAMP '2025-11-11 17:22:04.037',
        FALSE,
        NULL
    ),
    (
        'userbadge-eren-sari-badge-react-track',
        'user-eren-sari-10',
        'badge-react-track',
        TIMESTAMP '2025-10-30 03:28:04.754',
        TRUE,
        1
    ),
    (
        'userbadge-eren-sari-badge-go-track',
        'user-eren-sari-10',
        'badge-go-track',
        TIMESTAMP '2025-11-10 07:21:16.802',
        TRUE,
        2
    ),
    (
        'userbadge-deniz-kaplan-badge-react-track',
        'user-deniz-kaplan-11',
        'badge-react-track',
        TIMESTAMP '2025-11-15 01:23:23.400',
        TRUE,
        1
    ),
    (
        'userbadge-deniz-kaplan-badge-perf-expert',
        'user-deniz-kaplan-11',
        'badge-perf-expert',
        TIMESTAMP '2025-11-12 00:54:44.794',
        TRUE,
        2
    ),
    (
        'userbadge-hakan-ozcan-badge-perf-expert',
        'user-hakan-ozcan-12',
        'badge-perf-expert',
        TIMESTAMP '2025-11-15 02:40:16.627',
        TRUE,
        1
    ),
    (
        'userbadge-hakan-ozcan-badge-rn-track',
        'user-hakan-ozcan-12',
        'badge-rn-track',
        TIMESTAMP '2025-11-16 15:12:41.026',
        TRUE,
        2
    ),
    (
        'userbadge-hakan-ozcan-badge-flutter-track',
        'user-hakan-ozcan-12',
        'badge-flutter-track',
        TIMESTAMP '2025-11-16 07:20:11.104',
        FALSE,
        NULL
    ),
    (
        'userbadge-onur-polat-badge-react-track',
        'user-onur-polat-13',
        'badge-react-track',
        TIMESTAMP '2025-11-13 06:37:31.762',
        TRUE,
        1
    ),
    (
        'userbadge-onur-polat-badge-flutter-track',
        'user-onur-polat-13',
        'badge-flutter-track',
        TIMESTAMP '2025-11-09 19:03:52.088',
        TRUE,
        2
    ),
    (
        'userbadge-onur-polat-badge-vue-track',
        'user-onur-polat-13',
        'badge-vue-track',
        TIMESTAMP '2025-11-04 12:17:01.838',
        FALSE,
        NULL
    ),
    (
        'userbadge-onur-polat-badge-java-track',
        'user-onur-polat-13',
        'badge-java-track',
        TIMESTAMP '2025-11-03 07:23:31.689',
        FALSE,
        NULL
    ),
    (
        'userbadge-tolga-ozdemir-badge-react-track',
        'user-tolga-ozdemir-14',
        'badge-react-track',
        TIMESTAMP '2025-11-11 06:12:19.408',
        TRUE,
        1
    ),
    (
        'userbadge-tolga-ozdemir-badge-go-track',
        'user-tolga-ozdemir-14',
        'badge-go-track',
        TIMESTAMP '2025-11-07 17:38:46.831',
        TRUE,
        2
    ),
    (
        'userbadge-tolga-ozdemir-badge-node-track',
        'user-tolga-ozdemir-14',
        'badge-node-track',
        TIMESTAMP '2025-11-12 07:21:45.218',
        FALSE,
        NULL
    ),
    (
        'userbadge-yasin-kurt-badge-python-track',
        'user-yasin-kurt-15',
        'badge-python-track',
        TIMESTAMP '2025-11-16 05:32:31.558',
        TRUE,
        1
    ),
    (
        'userbadge-yasin-kurt-badge-react-track',
        'user-yasin-kurt-15',
        'badge-react-track',
        TIMESTAMP '2025-11-16 15:01:55.968',
        TRUE,
        2
    ),
    (
        'userbadge-yasin-kurt-badge-testing-guru',
        'user-yasin-kurt-15',
        'badge-testing-guru',
        TIMESTAMP '2025-11-14 10:49:00.085',
        FALSE,
        NULL
    ),
    (
        'userbadge-kerem-koc-badge-react-track',
        'user-kerem-koc-16',
        'badge-react-track',
        TIMESTAMP '2025-11-08 03:23:26.657',
        TRUE,
        1
    ),
    (
        'userbadge-kerem-koc-badge-flutter-track',
        'user-kerem-koc-16',
        'badge-flutter-track',
        TIMESTAMP '2025-10-29 16:25:19.662',
        TRUE,
        2
    ),
    (
        'userbadge-kerem-koc-badge-go-track',
        'user-kerem-koc-16',
        'badge-go-track',
        TIMESTAMP '2025-11-05 22:17:06.214',
        FALSE,
        NULL
    ),
    (
        'userbadge-kerem-koc-badge-rn-track',
        'user-kerem-koc-16',
        'badge-rn-track',
        TIMESTAMP '2025-11-01 22:16:33.881',
        FALSE,
        NULL
    ),
    (
        'userbadge-umut-kara-badge-react-track',
        'user-umut-kara-17',
        'badge-react-track',
        TIMESTAMP '2025-10-28 22:07:53.215',
        TRUE,
        1
    ),
    (
        'userbadge-umut-kara-badge-angular-track',
        'user-umut-kara-17',
        'badge-angular-track',
        TIMESTAMP '2025-10-29 17:04:20.744',
        TRUE,
        2
    ),
    (
        'userbadge-umut-kara-badge-flutter-track',
        'user-umut-kara-17',
        'badge-flutter-track',
        TIMESTAMP '2025-10-23 13:11:42.318',
        FALSE,
        NULL
    ),
    (
        'userbadge-umut-kara-badge-go-track',
        'user-umut-kara-17',
        'badge-go-track',
        TIMESTAMP '2025-10-27 18:51:18.879',
        FALSE,
        NULL
    ),
    (
        'userbadge-murat-aslan-badge-react-track',
        'user-murat-aslan-18',
        'badge-react-track',
        TIMESTAMP '2025-11-15 14:45:39.158',
        TRUE,
        1
    ),
    (
        'userbadge-murat-aslan-badge-testing-guru',
        'user-murat-aslan-18',
        'badge-testing-guru',
        TIMESTAMP '2025-11-15 13:41:44.297',
        TRUE,
        2
    ),
    (
        'userbadge-murat-aslan-badge-vue-track',
        'user-murat-aslan-18',
        'badge-vue-track',
        TIMESTAMP '2025-11-16 15:48:05.217',
        FALSE,
        NULL
    ),
    (
        'userbadge-gokhan-kilic-badge-perf-expert',
        'user-gokhan-kilic-19',
        'badge-perf-expert',
        TIMESTAMP '2025-11-09 18:44:49.231',
        TRUE,
        1
    ),
    (
        'userbadge-gokhan-kilic-badge-node-track',
        'user-gokhan-kilic-19',
        'badge-node-track',
        TIMESTAMP '2025-11-12 11:27:25.016',
        TRUE,
        2
    ),
    (
        'userbadge-kaan-dogan-badge-flutter-track',
        'user-kaan-dogan-20',
        'badge-flutter-track',
        TIMESTAMP '2025-11-11 16:44:23.436',
        TRUE,
        1
    ),
    (
        'userbadge-kaan-dogan-badge-python-track',
        'user-kaan-dogan-20',
        'badge-python-track',
        TIMESTAMP '2025-11-13 06:06:09.738',
        TRUE,
        2
    ),
    (
        'userbadge-baran-arslan-badge-flutter-track',
        'user-baran-arslan-21',
        'badge-flutter-track',
        TIMESTAMP '2025-11-04 19:27:37.008',
        TRUE,
        1
    ),
    (
        'userbadge-baran-arslan-badge-react-track',
        'user-baran-arslan-21',
        'badge-react-track',
        TIMESTAMP '2025-11-15 23:41:25.214',
        TRUE,
        2
    ),
    (
        'userbadge-baran-arslan-badge-java-track',
        'user-baran-arslan-21',
        'badge-java-track',
        TIMESTAMP '2025-11-11 21:21:14.369',
        FALSE,
        NULL
    ),
    (
        'userbadge-bora-ozturk-badge-node-track',
        'user-bora-ozturk-22',
        'badge-node-track',
        TIMESTAMP '2025-11-11 00:11:07.293',
        TRUE,
        1
    ),
    (
        'userbadge-bora-ozturk-badge-flutter-track',
        'user-bora-ozturk-22',
        'badge-flutter-track',
        TIMESTAMP '2025-11-13 21:16:52.098',
        TRUE,
        2
    ),
    (
        'userbadge-halil-aydin-badge-node-track',
        'user-halil-aydin-23',
        'badge-node-track',
        TIMESTAMP '2025-10-29 16:11:31.196',
        TRUE,
        1
    ),
    (
        'userbadge-halil-aydin-badge-perf-expert',
        'user-halil-aydin-23',
        'badge-perf-expert',
        TIMESTAMP '2025-11-14 06:20:47.976',
        TRUE,
        2
    ),
    (
        'userbadge-halil-aydin-badge-vue-track',
        'user-halil-aydin-23',
        'badge-vue-track',
        TIMESTAMP '2025-11-14 00:24:40.765',
        FALSE,
        NULL
    ),
    (
        'userbadge-halil-aydin-badge-python-track',
        'user-halil-aydin-23',
        'badge-python-track',
        TIMESTAMP '2025-10-26 13:36:17.892',
        FALSE,
        NULL
    ),
    (
        'userbadge-suat-yildirim-badge-vue-track',
        'user-suat-yildirim-24',
        'badge-vue-track',
        TIMESTAMP '2025-11-16 11:55:56.061',
        TRUE,
        1
    ),
    (
        'userbadge-suat-yildirim-badge-react-track',
        'user-suat-yildirim-24',
        'badge-react-track',
        TIMESTAMP '2025-11-14 18:21:45.477',
        TRUE,
        2
    ),
    (
        'userbadge-suat-yildirim-badge-angular-track',
        'user-suat-yildirim-24',
        'badge-angular-track',
        TIMESTAMP '2025-11-15 10:48:53.074',
        FALSE,
        NULL
    ),
    (
        'userbadge-suat-yildirim-badge-python-track',
        'user-suat-yildirim-24',
        'badge-python-track',
        TIMESTAMP '2025-11-13 10:06:49.117',
        FALSE,
        NULL
    ),
    (
        'userbadge-serkan-yildiz-badge-python-track',
        'user-serkan-yildiz-25',
        'badge-python-track',
        TIMESTAMP '2025-11-07 07:14:07.932',
        TRUE,
        1
    ),
    (
        'userbadge-serkan-yildiz-badge-angular-track',
        'user-serkan-yildiz-25',
        'badge-angular-track',
        TIMESTAMP '2025-11-08 09:09:54.695',
        TRUE,
        2
    ),
    (
        'userbadge-serkan-yildiz-badge-flutter-track',
        'user-serkan-yildiz-25',
        'badge-flutter-track',
        TIMESTAMP '2025-11-14 21:26:26.616',
        FALSE,
        NULL
    ),
    (
        'userbadge-serkan-yildiz-badge-node-track',
        'user-serkan-yildiz-25',
        'badge-node-track',
        TIMESTAMP '2025-11-07 21:21:39.439',
        FALSE,
        NULL
    ),
    (
        'userbadge-berk-celik-badge-python-track',
        'user-berk-celik-26',
        'badge-python-track',
        TIMESTAMP '2025-11-13 09:47:50.753',
        TRUE,
        1
    ),
    (
        'userbadge-berk-celik-badge-perf-expert',
        'user-berk-celik-26',
        'badge-perf-expert',
        TIMESTAMP '2025-10-25 09:45:45.079',
        TRUE,
        2
    ),
    (
        'userbadge-berk-celik-badge-node-track',
        'user-berk-celik-26',
        'badge-node-track',
        TIMESTAMP '2025-11-13 02:24:21.010',
        FALSE,
        NULL
    ),
    (
        'userbadge-mert-sahin-badge-testing-guru',
        'user-mert-sahin-27',
        'badge-testing-guru',
        TIMESTAMP '2025-11-07 18:48:20.660',
        TRUE,
        1
    ),
    (
        'userbadge-mert-sahin-badge-perf-expert',
        'user-mert-sahin-27',
        'badge-perf-expert',
        TIMESTAMP '2025-11-11 18:17:57.190',
        TRUE,
        2
    ),
    (
        'userbadge-kadir-demir-badge-testing-guru',
        'user-kadir-demir-28',
        'badge-testing-guru',
        TIMESTAMP '2025-11-08 14:24:55.037',
        TRUE,
        1
    ),
    (
        'userbadge-kadir-demir-badge-node-track',
        'user-kadir-demir-28',
        'badge-node-track',
        TIMESTAMP '2025-11-01 20:03:09.230',
        TRUE,
        2
    ),
    (
        'userbadge-furkan-kaya-badge-java-track',
        'user-furkan-kaya-29',
        'badge-java-track',
        TIMESTAMP '2025-11-08 19:32:09.984',
        TRUE,
        1
    ),
    (
        'userbadge-furkan-kaya-badge-flutter-track',
        'user-furkan-kaya-29',
        'badge-flutter-track',
        TIMESTAMP '2025-11-13 21:18:55.388',
        TRUE,
        2
    ),
    (
        'userbadge-furkan-kaya-badge-vue-track',
        'user-furkan-kaya-29',
        'badge-vue-track',
        TIMESTAMP '2025-11-09 16:42:48.822',
        FALSE,
        NULL
    ),
    (
        'userbadge-cagri-yilmaz-badge-rn-track',
        'user-cagri-yilmaz-30',
        'badge-rn-track',
        TIMESTAMP '2025-11-14 17:39:51.612',
        TRUE,
        1
    ),
    (
        'userbadge-cagri-yilmaz-badge-react-track',
        'user-cagri-yilmaz-30',
        'badge-react-track',
        TIMESTAMP '2025-11-14 21:41:49.709',
        TRUE,
        2
    ),
    (
        'userbadge-cagri-yilmaz-badge-flutter-track',
        'user-cagri-yilmaz-30',
        'badge-flutter-track',
        TIMESTAMP '2025-10-31 11:00:26.590',
        FALSE,
        NULL
    ),
    (
        'userbadge-cagri-yilmaz-badge-java-track',
        'user-cagri-yilmaz-30',
        'badge-java-track',
        TIMESTAMP '2025-11-08 20:09:07.797',
        FALSE,
        NULL
    ),
    (
        'userbadge-mehmet-oz-badge-node-track',
        'user-mehmet-oz-31',
        'badge-node-track',
        TIMESTAMP '2025-11-12 06:45:15.164',
        TRUE,
        1
    ),
    (
        'userbadge-mehmet-oz-badge-rn-track',
        'user-mehmet-oz-31',
        'badge-rn-track',
        TIMESTAMP '2025-11-11 01:02:51.257',
        TRUE,
        2
    ),
    (
        'userbadge-mehmet-oz-badge-python-track',
        'user-mehmet-oz-31',
        'badge-python-track',
        TIMESTAMP '2025-11-12 01:42:09.387',
        FALSE,
        NULL
    ),
    (
        'userbadge-mehmet-oz-badge-flutter-track',
        'user-mehmet-oz-31',
        'badge-flutter-track',
        TIMESTAMP '2025-11-14 01:45:09.743',
        FALSE,
        NULL
    ),
    (
        'userbadge-ahmet-gokmen-badge-react-track',
        'user-ahmet-gokmen-32',
        'badge-react-track',
        TIMESTAMP '2025-11-02 17:34:32.494',
        TRUE,
        1
    ),
    (
        'userbadge-ahmet-gokmen-badge-python-track',
        'user-ahmet-gokmen-32',
        'badge-python-track',
        TIMESTAMP '2025-11-06 09:32:59.512',
        TRUE,
        2
    ),
    (
        'userbadge-ahmet-gokmen-badge-vue-track',
        'user-ahmet-gokmen-32',
        'badge-vue-track',
        TIMESTAMP '2025-11-08 02:54:00.924',
        FALSE,
        NULL
    ),
    (
        'userbadge-ahmet-gokmen-badge-perf-expert',
        'user-ahmet-gokmen-32',
        'badge-perf-expert',
        TIMESTAMP '2025-11-13 18:58:51.845',
        FALSE,
        NULL
    ),
    (
        'userbadge-mustafa-kuzu-badge-angular-track',
        'user-mustafa-kuzu-33',
        'badge-angular-track',
        TIMESTAMP '2025-11-15 22:52:09.311',
        TRUE,
        1
    ),
    (
        'userbadge-mustafa-kuzu-badge-python-track',
        'user-mustafa-kuzu-33',
        'badge-python-track',
        TIMESTAMP '2025-11-11 11:34:43.098',
        TRUE,
        2
    ),
    (
        'userbadge-mustafa-kuzu-badge-node-track',
        'user-mustafa-kuzu-33',
        'badge-node-track',
        TIMESTAMP '2025-11-16 11:34:10.219',
        FALSE,
        NULL
    ),
    (
        'userbadge-huseyin-karaca-badge-flutter-track',
        'user-huseyin-karaca-34',
        'badge-flutter-track',
        TIMESTAMP '2025-11-11 08:27:00.092',
        TRUE,
        1
    ),
    (
        'userbadge-huseyin-karaca-badge-python-track',
        'user-huseyin-karaca-34',
        'badge-python-track',
        TIMESTAMP '2025-11-11 07:20:10.717',
        TRUE,
        2
    ),
    (
        'userbadge-emre-duman-badge-vue-track',
        'user-emre-duman-35',
        'badge-vue-track',
        TIMESTAMP '2025-11-15 02:52:13.866',
        TRUE,
        1
    ),
    (
        'userbadge-emre-duman-badge-python-track',
        'user-emre-duman-35',
        'badge-python-track',
        TIMESTAMP '2025-11-07 01:01:32.588',
        TRUE,
        2
    ),
    (
        'userbadge-burak-oztuna-badge-flutter-track',
        'user-burak-oztuna-36',
        'badge-flutter-track',
        TIMESTAMP '2025-11-09 21:29:07.110',
        TRUE,
        1
    ),
    (
        'userbadge-burak-oztuna-badge-vue-track',
        'user-burak-oztuna-36',
        'badge-vue-track',
        TIMESTAMP '2025-10-27 03:20:36.486',
        TRUE,
        2
    ),
    (
        'userbadge-burak-oztuna-badge-node-track',
        'user-burak-oztuna-36',
        'badge-node-track',
        TIMESTAMP '2025-11-12 21:14:55.971',
        FALSE,
        NULL
    ),
    (
        'userbadge-burak-oztuna-badge-react-track',
        'user-burak-oztuna-36',
        'badge-react-track',
        TIMESTAMP '2025-11-05 21:24:30.180',
        FALSE,
        NULL
    ),
    (
        'userbadge-derya-toprak-badge-go-track',
        'user-derya-toprak-37',
        'badge-go-track',
        TIMESTAMP '2025-11-15 21:07:55.563',
        TRUE,
        1
    ),
    (
        'userbadge-derya-toprak-badge-vue-track',
        'user-derya-toprak-37',
        'badge-vue-track',
        TIMESTAMP '2025-11-15 09:25:33.420',
        TRUE,
        2
    ),
    (
        'userbadge-gizem-bayrak-badge-node-track',
        'user-gizem-bayrak-38',
        'badge-node-track',
        TIMESTAMP '2025-10-27 08:23:16.286',
        TRUE,
        1
    ),
    (
        'userbadge-gizem-bayrak-badge-flutter-track',
        'user-gizem-bayrak-38',
        'badge-flutter-track',
        TIMESTAMP '2025-10-21 19:12:19.522',
        TRUE,
        2
    ),
    (
        'userbadge-gizem-bayrak-badge-perf-expert',
        'user-gizem-bayrak-38',
        'badge-perf-expert',
        TIMESTAMP '2025-11-11 16:00:47.221',
        FALSE,
        NULL
    ),
    (
        'userbadge-gizem-bayrak-badge-react-track',
        'user-gizem-bayrak-38',
        'badge-react-track',
        TIMESTAMP '2025-11-02 06:11:26.873',
        FALSE,
        NULL
    ),
    (
        'userbadge-busra-erdogdu-badge-rn-track',
        'user-busra-erdogdu-39',
        'badge-rn-track',
        TIMESTAMP '2025-11-15 17:39:19.497',
        TRUE,
        1
    ),
    (
        'userbadge-busra-erdogdu-badge-testing-guru',
        'user-busra-erdogdu-39',
        'badge-testing-guru',
        TIMESTAMP '2025-11-16 08:07:22.450',
        TRUE,
        2
    ),
    (
        'userbadge-busra-erdogdu-badge-python-track',
        'user-busra-erdogdu-39',
        'badge-python-track',
        TIMESTAMP '2025-11-15 03:48:45.116',
        FALSE,
        NULL
    ),
    (
        'userbadge-sibel-ozkan-badge-react-track',
        'user-sibel-ozkan-40',
        'badge-react-track',
        TIMESTAMP '2025-11-15 14:04:47.493',
        TRUE,
        1
    ),
    (
        'userbadge-sibel-ozkan-badge-python-track',
        'user-sibel-ozkan-40',
        'badge-python-track',
        TIMESTAMP '2025-10-19 14:39:55.095',
        TRUE,
        2
    ),
    (
        'userbadge-sibel-ozkan-badge-vue-track',
        'user-sibel-ozkan-40',
        'badge-vue-track',
        TIMESTAMP '2025-11-02 00:55:46.947',
        FALSE,
        NULL
    ),
    (
        'userbadge-sibel-ozkan-badge-flutter-track',
        'user-sibel-ozkan-40',
        'badge-flutter-track',
        TIMESTAMP '2025-11-02 22:54:04.736',
        FALSE,
        NULL
    ),
    (
        'userbadge-ece-ucar-badge-perf-expert',
        'user-ece-ucar-41',
        'badge-perf-expert',
        TIMESTAMP '2025-11-11 09:12:02.392',
        TRUE,
        1
    ),
    (
        'userbadge-ece-ucar-badge-angular-track',
        'user-ece-ucar-41',
        'badge-angular-track',
        TIMESTAMP '2025-11-05 22:54:33.505',
        TRUE,
        2
    ),
    (
        'userbadge-pelin-bal-badge-react-track',
        'user-pelin-bal-42',
        'badge-react-track',
        TIMESTAMP '2025-11-13 20:01:42.269',
        TRUE,
        1
    ),
    (
        'userbadge-pelin-bal-badge-python-track',
        'user-pelin-bal-42',
        'badge-python-track',
        TIMESTAMP '2025-11-13 11:01:18.807',
        TRUE,
        2
    ),
    (
        'userbadge-hande-karaaslan-badge-flutter-track',
        'user-hande-karaaslan-43',
        'badge-flutter-track',
        TIMESTAMP '2025-11-13 08:02:50.475',
        TRUE,
        1
    ),
    (
        'userbadge-hande-karaaslan-badge-react-track',
        'user-hande-karaaslan-43',
        'badge-react-track',
        TIMESTAMP '2025-11-16 08:10:54.103',
        TRUE,
        2
    ),
    (
        'userbadge-hande-karaaslan-badge-node-track',
        'user-hande-karaaslan-43',
        'badge-node-track',
        TIMESTAMP '2025-11-14 05:03:09.821',
        FALSE,
        NULL
    ),
    (
        'userbadge-hande-karaaslan-badge-rn-track',
        'user-hande-karaaslan-43',
        'badge-rn-track',
        TIMESTAMP '2025-11-09 05:05:06.447',
        FALSE,
        NULL
    ),
    (
        'userbadge-sevgi-dinc-badge-react-track',
        'user-sevgi-dinc-44',
        'badge-react-track',
        TIMESTAMP '2025-10-27 17:02:12.050',
        TRUE,
        1
    ),
    (
        'userbadge-sevgi-dinc-badge-node-track',
        'user-sevgi-dinc-44',
        'badge-node-track',
        TIMESTAMP '2025-11-01 12:17:09.537',
        TRUE,
        2
    ),
    (
        'userbadge-i-rem-sezer-badge-react-track',
        'user-i-rem-sezer-45',
        'badge-react-track',
        TIMESTAMP '2025-11-15 07:33:35.172',
        TRUE,
        1
    ),
    (
        'userbadge-i-rem-sezer-badge-flutter-track',
        'user-i-rem-sezer-45',
        'badge-flutter-track',
        TIMESTAMP '2025-11-10 11:58:23.999',
        TRUE,
        2
    ),
    (
        'userbadge-tugce-eren-badge-java-track',
        'user-tugce-eren-46',
        'badge-java-track',
        TIMESTAMP '2025-11-08 12:04:58.376',
        TRUE,
        1
    ),
    (
        'userbadge-tugce-eren-badge-react-track',
        'user-tugce-eren-46',
        'badge-react-track',
        TIMESTAMP '2025-11-08 08:24:07.536',
        TRUE,
        2
    ),
    (
        'userbadge-asli-cetin-badge-vue-track',
        'user-asli-cetin-47',
        'badge-vue-track',
        TIMESTAMP '2025-11-11 21:59:19.313',
        TRUE,
        1
    ),
    (
        'userbadge-asli-cetin-badge-testing-guru',
        'user-asli-cetin-47',
        'badge-testing-guru',
        TIMESTAMP '2025-11-16 05:33:57.484',
        TRUE,
        2
    ),
    (
        'userbadge-asli-cetin-badge-react-track',
        'user-asli-cetin-47',
        'badge-react-track',
        TIMESTAMP '2025-11-12 01:45:06.267',
        FALSE,
        NULL
    ),
    (
        'userbadge-asli-cetin-badge-flutter-track',
        'user-asli-cetin-47',
        'badge-flutter-track',
        TIMESTAMP '2025-11-09 15:37:45.393',
        FALSE,
        NULL
    ),
    (
        'userbadge-nisan-ceylan-badge-react-track',
        'user-nisan-ceylan-48',
        'badge-react-track',
        TIMESTAMP '2025-11-15 12:14:52.281',
        TRUE,
        1
    ),
    (
        'userbadge-nisan-ceylan-badge-vue-track',
        'user-nisan-ceylan-48',
        'badge-vue-track',
        TIMESTAMP '2025-11-13 23:35:37.873',
        TRUE,
        2
    ),
    (
        'userbadge-melis-yalcin-badge-java-track',
        'user-melis-yalcin-49',
        'badge-java-track',
        TIMESTAMP '2025-11-15 09:02:56.563',
        TRUE,
        1
    ),
    (
        'userbadge-melis-yalcin-badge-rn-track',
        'user-melis-yalcin-49',
        'badge-rn-track',
        TIMESTAMP '2025-11-12 11:40:54.956',
        TRUE,
        2
    ),
    (
        'userbadge-cansu-isik-badge-perf-expert',
        'user-cansu-isik-50',
        'badge-perf-expert',
        TIMESTAMP '2025-11-16 14:05:11.969',
        TRUE,
        1
    ),
    (
        'userbadge-cansu-isik-badge-testing-guru',
        'user-cansu-isik-50',
        'badge-testing-guru',
        TIMESTAMP '2025-11-16 10:27:54.692',
        TRUE,
        2
    ),
    (
        'userbadge-naz-keskin-badge-perf-expert',
        'user-naz-keskin-51',
        'badge-perf-expert',
        TIMESTAMP '2025-11-16 00:43:59.565',
        TRUE,
        1
    ),
    (
        'userbadge-naz-keskin-badge-python-track',
        'user-naz-keskin-51',
        'badge-python-track',
        TIMESTAMP '2025-11-16 12:42:19.386',
        TRUE,
        2
    ),
    (
        'userbadge-naz-keskin-badge-go-track',
        'user-naz-keskin-51',
        'badge-go-track',
        TIMESTAMP '2025-11-16 03:35:35.586',
        FALSE,
        NULL
    ),
    (
        'userbadge-yasemin-avci-badge-react-track',
        'user-yasemin-avci-52',
        'badge-react-track',
        TIMESTAMP '2025-11-11 00:52:17.377',
        TRUE,
        1
    ),
    (
        'userbadge-yasemin-avci-badge-angular-track',
        'user-yasemin-avci-52',
        'badge-angular-track',
        TIMESTAMP '2025-11-12 11:20:24.737',
        TRUE,
        2
    ),
    (
        'userbadge-yasemin-avci-badge-perf-expert',
        'user-yasemin-avci-52',
        'badge-perf-expert',
        TIMESTAMP '2025-11-02 16:43:18.894',
        FALSE,
        NULL
    ),
    (
        'userbadge-kubra-bulut-badge-vue-track',
        'user-kubra-bulut-53',
        'badge-vue-track',
        TIMESTAMP '2025-11-13 15:44:51.170',
        TRUE,
        1
    ),
    (
        'userbadge-kubra-bulut-badge-rn-track',
        'user-kubra-bulut-53',
        'badge-rn-track',
        TIMESTAMP '2025-11-13 19:32:53.774',
        TRUE,
        2
    ),
    (
        'userbadge-nil-erdogan-badge-rn-track',
        'user-nil-erdogan-54',
        'badge-rn-track',
        TIMESTAMP '2025-11-09 02:32:17.430',
        TRUE,
        1
    ),
    (
        'userbadge-nil-erdogan-badge-react-track',
        'user-nil-erdogan-54',
        'badge-react-track',
        TIMESTAMP '2025-11-12 02:00:23.636',
        TRUE,
        2
    ),
    (
        'userbadge-gul-aksoy-badge-node-track',
        'user-gul-aksoy-55',
        'badge-node-track',
        TIMESTAMP '2025-11-16 10:31:47.065',
        TRUE,
        1
    ),
    (
        'userbadge-gul-aksoy-badge-rn-track',
        'user-gul-aksoy-55',
        'badge-rn-track',
        TIMESTAMP '2025-11-12 21:02:00.235',
        TRUE,
        2
    ),
    (
        'userbadge-gul-aksoy-badge-java-track',
        'user-gul-aksoy-55',
        'badge-java-track',
        TIMESTAMP '2025-11-13 21:20:49.217',
        FALSE,
        NULL
    ),
    (
        'userbadge-sena-bozkurt-badge-go-track',
        'user-sena-bozkurt-56',
        'badge-go-track',
        TIMESTAMP '2025-11-13 13:56:55.382',
        TRUE,
        1
    ),
    (
        'userbadge-sena-bozkurt-badge-flutter-track',
        'user-sena-bozkurt-56',
        'badge-flutter-track',
        TIMESTAMP '2025-11-07 11:26:18.361',
        TRUE,
        2
    ),
    (
        'userbadge-esra-gunes-badge-angular-track',
        'user-esra-gunes-57',
        'badge-angular-track',
        TIMESTAMP '2025-11-06 13:29:04.848',
        TRUE,
        1
    ),
    (
        'userbadge-esra-gunes-badge-rn-track',
        'user-esra-gunes-57',
        'badge-rn-track',
        TIMESTAMP '2025-11-08 17:30:46.074',
        TRUE,
        2
    ),
    (
        'userbadge-hale-tas-badge-react-track',
        'user-hale-tas-58',
        'badge-react-track',
        TIMESTAMP '2025-11-04 16:13:28.231',
        TRUE,
        1
    ),
    (
        'userbadge-hale-tas-badge-java-track',
        'user-hale-tas-58',
        'badge-java-track',
        TIMESTAMP '2025-11-02 09:03:02.216',
        TRUE,
        2
    ),
    (
        'userbadge-hale-tas-badge-flutter-track',
        'user-hale-tas-58',
        'badge-flutter-track',
        TIMESTAMP '2025-10-31 23:57:09.270',
        FALSE,
        NULL
    ),
    (
        'userbadge-selin-tekin-badge-react-track',
        'user-selin-tekin-59',
        'badge-react-track',
        TIMESTAMP '2025-11-10 14:20:41.160',
        TRUE,
        1
    ),
    (
        'userbadge-selin-tekin-badge-flutter-track',
        'user-selin-tekin-59',
        'badge-flutter-track',
        TIMESTAMP '2025-11-16 08:43:28.678',
        TRUE,
        2
    ),
    (
        'userbadge-selin-tekin-badge-rn-track',
        'user-selin-tekin-59',
        'badge-rn-track',
        TIMESTAMP '2025-11-13 19:00:15.737',
        FALSE,
        NULL
    ),
    (
        'userbadge-gonca-sari-badge-python-track',
        'user-gonca-sari-60',
        'badge-python-track',
        TIMESTAMP '2025-11-04 22:54:53.587',
        TRUE,
        1
    ),
    (
        'userbadge-gonca-sari-badge-vue-track',
        'user-gonca-sari-60',
        'badge-vue-track',
        TIMESTAMP '2025-11-14 07:23:43.812',
        TRUE,
        2
    ),
    (
        'userbadge-gonca-sari-badge-java-track',
        'user-gonca-sari-60',
        'badge-java-track',
        TIMESTAMP '2025-11-07 08:22:25.320',
        FALSE,
        NULL
    ),
    (
        'userbadge-gonca-sari-badge-flutter-track',
        'user-gonca-sari-60',
        'badge-flutter-track',
        TIMESTAMP '2025-11-12 19:07:08.732',
        FALSE,
        NULL
    ),
    (
        'userbadge-ayse-kaplan-badge-vue-track',
        'user-ayse-kaplan-61',
        'badge-vue-track',
        TIMESTAMP '2025-11-07 20:44:40.912',
        TRUE,
        1
    ),
    (
        'userbadge-ayse-kaplan-badge-node-track',
        'user-ayse-kaplan-61',
        'badge-node-track',
        TIMESTAMP '2025-11-06 08:44:56.412',
        TRUE,
        2
    ),
    (
        'userbadge-ayse-kaplan-badge-angular-track',
        'user-ayse-kaplan-61',
        'badge-angular-track',
        TIMESTAMP '2025-11-16 12:45:09.547',
        FALSE,
        NULL
    ),
    (
        'userbadge-zeynep-ozcan-badge-react-track',
        'user-zeynep-ozcan-62',
        'badge-react-track',
        TIMESTAMP '2025-11-01 03:02:27.549',
        TRUE,
        1
    ),
    (
        'userbadge-zeynep-ozcan-badge-java-track',
        'user-zeynep-ozcan-62',
        'badge-java-track',
        TIMESTAMP '2025-11-14 17:32:41.723',
        TRUE,
        2
    ),
    (
        'userbadge-zeynep-ozcan-badge-rn-track',
        'user-zeynep-ozcan-62',
        'badge-rn-track',
        TIMESTAMP '2025-11-02 15:42:05.441',
        FALSE,
        NULL
    ),
    (
        'userbadge-zeynep-ozcan-badge-flutter-track',
        'user-zeynep-ozcan-62',
        'badge-flutter-track',
        TIMESTAMP '2025-11-16 00:08:05.612',
        FALSE,
        NULL
    ),
    (
        'userbadge-elif-polat-badge-angular-track',
        'user-elif-polat-63',
        'badge-angular-track',
        TIMESTAMP '2025-11-11 23:29:34.077',
        TRUE,
        1
    ),
    (
        'userbadge-elif-polat-badge-vue-track',
        'user-elif-polat-63',
        'badge-vue-track',
        TIMESTAMP '2025-11-10 01:22:33.846',
        TRUE,
        2
    ),
    (
        'userbadge-elif-polat-badge-react-track',
        'user-elif-polat-63',
        'badge-react-track',
        TIMESTAMP '2025-11-12 20:54:16.410',
        FALSE,
        NULL
    ),
    (
        'userbadge-fatma-ozdemir-badge-node-track',
        'user-fatma-ozdemir-64',
        'badge-node-track',
        TIMESTAMP '2025-11-09 03:10:01.415',
        TRUE,
        1
    ),
    (
        'userbadge-fatma-ozdemir-badge-flutter-track',
        'user-fatma-ozdemir-64',
        'badge-flutter-track',
        TIMESTAMP '2025-11-09 14:34:56.496',
        TRUE,
        2
    ),
    (
        'userbadge-fatma-ozdemir-badge-testing-guru',
        'user-fatma-ozdemir-64',
        'badge-testing-guru',
        TIMESTAMP '2025-11-05 13:50:37.071',
        FALSE,
        NULL
    ),
    (
        'userbadge-merve-kurt-badge-perf-expert',
        'user-merve-kurt-65',
        'badge-perf-expert',
        TIMESTAMP '2025-11-04 23:11:19.284',
        TRUE,
        1
    ),
    (
        'userbadge-merve-kurt-badge-angular-track',
        'user-merve-kurt-65',
        'badge-angular-track',
        TIMESTAMP '2025-11-10 20:34:11.917',
        TRUE,
        2
    ),
    (
        'userbadge-merve-kurt-badge-java-track',
        'user-merve-kurt-65',
        'badge-java-track',
        TIMESTAMP '2025-11-13 13:28:13.521',
        FALSE,
        NULL
    ),
    (
        'userbadge-merve-kurt-badge-react-track',
        'user-merve-kurt-65',
        'badge-react-track',
        TIMESTAMP '2025-11-11 04:29:05.271',
        FALSE,
        NULL
    ),
    (
        'userbadge-seda-koc-badge-rn-track',
        'user-seda-koc-66',
        'badge-rn-track',
        TIMESTAMP '2025-11-16 14:33:57.549',
        TRUE,
        1
    ),
    (
        'userbadge-seda-koc-badge-testing-guru',
        'user-seda-koc-66',
        'badge-testing-guru',
        TIMESTAMP '2025-10-24 15:20:25.005',
        TRUE,
        2
    ),
    (
        'userbadge-derya-kara-badge-flutter-track',
        'user-derya-kara-67',
        'badge-flutter-track',
        TIMESTAMP '2025-11-13 09:55:02.199',
        TRUE,
        1
    ),
    (
        'userbadge-derya-kara-badge-react-track',
        'user-derya-kara-67',
        'badge-react-track',
        TIMESTAMP '2025-11-09 16:07:36.131',
        TRUE,
        2
    ),
    (
        'userbadge-derya-kara-badge-java-track',
        'user-derya-kara-67',
        'badge-java-track',
        TIMESTAMP '2025-11-10 12:27:54.453',
        FALSE,
        NULL
    ),
    (
        'userbadge-gizem-aslan-badge-react-track',
        'user-gizem-aslan-68',
        'badge-react-track',
        TIMESTAMP '2025-11-09 01:30:03.817',
        TRUE,
        1
    ),
    (
        'userbadge-gizem-aslan-badge-flutter-track',
        'user-gizem-aslan-68',
        'badge-flutter-track',
        TIMESTAMP '2025-11-05 21:20:00.721',
        TRUE,
        2
    ),
    (
        'userbadge-gizem-aslan-badge-node-track',
        'user-gizem-aslan-68',
        'badge-node-track',
        TIMESTAMP '2025-11-05 06:45:11.447',
        FALSE,
        NULL
    ),
    (
        'userbadge-busra-kilic-badge-vue-track',
        'user-busra-kilic-69',
        'badge-vue-track',
        TIMESTAMP '2025-11-13 10:12:11.667',
        TRUE,
        1
    ),
    (
        'userbadge-busra-kilic-badge-testing-guru',
        'user-busra-kilic-69',
        'badge-testing-guru',
        TIMESTAMP '2025-11-12 04:35:44.184',
        TRUE,
        2
    ),
    (
        'userbadge-sibel-dogan-badge-angular-track',
        'user-sibel-dogan-70',
        'badge-angular-track',
        TIMESTAMP '2025-11-02 18:31:34.481',
        TRUE,
        1
    ),
    (
        'userbadge-sibel-dogan-badge-react-track',
        'user-sibel-dogan-70',
        'badge-react-track',
        TIMESTAMP '2025-11-15 14:35:57.402',
        TRUE,
        2
    ),
    (
        'userbadge-sibel-dogan-badge-testing-guru',
        'user-sibel-dogan-70',
        'badge-testing-guru',
        TIMESTAMP '2025-11-03 14:10:43.109',
        FALSE,
        NULL
    ),
    (
        'userbadge-ece-arslan-badge-testing-guru',
        'user-ece-arslan-71',
        'badge-testing-guru',
        TIMESTAMP '2025-11-08 01:27:58.454',
        TRUE,
        1
    ),
    (
        'userbadge-ece-arslan-badge-react-track',
        'user-ece-arslan-71',
        'badge-react-track',
        TIMESTAMP '2025-11-05 15:48:26.763',
        TRUE,
        2
    ),
    (
        'userbadge-ece-arslan-badge-flutter-track',
        'user-ece-arslan-71',
        'badge-flutter-track',
        TIMESTAMP '2025-11-13 11:59:11.838',
        FALSE,
        NULL
    ),
    (
        'userbadge-pelin-ozturk-badge-vue-track',
        'user-pelin-ozturk-72',
        'badge-vue-track',
        TIMESTAMP '2025-11-10 12:27:03.368',
        TRUE,
        1
    ),
    (
        'userbadge-pelin-ozturk-badge-rn-track',
        'user-pelin-ozturk-72',
        'badge-rn-track',
        TIMESTAMP '2025-11-07 11:22:20.031',
        TRUE,
        2
    ),
    (
        'userbadge-hande-aydin-badge-python-track',
        'user-hande-aydin-73',
        'badge-python-track',
        TIMESTAMP '2025-11-07 19:17:27.439',
        TRUE,
        1
    ),
    (
        'userbadge-hande-aydin-badge-perf-expert',
        'user-hande-aydin-73',
        'badge-perf-expert',
        TIMESTAMP '2025-11-09 21:07:09.156',
        TRUE,
        2
    ),
    (
        'userbadge-sevgi-yildirim-badge-python-track',
        'user-sevgi-yildirim-74',
        'badge-python-track',
        TIMESTAMP '2025-11-10 19:11:28.951',
        TRUE,
        1
    ),
    (
        'userbadge-sevgi-yildirim-badge-flutter-track',
        'user-sevgi-yildirim-74',
        'badge-flutter-track',
        TIMESTAMP '2025-11-06 21:14:59.777',
        TRUE,
        2
    ),
    (
        'userbadge-sevgi-yildirim-badge-testing-guru',
        'user-sevgi-yildirim-74',
        'badge-testing-guru',
        TIMESTAMP '2025-10-22 10:57:23.594',
        FALSE,
        NULL
    ),
    (
        'userbadge-sevgi-yildirim-badge-java-track',
        'user-sevgi-yildirim-74',
        'badge-java-track',
        TIMESTAMP '2025-10-30 06:46:45.271',
        FALSE,
        NULL
    ),
    (
        'userbadge-i-rem-yildiz-badge-angular-track',
        'user-i-rem-yildiz-75',
        'badge-angular-track',
        TIMESTAMP '2025-11-12 13:36:28.849',
        TRUE,
        1
    ),
    (
        'userbadge-i-rem-yildiz-badge-node-track',
        'user-i-rem-yildiz-75',
        'badge-node-track',
        TIMESTAMP '2025-11-11 20:21:50.367',
        TRUE,
        2
    ),
    (
        'userbadge-tugce-celik-badge-node-track',
        'user-tugce-celik-76',
        'badge-node-track',
        TIMESTAMP '2025-11-15 13:22:51.098',
        TRUE,
        1
    ),
    (
        'userbadge-tugce-celik-badge-angular-track',
        'user-tugce-celik-76',
        'badge-angular-track',
        TIMESTAMP '2025-11-14 16:56:15.555',
        TRUE,
        2
    ),
    (
        'userbadge-asli-sahin-badge-go-track',
        'user-asli-sahin-77',
        'badge-go-track',
        TIMESTAMP '2025-10-30 10:01:02.322',
        TRUE,
        1
    ),
    (
        'userbadge-asli-sahin-badge-vue-track',
        'user-asli-sahin-77',
        'badge-vue-track',
        TIMESTAMP '2025-11-02 06:36:51.432',
        TRUE,
        2
    ),
    (
        'userbadge-asli-sahin-badge-react-track',
        'user-asli-sahin-77',
        'badge-react-track',
        TIMESTAMP '2025-11-09 20:07:27.493',
        FALSE,
        NULL
    ),
    (
        'userbadge-nisan-demir-badge-java-track',
        'user-nisan-demir-78',
        'badge-java-track',
        TIMESTAMP '2025-11-05 09:36:57.883',
        TRUE,
        1
    ),
    (
        'userbadge-nisan-demir-badge-flutter-track',
        'user-nisan-demir-78',
        'badge-flutter-track',
        TIMESTAMP '2025-11-03 10:54:20.448',
        TRUE,
        2
    ),
    (
        'userbadge-melis-kaya-badge-java-track',
        'user-melis-kaya-79',
        'badge-java-track',
        TIMESTAMP '2025-11-16 15:12:01.731',
        TRUE,
        1
    ),
    (
        'userbadge-melis-kaya-badge-go-track',
        'user-melis-kaya-79',
        'badge-go-track',
        TIMESTAMP '2025-11-16 01:16:16.917',
        TRUE,
        2
    ),
    (
        'userbadge-cansu-yilmaz-badge-vue-track',
        'user-cansu-yilmaz-80',
        'badge-vue-track',
        TIMESTAMP '2025-11-12 07:42:01.312',
        TRUE,
        1
    ),
    (
        'userbadge-cansu-yilmaz-badge-java-track',
        'user-cansu-yilmaz-80',
        'badge-java-track',
        TIMESTAMP '2025-11-10 15:57:59.562',
        TRUE,
        2
    )
ON CONFLICT ("id") DO NOTHING;

-- Insert quiz attempts (only if quiz exists)
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-keskin-1',
    'user-mehmet-keskin-1',
    'quiz-react-live-044',
    81,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1698,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 04:16:51.953'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-keskin-2',
    'user-mehmet-keskin-1',
    'quiz-react-bug-081',
    95,
    '{"answered":8,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1544,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 04:35:28.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-keskin-3',
    'user-mehmet-keskin-1',
    'quiz-react-test-010',
    86,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    709,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 04:51:12.982'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-keskin-4',
    'user-mehmet-keskin-1',
    'quiz-flutter-live-038',
    77,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    320,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 18:38:59.660'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-avci-1',
    'user-ahmet-avci-2',
    'quiz-react-bug-004',
    75,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    500,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 22:04:01.090'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-avci-2',
    'user-ahmet-avci-2',
    'quiz-react-test-005',
    69,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1699,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 20:39:21.931'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-avci-3',
    'user-ahmet-avci-2',
    'quiz-flutter-live-046',
    69,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    462,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 05:47:25.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-avci-4',
    'user-ahmet-avci-2',
    'quiz-flutter-bug-063',
    70,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    881,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 15:28:27.709'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-avci-5',
    'user-ahmet-avci-2',
    'quiz-flutter-test-088',
    72,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1640,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 18:01:14.350'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-avci-6',
    'user-ahmet-avci-2',
    'quiz-node-live-046',
    85,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    494,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 01:59:50.242'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-bulut-1',
    'user-mustafa-bulut-3',
    'quiz-react-test-098',
    68,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1016,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 07:12:02.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-bulut-2',
    'user-mustafa-bulut-3',
    'quiz-flutter-live-034',
    89,
    '{"answered":11,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1546,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 22:07:09.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-bulut-3',
    'user-mustafa-bulut-3',
    'quiz-flutter-bug-052',
    74,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1298,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 05:34:21.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-bulut-4',
    'user-mustafa-bulut-3',
    'quiz-flutter-test-022',
    71,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    344,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 21:03:17.231'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-bulut-5',
    'user-mustafa-bulut-3',
    'quiz-node-live-083',
    69,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1482,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-29 21:36:40.323'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-huseyin-erdogan-1',
    'user-huseyin-erdogan-4',
    'quiz-flutter-live-058',
    79,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    772,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 17:00:09.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-huseyin-erdogan-2',
    'user-huseyin-erdogan-4',
    'quiz-flutter-bug-052',
    83,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    796,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-22 14:54:01.002'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-huseyin-erdogan-3',
    'user-huseyin-erdogan-4',
    'quiz-flutter-test-008',
    86,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    757,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 08:31:20.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-008')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-emre-aksoy-1',
    'user-emre-aksoy-5',
    'quiz-flutter-bug-021',
    85,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1121,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 17:48:44.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-emre-aksoy-2',
    'user-emre-aksoy-5',
    'quiz-flutter-test-029',
    71,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1509,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 21:39:30.291'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-emre-aksoy-3',
    'user-emre-aksoy-5',
    'quiz-node-live-040',
    68,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1346,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 13:54:27.430'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-bozkurt-1',
    'user-burak-bozkurt-6',
    'quiz-flutter-test-006',
    75,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1705,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 08:19:45.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-006')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-bozkurt-2',
    'user-burak-bozkurt-6',
    'quiz-node-live-031',
    95,
    '{"answered":12,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1248,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 07:12:30.946'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-bozkurt-3',
    'user-burak-bozkurt-6',
    'quiz-node-bug-018',
    77,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1410,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 03:11:50.443'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-bozkurt-4',
    'user-burak-bozkurt-6',
    'quiz-node-test-012',
    80,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1436,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 07:01:37.112'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-012')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-bozkurt-5',
    'user-burak-bozkurt-6',
    'quiz-python-live-006',
    97,
    '{"answered":12,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1707,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 14:30:39.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-bozkurt-6',
    'user-burak-bozkurt-6',
    'quiz-python-bug-001',
    93,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    648,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 01:34:44.026'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cem-gunes-1',
    'user-cem-gunes-7',
    'quiz-node-live-092',
    77,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    412,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 20:21:22.949'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-092')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cem-gunes-2',
    'user-cem-gunes-7',
    'quiz-node-bug-097',
    80,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    585,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 14:31:15.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cem-gunes-3',
    'user-cem-gunes-7',
    'quiz-node-test-070',
    89,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1115,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 18:11:25.980'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-070')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cem-gunes-4',
    'user-cem-gunes-7',
    'quiz-python-live-053',
    84,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1453,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 22:10:47.522'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cem-gunes-5',
    'user-cem-gunes-7',
    'quiz-python-bug-011',
    79,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    772,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 16:33:57.534'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cem-gunes-6',
    'user-cem-gunes-7',
    'quiz-python-test-066',
    81,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    859,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 20:41:53.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-can-tas-1',
    'user-can-tas-8',
    'quiz-node-bug-097',
    72,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    711,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 08:24:51.107'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-can-tas-2',
    'user-can-tas-8',
    'quiz-node-test-053',
    81,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    998,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 12:29:42.625'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-053')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-can-tas-3',
    'user-can-tas-8',
    'quiz-python-live-001',
    82,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1130,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 11:10:08.250'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ozan-tekin-1',
    'user-ozan-tekin-9',
    'quiz-node-test-089',
    77,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    813,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 04:03:49.258'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-089')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ozan-tekin-2',
    'user-ozan-tekin-9',
    'quiz-python-live-035',
    65,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1277,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 10:15:19.661'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ozan-tekin-3',
    'user-ozan-tekin-9',
    'quiz-python-bug-077',
    65,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    471,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 22:33:48.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-eren-sari-1',
    'user-eren-sari-10',
    'quiz-python-live-021',
    72,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    346,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 20:48:29.152'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-eren-sari-2',
    'user-eren-sari-10',
    'quiz-python-bug-064',
    78,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1105,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 05:35:19.274'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-eren-sari-3',
    'user-eren-sari-10',
    'quiz-python-test-004',
    82,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    543,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 19:43:11.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-eren-sari-4',
    'user-eren-sari-10',
    'quiz-angular-live-064',
    73,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    776,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-29 12:16:18.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-064')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-eren-sari-5',
    'user-eren-sari-10',
    'quiz-angular-bug-076',
    70,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1423,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 15:53:40.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-deniz-kaplan-1',
    'user-deniz-kaplan-11',
    'quiz-python-bug-070',
    83,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    811,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 17:39:23.590'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-070')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-deniz-kaplan-2',
    'user-deniz-kaplan-11',
    'quiz-python-test-059',
    84,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    994,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 00:04:44.741'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-deniz-kaplan-3',
    'user-deniz-kaplan-11',
    'quiz-angular-live-039',
    96,
    '{"answered":11,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    980,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 22:31:54.571'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-deniz-kaplan-4',
    'user-deniz-kaplan-11',
    'quiz-angular-bug-045',
    65,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1575,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 15:33:45.724'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hakan-ozcan-1',
    'user-hakan-ozcan-12',
    'quiz-python-test-031',
    75,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    858,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 08:40:21.936'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-031')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hakan-ozcan-2',
    'user-hakan-ozcan-12',
    'quiz-angular-live-035',
    72,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1338,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 22:41:03.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hakan-ozcan-3',
    'user-hakan-ozcan-12',
    'quiz-angular-bug-030',
    87,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    863,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 03:07:37.683'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hakan-ozcan-4',
    'user-hakan-ozcan-12',
    'quiz-angular-test-046',
    84,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    975,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 11:20:10.089'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hakan-ozcan-5',
    'user-hakan-ozcan-12',
    'quiz-vue-live-078',
    86,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1571,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 16:45:37.742'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-onur-polat-1',
    'user-onur-polat-13',
    'quiz-angular-live-019',
    80,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1789,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 18:51:08.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-onur-polat-2',
    'user-onur-polat-13',
    'quiz-angular-bug-076',
    68,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    618,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 15:04:09.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-onur-polat-3',
    'user-onur-polat-13',
    'quiz-angular-test-099',
    87,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1776,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 01:59:32.909'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-099')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tolga-ozdemir-1',
    'user-tolga-ozdemir-14',
    'quiz-angular-bug-073',
    96,
    '{"answered":15,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    319,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 12:02:50.911'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-073')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tolga-ozdemir-2',
    'user-tolga-ozdemir-14',
    'quiz-angular-test-014',
    90,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1519,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 04:44:33.225'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-014')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tolga-ozdemir-3',
    'user-tolga-ozdemir-14',
    'quiz-vue-live-038',
    90,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1058,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 13:53:08.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tolga-ozdemir-4',
    'user-tolga-ozdemir-14',
    'quiz-vue-bug-029',
    79,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1105,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 02:01:02.884'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-029')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tolga-ozdemir-5',
    'user-tolga-ozdemir-14',
    'quiz-vue-test-071',
    88,
    '{"answered":11,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1486,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 02:34:56.553'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tolga-ozdemir-6',
    'user-tolga-ozdemir-14',
    'quiz-rn-live-024',
    83,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1326,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 18:35:42.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasin-kurt-1',
    'user-yasin-kurt-15',
    'quiz-angular-test-059',
    93,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    832,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 19:51:48.442'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasin-kurt-2',
    'user-yasin-kurt-15',
    'quiz-vue-live-089',
    74,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1679,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 08:37:00.800'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasin-kurt-3',
    'user-yasin-kurt-15',
    'quiz-vue-bug-043',
    83,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1334,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 10:40:32.504'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasin-kurt-4',
    'user-yasin-kurt-15',
    'quiz-vue-test-046',
    86,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    433,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 10:19:06.753'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kerem-koc-1',
    'user-kerem-koc-16',
    'quiz-vue-live-070',
    81,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1688,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 12:05:27.384'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kerem-koc-2',
    'user-kerem-koc-16',
    'quiz-vue-bug-086',
    83,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    819,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 20:16:08.877'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-086')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kerem-koc-3',
    'user-kerem-koc-16',
    'quiz-vue-test-005',
    74,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    546,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-27 10:07:52.309'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kerem-koc-4',
    'user-kerem-koc-16',
    'quiz-rn-live-077',
    86,
    '{"answered":11,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1762,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 04:45:08.447'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-077')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-umut-kara-1',
    'user-umut-kara-17',
    'quiz-vue-bug-004',
    92,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1059,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 21:19:50.624'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-umut-kara-2',
    'user-umut-kara-17',
    'quiz-vue-test-036',
    87,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1380,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-20 12:30:40.255'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-036')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-umut-kara-3',
    'user-umut-kara-17',
    'quiz-rn-live-063',
    96,
    '{"answered":11,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    358,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 00:27:54.618'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-umut-kara-4',
    'user-umut-kara-17',
    'quiz-rn-bug-079',
    98,
    '{"answered":12,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    566,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-20 07:15:48.701'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-079')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-umut-kara-5',
    'user-umut-kara-17',
    'quiz-rn-test-082',
    96,
    '{"answered":11,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    495,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 04:51:04.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-082')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-murat-aslan-1',
    'user-murat-aslan-18',
    'quiz-vue-test-024',
    80,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    785,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 10:09:28.781'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-murat-aslan-2',
    'user-murat-aslan-18',
    'quiz-rn-live-060',
    89,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    396,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 22:28:43.205'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-murat-aslan-3',
    'user-murat-aslan-18',
    'quiz-rn-bug-066',
    87,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    393,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 23:15:03.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-murat-aslan-4',
    'user-murat-aslan-18',
    'quiz-rn-test-033',
    69,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    983,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 23:10:54.070'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-murat-aslan-5',
    'user-murat-aslan-18',
    'quiz-java-live-030',
    83,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    879,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 21:46:54.253'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-murat-aslan-6',
    'user-murat-aslan-18',
    'quiz-java-bug-060',
    78,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1282,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 00:38:32.419'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gokhan-kilic-1',
    'user-gokhan-kilic-19',
    'quiz-rn-live-073',
    66,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1593,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 19:32:18.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-073')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gokhan-kilic-2',
    'user-gokhan-kilic-19',
    'quiz-rn-bug-055',
    96,
    '{"answered":8,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1186,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 17:34:17.989'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gokhan-kilic-3',
    'user-gokhan-kilic-19',
    'quiz-rn-test-035',
    65,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1030,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 20:56:31.736'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gokhan-kilic-4',
    'user-gokhan-kilic-19',
    'quiz-java-live-070',
    94,
    '{"answered":11,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    540,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 07:19:32.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gokhan-kilic-5',
    'user-gokhan-kilic-19',
    'quiz-java-bug-018',
    76,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    952,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 06:25:14.629'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kaan-dogan-1',
    'user-kaan-dogan-20',
    'quiz-rn-bug-007',
    96,
    '{"answered":13,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    465,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 00:22:46.996'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-007')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kaan-dogan-2',
    'user-kaan-dogan-20',
    'quiz-rn-test-063',
    65,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1515,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 05:08:57.498'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-063')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kaan-dogan-3',
    'user-kaan-dogan-20',
    'quiz-java-live-063',
    83,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    318,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 12:52:20.673'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kaan-dogan-4',
    'user-kaan-dogan-20',
    'quiz-java-bug-063',
    93,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1773,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 13:40:41.584'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kaan-dogan-5',
    'user-kaan-dogan-20',
    'quiz-java-test-038',
    95,
    '{"answered":8,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    348,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 12:07:22.875'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-038')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kaan-dogan-6',
    'user-kaan-dogan-20',
    'quiz-go-live-023',
    86,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1653,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 01:51:02.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-023')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-baran-arslan-1',
    'user-baran-arslan-21',
    'quiz-rn-test-080',
    75,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1241,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 04:41:06.029'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-baran-arslan-2',
    'user-baran-arslan-21',
    'quiz-java-live-016',
    78,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1406,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 12:54:17.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-baran-arslan-3',
    'user-baran-arslan-21',
    'quiz-java-bug-099',
    66,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    643,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 10:25:33.655'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-bora-ozturk-1',
    'user-bora-ozturk-22',
    'quiz-java-live-054',
    87,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    314,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 03:27:57.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-bora-ozturk-2',
    'user-bora-ozturk-22',
    'quiz-java-bug-050',
    94,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    472,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 16:32:03.126'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-bora-ozturk-3',
    'user-bora-ozturk-22',
    'quiz-java-test-072',
    89,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    581,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 00:01:58.359'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-bora-ozturk-4',
    'user-bora-ozturk-22',
    'quiz-go-live-001',
    94,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    691,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 13:38:00.165'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-halil-aydin-1',
    'user-halil-aydin-23',
    'quiz-java-bug-090',
    87,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1537,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-27 15:20:39.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-090')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-halil-aydin-2',
    'user-halil-aydin-23',
    'quiz-java-test-096',
    70,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    438,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 06:33:13.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-096')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-halil-aydin-3',
    'user-halil-aydin-23',
    'quiz-go-live-057',
    92,
    '{"answered":12,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    961,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 00:55:18.682'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-halil-aydin-4',
    'user-halil-aydin-23',
    'quiz-go-bug-094',
    79,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1696,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-22 21:01:39.770'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-094')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-suat-yildirim-1',
    'user-suat-yildirim-24',
    'quiz-java-test-068',
    87,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1695,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 09:08:26.300'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-068')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-suat-yildirim-2',
    'user-suat-yildirim-24',
    'quiz-go-live-067',
    87,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1702,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 15:09:58.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-suat-yildirim-3',
    'user-suat-yildirim-24',
    'quiz-go-bug-062',
    69,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    442,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 11:50:30.762'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-062')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-serkan-yildiz-1',
    'user-serkan-yildiz-25',
    'quiz-go-live-096',
    84,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1376,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 13:52:25.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-096')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-serkan-yildiz-2',
    'user-serkan-yildiz-25',
    'quiz-go-bug-064',
    71,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    647,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 04:27:45.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-serkan-yildiz-3',
    'user-serkan-yildiz-25',
    'quiz-go-test-013',
    73,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    710,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 13:50:17.267'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-serkan-yildiz-4',
    'user-serkan-yildiz-25',
    'quiz-dotnet-live-088',
    79,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1437,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 17:33:55.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-088')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-berk-celik-1',
    'user-berk-celik-26',
    'quiz-go-bug-001',
    80,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1617,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 04:01:39.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-berk-celik-2',
    'user-berk-celik-26',
    'quiz-go-test-081',
    87,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1285,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 05:37:39.408'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-berk-celik-3',
    'user-berk-celik-26',
    'quiz-dotnet-live-056',
    73,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1748,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 17:26:01.536'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-056')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-berk-celik-4',
    'user-berk-celik-26',
    'quiz-dotnet-bug-066',
    75,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1774,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 20:06:09.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-berk-celik-5',
    'user-berk-celik-26',
    'quiz-dotnet-test-010',
    89,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1282,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-20 14:12:36.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mert-sahin-1',
    'user-mert-sahin-27',
    'quiz-go-test-083',
    68,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1306,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 15:49:52.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-083')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mert-sahin-2',
    'user-mert-sahin-27',
    'quiz-dotnet-live-054',
    90,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    470,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 00:50:43.369'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mert-sahin-3',
    'user-mert-sahin-27',
    'quiz-dotnet-bug-045',
    84,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1689,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 02:55:12.815'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mert-sahin-4',
    'user-mert-sahin-27',
    'quiz-dotnet-test-081',
    68,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    332,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 00:38:34.749'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mert-sahin-5',
    'user-mert-sahin-27',
    'quiz-react-adv-live-020',
    87,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    852,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 03:50:34.848'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mert-sahin-6',
    'user-mert-sahin-27',
    'quiz-react-adv-bug-002',
    75,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1362,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 04:52:18.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kadir-demir-1',
    'user-kadir-demir-28',
    'quiz-dotnet-live-012',
    93,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1349,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 05:26:13.727'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kadir-demir-2',
    'user-kadir-demir-28',
    'quiz-dotnet-bug-024',
    74,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    477,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 22:33:28.148'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kadir-demir-3',
    'user-kadir-demir-28',
    'quiz-dotnet-test-088',
    79,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1697,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 08:27:45.013'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kadir-demir-4',
    'user-kadir-demir-28',
    'quiz-react-adv-live-026',
    95,
    '{"answered":13,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    397,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 11:10:49.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-026')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kadir-demir-5',
    'user-kadir-demir-28',
    'quiz-react-adv-bug-010',
    90,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    960,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 16:25:02.050'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-furkan-kaya-1',
    'user-furkan-kaya-29',
    'quiz-dotnet-bug-019',
    76,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1626,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 07:59:20.239'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-furkan-kaya-2',
    'user-furkan-kaya-29',
    'quiz-dotnet-test-071',
    86,
    '{"answered":11,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    424,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 08:34:55.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-furkan-kaya-3',
    'user-furkan-kaya-29',
    'quiz-react-adv-live-035',
    84,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1751,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 18:40:21.929'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-furkan-kaya-4',
    'user-furkan-kaya-29',
    'quiz-react-adv-bug-020',
    65,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1528,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 10:58:22.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-furkan-kaya-5',
    'user-furkan-kaya-29',
    'quiz-react-adv-test-024',
    83,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    988,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 16:09:51.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cagri-yilmaz-1',
    'user-cagri-yilmaz-30',
    'quiz-dotnet-test-056',
    96,
    '{"answered":8,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    504,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 07:35:02.215'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cagri-yilmaz-2',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-live-040',
    77,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    666,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 00:14:53.494'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cagri-yilmaz-3',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-bug-002',
    67,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    381,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-27 03:41:31.396'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cagri-yilmaz-4',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-test-028',
    83,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    830,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 13:13:35.296'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cagri-yilmaz-5',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-live-024',
    74,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    702,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-24 18:54:31.717'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cagri-yilmaz-6',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-bug-037',
    85,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    971,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 16:35:05.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-oz-1',
    'user-mehmet-oz-31',
    'quiz-react-adv-live-002',
    90,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1529,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 20:35:46.410'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-oz-2',
    'user-mehmet-oz-31',
    'quiz-react-adv-bug-002',
    85,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    447,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 19:31:15.247'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-oz-3',
    'user-mehmet-oz-31',
    'quiz-react-adv-test-041',
    88,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    746,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 07:14:18.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-041')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-oz-4',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-live-012',
    94,
    '{"answered":12,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1460,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 04:01:55.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-oz-5',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-bug-011',
    70,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    669,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 15:06:24.405'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mehmet-oz-6',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-test-023',
    80,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1568,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 10:48:02.406'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-gokmen-1',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-bug-010',
    95,
    '{"answered":14,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1418,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-27 02:54:11.012'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-gokmen-2',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-test-022',
    95,
    '{"answered":13,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    496,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 23:58:28.855'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-gokmen-3',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-live-001',
    71,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1455,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 03:46:06.834'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-gokmen-4',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-bug-015',
    71,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    426,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 05:15:49.729'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ahmet-gokmen-5',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-test-002',
    85,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1341,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-30 14:04:35.777'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-kuzu-1',
    'user-mustafa-kuzu-33',
    'quiz-react-adv-test-018',
    68,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    679,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 18:09:19.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-kuzu-2',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-live-050',
    75,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    632,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 00:29:54.251'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-kuzu-3',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-bug-047',
    97,
    '{"answered":15,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1117,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 11:58:57.387'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-047')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-mustafa-kuzu-4',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-test-003',
    71,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1056,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 18:33:50.509'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-huseyin-karaca-1',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-live-016',
    81,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1129,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 23:38:46.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-huseyin-karaca-2',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-bug-013',
    67,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    718,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 12:04:42.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-013')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-huseyin-karaca-3',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-test-045',
    97,
    '{"answered":10,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    419,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 14:09:27.628'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-huseyin-karaca-4',
    'user-huseyin-karaca-34',
    'quiz-node-adv-live-039',
    89,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1048,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 11:13:34.907'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-emre-duman-1',
    'user-emre-duman-35',
    'quiz-flutter-adv-bug-019',
    76,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1445,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 00:32:33.775'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-emre-duman-2',
    'user-emre-duman-35',
    'quiz-flutter-adv-test-034',
    93,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    360,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 21:43:10.822'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-emre-duman-3',
    'user-emre-duman-35',
    'quiz-node-adv-live-031',
    72,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    615,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 05:53:04.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-oztuna-1',
    'user-burak-oztuna-36',
    'quiz-flutter-adv-test-047',
    77,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    527,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 03:53:07.829'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-oztuna-2',
    'user-burak-oztuna-36',
    'quiz-node-adv-live-045',
    90,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    705,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 02:29:17.441'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-045')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-burak-oztuna-3',
    'user-burak-oztuna-36',
    'quiz-node-adv-bug-037',
    96,
    '{"answered":9,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    838,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 13:37:07.616'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-derya-toprak-1',
    'user-derya-toprak-37',
    'quiz-node-adv-live-021',
    65,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    479,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 15:46:00.768'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-derya-toprak-2',
    'user-derya-toprak-37',
    'quiz-node-adv-bug-021',
    84,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1296,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 15:17:45.890'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-derya-toprak-3',
    'user-derya-toprak-37',
    'quiz-node-adv-test-011',
    65,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1216,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 02:57:12.173'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-bayrak-1',
    'user-gizem-bayrak-38',
    'quiz-node-adv-bug-036',
    87,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1710,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-24 02:19:21.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-bayrak-2',
    'user-gizem-bayrak-38',
    'quiz-node-adv-test-034',
    91,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    372,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-23 19:55:25.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-bayrak-3',
    'user-gizem-bayrak-38',
    'quiz-python-adv-live-009',
    79,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1639,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-24 12:06:51.810'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-bayrak-4',
    'user-gizem-bayrak-38',
    'quiz-python-adv-bug-046',
    71,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    371,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 14:10:38.376'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-046')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-bayrak-5',
    'user-gizem-bayrak-38',
    'quiz-python-adv-test-001',
    98,
    '{"answered":10,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    698,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-27 10:38:45.451'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-erdogdu-1',
    'user-busra-erdogdu-39',
    'quiz-node-adv-test-018',
    73,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1541,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 23:28:21.361'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-erdogdu-2',
    'user-busra-erdogdu-39',
    'quiz-python-adv-live-016',
    95,
    '{"answered":10,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    606,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 18:24:34.533'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-erdogdu-3',
    'user-busra-erdogdu-39',
    'quiz-python-adv-bug-018',
    83,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    514,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 12:51:35.530'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-erdogdu-4',
    'user-busra-erdogdu-39',
    'quiz-python-adv-test-045',
    92,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1782,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 08:15:05.271'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-erdogdu-5',
    'user-busra-erdogdu-39',
    'quiz-react-live-057',
    97,
    '{"answered":9,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    468,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 00:03:50.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-ozkan-1',
    'user-sibel-ozkan-40',
    'quiz-python-adv-live-015',
    91,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    445,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 05:48:14.731'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-015')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-ozkan-2',
    'user-sibel-ozkan-40',
    'quiz-python-adv-bug-032',
    77,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    437,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-24 06:36:50.060'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-032')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-ozkan-3',
    'user-sibel-ozkan-40',
    'quiz-python-adv-test-042',
    75,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1682,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 10:45:04.045'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-042')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-ozkan-4',
    'user-sibel-ozkan-40',
    'quiz-react-live-038',
    88,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    478,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 01:52:48.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-ozkan-5',
    'user-sibel-ozkan-40',
    'quiz-react-bug-054',
    97,
    '{"answered":8,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1449,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 06:51:20.314'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-054')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ece-ucar-1',
    'user-ece-ucar-41',
    'quiz-python-adv-bug-015',
    91,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    577,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 11:41:26.319'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ece-ucar-2',
    'user-ece-ucar-41',
    'quiz-python-adv-test-047',
    75,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    761,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 22:10:13.597'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ece-ucar-3',
    'user-ece-ucar-41',
    'quiz-react-live-047',
    88,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1074,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 05:26:17.127'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-pelin-bal-1',
    'user-pelin-bal-42',
    'quiz-python-adv-test-034',
    84,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1159,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 19:22:05.487'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-pelin-bal-2',
    'user-pelin-bal-42',
    'quiz-react-live-060',
    76,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    733,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 20:32:07.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-pelin-bal-3',
    'user-pelin-bal-42',
    'quiz-react-bug-055',
    92,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    804,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 16:05:17.463'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-karaaslan-1',
    'user-hande-karaaslan-43',
    'quiz-react-live-062',
    77,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    944,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 22:24:31.942'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-062')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-karaaslan-2',
    'user-hande-karaaslan-43',
    'quiz-react-bug-009',
    84,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1501,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 20:20:56.423'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-009')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-karaaslan-3',
    'user-hande-karaaslan-43',
    'quiz-react-test-061',
    77,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1329,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 23:59:17.956'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-061')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-karaaslan-4',
    'user-hande-karaaslan-43',
    'quiz-flutter-live-005',
    72,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1175,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 07:23:36.347'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-005')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-karaaslan-5',
    'user-hande-karaaslan-43',
    'quiz-flutter-bug-021',
    69,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    926,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 23:18:47.234'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-karaaslan-6',
    'user-hande-karaaslan-43',
    'quiz-flutter-test-081',
    97,
    '{"answered":9,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    311,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 10:02:03.934'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-dinc-1',
    'user-sevgi-dinc-44',
    'quiz-react-bug-039',
    76,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1170,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 13:43:23.596'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-039')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-dinc-2',
    'user-sevgi-dinc-44',
    'quiz-react-test-016',
    71,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1155,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 13:07:24.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-016')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-dinc-3',
    'user-sevgi-dinc-44',
    'quiz-flutter-live-069',
    74,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1642,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-28 16:49:21.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-069')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-dinc-4',
    'user-sevgi-dinc-44',
    'quiz-flutter-bug-093',
    86,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    629,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 12:26:24.385'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-dinc-5',
    'user-sevgi-dinc-44',
    'quiz-flutter-test-066',
    84,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    812,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 21:23:41.390'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-sezer-1',
    'user-i-rem-sezer-45',
    'quiz-react-test-060',
    77,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    567,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 07:11:40.663'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-060')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-sezer-2',
    'user-i-rem-sezer-45',
    'quiz-flutter-live-020',
    94,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1446,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 08:17:04.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-sezer-3',
    'user-i-rem-sezer-45',
    'quiz-flutter-bug-084',
    78,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    645,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 21:02:54.559'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-sezer-4',
    'user-i-rem-sezer-45',
    'quiz-flutter-test-072',
    89,
    '{"answered":12,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    830,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 09:14:31.554'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-sezer-5',
    'user-i-rem-sezer-45',
    'quiz-node-live-089',
    73,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    742,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 04:30:46.490'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-eren-1',
    'user-tugce-eren-46',
    'quiz-flutter-live-051',
    70,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    918,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 17:48:17.836'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-eren-2',
    'user-tugce-eren-46',
    'quiz-flutter-bug-099',
    69,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    584,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 23:20:33.924'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-eren-3',
    'user-tugce-eren-46',
    'quiz-flutter-test-088',
    67,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1314,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 21:01:17.302'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-eren-4',
    'user-tugce-eren-46',
    'quiz-node-live-019',
    74,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1242,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 10:21:59.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-eren-5',
    'user-tugce-eren-46',
    'quiz-node-bug-081',
    93,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1070,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 02:33:40.966'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-eren-6',
    'user-tugce-eren-46',
    'quiz-node-test-069',
    88,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1337,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 06:46:28.819'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-cetin-1',
    'user-asli-cetin-47',
    'quiz-flutter-bug-056',
    74,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    923,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 13:36:56.845'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-056')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-cetin-2',
    'user-asli-cetin-47',
    'quiz-flutter-test-088',
    78,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1350,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 03:44:00.322'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-cetin-3',
    'user-asli-cetin-47',
    'quiz-node-live-021',
    85,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    953,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 15:21:39.786'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nisan-ceylan-1',
    'user-nisan-ceylan-48',
    'quiz-flutter-test-033',
    73,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    726,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 10:13:27.542'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nisan-ceylan-2',
    'user-nisan-ceylan-48',
    'quiz-node-live-094',
    70,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    510,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 19:03:11.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-094')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nisan-ceylan-3',
    'user-nisan-ceylan-48',
    'quiz-node-bug-020',
    83,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1742,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 21:51:15.086'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nisan-ceylan-4',
    'user-nisan-ceylan-48',
    'quiz-node-test-029',
    95,
    '{"answered":12,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    853,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 15:51:46.375'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-yalcin-1',
    'user-melis-yalcin-49',
    'quiz-node-live-050',
    86,
    '{"answered":11,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1632,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 08:31:40.455'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-yalcin-2',
    'user-melis-yalcin-49',
    'quiz-node-bug-060',
    84,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1052,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 03:38:41.211'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-yalcin-3',
    'user-melis-yalcin-49',
    'quiz-node-test-035',
    77,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1764,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 05:35:59.061'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-yalcin-4',
    'user-melis-yalcin-49',
    'quiz-python-live-004',
    75,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    813,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 05:15:13.428'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-004')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-isik-1',
    'user-cansu-isik-50',
    'quiz-node-bug-059',
    93,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    618,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 14:56:03.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-059')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-isik-2',
    'user-cansu-isik-50',
    'quiz-node-test-040',
    83,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1326,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 11:37:48.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-isik-3',
    'user-cansu-isik-50',
    'quiz-python-live-051',
    78,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1041,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 16:09:41.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-naz-keskin-1',
    'user-naz-keskin-51',
    'quiz-node-test-079',
    86,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1285,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 21:54:17.214'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-naz-keskin-2',
    'user-naz-keskin-51',
    'quiz-python-live-083',
    70,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    341,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 04:01:56.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-naz-keskin-3',
    'user-naz-keskin-51',
    'quiz-python-bug-021',
    69,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1459,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 19:03:43.962'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-naz-keskin-4',
    'user-naz-keskin-51',
    'quiz-python-test-075',
    83,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    638,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 13:40:24.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-075')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-naz-keskin-5',
    'user-naz-keskin-51',
    'quiz-angular-live-058',
    68,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    472,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 05:44:07.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasemin-avci-1',
    'user-yasemin-avci-52',
    'quiz-python-live-078',
    70,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    720,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 02:34:21.320'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasemin-avci-2',
    'user-yasemin-avci-52',
    'quiz-python-bug-034',
    73,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1160,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 08:33:13.593'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasemin-avci-3',
    'user-yasemin-avci-52',
    'quiz-python-test-009',
    82,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1329,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 20:50:19.839'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasemin-avci-4',
    'user-yasemin-avci-52',
    'quiz-angular-live-027',
    68,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    699,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 18:41:21.273'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-027')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasemin-avci-5',
    'user-yasemin-avci-52',
    'quiz-angular-bug-050',
    77,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    765,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 04:51:48.614'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-yasemin-avci-6',
    'user-yasemin-avci-52',
    'quiz-angular-test-003',
    66,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1431,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 01:49:05.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kubra-bulut-1',
    'user-kubra-bulut-53',
    'quiz-python-bug-077',
    87,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1453,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 06:26:08.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kubra-bulut-2',
    'user-kubra-bulut-53',
    'quiz-python-test-079',
    69,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1166,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 13:00:10.403'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kubra-bulut-3',
    'user-kubra-bulut-53',
    'quiz-angular-live-057',
    98,
    '{"answered":15,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1493,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 03:11:37.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-kubra-bulut-4',
    'user-kubra-bulut-53',
    'quiz-angular-bug-031',
    82,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1181,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 04:26:27.840'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-031')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nil-erdogan-1',
    'user-nil-erdogan-54',
    'quiz-python-test-069',
    73,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    766,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 18:03:29.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nil-erdogan-2',
    'user-nil-erdogan-54',
    'quiz-angular-live-058',
    76,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1407,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-29 14:47:38.977'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nil-erdogan-3',
    'user-nil-erdogan-54',
    'quiz-angular-bug-083',
    78,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    344,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 02:35:06.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-083')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gul-aksoy-1',
    'user-gul-aksoy-55',
    'quiz-angular-live-047',
    77,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    910,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 23:22:50.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gul-aksoy-2',
    'user-gul-aksoy-55',
    'quiz-angular-bug-030',
    66,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    913,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 00:47:22.959'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gul-aksoy-3',
    'user-gul-aksoy-55',
    'quiz-angular-test-085',
    66,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1675,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 20:06:01.506'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-085')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sena-bozkurt-1',
    'user-sena-bozkurt-56',
    'quiz-angular-bug-093',
    89,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1176,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 03:05:40.851'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sena-bozkurt-2',
    'user-sena-bozkurt-56',
    'quiz-angular-test-023',
    90,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1308,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 05:48:41.745'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sena-bozkurt-3',
    'user-sena-bozkurt-56',
    'quiz-vue-live-041',
    87,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    397,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 11:28:42.401'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-041')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sena-bozkurt-4',
    'user-sena-bozkurt-56',
    'quiz-vue-bug-006',
    71,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1134,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 14:19:40.575'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-006')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-esra-gunes-1',
    'user-esra-gunes-57',
    'quiz-angular-test-074',
    86,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    990,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 04:35:39.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-esra-gunes-2',
    'user-esra-gunes-57',
    'quiz-vue-live-053',
    72,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    451,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 19:44:20.868'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-esra-gunes-3',
    'user-esra-gunes-57',
    'quiz-vue-bug-071',
    67,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    839,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 22:18:42.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-071')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-esra-gunes-4',
    'user-esra-gunes-57',
    'quiz-vue-test-071',
    70,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1714,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 10:50:35.136'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hale-tas-1',
    'user-hale-tas-58',
    'quiz-vue-live-099',
    73,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1645,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 08:12:04.526'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-099')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hale-tas-2',
    'user-hale-tas-58',
    'quiz-vue-bug-084',
    69,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    389,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 04:56:22.837'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hale-tas-3',
    'user-hale-tas-58',
    'quiz-vue-test-057',
    72,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1050,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-27 10:58:17.016'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-057')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hale-tas-4',
    'user-hale-tas-58',
    'quiz-rn-live-075',
    72,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    691,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 13:01:38.612'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-075')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hale-tas-5',
    'user-hale-tas-58',
    'quiz-rn-bug-015',
    85,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1570,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 12:53:37.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hale-tas-6',
    'user-hale-tas-58',
    'quiz-rn-test-009',
    79,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    807,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 11:55:31.744'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-selin-tekin-1',
    'user-selin-tekin-59',
    'quiz-vue-bug-092',
    95,
    '{"answered":11,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1750,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 05:06:47.400'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-092')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-selin-tekin-2',
    'user-selin-tekin-59',
    'quiz-vue-test-011',
    96,
    '{"answered":12,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1259,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 06:52:18.334'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-selin-tekin-3',
    'user-selin-tekin-59',
    'quiz-rn-live-052',
    84,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1783,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 15:32:28.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-052')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gonca-sari-1',
    'user-gonca-sari-60',
    'quiz-vue-test-027',
    70,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1357,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 03:49:34.286'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-027')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gonca-sari-2',
    'user-gonca-sari-60',
    'quiz-rn-live-083',
    94,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1304,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-03 06:05:42.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gonca-sari-3',
    'user-gonca-sari-60',
    'quiz-rn-bug-051',
    82,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    984,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 17:13:37.766'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-051')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ayse-kaplan-1',
    'user-ayse-kaplan-61',
    'quiz-rn-live-002',
    75,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1600,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 15:54:39.778'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ayse-kaplan-2',
    'user-ayse-kaplan-61',
    'quiz-rn-bug-097',
    97,
    '{"answered":15,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1299,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 03:25:46.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ayse-kaplan-3',
    'user-ayse-kaplan-61',
    'quiz-rn-test-001',
    81,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    648,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-29 00:34:51.556'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ayse-kaplan-4',
    'user-ayse-kaplan-61',
    'quiz-java-live-014',
    96,
    '{"answered":9,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    622,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 09:22:33.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-zeynep-ozcan-1',
    'user-zeynep-ozcan-62',
    'quiz-rn-bug-001',
    92,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1067,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 05:11:23.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-zeynep-ozcan-2',
    'user-zeynep-ozcan-62',
    'quiz-rn-test-056',
    70,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1159,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 19:20:49.360'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-zeynep-ozcan-3',
    'user-zeynep-ozcan-62',
    'quiz-java-live-067',
    67,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1437,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 06:30:07.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-elif-polat-1',
    'user-elif-polat-63',
    'quiz-rn-test-098',
    88,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    888,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 14:29:51.767'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-elif-polat-2',
    'user-elif-polat-63',
    'quiz-java-live-031',
    77,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1066,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 14:30:29.163'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-elif-polat-3',
    'user-elif-polat-63',
    'quiz-java-bug-049',
    65,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    375,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 03:27:19.315'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-049')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-elif-polat-4',
    'user-elif-polat-63',
    'quiz-java-test-044',
    87,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1531,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 06:22:28.538'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-044')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-elif-polat-5',
    'user-elif-polat-63',
    'quiz-go-live-040',
    95,
    '{"answered":12,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    641,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 02:08:05.066'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-elif-polat-6',
    'user-elif-polat-63',
    'quiz-go-bug-022',
    72,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1597,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 18:28:37.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-022')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-fatma-ozdemir-1',
    'user-fatma-ozdemir-64',
    'quiz-java-live-030',
    92,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    739,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 02:09:53.433'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-fatma-ozdemir-2',
    'user-fatma-ozdemir-64',
    'quiz-java-bug-045',
    91,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1435,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 15:39:04.285'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-fatma-ozdemir-3',
    'user-fatma-ozdemir-64',
    'quiz-java-test-013',
    90,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1654,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 01:59:13.631'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-fatma-ozdemir-4',
    'user-fatma-ozdemir-64',
    'quiz-go-live-043',
    80,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1748,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 11:38:19.445'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-043')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-fatma-ozdemir-5',
    'user-fatma-ozdemir-64',
    'quiz-go-bug-015',
    72,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    649,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 09:44:06.095'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-fatma-ozdemir-6',
    'user-fatma-ozdemir-64',
    'quiz-go-test-028',
    86,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    630,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 07:19:21.432'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-merve-kurt-1',
    'user-merve-kurt-65',
    'quiz-java-bug-005',
    84,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1660,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 20:17:47.310'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-005')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-merve-kurt-2',
    'user-merve-kurt-65',
    'quiz-java-test-084',
    98,
    '{"answered":14,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1210,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 13:34:48.470'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-084')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-merve-kurt-3',
    'user-merve-kurt-65',
    'quiz-go-live-051',
    98,
    '{"answered":13,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    835,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 03:44:13.121'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-merve-kurt-4',
    'user-merve-kurt-65',
    'quiz-go-bug-065',
    90,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    837,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 17:22:42.099'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-065')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-merve-kurt-5',
    'user-merve-kurt-65',
    'quiz-go-test-002',
    92,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1696,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 12:15:03.804'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-seda-koc-1',
    'user-seda-koc-66',
    'quiz-java-test-024',
    98,
    '{"answered":13,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1397,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-26 06:02:39.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-seda-koc-2',
    'user-seda-koc-66',
    'quiz-go-live-014',
    73,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1734,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 09:00:36.964'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-seda-koc-3',
    'user-seda-koc-66',
    'quiz-go-bug-080',
    80,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1113,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 23:51:31.622'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-080')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-seda-koc-4',
    'user-seda-koc-66',
    'quiz-go-test-047',
    91,
    '{"answered":11,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1135,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-23 02:49:26.838'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-derya-kara-1',
    'user-derya-kara-67',
    'quiz-go-live-013',
    82,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1027,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 07:02:31.787'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-013')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-derya-kara-2',
    'user-derya-kara-67',
    'quiz-go-bug-066',
    66,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    846,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 15:37:09.932'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-derya-kara-3',
    'user-derya-kara-67',
    'quiz-go-test-007',
    89,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1210,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 14:56:15.545'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-007')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-aslan-1',
    'user-gizem-aslan-68',
    'quiz-go-bug-034',
    93,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1776,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 09:43:26.159'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-aslan-2',
    'user-gizem-aslan-68',
    'quiz-go-test-017',
    96,
    '{"answered":9,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    789,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 00:25:59.171'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-aslan-3',
    'user-gizem-aslan-68',
    'quiz-dotnet-live-038',
    65,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1676,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 23:03:18.342'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-aslan-4',
    'user-gizem-aslan-68',
    'quiz-dotnet-bug-100',
    86,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    832,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 12:19:18.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-100')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-aslan-5',
    'user-gizem-aslan-68',
    'quiz-dotnet-test-080',
    89,
    '{"answered":8,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    980,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 08:10:58.646'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-gizem-aslan-6',
    'user-gizem-aslan-68',
    'quiz-react-adv-live-018',
    88,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1239,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 23:05:56.067'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-018')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-kilic-1',
    'user-busra-kilic-69',
    'quiz-go-test-074',
    81,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    670,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 14:09:07.600'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-kilic-2',
    'user-busra-kilic-69',
    'quiz-dotnet-live-007',
    76,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    957,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 13:22:43.807'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-007')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-busra-kilic-3',
    'user-busra-kilic-69',
    'quiz-dotnet-bug-023',
    75,
    '{"answered":10,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1657,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-31 05:44:48.317'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-023')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-dogan-1',
    'user-sibel-dogan-70',
    'quiz-dotnet-live-074',
    98,
    '{"answered":10,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1709,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-04 12:55:37.539'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-074')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-dogan-2',
    'user-sibel-dogan-70',
    'quiz-dotnet-bug-041',
    68,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1170,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 08:54:38.607'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-041')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sibel-dogan-3',
    'user-sibel-dogan-70',
    'quiz-dotnet-test-072',
    81,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1339,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 09:46:05.023'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ece-arslan-1',
    'user-ece-arslan-71',
    'quiz-dotnet-bug-027',
    84,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    401,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-08 22:44:33.216'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ece-arslan-2',
    'user-ece-arslan-71',
    'quiz-dotnet-test-039',
    87,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    841,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-09 14:56:27.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-ece-arslan-3',
    'user-ece-arslan-71',
    'quiz-react-adv-live-034',
    97,
    '{"answered":12,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    932,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 19:23:09.209'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-pelin-ozturk-1',
    'user-pelin-ozturk-72',
    'quiz-dotnet-test-021',
    83,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    357,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 14:50:27.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-pelin-ozturk-2',
    'user-pelin-ozturk-72',
    'quiz-react-adv-live-019',
    70,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1361,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 20:59:56.293'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-pelin-ozturk-3',
    'user-pelin-ozturk-72',
    'quiz-react-adv-bug-008',
    77,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1242,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 01:21:14.897'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-008')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-pelin-ozturk-4',
    'user-pelin-ozturk-72',
    'quiz-react-adv-test-046',
    98,
    '{"answered":14,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    647,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 00:00:00.505'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-aydin-1',
    'user-hande-aydin-73',
    'quiz-react-adv-live-009',
    83,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    705,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-30 18:07:36.458'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-aydin-2',
    'user-hande-aydin-73',
    'quiz-react-adv-bug-014',
    72,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    852,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 05:10:24.669'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-014')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-hande-aydin-3',
    'user-hande-aydin-73',
    'quiz-react-adv-test-039',
    96,
    '{"answered":13,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    623,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-29 15:13:10.210'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-yildirim-1',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-bug-035',
    78,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1737,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-27 11:29:26.915'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-035')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-yildirim-2',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-test-022',
    86,
    '{"answered":14,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1528,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 15:53:13.278'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-yildirim-3',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-live-021',
    78,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    970,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 21:44:21.113'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-yildirim-4',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-bug-037',
    66,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1356,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 02:22:53.024'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-yildirim-5',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-test-040',
    77,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    864,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 00:46:00.995'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-sevgi-yildirim-6',
    'user-sevgi-yildirim-74',
    'quiz-node-adv-live-014',
    75,
    '{"answered":9,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1684,
    NULL,
    'intermediate',
    TIMESTAMP '2025-10-23 06:28:15.307'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-yildiz-1',
    'user-i-rem-yildiz-75',
    'quiz-react-adv-test-020',
    70,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    648,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 21:57:58.297'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-yildiz-2',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-live-044',
    85,
    '{"answered":13,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    330,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 10:09:22.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-yildiz-3',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-bug-027',
    91,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1738,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 07:01:04.091'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-yildiz-4',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-test-037',
    77,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    519,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 06:46:38.859'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-037')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-i-rem-yildiz-5',
    'user-i-rem-yildiz-75',
    'quiz-node-adv-live-028',
    86,
    '{"answered":10,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    334,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 03:19:04.569'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-028')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-celik-1',
    'user-tugce-celik-76',
    'quiz-flutter-adv-live-036',
    97,
    '{"answered":10,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1665,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-13 22:14:45.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-celik-2',
    'user-tugce-celik-76',
    'quiz-flutter-adv-bug-011',
    87,
    '{"answered":15,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1635,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 21:49:01.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-celik-3',
    'user-tugce-celik-76',
    'quiz-flutter-adv-test-020',
    91,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    726,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 20:30:59.141'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-celik-4',
    'user-tugce-celik-76',
    'quiz-node-adv-live-014',
    69,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1445,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 21:42:54.606'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-tugce-celik-5',
    'user-tugce-celik-76',
    'quiz-node-adv-bug-042',
    83,
    '{"answered":11,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    473,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 13:39:32.182'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-042')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-sahin-1',
    'user-asli-sahin-77',
    'quiz-flutter-adv-bug-019',
    82,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1439,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-07 15:56:06.497'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-sahin-2',
    'user-asli-sahin-77',
    'quiz-flutter-adv-test-017',
    68,
    '{"answered":14,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    381,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-06 04:53:25.981'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-sahin-3',
    'user-asli-sahin-77',
    'quiz-node-adv-live-036',
    74,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1315,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-02 03:01:35.264'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-sahin-4',
    'user-asli-sahin-77',
    'quiz-node-adv-bug-043',
    67,
    '{"answered":8,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1766,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-05 17:40:03.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-sahin-5',
    'user-asli-sahin-77',
    'quiz-node-adv-test-017',
    95,
    '{"answered":10,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1576,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 02:52:14.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-asli-sahin-6',
    'user-asli-sahin-77',
    'quiz-python-adv-live-025',
    70,
    '{"answered":12,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1161,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-01 07:16:49.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-025')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nisan-demir-1',
    'user-nisan-demir-78',
    'quiz-flutter-adv-test-013',
    83,
    '{"answered":8,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1722,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 16:14:11.093'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nisan-demir-2',
    'user-nisan-demir-78',
    'quiz-node-adv-live-019',
    80,
    '{"answered":14,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1263,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 09:06:49.256'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-nisan-demir-3',
    'user-nisan-demir-78',
    'quiz-node-adv-bug-043',
    96,
    '{"answered":8,"correct":10}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1323,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 20:17:39.566'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-kaya-1',
    'user-melis-kaya-79',
    'quiz-node-adv-live-040',
    73,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    828,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 13:36:54.450'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-kaya-2',
    'user-melis-kaya-79',
    'quiz-node-adv-bug-036',
    74,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1572,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 16:34:45.122'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-kaya-3',
    'user-melis-kaya-79',
    'quiz-node-adv-test-002',
    69,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    761,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 11:03:37.588'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-kaya-4',
    'user-melis-kaya-79',
    'quiz-python-adv-live-006',
    69,
    '{"answered":9,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1309,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 11:14:00.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-kaya-5',
    'user-melis-kaya-79',
    'quiz-python-adv-bug-044',
    78,
    '{"answered":15,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1420,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 12:02:57.143'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-044')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-melis-kaya-6',
    'user-melis-kaya-79',
    'quiz-python-adv-test-025',
    74,
    '{"answered":15,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1230,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-15 16:21:48.503'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-025')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-yilmaz-1',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-bug-024',
    75,
    '{"answered":13,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1735,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 20:25:33.393'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-yilmaz-2',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-test-004',
    65,
    '{"answered":10,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    687,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-11 05:40:08.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-yilmaz-3',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-live-003',
    74,
    '{"answered":11,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    623,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-10 14:23:38.905'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-003')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-yilmaz-4',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-bug-001',
    68,
    '{"answered":13,"correct":7}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1262,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-16 09:28:33.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-yilmaz-5',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-test-039',
    84,
    '{"answered":12,"correct":8}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    487,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-12 15:02:45.984'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    'quizattempt-cansu-yilmaz-6',
    'user-cansu-yilmaz-80',
    'quiz-react-live-020',
    93,
    '{"answered":9,"correct":9}'::jsonb,
    '{"strengths":["consistency"],"focus":["refactoring"]}'::jsonb,
    1651,
    NULL,
    'intermediate',
    TIMESTAMP '2025-11-14 08:41:42.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-020')
ON CONFLICT DO NOTHING;

-- Insert test attempts (only if quiz exists)
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-keskin-1',
    'user-mehmet-keskin-1',
    'quiz-react-live-044',
    '{"score":81,"duration":1698,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 04:16:51.953',
    TIMESTAMP '2025-11-16 04:16:51.953',
    TIMESTAMP '2025-11-16 04:16:51.953'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-keskin-2',
    'user-mehmet-keskin-1',
    'quiz-react-bug-081',
    '{"score":95,"duration":1544,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 04:35:28.758',
    TIMESTAMP '2025-11-15 04:35:28.758',
    TIMESTAMP '2025-11-15 04:35:28.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-keskin-3',
    'user-mehmet-keskin-1',
    'quiz-react-test-010',
    '{"score":86,"duration":709,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 04:51:12.982',
    TIMESTAMP '2025-11-14 04:51:12.982',
    TIMESTAMP '2025-11-14 04:51:12.982'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-keskin-4',
    'user-mehmet-keskin-1',
    'quiz-flutter-live-038',
    '{"score":77,"duration":320,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 18:38:59.660',
    TIMESTAMP '2025-11-15 18:38:59.660',
    TIMESTAMP '2025-11-15 18:38:59.660'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-avci-1',
    'user-ahmet-avci-2',
    'quiz-react-bug-004',
    '{"score":75,"duration":500,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 22:04:01.090',
    TIMESTAMP '2025-11-14 22:04:01.090',
    TIMESTAMP '2025-11-14 22:04:01.090'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-avci-2',
    'user-ahmet-avci-2',
    'quiz-react-test-005',
    '{"score":69,"duration":1699,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 20:39:21.931',
    TIMESTAMP '2025-11-15 20:39:21.931',
    TIMESTAMP '2025-11-15 20:39:21.931'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-avci-3',
    'user-ahmet-avci-2',
    'quiz-flutter-live-046',
    '{"score":69,"duration":462,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 05:47:25.580',
    TIMESTAMP '2025-11-16 05:47:25.580',
    TIMESTAMP '2025-11-16 05:47:25.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-avci-4',
    'user-ahmet-avci-2',
    'quiz-flutter-bug-063',
    '{"score":70,"duration":881,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 15:28:27.709',
    TIMESTAMP '2025-11-14 15:28:27.709',
    TIMESTAMP '2025-11-14 15:28:27.709'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-avci-5',
    'user-ahmet-avci-2',
    'quiz-flutter-test-088',
    '{"score":72,"duration":1640,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 18:01:14.350',
    TIMESTAMP '2025-11-14 18:01:14.350',
    TIMESTAMP '2025-11-14 18:01:14.350'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-avci-6',
    'user-ahmet-avci-2',
    'quiz-node-live-046',
    '{"score":85,"duration":494,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 01:59:50.242',
    TIMESTAMP '2025-11-15 01:59:50.242',
    TIMESTAMP '2025-11-15 01:59:50.242'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-bulut-1',
    'user-mustafa-bulut-3',
    'quiz-react-test-098',
    '{"score":68,"duration":1016,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 07:12:02.580',
    TIMESTAMP '2025-11-01 07:12:02.580',
    TIMESTAMP '2025-11-01 07:12:02.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-bulut-2',
    'user-mustafa-bulut-3',
    'quiz-flutter-live-034',
    '{"score":89,"duration":1546,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 22:07:09.142',
    TIMESTAMP '2025-11-11 22:07:09.142',
    TIMESTAMP '2025-11-11 22:07:09.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-bulut-3',
    'user-mustafa-bulut-3',
    'quiz-flutter-bug-052',
    '{"score":74,"duration":1298,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 05:34:21.236',
    TIMESTAMP '2025-11-09 05:34:21.236',
    TIMESTAMP '2025-11-09 05:34:21.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-bulut-4',
    'user-mustafa-bulut-3',
    'quiz-flutter-test-022',
    '{"score":71,"duration":344,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 21:03:17.231',
    TIMESTAMP '2025-11-07 21:03:17.231',
    TIMESTAMP '2025-11-07 21:03:17.231'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-bulut-5',
    'user-mustafa-bulut-3',
    'quiz-node-live-083',
    '{"score":69,"duration":1482,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-29 21:36:40.323',
    TIMESTAMP '2025-10-29 21:36:40.323',
    TIMESTAMP '2025-10-29 21:36:40.323'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-huseyin-erdogan-1',
    'user-huseyin-erdogan-4',
    'quiz-flutter-live-058',
    '{"score":79,"duration":772,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 17:00:09.860',
    TIMESTAMP '2025-11-01 17:00:09.860',
    TIMESTAMP '2025-11-01 17:00:09.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-huseyin-erdogan-2',
    'user-huseyin-erdogan-4',
    'quiz-flutter-bug-052',
    '{"score":83,"duration":796,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-22 14:54:01.002',
    TIMESTAMP '2025-10-22 14:54:01.002',
    TIMESTAMP '2025-10-22 14:54:01.002'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-huseyin-erdogan-3',
    'user-huseyin-erdogan-4',
    'quiz-flutter-test-008',
    '{"score":86,"duration":757,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 08:31:20.604',
    TIMESTAMP '2025-11-10 08:31:20.604',
    TIMESTAMP '2025-11-10 08:31:20.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-008')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-emre-aksoy-1',
    'user-emre-aksoy-5',
    'quiz-flutter-bug-021',
    '{"score":85,"duration":1121,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 17:48:44.236',
    TIMESTAMP '2025-11-15 17:48:44.236',
    TIMESTAMP '2025-11-15 17:48:44.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-emre-aksoy-2',
    'user-emre-aksoy-5',
    'quiz-flutter-test-029',
    '{"score":71,"duration":1509,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 21:39:30.291',
    TIMESTAMP '2025-11-11 21:39:30.291',
    TIMESTAMP '2025-11-11 21:39:30.291'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-emre-aksoy-3',
    'user-emre-aksoy-5',
    'quiz-node-live-040',
    '{"score":68,"duration":1346,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 13:54:27.430',
    TIMESTAMP '2025-11-11 13:54:27.430',
    TIMESTAMP '2025-11-11 13:54:27.430'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-bozkurt-1',
    'user-burak-bozkurt-6',
    'quiz-flutter-test-006',
    '{"score":75,"duration":1705,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 08:19:45.117',
    TIMESTAMP '2025-11-09 08:19:45.117',
    TIMESTAMP '2025-11-09 08:19:45.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-006')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-bozkurt-2',
    'user-burak-bozkurt-6',
    'quiz-node-live-031',
    '{"score":95,"duration":1248,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 07:12:30.946',
    TIMESTAMP '2025-11-05 07:12:30.946',
    TIMESTAMP '2025-11-05 07:12:30.946'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-bozkurt-3',
    'user-burak-bozkurt-6',
    'quiz-node-bug-018',
    '{"score":77,"duration":1410,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 03:11:50.443',
    TIMESTAMP '2025-11-05 03:11:50.443',
    TIMESTAMP '2025-11-05 03:11:50.443'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-bozkurt-4',
    'user-burak-bozkurt-6',
    'quiz-node-test-012',
    '{"score":80,"duration":1436,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 07:01:37.112',
    TIMESTAMP '2025-11-01 07:01:37.112',
    TIMESTAMP '2025-11-01 07:01:37.112'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-012')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-bozkurt-5',
    'user-burak-bozkurt-6',
    'quiz-python-live-006',
    '{"score":97,"duration":1707,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 14:30:39.111',
    TIMESTAMP '2025-11-08 14:30:39.111',
    TIMESTAMP '2025-11-08 14:30:39.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-bozkurt-6',
    'user-burak-bozkurt-6',
    'quiz-python-bug-001',
    '{"score":93,"duration":648,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 01:34:44.026',
    TIMESTAMP '2025-11-03 01:34:44.026',
    TIMESTAMP '2025-11-03 01:34:44.026'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cem-gunes-1',
    'user-cem-gunes-7',
    'quiz-node-live-092',
    '{"score":77,"duration":412,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 20:21:22.949',
    TIMESTAMP '2025-11-14 20:21:22.949',
    TIMESTAMP '2025-11-14 20:21:22.949'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-092')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cem-gunes-2',
    'user-cem-gunes-7',
    'quiz-node-bug-097',
    '{"score":80,"duration":585,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 14:31:15.174',
    TIMESTAMP '2025-11-14 14:31:15.174',
    TIMESTAMP '2025-11-14 14:31:15.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cem-gunes-3',
    'user-cem-gunes-7',
    'quiz-node-test-070',
    '{"score":89,"duration":1115,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 18:11:25.980',
    TIMESTAMP '2025-11-15 18:11:25.980',
    TIMESTAMP '2025-11-15 18:11:25.980'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-070')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cem-gunes-4',
    'user-cem-gunes-7',
    'quiz-python-live-053',
    '{"score":84,"duration":1453,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 22:10:47.522',
    TIMESTAMP '2025-11-13 22:10:47.522',
    TIMESTAMP '2025-11-13 22:10:47.522'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cem-gunes-5',
    'user-cem-gunes-7',
    'quiz-python-bug-011',
    '{"score":79,"duration":772,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 16:33:57.534',
    TIMESTAMP '2025-11-14 16:33:57.534',
    TIMESTAMP '2025-11-14 16:33:57.534'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cem-gunes-6',
    'user-cem-gunes-7',
    'quiz-python-test-066',
    '{"score":81,"duration":859,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 20:41:53.637',
    TIMESTAMP '2025-11-14 20:41:53.637',
    TIMESTAMP '2025-11-14 20:41:53.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-can-tas-1',
    'user-can-tas-8',
    'quiz-node-bug-097',
    '{"score":72,"duration":711,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 08:24:51.107',
    TIMESTAMP '2025-11-16 08:24:51.107',
    TIMESTAMP '2025-11-16 08:24:51.107'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-can-tas-2',
    'user-can-tas-8',
    'quiz-node-test-053',
    '{"score":81,"duration":998,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 12:29:42.625',
    TIMESTAMP '2025-11-16 12:29:42.625',
    TIMESTAMP '2025-11-16 12:29:42.625'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-053')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-can-tas-3',
    'user-can-tas-8',
    'quiz-python-live-001',
    '{"score":82,"duration":1130,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 11:10:08.250',
    TIMESTAMP '2025-11-16 11:10:08.250',
    TIMESTAMP '2025-11-16 11:10:08.250'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ozan-tekin-1',
    'user-ozan-tekin-9',
    'quiz-node-test-089',
    '{"score":77,"duration":813,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 04:03:49.258',
    TIMESTAMP '2025-11-10 04:03:49.258',
    TIMESTAMP '2025-11-10 04:03:49.258'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-089')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ozan-tekin-2',
    'user-ozan-tekin-9',
    'quiz-python-live-035',
    '{"score":65,"duration":1277,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 10:15:19.661',
    TIMESTAMP '2025-11-13 10:15:19.661',
    TIMESTAMP '2025-11-13 10:15:19.661'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ozan-tekin-3',
    'user-ozan-tekin-9',
    'quiz-python-bug-077',
    '{"score":65,"duration":471,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 22:33:48.199',
    TIMESTAMP '2025-11-01 22:33:48.199',
    TIMESTAMP '2025-11-01 22:33:48.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-eren-sari-1',
    'user-eren-sari-10',
    'quiz-python-live-021',
    '{"score":72,"duration":346,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 20:48:29.152',
    TIMESTAMP '2025-10-31 20:48:29.152',
    TIMESTAMP '2025-10-31 20:48:29.152'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-eren-sari-2',
    'user-eren-sari-10',
    'quiz-python-bug-064',
    '{"score":78,"duration":1105,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 05:35:19.274',
    TIMESTAMP '2025-11-07 05:35:19.274',
    TIMESTAMP '2025-11-07 05:35:19.274'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-eren-sari-3',
    'user-eren-sari-10',
    'quiz-python-test-004',
    '{"score":82,"duration":543,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 19:43:11.168',
    TIMESTAMP '2025-11-14 19:43:11.168',
    TIMESTAMP '2025-11-14 19:43:11.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-eren-sari-4',
    'user-eren-sari-10',
    'quiz-angular-live-064',
    '{"score":73,"duration":776,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-29 12:16:18.880',
    TIMESTAMP '2025-10-29 12:16:18.880',
    TIMESTAMP '2025-10-29 12:16:18.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-064')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-eren-sari-5',
    'user-eren-sari-10',
    'quiz-angular-bug-076',
    '{"score":70,"duration":1423,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 15:53:40.671',
    TIMESTAMP '2025-11-02 15:53:40.671',
    TIMESTAMP '2025-11-02 15:53:40.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-deniz-kaplan-1',
    'user-deniz-kaplan-11',
    'quiz-python-bug-070',
    '{"score":83,"duration":811,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 17:39:23.590',
    TIMESTAMP '2025-11-12 17:39:23.590',
    TIMESTAMP '2025-11-12 17:39:23.590'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-070')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-deniz-kaplan-2',
    'user-deniz-kaplan-11',
    'quiz-python-test-059',
    '{"score":84,"duration":994,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 00:04:44.741',
    TIMESTAMP '2025-11-16 00:04:44.741',
    TIMESTAMP '2025-11-16 00:04:44.741'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-deniz-kaplan-3',
    'user-deniz-kaplan-11',
    'quiz-angular-live-039',
    '{"score":96,"duration":980,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 22:31:54.571',
    TIMESTAMP '2025-11-14 22:31:54.571',
    TIMESTAMP '2025-11-14 22:31:54.571'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-deniz-kaplan-4',
    'user-deniz-kaplan-11',
    'quiz-angular-bug-045',
    '{"score":65,"duration":1575,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 15:33:45.724',
    TIMESTAMP '2025-11-12 15:33:45.724',
    TIMESTAMP '2025-11-12 15:33:45.724'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hakan-ozcan-1',
    'user-hakan-ozcan-12',
    'quiz-python-test-031',
    '{"score":75,"duration":858,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 08:40:21.936',
    TIMESTAMP '2025-11-14 08:40:21.936',
    TIMESTAMP '2025-11-14 08:40:21.936'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-031')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hakan-ozcan-2',
    'user-hakan-ozcan-12',
    'quiz-angular-live-035',
    '{"score":72,"duration":1338,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 22:41:03.364',
    TIMESTAMP '2025-11-12 22:41:03.364',
    TIMESTAMP '2025-11-12 22:41:03.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hakan-ozcan-3',
    'user-hakan-ozcan-12',
    'quiz-angular-bug-030',
    '{"score":87,"duration":863,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 03:07:37.683',
    TIMESTAMP '2025-11-13 03:07:37.683',
    TIMESTAMP '2025-11-13 03:07:37.683'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hakan-ozcan-4',
    'user-hakan-ozcan-12',
    'quiz-angular-test-046',
    '{"score":84,"duration":975,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 11:20:10.089',
    TIMESTAMP '2025-11-16 11:20:10.089',
    TIMESTAMP '2025-11-16 11:20:10.089'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hakan-ozcan-5',
    'user-hakan-ozcan-12',
    'quiz-vue-live-078',
    '{"score":86,"duration":1571,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 16:45:37.742',
    TIMESTAMP '2025-11-15 16:45:37.742',
    TIMESTAMP '2025-11-15 16:45:37.742'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-onur-polat-1',
    'user-onur-polat-13',
    'quiz-angular-live-019',
    '{"score":80,"duration":1789,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 18:51:08.945',
    TIMESTAMP '2025-11-05 18:51:08.945',
    TIMESTAMP '2025-11-05 18:51:08.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-onur-polat-2',
    'user-onur-polat-13',
    'quiz-angular-bug-076',
    '{"score":68,"duration":618,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 15:04:09.290',
    TIMESTAMP '2025-11-10 15:04:09.290',
    TIMESTAMP '2025-11-10 15:04:09.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-onur-polat-3',
    'user-onur-polat-13',
    'quiz-angular-test-099',
    '{"score":87,"duration":1776,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 01:59:32.909',
    TIMESTAMP '2025-11-15 01:59:32.909',
    TIMESTAMP '2025-11-15 01:59:32.909'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-099')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tolga-ozdemir-1',
    'user-tolga-ozdemir-14',
    'quiz-angular-bug-073',
    '{"score":96,"duration":319,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 12:02:50.911',
    TIMESTAMP '2025-11-13 12:02:50.911',
    TIMESTAMP '2025-11-13 12:02:50.911'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-073')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tolga-ozdemir-2',
    'user-tolga-ozdemir-14',
    'quiz-angular-test-014',
    '{"score":90,"duration":1519,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 04:44:33.225',
    TIMESTAMP '2025-11-16 04:44:33.225',
    TIMESTAMP '2025-11-16 04:44:33.225'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-014')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tolga-ozdemir-3',
    'user-tolga-ozdemir-14',
    'quiz-vue-live-038',
    '{"score":90,"duration":1058,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 13:53:08.805',
    TIMESTAMP '2025-11-12 13:53:08.805',
    TIMESTAMP '2025-11-12 13:53:08.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tolga-ozdemir-4',
    'user-tolga-ozdemir-14',
    'quiz-vue-bug-029',
    '{"score":79,"duration":1105,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 02:01:02.884',
    TIMESTAMP '2025-11-13 02:01:02.884',
    TIMESTAMP '2025-11-13 02:01:02.884'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-029')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tolga-ozdemir-5',
    'user-tolga-ozdemir-14',
    'quiz-vue-test-071',
    '{"score":88,"duration":1486,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 02:34:56.553',
    TIMESTAMP '2025-11-13 02:34:56.553',
    TIMESTAMP '2025-11-13 02:34:56.553'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tolga-ozdemir-6',
    'user-tolga-ozdemir-14',
    'quiz-rn-live-024',
    '{"score":83,"duration":1326,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 18:35:42.896',
    TIMESTAMP '2025-11-11 18:35:42.896',
    TIMESTAMP '2025-11-11 18:35:42.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasin-kurt-1',
    'user-yasin-kurt-15',
    'quiz-angular-test-059',
    '{"score":93,"duration":832,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 19:51:48.442',
    TIMESTAMP '2025-11-14 19:51:48.442',
    TIMESTAMP '2025-11-14 19:51:48.442'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasin-kurt-2',
    'user-yasin-kurt-15',
    'quiz-vue-live-089',
    '{"score":74,"duration":1679,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 08:37:00.800',
    TIMESTAMP '2025-11-16 08:37:00.800',
    TIMESTAMP '2025-11-16 08:37:00.800'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasin-kurt-3',
    'user-yasin-kurt-15',
    'quiz-vue-bug-043',
    '{"score":83,"duration":1334,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 10:40:32.504',
    TIMESTAMP '2025-11-16 10:40:32.504',
    TIMESTAMP '2025-11-16 10:40:32.504'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasin-kurt-4',
    'user-yasin-kurt-15',
    'quiz-vue-test-046',
    '{"score":86,"duration":433,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 10:19:06.753',
    TIMESTAMP '2025-11-15 10:19:06.753',
    TIMESTAMP '2025-11-15 10:19:06.753'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kerem-koc-1',
    'user-kerem-koc-16',
    'quiz-vue-live-070',
    '{"score":81,"duration":1688,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 12:05:27.384',
    TIMESTAMP '2025-11-12 12:05:27.384',
    TIMESTAMP '2025-11-12 12:05:27.384'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kerem-koc-2',
    'user-kerem-koc-16',
    'quiz-vue-bug-086',
    '{"score":83,"duration":819,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 20:16:08.877',
    TIMESTAMP '2025-11-09 20:16:08.877',
    TIMESTAMP '2025-11-09 20:16:08.877'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-086')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kerem-koc-3',
    'user-kerem-koc-16',
    'quiz-vue-test-005',
    '{"score":74,"duration":546,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-27 10:07:52.309',
    TIMESTAMP '2025-10-27 10:07:52.309',
    TIMESTAMP '2025-10-27 10:07:52.309'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kerem-koc-4',
    'user-kerem-koc-16',
    'quiz-rn-live-077',
    '{"score":86,"duration":1762,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 04:45:08.447',
    TIMESTAMP '2025-11-09 04:45:08.447',
    TIMESTAMP '2025-11-09 04:45:08.447'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-077')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-umut-kara-1',
    'user-umut-kara-17',
    'quiz-vue-bug-004',
    '{"score":92,"duration":1059,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 21:19:50.624',
    TIMESTAMP '2025-10-31 21:19:50.624',
    TIMESTAMP '2025-10-31 21:19:50.624'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-umut-kara-2',
    'user-umut-kara-17',
    'quiz-vue-test-036',
    '{"score":87,"duration":1380,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-20 12:30:40.255',
    TIMESTAMP '2025-10-20 12:30:40.255',
    TIMESTAMP '2025-10-20 12:30:40.255'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-036')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-umut-kara-3',
    'user-umut-kara-17',
    'quiz-rn-live-063',
    '{"score":96,"duration":358,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 00:27:54.618',
    TIMESTAMP '2025-10-31 00:27:54.618',
    TIMESTAMP '2025-10-31 00:27:54.618'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-umut-kara-4',
    'user-umut-kara-17',
    'quiz-rn-bug-079',
    '{"score":98,"duration":566,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-20 07:15:48.701',
    TIMESTAMP '2025-10-20 07:15:48.701',
    TIMESTAMP '2025-10-20 07:15:48.701'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-079')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-umut-kara-5',
    'user-umut-kara-17',
    'quiz-rn-test-082',
    '{"score":96,"duration":495,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 04:51:04.550',
    TIMESTAMP '2025-11-09 04:51:04.550',
    TIMESTAMP '2025-11-09 04:51:04.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-082')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-murat-aslan-1',
    'user-murat-aslan-18',
    'quiz-vue-test-024',
    '{"score":80,"duration":785,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 10:09:28.781',
    TIMESTAMP '2025-11-16 10:09:28.781',
    TIMESTAMP '2025-11-16 10:09:28.781'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-murat-aslan-2',
    'user-murat-aslan-18',
    'quiz-rn-live-060',
    '{"score":89,"duration":396,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 22:28:43.205',
    TIMESTAMP '2025-11-15 22:28:43.205',
    TIMESTAMP '2025-11-15 22:28:43.205'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-murat-aslan-3',
    'user-murat-aslan-18',
    'quiz-rn-bug-066',
    '{"score":87,"duration":393,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 23:15:03.880',
    TIMESTAMP '2025-11-15 23:15:03.880',
    TIMESTAMP '2025-11-15 23:15:03.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-murat-aslan-4',
    'user-murat-aslan-18',
    'quiz-rn-test-033',
    '{"score":69,"duration":983,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 23:10:54.070',
    TIMESTAMP '2025-11-15 23:10:54.070',
    TIMESTAMP '2025-11-15 23:10:54.070'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-murat-aslan-5',
    'user-murat-aslan-18',
    'quiz-java-live-030',
    '{"score":83,"duration":879,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 21:46:54.253',
    TIMESTAMP '2025-11-15 21:46:54.253',
    TIMESTAMP '2025-11-15 21:46:54.253'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-murat-aslan-6',
    'user-murat-aslan-18',
    'quiz-java-bug-060',
    '{"score":78,"duration":1282,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 00:38:32.419',
    TIMESTAMP '2025-11-16 00:38:32.419',
    TIMESTAMP '2025-11-16 00:38:32.419'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gokhan-kilic-1',
    'user-gokhan-kilic-19',
    'quiz-rn-live-073',
    '{"score":66,"duration":1593,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 19:32:18.901',
    TIMESTAMP '2025-11-10 19:32:18.901',
    TIMESTAMP '2025-11-10 19:32:18.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-073')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gokhan-kilic-2',
    'user-gokhan-kilic-19',
    'quiz-rn-bug-055',
    '{"score":96,"duration":1186,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 17:34:17.989',
    TIMESTAMP '2025-11-10 17:34:17.989',
    TIMESTAMP '2025-11-10 17:34:17.989'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gokhan-kilic-3',
    'user-gokhan-kilic-19',
    'quiz-rn-test-035',
    '{"score":65,"duration":1030,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 20:56:31.736',
    TIMESTAMP '2025-11-13 20:56:31.736',
    TIMESTAMP '2025-11-13 20:56:31.736'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gokhan-kilic-4',
    'user-gokhan-kilic-19',
    'quiz-java-live-070',
    '{"score":94,"duration":540,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 07:19:32.896',
    TIMESTAMP '2025-11-11 07:19:32.896',
    TIMESTAMP '2025-11-11 07:19:32.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gokhan-kilic-5',
    'user-gokhan-kilic-19',
    'quiz-java-bug-018',
    '{"score":76,"duration":952,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 06:25:14.629',
    TIMESTAMP '2025-11-16 06:25:14.629',
    TIMESTAMP '2025-11-16 06:25:14.629'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kaan-dogan-1',
    'user-kaan-dogan-20',
    'quiz-rn-bug-007',
    '{"score":96,"duration":465,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 00:22:46.996',
    TIMESTAMP '2025-11-06 00:22:46.996',
    TIMESTAMP '2025-11-06 00:22:46.996'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-007')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kaan-dogan-2',
    'user-kaan-dogan-20',
    'quiz-rn-test-063',
    '{"score":65,"duration":1515,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 05:08:57.498',
    TIMESTAMP '2025-11-12 05:08:57.498',
    TIMESTAMP '2025-11-12 05:08:57.498'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-063')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kaan-dogan-3',
    'user-kaan-dogan-20',
    'quiz-java-live-063',
    '{"score":83,"duration":318,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 12:52:20.673',
    TIMESTAMP '2025-11-15 12:52:20.673',
    TIMESTAMP '2025-11-15 12:52:20.673'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kaan-dogan-4',
    'user-kaan-dogan-20',
    'quiz-java-bug-063',
    '{"score":93,"duration":1773,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 13:40:41.584',
    TIMESTAMP '2025-11-07 13:40:41.584',
    TIMESTAMP '2025-11-07 13:40:41.584'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kaan-dogan-5',
    'user-kaan-dogan-20',
    'quiz-java-test-038',
    '{"score":95,"duration":348,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 12:07:22.875',
    TIMESTAMP '2025-11-13 12:07:22.875',
    TIMESTAMP '2025-11-13 12:07:22.875'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-038')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kaan-dogan-6',
    'user-kaan-dogan-20',
    'quiz-go-live-023',
    '{"score":86,"duration":1653,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 01:51:02.051',
    TIMESTAMP '2025-11-15 01:51:02.051',
    TIMESTAMP '2025-11-15 01:51:02.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-023')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-baran-arslan-1',
    'user-baran-arslan-21',
    'quiz-rn-test-080',
    '{"score":75,"duration":1241,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 04:41:06.029',
    TIMESTAMP '2025-11-06 04:41:06.029',
    TIMESTAMP '2025-11-06 04:41:06.029'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-baran-arslan-2',
    'user-baran-arslan-21',
    'quiz-java-live-016',
    '{"score":78,"duration":1406,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 12:54:17.085',
    TIMESTAMP '2025-11-07 12:54:17.085',
    TIMESTAMP '2025-11-07 12:54:17.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-baran-arslan-3',
    'user-baran-arslan-21',
    'quiz-java-bug-099',
    '{"score":66,"duration":643,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 10:25:33.655',
    TIMESTAMP '2025-11-14 10:25:33.655',
    TIMESTAMP '2025-11-14 10:25:33.655'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-bora-ozturk-1',
    'user-bora-ozturk-22',
    'quiz-java-live-054',
    '{"score":87,"duration":314,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 03:27:57.993',
    TIMESTAMP '2025-11-16 03:27:57.993',
    TIMESTAMP '2025-11-16 03:27:57.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-bora-ozturk-2',
    'user-bora-ozturk-22',
    'quiz-java-bug-050',
    '{"score":94,"duration":472,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 16:32:03.126',
    TIMESTAMP '2025-11-09 16:32:03.126',
    TIMESTAMP '2025-11-09 16:32:03.126'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-bora-ozturk-3',
    'user-bora-ozturk-22',
    'quiz-java-test-072',
    '{"score":89,"duration":581,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 00:01:58.359',
    TIMESTAMP '2025-11-10 00:01:58.359',
    TIMESTAMP '2025-11-10 00:01:58.359'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-bora-ozturk-4',
    'user-bora-ozturk-22',
    'quiz-go-live-001',
    '{"score":94,"duration":691,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 13:38:00.165',
    TIMESTAMP '2025-11-03 13:38:00.165',
    TIMESTAMP '2025-11-03 13:38:00.165'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-halil-aydin-1',
    'user-halil-aydin-23',
    'quiz-java-bug-090',
    '{"score":87,"duration":1537,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-27 15:20:39.604',
    TIMESTAMP '2025-10-27 15:20:39.604',
    TIMESTAMP '2025-10-27 15:20:39.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-090')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-halil-aydin-2',
    'user-halil-aydin-23',
    'quiz-java-test-096',
    '{"score":70,"duration":438,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 06:33:13.737',
    TIMESTAMP '2025-10-31 06:33:13.737',
    TIMESTAMP '2025-10-31 06:33:13.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-096')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-halil-aydin-3',
    'user-halil-aydin-23',
    'quiz-go-live-057',
    '{"score":92,"duration":961,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 00:55:18.682',
    TIMESTAMP '2025-11-06 00:55:18.682',
    TIMESTAMP '2025-11-06 00:55:18.682'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-halil-aydin-4',
    'user-halil-aydin-23',
    'quiz-go-bug-094',
    '{"score":79,"duration":1696,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-22 21:01:39.770',
    TIMESTAMP '2025-10-22 21:01:39.770',
    TIMESTAMP '2025-10-22 21:01:39.770'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-094')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-suat-yildirim-1',
    'user-suat-yildirim-24',
    'quiz-java-test-068',
    '{"score":87,"duration":1695,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 09:08:26.300',
    TIMESTAMP '2025-11-12 09:08:26.300',
    TIMESTAMP '2025-11-12 09:08:26.300'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-068')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-suat-yildirim-2',
    'user-suat-yildirim-24',
    'quiz-go-live-067',
    '{"score":87,"duration":1702,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 15:09:58.227',
    TIMESTAMP '2025-11-16 15:09:58.227',
    TIMESTAMP '2025-11-16 15:09:58.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-suat-yildirim-3',
    'user-suat-yildirim-24',
    'quiz-go-bug-062',
    '{"score":69,"duration":442,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 11:50:30.762',
    TIMESTAMP '2025-11-13 11:50:30.762',
    TIMESTAMP '2025-11-13 11:50:30.762'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-062')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-serkan-yildiz-1',
    'user-serkan-yildiz-25',
    'quiz-go-live-096',
    '{"score":84,"duration":1376,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 13:52:25.364',
    TIMESTAMP '2025-11-08 13:52:25.364',
    TIMESTAMP '2025-11-08 13:52:25.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-096')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-serkan-yildiz-2',
    'user-serkan-yildiz-25',
    'quiz-go-bug-064',
    '{"score":71,"duration":647,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 04:27:45.945',
    TIMESTAMP '2025-11-09 04:27:45.945',
    TIMESTAMP '2025-11-09 04:27:45.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-serkan-yildiz-3',
    'user-serkan-yildiz-25',
    'quiz-go-test-013',
    '{"score":73,"duration":710,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 13:50:17.267',
    TIMESTAMP '2025-11-12 13:50:17.267',
    TIMESTAMP '2025-11-12 13:50:17.267'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-serkan-yildiz-4',
    'user-serkan-yildiz-25',
    'quiz-dotnet-live-088',
    '{"score":79,"duration":1437,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 17:33:55.168',
    TIMESTAMP '2025-11-13 17:33:55.168',
    TIMESTAMP '2025-11-13 17:33:55.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-088')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-berk-celik-1',
    'user-berk-celik-26',
    'quiz-go-bug-001',
    '{"score":80,"duration":1617,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 04:01:39.813',
    TIMESTAMP '2025-11-13 04:01:39.813',
    TIMESTAMP '2025-11-13 04:01:39.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-berk-celik-2',
    'user-berk-celik-26',
    'quiz-go-test-081',
    '{"score":87,"duration":1285,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 05:37:39.408',
    TIMESTAMP '2025-11-03 05:37:39.408',
    TIMESTAMP '2025-11-03 05:37:39.408'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-berk-celik-3',
    'user-berk-celik-26',
    'quiz-dotnet-live-056',
    '{"score":73,"duration":1748,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 17:26:01.536',
    TIMESTAMP '2025-11-06 17:26:01.536',
    TIMESTAMP '2025-11-06 17:26:01.536'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-056')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-berk-celik-4',
    'user-berk-celik-26',
    'quiz-dotnet-bug-066',
    '{"score":75,"duration":1774,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 20:06:09.758',
    TIMESTAMP '2025-11-05 20:06:09.758',
    TIMESTAMP '2025-11-05 20:06:09.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-berk-celik-5',
    'user-berk-celik-26',
    'quiz-dotnet-test-010',
    '{"score":89,"duration":1282,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-20 14:12:36.813',
    TIMESTAMP '2025-10-20 14:12:36.813',
    TIMESTAMP '2025-10-20 14:12:36.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mert-sahin-1',
    'user-mert-sahin-27',
    'quiz-go-test-083',
    '{"score":68,"duration":1306,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 15:49:52.097',
    TIMESTAMP '2025-11-11 15:49:52.097',
    TIMESTAMP '2025-11-11 15:49:52.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-083')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mert-sahin-2',
    'user-mert-sahin-27',
    'quiz-dotnet-live-054',
    '{"score":90,"duration":470,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 00:50:43.369',
    TIMESTAMP '2025-11-11 00:50:43.369',
    TIMESTAMP '2025-11-11 00:50:43.369'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mert-sahin-3',
    'user-mert-sahin-27',
    'quiz-dotnet-bug-045',
    '{"score":84,"duration":1689,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 02:55:12.815',
    TIMESTAMP '2025-11-10 02:55:12.815',
    TIMESTAMP '2025-11-10 02:55:12.815'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mert-sahin-4',
    'user-mert-sahin-27',
    'quiz-dotnet-test-081',
    '{"score":68,"duration":332,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 00:38:34.749',
    TIMESTAMP '2025-11-07 00:38:34.749',
    TIMESTAMP '2025-11-07 00:38:34.749'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mert-sahin-5',
    'user-mert-sahin-27',
    'quiz-react-adv-live-020',
    '{"score":87,"duration":852,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 03:50:34.848',
    TIMESTAMP '2025-11-09 03:50:34.848',
    TIMESTAMP '2025-11-09 03:50:34.848'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mert-sahin-6',
    'user-mert-sahin-27',
    'quiz-react-adv-bug-002',
    '{"score":75,"duration":1362,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 04:52:18.007',
    TIMESTAMP '2025-11-15 04:52:18.007',
    TIMESTAMP '2025-11-15 04:52:18.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kadir-demir-1',
    'user-kadir-demir-28',
    'quiz-dotnet-live-012',
    '{"score":93,"duration":1349,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 05:26:13.727',
    TIMESTAMP '2025-11-04 05:26:13.727',
    TIMESTAMP '2025-11-04 05:26:13.727'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kadir-demir-2',
    'user-kadir-demir-28',
    'quiz-dotnet-bug-024',
    '{"score":74,"duration":477,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 22:33:28.148',
    TIMESTAMP '2025-11-04 22:33:28.148',
    TIMESTAMP '2025-11-04 22:33:28.148'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kadir-demir-3',
    'user-kadir-demir-28',
    'quiz-dotnet-test-088',
    '{"score":79,"duration":1697,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 08:27:45.013',
    TIMESTAMP '2025-11-16 08:27:45.013',
    TIMESTAMP '2025-11-16 08:27:45.013'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kadir-demir-4',
    'user-kadir-demir-28',
    'quiz-react-adv-live-026',
    '{"score":95,"duration":397,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 11:10:49.132',
    TIMESTAMP '2025-11-08 11:10:49.132',
    TIMESTAMP '2025-11-08 11:10:49.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-026')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kadir-demir-5',
    'user-kadir-demir-28',
    'quiz-react-adv-bug-010',
    '{"score":90,"duration":960,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 16:25:02.050',
    TIMESTAMP '2025-11-02 16:25:02.050',
    TIMESTAMP '2025-11-02 16:25:02.050'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-furkan-kaya-1',
    'user-furkan-kaya-29',
    'quiz-dotnet-bug-019',
    '{"score":76,"duration":1626,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 07:59:20.239',
    TIMESTAMP '2025-11-16 07:59:20.239',
    TIMESTAMP '2025-11-16 07:59:20.239'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-furkan-kaya-2',
    'user-furkan-kaya-29',
    'quiz-dotnet-test-071',
    '{"score":86,"duration":424,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 08:34:55.805',
    TIMESTAMP '2025-11-08 08:34:55.805',
    TIMESTAMP '2025-11-08 08:34:55.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-furkan-kaya-3',
    'user-furkan-kaya-29',
    'quiz-react-adv-live-035',
    '{"score":84,"duration":1751,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 18:40:21.929',
    TIMESTAMP '2025-11-09 18:40:21.929',
    TIMESTAMP '2025-11-09 18:40:21.929'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-furkan-kaya-4',
    'user-furkan-kaya-29',
    'quiz-react-adv-bug-020',
    '{"score":65,"duration":1528,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 10:58:22.051',
    TIMESTAMP '2025-11-13 10:58:22.051',
    TIMESTAMP '2025-11-13 10:58:22.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-furkan-kaya-5',
    'user-furkan-kaya-29',
    'quiz-react-adv-test-024',
    '{"score":83,"duration":988,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 16:09:51.331',
    TIMESTAMP '2025-11-11 16:09:51.331',
    TIMESTAMP '2025-11-11 16:09:51.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cagri-yilmaz-1',
    'user-cagri-yilmaz-30',
    'quiz-dotnet-test-056',
    '{"score":96,"duration":504,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 07:35:02.215',
    TIMESTAMP '2025-11-01 07:35:02.215',
    TIMESTAMP '2025-11-01 07:35:02.215'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cagri-yilmaz-2',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-live-040',
    '{"score":77,"duration":666,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 00:14:53.494',
    TIMESTAMP '2025-11-15 00:14:53.494',
    TIMESTAMP '2025-11-15 00:14:53.494'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cagri-yilmaz-3',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-bug-002',
    '{"score":67,"duration":381,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-27 03:41:31.396',
    TIMESTAMP '2025-10-27 03:41:31.396',
    TIMESTAMP '2025-10-27 03:41:31.396'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cagri-yilmaz-4',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-test-028',
    '{"score":83,"duration":830,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 13:13:35.296',
    TIMESTAMP '2025-10-31 13:13:35.296',
    TIMESTAMP '2025-10-31 13:13:35.296'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cagri-yilmaz-5',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-live-024',
    '{"score":74,"duration":702,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-24 18:54:31.717',
    TIMESTAMP '2025-10-24 18:54:31.717',
    TIMESTAMP '2025-10-24 18:54:31.717'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cagri-yilmaz-6',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-bug-037',
    '{"score":85,"duration":971,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 16:35:05.917',
    TIMESTAMP '2025-11-12 16:35:05.917',
    TIMESTAMP '2025-11-12 16:35:05.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-oz-1',
    'user-mehmet-oz-31',
    'quiz-react-adv-live-002',
    '{"score":90,"duration":1529,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 20:35:46.410',
    TIMESTAMP '2025-11-13 20:35:46.410',
    TIMESTAMP '2025-11-13 20:35:46.410'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-oz-2',
    'user-mehmet-oz-31',
    'quiz-react-adv-bug-002',
    '{"score":85,"duration":447,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 19:31:15.247',
    TIMESTAMP '2025-11-14 19:31:15.247',
    TIMESTAMP '2025-11-14 19:31:15.247'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-oz-3',
    'user-mehmet-oz-31',
    'quiz-react-adv-test-041',
    '{"score":88,"duration":746,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 07:14:18.604',
    TIMESTAMP '2025-11-11 07:14:18.604',
    TIMESTAMP '2025-11-11 07:14:18.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-041')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-oz-4',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-live-012',
    '{"score":94,"duration":1460,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 04:01:55.097',
    TIMESTAMP '2025-11-12 04:01:55.097',
    TIMESTAMP '2025-11-12 04:01:55.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-oz-5',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-bug-011',
    '{"score":70,"duration":669,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 15:06:24.405',
    TIMESTAMP '2025-11-09 15:06:24.405',
    TIMESTAMP '2025-11-09 15:06:24.405'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mehmet-oz-6',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-test-023',
    '{"score":80,"duration":1568,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 10:48:02.406',
    TIMESTAMP '2025-11-14 10:48:02.406',
    TIMESTAMP '2025-11-14 10:48:02.406'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-gokmen-1',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-bug-010',
    '{"score":95,"duration":1418,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-27 02:54:11.012',
    TIMESTAMP '2025-10-27 02:54:11.012',
    TIMESTAMP '2025-10-27 02:54:11.012'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-gokmen-2',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-test-022',
    '{"score":95,"duration":496,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 23:58:28.855',
    TIMESTAMP '2025-11-01 23:58:28.855',
    TIMESTAMP '2025-11-01 23:58:28.855'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-gokmen-3',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-live-001',
    '{"score":71,"duration":1455,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 03:46:06.834',
    TIMESTAMP '2025-11-13 03:46:06.834',
    TIMESTAMP '2025-11-13 03:46:06.834'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-gokmen-4',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-bug-015',
    '{"score":71,"duration":426,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 05:15:49.729',
    TIMESTAMP '2025-11-01 05:15:49.729',
    TIMESTAMP '2025-11-01 05:15:49.729'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ahmet-gokmen-5',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-test-002',
    '{"score":85,"duration":1341,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-30 14:04:35.777',
    TIMESTAMP '2025-10-30 14:04:35.777',
    TIMESTAMP '2025-10-30 14:04:35.777'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-kuzu-1',
    'user-mustafa-kuzu-33',
    'quiz-react-adv-test-018',
    '{"score":68,"duration":679,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 18:09:19.331',
    TIMESTAMP '2025-11-13 18:09:19.331',
    TIMESTAMP '2025-11-13 18:09:19.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-kuzu-2',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-live-050',
    '{"score":75,"duration":632,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 00:29:54.251',
    TIMESTAMP '2025-11-15 00:29:54.251',
    TIMESTAMP '2025-11-15 00:29:54.251'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-kuzu-3',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-bug-047',
    '{"score":97,"duration":1117,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 11:58:57.387',
    TIMESTAMP '2025-11-11 11:58:57.387',
    TIMESTAMP '2025-11-11 11:58:57.387'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-047')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-mustafa-kuzu-4',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-test-003',
    '{"score":71,"duration":1056,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 18:33:50.509',
    TIMESTAMP '2025-11-13 18:33:50.509',
    TIMESTAMP '2025-11-13 18:33:50.509'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-huseyin-karaca-1',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-live-016',
    '{"score":81,"duration":1129,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 23:38:46.789',
    TIMESTAMP '2025-11-07 23:38:46.789',
    TIMESTAMP '2025-11-07 23:38:46.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-huseyin-karaca-2',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-bug-013',
    '{"score":67,"duration":718,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 12:04:42.789',
    TIMESTAMP '2025-11-15 12:04:42.789',
    TIMESTAMP '2025-11-15 12:04:42.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-013')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-huseyin-karaca-3',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-test-045',
    '{"score":97,"duration":419,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 14:09:27.628',
    TIMESTAMP '2025-11-09 14:09:27.628',
    TIMESTAMP '2025-11-09 14:09:27.628'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-huseyin-karaca-4',
    'user-huseyin-karaca-34',
    'quiz-node-adv-live-039',
    '{"score":89,"duration":1048,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 11:13:34.907',
    TIMESTAMP '2025-11-11 11:13:34.907',
    TIMESTAMP '2025-11-11 11:13:34.907'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-emre-duman-1',
    'user-emre-duman-35',
    'quiz-flutter-adv-bug-019',
    '{"score":76,"duration":1445,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 00:32:33.775',
    TIMESTAMP '2025-11-02 00:32:33.775',
    TIMESTAMP '2025-11-02 00:32:33.775'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-emre-duman-2',
    'user-emre-duman-35',
    'quiz-flutter-adv-test-034',
    '{"score":93,"duration":360,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 21:43:10.822',
    TIMESTAMP '2025-11-08 21:43:10.822',
    TIMESTAMP '2025-11-08 21:43:10.822'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-emre-duman-3',
    'user-emre-duman-35',
    'quiz-node-adv-live-031',
    '{"score":72,"duration":615,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 05:53:04.969',
    TIMESTAMP '2025-10-31 05:53:04.969',
    TIMESTAMP '2025-10-31 05:53:04.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-oztuna-1',
    'user-burak-oztuna-36',
    'quiz-flutter-adv-test-047',
    '{"score":77,"duration":527,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 03:53:07.829',
    TIMESTAMP '2025-11-12 03:53:07.829',
    TIMESTAMP '2025-11-12 03:53:07.829'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-oztuna-2',
    'user-burak-oztuna-36',
    'quiz-node-adv-live-045',
    '{"score":90,"duration":705,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 02:29:17.441',
    TIMESTAMP '2025-11-13 02:29:17.441',
    TIMESTAMP '2025-11-13 02:29:17.441'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-045')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-burak-oztuna-3',
    'user-burak-oztuna-36',
    'quiz-node-adv-bug-037',
    '{"score":96,"duration":838,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 13:37:07.616',
    TIMESTAMP '2025-10-31 13:37:07.616',
    TIMESTAMP '2025-10-31 13:37:07.616'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-derya-toprak-1',
    'user-derya-toprak-37',
    'quiz-node-adv-live-021',
    '{"score":65,"duration":479,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 15:46:00.768',
    TIMESTAMP '2025-11-15 15:46:00.768',
    TIMESTAMP '2025-11-15 15:46:00.768'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-derya-toprak-2',
    'user-derya-toprak-37',
    'quiz-node-adv-bug-021',
    '{"score":84,"duration":1296,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 15:17:45.890',
    TIMESTAMP '2025-11-16 15:17:45.890',
    TIMESTAMP '2025-11-16 15:17:45.890'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-derya-toprak-3',
    'user-derya-toprak-37',
    'quiz-node-adv-test-011',
    '{"score":65,"duration":1216,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 02:57:12.173',
    TIMESTAMP '2025-11-16 02:57:12.173',
    TIMESTAMP '2025-11-16 02:57:12.173'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-bayrak-1',
    'user-gizem-bayrak-38',
    'quiz-node-adv-bug-036',
    '{"score":87,"duration":1710,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-24 02:19:21.969',
    TIMESTAMP '2025-10-24 02:19:21.969',
    TIMESTAMP '2025-10-24 02:19:21.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-bayrak-2',
    'user-gizem-bayrak-38',
    'quiz-node-adv-test-034',
    '{"score":91,"duration":372,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-23 19:55:25.007',
    TIMESTAMP '2025-10-23 19:55:25.007',
    TIMESTAMP '2025-10-23 19:55:25.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-bayrak-3',
    'user-gizem-bayrak-38',
    'quiz-python-adv-live-009',
    '{"score":79,"duration":1639,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-24 12:06:51.810',
    TIMESTAMP '2025-10-24 12:06:51.810',
    TIMESTAMP '2025-10-24 12:06:51.810'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-bayrak-4',
    'user-gizem-bayrak-38',
    'quiz-python-adv-bug-046',
    '{"score":71,"duration":371,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 14:10:38.376',
    TIMESTAMP '2025-11-08 14:10:38.376',
    TIMESTAMP '2025-11-08 14:10:38.376'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-046')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-bayrak-5',
    'user-gizem-bayrak-38',
    'quiz-python-adv-test-001',
    '{"score":98,"duration":698,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-27 10:38:45.451',
    TIMESTAMP '2025-10-27 10:38:45.451',
    TIMESTAMP '2025-10-27 10:38:45.451'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-erdogdu-1',
    'user-busra-erdogdu-39',
    'quiz-node-adv-test-018',
    '{"score":73,"duration":1541,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 23:28:21.361',
    TIMESTAMP '2025-11-15 23:28:21.361',
    TIMESTAMP '2025-11-15 23:28:21.361'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-erdogdu-2',
    'user-busra-erdogdu-39',
    'quiz-python-adv-live-016',
    '{"score":95,"duration":606,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 18:24:34.533',
    TIMESTAMP '2025-11-15 18:24:34.533',
    TIMESTAMP '2025-11-15 18:24:34.533'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-erdogdu-3',
    'user-busra-erdogdu-39',
    'quiz-python-adv-bug-018',
    '{"score":83,"duration":514,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 12:51:35.530',
    TIMESTAMP '2025-11-16 12:51:35.530',
    TIMESTAMP '2025-11-16 12:51:35.530'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-erdogdu-4',
    'user-busra-erdogdu-39',
    'quiz-python-adv-test-045',
    '{"score":92,"duration":1782,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 08:15:05.271',
    TIMESTAMP '2025-11-16 08:15:05.271',
    TIMESTAMP '2025-11-16 08:15:05.271'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-erdogdu-5',
    'user-busra-erdogdu-39',
    'quiz-react-live-057',
    '{"score":97,"duration":468,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 00:03:50.671',
    TIMESTAMP '2025-11-15 00:03:50.671',
    TIMESTAMP '2025-11-15 00:03:50.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-ozkan-1',
    'user-sibel-ozkan-40',
    'quiz-python-adv-live-015',
    '{"score":91,"duration":445,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 05:48:14.731',
    TIMESTAMP '2025-11-13 05:48:14.731',
    TIMESTAMP '2025-11-13 05:48:14.731'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-015')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-ozkan-2',
    'user-sibel-ozkan-40',
    'quiz-python-adv-bug-032',
    '{"score":77,"duration":437,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-24 06:36:50.060',
    TIMESTAMP '2025-10-24 06:36:50.060',
    TIMESTAMP '2025-10-24 06:36:50.060'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-032')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-ozkan-3',
    'user-sibel-ozkan-40',
    'quiz-python-adv-test-042',
    '{"score":75,"duration":1682,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 10:45:04.045',
    TIMESTAMP '2025-11-10 10:45:04.045',
    TIMESTAMP '2025-11-10 10:45:04.045'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-042')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-ozkan-4',
    'user-sibel-ozkan-40',
    'quiz-react-live-038',
    '{"score":88,"duration":478,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 01:52:48.102',
    TIMESTAMP '2025-11-08 01:52:48.102',
    TIMESTAMP '2025-11-08 01:52:48.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-ozkan-5',
    'user-sibel-ozkan-40',
    'quiz-react-bug-054',
    '{"score":97,"duration":1449,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 06:51:20.314',
    TIMESTAMP '2025-11-09 06:51:20.314',
    TIMESTAMP '2025-11-09 06:51:20.314'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-054')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ece-ucar-1',
    'user-ece-ucar-41',
    'quiz-python-adv-bug-015',
    '{"score":91,"duration":577,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 11:41:26.319',
    TIMESTAMP '2025-11-09 11:41:26.319',
    TIMESTAMP '2025-11-09 11:41:26.319'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ece-ucar-2',
    'user-ece-ucar-41',
    'quiz-python-adv-test-047',
    '{"score":75,"duration":761,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 22:10:13.597',
    TIMESTAMP '2025-11-11 22:10:13.597',
    TIMESTAMP '2025-11-11 22:10:13.597'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ece-ucar-3',
    'user-ece-ucar-41',
    'quiz-react-live-047',
    '{"score":88,"duration":1074,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 05:26:17.127',
    TIMESTAMP '2025-11-14 05:26:17.127',
    TIMESTAMP '2025-11-14 05:26:17.127'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-pelin-bal-1',
    'user-pelin-bal-42',
    'quiz-python-adv-test-034',
    '{"score":84,"duration":1159,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 19:22:05.487',
    TIMESTAMP '2025-11-14 19:22:05.487',
    TIMESTAMP '2025-11-14 19:22:05.487'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-pelin-bal-2',
    'user-pelin-bal-42',
    'quiz-react-live-060',
    '{"score":76,"duration":733,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 20:32:07.630',
    TIMESTAMP '2025-11-14 20:32:07.630',
    TIMESTAMP '2025-11-14 20:32:07.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-pelin-bal-3',
    'user-pelin-bal-42',
    'quiz-react-bug-055',
    '{"score":92,"duration":804,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 16:05:17.463',
    TIMESTAMP '2025-11-09 16:05:17.463',
    TIMESTAMP '2025-11-09 16:05:17.463'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-karaaslan-1',
    'user-hande-karaaslan-43',
    'quiz-react-live-062',
    '{"score":77,"duration":944,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 22:24:31.942',
    TIMESTAMP '2025-11-05 22:24:31.942',
    TIMESTAMP '2025-11-05 22:24:31.942'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-062')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-karaaslan-2',
    'user-hande-karaaslan-43',
    'quiz-react-bug-009',
    '{"score":84,"duration":1501,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 20:20:56.423',
    TIMESTAMP '2025-11-04 20:20:56.423',
    TIMESTAMP '2025-11-04 20:20:56.423'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-009')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-karaaslan-3',
    'user-hande-karaaslan-43',
    'quiz-react-test-061',
    '{"score":77,"duration":1329,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 23:59:17.956',
    TIMESTAMP '2025-11-07 23:59:17.956',
    TIMESTAMP '2025-11-07 23:59:17.956'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-061')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-karaaslan-4',
    'user-hande-karaaslan-43',
    'quiz-flutter-live-005',
    '{"score":72,"duration":1175,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 07:23:36.347',
    TIMESTAMP '2025-11-11 07:23:36.347',
    TIMESTAMP '2025-11-11 07:23:36.347'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-005')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-karaaslan-5',
    'user-hande-karaaslan-43',
    'quiz-flutter-bug-021',
    '{"score":69,"duration":926,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 23:18:47.234',
    TIMESTAMP '2025-11-11 23:18:47.234',
    TIMESTAMP '2025-11-11 23:18:47.234'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-karaaslan-6',
    'user-hande-karaaslan-43',
    'quiz-flutter-test-081',
    '{"score":97,"duration":311,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 10:02:03.934',
    TIMESTAMP '2025-11-04 10:02:03.934',
    TIMESTAMP '2025-11-04 10:02:03.934'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-dinc-1',
    'user-sevgi-dinc-44',
    'quiz-react-bug-039',
    '{"score":76,"duration":1170,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 13:43:23.596',
    TIMESTAMP '2025-10-31 13:43:23.596',
    TIMESTAMP '2025-10-31 13:43:23.596'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-039')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-dinc-2',
    'user-sevgi-dinc-44',
    'quiz-react-test-016',
    '{"score":71,"duration":1155,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 13:07:24.641',
    TIMESTAMP '2025-11-01 13:07:24.641',
    TIMESTAMP '2025-11-01 13:07:24.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-016')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-dinc-3',
    'user-sevgi-dinc-44',
    'quiz-flutter-live-069',
    '{"score":74,"duration":1642,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-28 16:49:21.331',
    TIMESTAMP '2025-10-28 16:49:21.331',
    TIMESTAMP '2025-10-28 16:49:21.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-069')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-dinc-4',
    'user-sevgi-dinc-44',
    'quiz-flutter-bug-093',
    '{"score":86,"duration":629,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 12:26:24.385',
    TIMESTAMP '2025-11-12 12:26:24.385',
    TIMESTAMP '2025-11-12 12:26:24.385'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-dinc-5',
    'user-sevgi-dinc-44',
    'quiz-flutter-test-066',
    '{"score":84,"duration":812,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 21:23:41.390',
    TIMESTAMP '2025-11-03 21:23:41.390',
    TIMESTAMP '2025-11-03 21:23:41.390'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-sezer-1',
    'user-i-rem-sezer-45',
    'quiz-react-test-060',
    '{"score":77,"duration":567,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 07:11:40.663',
    TIMESTAMP '2025-11-13 07:11:40.663',
    TIMESTAMP '2025-11-13 07:11:40.663'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-060')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-sezer-2',
    'user-i-rem-sezer-45',
    'quiz-flutter-live-020',
    '{"score":94,"duration":1446,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 08:17:04.097',
    TIMESTAMP '2025-11-03 08:17:04.097',
    TIMESTAMP '2025-11-03 08:17:04.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-sezer-3',
    'user-i-rem-sezer-45',
    'quiz-flutter-bug-084',
    '{"score":78,"duration":645,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 21:02:54.559',
    TIMESTAMP '2025-11-09 21:02:54.559',
    TIMESTAMP '2025-11-09 21:02:54.559'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-sezer-4',
    'user-i-rem-sezer-45',
    'quiz-flutter-test-072',
    '{"score":89,"duration":830,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 09:14:31.554',
    TIMESTAMP '2025-11-07 09:14:31.554',
    TIMESTAMP '2025-11-07 09:14:31.554'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-sezer-5',
    'user-i-rem-sezer-45',
    'quiz-node-live-089',
    '{"score":73,"duration":742,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 04:30:46.490',
    TIMESTAMP '2025-11-06 04:30:46.490',
    TIMESTAMP '2025-11-06 04:30:46.490'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-eren-1',
    'user-tugce-eren-46',
    'quiz-flutter-live-051',
    '{"score":70,"duration":918,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 17:48:17.836',
    TIMESTAMP '2025-11-02 17:48:17.836',
    TIMESTAMP '2025-11-02 17:48:17.836'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-eren-2',
    'user-tugce-eren-46',
    'quiz-flutter-bug-099',
    '{"score":69,"duration":584,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 23:20:33.924',
    TIMESTAMP '2025-11-15 23:20:33.924',
    TIMESTAMP '2025-11-15 23:20:33.924'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-eren-3',
    'user-tugce-eren-46',
    'quiz-flutter-test-088',
    '{"score":67,"duration":1314,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 21:01:17.302',
    TIMESTAMP '2025-11-05 21:01:17.302',
    TIMESTAMP '2025-11-05 21:01:17.302'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-eren-4',
    'user-tugce-eren-46',
    'quiz-node-live-019',
    '{"score":74,"duration":1242,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 10:21:59.895',
    TIMESTAMP '2025-11-08 10:21:59.895',
    TIMESTAMP '2025-11-08 10:21:59.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-eren-5',
    'user-tugce-eren-46',
    'quiz-node-bug-081',
    '{"score":93,"duration":1070,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 02:33:40.966',
    TIMESTAMP '2025-11-07 02:33:40.966',
    TIMESTAMP '2025-11-07 02:33:40.966'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-eren-6',
    'user-tugce-eren-46',
    'quiz-node-test-069',
    '{"score":88,"duration":1337,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 06:46:28.819',
    TIMESTAMP '2025-11-13 06:46:28.819',
    TIMESTAMP '2025-11-13 06:46:28.819'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-cetin-1',
    'user-asli-cetin-47',
    'quiz-flutter-bug-056',
    '{"score":74,"duration":923,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 13:36:56.845',
    TIMESTAMP '2025-11-10 13:36:56.845',
    TIMESTAMP '2025-11-10 13:36:56.845'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-056')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-cetin-2',
    'user-asli-cetin-47',
    'quiz-flutter-test-088',
    '{"score":78,"duration":1350,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 03:44:00.322',
    TIMESTAMP '2025-11-09 03:44:00.322',
    TIMESTAMP '2025-11-09 03:44:00.322'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-cetin-3',
    'user-asli-cetin-47',
    'quiz-node-live-021',
    '{"score":85,"duration":953,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 15:21:39.786',
    TIMESTAMP '2025-11-09 15:21:39.786',
    TIMESTAMP '2025-11-09 15:21:39.786'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nisan-ceylan-1',
    'user-nisan-ceylan-48',
    'quiz-flutter-test-033',
    '{"score":73,"duration":726,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 10:13:27.542',
    TIMESTAMP '2025-11-09 10:13:27.542',
    TIMESTAMP '2025-11-09 10:13:27.542'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nisan-ceylan-2',
    'user-nisan-ceylan-48',
    'quiz-node-live-094',
    '{"score":70,"duration":510,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 19:03:11.567',
    TIMESTAMP '2025-11-06 19:03:11.567',
    TIMESTAMP '2025-11-06 19:03:11.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-094')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nisan-ceylan-3',
    'user-nisan-ceylan-48',
    'quiz-node-bug-020',
    '{"score":83,"duration":1742,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 21:51:15.086',
    TIMESTAMP '2025-11-09 21:51:15.086',
    TIMESTAMP '2025-11-09 21:51:15.086'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nisan-ceylan-4',
    'user-nisan-ceylan-48',
    'quiz-node-test-029',
    '{"score":95,"duration":853,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 15:51:46.375',
    TIMESTAMP '2025-11-08 15:51:46.375',
    TIMESTAMP '2025-11-08 15:51:46.375'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-yalcin-1',
    'user-melis-yalcin-49',
    'quiz-node-live-050',
    '{"score":86,"duration":1632,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 08:31:40.455',
    TIMESTAMP '2025-11-05 08:31:40.455',
    TIMESTAMP '2025-11-05 08:31:40.455'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-yalcin-2',
    'user-melis-yalcin-49',
    'quiz-node-bug-060',
    '{"score":84,"duration":1052,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 03:38:41.211',
    TIMESTAMP '2025-11-08 03:38:41.211',
    TIMESTAMP '2025-11-08 03:38:41.211'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-yalcin-3',
    'user-melis-yalcin-49',
    'quiz-node-test-035',
    '{"score":77,"duration":1764,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 05:35:59.061',
    TIMESTAMP '2025-11-14 05:35:59.061',
    TIMESTAMP '2025-11-14 05:35:59.061'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-yalcin-4',
    'user-melis-yalcin-49',
    'quiz-python-live-004',
    '{"score":75,"duration":813,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 05:15:13.428',
    TIMESTAMP '2025-11-15 05:15:13.428',
    TIMESTAMP '2025-11-15 05:15:13.428'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-004')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-isik-1',
    'user-cansu-isik-50',
    'quiz-node-bug-059',
    '{"score":93,"duration":618,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 14:56:03.737',
    TIMESTAMP '2025-11-16 14:56:03.737',
    TIMESTAMP '2025-11-16 14:56:03.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-059')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-isik-2',
    'user-cansu-isik-50',
    'quiz-node-test-040',
    '{"score":83,"duration":1326,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 11:37:48.279',
    TIMESTAMP '2025-11-16 11:37:48.279',
    TIMESTAMP '2025-11-16 11:37:48.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-isik-3',
    'user-cansu-isik-50',
    'quiz-python-live-051',
    '{"score":78,"duration":1041,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 16:09:41.901',
    TIMESTAMP '2025-11-16 16:09:41.901',
    TIMESTAMP '2025-11-16 16:09:41.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-naz-keskin-1',
    'user-naz-keskin-51',
    'quiz-node-test-079',
    '{"score":86,"duration":1285,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 21:54:17.214',
    TIMESTAMP '2025-11-15 21:54:17.214',
    TIMESTAMP '2025-11-15 21:54:17.214'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-naz-keskin-2',
    'user-naz-keskin-51',
    'quiz-python-live-083',
    '{"score":70,"duration":341,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 04:01:56.290',
    TIMESTAMP '2025-11-16 04:01:56.290',
    TIMESTAMP '2025-11-16 04:01:56.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-naz-keskin-3',
    'user-naz-keskin-51',
    'quiz-python-bug-021',
    '{"score":69,"duration":1459,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 19:03:43.962',
    TIMESTAMP '2025-11-15 19:03:43.962',
    TIMESTAMP '2025-11-15 19:03:43.962'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-naz-keskin-4',
    'user-naz-keskin-51',
    'quiz-python-test-075',
    '{"score":83,"duration":638,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 13:40:24.351',
    TIMESTAMP '2025-11-15 13:40:24.351',
    TIMESTAMP '2025-11-15 13:40:24.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-075')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-naz-keskin-5',
    'user-naz-keskin-51',
    'quiz-angular-live-058',
    '{"score":68,"duration":472,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 05:44:07.944',
    TIMESTAMP '2025-11-16 05:44:07.944',
    TIMESTAMP '2025-11-16 05:44:07.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasemin-avci-1',
    'user-yasemin-avci-52',
    'quiz-python-live-078',
    '{"score":70,"duration":720,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 02:34:21.320',
    TIMESTAMP '2025-11-14 02:34:21.320',
    TIMESTAMP '2025-11-14 02:34:21.320'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasemin-avci-2',
    'user-yasemin-avci-52',
    'quiz-python-bug-034',
    '{"score":73,"duration":1160,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 08:33:13.593',
    TIMESTAMP '2025-11-16 08:33:13.593',
    TIMESTAMP '2025-11-16 08:33:13.593'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasemin-avci-3',
    'user-yasemin-avci-52',
    'quiz-python-test-009',
    '{"score":82,"duration":1329,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 20:50:19.839',
    TIMESTAMP '2025-11-08 20:50:19.839',
    TIMESTAMP '2025-11-08 20:50:19.839'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasemin-avci-4',
    'user-yasemin-avci-52',
    'quiz-angular-live-027',
    '{"score":68,"duration":699,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 18:41:21.273',
    TIMESTAMP '2025-11-15 18:41:21.273',
    TIMESTAMP '2025-11-15 18:41:21.273'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-027')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasemin-avci-5',
    'user-yasemin-avci-52',
    'quiz-angular-bug-050',
    '{"score":77,"duration":765,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 04:51:48.614',
    TIMESTAMP '2025-11-14 04:51:48.614',
    TIMESTAMP '2025-11-14 04:51:48.614'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-yasemin-avci-6',
    'user-yasemin-avci-52',
    'quiz-angular-test-003',
    '{"score":66,"duration":1431,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 01:49:05.895',
    TIMESTAMP '2025-11-02 01:49:05.895',
    TIMESTAMP '2025-11-02 01:49:05.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kubra-bulut-1',
    'user-kubra-bulut-53',
    'quiz-python-bug-077',
    '{"score":87,"duration":1453,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 06:26:08.351',
    TIMESTAMP '2025-11-15 06:26:08.351',
    TIMESTAMP '2025-11-15 06:26:08.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kubra-bulut-2',
    'user-kubra-bulut-53',
    'quiz-python-test-079',
    '{"score":69,"duration":1166,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 13:00:10.403',
    TIMESTAMP '2025-11-12 13:00:10.403',
    TIMESTAMP '2025-11-12 13:00:10.403'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kubra-bulut-3',
    'user-kubra-bulut-53',
    'quiz-angular-live-057',
    '{"score":98,"duration":1493,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 03:11:37.630',
    TIMESTAMP '2025-11-13 03:11:37.630',
    TIMESTAMP '2025-11-13 03:11:37.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-kubra-bulut-4',
    'user-kubra-bulut-53',
    'quiz-angular-bug-031',
    '{"score":82,"duration":1181,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 04:26:27.840',
    TIMESTAMP '2025-11-15 04:26:27.840',
    TIMESTAMP '2025-11-15 04:26:27.840'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-031')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nil-erdogan-1',
    'user-nil-erdogan-54',
    'quiz-python-test-069',
    '{"score":73,"duration":766,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 18:03:29.227',
    TIMESTAMP '2025-11-09 18:03:29.227',
    TIMESTAMP '2025-11-09 18:03:29.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nil-erdogan-2',
    'user-nil-erdogan-54',
    'quiz-angular-live-058',
    '{"score":76,"duration":1407,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-29 14:47:38.977',
    TIMESTAMP '2025-10-29 14:47:38.977',
    TIMESTAMP '2025-10-29 14:47:38.977'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nil-erdogan-3',
    'user-nil-erdogan-54',
    'quiz-angular-bug-083',
    '{"score":78,"duration":344,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 02:35:06.085',
    TIMESTAMP '2025-11-06 02:35:06.085',
    TIMESTAMP '2025-11-06 02:35:06.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-083')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gul-aksoy-1',
    'user-gul-aksoy-55',
    'quiz-angular-live-047',
    '{"score":77,"duration":910,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 23:22:50.967',
    TIMESTAMP '2025-11-15 23:22:50.967',
    TIMESTAMP '2025-11-15 23:22:50.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gul-aksoy-2',
    'user-gul-aksoy-55',
    'quiz-angular-bug-030',
    '{"score":66,"duration":913,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 00:47:22.959',
    TIMESTAMP '2025-11-16 00:47:22.959',
    TIMESTAMP '2025-11-16 00:47:22.959'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gul-aksoy-3',
    'user-gul-aksoy-55',
    'quiz-angular-test-085',
    '{"score":66,"duration":1675,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 20:06:01.506',
    TIMESTAMP '2025-11-15 20:06:01.506',
    TIMESTAMP '2025-11-15 20:06:01.506'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-085')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sena-bozkurt-1',
    'user-sena-bozkurt-56',
    'quiz-angular-bug-093',
    '{"score":89,"duration":1176,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 03:05:40.851',
    TIMESTAMP '2025-11-04 03:05:40.851',
    TIMESTAMP '2025-11-04 03:05:40.851'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sena-bozkurt-2',
    'user-sena-bozkurt-56',
    'quiz-angular-test-023',
    '{"score":90,"duration":1308,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 05:48:41.745',
    TIMESTAMP '2025-11-05 05:48:41.745',
    TIMESTAMP '2025-11-05 05:48:41.745'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sena-bozkurt-3',
    'user-sena-bozkurt-56',
    'quiz-vue-live-041',
    '{"score":87,"duration":397,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 11:28:42.401',
    TIMESTAMP '2025-11-12 11:28:42.401',
    TIMESTAMP '2025-11-12 11:28:42.401'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-041')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sena-bozkurt-4',
    'user-sena-bozkurt-56',
    'quiz-vue-bug-006',
    '{"score":71,"duration":1134,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 14:19:40.575',
    TIMESTAMP '2025-11-14 14:19:40.575',
    TIMESTAMP '2025-11-14 14:19:40.575'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-006')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-esra-gunes-1',
    'user-esra-gunes-57',
    'quiz-angular-test-074',
    '{"score":86,"duration":990,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 04:35:39.917',
    TIMESTAMP '2025-11-10 04:35:39.917',
    TIMESTAMP '2025-11-10 04:35:39.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-esra-gunes-2',
    'user-esra-gunes-57',
    'quiz-vue-live-053',
    '{"score":72,"duration":451,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 19:44:20.868',
    TIMESTAMP '2025-11-03 19:44:20.868',
    TIMESTAMP '2025-11-03 19:44:20.868'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-esra-gunes-3',
    'user-esra-gunes-57',
    'quiz-vue-bug-071',
    '{"score":67,"duration":839,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 22:18:42.944',
    TIMESTAMP '2025-11-03 22:18:42.944',
    TIMESTAMP '2025-11-03 22:18:42.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-071')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-esra-gunes-4',
    'user-esra-gunes-57',
    'quiz-vue-test-071',
    '{"score":70,"duration":1714,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 10:50:35.136',
    TIMESTAMP '2025-11-08 10:50:35.136',
    TIMESTAMP '2025-11-08 10:50:35.136'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hale-tas-1',
    'user-hale-tas-58',
    'quiz-vue-live-099',
    '{"score":73,"duration":1645,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 08:12:04.526',
    TIMESTAMP '2025-11-06 08:12:04.526',
    TIMESTAMP '2025-11-06 08:12:04.526'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-099')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hale-tas-2',
    'user-hale-tas-58',
    'quiz-vue-bug-084',
    '{"score":69,"duration":389,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 04:56:22.837',
    TIMESTAMP '2025-10-31 04:56:22.837',
    TIMESTAMP '2025-10-31 04:56:22.837'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hale-tas-3',
    'user-hale-tas-58',
    'quiz-vue-test-057',
    '{"score":72,"duration":1050,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-27 10:58:17.016',
    TIMESTAMP '2025-10-27 10:58:17.016',
    TIMESTAMP '2025-10-27 10:58:17.016'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-057')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hale-tas-4',
    'user-hale-tas-58',
    'quiz-rn-live-075',
    '{"score":72,"duration":691,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 13:01:38.612',
    TIMESTAMP '2025-11-12 13:01:38.612',
    TIMESTAMP '2025-11-12 13:01:38.612'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-075')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hale-tas-5',
    'user-hale-tas-58',
    'quiz-rn-bug-015',
    '{"score":85,"duration":1570,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 12:53:37.333',
    TIMESTAMP '2025-11-09 12:53:37.333',
    TIMESTAMP '2025-11-09 12:53:37.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hale-tas-6',
    'user-hale-tas-58',
    'quiz-rn-test-009',
    '{"score":79,"duration":807,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 11:55:31.744',
    TIMESTAMP '2025-11-12 11:55:31.744',
    TIMESTAMP '2025-11-12 11:55:31.744'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-selin-tekin-1',
    'user-selin-tekin-59',
    'quiz-vue-bug-092',
    '{"score":95,"duration":1750,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 05:06:47.400',
    TIMESTAMP '2025-11-13 05:06:47.400',
    TIMESTAMP '2025-11-13 05:06:47.400'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-092')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-selin-tekin-2',
    'user-selin-tekin-59',
    'quiz-vue-test-011',
    '{"score":96,"duration":1259,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 06:52:18.334',
    TIMESTAMP '2025-11-14 06:52:18.334',
    TIMESTAMP '2025-11-14 06:52:18.334'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-selin-tekin-3',
    'user-selin-tekin-59',
    'quiz-rn-live-052',
    '{"score":84,"duration":1783,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 15:32:28.904',
    TIMESTAMP '2025-11-13 15:32:28.904',
    TIMESTAMP '2025-11-13 15:32:28.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-052')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gonca-sari-1',
    'user-gonca-sari-60',
    'quiz-vue-test-027',
    '{"score":70,"duration":1357,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 03:49:34.286',
    TIMESTAMP '2025-11-02 03:49:34.286',
    TIMESTAMP '2025-11-02 03:49:34.286'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-027')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gonca-sari-2',
    'user-gonca-sari-60',
    'quiz-rn-live-083',
    '{"score":94,"duration":1304,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-03 06:05:42.641',
    TIMESTAMP '2025-11-03 06:05:42.641',
    TIMESTAMP '2025-11-03 06:05:42.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gonca-sari-3',
    'user-gonca-sari-60',
    'quiz-rn-bug-051',
    '{"score":82,"duration":984,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 17:13:37.766',
    TIMESTAMP '2025-11-13 17:13:37.766',
    TIMESTAMP '2025-11-13 17:13:37.766'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-051')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ayse-kaplan-1',
    'user-ayse-kaplan-61',
    'quiz-rn-live-002',
    '{"score":75,"duration":1600,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 15:54:39.778',
    TIMESTAMP '2025-11-11 15:54:39.778',
    TIMESTAMP '2025-11-11 15:54:39.778'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ayse-kaplan-2',
    'user-ayse-kaplan-61',
    'quiz-rn-bug-097',
    '{"score":97,"duration":1299,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 03:25:46.142',
    TIMESTAMP '2025-11-10 03:25:46.142',
    TIMESTAMP '2025-11-10 03:25:46.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ayse-kaplan-3',
    'user-ayse-kaplan-61',
    'quiz-rn-test-001',
    '{"score":81,"duration":648,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-29 00:34:51.556',
    TIMESTAMP '2025-10-29 00:34:51.556',
    TIMESTAMP '2025-10-29 00:34:51.556'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ayse-kaplan-4',
    'user-ayse-kaplan-61',
    'quiz-java-live-014',
    '{"score":96,"duration":622,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 09:22:33.904',
    TIMESTAMP '2025-11-14 09:22:33.904',
    TIMESTAMP '2025-11-14 09:22:33.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-zeynep-ozcan-1',
    'user-zeynep-ozcan-62',
    'quiz-rn-bug-001',
    '{"score":92,"duration":1067,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 05:11:23.132',
    TIMESTAMP '2025-11-05 05:11:23.132',
    TIMESTAMP '2025-11-05 05:11:23.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-zeynep-ozcan-2',
    'user-zeynep-ozcan-62',
    'quiz-rn-test-056',
    '{"score":70,"duration":1159,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 19:20:49.360',
    TIMESTAMP '2025-11-13 19:20:49.360',
    TIMESTAMP '2025-11-13 19:20:49.360'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-zeynep-ozcan-3',
    'user-zeynep-ozcan-62',
    'quiz-java-live-067',
    '{"score":67,"duration":1437,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 06:30:07.279',
    TIMESTAMP '2025-11-09 06:30:07.279',
    TIMESTAMP '2025-11-09 06:30:07.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-elif-polat-1',
    'user-elif-polat-63',
    'quiz-rn-test-098',
    '{"score":88,"duration":888,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 14:29:51.767',
    TIMESTAMP '2025-11-16 14:29:51.767',
    TIMESTAMP '2025-11-16 14:29:51.767'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-elif-polat-2',
    'user-elif-polat-63',
    'quiz-java-live-031',
    '{"score":77,"duration":1066,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 14:30:29.163',
    TIMESTAMP '2025-11-15 14:30:29.163',
    TIMESTAMP '2025-11-15 14:30:29.163'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-elif-polat-3',
    'user-elif-polat-63',
    'quiz-java-bug-049',
    '{"score":65,"duration":375,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 03:27:19.315',
    TIMESTAMP '2025-11-11 03:27:19.315',
    TIMESTAMP '2025-11-11 03:27:19.315'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-049')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-elif-polat-4',
    'user-elif-polat-63',
    'quiz-java-test-044',
    '{"score":87,"duration":1531,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 06:22:28.538',
    TIMESTAMP '2025-11-07 06:22:28.538',
    TIMESTAMP '2025-11-07 06:22:28.538'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-044')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-elif-polat-5',
    'user-elif-polat-63',
    'quiz-go-live-040',
    '{"score":95,"duration":641,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 02:08:05.066',
    TIMESTAMP '2025-11-10 02:08:05.066',
    TIMESTAMP '2025-11-10 02:08:05.066'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-elif-polat-6',
    'user-elif-polat-63',
    'quiz-go-bug-022',
    '{"score":72,"duration":1597,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 18:28:37.464',
    TIMESTAMP '2025-11-10 18:28:37.464',
    TIMESTAMP '2025-11-10 18:28:37.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-022')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-fatma-ozdemir-1',
    'user-fatma-ozdemir-64',
    'quiz-java-live-030',
    '{"score":92,"duration":739,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 02:09:53.433',
    TIMESTAMP '2025-11-13 02:09:53.433',
    TIMESTAMP '2025-11-13 02:09:53.433'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-fatma-ozdemir-2',
    'user-fatma-ozdemir-64',
    'quiz-java-bug-045',
    '{"score":91,"duration":1435,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 15:39:04.285',
    TIMESTAMP '2025-11-07 15:39:04.285',
    TIMESTAMP '2025-11-07 15:39:04.285'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-fatma-ozdemir-3',
    'user-fatma-ozdemir-64',
    'quiz-java-test-013',
    '{"score":90,"duration":1654,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 01:59:13.631',
    TIMESTAMP '2025-11-08 01:59:13.631',
    TIMESTAMP '2025-11-08 01:59:13.631'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-fatma-ozdemir-4',
    'user-fatma-ozdemir-64',
    'quiz-go-live-043',
    '{"score":80,"duration":1748,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 11:38:19.445',
    TIMESTAMP '2025-11-12 11:38:19.445',
    TIMESTAMP '2025-11-12 11:38:19.445'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-043')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-fatma-ozdemir-5',
    'user-fatma-ozdemir-64',
    'quiz-go-bug-015',
    '{"score":72,"duration":649,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 09:44:06.095',
    TIMESTAMP '2025-11-09 09:44:06.095',
    TIMESTAMP '2025-11-09 09:44:06.095'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-fatma-ozdemir-6',
    'user-fatma-ozdemir-64',
    'quiz-go-test-028',
    '{"score":86,"duration":630,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 07:19:21.432',
    TIMESTAMP '2025-11-10 07:19:21.432',
    TIMESTAMP '2025-11-10 07:19:21.432'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-merve-kurt-1',
    'user-merve-kurt-65',
    'quiz-java-bug-005',
    '{"score":84,"duration":1660,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 20:17:47.310',
    TIMESTAMP '2025-11-04 20:17:47.310',
    TIMESTAMP '2025-11-04 20:17:47.310'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-005')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-merve-kurt-2',
    'user-merve-kurt-65',
    'quiz-java-test-084',
    '{"score":98,"duration":1210,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 13:34:48.470',
    TIMESTAMP '2025-11-14 13:34:48.470',
    TIMESTAMP '2025-11-14 13:34:48.470'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-084')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-merve-kurt-3',
    'user-merve-kurt-65',
    'quiz-go-live-051',
    '{"score":98,"duration":835,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 03:44:13.121',
    TIMESTAMP '2025-11-08 03:44:13.121',
    TIMESTAMP '2025-11-08 03:44:13.121'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-merve-kurt-4',
    'user-merve-kurt-65',
    'quiz-go-bug-065',
    '{"score":90,"duration":837,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 17:22:42.099',
    TIMESTAMP '2025-11-07 17:22:42.099',
    TIMESTAMP '2025-11-07 17:22:42.099'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-065')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-merve-kurt-5',
    'user-merve-kurt-65',
    'quiz-go-test-002',
    '{"score":92,"duration":1696,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 12:15:03.804',
    TIMESTAMP '2025-11-13 12:15:03.804',
    TIMESTAMP '2025-11-13 12:15:03.804'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-seda-koc-1',
    'user-seda-koc-66',
    'quiz-java-test-024',
    '{"score":98,"duration":1397,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-26 06:02:39.993',
    TIMESTAMP '2025-10-26 06:02:39.993',
    TIMESTAMP '2025-10-26 06:02:39.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-seda-koc-2',
    'user-seda-koc-66',
    'quiz-go-live-014',
    '{"score":73,"duration":1734,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 09:00:36.964',
    TIMESTAMP '2025-11-15 09:00:36.964',
    TIMESTAMP '2025-11-15 09:00:36.964'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-seda-koc-3',
    'user-seda-koc-66',
    'quiz-go-bug-080',
    '{"score":80,"duration":1113,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 23:51:31.622',
    TIMESTAMP '2025-11-14 23:51:31.622',
    TIMESTAMP '2025-11-14 23:51:31.622'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-080')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-seda-koc-4',
    'user-seda-koc-66',
    'quiz-go-test-047',
    '{"score":91,"duration":1135,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-23 02:49:26.838',
    TIMESTAMP '2025-10-23 02:49:26.838',
    TIMESTAMP '2025-10-23 02:49:26.838'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-derya-kara-1',
    'user-derya-kara-67',
    'quiz-go-live-013',
    '{"score":82,"duration":1027,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 07:02:31.787',
    TIMESTAMP '2025-11-14 07:02:31.787',
    TIMESTAMP '2025-11-14 07:02:31.787'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-013')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-derya-kara-2',
    'user-derya-kara-67',
    'quiz-go-bug-066',
    '{"score":66,"duration":846,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 15:37:09.932',
    TIMESTAMP '2025-11-10 15:37:09.932',
    TIMESTAMP '2025-11-10 15:37:09.932'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-derya-kara-3',
    'user-derya-kara-67',
    'quiz-go-test-007',
    '{"score":89,"duration":1210,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 14:56:15.545',
    TIMESTAMP '2025-11-14 14:56:15.545',
    TIMESTAMP '2025-11-14 14:56:15.545'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-007')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-aslan-1',
    'user-gizem-aslan-68',
    'quiz-go-bug-034',
    '{"score":93,"duration":1776,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 09:43:26.159',
    TIMESTAMP '2025-11-08 09:43:26.159',
    TIMESTAMP '2025-11-08 09:43:26.159'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-aslan-2',
    'user-gizem-aslan-68',
    'quiz-go-test-017',
    '{"score":96,"duration":789,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 00:25:59.171',
    TIMESTAMP '2025-11-04 00:25:59.171',
    TIMESTAMP '2025-11-04 00:25:59.171'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-aslan-3',
    'user-gizem-aslan-68',
    'quiz-dotnet-live-038',
    '{"score":65,"duration":1676,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 23:03:18.342',
    TIMESTAMP '2025-11-06 23:03:18.342',
    TIMESTAMP '2025-11-06 23:03:18.342'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-aslan-4',
    'user-gizem-aslan-68',
    'quiz-dotnet-bug-100',
    '{"score":86,"duration":832,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 12:19:18.967',
    TIMESTAMP '2025-11-15 12:19:18.967',
    TIMESTAMP '2025-11-15 12:19:18.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-100')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-aslan-5',
    'user-gizem-aslan-68',
    'quiz-dotnet-test-080',
    '{"score":89,"duration":980,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 08:10:58.646',
    TIMESTAMP '2025-11-15 08:10:58.646',
    TIMESTAMP '2025-11-15 08:10:58.646'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-gizem-aslan-6',
    'user-gizem-aslan-68',
    'quiz-react-adv-live-018',
    '{"score":88,"duration":1239,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 23:05:56.067',
    TIMESTAMP '2025-11-10 23:05:56.067',
    TIMESTAMP '2025-11-10 23:05:56.067'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-018')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-kilic-1',
    'user-busra-kilic-69',
    'quiz-go-test-074',
    '{"score":81,"duration":670,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 14:09:07.600',
    TIMESTAMP '2025-11-09 14:09:07.600',
    TIMESTAMP '2025-11-09 14:09:07.600'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-kilic-2',
    'user-busra-kilic-69',
    'quiz-dotnet-live-007',
    '{"score":76,"duration":957,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 13:22:43.807',
    TIMESTAMP '2025-11-11 13:22:43.807',
    TIMESTAMP '2025-11-11 13:22:43.807'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-007')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-busra-kilic-3',
    'user-busra-kilic-69',
    'quiz-dotnet-bug-023',
    '{"score":75,"duration":1657,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-31 05:44:48.317',
    TIMESTAMP '2025-10-31 05:44:48.317',
    TIMESTAMP '2025-10-31 05:44:48.317'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-023')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-dogan-1',
    'user-sibel-dogan-70',
    'quiz-dotnet-live-074',
    '{"score":98,"duration":1709,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-04 12:55:37.539',
    TIMESTAMP '2025-11-04 12:55:37.539',
    TIMESTAMP '2025-11-04 12:55:37.539'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-074')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-dogan-2',
    'user-sibel-dogan-70',
    'quiz-dotnet-bug-041',
    '{"score":68,"duration":1170,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 08:54:38.607',
    TIMESTAMP '2025-11-02 08:54:38.607',
    TIMESTAMP '2025-11-02 08:54:38.607'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-041')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sibel-dogan-3',
    'user-sibel-dogan-70',
    'quiz-dotnet-test-072',
    '{"score":81,"duration":1339,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 09:46:05.023',
    TIMESTAMP '2025-11-09 09:46:05.023',
    TIMESTAMP '2025-11-09 09:46:05.023'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ece-arslan-1',
    'user-ece-arslan-71',
    'quiz-dotnet-bug-027',
    '{"score":84,"duration":401,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-08 22:44:33.216',
    TIMESTAMP '2025-11-08 22:44:33.216',
    TIMESTAMP '2025-11-08 22:44:33.216'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ece-arslan-2',
    'user-ece-arslan-71',
    'quiz-dotnet-test-039',
    '{"score":87,"duration":841,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-09 14:56:27.637',
    TIMESTAMP '2025-11-09 14:56:27.637',
    TIMESTAMP '2025-11-09 14:56:27.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-ece-arslan-3',
    'user-ece-arslan-71',
    'quiz-react-adv-live-034',
    '{"score":97,"duration":932,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 19:23:09.209',
    TIMESTAMP '2025-11-05 19:23:09.209',
    TIMESTAMP '2025-11-05 19:23:09.209'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-pelin-ozturk-1',
    'user-pelin-ozturk-72',
    'quiz-dotnet-test-021',
    '{"score":83,"duration":357,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 14:50:27.860',
    TIMESTAMP '2025-11-14 14:50:27.860',
    TIMESTAMP '2025-11-14 14:50:27.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-pelin-ozturk-2',
    'user-pelin-ozturk-72',
    'quiz-react-adv-live-019',
    '{"score":70,"duration":1361,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 20:59:56.293',
    TIMESTAMP '2025-11-07 20:59:56.293',
    TIMESTAMP '2025-11-07 20:59:56.293'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-pelin-ozturk-3',
    'user-pelin-ozturk-72',
    'quiz-react-adv-bug-008',
    '{"score":77,"duration":1242,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 01:21:14.897',
    TIMESTAMP '2025-11-10 01:21:14.897',
    TIMESTAMP '2025-11-10 01:21:14.897'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-008')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-pelin-ozturk-4',
    'user-pelin-ozturk-72',
    'quiz-react-adv-test-046',
    '{"score":98,"duration":647,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 00:00:00.505',
    TIMESTAMP '2025-11-10 00:00:00.505',
    TIMESTAMP '2025-11-10 00:00:00.505'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-aydin-1',
    'user-hande-aydin-73',
    'quiz-react-adv-live-009',
    '{"score":83,"duration":705,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-30 18:07:36.458',
    TIMESTAMP '2025-10-30 18:07:36.458',
    TIMESTAMP '2025-10-30 18:07:36.458'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-aydin-2',
    'user-hande-aydin-73',
    'quiz-react-adv-bug-014',
    '{"score":72,"duration":852,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 05:10:24.669',
    TIMESTAMP '2025-11-02 05:10:24.669',
    TIMESTAMP '2025-11-02 05:10:24.669'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-014')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-hande-aydin-3',
    'user-hande-aydin-73',
    'quiz-react-adv-test-039',
    '{"score":96,"duration":623,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-29 15:13:10.210',
    TIMESTAMP '2025-10-29 15:13:10.210',
    TIMESTAMP '2025-10-29 15:13:10.210'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-yildirim-1',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-bug-035',
    '{"score":78,"duration":1737,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-27 11:29:26.915',
    TIMESTAMP '2025-10-27 11:29:26.915',
    TIMESTAMP '2025-10-27 11:29:26.915'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-035')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-yildirim-2',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-test-022',
    '{"score":86,"duration":1528,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 15:53:13.278',
    TIMESTAMP '2025-11-15 15:53:13.278',
    TIMESTAMP '2025-11-15 15:53:13.278'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-yildirim-3',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-live-021',
    '{"score":78,"duration":970,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 21:44:21.113',
    TIMESTAMP '2025-11-02 21:44:21.113',
    TIMESTAMP '2025-11-02 21:44:21.113'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-yildirim-4',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-bug-037',
    '{"score":66,"duration":1356,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 02:22:53.024',
    TIMESTAMP '2025-11-14 02:22:53.024',
    TIMESTAMP '2025-11-14 02:22:53.024'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-yildirim-5',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-test-040',
    '{"score":77,"duration":864,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 00:46:00.995',
    TIMESTAMP '2025-11-02 00:46:00.995',
    TIMESTAMP '2025-11-02 00:46:00.995'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-sevgi-yildirim-6',
    'user-sevgi-yildirim-74',
    'quiz-node-adv-live-014',
    '{"score":75,"duration":1684,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-10-23 06:28:15.307',
    TIMESTAMP '2025-10-23 06:28:15.307',
    TIMESTAMP '2025-10-23 06:28:15.307'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-yildiz-1',
    'user-i-rem-yildiz-75',
    'quiz-react-adv-test-020',
    '{"score":70,"duration":648,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 21:57:58.297',
    TIMESTAMP '2025-11-12 21:57:58.297',
    TIMESTAMP '2025-11-12 21:57:58.297'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-yildiz-2',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-live-044',
    '{"score":85,"duration":330,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 10:09:22.737',
    TIMESTAMP '2025-11-14 10:09:22.737',
    TIMESTAMP '2025-11-14 10:09:22.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-yildiz-3',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-bug-027',
    '{"score":91,"duration":1738,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 07:01:04.091',
    TIMESTAMP '2025-11-16 07:01:04.091',
    TIMESTAMP '2025-11-16 07:01:04.091'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-yildiz-4',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-test-037',
    '{"score":77,"duration":519,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 06:46:38.859',
    TIMESTAMP '2025-11-15 06:46:38.859',
    TIMESTAMP '2025-11-15 06:46:38.859'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-037')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-i-rem-yildiz-5',
    'user-i-rem-yildiz-75',
    'quiz-node-adv-live-028',
    '{"score":86,"duration":334,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 03:19:04.569',
    TIMESTAMP '2025-11-12 03:19:04.569',
    TIMESTAMP '2025-11-12 03:19:04.569'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-028')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-celik-1',
    'user-tugce-celik-76',
    'quiz-flutter-adv-live-036',
    '{"score":97,"duration":1665,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-13 22:14:45.174',
    TIMESTAMP '2025-11-13 22:14:45.174',
    TIMESTAMP '2025-11-13 22:14:45.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-celik-2',
    'user-tugce-celik-76',
    'quiz-flutter-adv-bug-011',
    '{"score":87,"duration":1635,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 21:49:01.464',
    TIMESTAMP '2025-11-15 21:49:01.464',
    TIMESTAMP '2025-11-15 21:49:01.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-celik-3',
    'user-tugce-celik-76',
    'quiz-flutter-adv-test-020',
    '{"score":91,"duration":726,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 20:30:59.141',
    TIMESTAMP '2025-11-15 20:30:59.141',
    TIMESTAMP '2025-11-15 20:30:59.141'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-celik-4',
    'user-tugce-celik-76',
    'quiz-node-adv-live-014',
    '{"score":69,"duration":1445,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 21:42:54.606',
    TIMESTAMP '2025-11-15 21:42:54.606',
    TIMESTAMP '2025-11-15 21:42:54.606'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-tugce-celik-5',
    'user-tugce-celik-76',
    'quiz-node-adv-bug-042',
    '{"score":83,"duration":473,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 13:39:32.182',
    TIMESTAMP '2025-11-12 13:39:32.182',
    TIMESTAMP '2025-11-12 13:39:32.182'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-042')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-sahin-1',
    'user-asli-sahin-77',
    'quiz-flutter-adv-bug-019',
    '{"score":82,"duration":1439,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-07 15:56:06.497',
    TIMESTAMP '2025-11-07 15:56:06.497',
    TIMESTAMP '2025-11-07 15:56:06.497'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-sahin-2',
    'user-asli-sahin-77',
    'quiz-flutter-adv-test-017',
    '{"score":68,"duration":381,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-06 04:53:25.981',
    TIMESTAMP '2025-11-06 04:53:25.981',
    TIMESTAMP '2025-11-06 04:53:25.981'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-sahin-3',
    'user-asli-sahin-77',
    'quiz-node-adv-live-036',
    '{"score":74,"duration":1315,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-02 03:01:35.264',
    TIMESTAMP '2025-11-02 03:01:35.264',
    TIMESTAMP '2025-11-02 03:01:35.264'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-sahin-4',
    'user-asli-sahin-77',
    'quiz-node-adv-bug-043',
    '{"score":67,"duration":1766,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-05 17:40:03.102',
    TIMESTAMP '2025-11-05 17:40:03.102',
    TIMESTAMP '2025-11-05 17:40:03.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-sahin-5',
    'user-asli-sahin-77',
    'quiz-node-adv-test-017',
    '{"score":95,"duration":1576,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 02:52:14.199',
    TIMESTAMP '2025-11-01 02:52:14.199',
    TIMESTAMP '2025-11-01 02:52:14.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-asli-sahin-6',
    'user-asli-sahin-77',
    'quiz-python-adv-live-025',
    '{"score":70,"duration":1161,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-01 07:16:49.567',
    TIMESTAMP '2025-11-01 07:16:49.567',
    TIMESTAMP '2025-11-01 07:16:49.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-025')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nisan-demir-1',
    'user-nisan-demir-78',
    'quiz-flutter-adv-test-013',
    '{"score":83,"duration":1722,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 16:14:11.093',
    TIMESTAMP '2025-11-15 16:14:11.093',
    TIMESTAMP '2025-11-15 16:14:11.093'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nisan-demir-2',
    'user-nisan-demir-78',
    'quiz-node-adv-live-019',
    '{"score":80,"duration":1263,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 09:06:49.256',
    TIMESTAMP '2025-11-12 09:06:49.256',
    TIMESTAMP '2025-11-12 09:06:49.256'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-nisan-demir-3',
    'user-nisan-demir-78',
    'quiz-node-adv-bug-043',
    '{"score":96,"duration":1323,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 20:17:39.566',
    TIMESTAMP '2025-11-15 20:17:39.566',
    TIMESTAMP '2025-11-15 20:17:39.566'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-kaya-1',
    'user-melis-kaya-79',
    'quiz-node-adv-live-040',
    '{"score":73,"duration":828,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 13:36:54.450',
    TIMESTAMP '2025-11-15 13:36:54.450',
    TIMESTAMP '2025-11-15 13:36:54.450'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-kaya-2',
    'user-melis-kaya-79',
    'quiz-node-adv-bug-036',
    '{"score":74,"duration":1572,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 16:34:45.122',
    TIMESTAMP '2025-11-15 16:34:45.122',
    TIMESTAMP '2025-11-15 16:34:45.122'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-kaya-3',
    'user-melis-kaya-79',
    'quiz-node-adv-test-002',
    '{"score":69,"duration":761,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 11:03:37.588',
    TIMESTAMP '2025-11-16 11:03:37.588',
    TIMESTAMP '2025-11-16 11:03:37.588'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-kaya-4',
    'user-melis-kaya-79',
    'quiz-python-adv-live-006',
    '{"score":69,"duration":1309,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 11:14:00.117',
    TIMESTAMP '2025-11-15 11:14:00.117',
    TIMESTAMP '2025-11-15 11:14:00.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-kaya-5',
    'user-melis-kaya-79',
    'quiz-python-adv-bug-044',
    '{"score":78,"duration":1420,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 12:02:57.143',
    TIMESTAMP '2025-11-14 12:02:57.143',
    TIMESTAMP '2025-11-14 12:02:57.143'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-044')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-melis-kaya-6',
    'user-melis-kaya-79',
    'quiz-python-adv-test-025',
    '{"score":74,"duration":1230,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-15 16:21:48.503',
    TIMESTAMP '2025-11-15 16:21:48.503',
    TIMESTAMP '2025-11-15 16:21:48.503'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-025')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-yilmaz-1',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-bug-024',
    '{"score":75,"duration":1735,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 20:25:33.393',
    TIMESTAMP '2025-11-12 20:25:33.393',
    TIMESTAMP '2025-11-12 20:25:33.393'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-yilmaz-2',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-test-004',
    '{"score":65,"duration":687,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-11 05:40:08.333',
    TIMESTAMP '2025-11-11 05:40:08.333',
    TIMESTAMP '2025-11-11 05:40:08.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-yilmaz-3',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-live-003',
    '{"score":74,"duration":623,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-10 14:23:38.905',
    TIMESTAMP '2025-11-10 14:23:38.905',
    TIMESTAMP '2025-11-10 14:23:38.905'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-003')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-yilmaz-4',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-bug-001',
    '{"score":68,"duration":1262,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-16 09:28:33.111',
    TIMESTAMP '2025-11-16 09:28:33.111',
    TIMESTAMP '2025-11-16 09:28:33.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-yilmaz-5',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-test-039',
    '{"score":84,"duration":487,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-12 15:02:45.984',
    TIMESTAMP '2025-11-12 15:02:45.984',
    TIMESTAMP '2025-11-12 15:02:45.984'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'testattempt-cansu-yilmaz-6',
    'user-cansu-yilmaz-80',
    'quiz-react-live-020',
    '{"score":93,"duration":1651,"attempts":1}'::jsonb,
    '{"summary":"Stable performance"}'::jsonb,
    TIMESTAMP '2025-11-14 08:41:42.550',
    TIMESTAMP '2025-11-14 08:41:42.550',
    TIMESTAMP '2025-11-14 08:41:42.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-020')
ON CONFLICT DO NOTHING;

-- Insert live coding attempts (only if quiz exists)
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-keskin-1',
    'user-mehmet-keskin-1',
    'quiz-react-live-044',
    '{"codeQuality":90,"completionTime":1698,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 04:16:51.953',
    TIMESTAMP '2025-11-16 04:16:51.953',
    TIMESTAMP '2025-11-16 04:16:51.953'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-keskin-2',
    'user-mehmet-keskin-1',
    'quiz-react-bug-081',
    '{"codeQuality":94,"completionTime":1544,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 04:35:28.758',
    TIMESTAMP '2025-11-15 04:35:28.758',
    TIMESTAMP '2025-11-15 04:35:28.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-keskin-3',
    'user-mehmet-keskin-1',
    'quiz-react-test-010',
    '{"codeQuality":95,"completionTime":709,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 04:51:12.982',
    TIMESTAMP '2025-11-14 04:51:12.982',
    TIMESTAMP '2025-11-14 04:51:12.982'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-keskin-4',
    'user-mehmet-keskin-1',
    'quiz-flutter-live-038',
    '{"codeQuality":70,"completionTime":320,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 18:38:59.660',
    TIMESTAMP '2025-11-15 18:38:59.660',
    TIMESTAMP '2025-11-15 18:38:59.660'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-avci-1',
    'user-ahmet-avci-2',
    'quiz-react-bug-004',
    '{"codeQuality":95,"completionTime":500,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 22:04:01.090',
    TIMESTAMP '2025-11-14 22:04:01.090',
    TIMESTAMP '2025-11-14 22:04:01.090'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-avci-2',
    'user-ahmet-avci-2',
    'quiz-react-test-005',
    '{"codeQuality":81,"completionTime":1699,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 20:39:21.931',
    TIMESTAMP '2025-11-15 20:39:21.931',
    TIMESTAMP '2025-11-15 20:39:21.931'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-avci-3',
    'user-ahmet-avci-2',
    'quiz-flutter-live-046',
    '{"codeQuality":89,"completionTime":462,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 05:47:25.580',
    TIMESTAMP '2025-11-16 05:47:25.580',
    TIMESTAMP '2025-11-16 05:47:25.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-avci-4',
    'user-ahmet-avci-2',
    'quiz-flutter-bug-063',
    '{"codeQuality":89,"completionTime":881,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 15:28:27.709',
    TIMESTAMP '2025-11-14 15:28:27.709',
    TIMESTAMP '2025-11-14 15:28:27.709'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-avci-5',
    'user-ahmet-avci-2',
    'quiz-flutter-test-088',
    '{"codeQuality":76,"completionTime":1640,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 18:01:14.350',
    TIMESTAMP '2025-11-14 18:01:14.350',
    TIMESTAMP '2025-11-14 18:01:14.350'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-avci-6',
    'user-ahmet-avci-2',
    'quiz-node-live-046',
    '{"codeQuality":70,"completionTime":494,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 01:59:50.242',
    TIMESTAMP '2025-11-15 01:59:50.242',
    TIMESTAMP '2025-11-15 01:59:50.242'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-bulut-1',
    'user-mustafa-bulut-3',
    'quiz-react-test-098',
    '{"codeQuality":82,"completionTime":1016,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 07:12:02.580',
    TIMESTAMP '2025-11-01 07:12:02.580',
    TIMESTAMP '2025-11-01 07:12:02.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-bulut-2',
    'user-mustafa-bulut-3',
    'quiz-flutter-live-034',
    '{"codeQuality":79,"completionTime":1546,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 22:07:09.142',
    TIMESTAMP '2025-11-11 22:07:09.142',
    TIMESTAMP '2025-11-11 22:07:09.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-bulut-3',
    'user-mustafa-bulut-3',
    'quiz-flutter-bug-052',
    '{"codeQuality":82,"completionTime":1298,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 05:34:21.236',
    TIMESTAMP '2025-11-09 05:34:21.236',
    TIMESTAMP '2025-11-09 05:34:21.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-bulut-4',
    'user-mustafa-bulut-3',
    'quiz-flutter-test-022',
    '{"codeQuality":94,"completionTime":344,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 21:03:17.231',
    TIMESTAMP '2025-11-07 21:03:17.231',
    TIMESTAMP '2025-11-07 21:03:17.231'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-bulut-5',
    'user-mustafa-bulut-3',
    'quiz-node-live-083',
    '{"codeQuality":91,"completionTime":1482,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-29 21:36:40.323',
    TIMESTAMP '2025-10-29 21:36:40.323',
    TIMESTAMP '2025-10-29 21:36:40.323'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-huseyin-erdogan-1',
    'user-huseyin-erdogan-4',
    'quiz-flutter-live-058',
    '{"codeQuality":85,"completionTime":772,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 17:00:09.860',
    TIMESTAMP '2025-11-01 17:00:09.860',
    TIMESTAMP '2025-11-01 17:00:09.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-huseyin-erdogan-2',
    'user-huseyin-erdogan-4',
    'quiz-flutter-bug-052',
    '{"codeQuality":90,"completionTime":796,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-22 14:54:01.002',
    TIMESTAMP '2025-10-22 14:54:01.002',
    TIMESTAMP '2025-10-22 14:54:01.002'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-huseyin-erdogan-3',
    'user-huseyin-erdogan-4',
    'quiz-flutter-test-008',
    '{"codeQuality":70,"completionTime":757,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 08:31:20.604',
    TIMESTAMP '2025-11-10 08:31:20.604',
    TIMESTAMP '2025-11-10 08:31:20.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-008')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-emre-aksoy-1',
    'user-emre-aksoy-5',
    'quiz-flutter-bug-021',
    '{"codeQuality":79,"completionTime":1121,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 17:48:44.236',
    TIMESTAMP '2025-11-15 17:48:44.236',
    TIMESTAMP '2025-11-15 17:48:44.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-emre-aksoy-2',
    'user-emre-aksoy-5',
    'quiz-flutter-test-029',
    '{"codeQuality":94,"completionTime":1509,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 21:39:30.291',
    TIMESTAMP '2025-11-11 21:39:30.291',
    TIMESTAMP '2025-11-11 21:39:30.291'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-emre-aksoy-3',
    'user-emre-aksoy-5',
    'quiz-node-live-040',
    '{"codeQuality":80,"completionTime":1346,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 13:54:27.430',
    TIMESTAMP '2025-11-11 13:54:27.430',
    TIMESTAMP '2025-11-11 13:54:27.430'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-bozkurt-1',
    'user-burak-bozkurt-6',
    'quiz-flutter-test-006',
    '{"codeQuality":80,"completionTime":1705,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 08:19:45.117',
    TIMESTAMP '2025-11-09 08:19:45.117',
    TIMESTAMP '2025-11-09 08:19:45.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-006')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-bozkurt-2',
    'user-burak-bozkurt-6',
    'quiz-node-live-031',
    '{"codeQuality":84,"completionTime":1248,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 07:12:30.946',
    TIMESTAMP '2025-11-05 07:12:30.946',
    TIMESTAMP '2025-11-05 07:12:30.946'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-bozkurt-3',
    'user-burak-bozkurt-6',
    'quiz-node-bug-018',
    '{"codeQuality":89,"completionTime":1410,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 03:11:50.443',
    TIMESTAMP '2025-11-05 03:11:50.443',
    TIMESTAMP '2025-11-05 03:11:50.443'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-bozkurt-4',
    'user-burak-bozkurt-6',
    'quiz-node-test-012',
    '{"codeQuality":86,"completionTime":1436,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 07:01:37.112',
    TIMESTAMP '2025-11-01 07:01:37.112',
    TIMESTAMP '2025-11-01 07:01:37.112'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-012')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-bozkurt-5',
    'user-burak-bozkurt-6',
    'quiz-python-live-006',
    '{"codeQuality":90,"completionTime":1707,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 14:30:39.111',
    TIMESTAMP '2025-11-08 14:30:39.111',
    TIMESTAMP '2025-11-08 14:30:39.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-bozkurt-6',
    'user-burak-bozkurt-6',
    'quiz-python-bug-001',
    '{"codeQuality":83,"completionTime":648,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 01:34:44.026',
    TIMESTAMP '2025-11-03 01:34:44.026',
    TIMESTAMP '2025-11-03 01:34:44.026'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cem-gunes-1',
    'user-cem-gunes-7',
    'quiz-node-live-092',
    '{"codeQuality":95,"completionTime":412,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 20:21:22.949',
    TIMESTAMP '2025-11-14 20:21:22.949',
    TIMESTAMP '2025-11-14 20:21:22.949'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-092')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cem-gunes-2',
    'user-cem-gunes-7',
    'quiz-node-bug-097',
    '{"codeQuality":71,"completionTime":585,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 14:31:15.174',
    TIMESTAMP '2025-11-14 14:31:15.174',
    TIMESTAMP '2025-11-14 14:31:15.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cem-gunes-3',
    'user-cem-gunes-7',
    'quiz-node-test-070',
    '{"codeQuality":90,"completionTime":1115,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 18:11:25.980',
    TIMESTAMP '2025-11-15 18:11:25.980',
    TIMESTAMP '2025-11-15 18:11:25.980'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-070')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cem-gunes-4',
    'user-cem-gunes-7',
    'quiz-python-live-053',
    '{"codeQuality":95,"completionTime":1453,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 22:10:47.522',
    TIMESTAMP '2025-11-13 22:10:47.522',
    TIMESTAMP '2025-11-13 22:10:47.522'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cem-gunes-5',
    'user-cem-gunes-7',
    'quiz-python-bug-011',
    '{"codeQuality":84,"completionTime":772,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 16:33:57.534',
    TIMESTAMP '2025-11-14 16:33:57.534',
    TIMESTAMP '2025-11-14 16:33:57.534'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cem-gunes-6',
    'user-cem-gunes-7',
    'quiz-python-test-066',
    '{"codeQuality":81,"completionTime":859,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 20:41:53.637',
    TIMESTAMP '2025-11-14 20:41:53.637',
    TIMESTAMP '2025-11-14 20:41:53.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-can-tas-1',
    'user-can-tas-8',
    'quiz-node-bug-097',
    '{"codeQuality":88,"completionTime":711,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 08:24:51.107',
    TIMESTAMP '2025-11-16 08:24:51.107',
    TIMESTAMP '2025-11-16 08:24:51.107'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-can-tas-2',
    'user-can-tas-8',
    'quiz-node-test-053',
    '{"codeQuality":94,"completionTime":998,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 12:29:42.625',
    TIMESTAMP '2025-11-16 12:29:42.625',
    TIMESTAMP '2025-11-16 12:29:42.625'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-053')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-can-tas-3',
    'user-can-tas-8',
    'quiz-python-live-001',
    '{"codeQuality":81,"completionTime":1130,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 11:10:08.250',
    TIMESTAMP '2025-11-16 11:10:08.250',
    TIMESTAMP '2025-11-16 11:10:08.250'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ozan-tekin-1',
    'user-ozan-tekin-9',
    'quiz-node-test-089',
    '{"codeQuality":92,"completionTime":813,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 04:03:49.258',
    TIMESTAMP '2025-11-10 04:03:49.258',
    TIMESTAMP '2025-11-10 04:03:49.258'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-089')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ozan-tekin-2',
    'user-ozan-tekin-9',
    'quiz-python-live-035',
    '{"codeQuality":72,"completionTime":1277,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 10:15:19.661',
    TIMESTAMP '2025-11-13 10:15:19.661',
    TIMESTAMP '2025-11-13 10:15:19.661'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ozan-tekin-3',
    'user-ozan-tekin-9',
    'quiz-python-bug-077',
    '{"codeQuality":78,"completionTime":471,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 22:33:48.199',
    TIMESTAMP '2025-11-01 22:33:48.199',
    TIMESTAMP '2025-11-01 22:33:48.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-eren-sari-1',
    'user-eren-sari-10',
    'quiz-python-live-021',
    '{"codeQuality":87,"completionTime":346,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 20:48:29.152',
    TIMESTAMP '2025-10-31 20:48:29.152',
    TIMESTAMP '2025-10-31 20:48:29.152'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-eren-sari-2',
    'user-eren-sari-10',
    'quiz-python-bug-064',
    '{"codeQuality":73,"completionTime":1105,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 05:35:19.274',
    TIMESTAMP '2025-11-07 05:35:19.274',
    TIMESTAMP '2025-11-07 05:35:19.274'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-eren-sari-3',
    'user-eren-sari-10',
    'quiz-python-test-004',
    '{"codeQuality":75,"completionTime":543,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 19:43:11.168',
    TIMESTAMP '2025-11-14 19:43:11.168',
    TIMESTAMP '2025-11-14 19:43:11.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-eren-sari-4',
    'user-eren-sari-10',
    'quiz-angular-live-064',
    '{"codeQuality":74,"completionTime":776,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-29 12:16:18.880',
    TIMESTAMP '2025-10-29 12:16:18.880',
    TIMESTAMP '2025-10-29 12:16:18.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-064')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-eren-sari-5',
    'user-eren-sari-10',
    'quiz-angular-bug-076',
    '{"codeQuality":86,"completionTime":1423,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 15:53:40.671',
    TIMESTAMP '2025-11-02 15:53:40.671',
    TIMESTAMP '2025-11-02 15:53:40.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-deniz-kaplan-1',
    'user-deniz-kaplan-11',
    'quiz-python-bug-070',
    '{"codeQuality":89,"completionTime":811,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 17:39:23.590',
    TIMESTAMP '2025-11-12 17:39:23.590',
    TIMESTAMP '2025-11-12 17:39:23.590'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-070')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-deniz-kaplan-2',
    'user-deniz-kaplan-11',
    'quiz-python-test-059',
    '{"codeQuality":77,"completionTime":994,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 00:04:44.741',
    TIMESTAMP '2025-11-16 00:04:44.741',
    TIMESTAMP '2025-11-16 00:04:44.741'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-deniz-kaplan-3',
    'user-deniz-kaplan-11',
    'quiz-angular-live-039',
    '{"codeQuality":94,"completionTime":980,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 22:31:54.571',
    TIMESTAMP '2025-11-14 22:31:54.571',
    TIMESTAMP '2025-11-14 22:31:54.571'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-deniz-kaplan-4',
    'user-deniz-kaplan-11',
    'quiz-angular-bug-045',
    '{"codeQuality":91,"completionTime":1575,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 15:33:45.724',
    TIMESTAMP '2025-11-12 15:33:45.724',
    TIMESTAMP '2025-11-12 15:33:45.724'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hakan-ozcan-1',
    'user-hakan-ozcan-12',
    'quiz-python-test-031',
    '{"codeQuality":82,"completionTime":858,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 08:40:21.936',
    TIMESTAMP '2025-11-14 08:40:21.936',
    TIMESTAMP '2025-11-14 08:40:21.936'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-031')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hakan-ozcan-2',
    'user-hakan-ozcan-12',
    'quiz-angular-live-035',
    '{"codeQuality":92,"completionTime":1338,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 22:41:03.364',
    TIMESTAMP '2025-11-12 22:41:03.364',
    TIMESTAMP '2025-11-12 22:41:03.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hakan-ozcan-3',
    'user-hakan-ozcan-12',
    'quiz-angular-bug-030',
    '{"codeQuality":90,"completionTime":863,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 03:07:37.683',
    TIMESTAMP '2025-11-13 03:07:37.683',
    TIMESTAMP '2025-11-13 03:07:37.683'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hakan-ozcan-4',
    'user-hakan-ozcan-12',
    'quiz-angular-test-046',
    '{"codeQuality":95,"completionTime":975,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 11:20:10.089',
    TIMESTAMP '2025-11-16 11:20:10.089',
    TIMESTAMP '2025-11-16 11:20:10.089'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hakan-ozcan-5',
    'user-hakan-ozcan-12',
    'quiz-vue-live-078',
    '{"codeQuality":75,"completionTime":1571,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 16:45:37.742',
    TIMESTAMP '2025-11-15 16:45:37.742',
    TIMESTAMP '2025-11-15 16:45:37.742'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-onur-polat-1',
    'user-onur-polat-13',
    'quiz-angular-live-019',
    '{"codeQuality":78,"completionTime":1789,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 18:51:08.945',
    TIMESTAMP '2025-11-05 18:51:08.945',
    TIMESTAMP '2025-11-05 18:51:08.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-onur-polat-2',
    'user-onur-polat-13',
    'quiz-angular-bug-076',
    '{"codeQuality":72,"completionTime":618,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 15:04:09.290',
    TIMESTAMP '2025-11-10 15:04:09.290',
    TIMESTAMP '2025-11-10 15:04:09.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-onur-polat-3',
    'user-onur-polat-13',
    'quiz-angular-test-099',
    '{"codeQuality":93,"completionTime":1776,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 01:59:32.909',
    TIMESTAMP '2025-11-15 01:59:32.909',
    TIMESTAMP '2025-11-15 01:59:32.909'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-099')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tolga-ozdemir-1',
    'user-tolga-ozdemir-14',
    'quiz-angular-bug-073',
    '{"codeQuality":75,"completionTime":319,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 12:02:50.911',
    TIMESTAMP '2025-11-13 12:02:50.911',
    TIMESTAMP '2025-11-13 12:02:50.911'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-073')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tolga-ozdemir-2',
    'user-tolga-ozdemir-14',
    'quiz-angular-test-014',
    '{"codeQuality":91,"completionTime":1519,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 04:44:33.225',
    TIMESTAMP '2025-11-16 04:44:33.225',
    TIMESTAMP '2025-11-16 04:44:33.225'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-014')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tolga-ozdemir-3',
    'user-tolga-ozdemir-14',
    'quiz-vue-live-038',
    '{"codeQuality":84,"completionTime":1058,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 13:53:08.805',
    TIMESTAMP '2025-11-12 13:53:08.805',
    TIMESTAMP '2025-11-12 13:53:08.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tolga-ozdemir-4',
    'user-tolga-ozdemir-14',
    'quiz-vue-bug-029',
    '{"codeQuality":92,"completionTime":1105,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 02:01:02.884',
    TIMESTAMP '2025-11-13 02:01:02.884',
    TIMESTAMP '2025-11-13 02:01:02.884'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-029')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tolga-ozdemir-5',
    'user-tolga-ozdemir-14',
    'quiz-vue-test-071',
    '{"codeQuality":90,"completionTime":1486,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 02:34:56.553',
    TIMESTAMP '2025-11-13 02:34:56.553',
    TIMESTAMP '2025-11-13 02:34:56.553'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tolga-ozdemir-6',
    'user-tolga-ozdemir-14',
    'quiz-rn-live-024',
    '{"codeQuality":83,"completionTime":1326,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 18:35:42.896',
    TIMESTAMP '2025-11-11 18:35:42.896',
    TIMESTAMP '2025-11-11 18:35:42.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasin-kurt-1',
    'user-yasin-kurt-15',
    'quiz-angular-test-059',
    '{"codeQuality":84,"completionTime":832,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 19:51:48.442',
    TIMESTAMP '2025-11-14 19:51:48.442',
    TIMESTAMP '2025-11-14 19:51:48.442'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasin-kurt-2',
    'user-yasin-kurt-15',
    'quiz-vue-live-089',
    '{"codeQuality":84,"completionTime":1679,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 08:37:00.800',
    TIMESTAMP '2025-11-16 08:37:00.800',
    TIMESTAMP '2025-11-16 08:37:00.800'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasin-kurt-3',
    'user-yasin-kurt-15',
    'quiz-vue-bug-043',
    '{"codeQuality":85,"completionTime":1334,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 10:40:32.504',
    TIMESTAMP '2025-11-16 10:40:32.504',
    TIMESTAMP '2025-11-16 10:40:32.504'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasin-kurt-4',
    'user-yasin-kurt-15',
    'quiz-vue-test-046',
    '{"codeQuality":88,"completionTime":433,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 10:19:06.753',
    TIMESTAMP '2025-11-15 10:19:06.753',
    TIMESTAMP '2025-11-15 10:19:06.753'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kerem-koc-1',
    'user-kerem-koc-16',
    'quiz-vue-live-070',
    '{"codeQuality":88,"completionTime":1688,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 12:05:27.384',
    TIMESTAMP '2025-11-12 12:05:27.384',
    TIMESTAMP '2025-11-12 12:05:27.384'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kerem-koc-2',
    'user-kerem-koc-16',
    'quiz-vue-bug-086',
    '{"codeQuality":85,"completionTime":819,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 20:16:08.877',
    TIMESTAMP '2025-11-09 20:16:08.877',
    TIMESTAMP '2025-11-09 20:16:08.877'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-086')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kerem-koc-3',
    'user-kerem-koc-16',
    'quiz-vue-test-005',
    '{"codeQuality":92,"completionTime":546,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-27 10:07:52.309',
    TIMESTAMP '2025-10-27 10:07:52.309',
    TIMESTAMP '2025-10-27 10:07:52.309'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kerem-koc-4',
    'user-kerem-koc-16',
    'quiz-rn-live-077',
    '{"codeQuality":80,"completionTime":1762,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 04:45:08.447',
    TIMESTAMP '2025-11-09 04:45:08.447',
    TIMESTAMP '2025-11-09 04:45:08.447'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-077')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-umut-kara-1',
    'user-umut-kara-17',
    'quiz-vue-bug-004',
    '{"codeQuality":91,"completionTime":1059,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 21:19:50.624',
    TIMESTAMP '2025-10-31 21:19:50.624',
    TIMESTAMP '2025-10-31 21:19:50.624'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-umut-kara-2',
    'user-umut-kara-17',
    'quiz-vue-test-036',
    '{"codeQuality":87,"completionTime":1380,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-20 12:30:40.255',
    TIMESTAMP '2025-10-20 12:30:40.255',
    TIMESTAMP '2025-10-20 12:30:40.255'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-036')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-umut-kara-3',
    'user-umut-kara-17',
    'quiz-rn-live-063',
    '{"codeQuality":95,"completionTime":358,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 00:27:54.618',
    TIMESTAMP '2025-10-31 00:27:54.618',
    TIMESTAMP '2025-10-31 00:27:54.618'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-umut-kara-4',
    'user-umut-kara-17',
    'quiz-rn-bug-079',
    '{"codeQuality":91,"completionTime":566,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-20 07:15:48.701',
    TIMESTAMP '2025-10-20 07:15:48.701',
    TIMESTAMP '2025-10-20 07:15:48.701'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-079')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-umut-kara-5',
    'user-umut-kara-17',
    'quiz-rn-test-082',
    '{"codeQuality":77,"completionTime":495,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 04:51:04.550',
    TIMESTAMP '2025-11-09 04:51:04.550',
    TIMESTAMP '2025-11-09 04:51:04.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-082')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-murat-aslan-1',
    'user-murat-aslan-18',
    'quiz-vue-test-024',
    '{"codeQuality":74,"completionTime":785,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 10:09:28.781',
    TIMESTAMP '2025-11-16 10:09:28.781',
    TIMESTAMP '2025-11-16 10:09:28.781'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-murat-aslan-2',
    'user-murat-aslan-18',
    'quiz-rn-live-060',
    '{"codeQuality":78,"completionTime":396,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 22:28:43.205',
    TIMESTAMP '2025-11-15 22:28:43.205',
    TIMESTAMP '2025-11-15 22:28:43.205'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-murat-aslan-3',
    'user-murat-aslan-18',
    'quiz-rn-bug-066',
    '{"codeQuality":86,"completionTime":393,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 23:15:03.880',
    TIMESTAMP '2025-11-15 23:15:03.880',
    TIMESTAMP '2025-11-15 23:15:03.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-murat-aslan-4',
    'user-murat-aslan-18',
    'quiz-rn-test-033',
    '{"codeQuality":72,"completionTime":983,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 23:10:54.070',
    TIMESTAMP '2025-11-15 23:10:54.070',
    TIMESTAMP '2025-11-15 23:10:54.070'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-murat-aslan-5',
    'user-murat-aslan-18',
    'quiz-java-live-030',
    '{"codeQuality":72,"completionTime":879,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 21:46:54.253',
    TIMESTAMP '2025-11-15 21:46:54.253',
    TIMESTAMP '2025-11-15 21:46:54.253'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-murat-aslan-6',
    'user-murat-aslan-18',
    'quiz-java-bug-060',
    '{"codeQuality":79,"completionTime":1282,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 00:38:32.419',
    TIMESTAMP '2025-11-16 00:38:32.419',
    TIMESTAMP '2025-11-16 00:38:32.419'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gokhan-kilic-1',
    'user-gokhan-kilic-19',
    'quiz-rn-live-073',
    '{"codeQuality":81,"completionTime":1593,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 19:32:18.901',
    TIMESTAMP '2025-11-10 19:32:18.901',
    TIMESTAMP '2025-11-10 19:32:18.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-073')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gokhan-kilic-2',
    'user-gokhan-kilic-19',
    'quiz-rn-bug-055',
    '{"codeQuality":81,"completionTime":1186,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 17:34:17.989',
    TIMESTAMP '2025-11-10 17:34:17.989',
    TIMESTAMP '2025-11-10 17:34:17.989'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gokhan-kilic-3',
    'user-gokhan-kilic-19',
    'quiz-rn-test-035',
    '{"codeQuality":77,"completionTime":1030,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 20:56:31.736',
    TIMESTAMP '2025-11-13 20:56:31.736',
    TIMESTAMP '2025-11-13 20:56:31.736'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gokhan-kilic-4',
    'user-gokhan-kilic-19',
    'quiz-java-live-070',
    '{"codeQuality":88,"completionTime":540,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 07:19:32.896',
    TIMESTAMP '2025-11-11 07:19:32.896',
    TIMESTAMP '2025-11-11 07:19:32.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gokhan-kilic-5',
    'user-gokhan-kilic-19',
    'quiz-java-bug-018',
    '{"codeQuality":86,"completionTime":952,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 06:25:14.629',
    TIMESTAMP '2025-11-16 06:25:14.629',
    TIMESTAMP '2025-11-16 06:25:14.629'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kaan-dogan-1',
    'user-kaan-dogan-20',
    'quiz-rn-bug-007',
    '{"codeQuality":86,"completionTime":465,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 00:22:46.996',
    TIMESTAMP '2025-11-06 00:22:46.996',
    TIMESTAMP '2025-11-06 00:22:46.996'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-007')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kaan-dogan-2',
    'user-kaan-dogan-20',
    'quiz-rn-test-063',
    '{"codeQuality":79,"completionTime":1515,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 05:08:57.498',
    TIMESTAMP '2025-11-12 05:08:57.498',
    TIMESTAMP '2025-11-12 05:08:57.498'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-063')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kaan-dogan-3',
    'user-kaan-dogan-20',
    'quiz-java-live-063',
    '{"codeQuality":90,"completionTime":318,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 12:52:20.673',
    TIMESTAMP '2025-11-15 12:52:20.673',
    TIMESTAMP '2025-11-15 12:52:20.673'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kaan-dogan-4',
    'user-kaan-dogan-20',
    'quiz-java-bug-063',
    '{"codeQuality":84,"completionTime":1773,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 13:40:41.584',
    TIMESTAMP '2025-11-07 13:40:41.584',
    TIMESTAMP '2025-11-07 13:40:41.584'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kaan-dogan-5',
    'user-kaan-dogan-20',
    'quiz-java-test-038',
    '{"codeQuality":70,"completionTime":348,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 12:07:22.875',
    TIMESTAMP '2025-11-13 12:07:22.875',
    TIMESTAMP '2025-11-13 12:07:22.875'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-038')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kaan-dogan-6',
    'user-kaan-dogan-20',
    'quiz-go-live-023',
    '{"codeQuality":79,"completionTime":1653,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 01:51:02.051',
    TIMESTAMP '2025-11-15 01:51:02.051',
    TIMESTAMP '2025-11-15 01:51:02.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-023')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-baran-arslan-1',
    'user-baran-arslan-21',
    'quiz-rn-test-080',
    '{"codeQuality":81,"completionTime":1241,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 04:41:06.029',
    TIMESTAMP '2025-11-06 04:41:06.029',
    TIMESTAMP '2025-11-06 04:41:06.029'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-baran-arslan-2',
    'user-baran-arslan-21',
    'quiz-java-live-016',
    '{"codeQuality":85,"completionTime":1406,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 12:54:17.085',
    TIMESTAMP '2025-11-07 12:54:17.085',
    TIMESTAMP '2025-11-07 12:54:17.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-baran-arslan-3',
    'user-baran-arslan-21',
    'quiz-java-bug-099',
    '{"codeQuality":93,"completionTime":643,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 10:25:33.655',
    TIMESTAMP '2025-11-14 10:25:33.655',
    TIMESTAMP '2025-11-14 10:25:33.655'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-bora-ozturk-1',
    'user-bora-ozturk-22',
    'quiz-java-live-054',
    '{"codeQuality":90,"completionTime":314,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 03:27:57.993',
    TIMESTAMP '2025-11-16 03:27:57.993',
    TIMESTAMP '2025-11-16 03:27:57.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-bora-ozturk-2',
    'user-bora-ozturk-22',
    'quiz-java-bug-050',
    '{"codeQuality":85,"completionTime":472,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 16:32:03.126',
    TIMESTAMP '2025-11-09 16:32:03.126',
    TIMESTAMP '2025-11-09 16:32:03.126'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-bora-ozturk-3',
    'user-bora-ozturk-22',
    'quiz-java-test-072',
    '{"codeQuality":81,"completionTime":581,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 00:01:58.359',
    TIMESTAMP '2025-11-10 00:01:58.359',
    TIMESTAMP '2025-11-10 00:01:58.359'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-bora-ozturk-4',
    'user-bora-ozturk-22',
    'quiz-go-live-001',
    '{"codeQuality":81,"completionTime":691,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 13:38:00.165',
    TIMESTAMP '2025-11-03 13:38:00.165',
    TIMESTAMP '2025-11-03 13:38:00.165'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-halil-aydin-1',
    'user-halil-aydin-23',
    'quiz-java-bug-090',
    '{"codeQuality":74,"completionTime":1537,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-27 15:20:39.604',
    TIMESTAMP '2025-10-27 15:20:39.604',
    TIMESTAMP '2025-10-27 15:20:39.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-090')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-halil-aydin-2',
    'user-halil-aydin-23',
    'quiz-java-test-096',
    '{"codeQuality":90,"completionTime":438,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 06:33:13.737',
    TIMESTAMP '2025-10-31 06:33:13.737',
    TIMESTAMP '2025-10-31 06:33:13.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-096')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-halil-aydin-3',
    'user-halil-aydin-23',
    'quiz-go-live-057',
    '{"codeQuality":79,"completionTime":961,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 00:55:18.682',
    TIMESTAMP '2025-11-06 00:55:18.682',
    TIMESTAMP '2025-11-06 00:55:18.682'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-halil-aydin-4',
    'user-halil-aydin-23',
    'quiz-go-bug-094',
    '{"codeQuality":92,"completionTime":1696,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-22 21:01:39.770',
    TIMESTAMP '2025-10-22 21:01:39.770',
    TIMESTAMP '2025-10-22 21:01:39.770'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-094')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-suat-yildirim-1',
    'user-suat-yildirim-24',
    'quiz-java-test-068',
    '{"codeQuality":74,"completionTime":1695,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 09:08:26.300',
    TIMESTAMP '2025-11-12 09:08:26.300',
    TIMESTAMP '2025-11-12 09:08:26.300'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-068')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-suat-yildirim-2',
    'user-suat-yildirim-24',
    'quiz-go-live-067',
    '{"codeQuality":79,"completionTime":1702,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 15:09:58.227',
    TIMESTAMP '2025-11-16 15:09:58.227',
    TIMESTAMP '2025-11-16 15:09:58.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-suat-yildirim-3',
    'user-suat-yildirim-24',
    'quiz-go-bug-062',
    '{"codeQuality":72,"completionTime":442,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 11:50:30.762',
    TIMESTAMP '2025-11-13 11:50:30.762',
    TIMESTAMP '2025-11-13 11:50:30.762'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-062')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-serkan-yildiz-1',
    'user-serkan-yildiz-25',
    'quiz-go-live-096',
    '{"codeQuality":78,"completionTime":1376,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 13:52:25.364',
    TIMESTAMP '2025-11-08 13:52:25.364',
    TIMESTAMP '2025-11-08 13:52:25.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-096')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-serkan-yildiz-2',
    'user-serkan-yildiz-25',
    'quiz-go-bug-064',
    '{"codeQuality":70,"completionTime":647,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 04:27:45.945',
    TIMESTAMP '2025-11-09 04:27:45.945',
    TIMESTAMP '2025-11-09 04:27:45.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-serkan-yildiz-3',
    'user-serkan-yildiz-25',
    'quiz-go-test-013',
    '{"codeQuality":78,"completionTime":710,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 13:50:17.267',
    TIMESTAMP '2025-11-12 13:50:17.267',
    TIMESTAMP '2025-11-12 13:50:17.267'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-serkan-yildiz-4',
    'user-serkan-yildiz-25',
    'quiz-dotnet-live-088',
    '{"codeQuality":75,"completionTime":1437,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 17:33:55.168',
    TIMESTAMP '2025-11-13 17:33:55.168',
    TIMESTAMP '2025-11-13 17:33:55.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-088')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-berk-celik-1',
    'user-berk-celik-26',
    'quiz-go-bug-001',
    '{"codeQuality":94,"completionTime":1617,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 04:01:39.813',
    TIMESTAMP '2025-11-13 04:01:39.813',
    TIMESTAMP '2025-11-13 04:01:39.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-berk-celik-2',
    'user-berk-celik-26',
    'quiz-go-test-081',
    '{"codeQuality":93,"completionTime":1285,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 05:37:39.408',
    TIMESTAMP '2025-11-03 05:37:39.408',
    TIMESTAMP '2025-11-03 05:37:39.408'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-berk-celik-3',
    'user-berk-celik-26',
    'quiz-dotnet-live-056',
    '{"codeQuality":76,"completionTime":1748,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 17:26:01.536',
    TIMESTAMP '2025-11-06 17:26:01.536',
    TIMESTAMP '2025-11-06 17:26:01.536'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-056')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-berk-celik-4',
    'user-berk-celik-26',
    'quiz-dotnet-bug-066',
    '{"codeQuality":80,"completionTime":1774,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 20:06:09.758',
    TIMESTAMP '2025-11-05 20:06:09.758',
    TIMESTAMP '2025-11-05 20:06:09.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-berk-celik-5',
    'user-berk-celik-26',
    'quiz-dotnet-test-010',
    '{"codeQuality":93,"completionTime":1282,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-20 14:12:36.813',
    TIMESTAMP '2025-10-20 14:12:36.813',
    TIMESTAMP '2025-10-20 14:12:36.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mert-sahin-1',
    'user-mert-sahin-27',
    'quiz-go-test-083',
    '{"codeQuality":88,"completionTime":1306,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 15:49:52.097',
    TIMESTAMP '2025-11-11 15:49:52.097',
    TIMESTAMP '2025-11-11 15:49:52.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-083')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mert-sahin-2',
    'user-mert-sahin-27',
    'quiz-dotnet-live-054',
    '{"codeQuality":72,"completionTime":470,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 00:50:43.369',
    TIMESTAMP '2025-11-11 00:50:43.369',
    TIMESTAMP '2025-11-11 00:50:43.369'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mert-sahin-3',
    'user-mert-sahin-27',
    'quiz-dotnet-bug-045',
    '{"codeQuality":85,"completionTime":1689,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 02:55:12.815',
    TIMESTAMP '2025-11-10 02:55:12.815',
    TIMESTAMP '2025-11-10 02:55:12.815'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mert-sahin-4',
    'user-mert-sahin-27',
    'quiz-dotnet-test-081',
    '{"codeQuality":87,"completionTime":332,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 00:38:34.749',
    TIMESTAMP '2025-11-07 00:38:34.749',
    TIMESTAMP '2025-11-07 00:38:34.749'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mert-sahin-5',
    'user-mert-sahin-27',
    'quiz-react-adv-live-020',
    '{"codeQuality":73,"completionTime":852,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 03:50:34.848',
    TIMESTAMP '2025-11-09 03:50:34.848',
    TIMESTAMP '2025-11-09 03:50:34.848'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mert-sahin-6',
    'user-mert-sahin-27',
    'quiz-react-adv-bug-002',
    '{"codeQuality":82,"completionTime":1362,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 04:52:18.007',
    TIMESTAMP '2025-11-15 04:52:18.007',
    TIMESTAMP '2025-11-15 04:52:18.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kadir-demir-1',
    'user-kadir-demir-28',
    'quiz-dotnet-live-012',
    '{"codeQuality":79,"completionTime":1349,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 05:26:13.727',
    TIMESTAMP '2025-11-04 05:26:13.727',
    TIMESTAMP '2025-11-04 05:26:13.727'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kadir-demir-2',
    'user-kadir-demir-28',
    'quiz-dotnet-bug-024',
    '{"codeQuality":93,"completionTime":477,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 22:33:28.148',
    TIMESTAMP '2025-11-04 22:33:28.148',
    TIMESTAMP '2025-11-04 22:33:28.148'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kadir-demir-3',
    'user-kadir-demir-28',
    'quiz-dotnet-test-088',
    '{"codeQuality":74,"completionTime":1697,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 08:27:45.013',
    TIMESTAMP '2025-11-16 08:27:45.013',
    TIMESTAMP '2025-11-16 08:27:45.013'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kadir-demir-4',
    'user-kadir-demir-28',
    'quiz-react-adv-live-026',
    '{"codeQuality":75,"completionTime":397,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 11:10:49.132',
    TIMESTAMP '2025-11-08 11:10:49.132',
    TIMESTAMP '2025-11-08 11:10:49.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-026')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kadir-demir-5',
    'user-kadir-demir-28',
    'quiz-react-adv-bug-010',
    '{"codeQuality":86,"completionTime":960,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 16:25:02.050',
    TIMESTAMP '2025-11-02 16:25:02.050',
    TIMESTAMP '2025-11-02 16:25:02.050'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-furkan-kaya-1',
    'user-furkan-kaya-29',
    'quiz-dotnet-bug-019',
    '{"codeQuality":94,"completionTime":1626,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 07:59:20.239',
    TIMESTAMP '2025-11-16 07:59:20.239',
    TIMESTAMP '2025-11-16 07:59:20.239'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-furkan-kaya-2',
    'user-furkan-kaya-29',
    'quiz-dotnet-test-071',
    '{"codeQuality":79,"completionTime":424,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 08:34:55.805',
    TIMESTAMP '2025-11-08 08:34:55.805',
    TIMESTAMP '2025-11-08 08:34:55.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-furkan-kaya-3',
    'user-furkan-kaya-29',
    'quiz-react-adv-live-035',
    '{"codeQuality":71,"completionTime":1751,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 18:40:21.929',
    TIMESTAMP '2025-11-09 18:40:21.929',
    TIMESTAMP '2025-11-09 18:40:21.929'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-furkan-kaya-4',
    'user-furkan-kaya-29',
    'quiz-react-adv-bug-020',
    '{"codeQuality":83,"completionTime":1528,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 10:58:22.051',
    TIMESTAMP '2025-11-13 10:58:22.051',
    TIMESTAMP '2025-11-13 10:58:22.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-furkan-kaya-5',
    'user-furkan-kaya-29',
    'quiz-react-adv-test-024',
    '{"codeQuality":89,"completionTime":988,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 16:09:51.331',
    TIMESTAMP '2025-11-11 16:09:51.331',
    TIMESTAMP '2025-11-11 16:09:51.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cagri-yilmaz-1',
    'user-cagri-yilmaz-30',
    'quiz-dotnet-test-056',
    '{"codeQuality":74,"completionTime":504,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 07:35:02.215',
    TIMESTAMP '2025-11-01 07:35:02.215',
    TIMESTAMP '2025-11-01 07:35:02.215'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cagri-yilmaz-2',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-live-040',
    '{"codeQuality":71,"completionTime":666,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 00:14:53.494',
    TIMESTAMP '2025-11-15 00:14:53.494',
    TIMESTAMP '2025-11-15 00:14:53.494'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cagri-yilmaz-3',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-bug-002',
    '{"codeQuality":92,"completionTime":381,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-27 03:41:31.396',
    TIMESTAMP '2025-10-27 03:41:31.396',
    TIMESTAMP '2025-10-27 03:41:31.396'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cagri-yilmaz-4',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-test-028',
    '{"codeQuality":76,"completionTime":830,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 13:13:35.296',
    TIMESTAMP '2025-10-31 13:13:35.296',
    TIMESTAMP '2025-10-31 13:13:35.296'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cagri-yilmaz-5',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-live-024',
    '{"codeQuality":73,"completionTime":702,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-24 18:54:31.717',
    TIMESTAMP '2025-10-24 18:54:31.717',
    TIMESTAMP '2025-10-24 18:54:31.717'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cagri-yilmaz-6',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-bug-037',
    '{"codeQuality":95,"completionTime":971,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 16:35:05.917',
    TIMESTAMP '2025-11-12 16:35:05.917',
    TIMESTAMP '2025-11-12 16:35:05.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-oz-1',
    'user-mehmet-oz-31',
    'quiz-react-adv-live-002',
    '{"codeQuality":82,"completionTime":1529,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 20:35:46.410',
    TIMESTAMP '2025-11-13 20:35:46.410',
    TIMESTAMP '2025-11-13 20:35:46.410'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-oz-2',
    'user-mehmet-oz-31',
    'quiz-react-adv-bug-002',
    '{"codeQuality":92,"completionTime":447,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 19:31:15.247',
    TIMESTAMP '2025-11-14 19:31:15.247',
    TIMESTAMP '2025-11-14 19:31:15.247'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-oz-3',
    'user-mehmet-oz-31',
    'quiz-react-adv-test-041',
    '{"codeQuality":80,"completionTime":746,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 07:14:18.604',
    TIMESTAMP '2025-11-11 07:14:18.604',
    TIMESTAMP '2025-11-11 07:14:18.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-041')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-oz-4',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-live-012',
    '{"codeQuality":76,"completionTime":1460,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 04:01:55.097',
    TIMESTAMP '2025-11-12 04:01:55.097',
    TIMESTAMP '2025-11-12 04:01:55.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-oz-5',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-bug-011',
    '{"codeQuality":85,"completionTime":669,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 15:06:24.405',
    TIMESTAMP '2025-11-09 15:06:24.405',
    TIMESTAMP '2025-11-09 15:06:24.405'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mehmet-oz-6',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-test-023',
    '{"codeQuality":86,"completionTime":1568,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 10:48:02.406',
    TIMESTAMP '2025-11-14 10:48:02.406',
    TIMESTAMP '2025-11-14 10:48:02.406'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-gokmen-1',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-bug-010',
    '{"codeQuality":93,"completionTime":1418,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-27 02:54:11.012',
    TIMESTAMP '2025-10-27 02:54:11.012',
    TIMESTAMP '2025-10-27 02:54:11.012'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-gokmen-2',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-test-022',
    '{"codeQuality":89,"completionTime":496,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 23:58:28.855',
    TIMESTAMP '2025-11-01 23:58:28.855',
    TIMESTAMP '2025-11-01 23:58:28.855'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-gokmen-3',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-live-001',
    '{"codeQuality":80,"completionTime":1455,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 03:46:06.834',
    TIMESTAMP '2025-11-13 03:46:06.834',
    TIMESTAMP '2025-11-13 03:46:06.834'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-gokmen-4',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-bug-015',
    '{"codeQuality":84,"completionTime":426,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 05:15:49.729',
    TIMESTAMP '2025-11-01 05:15:49.729',
    TIMESTAMP '2025-11-01 05:15:49.729'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ahmet-gokmen-5',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-test-002',
    '{"codeQuality":80,"completionTime":1341,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-30 14:04:35.777',
    TIMESTAMP '2025-10-30 14:04:35.777',
    TIMESTAMP '2025-10-30 14:04:35.777'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-kuzu-1',
    'user-mustafa-kuzu-33',
    'quiz-react-adv-test-018',
    '{"codeQuality":75,"completionTime":679,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 18:09:19.331',
    TIMESTAMP '2025-11-13 18:09:19.331',
    TIMESTAMP '2025-11-13 18:09:19.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-kuzu-2',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-live-050',
    '{"codeQuality":84,"completionTime":632,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 00:29:54.251',
    TIMESTAMP '2025-11-15 00:29:54.251',
    TIMESTAMP '2025-11-15 00:29:54.251'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-kuzu-3',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-bug-047',
    '{"codeQuality":91,"completionTime":1117,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 11:58:57.387',
    TIMESTAMP '2025-11-11 11:58:57.387',
    TIMESTAMP '2025-11-11 11:58:57.387'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-047')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-mustafa-kuzu-4',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-test-003',
    '{"codeQuality":91,"completionTime":1056,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 18:33:50.509',
    TIMESTAMP '2025-11-13 18:33:50.509',
    TIMESTAMP '2025-11-13 18:33:50.509'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-huseyin-karaca-1',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-live-016',
    '{"codeQuality":70,"completionTime":1129,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 23:38:46.789',
    TIMESTAMP '2025-11-07 23:38:46.789',
    TIMESTAMP '2025-11-07 23:38:46.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-huseyin-karaca-2',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-bug-013',
    '{"codeQuality":85,"completionTime":718,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 12:04:42.789',
    TIMESTAMP '2025-11-15 12:04:42.789',
    TIMESTAMP '2025-11-15 12:04:42.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-013')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-huseyin-karaca-3',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-test-045',
    '{"codeQuality":70,"completionTime":419,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 14:09:27.628',
    TIMESTAMP '2025-11-09 14:09:27.628',
    TIMESTAMP '2025-11-09 14:09:27.628'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-huseyin-karaca-4',
    'user-huseyin-karaca-34',
    'quiz-node-adv-live-039',
    '{"codeQuality":94,"completionTime":1048,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 11:13:34.907',
    TIMESTAMP '2025-11-11 11:13:34.907',
    TIMESTAMP '2025-11-11 11:13:34.907'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-emre-duman-1',
    'user-emre-duman-35',
    'quiz-flutter-adv-bug-019',
    '{"codeQuality":73,"completionTime":1445,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 00:32:33.775',
    TIMESTAMP '2025-11-02 00:32:33.775',
    TIMESTAMP '2025-11-02 00:32:33.775'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-emre-duman-2',
    'user-emre-duman-35',
    'quiz-flutter-adv-test-034',
    '{"codeQuality":86,"completionTime":360,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 21:43:10.822',
    TIMESTAMP '2025-11-08 21:43:10.822',
    TIMESTAMP '2025-11-08 21:43:10.822'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-emre-duman-3',
    'user-emre-duman-35',
    'quiz-node-adv-live-031',
    '{"codeQuality":73,"completionTime":615,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 05:53:04.969',
    TIMESTAMP '2025-10-31 05:53:04.969',
    TIMESTAMP '2025-10-31 05:53:04.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-oztuna-1',
    'user-burak-oztuna-36',
    'quiz-flutter-adv-test-047',
    '{"codeQuality":79,"completionTime":527,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 03:53:07.829',
    TIMESTAMP '2025-11-12 03:53:07.829',
    TIMESTAMP '2025-11-12 03:53:07.829'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-oztuna-2',
    'user-burak-oztuna-36',
    'quiz-node-adv-live-045',
    '{"codeQuality":89,"completionTime":705,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 02:29:17.441',
    TIMESTAMP '2025-11-13 02:29:17.441',
    TIMESTAMP '2025-11-13 02:29:17.441'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-045')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-burak-oztuna-3',
    'user-burak-oztuna-36',
    'quiz-node-adv-bug-037',
    '{"codeQuality":76,"completionTime":838,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 13:37:07.616',
    TIMESTAMP '2025-10-31 13:37:07.616',
    TIMESTAMP '2025-10-31 13:37:07.616'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-derya-toprak-1',
    'user-derya-toprak-37',
    'quiz-node-adv-live-021',
    '{"codeQuality":70,"completionTime":479,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 15:46:00.768',
    TIMESTAMP '2025-11-15 15:46:00.768',
    TIMESTAMP '2025-11-15 15:46:00.768'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-derya-toprak-2',
    'user-derya-toprak-37',
    'quiz-node-adv-bug-021',
    '{"codeQuality":84,"completionTime":1296,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 15:17:45.890',
    TIMESTAMP '2025-11-16 15:17:45.890',
    TIMESTAMP '2025-11-16 15:17:45.890'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-derya-toprak-3',
    'user-derya-toprak-37',
    'quiz-node-adv-test-011',
    '{"codeQuality":87,"completionTime":1216,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 02:57:12.173',
    TIMESTAMP '2025-11-16 02:57:12.173',
    TIMESTAMP '2025-11-16 02:57:12.173'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-bayrak-1',
    'user-gizem-bayrak-38',
    'quiz-node-adv-bug-036',
    '{"codeQuality":73,"completionTime":1710,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-24 02:19:21.969',
    TIMESTAMP '2025-10-24 02:19:21.969',
    TIMESTAMP '2025-10-24 02:19:21.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-bayrak-2',
    'user-gizem-bayrak-38',
    'quiz-node-adv-test-034',
    '{"codeQuality":86,"completionTime":372,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-23 19:55:25.007',
    TIMESTAMP '2025-10-23 19:55:25.007',
    TIMESTAMP '2025-10-23 19:55:25.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-bayrak-3',
    'user-gizem-bayrak-38',
    'quiz-python-adv-live-009',
    '{"codeQuality":82,"completionTime":1639,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-24 12:06:51.810',
    TIMESTAMP '2025-10-24 12:06:51.810',
    TIMESTAMP '2025-10-24 12:06:51.810'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-bayrak-4',
    'user-gizem-bayrak-38',
    'quiz-python-adv-bug-046',
    '{"codeQuality":70,"completionTime":371,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 14:10:38.376',
    TIMESTAMP '2025-11-08 14:10:38.376',
    TIMESTAMP '2025-11-08 14:10:38.376'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-046')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-bayrak-5',
    'user-gizem-bayrak-38',
    'quiz-python-adv-test-001',
    '{"codeQuality":95,"completionTime":698,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-27 10:38:45.451',
    TIMESTAMP '2025-10-27 10:38:45.451',
    TIMESTAMP '2025-10-27 10:38:45.451'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-erdogdu-1',
    'user-busra-erdogdu-39',
    'quiz-node-adv-test-018',
    '{"codeQuality":95,"completionTime":1541,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 23:28:21.361',
    TIMESTAMP '2025-11-15 23:28:21.361',
    TIMESTAMP '2025-11-15 23:28:21.361'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-erdogdu-2',
    'user-busra-erdogdu-39',
    'quiz-python-adv-live-016',
    '{"codeQuality":92,"completionTime":606,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 18:24:34.533',
    TIMESTAMP '2025-11-15 18:24:34.533',
    TIMESTAMP '2025-11-15 18:24:34.533'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-erdogdu-3',
    'user-busra-erdogdu-39',
    'quiz-python-adv-bug-018',
    '{"codeQuality":70,"completionTime":514,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 12:51:35.530',
    TIMESTAMP '2025-11-16 12:51:35.530',
    TIMESTAMP '2025-11-16 12:51:35.530'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-erdogdu-4',
    'user-busra-erdogdu-39',
    'quiz-python-adv-test-045',
    '{"codeQuality":87,"completionTime":1782,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 08:15:05.271',
    TIMESTAMP '2025-11-16 08:15:05.271',
    TIMESTAMP '2025-11-16 08:15:05.271'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-erdogdu-5',
    'user-busra-erdogdu-39',
    'quiz-react-live-057',
    '{"codeQuality":85,"completionTime":468,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 00:03:50.671',
    TIMESTAMP '2025-11-15 00:03:50.671',
    TIMESTAMP '2025-11-15 00:03:50.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-ozkan-1',
    'user-sibel-ozkan-40',
    'quiz-python-adv-live-015',
    '{"codeQuality":72,"completionTime":445,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 05:48:14.731',
    TIMESTAMP '2025-11-13 05:48:14.731',
    TIMESTAMP '2025-11-13 05:48:14.731'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-015')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-ozkan-2',
    'user-sibel-ozkan-40',
    'quiz-python-adv-bug-032',
    '{"codeQuality":95,"completionTime":437,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-24 06:36:50.060',
    TIMESTAMP '2025-10-24 06:36:50.060',
    TIMESTAMP '2025-10-24 06:36:50.060'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-032')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-ozkan-3',
    'user-sibel-ozkan-40',
    'quiz-python-adv-test-042',
    '{"codeQuality":90,"completionTime":1682,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 10:45:04.045',
    TIMESTAMP '2025-11-10 10:45:04.045',
    TIMESTAMP '2025-11-10 10:45:04.045'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-042')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-ozkan-4',
    'user-sibel-ozkan-40',
    'quiz-react-live-038',
    '{"codeQuality":80,"completionTime":478,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 01:52:48.102',
    TIMESTAMP '2025-11-08 01:52:48.102',
    TIMESTAMP '2025-11-08 01:52:48.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-ozkan-5',
    'user-sibel-ozkan-40',
    'quiz-react-bug-054',
    '{"codeQuality":81,"completionTime":1449,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 06:51:20.314',
    TIMESTAMP '2025-11-09 06:51:20.314',
    TIMESTAMP '2025-11-09 06:51:20.314'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-054')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ece-ucar-1',
    'user-ece-ucar-41',
    'quiz-python-adv-bug-015',
    '{"codeQuality":94,"completionTime":577,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 11:41:26.319',
    TIMESTAMP '2025-11-09 11:41:26.319',
    TIMESTAMP '2025-11-09 11:41:26.319'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ece-ucar-2',
    'user-ece-ucar-41',
    'quiz-python-adv-test-047',
    '{"codeQuality":71,"completionTime":761,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 22:10:13.597',
    TIMESTAMP '2025-11-11 22:10:13.597',
    TIMESTAMP '2025-11-11 22:10:13.597'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ece-ucar-3',
    'user-ece-ucar-41',
    'quiz-react-live-047',
    '{"codeQuality":84,"completionTime":1074,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 05:26:17.127',
    TIMESTAMP '2025-11-14 05:26:17.127',
    TIMESTAMP '2025-11-14 05:26:17.127'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-pelin-bal-1',
    'user-pelin-bal-42',
    'quiz-python-adv-test-034',
    '{"codeQuality":82,"completionTime":1159,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 19:22:05.487',
    TIMESTAMP '2025-11-14 19:22:05.487',
    TIMESTAMP '2025-11-14 19:22:05.487'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-pelin-bal-2',
    'user-pelin-bal-42',
    'quiz-react-live-060',
    '{"codeQuality":72,"completionTime":733,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 20:32:07.630',
    TIMESTAMP '2025-11-14 20:32:07.630',
    TIMESTAMP '2025-11-14 20:32:07.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-pelin-bal-3',
    'user-pelin-bal-42',
    'quiz-react-bug-055',
    '{"codeQuality":77,"completionTime":804,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 16:05:17.463',
    TIMESTAMP '2025-11-09 16:05:17.463',
    TIMESTAMP '2025-11-09 16:05:17.463'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-karaaslan-1',
    'user-hande-karaaslan-43',
    'quiz-react-live-062',
    '{"codeQuality":81,"completionTime":944,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 22:24:31.942',
    TIMESTAMP '2025-11-05 22:24:31.942',
    TIMESTAMP '2025-11-05 22:24:31.942'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-062')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-karaaslan-2',
    'user-hande-karaaslan-43',
    'quiz-react-bug-009',
    '{"codeQuality":86,"completionTime":1501,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 20:20:56.423',
    TIMESTAMP '2025-11-04 20:20:56.423',
    TIMESTAMP '2025-11-04 20:20:56.423'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-009')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-karaaslan-3',
    'user-hande-karaaslan-43',
    'quiz-react-test-061',
    '{"codeQuality":86,"completionTime":1329,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 23:59:17.956',
    TIMESTAMP '2025-11-07 23:59:17.956',
    TIMESTAMP '2025-11-07 23:59:17.956'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-061')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-karaaslan-4',
    'user-hande-karaaslan-43',
    'quiz-flutter-live-005',
    '{"codeQuality":73,"completionTime":1175,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 07:23:36.347',
    TIMESTAMP '2025-11-11 07:23:36.347',
    TIMESTAMP '2025-11-11 07:23:36.347'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-005')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-karaaslan-5',
    'user-hande-karaaslan-43',
    'quiz-flutter-bug-021',
    '{"codeQuality":72,"completionTime":926,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 23:18:47.234',
    TIMESTAMP '2025-11-11 23:18:47.234',
    TIMESTAMP '2025-11-11 23:18:47.234'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-karaaslan-6',
    'user-hande-karaaslan-43',
    'quiz-flutter-test-081',
    '{"codeQuality":93,"completionTime":311,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 10:02:03.934',
    TIMESTAMP '2025-11-04 10:02:03.934',
    TIMESTAMP '2025-11-04 10:02:03.934'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-dinc-1',
    'user-sevgi-dinc-44',
    'quiz-react-bug-039',
    '{"codeQuality":95,"completionTime":1170,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 13:43:23.596',
    TIMESTAMP '2025-10-31 13:43:23.596',
    TIMESTAMP '2025-10-31 13:43:23.596'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-039')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-dinc-2',
    'user-sevgi-dinc-44',
    'quiz-react-test-016',
    '{"codeQuality":90,"completionTime":1155,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 13:07:24.641',
    TIMESTAMP '2025-11-01 13:07:24.641',
    TIMESTAMP '2025-11-01 13:07:24.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-016')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-dinc-3',
    'user-sevgi-dinc-44',
    'quiz-flutter-live-069',
    '{"codeQuality":76,"completionTime":1642,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-28 16:49:21.331',
    TIMESTAMP '2025-10-28 16:49:21.331',
    TIMESTAMP '2025-10-28 16:49:21.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-069')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-dinc-4',
    'user-sevgi-dinc-44',
    'quiz-flutter-bug-093',
    '{"codeQuality":71,"completionTime":629,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 12:26:24.385',
    TIMESTAMP '2025-11-12 12:26:24.385',
    TIMESTAMP '2025-11-12 12:26:24.385'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-dinc-5',
    'user-sevgi-dinc-44',
    'quiz-flutter-test-066',
    '{"codeQuality":87,"completionTime":812,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 21:23:41.390',
    TIMESTAMP '2025-11-03 21:23:41.390',
    TIMESTAMP '2025-11-03 21:23:41.390'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-sezer-1',
    'user-i-rem-sezer-45',
    'quiz-react-test-060',
    '{"codeQuality":81,"completionTime":567,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 07:11:40.663',
    TIMESTAMP '2025-11-13 07:11:40.663',
    TIMESTAMP '2025-11-13 07:11:40.663'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-060')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-sezer-2',
    'user-i-rem-sezer-45',
    'quiz-flutter-live-020',
    '{"codeQuality":72,"completionTime":1446,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 08:17:04.097',
    TIMESTAMP '2025-11-03 08:17:04.097',
    TIMESTAMP '2025-11-03 08:17:04.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-sezer-3',
    'user-i-rem-sezer-45',
    'quiz-flutter-bug-084',
    '{"codeQuality":93,"completionTime":645,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 21:02:54.559',
    TIMESTAMP '2025-11-09 21:02:54.559',
    TIMESTAMP '2025-11-09 21:02:54.559'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-sezer-4',
    'user-i-rem-sezer-45',
    'quiz-flutter-test-072',
    '{"codeQuality":89,"completionTime":830,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 09:14:31.554',
    TIMESTAMP '2025-11-07 09:14:31.554',
    TIMESTAMP '2025-11-07 09:14:31.554'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-sezer-5',
    'user-i-rem-sezer-45',
    'quiz-node-live-089',
    '{"codeQuality":87,"completionTime":742,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 04:30:46.490',
    TIMESTAMP '2025-11-06 04:30:46.490',
    TIMESTAMP '2025-11-06 04:30:46.490'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-eren-1',
    'user-tugce-eren-46',
    'quiz-flutter-live-051',
    '{"codeQuality":87,"completionTime":918,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 17:48:17.836',
    TIMESTAMP '2025-11-02 17:48:17.836',
    TIMESTAMP '2025-11-02 17:48:17.836'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-eren-2',
    'user-tugce-eren-46',
    'quiz-flutter-bug-099',
    '{"codeQuality":72,"completionTime":584,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 23:20:33.924',
    TIMESTAMP '2025-11-15 23:20:33.924',
    TIMESTAMP '2025-11-15 23:20:33.924'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-eren-3',
    'user-tugce-eren-46',
    'quiz-flutter-test-088',
    '{"codeQuality":89,"completionTime":1314,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 21:01:17.302',
    TIMESTAMP '2025-11-05 21:01:17.302',
    TIMESTAMP '2025-11-05 21:01:17.302'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-eren-4',
    'user-tugce-eren-46',
    'quiz-node-live-019',
    '{"codeQuality":75,"completionTime":1242,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 10:21:59.895',
    TIMESTAMP '2025-11-08 10:21:59.895',
    TIMESTAMP '2025-11-08 10:21:59.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-eren-5',
    'user-tugce-eren-46',
    'quiz-node-bug-081',
    '{"codeQuality":76,"completionTime":1070,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 02:33:40.966',
    TIMESTAMP '2025-11-07 02:33:40.966',
    TIMESTAMP '2025-11-07 02:33:40.966'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-eren-6',
    'user-tugce-eren-46',
    'quiz-node-test-069',
    '{"codeQuality":82,"completionTime":1337,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 06:46:28.819',
    TIMESTAMP '2025-11-13 06:46:28.819',
    TIMESTAMP '2025-11-13 06:46:28.819'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-cetin-1',
    'user-asli-cetin-47',
    'quiz-flutter-bug-056',
    '{"codeQuality":83,"completionTime":923,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 13:36:56.845',
    TIMESTAMP '2025-11-10 13:36:56.845',
    TIMESTAMP '2025-11-10 13:36:56.845'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-056')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-cetin-2',
    'user-asli-cetin-47',
    'quiz-flutter-test-088',
    '{"codeQuality":87,"completionTime":1350,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 03:44:00.322',
    TIMESTAMP '2025-11-09 03:44:00.322',
    TIMESTAMP '2025-11-09 03:44:00.322'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-cetin-3',
    'user-asli-cetin-47',
    'quiz-node-live-021',
    '{"codeQuality":79,"completionTime":953,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 15:21:39.786',
    TIMESTAMP '2025-11-09 15:21:39.786',
    TIMESTAMP '2025-11-09 15:21:39.786'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nisan-ceylan-1',
    'user-nisan-ceylan-48',
    'quiz-flutter-test-033',
    '{"codeQuality":80,"completionTime":726,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 10:13:27.542',
    TIMESTAMP '2025-11-09 10:13:27.542',
    TIMESTAMP '2025-11-09 10:13:27.542'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nisan-ceylan-2',
    'user-nisan-ceylan-48',
    'quiz-node-live-094',
    '{"codeQuality":80,"completionTime":510,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 19:03:11.567',
    TIMESTAMP '2025-11-06 19:03:11.567',
    TIMESTAMP '2025-11-06 19:03:11.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-094')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nisan-ceylan-3',
    'user-nisan-ceylan-48',
    'quiz-node-bug-020',
    '{"codeQuality":71,"completionTime":1742,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 21:51:15.086',
    TIMESTAMP '2025-11-09 21:51:15.086',
    TIMESTAMP '2025-11-09 21:51:15.086'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nisan-ceylan-4',
    'user-nisan-ceylan-48',
    'quiz-node-test-029',
    '{"codeQuality":93,"completionTime":853,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 15:51:46.375',
    TIMESTAMP '2025-11-08 15:51:46.375',
    TIMESTAMP '2025-11-08 15:51:46.375'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-yalcin-1',
    'user-melis-yalcin-49',
    'quiz-node-live-050',
    '{"codeQuality":94,"completionTime":1632,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 08:31:40.455',
    TIMESTAMP '2025-11-05 08:31:40.455',
    TIMESTAMP '2025-11-05 08:31:40.455'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-yalcin-2',
    'user-melis-yalcin-49',
    'quiz-node-bug-060',
    '{"codeQuality":70,"completionTime":1052,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 03:38:41.211',
    TIMESTAMP '2025-11-08 03:38:41.211',
    TIMESTAMP '2025-11-08 03:38:41.211'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-yalcin-3',
    'user-melis-yalcin-49',
    'quiz-node-test-035',
    '{"codeQuality":93,"completionTime":1764,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 05:35:59.061',
    TIMESTAMP '2025-11-14 05:35:59.061',
    TIMESTAMP '2025-11-14 05:35:59.061'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-yalcin-4',
    'user-melis-yalcin-49',
    'quiz-python-live-004',
    '{"codeQuality":91,"completionTime":813,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 05:15:13.428',
    TIMESTAMP '2025-11-15 05:15:13.428',
    TIMESTAMP '2025-11-15 05:15:13.428'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-004')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-isik-1',
    'user-cansu-isik-50',
    'quiz-node-bug-059',
    '{"codeQuality":73,"completionTime":618,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 14:56:03.737',
    TIMESTAMP '2025-11-16 14:56:03.737',
    TIMESTAMP '2025-11-16 14:56:03.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-059')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-isik-2',
    'user-cansu-isik-50',
    'quiz-node-test-040',
    '{"codeQuality":78,"completionTime":1326,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 11:37:48.279',
    TIMESTAMP '2025-11-16 11:37:48.279',
    TIMESTAMP '2025-11-16 11:37:48.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-isik-3',
    'user-cansu-isik-50',
    'quiz-python-live-051',
    '{"codeQuality":75,"completionTime":1041,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 16:09:41.901',
    TIMESTAMP '2025-11-16 16:09:41.901',
    TIMESTAMP '2025-11-16 16:09:41.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-naz-keskin-1',
    'user-naz-keskin-51',
    'quiz-node-test-079',
    '{"codeQuality":87,"completionTime":1285,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 21:54:17.214',
    TIMESTAMP '2025-11-15 21:54:17.214',
    TIMESTAMP '2025-11-15 21:54:17.214'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-naz-keskin-2',
    'user-naz-keskin-51',
    'quiz-python-live-083',
    '{"codeQuality":70,"completionTime":341,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 04:01:56.290',
    TIMESTAMP '2025-11-16 04:01:56.290',
    TIMESTAMP '2025-11-16 04:01:56.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-naz-keskin-3',
    'user-naz-keskin-51',
    'quiz-python-bug-021',
    '{"codeQuality":79,"completionTime":1459,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 19:03:43.962',
    TIMESTAMP '2025-11-15 19:03:43.962',
    TIMESTAMP '2025-11-15 19:03:43.962'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-naz-keskin-4',
    'user-naz-keskin-51',
    'quiz-python-test-075',
    '{"codeQuality":91,"completionTime":638,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 13:40:24.351',
    TIMESTAMP '2025-11-15 13:40:24.351',
    TIMESTAMP '2025-11-15 13:40:24.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-075')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-naz-keskin-5',
    'user-naz-keskin-51',
    'quiz-angular-live-058',
    '{"codeQuality":79,"completionTime":472,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 05:44:07.944',
    TIMESTAMP '2025-11-16 05:44:07.944',
    TIMESTAMP '2025-11-16 05:44:07.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasemin-avci-1',
    'user-yasemin-avci-52',
    'quiz-python-live-078',
    '{"codeQuality":70,"completionTime":720,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 02:34:21.320',
    TIMESTAMP '2025-11-14 02:34:21.320',
    TIMESTAMP '2025-11-14 02:34:21.320'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasemin-avci-2',
    'user-yasemin-avci-52',
    'quiz-python-bug-034',
    '{"codeQuality":82,"completionTime":1160,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 08:33:13.593',
    TIMESTAMP '2025-11-16 08:33:13.593',
    TIMESTAMP '2025-11-16 08:33:13.593'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasemin-avci-3',
    'user-yasemin-avci-52',
    'quiz-python-test-009',
    '{"codeQuality":78,"completionTime":1329,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 20:50:19.839',
    TIMESTAMP '2025-11-08 20:50:19.839',
    TIMESTAMP '2025-11-08 20:50:19.839'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasemin-avci-4',
    'user-yasemin-avci-52',
    'quiz-angular-live-027',
    '{"codeQuality":92,"completionTime":699,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 18:41:21.273',
    TIMESTAMP '2025-11-15 18:41:21.273',
    TIMESTAMP '2025-11-15 18:41:21.273'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-027')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasemin-avci-5',
    'user-yasemin-avci-52',
    'quiz-angular-bug-050',
    '{"codeQuality":76,"completionTime":765,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 04:51:48.614',
    TIMESTAMP '2025-11-14 04:51:48.614',
    TIMESTAMP '2025-11-14 04:51:48.614'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-yasemin-avci-6',
    'user-yasemin-avci-52',
    'quiz-angular-test-003',
    '{"codeQuality":84,"completionTime":1431,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 01:49:05.895',
    TIMESTAMP '2025-11-02 01:49:05.895',
    TIMESTAMP '2025-11-02 01:49:05.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kubra-bulut-1',
    'user-kubra-bulut-53',
    'quiz-python-bug-077',
    '{"codeQuality":79,"completionTime":1453,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 06:26:08.351',
    TIMESTAMP '2025-11-15 06:26:08.351',
    TIMESTAMP '2025-11-15 06:26:08.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kubra-bulut-2',
    'user-kubra-bulut-53',
    'quiz-python-test-079',
    '{"codeQuality":95,"completionTime":1166,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 13:00:10.403',
    TIMESTAMP '2025-11-12 13:00:10.403',
    TIMESTAMP '2025-11-12 13:00:10.403'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kubra-bulut-3',
    'user-kubra-bulut-53',
    'quiz-angular-live-057',
    '{"codeQuality":74,"completionTime":1493,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 03:11:37.630',
    TIMESTAMP '2025-11-13 03:11:37.630',
    TIMESTAMP '2025-11-13 03:11:37.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-kubra-bulut-4',
    'user-kubra-bulut-53',
    'quiz-angular-bug-031',
    '{"codeQuality":71,"completionTime":1181,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 04:26:27.840',
    TIMESTAMP '2025-11-15 04:26:27.840',
    TIMESTAMP '2025-11-15 04:26:27.840'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-031')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nil-erdogan-1',
    'user-nil-erdogan-54',
    'quiz-python-test-069',
    '{"codeQuality":86,"completionTime":766,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 18:03:29.227',
    TIMESTAMP '2025-11-09 18:03:29.227',
    TIMESTAMP '2025-11-09 18:03:29.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nil-erdogan-2',
    'user-nil-erdogan-54',
    'quiz-angular-live-058',
    '{"codeQuality":95,"completionTime":1407,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-29 14:47:38.977',
    TIMESTAMP '2025-10-29 14:47:38.977',
    TIMESTAMP '2025-10-29 14:47:38.977'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nil-erdogan-3',
    'user-nil-erdogan-54',
    'quiz-angular-bug-083',
    '{"codeQuality":80,"completionTime":344,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 02:35:06.085',
    TIMESTAMP '2025-11-06 02:35:06.085',
    TIMESTAMP '2025-11-06 02:35:06.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-083')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gul-aksoy-1',
    'user-gul-aksoy-55',
    'quiz-angular-live-047',
    '{"codeQuality":72,"completionTime":910,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 23:22:50.967',
    TIMESTAMP '2025-11-15 23:22:50.967',
    TIMESTAMP '2025-11-15 23:22:50.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gul-aksoy-2',
    'user-gul-aksoy-55',
    'quiz-angular-bug-030',
    '{"codeQuality":94,"completionTime":913,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 00:47:22.959',
    TIMESTAMP '2025-11-16 00:47:22.959',
    TIMESTAMP '2025-11-16 00:47:22.959'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gul-aksoy-3',
    'user-gul-aksoy-55',
    'quiz-angular-test-085',
    '{"codeQuality":76,"completionTime":1675,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 20:06:01.506',
    TIMESTAMP '2025-11-15 20:06:01.506',
    TIMESTAMP '2025-11-15 20:06:01.506'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-085')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sena-bozkurt-1',
    'user-sena-bozkurt-56',
    'quiz-angular-bug-093',
    '{"codeQuality":93,"completionTime":1176,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 03:05:40.851',
    TIMESTAMP '2025-11-04 03:05:40.851',
    TIMESTAMP '2025-11-04 03:05:40.851'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sena-bozkurt-2',
    'user-sena-bozkurt-56',
    'quiz-angular-test-023',
    '{"codeQuality":77,"completionTime":1308,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 05:48:41.745',
    TIMESTAMP '2025-11-05 05:48:41.745',
    TIMESTAMP '2025-11-05 05:48:41.745'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sena-bozkurt-3',
    'user-sena-bozkurt-56',
    'quiz-vue-live-041',
    '{"codeQuality":72,"completionTime":397,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 11:28:42.401',
    TIMESTAMP '2025-11-12 11:28:42.401',
    TIMESTAMP '2025-11-12 11:28:42.401'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-041')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sena-bozkurt-4',
    'user-sena-bozkurt-56',
    'quiz-vue-bug-006',
    '{"codeQuality":91,"completionTime":1134,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 14:19:40.575',
    TIMESTAMP '2025-11-14 14:19:40.575',
    TIMESTAMP '2025-11-14 14:19:40.575'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-006')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-esra-gunes-1',
    'user-esra-gunes-57',
    'quiz-angular-test-074',
    '{"codeQuality":77,"completionTime":990,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 04:35:39.917',
    TIMESTAMP '2025-11-10 04:35:39.917',
    TIMESTAMP '2025-11-10 04:35:39.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-esra-gunes-2',
    'user-esra-gunes-57',
    'quiz-vue-live-053',
    '{"codeQuality":92,"completionTime":451,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 19:44:20.868',
    TIMESTAMP '2025-11-03 19:44:20.868',
    TIMESTAMP '2025-11-03 19:44:20.868'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-esra-gunes-3',
    'user-esra-gunes-57',
    'quiz-vue-bug-071',
    '{"codeQuality":91,"completionTime":839,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 22:18:42.944',
    TIMESTAMP '2025-11-03 22:18:42.944',
    TIMESTAMP '2025-11-03 22:18:42.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-071')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-esra-gunes-4',
    'user-esra-gunes-57',
    'quiz-vue-test-071',
    '{"codeQuality":77,"completionTime":1714,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 10:50:35.136',
    TIMESTAMP '2025-11-08 10:50:35.136',
    TIMESTAMP '2025-11-08 10:50:35.136'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hale-tas-1',
    'user-hale-tas-58',
    'quiz-vue-live-099',
    '{"codeQuality":87,"completionTime":1645,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 08:12:04.526',
    TIMESTAMP '2025-11-06 08:12:04.526',
    TIMESTAMP '2025-11-06 08:12:04.526'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-099')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hale-tas-2',
    'user-hale-tas-58',
    'quiz-vue-bug-084',
    '{"codeQuality":91,"completionTime":389,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 04:56:22.837',
    TIMESTAMP '2025-10-31 04:56:22.837',
    TIMESTAMP '2025-10-31 04:56:22.837'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hale-tas-3',
    'user-hale-tas-58',
    'quiz-vue-test-057',
    '{"codeQuality":78,"completionTime":1050,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-27 10:58:17.016',
    TIMESTAMP '2025-10-27 10:58:17.016',
    TIMESTAMP '2025-10-27 10:58:17.016'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-057')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hale-tas-4',
    'user-hale-tas-58',
    'quiz-rn-live-075',
    '{"codeQuality":88,"completionTime":691,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 13:01:38.612',
    TIMESTAMP '2025-11-12 13:01:38.612',
    TIMESTAMP '2025-11-12 13:01:38.612'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-075')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hale-tas-5',
    'user-hale-tas-58',
    'quiz-rn-bug-015',
    '{"codeQuality":94,"completionTime":1570,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 12:53:37.333',
    TIMESTAMP '2025-11-09 12:53:37.333',
    TIMESTAMP '2025-11-09 12:53:37.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hale-tas-6',
    'user-hale-tas-58',
    'quiz-rn-test-009',
    '{"codeQuality":77,"completionTime":807,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 11:55:31.744',
    TIMESTAMP '2025-11-12 11:55:31.744',
    TIMESTAMP '2025-11-12 11:55:31.744'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-selin-tekin-1',
    'user-selin-tekin-59',
    'quiz-vue-bug-092',
    '{"codeQuality":92,"completionTime":1750,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 05:06:47.400',
    TIMESTAMP '2025-11-13 05:06:47.400',
    TIMESTAMP '2025-11-13 05:06:47.400'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-092')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-selin-tekin-2',
    'user-selin-tekin-59',
    'quiz-vue-test-011',
    '{"codeQuality":95,"completionTime":1259,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 06:52:18.334',
    TIMESTAMP '2025-11-14 06:52:18.334',
    TIMESTAMP '2025-11-14 06:52:18.334'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-selin-tekin-3',
    'user-selin-tekin-59',
    'quiz-rn-live-052',
    '{"codeQuality":76,"completionTime":1783,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 15:32:28.904',
    TIMESTAMP '2025-11-13 15:32:28.904',
    TIMESTAMP '2025-11-13 15:32:28.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-052')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gonca-sari-1',
    'user-gonca-sari-60',
    'quiz-vue-test-027',
    '{"codeQuality":94,"completionTime":1357,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 03:49:34.286',
    TIMESTAMP '2025-11-02 03:49:34.286',
    TIMESTAMP '2025-11-02 03:49:34.286'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-027')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gonca-sari-2',
    'user-gonca-sari-60',
    'quiz-rn-live-083',
    '{"codeQuality":81,"completionTime":1304,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-03 06:05:42.641',
    TIMESTAMP '2025-11-03 06:05:42.641',
    TIMESTAMP '2025-11-03 06:05:42.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gonca-sari-3',
    'user-gonca-sari-60',
    'quiz-rn-bug-051',
    '{"codeQuality":81,"completionTime":984,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 17:13:37.766',
    TIMESTAMP '2025-11-13 17:13:37.766',
    TIMESTAMP '2025-11-13 17:13:37.766'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-051')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ayse-kaplan-1',
    'user-ayse-kaplan-61',
    'quiz-rn-live-002',
    '{"codeQuality":90,"completionTime":1600,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 15:54:39.778',
    TIMESTAMP '2025-11-11 15:54:39.778',
    TIMESTAMP '2025-11-11 15:54:39.778'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ayse-kaplan-2',
    'user-ayse-kaplan-61',
    'quiz-rn-bug-097',
    '{"codeQuality":85,"completionTime":1299,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 03:25:46.142',
    TIMESTAMP '2025-11-10 03:25:46.142',
    TIMESTAMP '2025-11-10 03:25:46.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ayse-kaplan-3',
    'user-ayse-kaplan-61',
    'quiz-rn-test-001',
    '{"codeQuality":79,"completionTime":648,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-29 00:34:51.556',
    TIMESTAMP '2025-10-29 00:34:51.556',
    TIMESTAMP '2025-10-29 00:34:51.556'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ayse-kaplan-4',
    'user-ayse-kaplan-61',
    'quiz-java-live-014',
    '{"codeQuality":83,"completionTime":622,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 09:22:33.904',
    TIMESTAMP '2025-11-14 09:22:33.904',
    TIMESTAMP '2025-11-14 09:22:33.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-zeynep-ozcan-1',
    'user-zeynep-ozcan-62',
    'quiz-rn-bug-001',
    '{"codeQuality":76,"completionTime":1067,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 05:11:23.132',
    TIMESTAMP '2025-11-05 05:11:23.132',
    TIMESTAMP '2025-11-05 05:11:23.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-zeynep-ozcan-2',
    'user-zeynep-ozcan-62',
    'quiz-rn-test-056',
    '{"codeQuality":70,"completionTime":1159,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 19:20:49.360',
    TIMESTAMP '2025-11-13 19:20:49.360',
    TIMESTAMP '2025-11-13 19:20:49.360'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-zeynep-ozcan-3',
    'user-zeynep-ozcan-62',
    'quiz-java-live-067',
    '{"codeQuality":90,"completionTime":1437,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 06:30:07.279',
    TIMESTAMP '2025-11-09 06:30:07.279',
    TIMESTAMP '2025-11-09 06:30:07.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-elif-polat-1',
    'user-elif-polat-63',
    'quiz-rn-test-098',
    '{"codeQuality":73,"completionTime":888,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 14:29:51.767',
    TIMESTAMP '2025-11-16 14:29:51.767',
    TIMESTAMP '2025-11-16 14:29:51.767'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-elif-polat-2',
    'user-elif-polat-63',
    'quiz-java-live-031',
    '{"codeQuality":82,"completionTime":1066,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 14:30:29.163',
    TIMESTAMP '2025-11-15 14:30:29.163',
    TIMESTAMP '2025-11-15 14:30:29.163'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-elif-polat-3',
    'user-elif-polat-63',
    'quiz-java-bug-049',
    '{"codeQuality":79,"completionTime":375,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 03:27:19.315',
    TIMESTAMP '2025-11-11 03:27:19.315',
    TIMESTAMP '2025-11-11 03:27:19.315'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-049')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-elif-polat-4',
    'user-elif-polat-63',
    'quiz-java-test-044',
    '{"codeQuality":77,"completionTime":1531,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 06:22:28.538',
    TIMESTAMP '2025-11-07 06:22:28.538',
    TIMESTAMP '2025-11-07 06:22:28.538'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-044')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-elif-polat-5',
    'user-elif-polat-63',
    'quiz-go-live-040',
    '{"codeQuality":73,"completionTime":641,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 02:08:05.066',
    TIMESTAMP '2025-11-10 02:08:05.066',
    TIMESTAMP '2025-11-10 02:08:05.066'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-elif-polat-6',
    'user-elif-polat-63',
    'quiz-go-bug-022',
    '{"codeQuality":82,"completionTime":1597,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 18:28:37.464',
    TIMESTAMP '2025-11-10 18:28:37.464',
    TIMESTAMP '2025-11-10 18:28:37.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-022')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-fatma-ozdemir-1',
    'user-fatma-ozdemir-64',
    'quiz-java-live-030',
    '{"codeQuality":73,"completionTime":739,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 02:09:53.433',
    TIMESTAMP '2025-11-13 02:09:53.433',
    TIMESTAMP '2025-11-13 02:09:53.433'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-fatma-ozdemir-2',
    'user-fatma-ozdemir-64',
    'quiz-java-bug-045',
    '{"codeQuality":95,"completionTime":1435,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 15:39:04.285',
    TIMESTAMP '2025-11-07 15:39:04.285',
    TIMESTAMP '2025-11-07 15:39:04.285'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-fatma-ozdemir-3',
    'user-fatma-ozdemir-64',
    'quiz-java-test-013',
    '{"codeQuality":95,"completionTime":1654,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 01:59:13.631',
    TIMESTAMP '2025-11-08 01:59:13.631',
    TIMESTAMP '2025-11-08 01:59:13.631'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-fatma-ozdemir-4',
    'user-fatma-ozdemir-64',
    'quiz-go-live-043',
    '{"codeQuality":78,"completionTime":1748,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 11:38:19.445',
    TIMESTAMP '2025-11-12 11:38:19.445',
    TIMESTAMP '2025-11-12 11:38:19.445'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-043')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-fatma-ozdemir-5',
    'user-fatma-ozdemir-64',
    'quiz-go-bug-015',
    '{"codeQuality":70,"completionTime":649,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 09:44:06.095',
    TIMESTAMP '2025-11-09 09:44:06.095',
    TIMESTAMP '2025-11-09 09:44:06.095'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-fatma-ozdemir-6',
    'user-fatma-ozdemir-64',
    'quiz-go-test-028',
    '{"codeQuality":78,"completionTime":630,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 07:19:21.432',
    TIMESTAMP '2025-11-10 07:19:21.432',
    TIMESTAMP '2025-11-10 07:19:21.432'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-merve-kurt-1',
    'user-merve-kurt-65',
    'quiz-java-bug-005',
    '{"codeQuality":74,"completionTime":1660,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 20:17:47.310',
    TIMESTAMP '2025-11-04 20:17:47.310',
    TIMESTAMP '2025-11-04 20:17:47.310'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-005')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-merve-kurt-2',
    'user-merve-kurt-65',
    'quiz-java-test-084',
    '{"codeQuality":88,"completionTime":1210,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 13:34:48.470',
    TIMESTAMP '2025-11-14 13:34:48.470',
    TIMESTAMP '2025-11-14 13:34:48.470'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-084')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-merve-kurt-3',
    'user-merve-kurt-65',
    'quiz-go-live-051',
    '{"codeQuality":93,"completionTime":835,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 03:44:13.121',
    TIMESTAMP '2025-11-08 03:44:13.121',
    TIMESTAMP '2025-11-08 03:44:13.121'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-merve-kurt-4',
    'user-merve-kurt-65',
    'quiz-go-bug-065',
    '{"codeQuality":84,"completionTime":837,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 17:22:42.099',
    TIMESTAMP '2025-11-07 17:22:42.099',
    TIMESTAMP '2025-11-07 17:22:42.099'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-065')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-merve-kurt-5',
    'user-merve-kurt-65',
    'quiz-go-test-002',
    '{"codeQuality":89,"completionTime":1696,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 12:15:03.804',
    TIMESTAMP '2025-11-13 12:15:03.804',
    TIMESTAMP '2025-11-13 12:15:03.804'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-seda-koc-1',
    'user-seda-koc-66',
    'quiz-java-test-024',
    '{"codeQuality":71,"completionTime":1397,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-26 06:02:39.993',
    TIMESTAMP '2025-10-26 06:02:39.993',
    TIMESTAMP '2025-10-26 06:02:39.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-seda-koc-2',
    'user-seda-koc-66',
    'quiz-go-live-014',
    '{"codeQuality":92,"completionTime":1734,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 09:00:36.964',
    TIMESTAMP '2025-11-15 09:00:36.964',
    TIMESTAMP '2025-11-15 09:00:36.964'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-seda-koc-3',
    'user-seda-koc-66',
    'quiz-go-bug-080',
    '{"codeQuality":81,"completionTime":1113,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 23:51:31.622',
    TIMESTAMP '2025-11-14 23:51:31.622',
    TIMESTAMP '2025-11-14 23:51:31.622'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-080')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-seda-koc-4',
    'user-seda-koc-66',
    'quiz-go-test-047',
    '{"codeQuality":89,"completionTime":1135,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-23 02:49:26.838',
    TIMESTAMP '2025-10-23 02:49:26.838',
    TIMESTAMP '2025-10-23 02:49:26.838'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-derya-kara-1',
    'user-derya-kara-67',
    'quiz-go-live-013',
    '{"codeQuality":81,"completionTime":1027,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 07:02:31.787',
    TIMESTAMP '2025-11-14 07:02:31.787',
    TIMESTAMP '2025-11-14 07:02:31.787'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-013')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-derya-kara-2',
    'user-derya-kara-67',
    'quiz-go-bug-066',
    '{"codeQuality":71,"completionTime":846,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 15:37:09.932',
    TIMESTAMP '2025-11-10 15:37:09.932',
    TIMESTAMP '2025-11-10 15:37:09.932'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-derya-kara-3',
    'user-derya-kara-67',
    'quiz-go-test-007',
    '{"codeQuality":91,"completionTime":1210,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 14:56:15.545',
    TIMESTAMP '2025-11-14 14:56:15.545',
    TIMESTAMP '2025-11-14 14:56:15.545'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-007')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-aslan-1',
    'user-gizem-aslan-68',
    'quiz-go-bug-034',
    '{"codeQuality":71,"completionTime":1776,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 09:43:26.159',
    TIMESTAMP '2025-11-08 09:43:26.159',
    TIMESTAMP '2025-11-08 09:43:26.159'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-aslan-2',
    'user-gizem-aslan-68',
    'quiz-go-test-017',
    '{"codeQuality":73,"completionTime":789,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 00:25:59.171',
    TIMESTAMP '2025-11-04 00:25:59.171',
    TIMESTAMP '2025-11-04 00:25:59.171'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-aslan-3',
    'user-gizem-aslan-68',
    'quiz-dotnet-live-038',
    '{"codeQuality":95,"completionTime":1676,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 23:03:18.342',
    TIMESTAMP '2025-11-06 23:03:18.342',
    TIMESTAMP '2025-11-06 23:03:18.342'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-aslan-4',
    'user-gizem-aslan-68',
    'quiz-dotnet-bug-100',
    '{"codeQuality":94,"completionTime":832,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 12:19:18.967',
    TIMESTAMP '2025-11-15 12:19:18.967',
    TIMESTAMP '2025-11-15 12:19:18.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-100')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-aslan-5',
    'user-gizem-aslan-68',
    'quiz-dotnet-test-080',
    '{"codeQuality":81,"completionTime":980,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 08:10:58.646',
    TIMESTAMP '2025-11-15 08:10:58.646',
    TIMESTAMP '2025-11-15 08:10:58.646'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-gizem-aslan-6',
    'user-gizem-aslan-68',
    'quiz-react-adv-live-018',
    '{"codeQuality":76,"completionTime":1239,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 23:05:56.067',
    TIMESTAMP '2025-11-10 23:05:56.067',
    TIMESTAMP '2025-11-10 23:05:56.067'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-018')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-kilic-1',
    'user-busra-kilic-69',
    'quiz-go-test-074',
    '{"codeQuality":90,"completionTime":670,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 14:09:07.600',
    TIMESTAMP '2025-11-09 14:09:07.600',
    TIMESTAMP '2025-11-09 14:09:07.600'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-kilic-2',
    'user-busra-kilic-69',
    'quiz-dotnet-live-007',
    '{"codeQuality":89,"completionTime":957,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 13:22:43.807',
    TIMESTAMP '2025-11-11 13:22:43.807',
    TIMESTAMP '2025-11-11 13:22:43.807'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-007')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-busra-kilic-3',
    'user-busra-kilic-69',
    'quiz-dotnet-bug-023',
    '{"codeQuality":93,"completionTime":1657,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-31 05:44:48.317',
    TIMESTAMP '2025-10-31 05:44:48.317',
    TIMESTAMP '2025-10-31 05:44:48.317'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-023')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-dogan-1',
    'user-sibel-dogan-70',
    'quiz-dotnet-live-074',
    '{"codeQuality":71,"completionTime":1709,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-04 12:55:37.539',
    TIMESTAMP '2025-11-04 12:55:37.539',
    TIMESTAMP '2025-11-04 12:55:37.539'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-074')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-dogan-2',
    'user-sibel-dogan-70',
    'quiz-dotnet-bug-041',
    '{"codeQuality":77,"completionTime":1170,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 08:54:38.607',
    TIMESTAMP '2025-11-02 08:54:38.607',
    TIMESTAMP '2025-11-02 08:54:38.607'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-041')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sibel-dogan-3',
    'user-sibel-dogan-70',
    'quiz-dotnet-test-072',
    '{"codeQuality":76,"completionTime":1339,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 09:46:05.023',
    TIMESTAMP '2025-11-09 09:46:05.023',
    TIMESTAMP '2025-11-09 09:46:05.023'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ece-arslan-1',
    'user-ece-arslan-71',
    'quiz-dotnet-bug-027',
    '{"codeQuality":92,"completionTime":401,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-08 22:44:33.216',
    TIMESTAMP '2025-11-08 22:44:33.216',
    TIMESTAMP '2025-11-08 22:44:33.216'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ece-arslan-2',
    'user-ece-arslan-71',
    'quiz-dotnet-test-039',
    '{"codeQuality":94,"completionTime":841,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-09 14:56:27.637',
    TIMESTAMP '2025-11-09 14:56:27.637',
    TIMESTAMP '2025-11-09 14:56:27.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-ece-arslan-3',
    'user-ece-arslan-71',
    'quiz-react-adv-live-034',
    '{"codeQuality":90,"completionTime":932,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 19:23:09.209',
    TIMESTAMP '2025-11-05 19:23:09.209',
    TIMESTAMP '2025-11-05 19:23:09.209'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-pelin-ozturk-1',
    'user-pelin-ozturk-72',
    'quiz-dotnet-test-021',
    '{"codeQuality":72,"completionTime":357,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 14:50:27.860',
    TIMESTAMP '2025-11-14 14:50:27.860',
    TIMESTAMP '2025-11-14 14:50:27.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-pelin-ozturk-2',
    'user-pelin-ozturk-72',
    'quiz-react-adv-live-019',
    '{"codeQuality":78,"completionTime":1361,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 20:59:56.293',
    TIMESTAMP '2025-11-07 20:59:56.293',
    TIMESTAMP '2025-11-07 20:59:56.293'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-pelin-ozturk-3',
    'user-pelin-ozturk-72',
    'quiz-react-adv-bug-008',
    '{"codeQuality":81,"completionTime":1242,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 01:21:14.897',
    TIMESTAMP '2025-11-10 01:21:14.897',
    TIMESTAMP '2025-11-10 01:21:14.897'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-008')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-pelin-ozturk-4',
    'user-pelin-ozturk-72',
    'quiz-react-adv-test-046',
    '{"codeQuality":84,"completionTime":647,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 00:00:00.505',
    TIMESTAMP '2025-11-10 00:00:00.505',
    TIMESTAMP '2025-11-10 00:00:00.505'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-aydin-1',
    'user-hande-aydin-73',
    'quiz-react-adv-live-009',
    '{"codeQuality":85,"completionTime":705,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-30 18:07:36.458',
    TIMESTAMP '2025-10-30 18:07:36.458',
    TIMESTAMP '2025-10-30 18:07:36.458'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-aydin-2',
    'user-hande-aydin-73',
    'quiz-react-adv-bug-014',
    '{"codeQuality":82,"completionTime":852,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 05:10:24.669',
    TIMESTAMP '2025-11-02 05:10:24.669',
    TIMESTAMP '2025-11-02 05:10:24.669'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-014')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-hande-aydin-3',
    'user-hande-aydin-73',
    'quiz-react-adv-test-039',
    '{"codeQuality":77,"completionTime":623,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-29 15:13:10.210',
    TIMESTAMP '2025-10-29 15:13:10.210',
    TIMESTAMP '2025-10-29 15:13:10.210'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-yildirim-1',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-bug-035',
    '{"codeQuality":87,"completionTime":1737,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-27 11:29:26.915',
    TIMESTAMP '2025-10-27 11:29:26.915',
    TIMESTAMP '2025-10-27 11:29:26.915'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-035')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-yildirim-2',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-test-022',
    '{"codeQuality":91,"completionTime":1528,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 15:53:13.278',
    TIMESTAMP '2025-11-15 15:53:13.278',
    TIMESTAMP '2025-11-15 15:53:13.278'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-yildirim-3',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-live-021',
    '{"codeQuality":86,"completionTime":970,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 21:44:21.113',
    TIMESTAMP '2025-11-02 21:44:21.113',
    TIMESTAMP '2025-11-02 21:44:21.113'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-yildirim-4',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-bug-037',
    '{"codeQuality":84,"completionTime":1356,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 02:22:53.024',
    TIMESTAMP '2025-11-14 02:22:53.024',
    TIMESTAMP '2025-11-14 02:22:53.024'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-yildirim-5',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-test-040',
    '{"codeQuality":75,"completionTime":864,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 00:46:00.995',
    TIMESTAMP '2025-11-02 00:46:00.995',
    TIMESTAMP '2025-11-02 00:46:00.995'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-sevgi-yildirim-6',
    'user-sevgi-yildirim-74',
    'quiz-node-adv-live-014',
    '{"codeQuality":73,"completionTime":1684,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-10-23 06:28:15.307',
    TIMESTAMP '2025-10-23 06:28:15.307',
    TIMESTAMP '2025-10-23 06:28:15.307'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-yildiz-1',
    'user-i-rem-yildiz-75',
    'quiz-react-adv-test-020',
    '{"codeQuality":73,"completionTime":648,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 21:57:58.297',
    TIMESTAMP '2025-11-12 21:57:58.297',
    TIMESTAMP '2025-11-12 21:57:58.297'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-yildiz-2',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-live-044',
    '{"codeQuality":80,"completionTime":330,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 10:09:22.737',
    TIMESTAMP '2025-11-14 10:09:22.737',
    TIMESTAMP '2025-11-14 10:09:22.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-yildiz-3',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-bug-027',
    '{"codeQuality":93,"completionTime":1738,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 07:01:04.091',
    TIMESTAMP '2025-11-16 07:01:04.091',
    TIMESTAMP '2025-11-16 07:01:04.091'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-yildiz-4',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-test-037',
    '{"codeQuality":76,"completionTime":519,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 06:46:38.859',
    TIMESTAMP '2025-11-15 06:46:38.859',
    TIMESTAMP '2025-11-15 06:46:38.859'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-037')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-i-rem-yildiz-5',
    'user-i-rem-yildiz-75',
    'quiz-node-adv-live-028',
    '{"codeQuality":86,"completionTime":334,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 03:19:04.569',
    TIMESTAMP '2025-11-12 03:19:04.569',
    TIMESTAMP '2025-11-12 03:19:04.569'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-028')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-celik-1',
    'user-tugce-celik-76',
    'quiz-flutter-adv-live-036',
    '{"codeQuality":89,"completionTime":1665,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-13 22:14:45.174',
    TIMESTAMP '2025-11-13 22:14:45.174',
    TIMESTAMP '2025-11-13 22:14:45.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-celik-2',
    'user-tugce-celik-76',
    'quiz-flutter-adv-bug-011',
    '{"codeQuality":94,"completionTime":1635,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 21:49:01.464',
    TIMESTAMP '2025-11-15 21:49:01.464',
    TIMESTAMP '2025-11-15 21:49:01.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-celik-3',
    'user-tugce-celik-76',
    'quiz-flutter-adv-test-020',
    '{"codeQuality":73,"completionTime":726,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 20:30:59.141',
    TIMESTAMP '2025-11-15 20:30:59.141',
    TIMESTAMP '2025-11-15 20:30:59.141'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-celik-4',
    'user-tugce-celik-76',
    'quiz-node-adv-live-014',
    '{"codeQuality":94,"completionTime":1445,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 21:42:54.606',
    TIMESTAMP '2025-11-15 21:42:54.606',
    TIMESTAMP '2025-11-15 21:42:54.606'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-tugce-celik-5',
    'user-tugce-celik-76',
    'quiz-node-adv-bug-042',
    '{"codeQuality":78,"completionTime":473,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 13:39:32.182',
    TIMESTAMP '2025-11-12 13:39:32.182',
    TIMESTAMP '2025-11-12 13:39:32.182'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-042')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-sahin-1',
    'user-asli-sahin-77',
    'quiz-flutter-adv-bug-019',
    '{"codeQuality":91,"completionTime":1439,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-07 15:56:06.497',
    TIMESTAMP '2025-11-07 15:56:06.497',
    TIMESTAMP '2025-11-07 15:56:06.497'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-sahin-2',
    'user-asli-sahin-77',
    'quiz-flutter-adv-test-017',
    '{"codeQuality":79,"completionTime":381,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-06 04:53:25.981',
    TIMESTAMP '2025-11-06 04:53:25.981',
    TIMESTAMP '2025-11-06 04:53:25.981'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-sahin-3',
    'user-asli-sahin-77',
    'quiz-node-adv-live-036',
    '{"codeQuality":87,"completionTime":1315,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-02 03:01:35.264',
    TIMESTAMP '2025-11-02 03:01:35.264',
    TIMESTAMP '2025-11-02 03:01:35.264'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-sahin-4',
    'user-asli-sahin-77',
    'quiz-node-adv-bug-043',
    '{"codeQuality":75,"completionTime":1766,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-05 17:40:03.102',
    TIMESTAMP '2025-11-05 17:40:03.102',
    TIMESTAMP '2025-11-05 17:40:03.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-sahin-5',
    'user-asli-sahin-77',
    'quiz-node-adv-test-017',
    '{"codeQuality":72,"completionTime":1576,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 02:52:14.199',
    TIMESTAMP '2025-11-01 02:52:14.199',
    TIMESTAMP '2025-11-01 02:52:14.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-asli-sahin-6',
    'user-asli-sahin-77',
    'quiz-python-adv-live-025',
    '{"codeQuality":72,"completionTime":1161,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-01 07:16:49.567',
    TIMESTAMP '2025-11-01 07:16:49.567',
    TIMESTAMP '2025-11-01 07:16:49.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-025')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nisan-demir-1',
    'user-nisan-demir-78',
    'quiz-flutter-adv-test-013',
    '{"codeQuality":88,"completionTime":1722,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 16:14:11.093',
    TIMESTAMP '2025-11-15 16:14:11.093',
    TIMESTAMP '2025-11-15 16:14:11.093'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nisan-demir-2',
    'user-nisan-demir-78',
    'quiz-node-adv-live-019',
    '{"codeQuality":85,"completionTime":1263,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 09:06:49.256',
    TIMESTAMP '2025-11-12 09:06:49.256',
    TIMESTAMP '2025-11-12 09:06:49.256'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-nisan-demir-3',
    'user-nisan-demir-78',
    'quiz-node-adv-bug-043',
    '{"codeQuality":91,"completionTime":1323,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 20:17:39.566',
    TIMESTAMP '2025-11-15 20:17:39.566',
    TIMESTAMP '2025-11-15 20:17:39.566'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-kaya-1',
    'user-melis-kaya-79',
    'quiz-node-adv-live-040',
    '{"codeQuality":86,"completionTime":828,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 13:36:54.450',
    TIMESTAMP '2025-11-15 13:36:54.450',
    TIMESTAMP '2025-11-15 13:36:54.450'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-kaya-2',
    'user-melis-kaya-79',
    'quiz-node-adv-bug-036',
    '{"codeQuality":77,"completionTime":1572,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 16:34:45.122',
    TIMESTAMP '2025-11-15 16:34:45.122',
    TIMESTAMP '2025-11-15 16:34:45.122'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-kaya-3',
    'user-melis-kaya-79',
    'quiz-node-adv-test-002',
    '{"codeQuality":86,"completionTime":761,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 11:03:37.588',
    TIMESTAMP '2025-11-16 11:03:37.588',
    TIMESTAMP '2025-11-16 11:03:37.588'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-kaya-4',
    'user-melis-kaya-79',
    'quiz-python-adv-live-006',
    '{"codeQuality":71,"completionTime":1309,"testsPassed":7}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 11:14:00.117',
    TIMESTAMP '2025-11-15 11:14:00.117',
    TIMESTAMP '2025-11-15 11:14:00.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-kaya-5',
    'user-melis-kaya-79',
    'quiz-python-adv-bug-044',
    '{"codeQuality":88,"completionTime":1420,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 12:02:57.143',
    TIMESTAMP '2025-11-14 12:02:57.143',
    TIMESTAMP '2025-11-14 12:02:57.143'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-044')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-melis-kaya-6',
    'user-melis-kaya-79',
    'quiz-python-adv-test-025',
    '{"codeQuality":71,"completionTime":1230,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-15 16:21:48.503',
    TIMESTAMP '2025-11-15 16:21:48.503',
    TIMESTAMP '2025-11-15 16:21:48.503'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-025')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-yilmaz-1',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-bug-024',
    '{"codeQuality":88,"completionTime":1735,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 20:25:33.393',
    TIMESTAMP '2025-11-12 20:25:33.393',
    TIMESTAMP '2025-11-12 20:25:33.393'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-yilmaz-2',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-test-004',
    '{"codeQuality":81,"completionTime":687,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-11 05:40:08.333',
    TIMESTAMP '2025-11-11 05:40:08.333',
    TIMESTAMP '2025-11-11 05:40:08.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-yilmaz-3',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-live-003',
    '{"codeQuality":72,"completionTime":623,"testsPassed":6}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-10 14:23:38.905',
    TIMESTAMP '2025-11-10 14:23:38.905',
    TIMESTAMP '2025-11-10 14:23:38.905'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-003')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-yilmaz-4',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-bug-001',
    '{"codeQuality":79,"completionTime":1262,"testsPassed":5}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-16 09:28:33.111',
    TIMESTAMP '2025-11-16 09:28:33.111',
    TIMESTAMP '2025-11-16 09:28:33.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-yilmaz-5',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-test-039',
    '{"codeQuality":72,"completionTime":487,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-12 15:02:45.984',
    TIMESTAMP '2025-11-12 15:02:45.984',
    TIMESTAMP '2025-11-12 15:02:45.984'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'liveattempt-cansu-yilmaz-6',
    'user-cansu-yilmaz-80',
    'quiz-react-live-020',
    '{"codeQuality":82,"completionTime":1651,"testsPassed":8}'::jsonb,
    NULL,
    '{"suggestion":"Use memoization where relevant"}'::jsonb,
    TIMESTAMP '2025-11-14 08:41:42.550',
    TIMESTAMP '2025-11-14 08:41:42.550',
    TIMESTAMP '2025-11-14 08:41:42.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-020')
ON CONFLICT DO NOTHING;

-- Insert bug fix attempts (only if quiz exists)
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-keskin-1',
    'user-mehmet-keskin-1',
    'quiz-react-live-044',
    '{"bugsFixed":2,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 04:16:51.953',
    TIMESTAMP '2025-11-16 04:16:51.953',
    TIMESTAMP '2025-11-16 04:16:51.953'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-keskin-2',
    'user-mehmet-keskin-1',
    'quiz-react-bug-081',
    '{"bugsFixed":1,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 04:35:28.758',
    TIMESTAMP '2025-11-15 04:35:28.758',
    TIMESTAMP '2025-11-15 04:35:28.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-keskin-3',
    'user-mehmet-keskin-1',
    'quiz-react-test-010',
    '{"bugsFixed":1,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 04:51:12.982',
    TIMESTAMP '2025-11-14 04:51:12.982',
    TIMESTAMP '2025-11-14 04:51:12.982'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-keskin-4',
    'user-mehmet-keskin-1',
    'quiz-flutter-live-038',
    '{"bugsFixed":4,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 18:38:59.660',
    TIMESTAMP '2025-11-15 18:38:59.660',
    TIMESTAMP '2025-11-15 18:38:59.660'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-avci-1',
    'user-ahmet-avci-2',
    'quiz-react-bug-004',
    '{"bugsFixed":3,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 22:04:01.090',
    TIMESTAMP '2025-11-14 22:04:01.090',
    TIMESTAMP '2025-11-14 22:04:01.090'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-avci-2',
    'user-ahmet-avci-2',
    'quiz-react-test-005',
    '{"bugsFixed":4,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 20:39:21.931',
    TIMESTAMP '2025-11-15 20:39:21.931',
    TIMESTAMP '2025-11-15 20:39:21.931'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-avci-3',
    'user-ahmet-avci-2',
    'quiz-flutter-live-046',
    '{"bugsFixed":4,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 05:47:25.580',
    TIMESTAMP '2025-11-16 05:47:25.580',
    TIMESTAMP '2025-11-16 05:47:25.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-avci-4',
    'user-ahmet-avci-2',
    'quiz-flutter-bug-063',
    '{"bugsFixed":2,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 15:28:27.709',
    TIMESTAMP '2025-11-14 15:28:27.709',
    TIMESTAMP '2025-11-14 15:28:27.709'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-avci-5',
    'user-ahmet-avci-2',
    'quiz-flutter-test-088',
    '{"bugsFixed":2,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 18:01:14.350',
    TIMESTAMP '2025-11-14 18:01:14.350',
    TIMESTAMP '2025-11-14 18:01:14.350'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-avci-6',
    'user-ahmet-avci-2',
    'quiz-node-live-046',
    '{"bugsFixed":2,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 01:59:50.242',
    TIMESTAMP '2025-11-15 01:59:50.242',
    TIMESTAMP '2025-11-15 01:59:50.242'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-046')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-bulut-1',
    'user-mustafa-bulut-3',
    'quiz-react-test-098',
    '{"bugsFixed":3,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 07:12:02.580',
    TIMESTAMP '2025-11-01 07:12:02.580',
    TIMESTAMP '2025-11-01 07:12:02.580'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-bulut-2',
    'user-mustafa-bulut-3',
    'quiz-flutter-live-034',
    '{"bugsFixed":4,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 22:07:09.142',
    TIMESTAMP '2025-11-11 22:07:09.142',
    TIMESTAMP '2025-11-11 22:07:09.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-bulut-3',
    'user-mustafa-bulut-3',
    'quiz-flutter-bug-052',
    '{"bugsFixed":3,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 05:34:21.236',
    TIMESTAMP '2025-11-09 05:34:21.236',
    TIMESTAMP '2025-11-09 05:34:21.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-bulut-4',
    'user-mustafa-bulut-3',
    'quiz-flutter-test-022',
    '{"bugsFixed":4,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 21:03:17.231',
    TIMESTAMP '2025-11-07 21:03:17.231',
    TIMESTAMP '2025-11-07 21:03:17.231'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-bulut-5',
    'user-mustafa-bulut-3',
    'quiz-node-live-083',
    '{"bugsFixed":2,"codeQuality":76}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-29 21:36:40.323',
    TIMESTAMP '2025-10-29 21:36:40.323',
    TIMESTAMP '2025-10-29 21:36:40.323'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-huseyin-erdogan-1',
    'user-huseyin-erdogan-4',
    'quiz-flutter-live-058',
    '{"bugsFixed":1,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 17:00:09.860',
    TIMESTAMP '2025-11-01 17:00:09.860',
    TIMESTAMP '2025-11-01 17:00:09.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-huseyin-erdogan-2',
    'user-huseyin-erdogan-4',
    'quiz-flutter-bug-052',
    '{"bugsFixed":1,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-22 14:54:01.002',
    TIMESTAMP '2025-10-22 14:54:01.002',
    TIMESTAMP '2025-10-22 14:54:01.002'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-052')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-huseyin-erdogan-3',
    'user-huseyin-erdogan-4',
    'quiz-flutter-test-008',
    '{"bugsFixed":1,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 08:31:20.604',
    TIMESTAMP '2025-11-10 08:31:20.604',
    TIMESTAMP '2025-11-10 08:31:20.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-008')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-emre-aksoy-1',
    'user-emre-aksoy-5',
    'quiz-flutter-bug-021',
    '{"bugsFixed":3,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 17:48:44.236',
    TIMESTAMP '2025-11-15 17:48:44.236',
    TIMESTAMP '2025-11-15 17:48:44.236'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-emre-aksoy-2',
    'user-emre-aksoy-5',
    'quiz-flutter-test-029',
    '{"bugsFixed":1,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 21:39:30.291',
    TIMESTAMP '2025-11-11 21:39:30.291',
    TIMESTAMP '2025-11-11 21:39:30.291'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-emre-aksoy-3',
    'user-emre-aksoy-5',
    'quiz-node-live-040',
    '{"bugsFixed":1,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 13:54:27.430',
    TIMESTAMP '2025-11-11 13:54:27.430',
    TIMESTAMP '2025-11-11 13:54:27.430'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-bozkurt-1',
    'user-burak-bozkurt-6',
    'quiz-flutter-test-006',
    '{"bugsFixed":4,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 08:19:45.117',
    TIMESTAMP '2025-11-09 08:19:45.117',
    TIMESTAMP '2025-11-09 08:19:45.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-006')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-bozkurt-2',
    'user-burak-bozkurt-6',
    'quiz-node-live-031',
    '{"bugsFixed":2,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 07:12:30.946',
    TIMESTAMP '2025-11-05 07:12:30.946',
    TIMESTAMP '2025-11-05 07:12:30.946'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-bozkurt-3',
    'user-burak-bozkurt-6',
    'quiz-node-bug-018',
    '{"bugsFixed":1,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 03:11:50.443',
    TIMESTAMP '2025-11-05 03:11:50.443',
    TIMESTAMP '2025-11-05 03:11:50.443'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-bozkurt-4',
    'user-burak-bozkurt-6',
    'quiz-node-test-012',
    '{"bugsFixed":2,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 07:01:37.112',
    TIMESTAMP '2025-11-01 07:01:37.112',
    TIMESTAMP '2025-11-01 07:01:37.112'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-012')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-bozkurt-5',
    'user-burak-bozkurt-6',
    'quiz-python-live-006',
    '{"bugsFixed":2,"codeQuality":76}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 14:30:39.111',
    TIMESTAMP '2025-11-08 14:30:39.111',
    TIMESTAMP '2025-11-08 14:30:39.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-bozkurt-6',
    'user-burak-bozkurt-6',
    'quiz-python-bug-001',
    '{"bugsFixed":1,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 01:34:44.026',
    TIMESTAMP '2025-11-03 01:34:44.026',
    TIMESTAMP '2025-11-03 01:34:44.026'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cem-gunes-1',
    'user-cem-gunes-7',
    'quiz-node-live-092',
    '{"bugsFixed":1,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 20:21:22.949',
    TIMESTAMP '2025-11-14 20:21:22.949',
    TIMESTAMP '2025-11-14 20:21:22.949'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-092')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cem-gunes-2',
    'user-cem-gunes-7',
    'quiz-node-bug-097',
    '{"bugsFixed":2,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 14:31:15.174',
    TIMESTAMP '2025-11-14 14:31:15.174',
    TIMESTAMP '2025-11-14 14:31:15.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cem-gunes-3',
    'user-cem-gunes-7',
    'quiz-node-test-070',
    '{"bugsFixed":1,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 18:11:25.980',
    TIMESTAMP '2025-11-15 18:11:25.980',
    TIMESTAMP '2025-11-15 18:11:25.980'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-070')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cem-gunes-4',
    'user-cem-gunes-7',
    'quiz-python-live-053',
    '{"bugsFixed":4,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 22:10:47.522',
    TIMESTAMP '2025-11-13 22:10:47.522',
    TIMESTAMP '2025-11-13 22:10:47.522'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cem-gunes-5',
    'user-cem-gunes-7',
    'quiz-python-bug-011',
    '{"bugsFixed":1,"codeQuality":76}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 16:33:57.534',
    TIMESTAMP '2025-11-14 16:33:57.534',
    TIMESTAMP '2025-11-14 16:33:57.534'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cem-gunes-6',
    'user-cem-gunes-7',
    'quiz-python-test-066',
    '{"bugsFixed":4,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 20:41:53.637',
    TIMESTAMP '2025-11-14 20:41:53.637',
    TIMESTAMP '2025-11-14 20:41:53.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-can-tas-1',
    'user-can-tas-8',
    'quiz-node-bug-097',
    '{"bugsFixed":3,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 08:24:51.107',
    TIMESTAMP '2025-11-16 08:24:51.107',
    TIMESTAMP '2025-11-16 08:24:51.107'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-can-tas-2',
    'user-can-tas-8',
    'quiz-node-test-053',
    '{"bugsFixed":2,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 12:29:42.625',
    TIMESTAMP '2025-11-16 12:29:42.625',
    TIMESTAMP '2025-11-16 12:29:42.625'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-053')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-can-tas-3',
    'user-can-tas-8',
    'quiz-python-live-001',
    '{"bugsFixed":1,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 11:10:08.250',
    TIMESTAMP '2025-11-16 11:10:08.250',
    TIMESTAMP '2025-11-16 11:10:08.250'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ozan-tekin-1',
    'user-ozan-tekin-9',
    'quiz-node-test-089',
    '{"bugsFixed":3,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 04:03:49.258',
    TIMESTAMP '2025-11-10 04:03:49.258',
    TIMESTAMP '2025-11-10 04:03:49.258'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-089')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ozan-tekin-2',
    'user-ozan-tekin-9',
    'quiz-python-live-035',
    '{"bugsFixed":2,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 10:15:19.661',
    TIMESTAMP '2025-11-13 10:15:19.661',
    TIMESTAMP '2025-11-13 10:15:19.661'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ozan-tekin-3',
    'user-ozan-tekin-9',
    'quiz-python-bug-077',
    '{"bugsFixed":4,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 22:33:48.199',
    TIMESTAMP '2025-11-01 22:33:48.199',
    TIMESTAMP '2025-11-01 22:33:48.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-eren-sari-1',
    'user-eren-sari-10',
    'quiz-python-live-021',
    '{"bugsFixed":3,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 20:48:29.152',
    TIMESTAMP '2025-10-31 20:48:29.152',
    TIMESTAMP '2025-10-31 20:48:29.152'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-eren-sari-2',
    'user-eren-sari-10',
    'quiz-python-bug-064',
    '{"bugsFixed":2,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 05:35:19.274',
    TIMESTAMP '2025-11-07 05:35:19.274',
    TIMESTAMP '2025-11-07 05:35:19.274'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-eren-sari-3',
    'user-eren-sari-10',
    'quiz-python-test-004',
    '{"bugsFixed":3,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 19:43:11.168',
    TIMESTAMP '2025-11-14 19:43:11.168',
    TIMESTAMP '2025-11-14 19:43:11.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-eren-sari-4',
    'user-eren-sari-10',
    'quiz-angular-live-064',
    '{"bugsFixed":2,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-29 12:16:18.880',
    TIMESTAMP '2025-10-29 12:16:18.880',
    TIMESTAMP '2025-10-29 12:16:18.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-064')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-eren-sari-5',
    'user-eren-sari-10',
    'quiz-angular-bug-076',
    '{"bugsFixed":3,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 15:53:40.671',
    TIMESTAMP '2025-11-02 15:53:40.671',
    TIMESTAMP '2025-11-02 15:53:40.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-deniz-kaplan-1',
    'user-deniz-kaplan-11',
    'quiz-python-bug-070',
    '{"bugsFixed":3,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 17:39:23.590',
    TIMESTAMP '2025-11-12 17:39:23.590',
    TIMESTAMP '2025-11-12 17:39:23.590'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-070')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-deniz-kaplan-2',
    'user-deniz-kaplan-11',
    'quiz-python-test-059',
    '{"bugsFixed":4,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 00:04:44.741',
    TIMESTAMP '2025-11-16 00:04:44.741',
    TIMESTAMP '2025-11-16 00:04:44.741'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-deniz-kaplan-3',
    'user-deniz-kaplan-11',
    'quiz-angular-live-039',
    '{"bugsFixed":4,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 22:31:54.571',
    TIMESTAMP '2025-11-14 22:31:54.571',
    TIMESTAMP '2025-11-14 22:31:54.571'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-deniz-kaplan-4',
    'user-deniz-kaplan-11',
    'quiz-angular-bug-045',
    '{"bugsFixed":1,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 15:33:45.724',
    TIMESTAMP '2025-11-12 15:33:45.724',
    TIMESTAMP '2025-11-12 15:33:45.724'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hakan-ozcan-1',
    'user-hakan-ozcan-12',
    'quiz-python-test-031',
    '{"bugsFixed":2,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 08:40:21.936',
    TIMESTAMP '2025-11-14 08:40:21.936',
    TIMESTAMP '2025-11-14 08:40:21.936'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-031')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hakan-ozcan-2',
    'user-hakan-ozcan-12',
    'quiz-angular-live-035',
    '{"bugsFixed":2,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 22:41:03.364',
    TIMESTAMP '2025-11-12 22:41:03.364',
    TIMESTAMP '2025-11-12 22:41:03.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hakan-ozcan-3',
    'user-hakan-ozcan-12',
    'quiz-angular-bug-030',
    '{"bugsFixed":4,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 03:07:37.683',
    TIMESTAMP '2025-11-13 03:07:37.683',
    TIMESTAMP '2025-11-13 03:07:37.683'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hakan-ozcan-4',
    'user-hakan-ozcan-12',
    'quiz-angular-test-046',
    '{"bugsFixed":4,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 11:20:10.089',
    TIMESTAMP '2025-11-16 11:20:10.089',
    TIMESTAMP '2025-11-16 11:20:10.089'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hakan-ozcan-5',
    'user-hakan-ozcan-12',
    'quiz-vue-live-078',
    '{"bugsFixed":2,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 16:45:37.742',
    TIMESTAMP '2025-11-15 16:45:37.742',
    TIMESTAMP '2025-11-15 16:45:37.742'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-onur-polat-1',
    'user-onur-polat-13',
    'quiz-angular-live-019',
    '{"bugsFixed":3,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 18:51:08.945',
    TIMESTAMP '2025-11-05 18:51:08.945',
    TIMESTAMP '2025-11-05 18:51:08.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-onur-polat-2',
    'user-onur-polat-13',
    'quiz-angular-bug-076',
    '{"bugsFixed":3,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 15:04:09.290',
    TIMESTAMP '2025-11-10 15:04:09.290',
    TIMESTAMP '2025-11-10 15:04:09.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-076')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-onur-polat-3',
    'user-onur-polat-13',
    'quiz-angular-test-099',
    '{"bugsFixed":2,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 01:59:32.909',
    TIMESTAMP '2025-11-15 01:59:32.909',
    TIMESTAMP '2025-11-15 01:59:32.909'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-099')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tolga-ozdemir-1',
    'user-tolga-ozdemir-14',
    'quiz-angular-bug-073',
    '{"bugsFixed":3,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 12:02:50.911',
    TIMESTAMP '2025-11-13 12:02:50.911',
    TIMESTAMP '2025-11-13 12:02:50.911'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-073')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tolga-ozdemir-2',
    'user-tolga-ozdemir-14',
    'quiz-angular-test-014',
    '{"bugsFixed":2,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 04:44:33.225',
    TIMESTAMP '2025-11-16 04:44:33.225',
    TIMESTAMP '2025-11-16 04:44:33.225'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-014')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tolga-ozdemir-3',
    'user-tolga-ozdemir-14',
    'quiz-vue-live-038',
    '{"bugsFixed":4,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 13:53:08.805',
    TIMESTAMP '2025-11-12 13:53:08.805',
    TIMESTAMP '2025-11-12 13:53:08.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tolga-ozdemir-4',
    'user-tolga-ozdemir-14',
    'quiz-vue-bug-029',
    '{"bugsFixed":3,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 02:01:02.884',
    TIMESTAMP '2025-11-13 02:01:02.884',
    TIMESTAMP '2025-11-13 02:01:02.884'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-029')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tolga-ozdemir-5',
    'user-tolga-ozdemir-14',
    'quiz-vue-test-071',
    '{"bugsFixed":3,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 02:34:56.553',
    TIMESTAMP '2025-11-13 02:34:56.553',
    TIMESTAMP '2025-11-13 02:34:56.553'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tolga-ozdemir-6',
    'user-tolga-ozdemir-14',
    'quiz-rn-live-024',
    '{"bugsFixed":4,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 18:35:42.896',
    TIMESTAMP '2025-11-11 18:35:42.896',
    TIMESTAMP '2025-11-11 18:35:42.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasin-kurt-1',
    'user-yasin-kurt-15',
    'quiz-angular-test-059',
    '{"bugsFixed":2,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 19:51:48.442',
    TIMESTAMP '2025-11-14 19:51:48.442',
    TIMESTAMP '2025-11-14 19:51:48.442'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-059')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasin-kurt-2',
    'user-yasin-kurt-15',
    'quiz-vue-live-089',
    '{"bugsFixed":1,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 08:37:00.800',
    TIMESTAMP '2025-11-16 08:37:00.800',
    TIMESTAMP '2025-11-16 08:37:00.800'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasin-kurt-3',
    'user-yasin-kurt-15',
    'quiz-vue-bug-043',
    '{"bugsFixed":4,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 10:40:32.504',
    TIMESTAMP '2025-11-16 10:40:32.504',
    TIMESTAMP '2025-11-16 10:40:32.504'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasin-kurt-4',
    'user-yasin-kurt-15',
    'quiz-vue-test-046',
    '{"bugsFixed":4,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 10:19:06.753',
    TIMESTAMP '2025-11-15 10:19:06.753',
    TIMESTAMP '2025-11-15 10:19:06.753'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kerem-koc-1',
    'user-kerem-koc-16',
    'quiz-vue-live-070',
    '{"bugsFixed":4,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 12:05:27.384',
    TIMESTAMP '2025-11-12 12:05:27.384',
    TIMESTAMP '2025-11-12 12:05:27.384'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kerem-koc-2',
    'user-kerem-koc-16',
    'quiz-vue-bug-086',
    '{"bugsFixed":4,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 20:16:08.877',
    TIMESTAMP '2025-11-09 20:16:08.877',
    TIMESTAMP '2025-11-09 20:16:08.877'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-086')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kerem-koc-3',
    'user-kerem-koc-16',
    'quiz-vue-test-005',
    '{"bugsFixed":4,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-27 10:07:52.309',
    TIMESTAMP '2025-10-27 10:07:52.309',
    TIMESTAMP '2025-10-27 10:07:52.309'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-005')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kerem-koc-4',
    'user-kerem-koc-16',
    'quiz-rn-live-077',
    '{"bugsFixed":1,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 04:45:08.447',
    TIMESTAMP '2025-11-09 04:45:08.447',
    TIMESTAMP '2025-11-09 04:45:08.447'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-077')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-umut-kara-1',
    'user-umut-kara-17',
    'quiz-vue-bug-004',
    '{"bugsFixed":2,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 21:19:50.624',
    TIMESTAMP '2025-10-31 21:19:50.624',
    TIMESTAMP '2025-10-31 21:19:50.624'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-004')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-umut-kara-2',
    'user-umut-kara-17',
    'quiz-vue-test-036',
    '{"bugsFixed":3,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-20 12:30:40.255',
    TIMESTAMP '2025-10-20 12:30:40.255',
    TIMESTAMP '2025-10-20 12:30:40.255'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-036')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-umut-kara-3',
    'user-umut-kara-17',
    'quiz-rn-live-063',
    '{"bugsFixed":3,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 00:27:54.618',
    TIMESTAMP '2025-10-31 00:27:54.618',
    TIMESTAMP '2025-10-31 00:27:54.618'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-umut-kara-4',
    'user-umut-kara-17',
    'quiz-rn-bug-079',
    '{"bugsFixed":2,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-20 07:15:48.701',
    TIMESTAMP '2025-10-20 07:15:48.701',
    TIMESTAMP '2025-10-20 07:15:48.701'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-079')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-umut-kara-5',
    'user-umut-kara-17',
    'quiz-rn-test-082',
    '{"bugsFixed":3,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 04:51:04.550',
    TIMESTAMP '2025-11-09 04:51:04.550',
    TIMESTAMP '2025-11-09 04:51:04.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-082')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-murat-aslan-1',
    'user-murat-aslan-18',
    'quiz-vue-test-024',
    '{"bugsFixed":2,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 10:09:28.781',
    TIMESTAMP '2025-11-16 10:09:28.781',
    TIMESTAMP '2025-11-16 10:09:28.781'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-murat-aslan-2',
    'user-murat-aslan-18',
    'quiz-rn-live-060',
    '{"bugsFixed":4,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 22:28:43.205',
    TIMESTAMP '2025-11-15 22:28:43.205',
    TIMESTAMP '2025-11-15 22:28:43.205'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-murat-aslan-3',
    'user-murat-aslan-18',
    'quiz-rn-bug-066',
    '{"bugsFixed":3,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 23:15:03.880',
    TIMESTAMP '2025-11-15 23:15:03.880',
    TIMESTAMP '2025-11-15 23:15:03.880'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-murat-aslan-4',
    'user-murat-aslan-18',
    'quiz-rn-test-033',
    '{"bugsFixed":3,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 23:10:54.070',
    TIMESTAMP '2025-11-15 23:10:54.070',
    TIMESTAMP '2025-11-15 23:10:54.070'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-murat-aslan-5',
    'user-murat-aslan-18',
    'quiz-java-live-030',
    '{"bugsFixed":3,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 21:46:54.253',
    TIMESTAMP '2025-11-15 21:46:54.253',
    TIMESTAMP '2025-11-15 21:46:54.253'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-murat-aslan-6',
    'user-murat-aslan-18',
    'quiz-java-bug-060',
    '{"bugsFixed":2,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 00:38:32.419',
    TIMESTAMP '2025-11-16 00:38:32.419',
    TIMESTAMP '2025-11-16 00:38:32.419'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gokhan-kilic-1',
    'user-gokhan-kilic-19',
    'quiz-rn-live-073',
    '{"bugsFixed":2,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 19:32:18.901',
    TIMESTAMP '2025-11-10 19:32:18.901',
    TIMESTAMP '2025-11-10 19:32:18.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-073')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gokhan-kilic-2',
    'user-gokhan-kilic-19',
    'quiz-rn-bug-055',
    '{"bugsFixed":4,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 17:34:17.989',
    TIMESTAMP '2025-11-10 17:34:17.989',
    TIMESTAMP '2025-11-10 17:34:17.989'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gokhan-kilic-3',
    'user-gokhan-kilic-19',
    'quiz-rn-test-035',
    '{"bugsFixed":3,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 20:56:31.736',
    TIMESTAMP '2025-11-13 20:56:31.736',
    TIMESTAMP '2025-11-13 20:56:31.736'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gokhan-kilic-4',
    'user-gokhan-kilic-19',
    'quiz-java-live-070',
    '{"bugsFixed":4,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 07:19:32.896',
    TIMESTAMP '2025-11-11 07:19:32.896',
    TIMESTAMP '2025-11-11 07:19:32.896'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-070')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gokhan-kilic-5',
    'user-gokhan-kilic-19',
    'quiz-java-bug-018',
    '{"bugsFixed":4,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 06:25:14.629',
    TIMESTAMP '2025-11-16 06:25:14.629',
    TIMESTAMP '2025-11-16 06:25:14.629'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kaan-dogan-1',
    'user-kaan-dogan-20',
    'quiz-rn-bug-007',
    '{"bugsFixed":3,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 00:22:46.996',
    TIMESTAMP '2025-11-06 00:22:46.996',
    TIMESTAMP '2025-11-06 00:22:46.996'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-007')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kaan-dogan-2',
    'user-kaan-dogan-20',
    'quiz-rn-test-063',
    '{"bugsFixed":2,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 05:08:57.498',
    TIMESTAMP '2025-11-12 05:08:57.498',
    TIMESTAMP '2025-11-12 05:08:57.498'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-063')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kaan-dogan-3',
    'user-kaan-dogan-20',
    'quiz-java-live-063',
    '{"bugsFixed":2,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 12:52:20.673',
    TIMESTAMP '2025-11-15 12:52:20.673',
    TIMESTAMP '2025-11-15 12:52:20.673'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-063')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kaan-dogan-4',
    'user-kaan-dogan-20',
    'quiz-java-bug-063',
    '{"bugsFixed":4,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 13:40:41.584',
    TIMESTAMP '2025-11-07 13:40:41.584',
    TIMESTAMP '2025-11-07 13:40:41.584'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-063')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kaan-dogan-5',
    'user-kaan-dogan-20',
    'quiz-java-test-038',
    '{"bugsFixed":1,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 12:07:22.875',
    TIMESTAMP '2025-11-13 12:07:22.875',
    TIMESTAMP '2025-11-13 12:07:22.875'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-038')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kaan-dogan-6',
    'user-kaan-dogan-20',
    'quiz-go-live-023',
    '{"bugsFixed":1,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 01:51:02.051',
    TIMESTAMP '2025-11-15 01:51:02.051',
    TIMESTAMP '2025-11-15 01:51:02.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-023')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-baran-arslan-1',
    'user-baran-arslan-21',
    'quiz-rn-test-080',
    '{"bugsFixed":3,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 04:41:06.029',
    TIMESTAMP '2025-11-06 04:41:06.029',
    TIMESTAMP '2025-11-06 04:41:06.029'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-baran-arslan-2',
    'user-baran-arslan-21',
    'quiz-java-live-016',
    '{"bugsFixed":4,"codeQuality":76}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 12:54:17.085',
    TIMESTAMP '2025-11-07 12:54:17.085',
    TIMESTAMP '2025-11-07 12:54:17.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-baran-arslan-3',
    'user-baran-arslan-21',
    'quiz-java-bug-099',
    '{"bugsFixed":2,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 10:25:33.655',
    TIMESTAMP '2025-11-14 10:25:33.655',
    TIMESTAMP '2025-11-14 10:25:33.655'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-bora-ozturk-1',
    'user-bora-ozturk-22',
    'quiz-java-live-054',
    '{"bugsFixed":3,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 03:27:57.993',
    TIMESTAMP '2025-11-16 03:27:57.993',
    TIMESTAMP '2025-11-16 03:27:57.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-bora-ozturk-2',
    'user-bora-ozturk-22',
    'quiz-java-bug-050',
    '{"bugsFixed":4,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 16:32:03.126',
    TIMESTAMP '2025-11-09 16:32:03.126',
    TIMESTAMP '2025-11-09 16:32:03.126'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-bora-ozturk-3',
    'user-bora-ozturk-22',
    'quiz-java-test-072',
    '{"bugsFixed":1,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 00:01:58.359',
    TIMESTAMP '2025-11-10 00:01:58.359',
    TIMESTAMP '2025-11-10 00:01:58.359'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-bora-ozturk-4',
    'user-bora-ozturk-22',
    'quiz-go-live-001',
    '{"bugsFixed":1,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 13:38:00.165',
    TIMESTAMP '2025-11-03 13:38:00.165',
    TIMESTAMP '2025-11-03 13:38:00.165'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-halil-aydin-1',
    'user-halil-aydin-23',
    'quiz-java-bug-090',
    '{"bugsFixed":4,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-27 15:20:39.604',
    TIMESTAMP '2025-10-27 15:20:39.604',
    TIMESTAMP '2025-10-27 15:20:39.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-090')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-halil-aydin-2',
    'user-halil-aydin-23',
    'quiz-java-test-096',
    '{"bugsFixed":1,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 06:33:13.737',
    TIMESTAMP '2025-10-31 06:33:13.737',
    TIMESTAMP '2025-10-31 06:33:13.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-096')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-halil-aydin-3',
    'user-halil-aydin-23',
    'quiz-go-live-057',
    '{"bugsFixed":4,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 00:55:18.682',
    TIMESTAMP '2025-11-06 00:55:18.682',
    TIMESTAMP '2025-11-06 00:55:18.682'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-halil-aydin-4',
    'user-halil-aydin-23',
    'quiz-go-bug-094',
    '{"bugsFixed":2,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-22 21:01:39.770',
    TIMESTAMP '2025-10-22 21:01:39.770',
    TIMESTAMP '2025-10-22 21:01:39.770'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-094')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-suat-yildirim-1',
    'user-suat-yildirim-24',
    'quiz-java-test-068',
    '{"bugsFixed":2,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 09:08:26.300',
    TIMESTAMP '2025-11-12 09:08:26.300',
    TIMESTAMP '2025-11-12 09:08:26.300'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-068')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-suat-yildirim-2',
    'user-suat-yildirim-24',
    'quiz-go-live-067',
    '{"bugsFixed":1,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 15:09:58.227',
    TIMESTAMP '2025-11-16 15:09:58.227',
    TIMESTAMP '2025-11-16 15:09:58.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-suat-yildirim-3',
    'user-suat-yildirim-24',
    'quiz-go-bug-062',
    '{"bugsFixed":2,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 11:50:30.762',
    TIMESTAMP '2025-11-13 11:50:30.762',
    TIMESTAMP '2025-11-13 11:50:30.762'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-062')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-serkan-yildiz-1',
    'user-serkan-yildiz-25',
    'quiz-go-live-096',
    '{"bugsFixed":2,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 13:52:25.364',
    TIMESTAMP '2025-11-08 13:52:25.364',
    TIMESTAMP '2025-11-08 13:52:25.364'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-096')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-serkan-yildiz-2',
    'user-serkan-yildiz-25',
    'quiz-go-bug-064',
    '{"bugsFixed":4,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 04:27:45.945',
    TIMESTAMP '2025-11-09 04:27:45.945',
    TIMESTAMP '2025-11-09 04:27:45.945'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-064')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-serkan-yildiz-3',
    'user-serkan-yildiz-25',
    'quiz-go-test-013',
    '{"bugsFixed":1,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 13:50:17.267',
    TIMESTAMP '2025-11-12 13:50:17.267',
    TIMESTAMP '2025-11-12 13:50:17.267'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-serkan-yildiz-4',
    'user-serkan-yildiz-25',
    'quiz-dotnet-live-088',
    '{"bugsFixed":3,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 17:33:55.168',
    TIMESTAMP '2025-11-13 17:33:55.168',
    TIMESTAMP '2025-11-13 17:33:55.168'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-088')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-berk-celik-1',
    'user-berk-celik-26',
    'quiz-go-bug-001',
    '{"bugsFixed":2,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 04:01:39.813',
    TIMESTAMP '2025-11-13 04:01:39.813',
    TIMESTAMP '2025-11-13 04:01:39.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-berk-celik-2',
    'user-berk-celik-26',
    'quiz-go-test-081',
    '{"bugsFixed":1,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 05:37:39.408',
    TIMESTAMP '2025-11-03 05:37:39.408',
    TIMESTAMP '2025-11-03 05:37:39.408'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-berk-celik-3',
    'user-berk-celik-26',
    'quiz-dotnet-live-056',
    '{"bugsFixed":3,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 17:26:01.536',
    TIMESTAMP '2025-11-06 17:26:01.536',
    TIMESTAMP '2025-11-06 17:26:01.536'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-056')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-berk-celik-4',
    'user-berk-celik-26',
    'quiz-dotnet-bug-066',
    '{"bugsFixed":4,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 20:06:09.758',
    TIMESTAMP '2025-11-05 20:06:09.758',
    TIMESTAMP '2025-11-05 20:06:09.758'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-berk-celik-5',
    'user-berk-celik-26',
    'quiz-dotnet-test-010',
    '{"bugsFixed":4,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-20 14:12:36.813',
    TIMESTAMP '2025-10-20 14:12:36.813',
    TIMESTAMP '2025-10-20 14:12:36.813'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-010')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mert-sahin-1',
    'user-mert-sahin-27',
    'quiz-go-test-083',
    '{"bugsFixed":3,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 15:49:52.097',
    TIMESTAMP '2025-11-11 15:49:52.097',
    TIMESTAMP '2025-11-11 15:49:52.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-083')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mert-sahin-2',
    'user-mert-sahin-27',
    'quiz-dotnet-live-054',
    '{"bugsFixed":3,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 00:50:43.369',
    TIMESTAMP '2025-11-11 00:50:43.369',
    TIMESTAMP '2025-11-11 00:50:43.369'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-054')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mert-sahin-3',
    'user-mert-sahin-27',
    'quiz-dotnet-bug-045',
    '{"bugsFixed":4,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 02:55:12.815',
    TIMESTAMP '2025-11-10 02:55:12.815',
    TIMESTAMP '2025-11-10 02:55:12.815'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mert-sahin-4',
    'user-mert-sahin-27',
    'quiz-dotnet-test-081',
    '{"bugsFixed":2,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 00:38:34.749',
    TIMESTAMP '2025-11-07 00:38:34.749',
    TIMESTAMP '2025-11-07 00:38:34.749'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mert-sahin-5',
    'user-mert-sahin-27',
    'quiz-react-adv-live-020',
    '{"bugsFixed":1,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 03:50:34.848',
    TIMESTAMP '2025-11-09 03:50:34.848',
    TIMESTAMP '2025-11-09 03:50:34.848'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mert-sahin-6',
    'user-mert-sahin-27',
    'quiz-react-adv-bug-002',
    '{"bugsFixed":1,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 04:52:18.007',
    TIMESTAMP '2025-11-15 04:52:18.007',
    TIMESTAMP '2025-11-15 04:52:18.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kadir-demir-1',
    'user-kadir-demir-28',
    'quiz-dotnet-live-012',
    '{"bugsFixed":3,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 05:26:13.727',
    TIMESTAMP '2025-11-04 05:26:13.727',
    TIMESTAMP '2025-11-04 05:26:13.727'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kadir-demir-2',
    'user-kadir-demir-28',
    'quiz-dotnet-bug-024',
    '{"bugsFixed":4,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 22:33:28.148',
    TIMESTAMP '2025-11-04 22:33:28.148',
    TIMESTAMP '2025-11-04 22:33:28.148'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kadir-demir-3',
    'user-kadir-demir-28',
    'quiz-dotnet-test-088',
    '{"bugsFixed":4,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 08:27:45.013',
    TIMESTAMP '2025-11-16 08:27:45.013',
    TIMESTAMP '2025-11-16 08:27:45.013'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kadir-demir-4',
    'user-kadir-demir-28',
    'quiz-react-adv-live-026',
    '{"bugsFixed":3,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 11:10:49.132',
    TIMESTAMP '2025-11-08 11:10:49.132',
    TIMESTAMP '2025-11-08 11:10:49.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-026')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kadir-demir-5',
    'user-kadir-demir-28',
    'quiz-react-adv-bug-010',
    '{"bugsFixed":2,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 16:25:02.050',
    TIMESTAMP '2025-11-02 16:25:02.050',
    TIMESTAMP '2025-11-02 16:25:02.050'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-furkan-kaya-1',
    'user-furkan-kaya-29',
    'quiz-dotnet-bug-019',
    '{"bugsFixed":3,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 07:59:20.239',
    TIMESTAMP '2025-11-16 07:59:20.239',
    TIMESTAMP '2025-11-16 07:59:20.239'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-furkan-kaya-2',
    'user-furkan-kaya-29',
    'quiz-dotnet-test-071',
    '{"bugsFixed":1,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 08:34:55.805',
    TIMESTAMP '2025-11-08 08:34:55.805',
    TIMESTAMP '2025-11-08 08:34:55.805'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-furkan-kaya-3',
    'user-furkan-kaya-29',
    'quiz-react-adv-live-035',
    '{"bugsFixed":3,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 18:40:21.929',
    TIMESTAMP '2025-11-09 18:40:21.929',
    TIMESTAMP '2025-11-09 18:40:21.929'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-035')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-furkan-kaya-4',
    'user-furkan-kaya-29',
    'quiz-react-adv-bug-020',
    '{"bugsFixed":4,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 10:58:22.051',
    TIMESTAMP '2025-11-13 10:58:22.051',
    TIMESTAMP '2025-11-13 10:58:22.051'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-furkan-kaya-5',
    'user-furkan-kaya-29',
    'quiz-react-adv-test-024',
    '{"bugsFixed":3,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 16:09:51.331',
    TIMESTAMP '2025-11-11 16:09:51.331',
    TIMESTAMP '2025-11-11 16:09:51.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cagri-yilmaz-1',
    'user-cagri-yilmaz-30',
    'quiz-dotnet-test-056',
    '{"bugsFixed":3,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 07:35:02.215',
    TIMESTAMP '2025-11-01 07:35:02.215',
    TIMESTAMP '2025-11-01 07:35:02.215'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cagri-yilmaz-2',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-live-040',
    '{"bugsFixed":4,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 00:14:53.494',
    TIMESTAMP '2025-11-15 00:14:53.494',
    TIMESTAMP '2025-11-15 00:14:53.494'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cagri-yilmaz-3',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-bug-002',
    '{"bugsFixed":2,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-27 03:41:31.396',
    TIMESTAMP '2025-10-27 03:41:31.396',
    TIMESTAMP '2025-10-27 03:41:31.396'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cagri-yilmaz-4',
    'user-cagri-yilmaz-30',
    'quiz-react-adv-test-028',
    '{"bugsFixed":1,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 13:13:35.296',
    TIMESTAMP '2025-10-31 13:13:35.296',
    TIMESTAMP '2025-10-31 13:13:35.296'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cagri-yilmaz-5',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-live-024',
    '{"bugsFixed":1,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-24 18:54:31.717',
    TIMESTAMP '2025-10-24 18:54:31.717',
    TIMESTAMP '2025-10-24 18:54:31.717'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-024')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cagri-yilmaz-6',
    'user-cagri-yilmaz-30',
    'quiz-flutter-adv-bug-037',
    '{"bugsFixed":1,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 16:35:05.917',
    TIMESTAMP '2025-11-12 16:35:05.917',
    TIMESTAMP '2025-11-12 16:35:05.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-oz-1',
    'user-mehmet-oz-31',
    'quiz-react-adv-live-002',
    '{"bugsFixed":1,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 20:35:46.410',
    TIMESTAMP '2025-11-13 20:35:46.410',
    TIMESTAMP '2025-11-13 20:35:46.410'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-oz-2',
    'user-mehmet-oz-31',
    'quiz-react-adv-bug-002',
    '{"bugsFixed":1,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 19:31:15.247',
    TIMESTAMP '2025-11-14 19:31:15.247',
    TIMESTAMP '2025-11-14 19:31:15.247'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-oz-3',
    'user-mehmet-oz-31',
    'quiz-react-adv-test-041',
    '{"bugsFixed":1,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 07:14:18.604',
    TIMESTAMP '2025-11-11 07:14:18.604',
    TIMESTAMP '2025-11-11 07:14:18.604'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-041')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-oz-4',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-live-012',
    '{"bugsFixed":3,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 04:01:55.097',
    TIMESTAMP '2025-11-12 04:01:55.097',
    TIMESTAMP '2025-11-12 04:01:55.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-oz-5',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-bug-011',
    '{"bugsFixed":3,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 15:06:24.405',
    TIMESTAMP '2025-11-09 15:06:24.405',
    TIMESTAMP '2025-11-09 15:06:24.405'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mehmet-oz-6',
    'user-mehmet-oz-31',
    'quiz-flutter-adv-test-023',
    '{"bugsFixed":3,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 10:48:02.406',
    TIMESTAMP '2025-11-14 10:48:02.406',
    TIMESTAMP '2025-11-14 10:48:02.406'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-gokmen-1',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-bug-010',
    '{"bugsFixed":4,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-27 02:54:11.012',
    TIMESTAMP '2025-10-27 02:54:11.012',
    TIMESTAMP '2025-10-27 02:54:11.012'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-010')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-gokmen-2',
    'user-ahmet-gokmen-32',
    'quiz-react-adv-test-022',
    '{"bugsFixed":3,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 23:58:28.855',
    TIMESTAMP '2025-11-01 23:58:28.855',
    TIMESTAMP '2025-11-01 23:58:28.855'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-gokmen-3',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-live-001',
    '{"bugsFixed":2,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 03:46:06.834',
    TIMESTAMP '2025-11-13 03:46:06.834',
    TIMESTAMP '2025-11-13 03:46:06.834'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-gokmen-4',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-bug-015',
    '{"bugsFixed":2,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 05:15:49.729',
    TIMESTAMP '2025-11-01 05:15:49.729',
    TIMESTAMP '2025-11-01 05:15:49.729'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ahmet-gokmen-5',
    'user-ahmet-gokmen-32',
    'quiz-flutter-adv-test-002',
    '{"bugsFixed":2,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-30 14:04:35.777',
    TIMESTAMP '2025-10-30 14:04:35.777',
    TIMESTAMP '2025-10-30 14:04:35.777'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-kuzu-1',
    'user-mustafa-kuzu-33',
    'quiz-react-adv-test-018',
    '{"bugsFixed":1,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 18:09:19.331',
    TIMESTAMP '2025-11-13 18:09:19.331',
    TIMESTAMP '2025-11-13 18:09:19.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-kuzu-2',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-live-050',
    '{"bugsFixed":4,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 00:29:54.251',
    TIMESTAMP '2025-11-15 00:29:54.251',
    TIMESTAMP '2025-11-15 00:29:54.251'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-kuzu-3',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-bug-047',
    '{"bugsFixed":1,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 11:58:57.387',
    TIMESTAMP '2025-11-11 11:58:57.387',
    TIMESTAMP '2025-11-11 11:58:57.387'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-047')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-mustafa-kuzu-4',
    'user-mustafa-kuzu-33',
    'quiz-flutter-adv-test-003',
    '{"bugsFixed":1,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 18:33:50.509',
    TIMESTAMP '2025-11-13 18:33:50.509',
    TIMESTAMP '2025-11-13 18:33:50.509'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-huseyin-karaca-1',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-live-016',
    '{"bugsFixed":1,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 23:38:46.789',
    TIMESTAMP '2025-11-07 23:38:46.789',
    TIMESTAMP '2025-11-07 23:38:46.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-huseyin-karaca-2',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-bug-013',
    '{"bugsFixed":1,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 12:04:42.789',
    TIMESTAMP '2025-11-15 12:04:42.789',
    TIMESTAMP '2025-11-15 12:04:42.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-013')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-huseyin-karaca-3',
    'user-huseyin-karaca-34',
    'quiz-flutter-adv-test-045',
    '{"bugsFixed":2,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 14:09:27.628',
    TIMESTAMP '2025-11-09 14:09:27.628',
    TIMESTAMP '2025-11-09 14:09:27.628'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-huseyin-karaca-4',
    'user-huseyin-karaca-34',
    'quiz-node-adv-live-039',
    '{"bugsFixed":2,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 11:13:34.907',
    TIMESTAMP '2025-11-11 11:13:34.907',
    TIMESTAMP '2025-11-11 11:13:34.907'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-039')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-emre-duman-1',
    'user-emre-duman-35',
    'quiz-flutter-adv-bug-019',
    '{"bugsFixed":4,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 00:32:33.775',
    TIMESTAMP '2025-11-02 00:32:33.775',
    TIMESTAMP '2025-11-02 00:32:33.775'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-emre-duman-2',
    'user-emre-duman-35',
    'quiz-flutter-adv-test-034',
    '{"bugsFixed":3,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 21:43:10.822',
    TIMESTAMP '2025-11-08 21:43:10.822',
    TIMESTAMP '2025-11-08 21:43:10.822'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-emre-duman-3',
    'user-emre-duman-35',
    'quiz-node-adv-live-031',
    '{"bugsFixed":2,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 05:53:04.969',
    TIMESTAMP '2025-10-31 05:53:04.969',
    TIMESTAMP '2025-10-31 05:53:04.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-oztuna-1',
    'user-burak-oztuna-36',
    'quiz-flutter-adv-test-047',
    '{"bugsFixed":4,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 03:53:07.829',
    TIMESTAMP '2025-11-12 03:53:07.829',
    TIMESTAMP '2025-11-12 03:53:07.829'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-oztuna-2',
    'user-burak-oztuna-36',
    'quiz-node-adv-live-045',
    '{"bugsFixed":4,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 02:29:17.441',
    TIMESTAMP '2025-11-13 02:29:17.441',
    TIMESTAMP '2025-11-13 02:29:17.441'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-045')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-burak-oztuna-3',
    'user-burak-oztuna-36',
    'quiz-node-adv-bug-037',
    '{"bugsFixed":3,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 13:37:07.616',
    TIMESTAMP '2025-10-31 13:37:07.616',
    TIMESTAMP '2025-10-31 13:37:07.616'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-derya-toprak-1',
    'user-derya-toprak-37',
    'quiz-node-adv-live-021',
    '{"bugsFixed":3,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 15:46:00.768',
    TIMESTAMP '2025-11-15 15:46:00.768',
    TIMESTAMP '2025-11-15 15:46:00.768'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-derya-toprak-2',
    'user-derya-toprak-37',
    'quiz-node-adv-bug-021',
    '{"bugsFixed":2,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 15:17:45.890',
    TIMESTAMP '2025-11-16 15:17:45.890',
    TIMESTAMP '2025-11-16 15:17:45.890'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-derya-toprak-3',
    'user-derya-toprak-37',
    'quiz-node-adv-test-011',
    '{"bugsFixed":1,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 02:57:12.173',
    TIMESTAMP '2025-11-16 02:57:12.173',
    TIMESTAMP '2025-11-16 02:57:12.173'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-bayrak-1',
    'user-gizem-bayrak-38',
    'quiz-node-adv-bug-036',
    '{"bugsFixed":1,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-24 02:19:21.969',
    TIMESTAMP '2025-10-24 02:19:21.969',
    TIMESTAMP '2025-10-24 02:19:21.969'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-bayrak-2',
    'user-gizem-bayrak-38',
    'quiz-node-adv-test-034',
    '{"bugsFixed":1,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-23 19:55:25.007',
    TIMESTAMP '2025-10-23 19:55:25.007',
    TIMESTAMP '2025-10-23 19:55:25.007'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-bayrak-3',
    'user-gizem-bayrak-38',
    'quiz-python-adv-live-009',
    '{"bugsFixed":1,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-24 12:06:51.810',
    TIMESTAMP '2025-10-24 12:06:51.810',
    TIMESTAMP '2025-10-24 12:06:51.810'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-bayrak-4',
    'user-gizem-bayrak-38',
    'quiz-python-adv-bug-046',
    '{"bugsFixed":4,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 14:10:38.376',
    TIMESTAMP '2025-11-08 14:10:38.376',
    TIMESTAMP '2025-11-08 14:10:38.376'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-046')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-bayrak-5',
    'user-gizem-bayrak-38',
    'quiz-python-adv-test-001',
    '{"bugsFixed":4,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-27 10:38:45.451',
    TIMESTAMP '2025-10-27 10:38:45.451',
    TIMESTAMP '2025-10-27 10:38:45.451'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-erdogdu-1',
    'user-busra-erdogdu-39',
    'quiz-node-adv-test-018',
    '{"bugsFixed":2,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 23:28:21.361',
    TIMESTAMP '2025-11-15 23:28:21.361',
    TIMESTAMP '2025-11-15 23:28:21.361'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-018')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-erdogdu-2',
    'user-busra-erdogdu-39',
    'quiz-python-adv-live-016',
    '{"bugsFixed":2,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 18:24:34.533',
    TIMESTAMP '2025-11-15 18:24:34.533',
    TIMESTAMP '2025-11-15 18:24:34.533'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-erdogdu-3',
    'user-busra-erdogdu-39',
    'quiz-python-adv-bug-018',
    '{"bugsFixed":2,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 12:51:35.530',
    TIMESTAMP '2025-11-16 12:51:35.530',
    TIMESTAMP '2025-11-16 12:51:35.530'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-018')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-erdogdu-4',
    'user-busra-erdogdu-39',
    'quiz-python-adv-test-045',
    '{"bugsFixed":4,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 08:15:05.271',
    TIMESTAMP '2025-11-16 08:15:05.271',
    TIMESTAMP '2025-11-16 08:15:05.271'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-045')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-erdogdu-5',
    'user-busra-erdogdu-39',
    'quiz-react-live-057',
    '{"bugsFixed":3,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 00:03:50.671',
    TIMESTAMP '2025-11-15 00:03:50.671',
    TIMESTAMP '2025-11-15 00:03:50.671'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-ozkan-1',
    'user-sibel-ozkan-40',
    'quiz-python-adv-live-015',
    '{"bugsFixed":3,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 05:48:14.731',
    TIMESTAMP '2025-11-13 05:48:14.731',
    TIMESTAMP '2025-11-13 05:48:14.731'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-015')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-ozkan-2',
    'user-sibel-ozkan-40',
    'quiz-python-adv-bug-032',
    '{"bugsFixed":3,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-24 06:36:50.060',
    TIMESTAMP '2025-10-24 06:36:50.060',
    TIMESTAMP '2025-10-24 06:36:50.060'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-032')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-ozkan-3',
    'user-sibel-ozkan-40',
    'quiz-python-adv-test-042',
    '{"bugsFixed":1,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 10:45:04.045',
    TIMESTAMP '2025-11-10 10:45:04.045',
    TIMESTAMP '2025-11-10 10:45:04.045'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-042')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-ozkan-4',
    'user-sibel-ozkan-40',
    'quiz-react-live-038',
    '{"bugsFixed":4,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 01:52:48.102',
    TIMESTAMP '2025-11-08 01:52:48.102',
    TIMESTAMP '2025-11-08 01:52:48.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-ozkan-5',
    'user-sibel-ozkan-40',
    'quiz-react-bug-054',
    '{"bugsFixed":3,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 06:51:20.314',
    TIMESTAMP '2025-11-09 06:51:20.314',
    TIMESTAMP '2025-11-09 06:51:20.314'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-054')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ece-ucar-1',
    'user-ece-ucar-41',
    'quiz-python-adv-bug-015',
    '{"bugsFixed":3,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 11:41:26.319',
    TIMESTAMP '2025-11-09 11:41:26.319',
    TIMESTAMP '2025-11-09 11:41:26.319'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ece-ucar-2',
    'user-ece-ucar-41',
    'quiz-python-adv-test-047',
    '{"bugsFixed":3,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 22:10:13.597',
    TIMESTAMP '2025-11-11 22:10:13.597',
    TIMESTAMP '2025-11-11 22:10:13.597'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ece-ucar-3',
    'user-ece-ucar-41',
    'quiz-react-live-047',
    '{"bugsFixed":2,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 05:26:17.127',
    TIMESTAMP '2025-11-14 05:26:17.127',
    TIMESTAMP '2025-11-14 05:26:17.127'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-pelin-bal-1',
    'user-pelin-bal-42',
    'quiz-python-adv-test-034',
    '{"bugsFixed":2,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 19:22:05.487',
    TIMESTAMP '2025-11-14 19:22:05.487',
    TIMESTAMP '2025-11-14 19:22:05.487'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-034')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-pelin-bal-2',
    'user-pelin-bal-42',
    'quiz-react-live-060',
    '{"bugsFixed":2,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 20:32:07.630',
    TIMESTAMP '2025-11-14 20:32:07.630',
    TIMESTAMP '2025-11-14 20:32:07.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-060')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-pelin-bal-3',
    'user-pelin-bal-42',
    'quiz-react-bug-055',
    '{"bugsFixed":2,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 16:05:17.463',
    TIMESTAMP '2025-11-09 16:05:17.463',
    TIMESTAMP '2025-11-09 16:05:17.463'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-055')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-karaaslan-1',
    'user-hande-karaaslan-43',
    'quiz-react-live-062',
    '{"bugsFixed":1,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 22:24:31.942',
    TIMESTAMP '2025-11-05 22:24:31.942',
    TIMESTAMP '2025-11-05 22:24:31.942'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-062')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-karaaslan-2',
    'user-hande-karaaslan-43',
    'quiz-react-bug-009',
    '{"bugsFixed":4,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 20:20:56.423',
    TIMESTAMP '2025-11-04 20:20:56.423',
    TIMESTAMP '2025-11-04 20:20:56.423'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-009')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-karaaslan-3',
    'user-hande-karaaslan-43',
    'quiz-react-test-061',
    '{"bugsFixed":1,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 23:59:17.956',
    TIMESTAMP '2025-11-07 23:59:17.956',
    TIMESTAMP '2025-11-07 23:59:17.956'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-061')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-karaaslan-4',
    'user-hande-karaaslan-43',
    'quiz-flutter-live-005',
    '{"bugsFixed":3,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 07:23:36.347',
    TIMESTAMP '2025-11-11 07:23:36.347',
    TIMESTAMP '2025-11-11 07:23:36.347'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-005')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-karaaslan-5',
    'user-hande-karaaslan-43',
    'quiz-flutter-bug-021',
    '{"bugsFixed":4,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 23:18:47.234',
    TIMESTAMP '2025-11-11 23:18:47.234',
    TIMESTAMP '2025-11-11 23:18:47.234'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-karaaslan-6',
    'user-hande-karaaslan-43',
    'quiz-flutter-test-081',
    '{"bugsFixed":4,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 10:02:03.934',
    TIMESTAMP '2025-11-04 10:02:03.934',
    TIMESTAMP '2025-11-04 10:02:03.934'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-081')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-dinc-1',
    'user-sevgi-dinc-44',
    'quiz-react-bug-039',
    '{"bugsFixed":1,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 13:43:23.596',
    TIMESTAMP '2025-10-31 13:43:23.596',
    TIMESTAMP '2025-10-31 13:43:23.596'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-bug-039')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-dinc-2',
    'user-sevgi-dinc-44',
    'quiz-react-test-016',
    '{"bugsFixed":1,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 13:07:24.641',
    TIMESTAMP '2025-11-01 13:07:24.641',
    TIMESTAMP '2025-11-01 13:07:24.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-016')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-dinc-3',
    'user-sevgi-dinc-44',
    'quiz-flutter-live-069',
    '{"bugsFixed":3,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-28 16:49:21.331',
    TIMESTAMP '2025-10-28 16:49:21.331',
    TIMESTAMP '2025-10-28 16:49:21.331'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-069')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-dinc-4',
    'user-sevgi-dinc-44',
    'quiz-flutter-bug-093',
    '{"bugsFixed":3,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 12:26:24.385',
    TIMESTAMP '2025-11-12 12:26:24.385',
    TIMESTAMP '2025-11-12 12:26:24.385'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-dinc-5',
    'user-sevgi-dinc-44',
    'quiz-flutter-test-066',
    '{"bugsFixed":4,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 21:23:41.390',
    TIMESTAMP '2025-11-03 21:23:41.390',
    TIMESTAMP '2025-11-03 21:23:41.390'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-066')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-sezer-1',
    'user-i-rem-sezer-45',
    'quiz-react-test-060',
    '{"bugsFixed":1,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 07:11:40.663',
    TIMESTAMP '2025-11-13 07:11:40.663',
    TIMESTAMP '2025-11-13 07:11:40.663'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-060')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-sezer-2',
    'user-i-rem-sezer-45',
    'quiz-flutter-live-020',
    '{"bugsFixed":1,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 08:17:04.097',
    TIMESTAMP '2025-11-03 08:17:04.097',
    TIMESTAMP '2025-11-03 08:17:04.097'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-sezer-3',
    'user-i-rem-sezer-45',
    'quiz-flutter-bug-084',
    '{"bugsFixed":4,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 21:02:54.559',
    TIMESTAMP '2025-11-09 21:02:54.559',
    TIMESTAMP '2025-11-09 21:02:54.559'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-sezer-4',
    'user-i-rem-sezer-45',
    'quiz-flutter-test-072',
    '{"bugsFixed":3,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 09:14:31.554',
    TIMESTAMP '2025-11-07 09:14:31.554',
    TIMESTAMP '2025-11-07 09:14:31.554'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-sezer-5',
    'user-i-rem-sezer-45',
    'quiz-node-live-089',
    '{"bugsFixed":3,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 04:30:46.490',
    TIMESTAMP '2025-11-06 04:30:46.490',
    TIMESTAMP '2025-11-06 04:30:46.490'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-089')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-eren-1',
    'user-tugce-eren-46',
    'quiz-flutter-live-051',
    '{"bugsFixed":2,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 17:48:17.836',
    TIMESTAMP '2025-11-02 17:48:17.836',
    TIMESTAMP '2025-11-02 17:48:17.836'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-eren-2',
    'user-tugce-eren-46',
    'quiz-flutter-bug-099',
    '{"bugsFixed":4,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 23:20:33.924',
    TIMESTAMP '2025-11-15 23:20:33.924',
    TIMESTAMP '2025-11-15 23:20:33.924'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-099')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-eren-3',
    'user-tugce-eren-46',
    'quiz-flutter-test-088',
    '{"bugsFixed":2,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 21:01:17.302',
    TIMESTAMP '2025-11-05 21:01:17.302',
    TIMESTAMP '2025-11-05 21:01:17.302'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-eren-4',
    'user-tugce-eren-46',
    'quiz-node-live-019',
    '{"bugsFixed":2,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 10:21:59.895',
    TIMESTAMP '2025-11-08 10:21:59.895',
    TIMESTAMP '2025-11-08 10:21:59.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-eren-5',
    'user-tugce-eren-46',
    'quiz-node-bug-081',
    '{"bugsFixed":2,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 02:33:40.966',
    TIMESTAMP '2025-11-07 02:33:40.966',
    TIMESTAMP '2025-11-07 02:33:40.966'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-eren-6',
    'user-tugce-eren-46',
    'quiz-node-test-069',
    '{"bugsFixed":2,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 06:46:28.819',
    TIMESTAMP '2025-11-13 06:46:28.819',
    TIMESTAMP '2025-11-13 06:46:28.819'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-cetin-1',
    'user-asli-cetin-47',
    'quiz-flutter-bug-056',
    '{"bugsFixed":1,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 13:36:56.845',
    TIMESTAMP '2025-11-10 13:36:56.845',
    TIMESTAMP '2025-11-10 13:36:56.845'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-056')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-cetin-2',
    'user-asli-cetin-47',
    'quiz-flutter-test-088',
    '{"bugsFixed":4,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 03:44:00.322',
    TIMESTAMP '2025-11-09 03:44:00.322',
    TIMESTAMP '2025-11-09 03:44:00.322'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-088')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-cetin-3',
    'user-asli-cetin-47',
    'quiz-node-live-021',
    '{"bugsFixed":4,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 15:21:39.786',
    TIMESTAMP '2025-11-09 15:21:39.786',
    TIMESTAMP '2025-11-09 15:21:39.786'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nisan-ceylan-1',
    'user-nisan-ceylan-48',
    'quiz-flutter-test-033',
    '{"bugsFixed":1,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 10:13:27.542',
    TIMESTAMP '2025-11-09 10:13:27.542',
    TIMESTAMP '2025-11-09 10:13:27.542'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nisan-ceylan-2',
    'user-nisan-ceylan-48',
    'quiz-node-live-094',
    '{"bugsFixed":3,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 19:03:11.567',
    TIMESTAMP '2025-11-06 19:03:11.567',
    TIMESTAMP '2025-11-06 19:03:11.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-094')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nisan-ceylan-3',
    'user-nisan-ceylan-48',
    'quiz-node-bug-020',
    '{"bugsFixed":4,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 21:51:15.086',
    TIMESTAMP '2025-11-09 21:51:15.086',
    TIMESTAMP '2025-11-09 21:51:15.086'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-020')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nisan-ceylan-4',
    'user-nisan-ceylan-48',
    'quiz-node-test-029',
    '{"bugsFixed":4,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 15:51:46.375',
    TIMESTAMP '2025-11-08 15:51:46.375',
    TIMESTAMP '2025-11-08 15:51:46.375'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-029')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-yalcin-1',
    'user-melis-yalcin-49',
    'quiz-node-live-050',
    '{"bugsFixed":3,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 08:31:40.455',
    TIMESTAMP '2025-11-05 08:31:40.455',
    TIMESTAMP '2025-11-05 08:31:40.455'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-050')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-yalcin-2',
    'user-melis-yalcin-49',
    'quiz-node-bug-060',
    '{"bugsFixed":3,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 03:38:41.211',
    TIMESTAMP '2025-11-08 03:38:41.211',
    TIMESTAMP '2025-11-08 03:38:41.211'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-060')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-yalcin-3',
    'user-melis-yalcin-49',
    'quiz-node-test-035',
    '{"bugsFixed":4,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 05:35:59.061',
    TIMESTAMP '2025-11-14 05:35:59.061',
    TIMESTAMP '2025-11-14 05:35:59.061'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-035')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-yalcin-4',
    'user-melis-yalcin-49',
    'quiz-python-live-004',
    '{"bugsFixed":2,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 05:15:13.428',
    TIMESTAMP '2025-11-15 05:15:13.428',
    TIMESTAMP '2025-11-15 05:15:13.428'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-004')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-isik-1',
    'user-cansu-isik-50',
    'quiz-node-bug-059',
    '{"bugsFixed":4,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 14:56:03.737',
    TIMESTAMP '2025-11-16 14:56:03.737',
    TIMESTAMP '2025-11-16 14:56:03.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-bug-059')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-isik-2',
    'user-cansu-isik-50',
    'quiz-node-test-040',
    '{"bugsFixed":4,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 11:37:48.279',
    TIMESTAMP '2025-11-16 11:37:48.279',
    TIMESTAMP '2025-11-16 11:37:48.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-isik-3',
    'user-cansu-isik-50',
    'quiz-python-live-051',
    '{"bugsFixed":1,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 16:09:41.901',
    TIMESTAMP '2025-11-16 16:09:41.901',
    TIMESTAMP '2025-11-16 16:09:41.901'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-naz-keskin-1',
    'user-naz-keskin-51',
    'quiz-node-test-079',
    '{"bugsFixed":1,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 21:54:17.214',
    TIMESTAMP '2025-11-15 21:54:17.214',
    TIMESTAMP '2025-11-15 21:54:17.214'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-naz-keskin-2',
    'user-naz-keskin-51',
    'quiz-python-live-083',
    '{"bugsFixed":4,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 04:01:56.290',
    TIMESTAMP '2025-11-16 04:01:56.290',
    TIMESTAMP '2025-11-16 04:01:56.290'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-naz-keskin-3',
    'user-naz-keskin-51',
    'quiz-python-bug-021',
    '{"bugsFixed":4,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 19:03:43.962',
    TIMESTAMP '2025-11-15 19:03:43.962',
    TIMESTAMP '2025-11-15 19:03:43.962'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-naz-keskin-4',
    'user-naz-keskin-51',
    'quiz-python-test-075',
    '{"bugsFixed":4,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 13:40:24.351',
    TIMESTAMP '2025-11-15 13:40:24.351',
    TIMESTAMP '2025-11-15 13:40:24.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-075')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-naz-keskin-5',
    'user-naz-keskin-51',
    'quiz-angular-live-058',
    '{"bugsFixed":2,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 05:44:07.944',
    TIMESTAMP '2025-11-16 05:44:07.944',
    TIMESTAMP '2025-11-16 05:44:07.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasemin-avci-1',
    'user-yasemin-avci-52',
    'quiz-python-live-078',
    '{"bugsFixed":4,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 02:34:21.320',
    TIMESTAMP '2025-11-14 02:34:21.320',
    TIMESTAMP '2025-11-14 02:34:21.320'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasemin-avci-2',
    'user-yasemin-avci-52',
    'quiz-python-bug-034',
    '{"bugsFixed":3,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 08:33:13.593',
    TIMESTAMP '2025-11-16 08:33:13.593',
    TIMESTAMP '2025-11-16 08:33:13.593'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasemin-avci-3',
    'user-yasemin-avci-52',
    'quiz-python-test-009',
    '{"bugsFixed":2,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 20:50:19.839',
    TIMESTAMP '2025-11-08 20:50:19.839',
    TIMESTAMP '2025-11-08 20:50:19.839'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasemin-avci-4',
    'user-yasemin-avci-52',
    'quiz-angular-live-027',
    '{"bugsFixed":3,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 18:41:21.273',
    TIMESTAMP '2025-11-15 18:41:21.273',
    TIMESTAMP '2025-11-15 18:41:21.273'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-027')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasemin-avci-5',
    'user-yasemin-avci-52',
    'quiz-angular-bug-050',
    '{"bugsFixed":1,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 04:51:48.614',
    TIMESTAMP '2025-11-14 04:51:48.614',
    TIMESTAMP '2025-11-14 04:51:48.614'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-yasemin-avci-6',
    'user-yasemin-avci-52',
    'quiz-angular-test-003',
    '{"bugsFixed":3,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 01:49:05.895',
    TIMESTAMP '2025-11-02 01:49:05.895',
    TIMESTAMP '2025-11-02 01:49:05.895'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kubra-bulut-1',
    'user-kubra-bulut-53',
    'quiz-python-bug-077',
    '{"bugsFixed":4,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 06:26:08.351',
    TIMESTAMP '2025-11-15 06:26:08.351',
    TIMESTAMP '2025-11-15 06:26:08.351'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-077')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kubra-bulut-2',
    'user-kubra-bulut-53',
    'quiz-python-test-079',
    '{"bugsFixed":4,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 13:00:10.403',
    TIMESTAMP '2025-11-12 13:00:10.403',
    TIMESTAMP '2025-11-12 13:00:10.403'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-079')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kubra-bulut-3',
    'user-kubra-bulut-53',
    'quiz-angular-live-057',
    '{"bugsFixed":4,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 03:11:37.630',
    TIMESTAMP '2025-11-13 03:11:37.630',
    TIMESTAMP '2025-11-13 03:11:37.630'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-057')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-kubra-bulut-4',
    'user-kubra-bulut-53',
    'quiz-angular-bug-031',
    '{"bugsFixed":1,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 04:26:27.840',
    TIMESTAMP '2025-11-15 04:26:27.840',
    TIMESTAMP '2025-11-15 04:26:27.840'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-031')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nil-erdogan-1',
    'user-nil-erdogan-54',
    'quiz-python-test-069',
    '{"bugsFixed":3,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 18:03:29.227',
    TIMESTAMP '2025-11-09 18:03:29.227',
    TIMESTAMP '2025-11-09 18:03:29.227'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-test-069')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nil-erdogan-2',
    'user-nil-erdogan-54',
    'quiz-angular-live-058',
    '{"bugsFixed":2,"codeQuality":86}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-29 14:47:38.977',
    TIMESTAMP '2025-10-29 14:47:38.977',
    TIMESTAMP '2025-10-29 14:47:38.977'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-058')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nil-erdogan-3',
    'user-nil-erdogan-54',
    'quiz-angular-bug-083',
    '{"bugsFixed":1,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 02:35:06.085',
    TIMESTAMP '2025-11-06 02:35:06.085',
    TIMESTAMP '2025-11-06 02:35:06.085'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-083')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gul-aksoy-1',
    'user-gul-aksoy-55',
    'quiz-angular-live-047',
    '{"bugsFixed":2,"codeQuality":76}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 23:22:50.967',
    TIMESTAMP '2025-11-15 23:22:50.967',
    TIMESTAMP '2025-11-15 23:22:50.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-047')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gul-aksoy-2',
    'user-gul-aksoy-55',
    'quiz-angular-bug-030',
    '{"bugsFixed":3,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 00:47:22.959',
    TIMESTAMP '2025-11-16 00:47:22.959',
    TIMESTAMP '2025-11-16 00:47:22.959'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-030')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gul-aksoy-3',
    'user-gul-aksoy-55',
    'quiz-angular-test-085',
    '{"bugsFixed":1,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 20:06:01.506',
    TIMESTAMP '2025-11-15 20:06:01.506',
    TIMESTAMP '2025-11-15 20:06:01.506'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-085')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sena-bozkurt-1',
    'user-sena-bozkurt-56',
    'quiz-angular-bug-093',
    '{"bugsFixed":2,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 03:05:40.851',
    TIMESTAMP '2025-11-04 03:05:40.851',
    TIMESTAMP '2025-11-04 03:05:40.851'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-bug-093')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sena-bozkurt-2',
    'user-sena-bozkurt-56',
    'quiz-angular-test-023',
    '{"bugsFixed":4,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 05:48:41.745',
    TIMESTAMP '2025-11-05 05:48:41.745',
    TIMESTAMP '2025-11-05 05:48:41.745'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-023')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sena-bozkurt-3',
    'user-sena-bozkurt-56',
    'quiz-vue-live-041',
    '{"bugsFixed":2,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 11:28:42.401',
    TIMESTAMP '2025-11-12 11:28:42.401',
    TIMESTAMP '2025-11-12 11:28:42.401'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-041')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sena-bozkurt-4',
    'user-sena-bozkurt-56',
    'quiz-vue-bug-006',
    '{"bugsFixed":4,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 14:19:40.575',
    TIMESTAMP '2025-11-14 14:19:40.575',
    TIMESTAMP '2025-11-14 14:19:40.575'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-006')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-esra-gunes-1',
    'user-esra-gunes-57',
    'quiz-angular-test-074',
    '{"bugsFixed":1,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 04:35:39.917',
    TIMESTAMP '2025-11-10 04:35:39.917',
    TIMESTAMP '2025-11-10 04:35:39.917'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-esra-gunes-2',
    'user-esra-gunes-57',
    'quiz-vue-live-053',
    '{"bugsFixed":4,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 19:44:20.868',
    TIMESTAMP '2025-11-03 19:44:20.868',
    TIMESTAMP '2025-11-03 19:44:20.868'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-053')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-esra-gunes-3',
    'user-esra-gunes-57',
    'quiz-vue-bug-071',
    '{"bugsFixed":3,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 22:18:42.944',
    TIMESTAMP '2025-11-03 22:18:42.944',
    TIMESTAMP '2025-11-03 22:18:42.944'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-071')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-esra-gunes-4',
    'user-esra-gunes-57',
    'quiz-vue-test-071',
    '{"bugsFixed":3,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 10:50:35.136',
    TIMESTAMP '2025-11-08 10:50:35.136',
    TIMESTAMP '2025-11-08 10:50:35.136'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-071')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hale-tas-1',
    'user-hale-tas-58',
    'quiz-vue-live-099',
    '{"bugsFixed":2,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 08:12:04.526',
    TIMESTAMP '2025-11-06 08:12:04.526',
    TIMESTAMP '2025-11-06 08:12:04.526'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-live-099')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hale-tas-2',
    'user-hale-tas-58',
    'quiz-vue-bug-084',
    '{"bugsFixed":2,"codeQuality":70}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 04:56:22.837',
    TIMESTAMP '2025-10-31 04:56:22.837',
    TIMESTAMP '2025-10-31 04:56:22.837'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-084')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hale-tas-3',
    'user-hale-tas-58',
    'quiz-vue-test-057',
    '{"bugsFixed":3,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-27 10:58:17.016',
    TIMESTAMP '2025-10-27 10:58:17.016',
    TIMESTAMP '2025-10-27 10:58:17.016'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-057')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hale-tas-4',
    'user-hale-tas-58',
    'quiz-rn-live-075',
    '{"bugsFixed":4,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 13:01:38.612',
    TIMESTAMP '2025-11-12 13:01:38.612',
    TIMESTAMP '2025-11-12 13:01:38.612'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-075')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hale-tas-5',
    'user-hale-tas-58',
    'quiz-rn-bug-015',
    '{"bugsFixed":2,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 12:53:37.333',
    TIMESTAMP '2025-11-09 12:53:37.333',
    TIMESTAMP '2025-11-09 12:53:37.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hale-tas-6',
    'user-hale-tas-58',
    'quiz-rn-test-009',
    '{"bugsFixed":3,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 11:55:31.744',
    TIMESTAMP '2025-11-12 11:55:31.744',
    TIMESTAMP '2025-11-12 11:55:31.744'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-009')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-selin-tekin-1',
    'user-selin-tekin-59',
    'quiz-vue-bug-092',
    '{"bugsFixed":1,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 05:06:47.400',
    TIMESTAMP '2025-11-13 05:06:47.400',
    TIMESTAMP '2025-11-13 05:06:47.400'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-092')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-selin-tekin-2',
    'user-selin-tekin-59',
    'quiz-vue-test-011',
    '{"bugsFixed":2,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 06:52:18.334',
    TIMESTAMP '2025-11-14 06:52:18.334',
    TIMESTAMP '2025-11-14 06:52:18.334'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-selin-tekin-3',
    'user-selin-tekin-59',
    'quiz-rn-live-052',
    '{"bugsFixed":2,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 15:32:28.904',
    TIMESTAMP '2025-11-13 15:32:28.904',
    TIMESTAMP '2025-11-13 15:32:28.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-052')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gonca-sari-1',
    'user-gonca-sari-60',
    'quiz-vue-test-027',
    '{"bugsFixed":4,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 03:49:34.286',
    TIMESTAMP '2025-11-02 03:49:34.286',
    TIMESTAMP '2025-11-02 03:49:34.286'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-test-027')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gonca-sari-2',
    'user-gonca-sari-60',
    'quiz-rn-live-083',
    '{"bugsFixed":4,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-03 06:05:42.641',
    TIMESTAMP '2025-11-03 06:05:42.641',
    TIMESTAMP '2025-11-03 06:05:42.641'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gonca-sari-3',
    'user-gonca-sari-60',
    'quiz-rn-bug-051',
    '{"bugsFixed":2,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 17:13:37.766',
    TIMESTAMP '2025-11-13 17:13:37.766',
    TIMESTAMP '2025-11-13 17:13:37.766'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-051')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ayse-kaplan-1',
    'user-ayse-kaplan-61',
    'quiz-rn-live-002',
    '{"bugsFixed":3,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 15:54:39.778',
    TIMESTAMP '2025-11-11 15:54:39.778',
    TIMESTAMP '2025-11-11 15:54:39.778'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ayse-kaplan-2',
    'user-ayse-kaplan-61',
    'quiz-rn-bug-097',
    '{"bugsFixed":3,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 03:25:46.142',
    TIMESTAMP '2025-11-10 03:25:46.142',
    TIMESTAMP '2025-11-10 03:25:46.142'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ayse-kaplan-3',
    'user-ayse-kaplan-61',
    'quiz-rn-test-001',
    '{"bugsFixed":4,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-29 00:34:51.556',
    TIMESTAMP '2025-10-29 00:34:51.556',
    TIMESTAMP '2025-10-29 00:34:51.556'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ayse-kaplan-4',
    'user-ayse-kaplan-61',
    'quiz-java-live-014',
    '{"bugsFixed":3,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 09:22:33.904',
    TIMESTAMP '2025-11-14 09:22:33.904',
    TIMESTAMP '2025-11-14 09:22:33.904'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-zeynep-ozcan-1',
    'user-zeynep-ozcan-62',
    'quiz-rn-bug-001',
    '{"bugsFixed":4,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 05:11:23.132',
    TIMESTAMP '2025-11-05 05:11:23.132',
    TIMESTAMP '2025-11-05 05:11:23.132'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-zeynep-ozcan-2',
    'user-zeynep-ozcan-62',
    'quiz-rn-test-056',
    '{"bugsFixed":2,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 19:20:49.360',
    TIMESTAMP '2025-11-13 19:20:49.360',
    TIMESTAMP '2025-11-13 19:20:49.360'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-zeynep-ozcan-3',
    'user-zeynep-ozcan-62',
    'quiz-java-live-067',
    '{"bugsFixed":2,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 06:30:07.279',
    TIMESTAMP '2025-11-09 06:30:07.279',
    TIMESTAMP '2025-11-09 06:30:07.279'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-elif-polat-1',
    'user-elif-polat-63',
    'quiz-rn-test-098',
    '{"bugsFixed":4,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 14:29:51.767',
    TIMESTAMP '2025-11-16 14:29:51.767',
    TIMESTAMP '2025-11-16 14:29:51.767'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-098')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-elif-polat-2',
    'user-elif-polat-63',
    'quiz-java-live-031',
    '{"bugsFixed":4,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 14:30:29.163',
    TIMESTAMP '2025-11-15 14:30:29.163',
    TIMESTAMP '2025-11-15 14:30:29.163'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-031')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-elif-polat-3',
    'user-elif-polat-63',
    'quiz-java-bug-049',
    '{"bugsFixed":4,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 03:27:19.315',
    TIMESTAMP '2025-11-11 03:27:19.315',
    TIMESTAMP '2025-11-11 03:27:19.315'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-049')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-elif-polat-4',
    'user-elif-polat-63',
    'quiz-java-test-044',
    '{"bugsFixed":4,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 06:22:28.538',
    TIMESTAMP '2025-11-07 06:22:28.538',
    TIMESTAMP '2025-11-07 06:22:28.538'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-044')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-elif-polat-5',
    'user-elif-polat-63',
    'quiz-go-live-040',
    '{"bugsFixed":4,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 02:08:05.066',
    TIMESTAMP '2025-11-10 02:08:05.066',
    TIMESTAMP '2025-11-10 02:08:05.066'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-elif-polat-6',
    'user-elif-polat-63',
    'quiz-go-bug-022',
    '{"bugsFixed":1,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 18:28:37.464',
    TIMESTAMP '2025-11-10 18:28:37.464',
    TIMESTAMP '2025-11-10 18:28:37.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-022')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-fatma-ozdemir-1',
    'user-fatma-ozdemir-64',
    'quiz-java-live-030',
    '{"bugsFixed":3,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 02:09:53.433',
    TIMESTAMP '2025-11-13 02:09:53.433',
    TIMESTAMP '2025-11-13 02:09:53.433'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-live-030')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-fatma-ozdemir-2',
    'user-fatma-ozdemir-64',
    'quiz-java-bug-045',
    '{"bugsFixed":3,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 15:39:04.285',
    TIMESTAMP '2025-11-07 15:39:04.285',
    TIMESTAMP '2025-11-07 15:39:04.285'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-045')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-fatma-ozdemir-3',
    'user-fatma-ozdemir-64',
    'quiz-java-test-013',
    '{"bugsFixed":3,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 01:59:13.631',
    TIMESTAMP '2025-11-08 01:59:13.631',
    TIMESTAMP '2025-11-08 01:59:13.631'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-fatma-ozdemir-4',
    'user-fatma-ozdemir-64',
    'quiz-go-live-043',
    '{"bugsFixed":3,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 11:38:19.445',
    TIMESTAMP '2025-11-12 11:38:19.445',
    TIMESTAMP '2025-11-12 11:38:19.445'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-043')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-fatma-ozdemir-5',
    'user-fatma-ozdemir-64',
    'quiz-go-bug-015',
    '{"bugsFixed":1,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 09:44:06.095',
    TIMESTAMP '2025-11-09 09:44:06.095',
    TIMESTAMP '2025-11-09 09:44:06.095'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-015')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-fatma-ozdemir-6',
    'user-fatma-ozdemir-64',
    'quiz-go-test-028',
    '{"bugsFixed":4,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 07:19:21.432',
    TIMESTAMP '2025-11-10 07:19:21.432',
    TIMESTAMP '2025-11-10 07:19:21.432'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-merve-kurt-1',
    'user-merve-kurt-65',
    'quiz-java-bug-005',
    '{"bugsFixed":4,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 20:17:47.310',
    TIMESTAMP '2025-11-04 20:17:47.310',
    TIMESTAMP '2025-11-04 20:17:47.310'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-005')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-merve-kurt-2',
    'user-merve-kurt-65',
    'quiz-java-test-084',
    '{"bugsFixed":1,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 13:34:48.470',
    TIMESTAMP '2025-11-14 13:34:48.470',
    TIMESTAMP '2025-11-14 13:34:48.470'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-084')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-merve-kurt-3',
    'user-merve-kurt-65',
    'quiz-go-live-051',
    '{"bugsFixed":4,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 03:44:13.121',
    TIMESTAMP '2025-11-08 03:44:13.121',
    TIMESTAMP '2025-11-08 03:44:13.121'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-051')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-merve-kurt-4',
    'user-merve-kurt-65',
    'quiz-go-bug-065',
    '{"bugsFixed":4,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 17:22:42.099',
    TIMESTAMP '2025-11-07 17:22:42.099',
    TIMESTAMP '2025-11-07 17:22:42.099'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-065')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-merve-kurt-5',
    'user-merve-kurt-65',
    'quiz-go-test-002',
    '{"bugsFixed":4,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 12:15:03.804',
    TIMESTAMP '2025-11-13 12:15:03.804',
    TIMESTAMP '2025-11-13 12:15:03.804'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-seda-koc-1',
    'user-seda-koc-66',
    'quiz-java-test-024',
    '{"bugsFixed":2,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-26 06:02:39.993',
    TIMESTAMP '2025-10-26 06:02:39.993',
    TIMESTAMP '2025-10-26 06:02:39.993'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-test-024')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-seda-koc-2',
    'user-seda-koc-66',
    'quiz-go-live-014',
    '{"bugsFixed":2,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 09:00:36.964',
    TIMESTAMP '2025-11-15 09:00:36.964',
    TIMESTAMP '2025-11-15 09:00:36.964'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-seda-koc-3',
    'user-seda-koc-66',
    'quiz-go-bug-080',
    '{"bugsFixed":1,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 23:51:31.622',
    TIMESTAMP '2025-11-14 23:51:31.622',
    TIMESTAMP '2025-11-14 23:51:31.622'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-080')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-seda-koc-4',
    'user-seda-koc-66',
    'quiz-go-test-047',
    '{"bugsFixed":4,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-23 02:49:26.838',
    TIMESTAMP '2025-10-23 02:49:26.838',
    TIMESTAMP '2025-10-23 02:49:26.838'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-derya-kara-1',
    'user-derya-kara-67',
    'quiz-go-live-013',
    '{"bugsFixed":1,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 07:02:31.787',
    TIMESTAMP '2025-11-14 07:02:31.787',
    TIMESTAMP '2025-11-14 07:02:31.787'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-013')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-derya-kara-2',
    'user-derya-kara-67',
    'quiz-go-bug-066',
    '{"bugsFixed":2,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 15:37:09.932',
    TIMESTAMP '2025-11-10 15:37:09.932',
    TIMESTAMP '2025-11-10 15:37:09.932'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-derya-kara-3',
    'user-derya-kara-67',
    'quiz-go-test-007',
    '{"bugsFixed":3,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 14:56:15.545',
    TIMESTAMP '2025-11-14 14:56:15.545',
    TIMESTAMP '2025-11-14 14:56:15.545'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-007')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-aslan-1',
    'user-gizem-aslan-68',
    'quiz-go-bug-034',
    '{"bugsFixed":3,"codeQuality":88}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 09:43:26.159',
    TIMESTAMP '2025-11-08 09:43:26.159',
    TIMESTAMP '2025-11-08 09:43:26.159'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-bug-034')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-aslan-2',
    'user-gizem-aslan-68',
    'quiz-go-test-017',
    '{"bugsFixed":1,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 00:25:59.171',
    TIMESTAMP '2025-11-04 00:25:59.171',
    TIMESTAMP '2025-11-04 00:25:59.171'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-aslan-3',
    'user-gizem-aslan-68',
    'quiz-dotnet-live-038',
    '{"bugsFixed":4,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 23:03:18.342',
    TIMESTAMP '2025-11-06 23:03:18.342',
    TIMESTAMP '2025-11-06 23:03:18.342'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-aslan-4',
    'user-gizem-aslan-68',
    'quiz-dotnet-bug-100',
    '{"bugsFixed":1,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 12:19:18.967',
    TIMESTAMP '2025-11-15 12:19:18.967',
    TIMESTAMP '2025-11-15 12:19:18.967'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-100')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-aslan-5',
    'user-gizem-aslan-68',
    'quiz-dotnet-test-080',
    '{"bugsFixed":3,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 08:10:58.646',
    TIMESTAMP '2025-11-15 08:10:58.646',
    TIMESTAMP '2025-11-15 08:10:58.646'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-gizem-aslan-6',
    'user-gizem-aslan-68',
    'quiz-react-adv-live-018',
    '{"bugsFixed":2,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 23:05:56.067',
    TIMESTAMP '2025-11-10 23:05:56.067',
    TIMESTAMP '2025-11-10 23:05:56.067'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-018')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-kilic-1',
    'user-busra-kilic-69',
    'quiz-go-test-074',
    '{"bugsFixed":3,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 14:09:07.600',
    TIMESTAMP '2025-11-09 14:09:07.600',
    TIMESTAMP '2025-11-09 14:09:07.600'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-kilic-2',
    'user-busra-kilic-69',
    'quiz-dotnet-live-007',
    '{"bugsFixed":4,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 13:22:43.807',
    TIMESTAMP '2025-11-11 13:22:43.807',
    TIMESTAMP '2025-11-11 13:22:43.807'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-007')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-busra-kilic-3',
    'user-busra-kilic-69',
    'quiz-dotnet-bug-023',
    '{"bugsFixed":1,"codeQuality":76}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-31 05:44:48.317',
    TIMESTAMP '2025-10-31 05:44:48.317',
    TIMESTAMP '2025-10-31 05:44:48.317'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-023')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-dogan-1',
    'user-sibel-dogan-70',
    'quiz-dotnet-live-074',
    '{"bugsFixed":1,"codeQuality":89}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-04 12:55:37.539',
    TIMESTAMP '2025-11-04 12:55:37.539',
    TIMESTAMP '2025-11-04 12:55:37.539'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-live-074')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-dogan-2',
    'user-sibel-dogan-70',
    'quiz-dotnet-bug-041',
    '{"bugsFixed":1,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 08:54:38.607',
    TIMESTAMP '2025-11-02 08:54:38.607',
    TIMESTAMP '2025-11-02 08:54:38.607'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-041')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sibel-dogan-3',
    'user-sibel-dogan-70',
    'quiz-dotnet-test-072',
    '{"bugsFixed":3,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 09:46:05.023',
    TIMESTAMP '2025-11-09 09:46:05.023',
    TIMESTAMP '2025-11-09 09:46:05.023'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-072')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ece-arslan-1',
    'user-ece-arslan-71',
    'quiz-dotnet-bug-027',
    '{"bugsFixed":1,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-08 22:44:33.216',
    TIMESTAMP '2025-11-08 22:44:33.216',
    TIMESTAMP '2025-11-08 22:44:33.216'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ece-arslan-2',
    'user-ece-arslan-71',
    'quiz-dotnet-test-039',
    '{"bugsFixed":2,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-09 14:56:27.637',
    TIMESTAMP '2025-11-09 14:56:27.637',
    TIMESTAMP '2025-11-09 14:56:27.637'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-ece-arslan-3',
    'user-ece-arslan-71',
    'quiz-react-adv-live-034',
    '{"bugsFixed":1,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 19:23:09.209',
    TIMESTAMP '2025-11-05 19:23:09.209',
    TIMESTAMP '2025-11-05 19:23:09.209'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-034')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-pelin-ozturk-1',
    'user-pelin-ozturk-72',
    'quiz-dotnet-test-021',
    '{"bugsFixed":2,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 14:50:27.860',
    TIMESTAMP '2025-11-14 14:50:27.860',
    TIMESTAMP '2025-11-14 14:50:27.860'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-test-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-pelin-ozturk-2',
    'user-pelin-ozturk-72',
    'quiz-react-adv-live-019',
    '{"bugsFixed":2,"codeQuality":87}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 20:59:56.293',
    TIMESTAMP '2025-11-07 20:59:56.293',
    TIMESTAMP '2025-11-07 20:59:56.293'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-pelin-ozturk-3',
    'user-pelin-ozturk-72',
    'quiz-react-adv-bug-008',
    '{"bugsFixed":3,"codeQuality":77}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 01:21:14.897',
    TIMESTAMP '2025-11-10 01:21:14.897',
    TIMESTAMP '2025-11-10 01:21:14.897'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-008')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-pelin-ozturk-4',
    'user-pelin-ozturk-72',
    'quiz-react-adv-test-046',
    '{"bugsFixed":1,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 00:00:00.505',
    TIMESTAMP '2025-11-10 00:00:00.505',
    TIMESTAMP '2025-11-10 00:00:00.505'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-046')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-aydin-1',
    'user-hande-aydin-73',
    'quiz-react-adv-live-009',
    '{"bugsFixed":2,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-30 18:07:36.458',
    TIMESTAMP '2025-10-30 18:07:36.458',
    TIMESTAMP '2025-10-30 18:07:36.458'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-009')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-aydin-2',
    'user-hande-aydin-73',
    'quiz-react-adv-bug-014',
    '{"bugsFixed":3,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 05:10:24.669',
    TIMESTAMP '2025-11-02 05:10:24.669',
    TIMESTAMP '2025-11-02 05:10:24.669'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-014')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-hande-aydin-3',
    'user-hande-aydin-73',
    'quiz-react-adv-test-039',
    '{"bugsFixed":1,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-29 15:13:10.210',
    TIMESTAMP '2025-10-29 15:13:10.210',
    TIMESTAMP '2025-10-29 15:13:10.210'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-yildirim-1',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-bug-035',
    '{"bugsFixed":2,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-27 11:29:26.915',
    TIMESTAMP '2025-10-27 11:29:26.915',
    TIMESTAMP '2025-10-27 11:29:26.915'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-bug-035')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-yildirim-2',
    'user-sevgi-yildirim-74',
    'quiz-react-adv-test-022',
    '{"bugsFixed":1,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 15:53:13.278',
    TIMESTAMP '2025-11-15 15:53:13.278',
    TIMESTAMP '2025-11-15 15:53:13.278'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-022')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-yildirim-3',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-live-021',
    '{"bugsFixed":2,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 21:44:21.113',
    TIMESTAMP '2025-11-02 21:44:21.113',
    TIMESTAMP '2025-11-02 21:44:21.113'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-021')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-yildirim-4',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-bug-037',
    '{"bugsFixed":1,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 02:22:53.024',
    TIMESTAMP '2025-11-14 02:22:53.024',
    TIMESTAMP '2025-11-14 02:22:53.024'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-yildirim-5',
    'user-sevgi-yildirim-74',
    'quiz-flutter-adv-test-040',
    '{"bugsFixed":2,"codeQuality":79}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 00:46:00.995',
    TIMESTAMP '2025-11-02 00:46:00.995',
    TIMESTAMP '2025-11-02 00:46:00.995'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-040')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-sevgi-yildirim-6',
    'user-sevgi-yildirim-74',
    'quiz-node-adv-live-014',
    '{"bugsFixed":4,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-10-23 06:28:15.307',
    TIMESTAMP '2025-10-23 06:28:15.307',
    TIMESTAMP '2025-10-23 06:28:15.307'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-yildiz-1',
    'user-i-rem-yildiz-75',
    'quiz-react-adv-test-020',
    '{"bugsFixed":3,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 21:57:58.297',
    TIMESTAMP '2025-11-12 21:57:58.297',
    TIMESTAMP '2025-11-12 21:57:58.297'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-yildiz-2',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-live-044',
    '{"bugsFixed":2,"codeQuality":72}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 10:09:22.737',
    TIMESTAMP '2025-11-14 10:09:22.737',
    TIMESTAMP '2025-11-14 10:09:22.737'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-044')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-yildiz-3',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-bug-027',
    '{"bugsFixed":2,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 07:01:04.091',
    TIMESTAMP '2025-11-16 07:01:04.091',
    TIMESTAMP '2025-11-16 07:01:04.091'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-yildiz-4',
    'user-i-rem-yildiz-75',
    'quiz-flutter-adv-test-037',
    '{"bugsFixed":1,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 06:46:38.859',
    TIMESTAMP '2025-11-15 06:46:38.859',
    TIMESTAMP '2025-11-15 06:46:38.859'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-037')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-i-rem-yildiz-5',
    'user-i-rem-yildiz-75',
    'quiz-node-adv-live-028',
    '{"bugsFixed":4,"codeQuality":81}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 03:19:04.569',
    TIMESTAMP '2025-11-12 03:19:04.569',
    TIMESTAMP '2025-11-12 03:19:04.569'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-028')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-celik-1',
    'user-tugce-celik-76',
    'quiz-flutter-adv-live-036',
    '{"bugsFixed":1,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-13 22:14:45.174',
    TIMESTAMP '2025-11-13 22:14:45.174',
    TIMESTAMP '2025-11-13 22:14:45.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-celik-2',
    'user-tugce-celik-76',
    'quiz-flutter-adv-bug-011',
    '{"bugsFixed":1,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 21:49:01.464',
    TIMESTAMP '2025-11-15 21:49:01.464',
    TIMESTAMP '2025-11-15 21:49:01.464'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-011')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-celik-3',
    'user-tugce-celik-76',
    'quiz-flutter-adv-test-020',
    '{"bugsFixed":3,"codeQuality":94}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 20:30:59.141',
    TIMESTAMP '2025-11-15 20:30:59.141',
    TIMESTAMP '2025-11-15 20:30:59.141'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-020')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-celik-4',
    'user-tugce-celik-76',
    'quiz-node-adv-live-014',
    '{"bugsFixed":1,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 21:42:54.606',
    TIMESTAMP '2025-11-15 21:42:54.606',
    TIMESTAMP '2025-11-15 21:42:54.606'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-014')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-tugce-celik-5',
    'user-tugce-celik-76',
    'quiz-node-adv-bug-042',
    '{"bugsFixed":1,"codeQuality":91}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 13:39:32.182',
    TIMESTAMP '2025-11-12 13:39:32.182',
    TIMESTAMP '2025-11-12 13:39:32.182'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-042')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-sahin-1',
    'user-asli-sahin-77',
    'quiz-flutter-adv-bug-019',
    '{"bugsFixed":4,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-07 15:56:06.497',
    TIMESTAMP '2025-11-07 15:56:06.497',
    TIMESTAMP '2025-11-07 15:56:06.497'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-019')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-sahin-2',
    'user-asli-sahin-77',
    'quiz-flutter-adv-test-017',
    '{"bugsFixed":4,"codeQuality":90}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-06 04:53:25.981',
    TIMESTAMP '2025-11-06 04:53:25.981',
    TIMESTAMP '2025-11-06 04:53:25.981'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-sahin-3',
    'user-asli-sahin-77',
    'quiz-node-adv-live-036',
    '{"bugsFixed":2,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-02 03:01:35.264',
    TIMESTAMP '2025-11-02 03:01:35.264',
    TIMESTAMP '2025-11-02 03:01:35.264'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-sahin-4',
    'user-asli-sahin-77',
    'quiz-node-adv-bug-043',
    '{"bugsFixed":1,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-05 17:40:03.102',
    TIMESTAMP '2025-11-05 17:40:03.102',
    TIMESTAMP '2025-11-05 17:40:03.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-sahin-5',
    'user-asli-sahin-77',
    'quiz-node-adv-test-017',
    '{"bugsFixed":4,"codeQuality":74}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 02:52:14.199',
    TIMESTAMP '2025-11-01 02:52:14.199',
    TIMESTAMP '2025-11-01 02:52:14.199'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-017')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-asli-sahin-6',
    'user-asli-sahin-77',
    'quiz-python-adv-live-025',
    '{"bugsFixed":2,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-01 07:16:49.567',
    TIMESTAMP '2025-11-01 07:16:49.567',
    TIMESTAMP '2025-11-01 07:16:49.567'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-025')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nisan-demir-1',
    'user-nisan-demir-78',
    'quiz-flutter-adv-test-013',
    '{"bugsFixed":1,"codeQuality":83}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 16:14:11.093',
    TIMESTAMP '2025-11-15 16:14:11.093',
    TIMESTAMP '2025-11-15 16:14:11.093'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-test-013')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nisan-demir-2',
    'user-nisan-demir-78',
    'quiz-node-adv-live-019',
    '{"bugsFixed":2,"codeQuality":92}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 09:06:49.256',
    TIMESTAMP '2025-11-12 09:06:49.256',
    TIMESTAMP '2025-11-12 09:06:49.256'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-nisan-demir-3',
    'user-nisan-demir-78',
    'quiz-node-adv-bug-043',
    '{"bugsFixed":3,"codeQuality":95}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 20:17:39.566',
    TIMESTAMP '2025-11-15 20:17:39.566',
    TIMESTAMP '2025-11-15 20:17:39.566'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-kaya-1',
    'user-melis-kaya-79',
    'quiz-node-adv-live-040',
    '{"bugsFixed":2,"codeQuality":75}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 13:36:54.450',
    TIMESTAMP '2025-11-15 13:36:54.450',
    TIMESTAMP '2025-11-15 13:36:54.450'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-040')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-kaya-2',
    'user-melis-kaya-79',
    'quiz-node-adv-bug-036',
    '{"bugsFixed":4,"codeQuality":93}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 16:34:45.122',
    TIMESTAMP '2025-11-15 16:34:45.122',
    TIMESTAMP '2025-11-15 16:34:45.122'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-kaya-3',
    'user-melis-kaya-79',
    'quiz-node-adv-test-002',
    '{"bugsFixed":3,"codeQuality":85}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 11:03:37.588',
    TIMESTAMP '2025-11-16 11:03:37.588',
    TIMESTAMP '2025-11-16 11:03:37.588'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-002')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-kaya-4',
    'user-melis-kaya-79',
    'quiz-python-adv-live-006',
    '{"bugsFixed":2,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 11:14:00.117',
    TIMESTAMP '2025-11-15 11:14:00.117',
    TIMESTAMP '2025-11-15 11:14:00.117'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-006')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-kaya-5',
    'user-melis-kaya-79',
    'quiz-python-adv-bug-044',
    '{"bugsFixed":3,"codeQuality":73}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 12:02:57.143',
    TIMESTAMP '2025-11-14 12:02:57.143',
    TIMESTAMP '2025-11-14 12:02:57.143'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-044')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-melis-kaya-6',
    'user-melis-kaya-79',
    'quiz-python-adv-test-025',
    '{"bugsFixed":1,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-15 16:21:48.503',
    TIMESTAMP '2025-11-15 16:21:48.503',
    TIMESTAMP '2025-11-15 16:21:48.503'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-025')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-yilmaz-1',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-bug-024',
    '{"bugsFixed":1,"codeQuality":71}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 20:25:33.393',
    TIMESTAMP '2025-11-12 20:25:33.393',
    TIMESTAMP '2025-11-12 20:25:33.393'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-bug-024')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-yilmaz-2',
    'user-cansu-yilmaz-80',
    'quiz-node-adv-test-004',
    '{"bugsFixed":3,"codeQuality":78}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-11 05:40:08.333',
    TIMESTAMP '2025-11-11 05:40:08.333',
    TIMESTAMP '2025-11-11 05:40:08.333'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-004')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-yilmaz-3',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-live-003',
    '{"bugsFixed":4,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-10 14:23:38.905',
    TIMESTAMP '2025-11-10 14:23:38.905',
    TIMESTAMP '2025-11-10 14:23:38.905'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-live-003')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-yilmaz-4',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-bug-001',
    '{"bugsFixed":1,"codeQuality":84}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-16 09:28:33.111',
    TIMESTAMP '2025-11-16 09:28:33.111',
    TIMESTAMP '2025-11-16 09:28:33.111'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-001')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-yilmaz-5',
    'user-cansu-yilmaz-80',
    'quiz-python-adv-test-039',
    '{"bugsFixed":1,"codeQuality":80}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-12 15:02:45.984',
    TIMESTAMP '2025-11-12 15:02:45.984',
    TIMESTAMP '2025-11-12 15:02:45.984'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'bugfix-cansu-yilmaz-6',
    'user-cansu-yilmaz-80',
    'quiz-react-live-020',
    '{"bugsFixed":1,"codeQuality":82}'::jsonb,
    NULL,
    '{"risk":"low"}'::jsonb,
    TIMESTAMP '2025-11-14 08:41:42.550',
    TIMESTAMP '2025-11-14 08:41:42.550',
    TIMESTAMP '2025-11-14 08:41:42.550'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-020')
ON CONFLICT DO NOTHING;

-- Insert hackathon attempts (only if quiz exists)
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-mehmet-keskin-1',
    'user-mehmet-keskin-1',
    'quiz-react-live-099',
    'hackathon-spring-2025',
    '{"projectScore":80,"featuresCompleted":5,"codeQuality":87,"award":"winner"}'::jsonb,
    'https://github.com/mehmet-keskin/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-14 05:36:12.894',
    TIMESTAMP '2025-11-14 05:36:12.894',
    TIMESTAMP '2025-11-14 05:36:12.894'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-099')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-ahmet-avci-1',
    'user-ahmet-avci-2',
    'quiz-react-test-058',
    'hackathon-fall-2025',
    '{"projectScore":87,"featuresCompleted":3,"codeQuality":74,"award":"participant"}'::jsonb,
    'https://github.com/ahmet-avci/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-14 16:45:05.581',
    TIMESTAMP '2025-11-14 16:45:05.581',
    TIMESTAMP '2025-11-14 16:45:05.581'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-058')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-mustafa-bulut-1',
    'user-mustafa-bulut-3',
    'quiz-flutter-bug-046',
    'hackathon-fall-2025',
    '{"projectScore":76,"featuresCompleted":3,"codeQuality":78,"award":"participant"}'::jsonb,
    'https://github.com/mustafa-bulut/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-10-25 10:57:49.949',
    TIMESTAMP '2025-10-25 10:57:49.949',
    TIMESTAMP '2025-10-25 10:57:49.949'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-046')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-huseyin-erdogan-1',
    'user-huseyin-erdogan-4',
    'quiz-node-live-045',
    'hackathon-spring-2025',
    '{"projectScore":75,"featuresCompleted":6,"codeQuality":73,"award":"winner"}'::jsonb,
    'https://github.com/huseyin-erdogan/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-01 00:20:27.190',
    TIMESTAMP '2025-11-01 00:20:27.190',
    TIMESTAMP '2025-11-01 00:20:27.190'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-045')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-emre-aksoy-1',
    'user-emre-aksoy-5',
    'quiz-node-test-080',
    'hackathon-fall-2025',
    '{"projectScore":88,"featuresCompleted":4,"codeQuality":72,"award":"participant"}'::jsonb,
    'https://github.com/emre-aksoy/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-12 22:37:29.158',
    TIMESTAMP '2025-11-12 22:37:29.158',
    TIMESTAMP '2025-11-12 22:37:29.158'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-080')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-burak-bozkurt-1',
    'user-burak-bozkurt-6',
    'quiz-python-bug-058',
    'hackathon-fall-2025',
    '{"projectScore":98,"featuresCompleted":4,"codeQuality":92,"award":"participant"}'::jsonb,
    'https://github.com/burak-bozkurt/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-10 03:37:04.291',
    TIMESTAMP '2025-11-10 03:37:04.291',
    TIMESTAMP '2025-11-10 03:37:04.291'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-058')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-cem-gunes-1',
    'user-cem-gunes-7',
    'quiz-angular-live-079',
    'hackathon-fall-2025',
    '{"projectScore":97,"featuresCompleted":6,"codeQuality":74,"award":"participant"}'::jsonb,
    'https://github.com/cem-gunes/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-12 16:16:42.493',
    TIMESTAMP '2025-11-12 16:16:42.493',
    TIMESTAMP '2025-11-12 16:16:42.493'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-079')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-can-tas-1',
    'user-can-tas-8',
    'quiz-angular-test-026',
    'hackathon-fall-2025',
    '{"projectScore":79,"featuresCompleted":4,"codeQuality":95,"award":"participant"}'::jsonb,
    'https://github.com/can-tas/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 12:26:32.997',
    TIMESTAMP '2025-11-16 12:26:32.997',
    TIMESTAMP '2025-11-16 12:26:32.997'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-026')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-ozan-tekin-1',
    'user-ozan-tekin-9',
    'quiz-vue-bug-014',
    'hackathon-fall-2025',
    '{"projectScore":99,"featuresCompleted":5,"codeQuality":75,"award":"participant"}'::jsonb,
    'https://github.com/ozan-tekin/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 05:56:24.933',
    TIMESTAMP '2025-11-16 05:56:24.933',
    TIMESTAMP '2025-11-16 05:56:24.933'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-014')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-eren-sari-1',
    'user-eren-sari-10',
    'quiz-rn-live-041',
    'hackathon-fall-2025',
    '{"projectScore":94,"featuresCompleted":6,"codeQuality":92,"award":"participant"}'::jsonb,
    'https://github.com/eren-sari/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-05 04:29:49.059',
    TIMESTAMP '2025-11-05 04:29:49.059',
    TIMESTAMP '2025-11-05 04:29:49.059'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-041')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-deniz-kaplan-1',
    'user-deniz-kaplan-11',
    'quiz-rn-test-078',
    'hackathon-fall-2025',
    '{"projectScore":80,"featuresCompleted":3,"codeQuality":84,"award":"participant"}'::jsonb,
    'https://github.com/deniz-kaplan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-14 12:16:36.716',
    TIMESTAMP '2025-11-14 12:16:36.716',
    TIMESTAMP '2025-11-14 12:16:36.716'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-078')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-hakan-ozcan-1',
    'user-hakan-ozcan-12',
    'quiz-java-bug-050',
    'hackathon-spring-2025',
    '{"projectScore":95,"featuresCompleted":5,"codeQuality":91,"award":"winner"}'::jsonb,
    'https://github.com/hakan-ozcan/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-15 14:44:03.241',
    TIMESTAMP '2025-11-15 14:44:03.241',
    TIMESTAMP '2025-11-15 14:44:03.241'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-050')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-onur-polat-1',
    'user-onur-polat-13',
    'quiz-go-live-019',
    'hackathon-fall-2025',
    '{"projectScore":89,"featuresCompleted":5,"codeQuality":76,"award":"participant"}'::jsonb,
    'https://github.com/onur-polat/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-13 21:59:24.252',
    TIMESTAMP '2025-11-13 21:59:24.252',
    TIMESTAMP '2025-11-13 21:59:24.252'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-019')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-tolga-ozdemir-1',
    'user-tolga-ozdemir-14',
    'quiz-go-test-087',
    'hackathon-fall-2025',
    '{"projectScore":90,"featuresCompleted":3,"codeQuality":90,"award":"participant"}'::jsonb,
    'https://github.com/tolga-ozdemir/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 15:00:42.700',
    TIMESTAMP '2025-11-16 15:00:42.700',
    TIMESTAMP '2025-11-16 15:00:42.700'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-087')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-yasin-kurt-1',
    'user-yasin-kurt-15',
    'quiz-dotnet-bug-081',
    'hackathon-spring-2025',
    '{"projectScore":82,"featuresCompleted":5,"codeQuality":73,"award":"winner"}'::jsonb,
    'https://github.com/yasin-kurt/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-14 23:35:46.078',
    TIMESTAMP '2025-11-14 23:35:46.078',
    TIMESTAMP '2025-11-14 23:35:46.078'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-081')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-kerem-koc-1',
    'user-kerem-koc-16',
    'quiz-react-adv-live-036',
    'hackathon-spring-2025',
    '{"projectScore":81,"featuresCompleted":6,"codeQuality":81,"award":"winner"}'::jsonb,
    'https://github.com/kerem-koc/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-16 09:05:06.382',
    TIMESTAMP '2025-11-16 09:05:06.382',
    TIMESTAMP '2025-11-16 09:05:06.382'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-036')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-umut-kara-1',
    'user-umut-kara-17',
    'quiz-react-adv-test-047',
    'hackathon-fall-2025',
    '{"projectScore":97,"featuresCompleted":6,"codeQuality":87,"award":"participant"}'::jsonb,
    'https://github.com/umut-kara/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-15 03:37:31.559',
    TIMESTAMP '2025-11-15 03:37:31.559',
    TIMESTAMP '2025-11-15 03:37:31.559'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-047')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-murat-aslan-1',
    'user-murat-aslan-18',
    'quiz-flutter-adv-bug-035',
    'hackathon-fall-2025',
    '{"projectScore":77,"featuresCompleted":4,"codeQuality":79,"award":"participant"}'::jsonb,
    'https://github.com/murat-aslan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 11:15:28.631',
    TIMESTAMP '2025-11-16 11:15:28.631',
    TIMESTAMP '2025-11-16 11:15:28.631'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-035')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-gokhan-kilic-1',
    'user-gokhan-kilic-19',
    'quiz-node-adv-live-012',
    'hackathon-fall-2025',
    '{"projectScore":82,"featuresCompleted":5,"codeQuality":74,"award":"participant"}'::jsonb,
    'https://github.com/gokhan-kilic/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-10 22:18:32.174',
    TIMESTAMP '2025-11-10 22:18:32.174',
    TIMESTAMP '2025-11-10 22:18:32.174'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-kaan-dogan-1',
    'user-kaan-dogan-20',
    'quiz-node-adv-test-028',
    'hackathon-spring-2025',
    '{"projectScore":75,"featuresCompleted":4,"codeQuality":92,"award":"winner"}'::jsonb,
    'https://github.com/kaan-dogan/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-15 21:36:02.574',
    TIMESTAMP '2025-11-15 21:36:02.574',
    TIMESTAMP '2025-11-15 21:36:02.574'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-028')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-baran-arslan-1',
    'user-baran-arslan-21',
    'quiz-python-adv-bug-048',
    'hackathon-spring-2025',
    '{"projectScore":80,"featuresCompleted":3,"codeQuality":83,"award":"winner"}'::jsonb,
    'https://github.com/baran-arslan/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-04 05:18:23.369',
    TIMESTAMP '2025-11-04 05:18:23.369',
    TIMESTAMP '2025-11-04 05:18:23.369'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-048')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-bora-ozturk-1',
    'user-bora-ozturk-22',
    'quiz-react-live-016',
    'hackathon-fall-2025',
    '{"projectScore":92,"featuresCompleted":3,"codeQuality":74,"award":"participant"}'::jsonb,
    'https://github.com/bora-ozturk/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-04 07:50:11.189',
    TIMESTAMP '2025-11-04 07:50:11.189',
    TIMESTAMP '2025-11-04 07:50:11.189'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-016')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-halil-aydin-1',
    'user-halil-aydin-23',
    'quiz-react-test-090',
    'hackathon-fall-2025',
    '{"projectScore":95,"featuresCompleted":3,"codeQuality":79,"award":"participant"}'::jsonb,
    'https://github.com/halil-aydin/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-15 08:59:35.023',
    TIMESTAMP '2025-11-15 08:59:35.023',
    TIMESTAMP '2025-11-15 08:59:35.023'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-090')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-suat-yildirim-1',
    'user-suat-yildirim-24',
    'quiz-flutter-bug-037',
    'hackathon-fall-2025',
    '{"projectScore":90,"featuresCompleted":3,"codeQuality":93,"award":"participant"}'::jsonb,
    'https://github.com/suat-yildirim/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 02:22:23.889',
    TIMESTAMP '2025-11-16 02:22:23.889',
    TIMESTAMP '2025-11-16 02:22:23.889'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-037')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-serkan-yildiz-1',
    'user-serkan-yildiz-25',
    'quiz-node-live-043',
    'hackathon-fall-2025',
    '{"projectScore":82,"featuresCompleted":3,"codeQuality":89,"award":"participant"}'::jsonb,
    'https://github.com/serkan-yildiz/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-15 14:07:13.346',
    TIMESTAMP '2025-11-15 14:07:13.346',
    TIMESTAMP '2025-11-15 14:07:13.346'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-043')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-berk-celik-1',
    'user-berk-celik-26',
    'quiz-node-test-056',
    'hackathon-fall-2025',
    '{"projectScore":92,"featuresCompleted":5,"codeQuality":89,"award":"participant"}'::jsonb,
    'https://github.com/berk-celik/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-10-29 22:20:09.131',
    TIMESTAMP '2025-10-29 22:20:09.131',
    TIMESTAMP '2025-10-29 22:20:09.131'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-056')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-mert-sahin-1',
    'user-mert-sahin-27',
    'quiz-python-bug-026',
    'hackathon-fall-2025',
    '{"projectScore":92,"featuresCompleted":6,"codeQuality":88,"award":"participant"}'::jsonb,
    'https://github.com/mert-sahin/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-09 11:25:00.809',
    TIMESTAMP '2025-11-09 11:25:00.809',
    TIMESTAMP '2025-11-09 11:25:00.809'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-026')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-kadir-demir-1',
    'user-kadir-demir-28',
    'quiz-angular-live-018',
    'hackathon-spring-2025',
    '{"projectScore":88,"featuresCompleted":3,"codeQuality":74,"award":"winner"}'::jsonb,
    'https://github.com/kadir-demir/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-14 12:32:54.338',
    TIMESTAMP '2025-11-14 12:32:54.338',
    TIMESTAMP '2025-11-14 12:32:54.338'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-018')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-furkan-kaya-1',
    'user-furkan-kaya-29',
    'quiz-angular-test-057',
    'hackathon-fall-2025',
    '{"projectScore":78,"featuresCompleted":5,"codeQuality":71,"award":"participant"}'::jsonb,
    'https://github.com/furkan-kaya/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-10 19:18:14.181',
    TIMESTAMP '2025-11-10 19:18:14.181',
    TIMESTAMP '2025-11-10 19:18:14.181'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-057')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-cagri-yilmaz-1',
    'user-cagri-yilmaz-30',
    'quiz-vue-bug-090',
    'hackathon-fall-2025',
    '{"projectScore":75,"featuresCompleted":4,"codeQuality":70,"award":"participant"}'::jsonb,
    'https://github.com/cagri-yilmaz/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-05 05:13:07.138',
    TIMESTAMP '2025-11-05 05:13:07.138',
    TIMESTAMP '2025-11-05 05:13:07.138'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-090')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-mehmet-oz-1',
    'user-mehmet-oz-31',
    'quiz-rn-live-020',
    'hackathon-spring-2025',
    '{"projectScore":84,"featuresCompleted":4,"codeQuality":85,"award":"winner"}'::jsonb,
    'https://github.com/mehmet-oz/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-16 12:02:58.696',
    TIMESTAMP '2025-11-16 12:02:58.696',
    TIMESTAMP '2025-11-16 12:02:58.696'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-020')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-ahmet-gokmen-1',
    'user-ahmet-gokmen-32',
    'quiz-rn-test-027',
    'hackathon-spring-2025',
    '{"projectScore":80,"featuresCompleted":5,"codeQuality":92,"award":"winner"}'::jsonb,
    'https://github.com/ahmet-gokmen/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-10-31 01:28:22.399',
    TIMESTAMP '2025-10-31 01:28:22.399',
    TIMESTAMP '2025-10-31 01:28:22.399'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-027')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-mustafa-kuzu-1',
    'user-mustafa-kuzu-33',
    'quiz-java-bug-086',
    'hackathon-fall-2025',
    '{"projectScore":93,"featuresCompleted":4,"codeQuality":76,"award":"participant"}'::jsonb,
    'https://github.com/mustafa-kuzu/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 01:18:20.968',
    TIMESTAMP '2025-11-16 01:18:20.968',
    TIMESTAMP '2025-11-16 01:18:20.968'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-086')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-huseyin-karaca-1',
    'user-huseyin-karaca-34',
    'quiz-go-live-066',
    'hackathon-spring-2025',
    '{"projectScore":91,"featuresCompleted":6,"codeQuality":81,"award":"winner"}'::jsonb,
    'https://github.com/huseyin-karaca/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-13 14:52:06.907',
    TIMESTAMP '2025-11-13 14:52:06.907',
    TIMESTAMP '2025-11-13 14:52:06.907'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-066')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-emre-duman-1',
    'user-emre-duman-35',
    'quiz-go-test-011',
    'hackathon-fall-2025',
    '{"projectScore":85,"featuresCompleted":4,"codeQuality":85,"award":"participant"}'::jsonb,
    'https://github.com/emre-duman/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-10-25 11:52:46.382',
    TIMESTAMP '2025-10-25 11:52:46.382',
    TIMESTAMP '2025-10-25 11:52:46.382'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-011')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-burak-oztuna-1',
    'user-burak-oztuna-36',
    'quiz-dotnet-bug-066',
    'hackathon-fall-2025',
    '{"projectScore":79,"featuresCompleted":3,"codeQuality":84,"award":"participant"}'::jsonb,
    'https://github.com/burak-oztuna/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-10-31 09:59:00.615',
    TIMESTAMP '2025-10-31 09:59:00.615',
    TIMESTAMP '2025-10-31 09:59:00.615'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-066')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-derya-toprak-1',
    'user-derya-toprak-37',
    'quiz-react-adv-live-045',
    'hackathon-fall-2025',
    '{"projectScore":86,"featuresCompleted":5,"codeQuality":88,"award":"participant"}'::jsonb,
    'https://github.com/derya-toprak/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-15 12:44:38.654',
    TIMESTAMP '2025-11-15 12:44:38.654',
    TIMESTAMP '2025-11-15 12:44:38.654'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-045')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-gizem-bayrak-1',
    'user-gizem-bayrak-38',
    'quiz-react-adv-test-050',
    'hackathon-spring-2025',
    '{"projectScore":79,"featuresCompleted":4,"codeQuality":77,"award":"winner"}'::jsonb,
    'https://github.com/gizem-bayrak/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-10-29 21:12:36.499',
    TIMESTAMP '2025-10-29 21:12:36.499',
    TIMESTAMP '2025-10-29 21:12:36.499'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-050')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-busra-erdogdu-1',
    'user-busra-erdogdu-39',
    'quiz-flutter-adv-bug-033',
    'hackathon-spring-2025',
    '{"projectScore":85,"featuresCompleted":4,"codeQuality":91,"award":"winner"}'::jsonb,
    'https://github.com/busra-erdogdu/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-14 10:41:57.402',
    TIMESTAMP '2025-11-14 10:41:57.402',
    TIMESTAMP '2025-11-14 10:41:57.402'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-033')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-sibel-ozkan-1',
    'user-sibel-ozkan-40',
    'quiz-node-adv-live-007',
    'hackathon-fall-2025',
    '{"projectScore":99,"featuresCompleted":6,"codeQuality":75,"award":"participant"}'::jsonb,
    'https://github.com/sibel-ozkan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-10-29 18:17:13.558',
    TIMESTAMP '2025-10-29 18:17:13.558',
    TIMESTAMP '2025-10-29 18:17:13.558'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-007')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-ece-ucar-1',
    'user-ece-ucar-41',
    'quiz-node-adv-test-044',
    'hackathon-spring-2025',
    '{"projectScore":90,"featuresCompleted":5,"codeQuality":84,"award":"winner"}'::jsonb,
    'https://github.com/ece-ucar/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-08 01:04:36.348',
    TIMESTAMP '2025-11-08 01:04:36.348',
    TIMESTAMP '2025-11-08 01:04:36.348'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-044')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-pelin-bal-1',
    'user-pelin-bal-42',
    'quiz-python-adv-bug-027',
    'hackathon-spring-2025',
    '{"projectScore":91,"featuresCompleted":4,"codeQuality":88,"award":"winner"}'::jsonb,
    'https://github.com/pelin-bal/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-16 03:58:19.742',
    TIMESTAMP '2025-11-16 03:58:19.742',
    TIMESTAMP '2025-11-16 03:58:19.742'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-027')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-hande-karaaslan-1',
    'user-hande-karaaslan-43',
    'quiz-react-live-067',
    'hackathon-fall-2025',
    '{"projectScore":83,"featuresCompleted":5,"codeQuality":78,"award":"participant"}'::jsonb,
    'https://github.com/hande-karaaslan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-12 14:52:33.965',
    TIMESTAMP '2025-11-12 14:52:33.965',
    TIMESTAMP '2025-11-12 14:52:33.965'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-067')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-sevgi-dinc-1',
    'user-sevgi-dinc-44',
    'quiz-react-test-074',
    'hackathon-fall-2025',
    '{"projectScore":82,"featuresCompleted":3,"codeQuality":93,"award":"participant"}'::jsonb,
    'https://github.com/sevgi-dinc/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-06 08:13:55.093',
    TIMESTAMP '2025-11-06 08:13:55.093',
    TIMESTAMP '2025-11-06 08:13:55.093'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-074')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-i-rem-sezer-1',
    'user-i-rem-sezer-45',
    'quiz-flutter-bug-097',
    'hackathon-fall-2025',
    '{"projectScore":75,"featuresCompleted":4,"codeQuality":73,"award":"participant"}'::jsonb,
    'https://github.com/i-rem-sezer/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-05 22:52:47.643',
    TIMESTAMP '2025-11-05 22:52:47.643',
    TIMESTAMP '2025-11-05 22:52:47.643'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-097')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-tugce-eren-1',
    'user-tugce-eren-46',
    'quiz-node-live-061',
    'hackathon-fall-2025',
    '{"projectScore":79,"featuresCompleted":5,"codeQuality":70,"award":"participant"}'::jsonb,
    'https://github.com/tugce-eren/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-09 15:48:35.614',
    TIMESTAMP '2025-11-09 15:48:35.614',
    TIMESTAMP '2025-11-09 15:48:35.614'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-061')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-asli-cetin-1',
    'user-asli-cetin-47',
    'quiz-node-test-039',
    'hackathon-fall-2025',
    '{"projectScore":79,"featuresCompleted":6,"codeQuality":77,"award":"participant"}'::jsonb,
    'https://github.com/asli-cetin/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-12 15:23:57.407',
    TIMESTAMP '2025-11-12 15:23:57.407',
    TIMESTAMP '2025-11-12 15:23:57.407'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-039')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-nisan-ceylan-1',
    'user-nisan-ceylan-48',
    'quiz-python-bug-012',
    'hackathon-fall-2025',
    '{"projectScore":80,"featuresCompleted":3,"codeQuality":95,"award":"participant"}'::jsonb,
    'https://github.com/nisan-ceylan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-04 11:14:55.735',
    TIMESTAMP '2025-11-04 11:14:55.735',
    TIMESTAMP '2025-11-04 11:14:55.735'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-012')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-melis-yalcin-1',
    'user-melis-yalcin-49',
    'quiz-angular-live-017',
    'hackathon-fall-2025',
    '{"projectScore":76,"featuresCompleted":3,"codeQuality":78,"award":"participant"}'::jsonb,
    'https://github.com/melis-yalcin/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-09 19:51:07.166',
    TIMESTAMP '2025-11-09 19:51:07.166',
    TIMESTAMP '2025-11-09 19:51:07.166'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-017')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-cansu-isik-1',
    'user-cansu-isik-50',
    'quiz-angular-test-016',
    'hackathon-fall-2025',
    '{"projectScore":83,"featuresCompleted":5,"codeQuality":88,"award":"participant"}'::jsonb,
    'https://github.com/cansu-isik/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 14:35:29.162',
    TIMESTAMP '2025-11-16 14:35:29.162',
    TIMESTAMP '2025-11-16 14:35:29.162'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-016')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-naz-keskin-1',
    'user-naz-keskin-51',
    'quiz-vue-bug-023',
    'hackathon-spring-2025',
    '{"projectScore":91,"featuresCompleted":6,"codeQuality":88,"award":"winner"}'::jsonb,
    'https://github.com/naz-keskin/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-15 16:46:00.008',
    TIMESTAMP '2025-11-15 16:46:00.008',
    TIMESTAMP '2025-11-15 16:46:00.008'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-023')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-yasemin-avci-1',
    'user-yasemin-avci-52',
    'quiz-rn-live-078',
    'hackathon-fall-2025',
    '{"projectScore":88,"featuresCompleted":3,"codeQuality":79,"award":"participant"}'::jsonb,
    'https://github.com/yasemin-avci/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-13 20:33:24.534',
    TIMESTAMP '2025-11-13 20:33:24.534',
    TIMESTAMP '2025-11-13 20:33:24.534'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-078')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-kubra-bulut-1',
    'user-kubra-bulut-53',
    'quiz-rn-test-064',
    'hackathon-fall-2025',
    '{"projectScore":99,"featuresCompleted":6,"codeQuality":94,"award":"participant"}'::jsonb,
    'https://github.com/kubra-bulut/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-16 10:43:43.052',
    TIMESTAMP '2025-11-16 10:43:43.052',
    TIMESTAMP '2025-11-16 10:43:43.052'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-064')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-nil-erdogan-1',
    'user-nil-erdogan-54',
    'quiz-java-bug-098',
    'hackathon-fall-2025',
    '{"projectScore":97,"featuresCompleted":3,"codeQuality":71,"award":"participant"}'::jsonb,
    'https://github.com/nil-erdogan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-10 20:23:34.345',
    TIMESTAMP '2025-11-10 20:23:34.345',
    TIMESTAMP '2025-11-10 20:23:34.345'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-098')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-gul-aksoy-1',
    'user-gul-aksoy-55',
    'quiz-go-live-088',
    'hackathon-fall-2025',
    '{"projectScore":91,"featuresCompleted":6,"codeQuality":83,"award":"participant"}'::jsonb,
    'https://github.com/gul-aksoy/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-15 12:14:32.102',
    TIMESTAMP '2025-11-15 12:14:32.102',
    TIMESTAMP '2025-11-15 12:14:32.102'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-088')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-sena-bozkurt-1',
    'user-sena-bozkurt-56',
    'quiz-go-test-094',
    'hackathon-fall-2025',
    '{"projectScore":83,"featuresCompleted":5,"codeQuality":71,"award":"participant"}'::jsonb,
    'https://github.com/sena-bozkurt/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-13 08:57:09.739',
    TIMESTAMP '2025-11-13 08:57:09.739',
    TIMESTAMP '2025-11-13 08:57:09.739'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-094')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-esra-gunes-1',
    'user-esra-gunes-57',
    'quiz-dotnet-bug-072',
    'hackathon-fall-2025',
    '{"projectScore":77,"featuresCompleted":6,"codeQuality":83,"award":"participant"}'::jsonb,
    'https://github.com/esra-gunes/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-12 17:30:05.625',
    TIMESTAMP '2025-11-12 17:30:05.625',
    TIMESTAMP '2025-11-12 17:30:05.625'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-072')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-hale-tas-1',
    'user-hale-tas-58',
    'quiz-react-adv-live-022',
    'hackathon-spring-2025',
    '{"projectScore":89,"featuresCompleted":5,"codeQuality":93,"award":"winner"}'::jsonb,
    'https://github.com/hale-tas/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-06 22:14:26.222',
    TIMESTAMP '2025-11-06 22:14:26.222',
    TIMESTAMP '2025-11-06 22:14:26.222'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-022')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-selin-tekin-1',
    'user-selin-tekin-59',
    'quiz-react-adv-test-050',
    'hackathon-fall-2025',
    '{"projectScore":88,"featuresCompleted":5,"codeQuality":76,"award":"participant"}'::jsonb,
    'https://github.com/selin-tekin/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-14 20:19:06.789',
    TIMESTAMP '2025-11-14 20:19:06.789',
    TIMESTAMP '2025-11-14 20:19:06.789'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-050')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-gonca-sari-1',
    'user-gonca-sari-60',
    'quiz-flutter-adv-bug-016',
    'hackathon-fall-2025',
    '{"projectScore":96,"featuresCompleted":3,"codeQuality":91,"award":"participant"}'::jsonb,
    'https://github.com/gonca-sari/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-07 23:33:56.631',
    TIMESTAMP '2025-11-07 23:33:56.631',
    TIMESTAMP '2025-11-07 23:33:56.631'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-adv-bug-016')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-ayse-kaplan-1',
    'user-ayse-kaplan-61',
    'quiz-node-adv-live-038',
    'hackathon-fall-2025',
    '{"projectScore":85,"featuresCompleted":6,"codeQuality":93,"award":"participant"}'::jsonb,
    'https://github.com/ayse-kaplan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-07 13:59:52.413',
    TIMESTAMP '2025-11-07 13:59:52.413',
    TIMESTAMP '2025-11-07 13:59:52.413'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-live-038')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-zeynep-ozcan-1',
    'user-zeynep-ozcan-62',
    'quiz-node-adv-test-038',
    'hackathon-spring-2025',
    '{"projectScore":77,"featuresCompleted":6,"codeQuality":88,"award":"winner"}'::jsonb,
    'https://github.com/zeynep-ozcan/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-10-31 07:49:47.000',
    TIMESTAMP '2025-10-31 07:49:47.000',
    TIMESTAMP '2025-10-31 07:49:47.000'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-adv-test-038')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-elif-polat-1',
    'user-elif-polat-63',
    'quiz-python-adv-bug-043',
    'hackathon-fall-2025',
    '{"projectScore":75,"featuresCompleted":5,"codeQuality":81,"award":"participant"}'::jsonb,
    'https://github.com/elif-polat/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-13 19:40:44.040',
    TIMESTAMP '2025-11-13 19:40:44.040',
    TIMESTAMP '2025-11-13 19:40:44.040'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-adv-bug-043')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-fatma-ozdemir-1',
    'user-fatma-ozdemir-64',
    'quiz-react-live-083',
    'hackathon-fall-2025',
    '{"projectScore":84,"featuresCompleted":3,"codeQuality":80,"award":"participant"}'::jsonb,
    'https://github.com/fatma-ozdemir/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-12 11:29:11.677',
    TIMESTAMP '2025-11-12 11:29:11.677',
    TIMESTAMP '2025-11-12 11:29:11.677'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-live-083')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-merve-kurt-1',
    'user-merve-kurt-65',
    'quiz-react-test-033',
    'hackathon-fall-2025',
    '{"projectScore":94,"featuresCompleted":6,"codeQuality":88,"award":"participant"}'::jsonb,
    'https://github.com/merve-kurt/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-09 19:24:57.963',
    TIMESTAMP '2025-11-09 19:24:57.963',
    TIMESTAMP '2025-11-09 19:24:57.963'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-test-033')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-seda-koc-1',
    'user-seda-koc-66',
    'quiz-flutter-bug-022',
    'hackathon-fall-2025',
    '{"projectScore":75,"featuresCompleted":5,"codeQuality":92,"award":"participant"}'::jsonb,
    'https://github.com/seda-koc/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-04 06:36:35.369',
    TIMESTAMP '2025-11-04 06:36:35.369',
    TIMESTAMP '2025-11-04 06:36:35.369'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-flutter-bug-022')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-derya-kara-1',
    'user-derya-kara-67',
    'quiz-node-live-056',
    'hackathon-spring-2025',
    '{"projectScore":93,"featuresCompleted":5,"codeQuality":83,"award":"winner"}'::jsonb,
    'https://github.com/derya-kara/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-10 16:54:25.424',
    TIMESTAMP '2025-11-10 16:54:25.424',
    TIMESTAMP '2025-11-10 16:54:25.424'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-live-056')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-gizem-aslan-1',
    'user-gizem-aslan-68',
    'quiz-node-test-003',
    'hackathon-fall-2025',
    '{"projectScore":92,"featuresCompleted":5,"codeQuality":90,"award":"participant"}'::jsonb,
    'https://github.com/gizem-aslan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-15 12:28:30.963',
    TIMESTAMP '2025-11-15 12:28:30.963',
    TIMESTAMP '2025-11-15 12:28:30.963'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-node-test-003')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-busra-kilic-1',
    'user-busra-kilic-69',
    'quiz-python-bug-003',
    'hackathon-fall-2025',
    '{"projectScore":93,"featuresCompleted":5,"codeQuality":76,"award":"participant"}'::jsonb,
    'https://github.com/busra-kilic/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-07 08:47:34.791',
    TIMESTAMP '2025-11-07 08:47:34.791',
    TIMESTAMP '2025-11-07 08:47:34.791'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-python-bug-003')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-sibel-dogan-1',
    'user-sibel-dogan-70',
    'quiz-angular-live-068',
    'hackathon-spring-2025',
    '{"projectScore":89,"featuresCompleted":3,"codeQuality":92,"award":"winner"}'::jsonb,
    'https://github.com/sibel-dogan/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-10 06:22:38.282',
    TIMESTAMP '2025-11-10 06:22:38.282',
    TIMESTAMP '2025-11-10 06:22:38.282'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-live-068')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-ece-arslan-1',
    'user-ece-arslan-71',
    'quiz-angular-test-036',
    'hackathon-fall-2025',
    '{"projectScore":82,"featuresCompleted":3,"codeQuality":76,"award":"participant"}'::jsonb,
    'https://github.com/ece-arslan/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-03 18:54:34.724',
    TIMESTAMP '2025-11-03 18:54:34.724',
    TIMESTAMP '2025-11-03 18:54:34.724'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-angular-test-036')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-pelin-ozturk-1',
    'user-pelin-ozturk-72',
    'quiz-vue-bug-082',
    'hackathon-fall-2025',
    '{"projectScore":79,"featuresCompleted":3,"codeQuality":89,"award":"participant"}'::jsonb,
    'https://github.com/pelin-ozturk/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-10 04:48:38.169',
    TIMESTAMP '2025-11-10 04:48:38.169',
    TIMESTAMP '2025-11-10 04:48:38.169'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-vue-bug-082')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-hande-aydin-1',
    'user-hande-aydin-73',
    'quiz-rn-live-013',
    'hackathon-spring-2025',
    '{"projectScore":86,"featuresCompleted":3,"codeQuality":83,"award":"winner"}'::jsonb,
    'https://github.com/hande-aydin/award-winning',
    '{"notes":"Excellent submission"}'::jsonb,
    TIMESTAMP '2025-11-06 22:02:28.859',
    TIMESTAMP '2025-11-06 22:02:28.859',
    TIMESTAMP '2025-11-06 22:02:28.859'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-live-013')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-sevgi-yildirim-1',
    'user-sevgi-yildirim-74',
    'quiz-rn-test-054',
    'hackathon-fall-2025',
    '{"projectScore":85,"featuresCompleted":5,"codeQuality":73,"award":"participant"}'::jsonb,
    'https://github.com/sevgi-yildirim/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-04 22:32:34.517',
    TIMESTAMP '2025-11-04 22:32:34.517',
    TIMESTAMP '2025-11-04 22:32:34.517'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-rn-test-054')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-i-rem-yildiz-1',
    'user-i-rem-yildiz-75',
    'quiz-java-bug-036',
    'hackathon-fall-2025',
    '{"projectScore":87,"featuresCompleted":5,"codeQuality":74,"award":"participant"}'::jsonb,
    'https://github.com/i-rem-yildiz/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-13 16:12:42.011',
    TIMESTAMP '2025-11-13 16:12:42.011',
    TIMESTAMP '2025-11-13 16:12:42.011'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-java-bug-036')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-tugce-celik-1',
    'user-tugce-celik-76',
    'quiz-go-live-042',
    'hackathon-fall-2025',
    '{"projectScore":89,"featuresCompleted":4,"codeQuality":88,"award":"participant"}'::jsonb,
    'https://github.com/tugce-celik/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-14 16:17:06.177',
    TIMESTAMP '2025-11-14 16:17:06.177',
    TIMESTAMP '2025-11-14 16:17:06.177'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-live-042')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-asli-sahin-1',
    'user-asli-sahin-77',
    'quiz-go-test-055',
    'hackathon-fall-2025',
    '{"projectScore":81,"featuresCompleted":5,"codeQuality":75,"award":"participant"}'::jsonb,
    'https://github.com/asli-sahin/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-14 14:34:25.302',
    TIMESTAMP '2025-11-14 14:34:25.302',
    TIMESTAMP '2025-11-14 14:34:25.302'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-go-test-055')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-nisan-demir-1',
    'user-nisan-demir-78',
    'quiz-dotnet-bug-025',
    'hackathon-fall-2025',
    '{"projectScore":75,"featuresCompleted":5,"codeQuality":84,"award":"participant"}'::jsonb,
    'https://github.com/nisan-demir/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-08 21:54:45.391',
    TIMESTAMP '2025-11-08 21:54:45.391',
    TIMESTAMP '2025-11-08 21:54:45.391'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-dotnet-bug-025')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-melis-kaya-1',
    'user-melis-kaya-79',
    'quiz-react-adv-live-012',
    'hackathon-fall-2025',
    '{"projectScore":80,"featuresCompleted":3,"codeQuality":70,"award":"participant"}'::jsonb,
    'https://github.com/melis-kaya/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-14 02:26:22.327',
    TIMESTAMP '2025-11-14 02:26:22.327',
    TIMESTAMP '2025-11-14 02:26:22.327'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-live-012')
ON CONFLICT DO NOTHING;
INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    'hackaton-cansu-yilmaz-1',
    'user-cansu-yilmaz-80',
    'quiz-react-adv-test-006',
    'hackathon-fall-2025',
    '{"projectScore":95,"featuresCompleted":3,"codeQuality":76,"award":"participant"}'::jsonb,
    'https://github.com/cansu-yilmaz/project',
    '{"notes":"Good effort"}'::jsonb,
    TIMESTAMP '2025-11-13 16:29:26.423',
    TIMESTAMP '2025-11-13 16:29:26.423',
    TIMESTAMP '2025-11-13 16:29:26.423'
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = 'quiz-react-adv-test-006')
ON CONFLICT DO NOTHING;

-- Insert user balances
INSERT INTO "user_balances" (
    "userId",
    "points",
    "lifetimeXp",
    "level"
) VALUES
    (
        'user-mehmet-keskin-1',
        1112,
        8896,
        9
    ),
    (
        'user-ahmet-avci-2',
        1638,
        13104,
        11
    ),
    (
        'user-mustafa-bulut-3',
        1864,
        9320,
        9
    ),
    (
        'user-huseyin-erdogan-4',
        1823,
        12761,
        11
    ),
    (
        'user-emre-aksoy-5',
        1862,
        7448,
        8
    ),
    (
        'user-burak-bozkurt-6',
        889,
        6223,
        7
    ),
    (
        'user-cem-gunes-7',
        1507,
        4521,
        6
    ),
    (
        'user-can-tas-8',
        758,
        4548,
        6
    ),
    (
        'user-ozan-tekin-9',
        1189,
        5945,
        7
    ),
    (
        'user-eren-sari-10',
        1944,
        15552,
        12
    ),
    (
        'user-deniz-kaplan-11',
        1531,
        10717,
        10
    ),
    (
        'user-hakan-ozcan-12',
        1909,
        13363,
        11
    ),
    (
        'user-onur-polat-13',
        897,
        4485,
        6
    ),
    (
        'user-tolga-ozdemir-14',
        954,
        4770,
        6
    ),
    (
        'user-yasin-kurt-15',
        626,
        3130,
        5
    ),
    (
        'user-kerem-koc-16',
        1627,
        9762,
        9
    ),
    (
        'user-umut-kara-17',
        409,
        2863,
        5
    ),
    (
        'user-murat-aslan-18',
        907,
        4535,
        6
    ),
    (
        'user-gokhan-kilic-19',
        1955,
        5865,
        7
    ),
    (
        'user-kaan-dogan-20',
        1721,
        12047,
        10
    ),
    (
        'user-baran-arslan-21',
        1387,
        6935,
        8
    ),
    (
        'user-bora-ozturk-22',
        918,
        5508,
        7
    ),
    (
        'user-halil-aydin-23',
        770,
        3080,
        5
    ),
    (
        'user-suat-yildirim-24',
        437,
        2622,
        5
    ),
    (
        'user-serkan-yildiz-25',
        1473,
        11784,
        10
    ),
    (
        'user-berk-celik-26',
        354,
        1770,
        4
    ),
    (
        'user-mert-sahin-27',
        1272,
        3816,
        6
    ),
    (
        'user-kadir-demir-28',
        704,
        4224,
        6
    ),
    (
        'user-furkan-kaya-29',
        1803,
        9015,
        9
    ),
    (
        'user-cagri-yilmaz-30',
        1440,
        11520,
        10
    ),
    (
        'user-mehmet-oz-31',
        1784,
        7136,
        8
    ),
    (
        'user-ahmet-gokmen-32',
        948,
        6636,
        8
    ),
    (
        'user-mustafa-kuzu-33',
        1069,
        5345,
        7
    ),
    (
        'user-huseyin-karaca-34',
        1214,
        9712,
        9
    ),
    (
        'user-emre-duman-35',
        1295,
        5180,
        7
    ),
    (
        'user-burak-oztuna-36',
        1169,
        4676,
        6
    ),
    (
        'user-derya-toprak-37',
        1026,
        8208,
        9
    ),
    (
        'user-gizem-bayrak-38',
        1885,
        11310,
        10
    ),
    (
        'user-busra-erdogdu-39',
        1281,
        5124,
        7
    ),
    (
        'user-sibel-ozkan-40',
        498,
        3984,
        6
    ),
    (
        'user-ece-ucar-41',
        1563,
        7815,
        8
    ),
    (
        'user-pelin-bal-42',
        1569,
        7845,
        8
    ),
    (
        'user-hande-karaaslan-43',
        894,
        2682,
        5
    ),
    (
        'user-sevgi-dinc-44',
        585,
        3510,
        5
    ),
    (
        'user-i-rem-sezer-45',
        1329,
        5316,
        7
    ),
    (
        'user-tugce-eren-46',
        1719,
        6876,
        8
    ),
    (
        'user-asli-cetin-47',
        392,
        1568,
        3
    ),
    (
        'user-nisan-ceylan-48',
        677,
        5416,
        7
    ),
    (
        'user-melis-yalcin-49',
        1381,
        4143,
        6
    ),
    (
        'user-cansu-isik-50',
        473,
        3311,
        5
    ),
    (
        'user-naz-keskin-51',
        462,
        2310,
        4
    ),
    (
        'user-yasemin-avci-52',
        1660,
        6640,
        8
    ),
    (
        'user-kubra-bulut-53',
        333,
        2331,
        4
    ),
    (
        'user-nil-erdogan-54',
        1958,
        7832,
        8
    ),
    (
        'user-gul-aksoy-55',
        1917,
        9585,
        9
    ),
    (
        'user-sena-bozkurt-56',
        491,
        1473,
        3
    ),
    (
        'user-esra-gunes-57',
        1006,
        3018,
        5
    ),
    (
        'user-hale-tas-58',
        1914,
        5742,
        7
    ),
    (
        'user-selin-tekin-59',
        1344,
        8064,
        8
    ),
    (
        'user-gonca-sari-60',
        207,
        1242,
        3
    ),
    (
        'user-ayse-kaplan-61',
        663,
        2652,
        5
    ),
    (
        'user-zeynep-ozcan-62',
        653,
        5224,
        7
    ),
    (
        'user-elif-polat-63',
        516,
        3612,
        6
    ),
    (
        'user-fatma-ozdemir-64',
        1339,
        4017,
        6
    ),
    (
        'user-merve-kurt-65',
        700,
        4900,
        7
    ),
    (
        'user-seda-koc-66',
        1937,
        7748,
        8
    ),
    (
        'user-derya-kara-67',
        1048,
        4192,
        6
    ),
    (
        'user-gizem-aslan-68',
        257,
        1285,
        3
    ),
    (
        'user-busra-kilic-69',
        928,
        4640,
        6
    ),
    (
        'user-sibel-dogan-70',
        1600,
        12800,
        11
    ),
    (
        'user-ece-arslan-71',
        1898,
        15184,
        12
    ),
    (
        'user-pelin-ozturk-72',
        1994,
        15952,
        12
    ),
    (
        'user-hande-aydin-73',
        1999,
        5997,
        7
    ),
    (
        'user-sevgi-yildirim-74',
        1322,
        5288,
        7
    ),
    (
        'user-i-rem-yildiz-75',
        1050,
        4200,
        6
    ),
    (
        'user-tugce-celik-76',
        517,
        3102,
        5
    ),
    (
        'user-asli-sahin-77',
        1430,
        8580,
        9
    ),
    (
        'user-nisan-demir-78',
        1355,
        10840,
        10
    ),
    (
        'user-melis-kaya-79',
        1467,
        11736,
        10
    ),
    (
        'user-cansu-yilmaz-80',
        438,
        3504,
        5
    );

-- Insert user streaks
INSERT INTO "user_streaks" (
    "userId",
    "currentStreak",
    "longestStreak",
    "lastActivityDate"
) VALUES
    (
        'user-mehmet-keskin-1',
        20,
        26,
        TIMESTAMP '2025-11-13 23:03:06.498'
    ),
    (
        'user-ahmet-avci-2',
        11,
        18,
        TIMESTAMP '2025-11-14 17:34:34.347'
    ),
    (
        'user-mustafa-bulut-3',
        5,
        14,
        TIMESTAMP '2025-11-01 19:59:10.411'
    ),
    (
        'user-huseyin-erdogan-4',
        20,
        23,
        TIMESTAMP '2025-10-28 23:51:04.216'
    ),
    (
        'user-emre-aksoy-5',
        11,
        16,
        TIMESTAMP '2025-11-11 13:41:27.077'
    ),
    (
        'user-burak-bozkurt-6',
        8,
        11,
        TIMESTAMP '2025-11-09 13:02:07.893'
    ),
    (
        'user-cem-gunes-7',
        9,
        23,
        TIMESTAMP '2025-11-12 07:00:58.881'
    ),
    (
        'user-can-tas-8',
        12,
        27,
        TIMESTAMP '2025-11-16 08:53:15.269'
    ),
    (
        'user-ozan-tekin-9',
        6,
        26,
        TIMESTAMP '2025-11-16 13:51:16.108'
    ),
    (
        'user-eren-sari-10',
        6,
        10,
        TIMESTAMP '2025-10-30 07:22:49.137'
    ),
    (
        'user-deniz-kaplan-11',
        9,
        13,
        TIMESTAMP '2025-11-14 09:34:28.835'
    ),
    (
        'user-hakan-ozcan-12',
        10,
        26,
        TIMESTAMP '2025-11-15 20:59:55.262'
    ),
    (
        'user-onur-polat-13',
        17,
        27,
        TIMESTAMP '2025-11-02 02:25:08.409'
    ),
    (
        'user-tolga-ozdemir-14',
        20,
        27,
        TIMESTAMP '2025-11-12 07:26:23.358'
    ),
    (
        'user-yasin-kurt-15',
        5,
        26,
        TIMESTAMP '2025-11-16 04:37:59.446'
    ),
    (
        'user-kerem-koc-16',
        15,
        15,
        TIMESTAMP '2025-11-08 05:09:00.290'
    ),
    (
        'user-umut-kara-17',
        9,
        29,
        TIMESTAMP '2025-10-20 05:43:56.137'
    ),
    (
        'user-murat-aslan-18',
        6,
        19,
        TIMESTAMP '2025-11-15 19:49:37.726'
    ),
    (
        'user-gokhan-kilic-19',
        17,
        17,
        TIMESTAMP '2025-11-07 19:16:26.431'
    ),
    (
        'user-kaan-dogan-20',
        13,
        13,
        TIMESTAMP '2025-11-14 09:19:00.868'
    ),
    (
        'user-baran-arslan-21',
        11,
        14,
        TIMESTAMP '2025-11-09 14:02:04.515'
    ),
    (
        'user-bora-ozturk-22',
        11,
        15,
        TIMESTAMP '2025-11-12 07:46:22.506'
    ),
    (
        'user-halil-aydin-23',
        20,
        20,
        TIMESTAMP '2025-10-30 09:58:46.627'
    ),
    (
        'user-suat-yildirim-24',
        12,
        27,
        TIMESTAMP '2025-11-12 22:56:32.656'
    ),
    (
        'user-serkan-yildiz-25',
        10,
        11,
        TIMESTAMP '2025-11-06 01:37:04.277'
    ),
    (
        'user-berk-celik-26',
        16,
        30,
        TIMESTAMP '2025-11-14 15:38:18.886'
    ),
    (
        'user-mert-sahin-27',
        8,
        21,
        TIMESTAMP '2025-11-10 07:37:59.547'
    ),
    (
        'user-kadir-demir-28',
        10,
        15,
        TIMESTAMP '2025-11-07 13:12:58.423'
    ),
    (
        'user-furkan-kaya-29',
        17,
        28,
        TIMESTAMP '2025-11-14 11:23:40.763'
    ),
    (
        'user-cagri-yilmaz-30',
        5,
        10,
        TIMESTAMP '2025-11-08 22:31:27.803'
    ),
    (
        'user-mehmet-oz-31',
        17,
        17,
        TIMESTAMP '2025-11-12 19:48:32.961'
    ),
    (
        'user-ahmet-gokmen-32',
        18,
        22,
        TIMESTAMP '2025-11-03 15:58:52.966'
    ),
    (
        'user-mustafa-kuzu-33',
        10,
        18,
        TIMESTAMP '2025-11-15 10:45:34.325'
    ),
    (
        'user-huseyin-karaca-34',
        12,
        15,
        TIMESTAMP '2025-11-06 19:28:04.947'
    ),
    (
        'user-emre-duman-35',
        7,
        22,
        TIMESTAMP '2025-10-31 22:51:02.728'
    ),
    (
        'user-burak-oztuna-36',
        12,
        19,
        TIMESTAMP '2025-11-14 20:52:58.779'
    ),
    (
        'user-derya-toprak-37',
        16,
        21,
        TIMESTAMP '2025-11-15 18:19:52.465'
    ),
    (
        'user-gizem-bayrak-38',
        3,
        24,
        TIMESTAMP '2025-10-20 14:22:51.155'
    ),
    (
        'user-busra-erdogdu-39',
        20,
        20,
        TIMESTAMP '2025-11-14 23:43:53.514'
    ),
    (
        'user-sibel-ozkan-40',
        3,
        20,
        TIMESTAMP '2025-10-22 14:20:42.252'
    ),
    (
        'user-ece-ucar-41',
        13,
        13,
        TIMESTAMP '2025-11-07 20:38:37.291'
    ),
    (
        'user-pelin-bal-42',
        7,
        12,
        TIMESTAMP '2025-11-10 15:54:32.399'
    ),
    (
        'user-hande-karaaslan-43',
        9,
        28,
        TIMESTAMP '2025-11-16 00:35:22.682'
    ),
    (
        'user-sevgi-dinc-44',
        15,
        16,
        TIMESTAMP '2025-11-08 21:44:56.036'
    ),
    (
        'user-i-rem-sezer-45',
        6,
        7,
        TIMESTAMP '2025-11-15 00:06:00.815'
    ),
    (
        'user-tugce-eren-46',
        19,
        19,
        TIMESTAMP '2025-11-10 23:58:19.496'
    ),
    (
        'user-asli-cetin-47',
        19,
        30,
        TIMESTAMP '2025-11-15 18:34:32.653'
    ),
    (
        'user-nisan-ceylan-48',
        13,
        18,
        TIMESTAMP '2025-11-05 23:09:17.434'
    ),
    (
        'user-melis-yalcin-49',
        14,
        27,
        TIMESTAMP '2025-11-13 21:49:18.972'
    ),
    (
        'user-cansu-isik-50',
        17,
        17,
        TIMESTAMP '2025-11-16 09:12:35.186'
    ),
    (
        'user-naz-keskin-51',
        5,
        17,
        TIMESTAMP '2025-11-15 18:50:17.070'
    ),
    (
        'user-yasemin-avci-52',
        19,
        19,
        TIMESTAMP '2025-11-05 14:59:02.753'
    ),
    (
        'user-kubra-bulut-53',
        3,
        20,
        TIMESTAMP '2025-11-14 04:18:48.605'
    ),
    (
        'user-nil-erdogan-54',
        11,
        30,
        TIMESTAMP '2025-11-06 15:38:30.130'
    ),
    (
        'user-gul-aksoy-55',
        9,
        9,
        TIMESTAMP '2025-11-14 07:31:32.807'
    ),
    (
        'user-sena-bozkurt-56',
        12,
        12,
        TIMESTAMP '2025-11-08 06:26:53.632'
    ),
    (
        'user-esra-gunes-57',
        8,
        28,
        TIMESTAMP '2025-11-07 21:32:06.461'
    ),
    (
        'user-hale-tas-58',
        8,
        9,
        TIMESTAMP '2025-10-31 08:37:27.986'
    ),
    (
        'user-selin-tekin-59',
        13,
        27,
        TIMESTAMP '2025-11-10 14:03:56.325'
    ),
    (
        'user-gonca-sari-60',
        12,
        30,
        TIMESTAMP '2025-11-01 12:42:21.630'
    ),
    (
        'user-ayse-kaplan-61',
        10,
        21,
        TIMESTAMP '2025-11-04 11:01:16.320'
    ),
    (
        'user-zeynep-ozcan-62',
        11,
        24,
        TIMESTAMP '2025-11-04 23:43:11.526'
    ),
    (
        'user-elif-polat-63',
        3,
        24,
        TIMESTAMP '2025-11-07 18:10:53.730'
    ),
    (
        'user-fatma-ozdemir-64',
        14,
        22,
        TIMESTAMP '2025-11-12 19:38:28.823'
    ),
    (
        'user-merve-kurt-65',
        10,
        16,
        TIMESTAMP '2025-11-12 02:44:49.519'
    ),
    (
        'user-seda-koc-66',
        8,
        18,
        TIMESTAMP '2025-11-08 03:53:32.481'
    ),
    (
        'user-derya-kara-67',
        20,
        26,
        TIMESTAMP '2025-11-10 18:33:46.020'
    ),
    (
        'user-gizem-aslan-68',
        18,
        23,
        TIMESTAMP '2025-11-06 02:38:09.046'
    ),
    (
        'user-busra-kilic-69',
        12,
        29,
        TIMESTAMP '2025-10-31 16:39:12.329'
    ),
    (
        'user-sibel-dogan-70',
        7,
        26,
        TIMESTAMP '2025-11-11 20:41:57.653'
    ),
    (
        'user-ece-arslan-71',
        17,
        27,
        TIMESTAMP '2025-11-16 12:55:46.199'
    ),
    (
        'user-pelin-ozturk-72',
        19,
        19,
        TIMESTAMP '2025-11-11 04:24:41.486'
    ),
    (
        'user-hande-aydin-73',
        9,
        28,
        TIMESTAMP '2025-10-29 12:33:34.921'
    ),
    (
        'user-sevgi-yildirim-74',
        8,
        26,
        TIMESTAMP '2025-11-02 14:17:20.067'
    ),
    (
        'user-i-rem-yildiz-75',
        20,
        20,
        TIMESTAMP '2025-11-12 07:31:13.161'
    ),
    (
        'user-tugce-celik-76',
        14,
        24,
        TIMESTAMP '2025-11-12 13:27:21.438'
    ),
    (
        'user-asli-sahin-77',
        20,
        25,
        TIMESTAMP '2025-11-12 22:00:47.120'
    ),
    (
        'user-nisan-demir-78',
        9,
        9,
        TIMESTAMP '2025-10-31 15:22:33.195'
    ),
    (
        'user-melis-kaya-79',
        15,
        15,
        TIMESTAMP '2025-11-14 13:49:51.892'
    ),
    (
        'user-cansu-yilmaz-80',
        10,
        22,
        TIMESTAMP '2025-11-16 01:59:29.946'
    );

COMMIT;

# ย้ายฐานข้อมูล worktime จาก MySQL 5.5 ไป MariaDB 12.3 LTS

เอกสารนี้ใช้กับฐานข้อมูล production เดิม (MySQL 5.5.62, charset `utf8`) และมีส่วน "ติดตั้งใหม่" ท้ายเอกสาร

> **สำคัญ:** การอัปเกรด in-place จาก MySQL 5.5 ไป MariaDB 12.x **ไม่รองรับ** (ข้ามหลาย major version และ data dictionary/format ต่างกัน)
> วิธีที่ถูกต้องคือ **dump แล้ว restore (import) ลงเซิร์ฟเวอร์ MariaDB ตัวใหม่** เท่านั้น ห้ามชี้ MariaDB 12.3 ไปที่ datadir เดิมของ MySQL 5.5

## ภาพรวมลำดับขั้นตอน

| ขั้น | งาน | ไฟล์ |
|---|---|---|
| 1 | Backup จาก MySQL 5.5 + นับแถวเก็บไว้ | - |
| 2 | ติดตั้ง MariaDB 12.3 (เครื่อง/instance ใหม่) | - |
| 3 | Import dump | `backup.sql` |
| 4 | เพิ่มคอลัมน์ `employee.active` (ถ้ายังไม่มี) | `migrations/V2__employee_active.sql` |
| 5 | แปลงเป็น utf8mb4 | `migrations/V4__utf8mb4.sql` |
| 6 | ตรวจปี พ.ศ. (และแปลงถ้าจำเป็น) | `migrations/V5__check_buddhist_years.sql` |
| 7 | สร้าง user ของแอป (least privilege) | `migrations/V3__app_user.sql` |
| 8 | ตรวจสอบ (verification) เทียบก่อน/หลัง | ด้านล่าง |
| 9 | สลับ application ไปใช้ DB ใหม่ | - |

## 1. Backup (บน MySQL 5.5 เดิม)

```bash
mysqldump --single-transaction --routines --triggers --default-character-set=utf8 worktime > backup.sql
```

เก็บ row count ของแต่ละตารางไว้เทียบ (รันบน MySQL 5.5):

```sql
SELECT 'employee' t, COUNT(*) c FROM employee
UNION ALL SELECT 'employee_has_sidework_history', COUNT(*) FROM employee_has_sidework_history
UNION ALL SELECT 'ot_history', COUNT(*) FROM ot_history
UNION ALL SELECT 'sidework_history', COUNT(*) FROM sidework_history
UNION ALL SELECT 'work_project', COUNT(*) FROM work_project
UNION ALL SELECT 'worktype', COUNT(*) FROM worktype;
```

บันทึกผลไว้ (หรือ screenshot) และเก็บไฟล์ `backup.sql` ไว้อย่างน้อย 2 ที่ นอกจากนี้ควรเก็บสำเนา datadir/snapshot ของเซิร์ฟเวอร์เดิมไว้ด้วย

> หมายเหตุ: dump ตัวอย่างใน `database.sql` ขึ้นต้นด้วย `CREATE DATABASE ... DEFAULT CHARACTER SET utf8` และ `DROP TABLE IF EXISTS` ซึ่งใช้ได้กับ MariaDB แต่จะสร้างตารางเป็น utf8 (utf8mb3) ก่อน แล้วขั้นที่ 5 จึงแปลงเป็น utf8mb4

## 2. ติดตั้ง MariaDB 12.3 LTS

ติดตั้งบนเครื่อง/instance ใหม่ตามคู่มือของ OS (แนะนำให้เป็น instance แยกจาก MySQL 5.5 เพื่อ rollback ได้ง่าย) แล้วตั้งค่า `my.cnf` / `server.cnf` อย่างน้อย:

```ini
[mariadbd]
character-set-server = utf8mb4
collation-server     = utf8mb4_unicode_ci
default-time-zone    = '+07:00'      ; ค่า wall-clock Asia/Bangkok
```

แอปใช้ DATE/TIME/DATETIME แบบ wall-clock Asia/Bangkok ดังนั้นอย่าให้ timezone ของ server/connection ทำให้ค่าเลื่อน (DATETIME ไม่แปลง timezone อยู่แล้ว แต่ควรตั้งให้สอดคล้อง)

## 3. Import dump

```bash
mariadb -u root -p < backup.sql
```

ถ้าไฟล์ dump เป็น utf8 ให้เพิ่ม `--default-character-set=utf8` ได้ (`mariadb --default-character-set=utf8 -u root -p < backup.sql`) เพื่อกันตัวอักษรไทยเพี้ยน

## 4. V2 — `employee.active` (ถ้าจำเป็น)

Dump จาก `database.sql` ไม่มีคอลัมน์นี้ แต่รายงานของแอปใช้ สคริปต์เป็น idempotent (`ADD COLUMN IF NOT EXISTS`) รันซ้ำได้โดยไม่ error:

```bash
mariadb -u root -p worktime < migrations/V2__employee_active.sql
```

## 5. V4 — แปลงเป็น utf8mb4

```bash
mariadb -u root -p < migrations/V4__utf8mb4.sql
```

ตรวจผล:

```sql
SELECT table_name, table_collation FROM information_schema.tables WHERE table_schema = 'worktime';
-- ทุกตารางต้องเป็น utf8mb4_unicode_ci
```

## 6. V5 — ตรวจปี พ.ศ.

ข้อมูลตัวอย่างเดิมมีปี พ.ศ. (เช่น `2563-03-31`) และบางแถวเป็นปี 3106 (ถูกเลื่อนปีซ้ำสองครั้ง) แอปใหม่ต้องการ ค.ศ.

```bash
mariadb -u root -p < migrations/V5__check_buddhist_years.sql
```

สคริปต์นี้เป็น SELECT COUNT อย่างเดียว (read-only) ถ้าทุกค่าเป็น 0 จบขั้นนี้ ถ้ามีแถวปี > 2400 ห้ามแก้ปีด้วยการบวก/ลบตัวเลขใน SQL ให้ใช้ maintenance command ของ backend ซึ่งแปลงผ่านปฏิทินพุทธ (`java.time.chrono.ThaiBuddhistChronology`):

1. **Backup ใหม่อีกครั้งก่อน** (`mariadb-dump worktime > before-year-fix.sql`)
2. รัน V5 เพื่อนับแถวที่ผิด
3. ตั้งค่า environment variable `DB_*` ของแอป (URL/user/password ที่ใช้เชื่อมต่อ DB) แล้วรัน dry run:
   ```bash
   java -jar worktime-backend-2.0.0.jar --app.maintenance.fix-buddhist-years=report
   ```
   แสดงจำนวนแถวต่อคอลัมน์ และตัวอย่าง `old -> new` โดย **ไม่แก้ข้อมูล**
4. ตรวจตัวอย่างแล้วจึงรัน:
   ```bash
   java -jar worktime-backend-2.0.0.jar --app.maintenance.fix-buddhist-years=apply
   ```
   แปลงทั้งหมดใน transaction เดียวแล้วจบการทำงาน (ไม่ start web server)
5. คำสั่งจัดการแถวที่ถูกเลื่อนปีซ้ำ (เช่น ปี 3106) โดยแปลงผ่านปฏิทินซ้ำจนอยู่ในช่วง ค.ศ. ที่ถูกต้อง ถ้าพบวันที่ไม่ถูกต้อง (invalid date) จะรายงานและ **rollback** การ apply ทั้งหมด
6. รัน V5 อีกครั้ง ผลต้องเป็น 0 ทุกแถว

## 7. V3 — user ของแอป

แก้ไฟล์ก่อนรัน:

- เปลี่ยน `CHANGE_ME_STRONG_PASSWORD` เป็นรหัสผ่านที่แข็งแรง
- เปลี่ยน host `'%'` เป็น IP ของ application server (เช่น `'worktime_app'@'10.0.0.5'`)

```bash
mariadb -u root -p < migrations/V3__app_user.sql
```

`GRANT` มีผลทันที ไม่ต้อง `FLUSH PRIVILEGES` ถ้าต้องเปลี่ยนรหัสผ่านภายหลัง ใช้ `ALTER USER` (เพราะ `CREATE USER IF NOT EXISTS` ไม่เปลี่ยนรหัสผ่านของ user ที่มีอยู่แล้ว) แอปต้องเชื่อมต่อด้วย user นี้ ไม่ใช่ root

## 8. Verification (เทียบก่อน/หลัง)

รันบน MariaDB 12.3 แล้วเทียบกับตัวเลขที่เก็บไว้ในขั้นที่ 1 (ต้องเท่ากันทุกตาราง):

```sql
USE worktime;
SELECT 'employee' t, COUNT(*) c FROM employee
UNION ALL SELECT 'employee_has_sidework_history', COUNT(*) FROM employee_has_sidework_history
UNION ALL SELECT 'ot_history', COUNT(*) FROM ot_history
UNION ALL SELECT 'sidework_history', COUNT(*) FROM sidework_history
UNION ALL SELECT 'work_project', COUNT(*) FROM work_project
UNION ALL SELECT 'worktype', COUNT(*) FROM worktype;
```

ตรวจเพิ่มเติม:

```sql
-- ค่า AUTO_INCREMENT ไม่ถอยหลัง (ต้อง >= ค่าเดิม)
SELECT table_name, auto_increment FROM information_schema.tables WHERE table_schema='worktime';
-- Foreign key ต้องครบ 4 ตัว (employee_has_sidework_history x2, sidework_history x1, ot_history x1)
SELECT constraint_name, table_name FROM information_schema.referential_constraints WHERE constraint_schema='worktime';
-- ข้อความภาษาไทยไม่เพี้ยน
SELECT work_comment FROM sidework_history WHERE work_comment REGEXP '[ก-๙]' LIMIT 5;
-- ปีผิดปกติ (ต้องเป็น 0)  ->  รัน V5 ส่วนที่ 1 อีกครั้ง
-- checksum รายตาราง (เทียบกับ MySQL 5.5 ได้ถ้ามีค่า)
CHECKSUM TABLE employee, employee_has_sidework_history, ot_history, sidework_history, work_project, worktype;
```

> `CHECKSUM TABLE` อาจต่างกันหลัง V4/V5 (เปลี่ยน charset/แก้ปี) และต่างระหว่างเวอร์ชัน engine จึงใช้เป็นข้อมูลประกอบเท่านั้น ให้ยึด row count และการทดสอบการใช้งานจริงเป็นหลัก

จากนั้นทดสอบแอป: login, บันทึก SideWork/OT, ดูรายงาน (ใช้ `sidework_history.day` และ `employee.active`)

## 9. Rollback

- **เก็บเซิร์ฟเวอร์ MySQL 5.5 เดิมไว้ (ไม่ลบ ไม่ปิดถาวร)** จนกว่าจะยืนยันว่าระบบใหม่ใช้งานจริงได้ครบ (อย่างน้อยหนึ่งรอบรายงาน/รอบเดือน)
- ช่วง cutover ให้หยุดเขียนข้อมูลที่ DB เดิม (หรือเปิด read-only) ก่อน dump ครั้งสุดท้าย เพื่อไม่ให้ข้อมูลหาย
- ถ้าพบปัญหา: ชี้ application กลับไปที่ MySQL 5.5 เดิม (แก้ `spring.datasource.url`) ข้อมูลที่ถูกเขียนหลัง cutover ต้อง export/ย้ายกลับด้วยมือ
- เก็บ `backup.sql` และ `before-year-fix.sql` ไว้จนกว่าจะปิดเซิร์ฟเวอร์เดิม

## หมายเหตุเรื่อง `mariadb-upgrade`

- หลัง import dump ที่สร้างโดย MySQL 5.5 **ไม่จำเป็น** ต้องรัน `mariadb-upgrade` เพราะ MariaDB 12.3 เป็นผู้สร้าง system tables เอง
- `mariadb-upgrade` ใช้เมื่อเป็นการอัปเกรดระหว่างเวอร์ชันของ **MariaDB ด้วยกัน** (เช่น 10.x → 12.3 โดยใช้ datadir เดิม) หลังเปลี่ยน binary แล้ว: `mariadb-upgrade -u root -p`
- สำหรับ MySQL 5.5 → MariaDB 12.x ห้ามทำ in-place; ใช้ dump/restore ตามเอกสารนี้
- ถ้า dump มี `mysql.*` (user/grants) ของเดิม **ไม่แนะนำ** ให้ import เข้า MariaDB; สร้าง user ใหม่ด้วย V3 แทน (dump ด้านบนเป็นเฉพาะ database `worktime`)

## ติดตั้งใหม่ (New install)

สำหรับเครื่องที่ไม่มีข้อมูลเดิม ไม่ต้องใช้ V2/V4/V5:

```bash
mariadb -u root -p < schema-mariadb.sql
# แก้ password/host ใน V3 ก่อน
mariadb -u root -p < migrations/V3__app_user.sql
```

`schema-mariadb.sql` สร้างฐานข้อมูล `worktime` (utf8mb4 / utf8mb4_unicode_ci), ตารางทั้ง 6 (รวม `employee.active` และ index `sidework_history(day)`), และข้อมูลตั้งต้น `worktype` (1 = SideWork, 2 = OT) รันซ้ำได้โดยไม่เสียข้อมูล ไม่มีข้อมูลตัวอย่าง/ผู้ใช้ทดสอบ (ต้องเพิ่มพนักงานเองใน `employee`)

# worktime: ระบบลงเวลาทำงานนอกสถานที่ (Work Anywhere) และการทำงานล่วงเวลา (OT)

* mockup layout (figma): https://www.figma.com/file/vmusoDdraupGHqAYj3NoSo
* demo document (googledrive): https://drive.google.com/drive/u/0/folders/1Zzu8aTxo384EdZVIkiw6fOgTDUoeHJmo
* API contract: [`docs/API.md`](docs/API.md)

## โครงสร้าง
| โฟลเดอร์ | รายละเอียด |
|---|---|
| `worktime-backend/` | Spring Boot 4.1 / Java 21 REST API (`/workTimeAPI/api/**`) |
| `frontend/` | Angular 22 (standalone components) ดู [`frontend/README.md`](frontend/README.md) |
| `database/` | `database.sql` (โครงสร้างเดิม) และ `migrations/` (สคริปต์ที่ต้องรันเพิ่ม) |

## Requirements
* Java 21 (LTS), Maven 3.9+
* Node.js 22 or 24 LTS (npm 10+)
* MariaDB 12.3 LTS (driver: MariaDB Connector/J 3.x) ฐานข้อมูลเดิม MySQL 5.5 หมดอายุแล้ว ต้องย้ายข้อมูลมา MariaDB ดูขั้นตอนที่ [`database/MIGRATION-MariaDB.md`](database/MIGRATION-MariaDB.md)

## Backend
### ตั้งค่า (ผ่าน environment variable เท่านั้น ห้าม commit รหัสผ่าน)
| Variable | ตัวอย่าง | หมายเหตุ |
|---|---|---|
| `DB_URL` | `jdbc:mariadb://db-host:3306/worktime?sslMode=verify-full` | `sslMode`: disable / trust / verify-ca / verify-full (แนะนำ verify-full; ใช้ disable เฉพาะ localhost) |
| `DB_USERNAME` / `DB_PASSWORD` | `worktime_app` / ... | ใช้ user สิทธิ์จำกัดจาก `database/migrations/V3__app_user.sql` ห้ามใช้ root |
| `JWT_SECRET` | `openssl rand -base64 48` | ต้องยาวอย่างน้อย 32 bytes; ถ้าเปลี่ยนค่า ทุกคนจะถูก logout |
| `APP_ADMIN_EMPLOYEE_NOS` | `C0001,C0002` | รหัสพนักงานที่ออกรายงานได้ |
| `IS_SERVICE_URL` | `https://cdgisweb.cdg.co.th/iswebservice/isservice.asmx` | ใช้ตรวจรหัสผ่าน วันหยุด และวันลา **ควรเป็น https** เพราะมีรหัสผ่านวิ่งผ่าน |
| `TZ` | `Asia/Bangkok` | time zone ของเครื่องที่รัน backend (เวลาบันทึก `lastUpdate` ใช้นาฬิกาเครื่อง) |
| `COOKIE_SECURE` | `true` | ตั้งเป็น `false` เฉพาะตอนพัฒนาบน http://localhost |
| `APP_ALLOWED_ORIGINS` | *(ว่าง)* | ปล่อยว่างเมื่อ frontend กับ API อยู่ origin เดียวกัน (แนะนำ) |

### รัน / ทดสอบ
```bash
cd worktime-backend
mvn test                       # unit + integration tests (H2, ไม่ต้องมี DB)
cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties
mvn spring-boot:run -Dspring-boot.run.profiles=local
mvn package && java -jar target/worktime-backend-2.0.0.jar   # production
```

### ฐานข้อมูล
1. Import `database/database.sql` (เฉพาะติดตั้งใหม่ บน MariaDB 12.3; ถ้ามีข้อมูลจาก MySQL 5.5 ให้ทำตาม [`database/MIGRATION-MariaDB.md`](database/MIGRATION-MariaDB.md))
2. รัน `database/migrations/V2__employee_active.sql` ถ้ายังไม่มีคอลัมน์ `employee.active`
3. รัน `database/migrations/V3__app_user.sql` (เปลี่ยนรหัสผ่านก่อน) แล้วให้แอปใช้ user นี้

แอปไม่แก้ schema เอง (`ddl-auto=none`)

## Frontend
```bash
cd frontend
npm ci
npm start        # http://localhost:4200, proxy /workTimeAPI → http://localhost:8080
npm run build    # output: dist/
```

## Deploy (แนะนำ)
ให้ reverse proxy (เช่น nginx) ทำ HTTPS แล้วเสิร์ฟ frontend กับ API ใน origin เดียวกัน:
```nginx
location /workTimeAPI/ { proxy_pass http://127.0.0.1:8080; proxy_set_header X-Forwarded-Proto $scheme; proxy_set_header X-Forwarded-For $remote_addr; }
location / {
  root /var/www/worktime; try_files $uri $uri/ /index.html;
  add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; frame-ancestors 'none'" always;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy no-referrer always;
}
```
API ต้องไม่เปิดให้เข้าถึงตรงจากภายนอก (ให้ผ่าน proxy เท่านั้น) เพราะ `X-Forwarded-*` จะถูกเชื่อถือ

## Security model (v2)
* Login ด้วยรหัสพนักงานและรหัสผ่าน ตรวจกับ CDG IS web service (`CheckUserAuthentication`)
* Session เป็น JWT (HS256) ใน cookie `HttpOnly; Secure; SameSite=Strict` อายุ 8 ชั่วโมง ส่วน JavaScript อ่านไม่ได้
* CSRF ใช้ double-submit cookie (`XSRF-TOKEN` / header `X-XSRF-TOKEN`)
* ทุก API ต้อง login และใช้ข้อมูลของ "ตัวเอง" เท่านั้น (employee มาจาก session ไม่รับจาก client) รายงานทั้งองค์กรจำกัดเฉพาะ admin
* Login ผิด 5 ครั้งต่อรหัสพนักงานหรือต่อ IP จะถูกล็อก 15 นาที
* Error response ไม่เปิดเผยรายละเอียดภายใน (RFC 7807)

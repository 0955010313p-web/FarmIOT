
# Smart Farm IoT - Project Blueprint & Action Plan

---

## 1. เป้าหมายสูงสุด (Ultimate Goal)

พัฒนา Smart Farm IoT Web Application ให้สามารถใช้งานได้จริง, มีสถาปัตยกรรมที่ถูกต้องตามหลักวิศวกรรมซอฟต์แวร์, มี UI/UX ที่สวยงามทันสมัย, และผ่านเกณฑ์การประเมินปลายภาคของอาจารย์ครบทุกข้อ 100%.

---

## 2. บทวิเคราะห์สถานะโปรเจค (Deep Dive Audit - As-Is State)

จากการตรวจสอบโปรเจคทั้งหมดเทียบกับเกณฑ์การประเมิน 6 ข้อ พบสถานะดังนี้:

| ข้อที่ | เกณฑ์การประเมิน | สถานะ | Gap Analysis / สิ่งที่ต้องแก้ไข |
|:---:|---|:---:|---| 
| 1 | **Register/Login & RESTful API** | ⚠️ **ต้องแก้ไข** | **Frontend ไม่สอดคล้องกับ Backend** Frontend ยังใช้ระบบเก่า (Session) ในขณะที่ Backend เป็น RESTful API ที่พร้อมใช้งานแล้ว |
| 2 | **JWT Authentication** | ❌ **ไม่ผ่าน (ที่ Frontend)** | **Frontend ยังไม่รองรับ JWT** ไม่มีการเรียกใช้, จัดเก็บ, หรือส่ง Bearer Token ทำให้ไม่สามารถสื่อสารกับ Backend ที่ป้องกันไว้ได้ |
| 3 | **Farm & IoT Device Management** | ⚠️ **ต้องพัฒนาเพิ่ม** | **ขาด UI และ Logic ทั้งหมด** ในหน้า Frontend สำหรับการจัดการฟาร์มและอุปกรณ์ |
| 4 | **MQTT Publish & Control** | ⚠️ **ต้องแก้ไข** | **1. Topic Structure ไม่ถูกต้อง** (ต้องเป็น Dynamic) <br> **2. Message Format ไม่ถูกต้อง** (ต้องเป็น JSON) |
| 5 | **Dashboard & Real-time Data** | ✔️ **ผ่าน** | ตรงตามเกณฑ์ทุกประการ |
| 6 | **Controllers & HTTP Methods** | ✔️ **ผ่าน** | Backend API มีความสมบูรณ์และพร้อมใช้งาน |

**สรุปปัญหาหลัก:** **Backend มีความพร้อมสูง แต่ Frontend ยังไม่ถูกปรับปรุงให้ทำงานร่วมกับ Backend API ที่มีอยู่เลย**

---

## 3. แผนการดำเนินงานที่ชัดเจน (Definitive Action Plan)

แผนการดำเนินงานต่อไปนี้จะถูกทำตามลำดับเพื่อปรับปรุงและพัฒนาโปรเจคให้สมบูรณ์:

### **Phase 1: ยกเครื่องระบบ Authentication (Frontend)**
*   **เป้าหมาย:** แก้ไขเกณฑ์ข้อ 1, 2
*   **สิ่งที่ต้องทำ:**
    1.  สร้าง `apiService.js` เพื่อจัดการ `baseURL` และ `Authorization Header`.
    2.  รื้อหน้า `Login.jsx` และ `Register.jsx` ใหม่ทั้งหมดเพื่อเรียกใช้ API (`/api/auth/login`, `/api/auth/register`).
    3.  เมื่อ Login สำเร็จ, จัดเก็บ `access_token` และข้อมูล `user` ลงใน `localStorage` หรือ `Context`.
    4.  สร้าง Protected Route เพื่อป้องกันการเข้าถึงหน้าที่ต้องการสิทธิ์.

### **Phase 2: พัฒนาส่วนจัดการฟาร์ม (Farm Management)**
*   **เป้าหมาย:** แก้ไขเกณฑ์ข้อ 3 (ส่วนของ Farm)
*   **สิ่งที่ต้องทำ:**
    1.  พัฒนา UI/UX ในหน้า `FarmManagement.jsx` (ปุ่ม, ตาราง, ฟอร์ม).
    2.  เชื่อมต่อ UI เข้ากับ API Endpoints (`GET`, `POST`, `PUT`, `DELETE` สำหรับ `/api/farms`).

### **Phase 3: พัฒนาส่วนจัดการอุปกรณ์ (IoT Device Management)**
*   **เป้าหมาย:** แก้ไขเกณฑ์ข้อ 3 (ส่วนของ IoT Device)
*   **สิ่งที่ต้องทำ:**
    1.  พัฒนา UI/UX ในหน้า `IotDeviceManagement.jsx`.
    2.  เชื่อมต่อ UI เข้ากับ API Endpoints สำหรับ `/api/iot-devices`.

### **Phase 4: แก้ไขการสื่อสาร MQTT (MQTT Correction)**
*   **เป้าหมาย:** แก้ไขเกณฑ์ข้อ 4
*   **สิ่งที่ต้องทำ:**
    1.  ปรับแก้ `ActuatorControl.jsx` ให้สร้าง Topic แบบ Dynamic จาก `farm_id`.
    2.  ปรับแก้ `publish` ให้ส่ง Message เป็นรูปแบบ JSON ที่ถูกต้อง.


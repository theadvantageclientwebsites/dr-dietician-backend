# DrDiet Therapy — Client Queries & Clarifications

Hi,

We have been making great progress on the DrDiet backend. As we move into the next phase of development, we need some important clarifications from your end to ensure we build exactly what you need. Please review the following questions and share your answers at your earliest convenience.

---

## 1. DIGITAL PRODUCTS

We have built the Digital Products section where admin can upload PDF ebooks, diet guides, and recipe books. We need clarity on the following:

**Q1.1 — What types of digital products will you sell?**
Please list the types of content you plan to offer. For example:
- Ebooks (PDF)
- Diet guides (PDF)
- Recipe books (PDF)
- Meal plan templates (PDF)
- Video courses (separate from PDF)
- Any other type?

**Q1.2 — What categories will digital products have?**
We currently have a free-text category field. Should it be a fixed dropdown list?
For example: Thyroid / Diabetes / Weight Loss / PCOD / Heart Health / General Nutrition / Other

**Q1.3 — After a patient buys a digital product, what should happen?**
- Should they get a download link immediately?
- Should it be accessible from their profile/dashboard?
- Should it expire after a certain time (e.g. download valid for 30 days)?
- Should there be a download limit (e.g. max 3 downloads)?

**Q1.4 — Should digital products be accessible to Interns for free?**
For example: Interns studying dietetics may benefit from guides. Should they get free access?

**Q1.5 — Do you need a preview/sample feature?**
For example: Show first 5 pages of a PDF for free before purchasing?

---

## 2. PACKAGES

We have built subscription packages (Thyroid Management, Diabetes Care, Weight Loss, etc.) with 1 month / 3 month / 6 month pricing. We need clarity on:

**Q2.1 — What does a patient get when they buy a package?**
Currently a package has a name, description, price, and features list. But after buying — what actually happens? For example:
- Do they get assigned to a specific doctor?
- Do they get unlimited appointments for that duration?
- Do they get a specific number of appointments per month?
- Do they get diet plans automatically?
- Do they get access to certain digital products?

**Q2.2 — Who delivers the package?**
- Is it always the same doctor?
- Does admin manually assign a doctor after purchase?
- Does the patient choose a doctor when buying?

**Q2.3 — What are the actual packages you plan to offer?**
Please share the full list of packages with:
- Package name
- Category
- Description
- Price (1M / 3M / 6M)
- Features included

**Q2.4 — Is there a free trial or free package?**
Do you want a free introductory package that patients can access without paying?

**Q2.5 — Can a patient have multiple active packages at once?**
For example, can someone subscribe to both "Thyroid Management" and "Diabetes Care" simultaneously?

---

## 3. COURSES

We have built a full LMS (Learning Management System) for interns with courses, lessons, progress tracking, and final tests. We need clarity on:

**Q3.1 — Who creates the course content?**
- Does the admin create all courses and upload lesson materials?
- Can doctors also create courses?
- Will you have external instructors?

**Q3.2 — What types of lessons will courses have?**
We currently support:
- Text/HTML content
- Video URL (YouTube links)
- PDF attachments

Are these sufficient? Do you need:
- Embedded video uploads (not just YouTube)?
- Audio lessons?
- Quizzes inside lessons?

**Q3.3 — What does the certificate look like after course completion?**
When an intern completes a course and passes the final test, should a certificate be generated?
- If yes, what information should appear on the certificate? (Name, course name, date, signature?)
- Should it be a downloadable PDF?
- Who signs it (admin, doctor, platform)?

**Q3.4 — What is the final test format?**
Currently we just record "passed" or "failed" as a boolean. Should the final test be:
- Multiple choice questions (stored in the system)?
- An external test link (Google Forms, etc.)?
- A manual review by admin/doctor?

**Q3.5 — Should interns pay for courses?**
- Are all courses free for interns?
- Should some premium courses require payment?

**Q3.6 — What are the actual courses you plan to offer?**
Please share the course titles, descriptions, target semester/year, and approximate number of lessons.

---

## 4. SERVICES

We saw "Services" in the patient dashboard sidebar and Quick Actions. We need full clarity on this before building it:

**Q4.1 — What services does DrDiet Therapy offer?**
Please list all services. For example:
- One-on-One Diet Consultation (₹799 for 45 minutes)
- Lab Report Analysis (₹499)
- Custom Meal Plan Creation (₹999)
- Group Workshop (₹299)
- Body Composition Analysis (₹599)
- Diet Audit (₹399)

**Q4.2 — How does a service work?**
- Patient books a service → does it create an appointment automatically?
- Or does admin manually schedule it after booking?
- Is payment required at time of booking?

**Q4.3 — Is a service tied to a specific doctor?**
- Patient picks doctor → then picks service?
- Or patient picks service → system assigns available doctor?

**Q4.4 — Is a service a one-time booking or can it be booked multiple times?**

**Q4.5 — Do services have online and offline options?**

---

## 5. APPOINTMENTS

We have built appointment booking where patients book with a specific doctor. Some clarifications needed:

**Q5.1 — How does a doctor's availability work?**
Currently patients can book any future date and time. Should there be:
- Doctor availability slots (e.g. Monday 10am-12pm, Wednesday 2pm-5pm)?
- Or free-form date selection as it is now?

**Q5.2 — What is the appointment duration?**
- Fixed duration (e.g. always 30 minutes)?
- Or doctor sets their own duration per slot?

**Q5.3 — Should there be a consultation fee for appointments?**
- Is booking always free (included in a package)?
- Or do patients pay per appointment?

**Q5.4 — Can interns attend appointments?**
For example, can a senior doctor allow an intern to observe a consultation?

---

## 6. BLOG

We saw a "Blog" section in the admin sidebar. We need clarity:

**Q6.1 — What will the blog contain?**
- Health articles by doctors
- News and updates
- Nutrition tips
- Success stories from patients

**Q6.2 — Who can write blog posts?**
- Admin only?
- Doctors can write their own articles?

**Q6.3 — What fields does a blog post need?**
For example:
- Title, content (rich text), cover image, category, author, published date, tags

**Q6.4 — Should patients be able to comment on blogs?**

**Q6.5 — Should blog posts be SEO-friendly with slugs?**
For example: `drdiettherapy.com/blog/how-to-manage-thyroid`

---

## 7. DIET PLANS

On the patient dashboard we show a "Diet Plans" section. Currently this is a placeholder. We need clarity:

**Q7.1 — Who creates the diet plan?**
- The assigned doctor creates it for each patient?
- Admin creates templates and doctor assigns?

**Q7.2 — What does a diet plan contain?**
For example:
- Daily meal schedule (Breakfast / Lunch / Dinner / Snacks)
- Foods to eat and avoid
- Calorie targets
- Duration (e.g. 30-day plan)
- Notes from doctor

**Q7.3 — Can a patient have multiple diet plans at once?**
For example: One for thyroid and one for weight loss?

**Q7.4 — Can the patient track their daily intake against the plan?**
Or is it just a reference document?

---

## 8. REVENUE & PAYMENTS

**Q8.1 — Do you have a Razorpay business account?**
We have integrated Razorpay for payments. Please share your test and production API keys.

**Q8.2 — What is your refund policy?**
Should we build a refund feature in the admin panel?

**Q8.3 — Should patients receive email/WhatsApp notifications after payment?**
For example: Payment confirmation, booking confirmation, etc.

**Q8.4 — Should admin receive notifications for new orders?**

---

## 9. NOTIFICATIONS

**Q9.1 — What notifications does the platform need?**
For example:
- Patient books appointment → Doctor gets notified
- Doctor confirms → Patient gets notified
- Payment successful → Patient gets receipt
- Intern completes course → Certificate generated
- Admin creates patient → Patient gets welcome email with credentials

**Q9.2 — What channels for notifications?**
- Email only?
- WhatsApp (via Twilio or similar)?
- Push notifications (mobile app)?
- In-app notifications (bell icon)?

---

## 10. GENERAL PLATFORM QUESTIONS

**Q10.1 — Is there a mobile app planned?**
Our current backend supports both web and mobile. Should we keep mobile in mind for APIs?

**Q10.2 — What is the target launch date?**
This will help us prioritize which features to build first.

**Q10.3 — Are there any third-party integrations needed?**
For example:
- Google Calendar (for appointments)
- WhatsApp Business API
- SMS gateway
- Email service (SendGrid / Mailgun)
- Zoom / Google Meet for video consultations

**Q10.4 — What is the expected user volume at launch?**
This affects how we scale the infrastructure.

---

## Priority Request

Could you please answer at least these **5 most critical questions** first so we can continue development without blockers?

1. What does a patient get after buying a package? (Q2.1)
2. What services do you offer and how does booking work? (Q4.1, Q4.2)
3. What is the final test format for courses? (Q3.4)
4. Do you have a Razorpay production account? (Q8.1)
5. What notifications are needed and on which channel? (Q9.1, Q9.2)

---

Thank you for your time. Your answers will directly shape the next sprint of development.

**Best regards,**
Development Team

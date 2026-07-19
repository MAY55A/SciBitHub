SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "confirmation_token", "recovery_token", "email_change_token_new", "email_change", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "created_at", "updated_at") VALUES
	('00000000-0000-0000-0000-000000000000', '86979aa3-a397-4feb-88e2-9199e719a451', 'authenticated', 'authenticated', 'admin@scibithub.test', '$2a$10$YQLdM8/izihxaJ3VD/Aik.KYqQlrsAiGZVoLGHFv0afZzVtGp/jSi', '2026-07-16 11:03:00.127707+00', '', '', '', '', '2026-07-17 11:30:44.851824+00', '{"role": "admin", "provider": "email", "providers": ["email"]}', '{"sub": "86979aa3-a397-4feb-88e2-9199e719a451", "email": "admin@scibithub.test", "email_verified": true, "phone_verified": false}', '2026-07-16 11:03:00.053153+00', '2026-07-17 11:30:44.862882+00'),
	('00000000-0000-0000-0000-000000000000', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'authenticated', 'authenticated', 'contributor@scibithub.test', '$2a$10$T93Wt0w11D3mFl5YJPk8mOSG/iGaDfPRwC4AksNr2kSS.i6Oea7ye', '2026-07-16 11:13:31.015578+00', '', '', '', '', '2026-07-17 11:52:06.296042+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a8ec87c4-54c1-4e75-bc7d-1abd96989ace", "email": "contributor@scibithub.test", "email_verified": true, "phone_verified": false}', '2026-07-16 11:13:31.003326+00', '2026-07-17 13:55:39.590521+00'),
	('00000000-0000-0000-0000-000000000000', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'authenticated', 'authenticated', 'researcher@scibithub.test', '$2a$10$sxv9gqCGm/pYPd6pjsV4d.OLpjXsXrjlVJ4j4o9EFR0oj14dtAs76', '2026-07-16 11:12:12.170765+00', '', '', '', '', '2026-07-17 14:50:51.734928+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ad38532f-78a3-4207-8c7d-3b25f6501b1a", "email": "researcher@scibithub.test", "email_verified": true, "phone_verified": false}', '2026-07-16 11:12:12.151221+00', '2026-07-17 14:50:51.744088+00');


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('86979aa3-a397-4feb-88e2-9199e719a451', '86979aa3-a397-4feb-88e2-9199e719a451', '{"sub": "86979aa3-a397-4feb-88e2-9199e719a451", "email": "admin@scibithub.test", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 11:03:00.111109+00', '2026-07-16 11:03:00.111158+00', '2026-07-16 11:03:00.111158+00', '9032aecf-7fa8-4daa-98a5-85236e760520'),
	('ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '{"sub": "ad38532f-78a3-4207-8c7d-3b25f6501b1a", "email": "researcher@scibithub.test", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 11:12:12.165995+00', '2026-07-16 11:12:12.166025+00', '2026-07-16 11:12:12.166025+00', 'c242a368-67c5-4e46-a284-3eeb5bda2666'),
	('a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', '{"sub": "a8ec87c4-54c1-4e75-bc7d-1abd96989ace", "email": "contributor@scibithub.test", "email_verified": false, "phone_verified": false}', 'email', '2026-07-16 11:13:31.011634+00', '2026-07-16 11:13:31.011683+00', '2026-07-16 11:13:31.011683+00', '22068e2d-ae15-4822-8642-968730e049d7');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "username", "profile_picture", "role", "metadata", "created_at", "deleted_at", "country") VALUES
	('86979aa3-a397-4feb-88e2-9199e719a451', 'Admin', NULL, 'admin', '{}', '2026-07-16 11:03:00.389891', NULL, 'Tunisia'),
	('ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'Researcher01', NULL, 'researcher', '{"interests": ["Biology", "Climate Science"], "isVerified": false, "researcherType": "academic"}', '2026-07-16 11:12:12.253655', NULL, 'Italy'),
	('a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'Contributor01', NULL, 'contributor', '{"interests": ["Astronomy", "Physics", "AI & Machine Learning"]}', '2026-07-16 11:13:31.108355', NULL, 'Japan');


--
-- Data for Name: discussions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."discussions" ("id", "title", "body", "category", "tags", "created_at", "updated_at", "creator", "files", "status", "deleted_at") VALUES
	('d4417791-bb58-4b63-bb4e-f87543df6279', 'What AI Technologies Should We Add to the Platform?', 'We''re exploring ways to make this platform smarter and more helpful for researchers and contributors alike. From language models and image recognition to automated data analysis or recommendation systems — the possibilities are wide!

💬 What kind of AI features would you like to see here?
Some examples to spark ideas:

- AI that helps analyze research data
- Tools to summarize discussions or findings
- Image/text classification for project contributions
- Personalized project recommendations

Drop your ideas below — no suggestion is too small! ✨', 'platform', '{AI,"new features",suggestions}', '2026-07-17 11:45:31.345608+00', NULL, '86979aa3-a397-4feb-88e2-9199e719a451', NULL, 'open', NULL),
	('2dece1cf-863e-4adc-a0ea-a5db433c9059', 'Have AI technologies become a must for every website?', 'Artificial Intelligence is everywhere — powering chatbots, personalizing user experiences, generating content, analyzing behavior, and more. But with its increasing presence, we face a fundamental question:

> **Is AI a must-have for every website, or is it still optional depending on context?**

Let’s open the floor with some thought-provoking angles. Feel free to add your take, challenge ideas, or share examples!

---

## ✅ Arguments *For* AI Being a Must

- **Improved User Experience**: AI helps tailor experiences based on user behavior. Is personalization now expected?
- **Real-Time Support**: Chatbots reduce wait times and keep users engaged — are users starting to expect 24/7 help?
- **Data Insights**: AI can optimize content, design, and marketing strategies. Is this becoming essential for growth?
- **Keeping Up with Competitors**: Many modern platforms now integrate AI — is not using it a disadvantage?

---

## ❌ Arguments *Against* AI as a Requirement

- **Not Always Relevant**: Do basic websites (e.g., portfolios, blogs, static sites) really benefit from AI?
- **Resource Intensive**: AI can require time, money, and technical know-how — is it realistic for small teams?
- **Privacy & Trust Concerns**: Users may be wary of AI that collects or interprets their data — how much is too much?
- **Unnecessary Complexity**: Can AI sometimes be a solution looking for a problem?

---

## ⚖️ Middle Ground

Some say it''s not about whether **every** website needs AI, but whether **your** website benefits from it.

- When does AI actually improve UX or performance?
- Should we focus more on thoughtful, goal-driven features rather than trendy tech?

---

## 💬 Your Turn

- Do **you** think AI should be part of every website going forward?
- Have you worked on a project where AI made a clear difference — or where it was just hype?
- What types of sites truly *need* AI, and which ones can go without?

👇 Drop your thoughts below and let’s explore different perspectives!', 'emerging topics', '{AI}', '2026-07-17 11:54:36.47382+00', NULL, 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, 'open', NULL);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("id", "name", "long_description", "domain", "scope", "countries", "cover_image", "tags", "links", "visibility", "participation_level", "moderation_level", "deadline", "status", "created_at", "published_at", "updated_at", "creator", "short_description", "deleted_at", "activity_status", "results_summary") VALUES
	('d9d38fbd-0b85-400a-a240-eafb6da4ff78', 'The Impact of Music on Mood and Focus', 'This project explores how listening to music influences an individual''s emotional state and level of concentration. By collecting anonymous self-reported data from diverse contributors, we aim to identify patterns between music genres, emotional response, and cognitive performance.

👤 Anyone can participate — no special knowledge needed. Just:
1. Listen to a song of your choice (any genre/language)
2. Fill out a quick survey about how it affects your mood, focus, and energy
3. Optionally repeat the process with different songs over time

We’re particularly curious about:
- How different genres affect people differently
- Whether certain emotions are commonly triggered by specific musical elements
- The relationship between background music and task productivity', 'Psychology', 'global', NULL, NULL, '{music,emotions,mood,cognition}', '{"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3734071/\",   \"https://www.health.harvard.edu/mind-and-mood/music-and-health\",   \"https://en.wikipedia.org/wiki/Contrasting_and_categorization_of_emotions"}', 'public', 'open', 'none', NULL, 'published', '2026-07-17 11:09:05.880358', '2026-07-17 11:39:10.097', NULL, 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'Help us understand how different types of music affect people''s emotions and ability to concentrate. Participate by filling a short survey based on your current mood and what you''re listening to.', NULL, 'ongoing', NULL),
	('a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', 'Urban Birdsong Identification', 'This project aims to explore urban biodiversity by identifying bird species through their songs.

Audio recordings were collected from parks, rooftops, and neighborhoods in various cities to study how urban environments affect bird distribution and vocal behavior.

Participants are invited to listen to short audio clips and help classify which bird species are present.  
These contributions will support ecological research and help build an open dataset of acoustic biodiversity.

---

**Scientific Goals:**
- Assess the presence of noise-sensitive species in cities  
- Build a collaborative database of bird vocalizations in urban habitats', 'Ecology', 'global', NULL, 'http://localhost:54321/storage/v1/object/public/projects/cover_images/a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a?v=1784218714186', '{birds,"urban ecology",wildlife,biodiversity,"species identification"}', '{https://www.kaggle.com/datasets/rohanrao/xeno-canto-bird-recordings-extended-a-m,https://xeno-canto.org}', 'public', 'open', 'none', NULL, 'published', '2026-07-16 13:38:05.880711', '2026-07-17 11:39:05.951', '2026-07-16 16:18:34.293', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'Identify bird species from audio recordings captured in urban environments.', NULL, 'ongoing', NULL),
	('64f12177-210b-4193-ae10-aeb9de69820b', 'Perception & Bias in Everyday Scenes', 'Social situations are not always what they seem. Two people looking at the same image of a crowded street or a tense conversation might describe completely different emotions, intentions, or power dynamics.

This project explores how individuals interpret ambiguous or emotionally complex social scenes, and how those interpretations are shaped by cultural background, personal experience, and psychological disposition.

You will be asked to:

View photos of everyday or ambiguous social situations (e.g. people talking, isolated individuals, subtle facial expressions).

Provide your own interpretation of what’s happening in each image.

Answer reflective survey questions about your perception of emotions and social interactions.

By combining visual interpretation and self-reported survey data, this study aims to uncover patterns in social perception and possible implicit biases we carry into our interactions.

🖼️ Images used in this project are carefully selected to be rich in context but open to interpretation — there are no right or wrong answers.

Your participation will help researchers in social psychology, communication, and cognitive science better understand how humans read and misread each other in daily life.', 'Social Sciences', 'global', NULL, 'http://localhost:54321/storage/v1/object/public/projects/cover_images/64f12177-210b-4193-ae10-aeb9de69820b?v=1784287467498', '{"social perception",empathy,"emotional intelligence","cognitive bias",interpretation,"body language"}', NULL, 'public', 'open', 'moderate', NULL, 'published', '2026-07-17 11:24:27.180058', '2026-07-17 11:39:13.535', NULL, 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'Explore how people perceive social situations differently by interpreting ambiguous photos and answering short survey questions. Your perspective helps us understand human perception and bias.', NULL, 'ongoing', NULL);


--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forum_topics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."comments" ("id", "content", "created_at", "updated_at", "creator", "discussion", "forum_topic", "parent_comment") VALUES
	('c86e485d-6076-421b-a0de-f0ea8284e66c', 'Not EVERY site needs AI — it’s becoming overused. Many platforms add it just for hype, not real value. Simpler, focused experiences are getting buried under unnecessary AI features.', '2026-07-17 14:52:11.501032', NULL, 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '2dece1cf-863e-4adc-a0ea-a5db433c9059', NULL, NULL);


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tasks" ("id", "title", "description", "tutorial", "type", "data_source", "target_count", "fields", "status", "created_at", "updated_at", "project", "data_type", "deleted_at") VALUES
	('68c2f067-ebec-4009-a977-8deea087bde6', 'Bird Sound Collection', 'This task invites participants to contribute their own bird sound recordings.
These field recordings help expand the dataset with diverse examples from various regions and urban environments.
Contributors may include additional information like species name, date, and location to enhance the scientific value of the submission.', '### How to Complete This Task

1. Use your phone or recording device to **capture a bird sound** from your surroundings.
2. Upload the audio file (in `.mp3` or `.wav` format).
3. *(Optional)* Add any of the following:
   - Bird name (if known)
   - Location of the recording
   - Date and time
4. Click **“Submit”** once your file and information are ready. 
---
### Example
![House Sparrow Image](https://media.gettyimages.com/id/106969459/photo/a-house-sparrow-is-p.jpg?b=1&s=594x594&w=0&k=20&c=aVPCZNWl-JBA64iOh83s3Zry9-TvBnRt0KCPDQA72mc=)

**Bird name**: House Sparrow', 'data collection', NULL, 100, '[{"type": "file upload", "label": "Bird Sound", "params": {"fileType": "audio"}, "required": true}, {"type": "file upload", "label": "Bird Image", "params": {"fileType": "image"}, "required": false}, {"type": "short answer", "label": "Bird Name", "params": {}, "required": false, "description": "Provide the name of the bird if known.", "placeholder": "Enter bird name..."}, {"type": "short answer", "label": "Location of the Recording", "params": {}, "required": false, "description": "Provide the location where the bird recording was made if possible.", "placeholder": "Enter location..."}, {"type": "date", "label": "Date of the Recording", "params": {}, "required": false, "description": "Provide the date when the recording was made."}]', 'active', '2026-07-16 15:17:08.770169', '2026-07-16 16:18:34.286', 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', NULL, NULL),
	('6c9059f4-9d3f-47fb-a259-f12bcb49453d', 'Mood & Focus Survey After Listening to Music', 'This task invites you to listen to a song of your choice and fill out a short form about your mood and focus before and after listening. The goal is to gather a broad and diverse dataset based on personal experience.', '## 🎧 How to Complete This Task

1. Choose a song or instrumental piece you''d like to listen to.
2. Before you hit play, take a moment to reflect on your current mood.
3. Play the song. While listening, you can be doing something (working, relaxing, etc.) or just focusing on the music.
4. After the song finishes, assess how you feel and whether it helped you concentrate.
5. Fill out the survey form provided with your honest responses.

You can repeat this task multiple times using different songs to help us build a more accurate understanding.
', 'data collection', NULL, 500, '[{"id": "a8e26e7b-031c-458d-89c7-9808bbd840b2", "type": "multiple choice", "label": "Age group", "params": {"options": ["Under 18", "18–24", "25–34", "35–44", "45+"]}, "required": true}, {"id": "50d3004a-9ee8-42ed-bfe1-2cde714bef11", "type": "multiple choice", "label": "Mood before listening", "params": {"options": ["Neutral", "Sad", "Anxious", "Angry", "Tired", "Other"]}, "required": true}, {"id": "1ae20e9f-d254-4c99-9016-87740ab0e410", "type": "short answer", "label": "Song title or genre", "params": {"maxLength": "100", "minLength": "3"}, "required": true, "placeholder": "e.g., “Lo-fi beats”, “Pop”, or a song name"}, {"id": "462efcec-7ad7-4f4a-ae7b-86163e755e75", "type": "multiple choice", "label": "Mood after listening", "params": {"options": ["Neutral", "Sad", "Anxious", "Angry", "Tired", "Other"]}, "required": true}, {"id": "908b86ab-4601-4f46-ae91-fb7fed3ccafe", "type": "multiple choice", "label": "Did it help you focus?", "params": {"options": ["Yes", "No", "Not sure"]}, "required": true}, {"id": "2c7f9a17-e6d6-463b-a01d-37d53af8ec7f", "type": "multiple choice", "label": "What were you doing while listening?", "params": {"options": ["Studying", "Working", "Relaxing", "Commuting", "Other"]}, "required": true}, {"id": "7d02e393-1915-4529-b1f8-f1eb0ebb7ae4", "type": "multiple choice", "label": "Familiarity with the song", "params": {"options": ["First time", "Heard before", "Favorite"]}, "required": true}, {"id": "83b27657-793c-472b-88a5-3dc132230931", "type": "long answer", "label": "Additional comments", "params": {}, "required": false, "placeholder": "Anything else you want to share"}]', 'active', '2026-07-17 11:09:05.968307', NULL, 'd9d38fbd-0b85-400a-a240-eafb6da4ff78', NULL, NULL),
	('a901790c-d1d6-44bf-8823-1009e3d06a17', 'Bird Sound Identification', 'This task involves listening to a recorded bird sound and identifying the most likely category or species it belongs to.
It contributes to understanding which bird species are present in urban environments based on their vocal signatures.
Participants are encouraged to select the closest match and optionally provide the specific name if they recognize it.', '### How to Complete This Task

1. Press ▶️ to **play the audio**.
2. From the list, select the **category or species** that best matches what you hear.
3. *(Optional)* If you recognize the exact bird, type its **name** in the field provided.
4. Submit your answer by clicking the **“Submit”** button.

---

### Example

- Audio: A repeating chirp at mid pitch  
- You choose: `Sparrow`  
- *(Optional)* Name: `House Sparrow`

---

![House Sparrow Image](https://media.gettyimages.com/id/106969459/photo/a-house-sparrow-is-p.jpg?b=1&s=594x594&w=0&k=20&c=aVPCZNWl-JBA64iOh83s3Zry9-TvBnRt0KCPDQA72mc=)', 'data labelling', 'projects/a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a/task-a901790c-d1d6-44bf-8823-1009e3d06a17/dataset', 70, '[{"id": "e3ed809b-6a53-4b00-9452-14c2509dfdfb", "type": "multiple choice", "label": "Species", "params": {"options": ["Sparrow", "Pigeon / Dove", "Blackbird", "Crow / Raven", "Finch", "Tit (e.g. Great Tit)", "Starling", "Seagull", "Magpie", "Robin", "Other", "Unknown / Too Noisy"]}, "required": true, "description": "Pick the category that best matches what you hear."}, {"id": "ee9a0344-49ce-4562-b828-9f9bf8462224", "type": "short answer", "label": "Name", "params": {"minLength": "2"}, "required": false, "description": "If you recognize the exact bird, type its name.", "placeholder": "Enter bird name..."}]', 'active', '2026-07-16 15:17:08.770169', '2026-07-16 16:18:34.602', 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', 'audio', NULL),
	('cf33a0bd-3e96-4da0-a8c0-14decc266181', 'Social Perception Survey', 'This short questionnaire helps us understand how you generally perceive social situations. It complements your image interpretation and helps us explore how perception styles differ.', '## About this questionnaire

Thanks for interpreting the images!  
Before finishing, please answer a short survey about **how you typically interpret social situations**.

- There are no right or wrong answers.
- Just answer honestly and based on your instincts.

All responses are **anonymous** and used strictly for research purposes.', 'survey', NULL, NULL, '[{"id": "4938c7bc-06e8-4888-b290-634c1c78c002", "type": "multiple choice", "label": "perception style", "params": {"options": ["arguing", "passionate", "calmly discussing", "not sure"]}, "required": true, "description": "When you see two people talking, you usually think they are:"}, {"id": "5b5bc054-2413-4ad5-9a4e-d8f1a87f0eb9", "type": "multiple choice", "label": "interpretation difference", "params": {"options": ["often", "sometimes", "rarely", "never"]}, "required": true, "description": "Do you think your interpretation of social scenes is different from others’?"}, {"id": "89ae9043-d3bf-4606-b105-9b6af70a5420", "type": "number", "label": "confidence level", "params": {"maxValue": "5", "minValue": "1"}, "required": true, "description": "How confident are you in reading others'' emotions based on body language?"}, {"id": "5e1fde65-b916-4f2b-b5e3-8dc7ddfd6536", "type": "number", "label": "culture openness", "params": {"maxValue": "5", "minValue": "1"}, "required": false, "description": "To what extent do you think culture affects how people interpret scenes?"}, {"id": "10945f0f-544d-4ba7-a07e-34c6c9e7fe6b", "type": "long answer", "label": "comments", "params": {}, "required": false, "description": "Any comments or thoughts about the experience?"}]', 'active', '2026-07-17 11:24:27.683866', NULL, '64f12177-210b-4193-ae10-aeb9de69820b', NULL, NULL),
	('89d0851e-d436-4706-93e7-91da3e1675fd', 'Image Interpretation', 'In this task, you''ll observe an image showing a socially ambiguous scene. Your goal is to describe what you think is happening, what emotions you perceive, and how you arrived at that interpretation.
There are no right or wrong answers — your perspective is valuable to our research.', '## How to complete this task

1. Carefully examine the image displayed.
2. Think about the social dynamics, emotions, and possible context.
3. Answer each question based on **your personal interpretation**.
4. Trust your intuition — every point of view adds value to this research.

If you’re unsure, just choose the option that feels most likely to you.', 'data labelling', 'projects/64f12177-210b-4193-ae10-aeb9de69820b/task-89d0851e-d436-4706-93e7-91da3e1675fd/dataset', 100, '[{"id": "b39ee159-70a5-405c-a350-b205b2e335ab", "type": "multiple choice", "label": "scene type", "params": {"options": ["friendly interaction", "argument", "emotional support", "neutral", "hard to say"]}, "required": true, "description": "How would you describe the scene?"}, {"id": "77b23da2-b085-4b27-908f-b84d0514c1ba", "type": "multiple choice", "label": "main emotion", "params": {"options": ["happiness", "anger", "sadness", "anxiety", "indifference", "mixed/unclear"]}, "required": true, "description": "What is the dominant emotion you perceive?"}, {"id": "ab9d185e-4892-4ca2-a8c5-44598c5b31b6", "type": "multiple choice", "label": "relationship", "params": {"options": ["friends", "family", "strangers", "colleagues", "not sure"]}, "required": true, "description": "What do you think the relationship is between the people (if any)?"}, {"id": "6d0eb0ab-1edd-483e-996f-aa30ee44b76f", "type": "number", "label": "confidence", "params": {"maxValue": "5", "minValue": "1"}, "required": true, "description": "How confident are you in your interpretation? (1 = not confident, 5 = very confident)"}, {"id": "43f15376-c72e-431d-901a-de2d4c31f3ab", "type": "multiple choice", "label": "alternative", "params": {"options": ["definitely", "possibly", "unlikely", "not at all"]}, "required": true, "description": "Could this scene be interpreted differently by someone else?"}]', 'active', '2026-07-17 11:24:27.683866', NULL, '64f12177-210b-4193-ae10-aeb9de69820b', 'image', NULL);


--
-- Data for Name: contributions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."contributions" ("id", "created_at", "data", "status", "user", "task", "deleted_at") VALUES
	(1, '2026-07-17 14:33:36.970558+00', '{"Species": {"value": "Sparrow"}, "data_file": "projects/a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a/task-a901790c-d1d6-44bf-8823-1009e3d06a17/dataset/0-XC11581.mp3"}', 'approved', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'a901790c-d1d6-44bf-8823-1009e3d06a17', NULL),
	(3, '2026-07-17 14:34:41.208956+00', '{"Species": {"value": "Magpie"}, "data_file": "projects/a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a/task-a901790c-d1d6-44bf-8823-1009e3d06a17/dataset/15-XC544061.mp3"}', 'approved', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'a901790c-d1d6-44bf-8823-1009e3d06a17', NULL),
	(4, '2026-07-17 14:47:51.454537+00', '{"Bird Name": {"value": "Gray Catbird"}, "Bird Image": {"files": ["contributions/task-68c2f067-ebec-4009-a977-8deea087bde6/1784299671273-a8ec87c4-54c1-4e75-bc7d-1abd96989ace"]}, "Bird Sound": {"files": ["contributions/task-68c2f067-ebec-4009-a977-8deea087bde6/1784299671187-a8ec87c4-54c1-4e75-bc7d-1abd96989ace"]}}', 'approved', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', '68c2f067-ebec-4009-a977-8deea087bde6', NULL),
	(2, '2026-07-17 14:34:16.230319+00', '{"Name": {"value": "House Sparrow"}, "Species": {"value": "Sparrow"}, "data_file": "projects/a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a/task-a901790c-d1d6-44bf-8823-1009e3d06a17/dataset/20-XC585124.mp3"}', 'approved', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'a901790c-d1d6-44bf-8823-1009e3d06a17', NULL);


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "recipient_id", "message_template", "target", "is_read", "created_at", "user_id", "project_id", "discussion_id", "topic_id", "comment_id", "task_id", "action_url", "type") VALUES
	('5bdcf47d-6ee9-4ff5-b628-44d52b21ace4', '86979aa3-a397-4feb-88e2-9199e719a451', '👋 Welcome, Admin! We''re thrilled to have you join us!', NULL, true, '2026-07-16 11:03:00.59455', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'info'),
	('f2b66e90-9705-4779-8689-ed2105904e73', NULL, '{user.username} just joined the community!', 'to_all_admins', false, '2026-07-16 11:12:12.365329', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', NULL, NULL, NULL, NULL, NULL, '/users/ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'info'),
	('6db4bbfd-9061-41a1-882f-05c360fcd272', NULL, '{user.username} just joined the community!', 'to_all_admins', false, '2026-07-16 11:13:31.156842', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, NULL, '/users/a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'info'),
	('eb9e6f34-e3fe-4915-9e5e-2118b0171a39', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', '👋 Welcome, Contributor01! We''re thrilled to have you join us!', NULL, true, '2026-07-16 11:13:31.156842', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'info'),
	('6688e274-03ab-47bb-97d1-95fdfa003fc5', NULL, '{user.username} just joined the community!', 'to_all_admins', true, '2026-07-16 11:03:00.59455', '86979aa3-a397-4feb-88e2-9199e719a451', NULL, NULL, NULL, NULL, NULL, '/users/86979aa3-a397-4feb-88e2-9199e719a451', 'info'),
	('8f5489b3-a08e-42fa-a6d3-6bd26ffd3d6c', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '👋 Welcome, Researcher01! We''re thrilled to have you join us!', NULL, true, '2026-07-16 11:12:12.365329', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'info'),
	('4abf7369-0a4f-423e-b794-48a23e36e071', NULL, '{user.username} created a new project "The Impact of Music on Mood and Focus". Review it!', 'to_all_admins', false, '2026-07-17 11:09:06.160486', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', NULL, NULL, NULL, NULL, NULL, '/admin/projects?id=d9d38fbd-0b85-400a-a240-eafb6da4ff78', 'info'),
	('d250278d-4b4e-474b-ab20-ad95cff15e42', NULL, '{user.username} created a new project "Perception & Bias in Everyday Scenes". Review it!', 'to_all_admins', false, '2026-07-17 11:24:28.128722', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', NULL, NULL, NULL, NULL, NULL, '/admin/projects?id=64f12177-210b-4193-ae10-aeb9de69820b', 'info'),
	('3159e321-cfdc-4df0-9d91-72afe25b48b1', NULL, '{user.username} created a new discussion {discussion.title} .', 'to_all_admins', false, '2026-07-17 11:45:31.4632', '86979aa3-a397-4feb-88e2-9199e719a451', NULL, 'd4417791-bb58-4b63-bb4e-f87543df6279', NULL, NULL, NULL, '/discussions/d4417791-bb58-4b63-bb4e-f87543df6279', 'info'),
	('d2d75a1b-9073-4ea6-b650-c847b3a50db6', NULL, '{user.username} created a new discussion {discussion.title} .', 'to_all_admins', false, '2026-07-17 11:54:36.582916', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, '2dece1cf-863e-4adc-a0ea-a5db433c9059', NULL, NULL, NULL, '/discussions/2dece1cf-863e-4adc-a0ea-a5db433c9059', 'info'),
	('0b9755b7-17b9-4605-add7-48fcd09eecc8', '86979aa3-a397-4feb-88e2-9199e719a451', '{user.username} upvoted ▲ your discussion.', 'to_specific_user', false, '2026-07-17 11:57:59.214442', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, NULL, '/discussions/d4417791-bb58-4b63-bb4e-f87543df6279', 'info'),
	('f6951213-f17e-4ea0-9cb3-154c6722a761', '86979aa3-a397-4feb-88e2-9199e719a451', '{user.username} downvoted ▼ your discussion.', 'to_specific_user', false, '2026-07-17 11:58:38.193888', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, NULL, '/discussions/d4417791-bb58-4b63-bb4e-f87543df6279', 'info'),
	('137e673e-0ea5-414d-9796-2961397a76d7', '86979aa3-a397-4feb-88e2-9199e719a451', '{user.username} upvoted ▲ your discussion.', 'to_specific_user', false, '2026-07-17 11:58:39.538149', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, NULL, '/discussions/d4417791-bb58-4b63-bb4e-f87543df6279', 'info'),
	('9d669be9-b983-4524-a6bd-8ed73a603890', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', '{user.username} replied to your discussion: {discussion.title} ↩ .', 'to_specific_user', false, '2026-07-17 14:52:11.545984', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', NULL, '2dece1cf-863e-4adc-a0ea-a5db433c9059', NULL, NULL, NULL, '/discussions/2dece1cf-863e-4adc-a0ea-a5db433c9059#c86e485d-6076-421b-a0de-f0ea8284e66c', 'info'),
	('a773c079-7634-4878-95f7-1cece46458cb', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', '{user.username} upvoted ▲ your discussion.', 'to_specific_user', false, '2026-07-17 14:52:41.769508', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', NULL, NULL, NULL, NULL, NULL, '/discussions/2dece1cf-863e-4adc-a0ea-a5db433c9059', 'info'),
	('a76a721b-05b0-455e-a34d-ac96a5c3f6cc', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '{user.username} hearted your project {project.name} ❤ .', 'to_specific_user', true, '2026-07-17 14:50:06.939098', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', NULL, NULL, NULL, NULL, NULL, 'info'),
	('a2978f2e-f64f-4bad-b156-f4ad7c67f96d', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '{user.username} hearted your project {project.name} ❤ .', 'to_specific_user', true, '2026-07-17 14:50:01.962209', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', NULL, NULL, NULL, NULL, NULL, 'info'),
	('fcbd79ab-de5d-4b20-a58d-b3dba0ea7d5b', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '{user.username} submitted a new contribution to {task.title} .', 'to_specific_user', true, '2026-07-17 14:47:51.564919', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, '68c2f067-ebec-4009-a977-8deea087bde6', '/contributions/4', 'info'),
	('91155897-eb4a-4a30-a624-6f516ecaa2a1', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '{user.username} submitted a new contribution to {task.title} .', 'to_specific_user', true, '2026-07-17 14:34:41.275567', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, 'a901790c-d1d6-44bf-8823-1009e3d06a17', '/contributions/3', 'info'),
	('12030fde-40d0-450f-b523-a1676ef39b6a', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '{user.username} submitted a new contribution to {task.title} .', 'to_specific_user', true, '2026-07-17 14:34:16.352413', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, 'a901790c-d1d6-44bf-8823-1009e3d06a17', '/contributions/2', 'info'),
	('e13f47e9-35db-4953-b9fc-3595116a99b4', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'Your project {project.name} has been published.', 'to_specific_user', true, '2026-07-17 11:39:06.008243', NULL, 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', NULL, NULL, NULL, NULL, '/profile/projects', 'info'),
	('b6a4f422-b1ec-4566-bb36-7c48d6dee6e9', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'Your project {project.name} has been published.', 'to_specific_user', true, '2026-07-17 11:39:10.150791', NULL, 'd9d38fbd-0b85-400a-a240-eafb6da4ff78', NULL, NULL, NULL, NULL, '/profile/projects', 'info'),
	('4ef6559f-7b03-4f72-b309-832cb538ac97', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'Your project {project.name} has been published.', 'to_specific_user', true, '2026-07-17 11:39:13.614996', NULL, '64f12177-210b-4193-ae10-aeb9de69820b', NULL, NULL, NULL, NULL, '/profile/projects', 'info'),
	('665dd559-dd0f-40dd-97ca-cf0775ae493b', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '{user.username} submitted a new contribution to {task.title} .', 'to_specific_user', true, '2026-07-17 14:33:37.058134', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', NULL, NULL, NULL, NULL, 'a901790c-d1d6-44bf-8823-1009e3d06a17', '/contributions/1', 'info');


--
-- Data for Name: participation_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: project_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."project_likes" ("id", "user_id", "project_id", "created_at") VALUES
	('3356edc5-8584-47d0-90d7-f0ab5ad2efbc', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', '2026-07-17 14:50:06.839339');


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: visualizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."visualizations" ("id", "title", "chart_type", "group_by", "value_field", "aggregation", "task", "created_at", "updated_at", "project", "type", "table_columns", "custom_function", "display_field") VALUES
	('70f5229f-8b9e-420c-bcb2-61a1c3ab731d', 'Collected Bird Images', NULL, NULL, NULL, NULL, '68c2f067-ebec-4009-a977-8deea087bde6', '2026-07-17 15:01:25.50085+00', NULL, 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', 'gallery', '{}', NULL, 'Bird Image'),
	('ae7e2d2e-6aca-4f72-b905-acc95373b845', 'Count of Identified Birds per Species', 'pie', 'Species', NULL, 'count', 'a901790c-d1d6-44bf-8823-1009e3d06a17', '2026-07-17 15:03:13.137803+00', '2026-07-17 15:27:30.945+00', 'a9faa8c9-8ed2-4d51-a42e-7ea7717bef3a', 'chart', NULL, NULL, NULL);


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."votes" ("id", "voter", "voted", "voted_type", "vote", "created_at") VALUES
	('6fb43c3e-89f8-4f46-a815-eccb33ce412d', 'a8ec87c4-54c1-4e75-bc7d-1abd96989ace', 'd4417791-bb58-4b63-bb4e-f87543df6279', 'discussion', 1, '2026-07-17 11:57:59.097259'),
	('8a1f3a5e-33b9-4e0b-ae09-d271bd76ec19', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', '2dece1cf-863e-4adc-a0ea-a5db433c9059', 'discussion', 1, '2026-07-17 14:52:41.681176'),
	('843749f8-6764-40f6-a342-e8fd3bcf39ae', 'ad38532f-78a3-4207-8c7d-3b25f6501b1a', 'c86e485d-6076-421b-a0de-f0ea8284e66c', 'comment', 1, '2026-07-17 14:53:46.538385');


SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 19, true);


--
-- Name: contributions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."contributions_id_seq"', 4, true);


--
-- Name: participation_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."participation_requests_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;

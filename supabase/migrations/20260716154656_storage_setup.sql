INSERT INTO "storage"."buckets" (id, name, public)
VALUES
('avatars', 'avatars', true),
('projects', 'projects', true);



CREATE POLICY "allow authenticated users to manage their avatars 1oj01fe_0" ON "storage"."objects" FOR SELECT TO "authenticated" USING ((("bucket_id" = 'avatars'::"text") AND ("name" = ("auth"."uid"())::"text")));

CREATE POLICY "allow authenticated users to manage their avatars 1oj01fe_1" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK ((("bucket_id" = 'avatars'::"text") AND ("name" = ("auth"."uid"())::"text")));

CREATE POLICY "allow authenticated users to manage their avatars 1oj01fe_2" ON "storage"."objects" FOR DELETE TO "authenticated" USING ((("bucket_id" = 'avatars'::"text") AND ("name" = ("auth"."uid"())::"text")));

CREATE POLICY "allow authenticated users to manage their avatars 1oj01fe_3" ON "storage"."objects" FOR UPDATE TO "authenticated" USING ((("bucket_id" = 'avatars'::"text") AND ("name" = ("auth"."uid"())::"text")));

CREATE POLICY "allow public access to published projects covers 1iiiika_0" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'projects'::"text") AND ("name" ~~ 'cover_images/%'::"text") AND (( SELECT "projects"."status"
FROM "public"."projects"
WHERE ("projects"."id" = ("split_part"("projects"."name", '/'::"text", 2))::"uuid")) = 'published'::"public"."project_status")));

CREATE POLICY "allow users to manage their projects covers 1iiiika_0" ON "storage"."objects" FOR SELECT TO "authenticated" USING ((("bucket_id" = 'projects'::"text") AND ("name" ~~ 'cover_images/%'::"text") AND (( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
FROM "public"."projects"
WHERE ("projects"."id" = ("split_part"("objects"."name", '/'::"text", 2))::"uuid")))));

CREATE POLICY "allow users to manage their projects covers 1iiiika_1" ON "storage"."objects" FOR UPDATE TO "authenticated" USING ((("bucket_id" = 'projects'::"text") AND ("name" ~~ 'cover_images/%'::"text") AND (( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
FROM "public"."projects"
WHERE ("projects"."id" = ("split_part"("objects"."name", '/'::"text", 2))::"uuid")))));

CREATE POLICY "allow users to manage their projects covers 1iiiika_2" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK ((("bucket_id" = 'projects'::"text") AND ("name" ~~ 'cover_images/%'::"text") AND (( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
FROM "public"."projects"
WHERE ("projects"."id" = ("split_part"("objects"."name", '/'::"text", 2))::"uuid")))));

CREATE POLICY "allow users to manage their projects covers 1iiiika_3" ON "storage"."objects" FOR DELETE TO "authenticated" USING ((("bucket_id" = 'projects'::"text") AND ("name" ~~ 'cover_images/%'::"text") AND (( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
FROM "public"."projects"
WHERE ("projects"."id" = ("split_part"("objects"."name", '/'::"text", 2))::"uuid")))));
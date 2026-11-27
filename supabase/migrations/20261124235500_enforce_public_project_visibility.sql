ALTER TABLE "public"."projects"
ADD CONSTRAINT "projects_public_visibility_only_check"
CHECK ("visibility" = 'public'::"public"."project_visibility");


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


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."activity_status" AS ENUM (
    'ongoing',
    'paused',
    'completed',
    'closed'
);


ALTER TYPE "public"."activity_status" OWNER TO "postgres";


CREATE TYPE "public"."discussion_status" AS ENUM (
    'open',
    'closed',
    'deleted'
);


ALTER TYPE "public"."discussion_status" OWNER TO "postgres";


CREATE TYPE "public"."moderation_level" AS ENUM (
    'strict',
    'moderate',
    'none'
);


ALTER TYPE "public"."moderation_level" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'to_specific_user',
    'to_all_admins',
    'to_all_contributors',
    'to_all_researchers',
    'to_all_users'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."participation_level" AS ENUM (
    'open',
    'restricted'
);


ALTER TYPE "public"."participation_level" OWNER TO "postgres";


CREATE TYPE "public"."project_progress" AS ENUM (
    'active',
    'closed',
    'published'
);


ALTER TYPE "public"."project_progress" OWNER TO "postgres";


CREATE TYPE "public"."project_status" AS ENUM (
    'draft',
    'pending',
    'published',
    'declined',
    'deleted'
);


ALTER TYPE "public"."project_status" OWNER TO "postgres";


CREATE TYPE "public"."project_visibility" AS ENUM (
    'public',
    'restricted',
    'private'
);


ALTER TYPE "public"."project_visibility" OWNER TO "postgres";


CREATE TYPE "public"."request_type" AS ENUM (
    'invitation',
    'application'
);


ALTER TYPE "public"."request_type" OWNER TO "postgres";


CREATE TYPE "public"."role" AS ENUM (
    'contributor',
    'researcher',
    'admin'
);


ALTER TYPE "public"."role" OWNER TO "postgres";


CREATE TYPE "public"."scope" AS ENUM (
    'global',
    'regional'
);


ALTER TYPE "public"."scope" OWNER TO "postgres";


CREATE TYPE "public"."task_status" AS ENUM (
    'active',
    'completed'
);


ALTER TYPE "public"."task_status" OWNER TO "postgres";


CREATE TYPE "public"."task_type" AS ENUM (
    'survey',
    'data collection',
    'data labelling'
);


ALTER TYPE "public"."task_type" OWNER TO "postgres";


CREATE TYPE "public"."validation_status" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE "public"."validation_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_contributions_growth"("days" integer) RETURNS TABLE("day" "text", "contributions" integer)
    LANGUAGE "sql"
    AS $_$
  WITH date_series AS (
    SELECT 
      date_trunc('day', current_date) - make_interval(days := n) AS day
    FROM generate_series(0, $1 - 1) AS n
  )
  SELECT
    TO_CHAR(ds.day, 'Mon DD') AS day,
    COUNT(c.id) AS contributions
  FROM date_series ds
  LEFT JOIN contributions c ON date_trunc('day', c.created_at) = ds.day
  GROUP BY ds.day
  ORDER BY ds.day;
$_$;


ALTER FUNCTION "public"."admin_contributions_growth"("days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_discussions_growth"("days" integer) RETURNS TABLE("day" "text", "discussions" integer)
    LANGUAGE "sql"
    AS $_$
  WITH date_series AS (
    SELECT 
      date_trunc('day', current_date) - make_interval(days := n) AS day
    FROM generate_series(0, $1 - 1) AS n
  )
  SELECT
    TO_CHAR(ds.day, 'Mon DD') AS day,
    COUNT(d.id) AS discussions
  FROM date_series ds
  LEFT JOIN discussions d ON date_trunc('day', d.created_at) = ds.day
  GROUP BY ds.day
  ORDER BY ds.day;
$_$;


ALTER FUNCTION "public"."admin_discussions_growth"("days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_discussions_most_downvoted"("limit_count" integer DEFAULT 5) RETURNS TABLE("discussion_id" "uuid", "discussion_title" "text", "downvotes" integer)
    LANGUAGE "sql"
    AS $$
  SELECT
    d.id,
    d.title,
    COUNT(v.id) filter (where v.vote = -1) AS downvotes
  FROM discussions d
  LEFT JOIN votes v ON v.voted = d.id
  GROUP BY d.id
  ORDER BY downvotes desc
  limit limit_count;
$$;


ALTER FUNCTION "public"."admin_discussions_most_downvoted"("limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_discussions_most_engaged"("limit_count" integer DEFAULT 5) RETURNS TABLE("discussion_id" "uuid", "discussion_title" "text", "replies" integer)
    LANGUAGE "sql"
    AS $$
  SELECT
    d.id,
    d.title,
    COUNT(c.id) AS replies
  FROM discussions d
  LEFT JOIN comments c ON c.discussion = d.id
  GROUP BY d.id
  ORDER BY replies desc
  limit limit_count;
$$;


ALTER FUNCTION "public"."admin_discussions_most_engaged"("limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_discussions_most_upvoted"("limit_count" integer DEFAULT 5) RETURNS TABLE("discussion_id" "uuid", "discussion_title" "text", "upvotes" integer)
    LANGUAGE "sql"
    AS $$
  SELECT
    d.id,
    d.title,
    COUNT(v.id) filter (where v.vote = 1) AS upvotes
  FROM discussions d
  LEFT JOIN votes v ON v.voted = d.id
  GROUP BY d.id
  ORDER BY upvotes desc
  limit limit_count;
$$;


ALTER FUNCTION "public"."admin_discussions_most_upvoted"("limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_get_ban_deletion_counts"() RETURNS TABLE("active" integer, "banned" integer, "deleted" integer)
    LANGUAGE "sql"
    AS $$
  select
    count(*) filter (
      where (banned_until)::timestamp is null
         or (banned_until)::timestamp < now()
    ) as active,
    count(*) filter (
      where (banned_until)::timestamp >= now()
    ) as banned,
    count(*) filter (
      where (deleted_at)::timestamp is not null
    ) as deleted
  from auth.users;
$$;


ALTER FUNCTION "public"."admin_get_ban_deletion_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_get_user_roles_and_types"() RETURNS TABLE("role" "text", "type" "text", "count" integer)
    LANGUAGE "sql"
    AS $$
  select
    role,
    metadata->>'researcherType' as type,
    count(*)
  from users
  where role in ('researcher', 'contributor')
  group by role, metadata->>'researcherType'
  order by role;
$$;


ALTER FUNCTION "public"."admin_get_user_roles_and_types"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_most_active_forums"() RETURNS TABLE("project_id" "uuid", "project_name" "text", "topics" integer)
    LANGUAGE "sql"
    AS $$
  select
    projects.id,
    name,
    count(t.id) as topics
  from projects
  left join forum_topics as t on(t.project = projects.id)
  group by projects.id
  order by topics desc
  limit 5
$$;


ALTER FUNCTION "public"."admin_most_active_forums"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_project_activity_distribution"() RETURNS TABLE("activity_status" "text", "count" integer)
    LANGUAGE "sql"
    AS $$
  select
    activity_status,
    count(*)
  from projects
  where status = 'published'
  group by activity_status
$$;


ALTER FUNCTION "public"."admin_project_activity_distribution"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_project_domains_distribution"() RETURNS TABLE("domain" "text", "count" integer)
    LANGUAGE "sql"
    AS $$
  select
    domain,
    count(*)
  from projects
  group by domain
$$;


ALTER FUNCTION "public"."admin_project_domains_distribution"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_report_status_distribution"() RETURNS TABLE("status" "text", "count" integer)
    LANGUAGE "sql"
    AS $$
  select
    status,
    count(*)
  from reports
  group by status
$$;


ALTER FUNCTION "public"."admin_report_status_distribution"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_reports_growth"("days" integer) RETURNS TABLE("day" "text", "reports" integer)
    LANGUAGE "sql"
    AS $_$
  WITH date_series AS (
    SELECT 
      date_trunc('day', current_date) - make_interval(days := n) AS day
    FROM generate_series(0, $1 - 1) AS n
  )
  SELECT
    TO_CHAR(ds.day, 'Mon DD') AS day,
    COUNT(r.id) AS reports
  FROM date_series ds
  LEFT JOIN reports r ON date_trunc('day', r.created_at) = ds.day
  GROUP BY ds.day
  ORDER BY ds.day;
$_$;


ALTER FUNCTION "public"."admin_reports_growth"("days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_topics_interactivity"("days" integer) RETURNS TABLE("day" "text", "replies" integer, "upvotes" integer, "downvotes" integer)
    LANGUAGE "sql"
    AS $_$
  WITH date_series AS (
    SELECT 
      date_trunc('day', current_date) - make_interval(days := n) AS day
    FROM generate_series(0, $1 - 1) AS n
  )
  SELECT
    TO_CHAR(ds.day, 'Mon DD') AS day,
    COUNT(c.id) AS reports,
    COUNT(v.id) filter (where v.vote = 1) as upvotes,
    COUNT(v.id) filter (where v.vote = -1) as downvotes
  FROM date_series ds
  LEFT JOIN comments c ON date_trunc('day', c.created_at) = ds.day and c.forum_topic is not null
  LEFT JOIN votes v ON date_trunc('day', v.created_at) = ds.day and v.voted_type = 'forum topic'
  GROUP BY ds.day
  ORDER BY ds.day;
$_$;


ALTER FUNCTION "public"."admin_topics_interactivity"("days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_user_growth"("days" integer) RETURNS TABLE("date" "date", "researchers" integer, "contributors" integer)
    LANGUAGE "sql"
    AS $_$
  select
    date_trunc('day', created_at)::date as date,
    count(*) filter (where role = 'researcher') as researchers,
    count(*) filter (where role = 'contributor') as contributors
  from users
  where created_at >= current_date - make_interval(days := $1)
  group by date
  order by date;
$_$;


ALTER FUNCTION "public"."admin_user_growth"("days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_users_growth"("months" integer) RETURNS TABLE("month" "text", "researchers" integer, "contributors" integer)
    LANGUAGE "sql"
    AS $_$
  select
    to_char(date_trunc('month', created_at), 'Mon') as month,
    count(*) filter (where role = 'researcher') as researchers,
    count(*) filter (where role = 'contributor') as contributors
  from users
  where created_at >= date_trunc('month', current_date) - make_interval(months := $1)
  group by date_trunc('month', created_at)
  order by date_trunc('month', created_at);
$_$;


ALTER FUNCTION "public"."admin_users_growth"("months" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_votes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  DELETE FROM votes WHERE voted = OLD.id and voted_type = TG_ARGV[0];
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."delete_votes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_similar_discussions"("search_text" "text", "input_tags" "text"[], "input_category" "text", "exclude_id" "uuid" DEFAULT NULL::"uuid", "result_limit" integer DEFAULT 5) RETURNS TABLE("id" "uuid", "title" "text", "body" "text", "tags" "text"[], "category" "text", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "creator" "jsonb", "replies" bigint, "upvotes" bigint, "downvotes" bigint, "status" "public"."discussion_status", "similarity" real)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select
    d.id,
    d.title,
    d.body,
    d.tags,
    d.category,
    d.created_at,
    d.updated_at,
    d.creator_info as creator,
    d.replies,
    d.upvotes,
    d.downvotes,
    d.status,
    (
      ts_rank_cd(d.title_tsv, plainto_tsquery('english', search_text)) +
      (cardinality(array(select unnest(d.tags) intersect select unnest(input_tags)))::real / greatest(cardinality(d.tags), 1)) +
      (case when d.category = input_category then 0.2 else 0 end)
    )::real as similarity
  from discussions_with_replies_and_votes d
  where
    d.deleted_at is null
    -- and d.title_tsv @@ plainto_tsquery('english', search_text)
    and (exclude_id is null or d.id != exclude_id)
  order by similarity desc
  limit result_limit;
end;
$$;


ALTER FUNCTION "public"."find_similar_discussions"("search_text" "text", "input_tags" "text"[], "input_category" "text", "exclude_id" "uuid", "result_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_discussions_tags"() RETURNS SETOF "text"
    LANGUAGE "sql"
    AS $$
  select distinct unnest(tags)
  from discussions
  order by 1;
$$;


ALTER FUNCTION "public"."get_all_discussions_tags"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_forum_topics_tags"("project_id" "uuid") RETURNS SETOF "text"
    LANGUAGE "sql"
    AS $$
  select distinct unnest(tags)
  from forum_topics
  where project = project_id
  order by 1;
$$;


ALTER FUNCTION "public"."get_all_forum_topics_tags"("project_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_projects_tags"() RETURNS SETOF "text"
    LANGUAGE "sql"
    AS $$
  select distinct unnest(tags)
  from projects
  where status = 'published'
  order by 1;
$$;


ALTER FUNCTION "public"."get_all_projects_tags"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_table_metrics"("table_name" "text", "category_column" "text", "category_one" "text", "category_two" "text") RETURNS TABLE("total" bigint, "month_total" bigint, "category_one_total" bigint, "category_two_total" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY EXECUTE format('
    SELECT
      COUNT(*)::bigint,
      COUNT(*) FILTER (WHERE created_at >= date_trunc(''month'', CURRENT_DATE))::bigint,
      COUNT(*) FILTER (WHERE %I = %L)::bigint,
      COUNT(*) FILTER (WHERE %I = %L)::bigint
    FROM %I',
    category_column, category_one,
    category_column, category_two,
    table_name
  );
END;
$$;


ALTER FUNCTION "public"."get_table_metrics"("table_name" "text", "category_column" "text", "category_one" "text", "category_two" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_task_contributions_over_time"("project_id" "uuid") RETURNS TABLE("date" "text", "task_title" "text", "contributions_count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_char(contributions.created_at, 'YYYY-MM-DD') AS date,
    tasks.title AS task_title,
    COUNT(contributions.id) AS contributions_count
  FROM
    contributions
  JOIN
    tasks ON contributions.task = tasks.id
  WHERE
    tasks.project = project_id
    AND contributions.deleted_at IS NULL
  GROUP BY
    date, task_title
  ORDER BY
    date;
END;
$$;


ALTER FUNCTION "public"."get_task_contributions_over_time"("project_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_top_contributors"("limit_count" integer DEFAULT 5, "time_range" interval DEFAULT NULL::interval) RETURNS TABLE("user_id" "uuid", "username" "text", "profile_picture" "text", "contribution_count" bigint, "last_contribution" timestamp without time zone)
    LANGUAGE "sql"
    AS $$
  SELECT
    u.id as user_id,
    u.username,
    u.profile_picture,
    COUNT(c.id) as contribution_count,
    MAX(c.created_at) as last_contribution
  FROM contributions c
  JOIN users u ON c.user = u.id
  WHERE 
    (time_range IS NULL OR c.created_at >= NOW() - time_range)
  GROUP BY u.id
  ORDER BY contribution_count DESC
  LIMIT limit_count;
$$;


ALTER FUNCTION "public"."get_top_contributors"("limit_count" integer, "time_range" interval) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_views"("topic_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE forum_topics SET views = views + 1 WHERE id = topic_id;
END;
$$;


ALTER FUNCTION "public"."increment_views"("topic_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "discussion_id" "uuid",
    "project_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone,
    "creator" "uuid",
    "discussion" "uuid",
    "forum_topic" "uuid",
    "parent_comment" "uuid"
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."comments_with_votes" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "content",
    NULL::timestamp without time zone AS "created_at",
    NULL::timestamp without time zone AS "updated_at",
    NULL::"uuid" AS "creator",
    NULL::"uuid" AS "discussion",
    NULL::"uuid" AS "forum_topic",
    NULL::"uuid" AS "parent_comment",
    NULL::"jsonb" AS "creator_info",
    NULL::bigint AS "upvotes",
    NULL::bigint AS "downvotes";


ALTER TABLE "public"."comments_with_votes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contributions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "data" "jsonb" NOT NULL,
    "status" "public"."validation_status" DEFAULT 'pending'::"public"."validation_status",
    "user" "uuid",
    "task" "uuid",
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."contributions" OWNER TO "postgres";


ALTER TABLE "public"."contributions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."contributions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."discussions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "body" "text" NOT NULL,
    "category" "text" NOT NULL,
    "tags" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "creator" "uuid",
    "files" "text"[],
    "status" "public"."discussion_status" DEFAULT 'open'::"public"."discussion_status" NOT NULL,
    "title_tsv" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", "title")) STORED,
    "deleted_at" timestamp without time zone
);


ALTER TABLE "public"."discussions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "profile_picture" "text",
    "role" "public"."role" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone,
    "country" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "voter" "uuid",
    "voted" "uuid" NOT NULL,
    "voted_type" "text" NOT NULL,
    "vote" smallint NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "votes_vote_check" CHECK (("vote" = ANY (ARRAY['-1'::integer, 1])))
);


ALTER TABLE "public"."votes" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."discussions_with_replies_and_votes" AS
 SELECT "d"."id",
    "d"."title",
    "d"."body",
    "d"."category",
    "d"."tags",
    "d"."created_at",
    "d"."updated_at",
    "d"."creator",
    "d"."files",
    "d"."status",
    "d"."title_tsv",
    "d"."deleted_at",
    "jsonb_build_object"('id', "u"."id", 'username', "u"."username", 'profile_picture', "u"."profile_picture", 'role', "u"."role", 'metadata', "u"."metadata", 'deleted_at', "u"."deleted_at") AS "creator_info",
    "c"."replies",
    "v"."upvotes",
    "v"."downvotes"
   FROM ((("public"."discussions" "d"
     LEFT JOIN "public"."users" "u" ON (("u"."id" = "d"."creator")))
     LEFT JOIN LATERAL ( SELECT "count"(*) AS "replies"
           FROM "public"."comments" "c_1"
          WHERE ("c_1"."discussion" = "d"."id")) "c" ON (true))
     LEFT JOIN LATERAL ( SELECT "count"(*) FILTER (WHERE ("v_1"."vote" = 1)) AS "upvotes",
            "count"(*) FILTER (WHERE ("v_1"."vote" = '-1'::integer)) AS "downvotes"
           FROM "public"."votes" "v_1"
          WHERE (("v_1"."voted" = "d"."id") AND ("v_1"."voted_type" = 'discussion'::"text"))) "v" ON (true));


ALTER TABLE "public"."discussions_with_replies_and_votes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_topics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "tags" "text"[],
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone,
    "views" integer DEFAULT 0,
    "is_featured" boolean DEFAULT false,
    "project" "uuid" NOT NULL,
    "creator" "uuid",
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."forum_topics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "recipient_id" "uuid",
    "message_template" "text" NOT NULL,
    "target" "public"."notification_type" DEFAULT 'to_specific_user'::"public"."notification_type",
    "is_read" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "user_id" "uuid",
    "project_id" "uuid",
    "discussion_id" "uuid",
    "topic_id" "uuid",
    "comment_id" "uuid",
    "task_id" "uuid",
    "action_url" "text",
    "type" "text" DEFAULT 'info'::"text"
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."participation_requests" (
    "id" integer NOT NULL,
    "project_id" "uuid",
    "user_id" "uuid",
    "type" "public"."request_type" NOT NULL,
    "status" "public"."validation_status" DEFAULT 'pending'::"public"."validation_status",
    "requested_at" timestamp without time zone,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."participation_requests" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."participation_requests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."participation_requests_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."participation_requests_id_seq" OWNED BY "public"."participation_requests"."id";



CREATE TABLE IF NOT EXISTS "public"."project_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "project_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "long_description" "text",
    "domain" "text",
    "scope" "public"."scope" DEFAULT 'global'::"public"."scope",
    "countries" "text"[],
    "cover_image" "text",
    "tags" "text"[],
    "links" "text"[],
    "visibility" "public"."project_visibility" DEFAULT 'public'::"public"."project_visibility",
    "participation_level" "public"."participation_level" DEFAULT 'open'::"public"."participation_level",
    "moderation_level" "public"."moderation_level" DEFAULT 'none'::"public"."moderation_level",
    "deadline" timestamp without time zone,
    "status" "public"."project_status" DEFAULT 'draft'::"public"."project_status",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "published_at" timestamp without time zone,
    "updated_at" timestamp without time zone,
    "creator" "uuid",
    "short_description" "text" DEFAULT 'desc'::"text" NOT NULL,
    "deleted_at" timestamp without time zone,
    "activity_status" "public"."activity_status" DEFAULT 'ongoing'::"public"."activity_status" NOT NULL,
    "results_summary" "text"
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."projects_with_likes" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "name",
    NULL::"text" AS "long_description",
    NULL::"text" AS "domain",
    NULL::"public"."scope" AS "scope",
    NULL::"text"[] AS "countries",
    NULL::"text" AS "cover_image",
    NULL::"text"[] AS "tags",
    NULL::"text"[] AS "links",
    NULL::"public"."project_visibility" AS "visibility",
    NULL::"public"."participation_level" AS "participation_level",
    NULL::"public"."moderation_level" AS "moderation_level",
    NULL::timestamp without time zone AS "deadline",
    NULL::"public"."project_status" AS "status",
    NULL::timestamp without time zone AS "created_at",
    NULL::timestamp without time zone AS "published_at",
    NULL::timestamp without time zone AS "updated_at",
    NULL::"uuid" AS "creator",
    NULL::"text" AS "short_description",
    NULL::timestamp without time zone AS "deleted_at",
    NULL::"public"."activity_status" AS "activity_status",
    NULL::"text" AS "results_summary",
    NULL::"jsonb" AS "creator_info",
    NULL::bigint AS "likes";


ALTER TABLE "public"."projects_with_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reporter" "uuid",
    "reported_link" "text" NOT NULL,
    "reported_type" "text" NOT NULL,
    "reason" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "tutorial" "text" NOT NULL,
    "type" "public"."task_type" NOT NULL,
    "data_source" "text",
    "target_count" integer,
    "fields" "jsonb" DEFAULT '{}'::"jsonb",
    "status" "public"."task_status" DEFAULT 'active'::"public"."task_status",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone,
    "project" "uuid" NOT NULL,
    "data_type" character varying,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."tasks" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."topics_with_replies_and_votes" WITH ("security_invoker"='on') AS
 SELECT "t"."id",
    "t"."title",
    "t"."content",
    "t"."tags",
    "t"."views",
    "t"."is_featured",
    "t"."created_at",
    "t"."updated_at",
    "t"."creator" AS "creator_id",
    "t"."project" AS "project_id",
    "t"."deleted_at",
    "jsonb_build_object"('id', "u"."id", 'username', "u"."username", 'profile_picture', "u"."profile_picture", 'role', "u"."role", 'metadata', "u"."metadata", 'deleted_at', "u"."deleted_at") AS "creator",
    "jsonb_build_object"('id', "p"."id", 'name', "p"."name", 'creator', "p"."creator", 'deleted_at', "p"."deleted_at") AS "project",
    "c"."replies",
    "v"."upvotes",
    "v"."downvotes"
   FROM (((("public"."forum_topics" "t"
     LEFT JOIN "public"."users" "u" ON (("u"."id" = "t"."creator")))
     LEFT JOIN "public"."projects" "p" ON (("p"."id" = "t"."project")))
     LEFT JOIN LATERAL ( SELECT "count"(*) AS "replies"
           FROM "public"."comments" "c_1"
          WHERE ("c_1"."discussion" = "t"."id")) "c" ON (true))
     LEFT JOIN LATERAL ( SELECT "count"(*) FILTER (WHERE ("v_1"."vote" = 1)) AS "upvotes",
            "count"(*) FILTER (WHERE ("v_1"."vote" = '-1'::integer)) AS "downvotes"
           FROM "public"."votes" "v_1"
          WHERE (("v_1"."voted" = "t"."id") AND ("v_1"."voted_type" = 'forum topic'::"text"))) "v" ON (true));


ALTER TABLE "public"."topics_with_replies_and_votes" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."users_and_accounts_data" WITH ("security_invoker"='on') AS
 SELECT "u"."id",
    "u"."username",
    "u"."profile_picture",
    "u"."role",
    "u"."metadata",
    "u"."created_at",
    "u"."deleted_at",
    "u"."country",
    "a"."email",
    "a"."banned_until"
   FROM ("public"."users" "u"
     LEFT JOIN "auth"."users" "a" ON (("u"."id" = "a"."id")));


ALTER TABLE "public"."users_and_accounts_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visualizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "chart_type" "text",
    "group_by" "text",
    "value_field" "text",
    "aggregation" "text",
    "task" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "project" "uuid" NOT NULL,
    "type" "text" DEFAULT '''table''::text'::"text" NOT NULL,
    "table_columns" "text"[],
    "custom_function" "text",
    "display_field" "text"
);


ALTER TABLE "public"."visualizations" OWNER TO "postgres";


ALTER TABLE ONLY "public"."participation_requests" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."participation_requests_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_discussion_id_project_id_key" UNIQUE ("user_id", "discussion_id", "project_id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contributions"
    ADD CONSTRAINT "contributions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."discussions"
    ADD CONSTRAINT "discussions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_topics"
    ADD CONSTRAINT "forum_topics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participation_requests"
    ADD CONSTRAINT "participation_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_likes"
    ADD CONSTRAINT "project_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_likes"
    ADD CONSTRAINT "project_likes_user_id_project_id_key" UNIQUE ("user_id", "project_id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."visualizations"
    ADD CONSTRAINT "visualizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_voter_voted_voted_type_key" UNIQUE ("voter", "voted", "voted_type");



CREATE INDEX "bookmarks_discussion_id_idx" ON "public"."bookmarks" USING "btree" ("discussion_id");



CREATE INDEX "bookmarks_project_id_idx" ON "public"."bookmarks" USING "btree" ("project_id");



CREATE INDEX "comments_creator_idx" ON "public"."comments" USING "btree" ("creator");



CREATE INDEX "comments_discussion_idx" ON "public"."comments" USING "btree" ("discussion");



CREATE INDEX "comments_forum_topic_idx" ON "public"."comments" USING "btree" ("forum_topic");



CREATE INDEX "comments_parent_comment_idx" ON "public"."comments" USING "btree" ("parent_comment");



CREATE INDEX "idx_title_tsv" ON "public"."discussions" USING "gin" ("title_tsv");



CREATE OR REPLACE VIEW "public"."comments_with_votes" AS
 SELECT "c"."id",
    "c"."content",
    "c"."created_at",
    "c"."updated_at",
    "c"."creator",
    "c"."discussion",
    "c"."forum_topic",
    "c"."parent_comment",
    "jsonb_build_object"('id', "u"."id", 'username', "u"."username", 'profile_picture', "u"."profile_picture", 'role', "u"."role", 'metadata', "u"."metadata", 'deleted_at', "u"."deleted_at") AS "creator_info",
    "count"("v"."id") FILTER (WHERE ("v"."vote" = 1)) AS "upvotes",
    "count"("v"."id") FILTER (WHERE ("v"."vote" = '-1'::integer)) AS "downvotes"
   FROM (("public"."comments" "c"
     LEFT JOIN "public"."users" "u" ON (("u"."id" = "c"."creator")))
     LEFT JOIN "public"."votes" "v" ON ((("v"."voted" = "c"."id") AND ("v"."voted_type" = 'comment'::"text"))))
  GROUP BY "c"."id", "u"."id";



CREATE OR REPLACE VIEW "public"."projects_with_likes" WITH ("security_invoker"='on') AS
 SELECT "p"."id",
    "p"."name",
    "p"."long_description",
    "p"."domain",
    "p"."scope",
    "p"."countries",
    "p"."cover_image",
    "p"."tags",
    "p"."links",
    "p"."visibility",
    "p"."participation_level",
    "p"."moderation_level",
    "p"."deadline",
    "p"."status",
    "p"."created_at",
    "p"."published_at",
    "p"."updated_at",
    "p"."creator",
    "p"."short_description",
    "p"."deleted_at",
    "p"."activity_status",
    "p"."results_summary",
    "jsonb_build_object"('id', "u"."id", 'username', "u"."username", 'profile_picture', "u"."profile_picture", 'metadata', "u"."metadata", 'deleted_at', "u"."deleted_at") AS "creator_info",
    "count"("l"."id") AS "likes"
   FROM (("public"."projects" "p"
     LEFT JOIN "public"."users" "u" ON (("u"."id" = "p"."creator")))
     LEFT JOIN "public"."project_likes" "l" ON (("l"."project_id" = "p"."id")))
  GROUP BY "p"."id", "u"."id";



CREATE OR REPLACE TRIGGER "trigger_delete_votes_on_comment" AFTER DELETE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."delete_votes"('comment');



CREATE OR REPLACE TRIGGER "trigger_delete_votes_on_discussion" AFTER DELETE ON "public"."discussions" FOR EACH ROW EXECUTE FUNCTION "public"."delete_votes"('discussion');



CREATE OR REPLACE TRIGGER "trigger_delete_votes_on_topic" AFTER DELETE ON "public"."forum_topics" FOR EACH ROW EXECUTE FUNCTION "public"."delete_votes"('forum topic');



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_creator_fkey" FOREIGN KEY ("creator") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_discussion_fkey" FOREIGN KEY ("discussion") REFERENCES "public"."discussions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_forum_topic_fkey" FOREIGN KEY ("forum_topic") REFERENCES "public"."forum_topics"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_comment_fkey" FOREIGN KEY ("parent_comment") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contributions"
    ADD CONSTRAINT "contributions_task_fkey" FOREIGN KEY ("task") REFERENCES "public"."tasks"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."contributions"
    ADD CONSTRAINT "contributions_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."discussions"
    ADD CONSTRAINT "discussions_creator_fkey" FOREIGN KEY ("creator") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."forum_topics"
    ADD CONSTRAINT "forum_topics_creator_fkey" FOREIGN KEY ("creator") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."forum_topics"
    ADD CONSTRAINT "forum_topics_project_fkey" FOREIGN KEY ("project") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."forum_topics"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."participation_requests"
    ADD CONSTRAINT "participation_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."participation_requests"
    ADD CONSTRAINT "participation_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_likes"
    ADD CONSTRAINT "project_likes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_likes"
    ADD CONSTRAINT "project_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_creator_fkey" FOREIGN KEY ("creator") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_reporter_fkey" FOREIGN KEY ("reporter") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_project_fkey" FOREIGN KEY ("project") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visualizations"
    ADD CONSTRAINT "visualizations_project_fkey" FOREIGN KEY ("project") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visualizations"
    ADD CONSTRAINT "visualizations_task_fkey" FOREIGN KEY ("task") REFERENCES "public"."tasks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_voter_fkey" FOREIGN KEY ("voter") REFERENCES "public"."users"("id") ON DELETE SET NULL;



CREATE POLICY "Enable contributions deletion for project creators" ON "public"."contributions" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = ( SELECT "tasks"."project"
           FROM "public"."tasks"
          WHERE ("tasks"."id" = "contributions"."task"))))));



CREATE POLICY "Enable delete for creating user (creator or request user)" ON "public"."participation_requests" FOR DELETE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "participation_requests"."project_id"))) OR (( SELECT "auth"."uid"() AS "uid") = "user_id")));



CREATE POLICY "Enable delete for creators" ON "public"."discussions" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "creator"));



CREATE POLICY "Enable delete for creators" ON "public"."forum_topics" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "creator"));



CREATE POLICY "Enable delete for creators" ON "public"."projects" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "creator"));



CREATE POLICY "Enable delete for creators" ON "public"."tasks" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "tasks"."project"))));



CREATE POLICY "Enable delete for project creator" ON "public"."visualizations" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "visualizations"."project"))));



CREATE POLICY "Enable delete for users based on creator" ON "public"."comments" FOR DELETE USING (((( SELECT "auth"."uid"() AS "uid") = "creator") OR (( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = ( SELECT "auth"."uid"() AS "uid"))) = 'admin'::"public"."role")));



CREATE POLICY "Enable delete for voter" ON "public"."votes" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "voter"));



CREATE POLICY "Enable delete only for creator" ON "public"."bookmarks" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable delete only for creator" ON "public"."project_likes" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for authenticated users" ON "public"."bookmarks" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users" ON "public"."project_likes" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users" ON "public"."reports" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users" ON "public"."votes" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."contributions" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."discussions" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."forum_topics" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."participation_requests" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."tasks" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for project creator" ON "public"."visualizations" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "visualizations"."project"))));



CREATE POLICY "Enable insert for users only" ON "public"."users" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."comments" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."contributions" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."discussions" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."forum_topics" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."participation_requests" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."projects" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."tasks" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Enable select for everyone" ON "public"."project_likes" FOR SELECT USING (true);



CREATE POLICY "Enable select for everyone" ON "public"."votes" FOR SELECT USING (true);



CREATE POLICY "Enable select for public" ON "public"."visualizations" FOR SELECT USING (true);



CREATE POLICY "Enable select only for creator" ON "public"."bookmarks" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable select only for reporter" ON "public"."reports" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "reporter"));



CREATE POLICY "Enable update for comment creator" ON "public"."comments" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "creator"));



CREATE POLICY "Enable update for discussion creator" ON "public"."discussions" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "creator"));



CREATE POLICY "Enable update for forum topic creator" ON "public"."forum_topics" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "creator"));



CREATE POLICY "Enable update for project creator" ON "public"."visualizations" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "visualizations"."project"))));



CREATE POLICY "Enable update for project creators" ON "public"."contributions" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = ( SELECT "tasks"."project"
           FROM "public"."tasks"
          WHERE ("tasks"."id" = "contributions"."task")))))) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = ( SELECT "tasks"."project"
           FROM "public"."tasks"
          WHERE ("tasks"."id" = "contributions"."task"))))));



CREATE POLICY "Enable update for project creators" ON "public"."projects" FOR UPDATE USING (("creator" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("creator" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Enable update for task creators" ON "public"."tasks" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "tasks"."project")))) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "tasks"."project"))));



CREATE POLICY "Enable update for voter" ON "public"."votes" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "voter"));



CREATE POLICY "Enable users to update their notifications read status" ON "public"."notifications" FOR UPDATE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "recipient_id") OR (( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"public"."role"))) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "recipient_id") OR (( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"public"."role")));



CREATE POLICY "Enable users to update their own data only" ON "public"."users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable users to view their notifications" ON "public"."notifications" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "recipient_id") OR (( SELECT (('to_all_'::"text" || "users"."role") || 's'::"text")
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = ("target")::"text") OR (("target")::"text" = 'to_all_users'::"text")));



CREATE POLICY "allow project creator and request user to update their requests" ON "public"."participation_requests" FOR UPDATE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = ( SELECT "projects"."creator"
   FROM "public"."projects"
  WHERE ("projects"."id" = "participation_requests"."project_id"))) OR (( SELECT "auth"."uid"() AS "uid") = "user_id")));



ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contributions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."discussions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forum_topics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."participation_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."visualizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."votes" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."comments";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





















































































































































































































GRANT ALL ON FUNCTION "public"."admin_contributions_growth"("days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_contributions_growth"("days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_contributions_growth"("days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_discussions_growth"("days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_discussions_growth"("days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_discussions_growth"("days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_discussions_most_downvoted"("limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_discussions_most_downvoted"("limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_discussions_most_downvoted"("limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_discussions_most_engaged"("limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_discussions_most_engaged"("limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_discussions_most_engaged"("limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_discussions_most_upvoted"("limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_discussions_most_upvoted"("limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_discussions_most_upvoted"("limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_get_ban_deletion_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_get_ban_deletion_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_get_ban_deletion_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_get_user_roles_and_types"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_get_user_roles_and_types"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_get_user_roles_and_types"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_most_active_forums"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_most_active_forums"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_most_active_forums"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_project_activity_distribution"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_project_activity_distribution"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_project_activity_distribution"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_project_domains_distribution"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_project_domains_distribution"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_project_domains_distribution"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_report_status_distribution"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_report_status_distribution"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_report_status_distribution"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_reports_growth"("days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_reports_growth"("days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_reports_growth"("days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_topics_interactivity"("days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_topics_interactivity"("days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_topics_interactivity"("days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_user_growth"("days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_user_growth"("days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_user_growth"("days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_users_growth"("months" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_users_growth"("months" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_users_growth"("months" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_votes"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_votes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_votes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."find_similar_discussions"("search_text" "text", "input_tags" "text"[], "input_category" "text", "exclude_id" "uuid", "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."find_similar_discussions"("search_text" "text", "input_tags" "text"[], "input_category" "text", "exclude_id" "uuid", "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_similar_discussions"("search_text" "text", "input_tags" "text"[], "input_category" "text", "exclude_id" "uuid", "result_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_discussions_tags"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_discussions_tags"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_discussions_tags"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_forum_topics_tags"("project_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_forum_topics_tags"("project_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_forum_topics_tags"("project_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_projects_tags"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_projects_tags"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_projects_tags"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_table_metrics"("table_name" "text", "category_column" "text", "category_one" "text", "category_two" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_table_metrics"("table_name" "text", "category_column" "text", "category_one" "text", "category_two" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_table_metrics"("table_name" "text", "category_column" "text", "category_one" "text", "category_two" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_task_contributions_over_time"("project_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_task_contributions_over_time"("project_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_task_contributions_over_time"("project_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_top_contributors"("limit_count" integer, "time_range" interval) TO "anon";
GRANT ALL ON FUNCTION "public"."get_top_contributors"("limit_count" integer, "time_range" interval) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_top_contributors"("limit_count" integer, "time_range" interval) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_views"("topic_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_views"("topic_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_views"("topic_id" "uuid") TO "service_role";

































GRANT ALL ON TABLE "public"."bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."comments_with_votes" TO "anon";
GRANT ALL ON TABLE "public"."comments_with_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."comments_with_votes" TO "service_role";



GRANT ALL ON TABLE "public"."contributions" TO "anon";
GRANT ALL ON TABLE "public"."contributions" TO "authenticated";
GRANT ALL ON TABLE "public"."contributions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contributions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contributions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contributions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."discussions" TO "anon";
GRANT ALL ON TABLE "public"."discussions" TO "authenticated";
GRANT ALL ON TABLE "public"."discussions" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."votes" TO "anon";
GRANT ALL ON TABLE "public"."votes" TO "authenticated";
GRANT ALL ON TABLE "public"."votes" TO "service_role";



GRANT ALL ON TABLE "public"."discussions_with_replies_and_votes" TO "anon";
GRANT ALL ON TABLE "public"."discussions_with_replies_and_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."discussions_with_replies_and_votes" TO "service_role";



GRANT ALL ON TABLE "public"."forum_topics" TO "anon";
GRANT ALL ON TABLE "public"."forum_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_topics" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."participation_requests" TO "anon";
GRANT ALL ON TABLE "public"."participation_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."participation_requests" TO "service_role";



GRANT ALL ON SEQUENCE "public"."participation_requests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."participation_requests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."participation_requests_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."project_likes" TO "anon";
GRANT ALL ON TABLE "public"."project_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."project_likes" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."projects_with_likes" TO "anon";
GRANT ALL ON TABLE "public"."projects_with_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."projects_with_likes" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";



GRANT ALL ON TABLE "public"."topics_with_replies_and_votes" TO "anon";
GRANT ALL ON TABLE "public"."topics_with_replies_and_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."topics_with_replies_and_votes" TO "service_role";



GRANT ALL ON TABLE "public"."users_and_accounts_data" TO "anon";
GRANT ALL ON TABLE "public"."users_and_accounts_data" TO "authenticated";
GRANT ALL ON TABLE "public"."users_and_accounts_data" TO "service_role";



GRANT ALL ON TABLE "public"."visualizations" TO "anon";
GRANT ALL ON TABLE "public"."visualizations" TO "authenticated";
GRANT ALL ON TABLE "public"."visualizations" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";































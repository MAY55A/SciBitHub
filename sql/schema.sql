-- Enums must be created first (run enums.sql first)

CREATE TABLE public.users (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  profile_picture text,
  role USER-DEFINED NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone,
  country text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text UNIQUE,
  long_description text,
  domain text,
  scope USER-DEFINED DEFAULT 'global'::scope,
  countries ARRAY,
  cover_image text,
  tags ARRAY,
  links ARRAY,
  visibility USER-DEFINED DEFAULT 'public'::project_visibility,
  participation_level USER-DEFINED DEFAULT 'open'::participation_level,
  moderation_level USER-DEFINED DEFAULT 'none'::moderation_level,
  deadline timestamp without time zone,
  status USER-DEFINED DEFAULT 'draft'::project_status,
  created_at timestamp without time zone DEFAULT now(),
  published_at timestamp without time zone,
  updated_at timestamp without time zone,
  creator uuid,
  short_description text NOT NULL DEFAULT 'desc'::text,
  deleted_at timestamp without time zone,
  activity_status USER-DEFINED NOT NULL DEFAULT 'ongoing'::activity_status,
  results_summary text,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_creator_fkey FOREIGN KEY (creator) REFERENCES public.users(id)
);
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tutorial text NOT NULL,
  type USER-DEFINED NOT NULL,
  data_source text,
  target_count integer,
  fields jsonb DEFAULT '{}'::jsonb,
  status USER-DEFINED DEFAULT 'active'::task_status,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone,
  project uuid NOT NULL,
  data_type character varying,
  deleted_at timestamp with time zone,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_project_fkey FOREIGN KEY (project) REFERENCES public.projects(id)
);
CREATE TABLE public.contributions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  data jsonb NOT NULL,
  status USER-DEFINED DEFAULT 'pending'::validation_status,
  user uuid,
  task uuid,
  deleted_at timestamp with time zone,
  CONSTRAINT contributions_pkey PRIMARY KEY (id),
  CONSTRAINT contributions_user_fkey FOREIGN KEY (user) REFERENCES public.users(id),
  CONSTRAINT contributions_task_fkey FOREIGN KEY (task) REFERENCES public.tasks(id)
);
CREATE TABLE public.discussions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL,
  tags ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  creator uuid,
  files ARRAY,
  status USER-DEFINED NOT NULL DEFAULT 'open'::discussion_status,
  title_tsv tsvector DEFAULT to_tsvector('english'::regconfig, title),
  deleted_at timestamp without time zone,
  CONSTRAINT discussions_pkey PRIMARY KEY (id),
  CONSTRAINT discussions_creator_fkey FOREIGN KEY (creator) REFERENCES public.users(id)
);
CREATE TABLE public.forum_topics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  tags ARRAY,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone,
  views integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  project uuid NOT NULL,
  creator uuid,
  deleted_at timestamp with time zone,
  CONSTRAINT forum_topics_pkey PRIMARY KEY (id),
  CONSTRAINT forum_topics_project_fkey FOREIGN KEY (project) REFERENCES public.projects(id),
  CONSTRAINT forum_topics_creator_fkey FOREIGN KEY (creator) REFERENCES public.users(id)
);
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone,
  creator uuid,
  discussion uuid,
  forum_topic uuid,
  parent_comment uuid,
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_forum_topic_fkey FOREIGN KEY (forum_topic) REFERENCES public.forum_topics(id),
  CONSTRAINT comments_discussion_fkey FOREIGN KEY (discussion) REFERENCES public.discussions(id),
  CONSTRAINT comments_parent_comment_fkey FOREIGN KEY (parent_comment) REFERENCES public.comments(id),
  CONSTRAINT comments_creator_fkey FOREIGN KEY (creator) REFERENCES public.users(id)
);
CREATE TABLE public.participation_requests (
  id integer NOT NULL DEFAULT nextval('participation_requests_id_seq'::regclass),
  project_id uuid,
  user_id uuid,
  type USER-DEFINED NOT NULL,
  status USER-DEFINED DEFAULT 'pending'::validation_status,
  requested_at timestamp without time zone,
  deleted_at timestamp with time zone,
  CONSTRAINT participation_requests_pkey PRIMARY KEY (id),
  CONSTRAINT participation_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT participation_requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.visualizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  chart_type text,
  group_by text,
  value_field text,
  aggregation text,
  task uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  project uuid NOT NULL,
  type text NOT NULL DEFAULT '''table''::text'::text,
  table_columns ARRAY,
  custom_function text,
  display_field text,
  CONSTRAINT visualizations_pkey PRIMARY KEY (id),
  CONSTRAINT visualizations_task_fkey FOREIGN KEY (task) REFERENCES public.tasks(id),
  CONSTRAINT visualizations_project_fkey FOREIGN KEY (project) REFERENCES public.projects(id)
);
CREATE TABLE public.bookmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  discussion_id uuid,
  project_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookmarks_pkey PRIMARY KEY (id),
  CONSTRAINT bookmarks_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussions(id),
  CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT bookmarks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  project_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT project_likes_pkey PRIMARY KEY (id),
  CONSTRAINT project_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT project_likes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reporter uuid,
  reported_link text NOT NULL,
  reported_type text NOT NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending'::text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_reporter_fkey FOREIGN KEY (reporter) REFERENCES public.users(id)
);
CREATE TABLE public.votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  voter uuid,
  voted uuid NOT NULL,
  voted_type text NOT NULL,
  vote smallint NOT NULL CHECK (vote = ANY (ARRAY['-1'::integer, 1])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT votes_pkey PRIMARY KEY (id),
  CONSTRAINT votes_voter_fkey FOREIGN KEY (voter) REFERENCES public.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  recipient_id uuid,
  message_template text NOT NULL,
  target USER-DEFINED DEFAULT 'to_specific_user'::notification_type,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  user_id uuid,
  project_id uuid,
  discussion_id uuid,
  topic_id uuid,
  comment_id uuid,
  task_id uuid,
  action_url text,
  type text DEFAULT 'info'::text,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users(id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT notifications_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT notifications_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussions(id),
  CONSTRAINT notifications_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.forum_topics(id),
  CONSTRAINT notifications_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id)
);
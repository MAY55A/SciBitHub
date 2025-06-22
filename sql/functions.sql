-- Views must be created before functions (run views.sql first)

-- SQL functions for the platform
CREATE OR REPLACE FUNCTION public.increment_views(topic_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE forum_topics SET views = views + 1 WHERE id = topic_id;
END;
$function$

CREATE OR REPLACE FUNCTION public.get_all_projects_tags()
 RETURNS SETOF text
 LANGUAGE sql
AS $function$
  select distinct unnest(tags)
  from projects
  where status = 'published'
  order by 1;
$function$

CREATE OR REPLACE FUNCTION public.get_all_discussions_tags()
 RETURNS SETOF text
 LANGUAGE sql
AS $function$
  select distinct unnest(tags)
  from discussions
  order by 1;
$function$

CREATE OR REPLACE FUNCTION public.get_all_forum_topics_tags(project_id uuid)
 RETURNS SETOF text
 LANGUAGE sql
AS $function$
  select distinct unnest(tags)
  from forum_topics
  where project = project_id
  order by 1;
$function$

CREATE OR REPLACE FUNCTION public.find_similar_discussions(search_text text, input_tags text[], input_category text, exclude_id uuid DEFAULT NULL::uuid, result_limit integer DEFAULT 5)
 RETURNS TABLE(id uuid, title text, body text, tags text[], category text, created_at timestamp with time zone, updated_at timestamp with time zone, creator jsonb, replies bigint, upvotes bigint, downvotes bigint, status discussion_status, similarity real)
 LANGUAGE plpgsql
AS $function$
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
$function$

CREATE OR REPLACE FUNCTION public.get_task_contributions_over_time(project_id uuid)
 RETURNS TABLE(date text, task_title text, contributions_count bigint)
 LANGUAGE plpgsql
AS $function$
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
$function$


-- Admin functions for metrics and statistics
CREATE OR REPLACE FUNCTION public.admin_contributions_growth(days integer)
 RETURNS TABLE(day text, contributions integer)
 LANGUAGE sql
AS $function$
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
$function$

CREATE OR REPLACE FUNCTION public.admin_project_domains_distribution()
 RETURNS TABLE(domain text, count integer)
 LANGUAGE sql
AS $function$
  select
    domain,
    count(*)
  from projects
  group by domain
$function$

CREATE OR REPLACE FUNCTION public.admin_project_activity_distribution()
 RETURNS TABLE(activity_status text, count integer)
 LANGUAGE sql
AS $function$
  select
    activity_status,
    count(*)
  from projects
  where status = 'published'
  group by activity_status
$function$

CREATE OR REPLACE FUNCTION public.admin_users_growth(months integer)
 RETURNS TABLE(month text, researchers integer, contributors integer)
 LANGUAGE sql
AS $function$
  select
    to_char(date_trunc('month', created_at), 'Mon') as month,
    count(*) filter (where role = 'researcher') as researchers,
    count(*) filter (where role = 'contributor') as contributors
  from users
  where created_at >= date_trunc('month', current_date) - make_interval(months := $1)
  group by date_trunc('month', created_at)
  order by date_trunc('month', created_at);
$function$

CREATE OR REPLACE FUNCTION public.admin_get_ban_deletion_counts()
 RETURNS TABLE(active integer, banned integer, deleted integer)
 LANGUAGE sql
AS $function$
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
$function$

CREATE OR REPLACE FUNCTION public.admin_get_user_roles_and_types()
 RETURNS TABLE(role text, type text, count integer)
 LANGUAGE sql
AS $function$
  select
    role,
    metadata->>'researcherType' as type,
    count(*)
  from users
  where role in ('researcher', 'contributor')
  group by role, metadata->>'researcherType'
  order by role;
$function$

CREATE OR REPLACE FUNCTION public.admin_reports_growth(days integer)
 RETURNS TABLE(day text, reports integer)
 LANGUAGE sql
AS $function$
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
$function$

CREATE OR REPLACE FUNCTION public.get_top_contributors(limit_count integer DEFAULT 5, time_range interval DEFAULT NULL::interval)
 RETURNS TABLE(user_id uuid, username text, profile_picture text, contribution_count bigint, last_contribution timestamp without time zone)
 LANGUAGE sql
AS $function$
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
$function$

CREATE OR REPLACE FUNCTION public.admin_report_status_distribution()
 RETURNS TABLE(status text, count integer)
 LANGUAGE sql
AS $function$
  select
    status,
    count(*)
  from reports
  group by status
$function$

CREATE OR REPLACE FUNCTION public.admin_most_active_forums()
 RETURNS TABLE(project_id uuid, project_name text, topics integer)
 LANGUAGE sql
AS $function$
  select
    projects.id,
    name,
    count(t.id) as topics
  from projects
  left join forum_topics as t on(t.project = projects.id)
  group by projects.id
  order by topics desc
  limit 5
$function$

CREATE OR REPLACE FUNCTION public.admin_topics_interactivity(days integer)
 RETURNS TABLE(day text, replies integer, upvotes integer, downvotes integer)
 LANGUAGE sql
AS $function$
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
$function$

CREATE OR REPLACE FUNCTION public.admin_discussions_growth(days integer)
 RETURNS TABLE(day text, discussions integer)
 LANGUAGE sql
AS $function$
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
$function$

CREATE OR REPLACE FUNCTION public.admin_discussions_most_engaged(limit_count integer DEFAULT 5)
 RETURNS TABLE(discussion_id uuid, discussion_title text, replies integer)
 LANGUAGE sql
AS $function$
  SELECT
    d.id,
    d.title,
    COUNT(c.id) AS replies
  FROM discussions d
  LEFT JOIN comments c ON c.discussion = d.id
  GROUP BY d.id
  ORDER BY replies desc
  limit limit_count;
$function$

CREATE OR REPLACE FUNCTION public.admin_discussions_most_upvoted(limit_count integer DEFAULT 5)
 RETURNS TABLE(discussion_id uuid, discussion_title text, upvotes integer)
 LANGUAGE sql
AS $function$
  SELECT
    d.id,
    d.title,
    COUNT(v.id) filter (where v.vote = 1) AS upvotes
  FROM discussions d
  LEFT JOIN votes v ON v.voted = d.id
  GROUP BY d.id
  ORDER BY upvotes desc
  limit limit_count;
$function$

CREATE OR REPLACE FUNCTION public.admin_discussions_most_downvoted(limit_count integer DEFAULT 5)
 RETURNS TABLE(discussion_id uuid, discussion_title text, downvotes integer)
 LANGUAGE sql
AS $function$
  SELECT
    d.id,
    d.title,
    COUNT(v.id) filter (where v.vote = -1) AS downvotes
  FROM discussions d
  LEFT JOIN votes v ON v.voted = d.id
  GROUP BY d.id
  ORDER BY downvotes desc
  limit limit_count;
$function$

CREATE OR REPLACE FUNCTION public.get_table_metrics(table_name text, category_column text, category_one text, category_two text)
 RETURNS TABLE(total bigint, month_total bigint, category_one_total bigint, category_two_total bigint)
 LANGUAGE plpgsql
AS $function$
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
$function$





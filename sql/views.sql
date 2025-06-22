-- Tables must be created before views (run schema.sql first)

CREATE OR REPLACE VIEW projects_with_likes AS  SELECT p.id,
    p.name,
    p.long_description,
    p.domain,
    p.scope,
    p.countries,
    p.cover_image,
    p.tags,
    p.links,
    p.visibility,
    p.participation_level,
    p.moderation_level,
    p.deadline,
    p.status,
    p.created_at,
    p.published_at,
    p.updated_at,
    p.creator,
    p.short_description,
    p.deleted_at,
    p.activity_status,
    p.results_summary,
    jsonb_build_object('id', u.id, 'username', u.username, 'profile_picture', u.profile_picture, 'metadata', u.metadata, 'deleted_at', u.deleted_at) AS creator_info,
    count(l.id) AS likes
   FROM ((projects p
     LEFT JOIN users u ON ((u.id = p.creator)))
     LEFT JOIN project_likes l ON ((l.project_id = p.id)))
  GROUP BY p.id, u.id;

  CREATE OR REPLACE VIEW topics_with_replies_and_votes AS  SELECT t.id,
    t.title,
    t.content,
    t.tags,
    t.views,
    t.is_featured,
    t.created_at,
    t.updated_at,
    t.creator AS creator_id,
    t.project AS project_id,
    t.deleted_at,
    jsonb_build_object('id', u.id, 'username', u.username, 'profile_picture', u.profile_picture, 'role', u.role, 'metadata', u.metadata, 'deleted_at', u.deleted_at) AS creator,
    jsonb_build_object('id', p.id, 'name', p.name, 'creator', p.creator, 'deleted_at', p.deleted_at) AS project,
    c.replies,
    v.upvotes,
    v.downvotes
   FROM ((((forum_topics t
     LEFT JOIN users u ON ((u.id = t.creator)))
     LEFT JOIN projects p ON ((p.id = t.project)))
     LEFT JOIN LATERAL ( SELECT count(*) AS replies
           FROM comments c_1
          WHERE (c_1.discussion = t.id)) c ON (true))
     LEFT JOIN LATERAL ( SELECT count(*) FILTER (WHERE (v_1.vote = 1)) AS upvotes,
            count(*) FILTER (WHERE (v_1.vote = '-1'::integer)) AS downvotes
           FROM votes v_1
          WHERE ((v_1.voted = t.id) AND (v_1.voted_type = 'forum topic'::text))) v ON (true));

CREATE OR REPLACE VIEW discussions_with_replies_and_votes AS  SELECT d.id,
    d.title,
    d.body,
    d.category,
    d.tags,
    d.created_at,
    d.updated_at,
    d.creator,
    d.files,
    d.status,
    d.title_tsv,
    d.deleted_at,
    jsonb_build_object('id', u.id, 'username', u.username, 'profile_picture', u.profile_picture, 'role', u.role, 'metadata', u.metadata, 'deleted_at', u.deleted_at) AS creator_info,
    c.replies,
    v.upvotes,
    v.downvotes
   FROM (((discussions d
     LEFT JOIN users u ON ((u.id = d.creator)))
     LEFT JOIN LATERAL ( SELECT count(*) AS replies
           FROM comments c_1
          WHERE (c_1.discussion = d.id)) c ON (true))
     LEFT JOIN LATERAL ( SELECT count(*) FILTER (WHERE (v_1.vote = 1)) AS upvotes,
            count(*) FILTER (WHERE (v_1.vote = '-1'::integer)) AS downvotes
           FROM votes v_1
          WHERE ((v_1.voted = d.id) AND (v_1.voted_type = 'discussion'::text))) v ON (true));

CREATE OR REPLACE VIEW comments_with_votes AS  SELECT c.id,
    c.content,
    c.created_at,
    c.updated_at,
    c.creator,
    c.discussion,
    c.forum_topic,
    c.parent_comment,
    jsonb_build_object('id', u.id, 'username', u.username, 'profile_picture', u.profile_picture, 'role', u.role, 'metadata', u.metadata, 'deleted_at', u.deleted_at) AS creator_info,
    count(v.id) FILTER (WHERE (v.vote = 1)) AS upvotes,
    count(v.id) FILTER (WHERE (v.vote = '-1'::integer)) AS downvotes
   FROM ((comments c
     LEFT JOIN users u ON ((u.id = c.creator)))
     LEFT JOIN votes v ON (((v.voted = c.id) AND (v.voted_type = 'comment'::text))))
  GROUP BY c.id, u.id;

CREATE OR REPLACE VIEW users_and_accounts_data AS  SELECT u.id,
    u.username,
    u.profile_picture,
    u.role,
    u.metadata,
    u.created_at,
    u.deleted_at,
    u.country,
    a.email,
    a.banned_until
   FROM (users u
     LEFT JOIN auth.users a ON ((u.id = a.id)));
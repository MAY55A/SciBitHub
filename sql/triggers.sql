-- Tables must be created before triggers (run schema.sql first)

CREATE OR REPLACE FUNCTION delete_votes()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM votes WHERE voted = OLD.id and voted_type = TG_ARGV[0];
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_votes_on_discussion
AFTER DELETE ON discussions
FOR EACH ROW
EXECUTE FUNCTION delete_votes('discussion');

CREATE TRIGGER trigger_delete_votes_on_topic
AFTER DELETE ON forum_topics
FOR EACH ROW
EXECUTE FUNCTION delete_votes('forum topic');

CREATE TRIGGER trigger_delete_votes_on_comment
AFTER DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION delete_votes('comment');
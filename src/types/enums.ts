// User related enums
export enum UserRole {
    CONTRIBUTOR = 'contributor',
    RESEARCHER = 'researcher',
    ADMIN = 'admin'
}

export enum ResearcherType {
    ORGANIZATION = 'organization',
    ACADEMIC = 'academic',
    CASUAL = 'casual'
}

// Project related enums
export enum ProjectStatus {
    PENDING = 'pending',
    PUBLISHED = 'published',
    DECLINED = 'declined',
    DRAFT = 'draft',
    DELETED = 'deleted',
}

export enum ActivityStatus {
    ONGOING = 'ongoing',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    CLOSED = 'closed'
}

export enum ProjectDomain {
    CLIMATE_SCIENCE = "Climate Science",
    ECOLOGY = "Ecology",
    BIOLOGY = "Biology",
    ASTRONOMY = "Astronomy",
    MEDICINE = "Medicine",
    PHYSICS = "Physics",
    CHEMISTRY = "Chemistry",
    COMPUTER_SCIENCE = "Computer Science",
    ARTIFICIAL_INTELLIGENCE = "Artificial Intelligence",
    SOCIAL_SCIENCES = "Social Sciences",
    PSYCHOLOGY = "Psychology",
    NEUROSCIENCE = "Neuroscience",
    ECONOMICS = "Economics",
    HISTORY = "History",
    ANTHROPOLOGY = "Anthropology",
    LINGUISTICS = "Linguistics",
    ENGINEERING = "Engineering",
    MATHEMATICS = "Mathematics",
    ENVIRONMENTAL_SCIENCE = "Environmental Science",
    GENETICS = "Genetics",
    GEOLOGY = "Geology",
    MARINE_SCIENCE = "Marine Science",
    POLITICAL_SCIENCE = "Political Science",
    EDUCATION = "Education",
    PUBLIC_HEALTH = "Public Health",
    PHILOSOPHY = "Philosophy",
}

export enum ProjectVisibility {
    PUBLIC = 'public',
    RESTRICTED = 'restricted',
    PRIVATE = 'private'
}

export const ProjectVisibilityDescriptions: Record<ProjectVisibility, string> = {
    [ProjectVisibility.PUBLIC]: "Anyone can view the project and its results.",
    [ProjectVisibility.RESTRICTED]: "Only approved users can view the results.",
    [ProjectVisibility.PRIVATE]: "Only the creator can view the results."
};

export enum ParticipationLevel {
    OPEN = 'open',
    RESTRICTED = 'restricted',
}

export const ParticipationLevelDescriptions: Record<ParticipationLevel, string> = {
    [ParticipationLevel.OPEN]: "Anyone can join the project.",
    [ParticipationLevel.RESTRICTED]: "Only invited or approved members can participate."
};

export enum ModerationLevel {
    STRICT = 'strict',
    MODERATE = 'moderate',
    NONE = 'none',
}

export const ModerationLevelDescriptions: Record<ModerationLevel, string> = {
    [ModerationLevel.STRICT]: "Strict moderation with approval required.",
    [ModerationLevel.MODERATE]: "Some moderation, with fewer restrictions.",
    [ModerationLevel.NONE]: "No moderation, all contributions are automatically approved."
};

export enum Scope {
    GLOBAL = "global",
    REGIONAL = "regional",
}

// task related enums
export enum TaskType {
    SURVEY = 'survey',
    DATACOLLECTION = 'data collection',
    DATALABELLING = 'data labelling',
}

export enum TaskStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

export enum RequestType {
    INVITATION = 'invitation',
    APPLICATION = 'application',
}

export enum ValidationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum DiscussionStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    DELETED = 'deleted',
}

export enum DiscussionCategory {
    SCIENTIFIC_DEBATE = 'scientific debate',     // Debates on scientific theories, ideas, or controversies
    SOCIAL_IMPACT = 'social impact',             // Discussions about how science affects society, politics, environment, etc.
    PHILOSOPHY_OF_SCIENCE = 'philosophy of science',        // Epistemology, ethics, methodology, purpose of science
    EMERGING_TOPICS = 'emerging topics',         // AI, quantum computing, climate science — evolving areas
    INTERDISCIPLINARY = 'interdisciplinary',     // Where domains intersect (e.g. biology + data science)
    OPEN_QUESTIONS = 'open questions',           // Unsolved or thought-provoking scientific problems
    PLATFORM_DISCUSSION = 'platform',            // About SciBitHub itself (features, issues, ideas)
    CASUAL_SCIENCE = 'casual science',           // Fun facts, interesting finds, thought experiments
    COLLABORATION_CALLS = 'collaboration calls', // Find people to help with general initiatives
    OTHER = 'other',                             // For anything that doesn’t clearly fit
}

export const DiscussionCategoriesDescriptions: Record<DiscussionCategory, string> = {
    [DiscussionCategory.SCIENTIFIC_DEBATE]: 'Engage in thoughtful debates around scientific theories, hypotheses, and controversial findings.',
    [DiscussionCategory.SOCIAL_IMPACT]: 'Discuss how science and research affect society, politics, the environment, and culture.',
    [DiscussionCategory.PHILOSOPHY_OF_SCIENCE]: 'Reflect on ethics, epistemology, and the purpose and limits of science.',
    [DiscussionCategory.EMERGING_TOPICS]: 'Talk about new or fast-changing scientific fields such as AI, space tech, or biotechnology.',
    [DiscussionCategory.INTERDISCIPLINARY]: 'Explore discussions at the intersection of multiple disciplines.',
    [DiscussionCategory.OPEN_QUESTIONS]: 'Pose and discuss big scientific questions that are unsolved or open-ended.',
    [DiscussionCategory.COLLABORATION_CALLS]: 'Find or propose collaborations around general ideas or themes not tied to specific projects.',
    [DiscussionCategory.CASUAL_SCIENCE]: 'Share fun facts, surprising science, thought experiments, or ask “what if” questions.',
    [DiscussionCategory.PLATFORM_DISCUSSION]: 'Talk about the platform itself: features, bugs, improvements, community norms.',
    [DiscussionCategory.OTHER]: "Anything that doesn’t fit clearly into another category."
};

export enum FieldType {
    TEXT = 'text',
    FILE = 'file',
    SELECT = 'select',
    NUMBER = 'number',
    DATE = 'date',
    TEXTAREA = 'textarea',
}

export enum DataType {
    IMAGE = 'image',
    AUDIO = 'audio',
}

export enum VisualizationType {
    TABLE = 'table',
    CHART = 'chart',
    GALLERY = 'gallery',
    // MAP = 'map',
}

export enum ChartType {
    LINE = 'line',
    BAR = 'bar',
    PIE = 'pie',
    // SCATTER = 'scatter',
    HISTOGRAM = 'histogram',
    // AREA = 'area',
    // RADAR = 'radar',
    // HEATMAP = 'heatmap',
    // BUBBLE = 'bubble',
}

export enum AggregationFunction {
    COUNT = 'count',
    AVERAGE = 'average',
    SUM = 'sum',
    MIN = 'min',
    MAX = 'max',
    CUSTOM = 'custom'
}

export enum ReportReason {
    INAPPROPRIATE = 'inappropriate content',
    IRRELEVANT = 'irrelevant content',
    OFFENSIVE = 'offensive content',
    SPAM = 'spam',
    OTHER = 'other',
}

export enum ReportStatus {
    PENDING = 'pending',
    REVIEWED = 'reviewed',
    RESOLVED = 'resolved',
    DISMISSED = 'dismissed'
}

export enum NotificationType {
    TO_SPECIFIC_USER = 'to_specific_user',
    TO_ALL_ADMINS = 'to_all_admins',
    TO_ALL_CONTRIBUTORS = 'to_all_contributors',
    TO_ALL_RESEARCHERS = 'to_all_researchers',
    TO_ALL_USERS = 'to_all_users',
}
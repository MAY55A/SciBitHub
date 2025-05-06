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
}

export enum DiscussionCategory {
    RESEARCH = 'research',
}

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
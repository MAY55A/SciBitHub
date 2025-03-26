// User related models
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

interface Metadata {
    interests: string[];
    bio?: string;
    phone?: string;
    contactEmail?: string;
    contacts?: string[];
    researcherType?: ResearcherType;
    organizationName?: string;
    institutionName?: string;
    academicDegree?: string;
    location?: string;
    isVerified?: boolean;
}

export interface User {
    id: string;
    username: string;
    email: string;
    profile_picture?: string;
    role: UserRole;
    country: string;
    is_suspended: boolean;
    metadata?: Metadata;
    created_at: string;
    deleted_at?: string;
}

export interface PublicUser {
    id: string;
    username: string;
    profile_picture?: string;
    role?: UserRole;
    metadata?: Metadata;
}

// Project related models
export enum ProjectStatus {
    PENDING = 'pending',
    PUBLISHED = 'published',
    DRAFT = 'draft'
}

export enum ProjectProgress {
    ACTIVE = 'active',
    COMPLETED = 'completed',
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

export interface Project {
    id?: string;
    name: string;
    description: string;
    domain: ProjectDomain;
    scope: string;
    countries?: string[];
    cover_image?: string;
    tags?: string[];
    links?: string[];
    visibility: ProjectVisibility;
    participation_level: ParticipationLevel;
    moderation_level: ModerationLevel;
    deadline?: Date;
    created_at: string;
    published_at?: string;
    updated_at?: string;
    creator: PublicUser;
    participants?: PublicUser[];
    tasks: Task[];
    status: ProjectStatus;
    progress?: ProjectProgress;
}

export enum FieldType {
    TEXT = 'text',
    FILE = 'file',
    SELECT = 'select',
    NUMBER = 'number',
    DATE = 'date',
    TEXTAREA = 'textarea',
}

export enum TaskType {
    SURVEY = 'survey',
    DATACOLLECTION = 'data collection',
    DATALABELLING = 'data labelling',
}

export enum TaskStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

export enum DataType {
    IMAGE = 'image',
    AUDIO = 'audio',
}

export interface FieldConfig {
    type: string;
    label: string;
    description?: string;
    placeholder?: string;
    required: boolean;
    params?: Map<string, any>;
}

export interface Task {
    id?: string;
    title: string;
    description: string;
    tutorial: string;
    type: TaskType;
    fields: FieldConfig[];
    data_source?: string;
    data_type?: string;
    target_count?: number;
    status?: TaskStatus;
    created_at?: string;
    updated_at?: string;
    project: Project;
    contributions?: number;
}

export interface ParticipationRequest {
    id: string;
    project: Project;
    user: PublicUser;
    type: RequestType;
    status: ValidationStatus;
    requested_at?: string;
}

export enum RequestType {
    INVITATION = 'invitation',
    APPLICATION = 'application',
}

export enum ValidationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED ='rejected',
}

export interface Contribution {
    id?: string;
    task: Task;
    user: PublicUser;
    data: Map<string, any>;
    status: ValidationStatus;
    created_at?: string;
}
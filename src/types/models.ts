import { ResearcherType, UserRole, ProjectDomain, ProjectVisibility, ParticipationLevel, ModerationLevel, ProjectStatus, ProjectProgress, TaskType, TaskStatus, RequestType, ValidationStatus, DiscussionCategory, DiscussionStatus } from "./enums";

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
    deleted_at?: string;
}

export interface Project {
    id?: string;
    name: string;
    short_description: string;
    long_description: string;
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
    deleted_at?:string;
    creator: PublicUser;
    participants?: PublicUser[];
    tasks: Task[];
    status: ProjectStatus;
    activity_status?: ActivityStatus;
}


export interface FieldConfig {
    type: string;
    label: string;
    description?: string;
    placeholder?: string;
    required: boolean;
    params?: FieldParams;
}

export interface FieldParams {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    extensions?: string;
    fileType?: string;
    maxFiles?: number;
    options?: string[];
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


export interface Contribution {
    id?: string;
    task: Task;
    user: PublicUser;
    data: Map<string, any>;
    status: ValidationStatus;
    created_at?: string;
    deleted_at?:string;
}


export interface Discussion {
    id?: string;
    title: string;
    body: string;
    category: DiscussionCategory;
    status: DiscussionStatus;
    files?: string[];
    tags?: string[];
    created_at?: string;
    updated_at?: string;
    deleted_at?:string;
    creator: PublicUser;
    replies?: number;
}

export interface ForumTopic {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    is_featured: boolean;
    views: number;
    created_at: string;
    updated_at: string;
    deleted_at?:string;
    project: Project;
    creator: PublicUser;
    replies?: number;
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    updated_at?: string;
    creator: PublicUser;
    discussion?: Discussion;
    forum_topic?: ForumTopic;
    parent_comment?: Comment;
    replies?: number;
}

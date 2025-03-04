
export enum UserRole {
    CONTRIBUTOR = 'contributor',
    RESEARCHER = 'researcher',
    ADMIN = 'admin'
}

export enum ResearcherType {
    ORGANIZATION = 'organization',   // Researcher affiliated with an organization
    ACADEMIC = 'academic',           // Academic researchers (e.g., professors, researchers)
    CASUAL = 'casual'                // Casual researcher, not affiliated with any institution
}

interface Metadata {
    interests: string[];
    bio?: string;
    phone?: string;
    contactEmail?: string;
    contacts?: string[];
    researcherType?: ResearcherType;    // The type of researcher (organization, academic, or casual)
    organizationName?: string;          // Optional field for organization-based researchers
    institutionName?: string;          // Optional field for organization-based researchers
    academicDegree?: string;            // Optional field for academic-based researchers
    location?: string;                  // Optional field for location
    isVerified?: boolean;             // Account is verified or not
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
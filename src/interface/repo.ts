export interface OwnerRef {
    html_url: string;
    userProfileUrl: string;
    avatar_url: string;
    login: string;
    username?: string
}

export interface RepoRef {
    name: string;
    stargazers_count: number;
    watchers_count: number;
    open_issues_count: number;
    created_at: string;
    forks_count: number;
    description: string;
    html_url: string;
    languages: string[];
    owner: OwnerRef;
    github_id: number;
    id: number;
    _id: number;
    isChecked?: any;
    formated_date?: string;
    userId?: number
}
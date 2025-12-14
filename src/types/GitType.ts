
export interface GitFileChange {
    path: string;
    status: 'staged' | 'modified' | 'untracked';
    index : string;
}

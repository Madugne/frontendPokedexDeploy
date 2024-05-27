export interface Auth {
    accessToken: string;
    id: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

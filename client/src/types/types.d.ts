export interface Message {
    room: string;
    author: string;
    message: string;
    time: string;
}
export interface User {
    _id?: string; // Optional, as it may not be present when creating a new user
    name: string;
    age: number;
    email?: string;
    password?: string;
    phone?: number;
}
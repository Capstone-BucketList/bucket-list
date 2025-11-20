interface VisibilityOption {
    id: string;
    name:string;
}

export const VisibilityOptions: VisibilityOption[] = [
    { id: "public" , name: "Public"},
    { id: "friends" ,name: "Friends"},
    { id: "private",name: "Private"},
];
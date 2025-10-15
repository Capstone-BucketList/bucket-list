import type { Route } from "../../../.react-router/types/app/routes/+types";


export function meta({}: Route.MetaArgs) {
    return [
        { title: "Bucket List" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    return(
        <>
            <h1 className={'text-3xl font-bold'}> Home </h1>
        </>
    )

}

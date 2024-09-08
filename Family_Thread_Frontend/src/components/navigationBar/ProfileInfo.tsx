import {backend_url} from "../../config/constant.ts";
import {useEffect, useState} from "react";


export function ProfileInfo() {
    const [loading, setLoading] = useState<boolean>()
    const [name, setName] = useState<string>()

    const getName = async () => {
        try {
            const response = await fetch(
                backend_url + "/user",
                { method: "GET", redirect: "follow", credentials: "include" }
            );
            if (response.redirected) {
                document.location = response.url;
                return; // Return early if redirected
            }
            console.log(response)

            const data = await response.json();
            console.log(data)
            setName(data.user_details.name);
            setLoading(false);
        } catch (error) {
        }
    };

    useEffect(() => {
        getName();
    }, []);

    return (
        <>
            {loading?
                <>
                    loading
                </>:
                <>
                    <a href="/">{name}</a>
                </>
            }
        </>
    )
}
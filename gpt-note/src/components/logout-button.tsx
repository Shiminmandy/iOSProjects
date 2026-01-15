"use client"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export const LogOutButton = () => {

    const [loading, setLoading] = useState(false);

    return (
        <Button variant="outline" >
            {loading ? <Loader2 className='animate-spin' /> : "Log Out"}
        </Button>
    )
}
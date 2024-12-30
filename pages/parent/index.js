import ParentLayout from "../../layouts/parent";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Parent = () => {
    const router = useRouter()
    useEffect(() => {
        router.push('/parent/awards')
    }, [])

    return (
        <>

        </>
    )
}
Parent.layout = ParentLayout
export default Parent
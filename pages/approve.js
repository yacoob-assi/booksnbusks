import {useRouter} from "next/router";
import {Loading} from "../components/common/preloader";
import {useEffect, useState} from "react";
import {postApprove} from "../helpers/backend_helper";

const Approve = () => {
    const router = useRouter()
    const [done, setDone] = useState(false)

    useEffect(() => {
        let {ref} = router.query
        if(ref) {
            postApprove({ref}).then(({error}) => {
                setDone(!error)
            })
        }
    }, [router.query])

    console.log(router.query)

    return (
        <div className="flex min-h-screen justify-center items-center">
            {done ? (
                <div>
                    <h2>Successfully Approved <br/> Student can login now.</h2>
                </div>
            ) : <Loading/> }
        </div>
    )
}
export default Approve
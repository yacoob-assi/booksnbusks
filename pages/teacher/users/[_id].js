import {fetchRole, fetchUser, postRoleAdd, postRoleUpdate, updateUser} from "../../../helpers/backend_helper";
import TeacherLayout from "../../../layouts/teacher";
import {RoleForm, UserForm} from "./create";
import {useRouter} from "next/router";
import {Form} from "antd";
import {useFetch} from "../../../helpers/hooks";
import {useEffect} from "react";

const User = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [role] = useFetch(fetchUser, {_id: router.query?._id})
    useEffect(() => {
        form.setFieldsValue({
            ...role,
        })
    }, [role])
    return (
        <>
            <div>
                <h4 className="font-22 font-semibold">User Details</h4>
                <hr className="bg-C4"/>
                <UserForm form={form} func={updateUser} update/>
            </div>
        </>
    )
}
User.layout = TeacherLayout
export default User
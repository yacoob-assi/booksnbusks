import {fetchRole, postRoleAdd, postRoleUpdate} from "../../../helpers/backend_helper";
import TeacherLayout from "../../../layouts/teacher";
import {RoleForm} from "./create";
import {useRouter} from "next/router";
import {Form} from "antd";
import {useFetch} from "../../../helpers/hooks";
import {useEffect} from "react";

const Role = () => {
    const router = useRouter()
    const [form] = Form.useForm()
    const [role] = useFetch(fetchRole, {_id: router.query?._id})
    useEffect(() => {
        form.setFieldsValue({
            ...role,
        })
    }, [role])
    return (
        <>
            <div>
                <h4 className="font-22 font-semibold">Role Details</h4>
                <hr className="bg-C4"/>
                <RoleForm form={form} func={postRoleUpdate}/>
            </div>
        </>
    )
}
Role.layout = TeacherLayout
export default Role
import AdminLayout from "../../../layouts/admin";
import {useRouter} from "next/router";
import {useAction, useFetch} from "../../../helpers/hooks";
import {addUser, fetchPermissions, fetchRoles} from "../../../helpers/backend_helper";
import {Checkbox, Form} from "antd";
import FormInput, {HiddenFormItem} from "../../../components/form/FormInput";
import {Col, Row} from "react-bootstrap";
import Link from "next/link";
import PasswordInput from "../../../components/form/PasswordInput";
import FormSelect from "../../../components/form/FormSelect";

const CreateUser = () => {
    return (
        <>
            <h4 className="font-22 font-semibold">Create User</h4>
            <hr className="bg-C4"/>
            <UserForm func={addUser}/>
        </>
    )
}
CreateUser.layout = AdminLayout
export default CreateUser


export const UserForm = ({form, func, update = false}) => {
    const router = useRouter()
    const [roles] = useFetch(fetchRoles)

    return (
        <>
            <Form layout="vertical" form={form} onFinish={values => useAction(func, {
                ...values,
            }, () => router.push('/teacher/users'))}>
                <HiddenFormItem name="_id" initialValue=""/>
                <Row className="mb-2">
                    <Col md={6}>
                        <FormInput name="first_name" label="First Name" required/>
                        <FormInput name="email" label="Email" isEmail required/>
                        <PasswordInput name="password" label="Password" required={!update}/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="last_name" label="Last Name" required/>
                        <FormSelect name="permission" label="Role" options={roles} required/>
                        <PasswordInput name="confirm_password" label="Confirm Password" confirm required={!update}/>
                    </Col>
                </Row>

                <button className="btn btn-primary mr-4">Save</button>
                <Link href="/teacher/roles">
                    <a className="btn btn-secondary">Cancel</a>
                </Link>
            </Form>
        </>
    )
}
import TeacherLayout from "../../../layouts/teacher";
import {useRouter} from "next/router";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchPermissions, postRoleAdd, postRoles} from "../../../helpers/backend_helper";
import {Checkbox, Form} from "antd";
import FormInput, {HiddenFormItem} from "../../../components/form/FormInput";
import {Col, Row} from "react-bootstrap";
import Link from "next/link";
import {FiArrowLeft} from "react-icons/fi";
import Button from "../../../components/form/Button";



const CreateRole = () => {
    const router = useRouter()
    return (
        <>
            <div>
            <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/> Create Role
                </h4>
                <hr className="bg-C4"/>
                <RoleForm func={postRoleAdd}/>
            </div>
        </>
    )
}
CreateRole.layout = TeacherLayout
export default CreateRole


export const RoleForm = ({form, func}) => {
    const router = useRouter()
    const [permissions] = useFetch(fetchPermissions)
    return (
        <>
            <Form layout="vertical" form={form} onFinish={values => useAction(func, {
                ...values,
            }, () => router.push('/teacher/roles/'))}>
                <HiddenFormItem name="_id" initialValue=""/>
                <Row className="mb-2">
                    <Col md={6}>
                        <FormInput name="name" label="Name" required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="description" label="Description"/>
                    </Col>
                </Row>
                <Form.Item name="permissions">
                    <Checkbox.Group className="w-full">
                        <Row>
                            {permissions?.filter(d => d.child?.length > 0).map((permission, index) => (
                                <Col md={4} className="my-2" key={index}>
                                    <div className="bg-gray-100 p-2 text-gray-500 font-semibold mb-2">
                                        {permission?.name}
                                    </div>
                                    <Row>
                                        {permission?.child?.map((child, index) => (
                                            <Col xs={6} key={index}>
                                                <div className="p-1.5">
                                                    <Checkbox value={child.permission}>{child?.name}</Checkbox>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Button>Save</Button>
                <Link href="/teacher/roles">
                    <a className="btn btn-secondary">Cancel</a>
                </Link>
            </Form>
        </>
    )
}
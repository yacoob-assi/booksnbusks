import {Form, notification} from "antd";
import FormInput from "../components/form/FormInput";
import {postForget} from "../helpers/backend_helper";
import {swalLoading} from "../components/common/alert";
import swal from "sweetalert2";
import AuthLayout from "../layouts/auth";

const Login = () => {
    const [form] = Form.useForm()
    const handleLogin = async values => {
        swalLoading()
        const {error, msg} = await postForget(values)
        swal.close()
        if(error === false) {
            await notification.success({message: "Success", description: msg})
            form.resetFields()
        } else {
            await notification.error({message: "Error", description: msg})
        }
    }

    return (
        <AuthLayout>
            <div className="flex items-center pt-12" style={{minHeight: '50vh'}}>
                <div className="bg-white p-8 rounded shadow-sm w-screen md:w-96">
                    <h2 className="text-primary font-medium mb-3">Reset Password</h2>
                    <Form form={form} layout="vertical" onFinish={handleLogin}>
                        <FormInput name="email" placeholder="Email" isEmail required/>
                        <button className="btn btn-primary btn-full mt-1">Send Reset Link</button>
                    </Form>
                </div>
            </div>
        </AuthLayout>
    )
}
export default Login
import {Form, notification} from "antd";
import {useState} from "react";
import {signOut} from "../helpers/hooks";
import {useRouter} from "next/router";
import {swalLoading} from "../components/common/alert";
import {postConsent, postRole} from "../helpers/backend_helper";
import swal from "sweetalert2";

const StudentConsent = () => {
    const router = useRouter()
    const [error, setError] = useState()
    const [form] = Form.useForm()

    const onFinish = async values => {
        if(values?.accept === true) {
            swalLoading()
            let {error, msg} = await postConsent(values)
            swal.close()
            if (error === false) {
                await notification.success({message: "Success", description: msg})
                await router.push('/')
            } else {
                await notification.error({message: "Error", description: msg})
            }
        }
    }

    return (
        <>
            <Form form={form} onFinish={onFinish}>
                <div
                    className="d-flex flex-column align-items-center mt-4 px-2"
                    style={{minHeight: "100vh"}}
                >
                    <h3 className="py-3 text-3xl font-bold">Before we can let you access your account....</h3>
                    <div className="mt-4 mb-3 bg-grey px-4 pt-3 pb-2 border rounded">
                        <Form.Item name="accept" valuePropName="checked" noStyle>
                            <input
                                type="checkbox"
                                onChange={e => setError(e.target.checked ? undefined : 'Please accept consent!')}
                                style={{height: 24, width: 24}}
                            />
                        </Form.Item>
                        <h3 className="d-inline-block font-weight-normal text-dark ml-3">
                            {" "}
                            Student Consent
                        </h3>
                    </div>
                    {error && <p className="text-danger">{error}</p>}

                    <h3 className="text-dark">Terms and Conditions</h3>
                    <h3 className="text-dark mb-3">
                        <a
                            href="https://schoolbucks.github.io/privacyWebsite/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Privacy Notice
                        </a>
                    </h3>

                    <h4
                        className="text-dark text-center mb-3"
                        style={{maxWidth: 500, fontWeight: 600}}
                    >
                        <i
                        >
                            Please read the Terms and Conditions and Privacy Notice and agree to
                            them by clicking below.
                        </i>
                    </h4>
                    <h4
                        className="bg-danger text-white p-3 text-center mb-5 student-consent"
                        style={{maxWidth: 500, fontWeight: 600}}
                        role="button"
                        onClick={() => {
                            form.setFieldsValue({
                                accept: true,
                            })
                        }}
                    >
                        I have read and agreed to the terms and conditions and the privacy
                        notice
                    </h4>

                    <div className="mt-4 mb-2 bg-grey px-4 pt-3 pb-2 border rounded">
                        <h3 className="d-inline-block font-weight-normal text-dark ml-3">
                            {" "}
                            Guardian Consent
                        </h3>
                    </div>
                    <Form.Item
                        name="email"
                        initialValue=""
                        className="mt-3 w-full sm:w-80 text-center"
                        rules={[
                            {required: true, message: "Please provide parent's email"},
                            {type: 'email', message: "Please provide valid email"}
                        ]}
                    >
                        <input className="form-control bg-transparent text-center" placeholder="Guardian Email"/>
                    </Form.Item>
                    <button
                        className="btn btn-danger btn-lg rounded-0 mt-1 mb-3"
                        onClick={() => {
                            if(form.getFieldValue('accept') !== true) {
                                setError('Please accept consent!')
                            } else {
                                setError(undefined)
                            }
                        }}
                    >
                        Send Mail
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg rounded-0 mb-2"
                        onClick={() => signOut(router)}
                    >
                        Sign Out
                    </button>
                    <p className="text-center" style={{maxWidth: 500, fontSize: 22}}>
                        Have your parent/guardian check their email to grant you access to your account.
                    </p>
                </div>
            </Form>
        </>
    );
};
export default StudentConsent;
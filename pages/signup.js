import {Form, notification} from "antd";
import FormInput from "../components/form/FormInput";
import PasswordInput from "../components/form/PasswordInput";
import {postRegister} from "../helpers/backend_helper";
import {swalLoading} from "../components/common/alert";
import swal from "sweetalert2";
import AuthLayout from "../layouts/auth";
import {useRouter} from "next/router";
import Link from "next/link";
import ThiredPartySignIn from "../fragment/ThiredParty";

const Signup = () => {
    const router = useRouter()
    const handleSignup = async values => {
        swalLoading()
        const {error, msg, token} = await postRegister(values)
        swal.close()
        if(error === false) {
            localStorage.setItem("token", token)
            await notification.success({message: "Success", description: msg})
            await router.push('/')
        } else {
            await notification.error({message: "Error", description: msg})
        }
    }


    return (
        <AuthLayout>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mt-20">
                <div class="w-full bg-white rounded-lg shadow sm:max-w-lg xl:p-0">
                    <div class="space-y-3 md:space-y-4 sm:p-8 pb-4 pt-6 px-6">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl flex items-center">
                                <img className="w-10 h-10 mr-2" src="/images/logo.png" alt="BooksNBucks Logo"/>
                                Create your Account   
                            </h1>

                            {/* thired party sign in */}
                            <ThiredPartySignIn description={"Sign Up with Google"}/>

                            {/* or */}
                            <div classNames="flex items-center mt-2 mb-1 justify-center">
                                    <div class="flex-1 h-0.5 bg-gray-300"></div>
                                    <p class="mx-3 text-sm font-medium text-gray-500 text-center">OR</p>
                                    <div class="flex-1 h-0.5 bg-gray-300"></div>
                            </div>

                            <Form layout="vertical" onFinish={handleSignup}>
                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <div className="flex-1">
                                        <FormInput label={"First Name"} name="first_name" placeholder="First Name" required/>
                                    </div>
                                    <div className="flex-1">
                                        <FormInput label={"Last Name"} name="last_name" placeholder="Last Name" required/>
                                    </div>
                                </div>
                                <FormInput label={"Email"} name="email" placeholder="name@booksnbucks.com" isEmail required/>
                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <div className="flex-1">
                                        <PasswordInput label="Password" name="password" placeholder="•••••••"/>
                                    </div>
                                    <div className="flex-1">
                                        <PasswordInput label="Confirm Password" name="confirm_password" placeholder="•••••••" confirm/>
                                    </div>
                                </div>
                                

                                <div class="pt-3">
                                    <button type="submit" class="w-full text-white btn-primary rounded-lg text-sm px-5 py-[0.85rem] text-center transition duration-150">Register</button>
                                </div>
                                <p class="text-sm font-light text-gray-500 pt-4">
                                    Already have an account?&nbsp;
                                    <Link href="/login">
                                        <a class="font-medium text-primary hover:underline">Login Here</a>
                                    </Link>
                                </p>
                            </Form>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}
export default Signup
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getVerify} from "../helpers/backend_helper";
import PreLoader from "../components/common/preloader";
import { LowerBackground, UpperBackground } from "../fragment/background/BackgroundTheme";

const AuthLayout = ({children}) => {

    return (
        <div className="auth-layout">
            <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white border-b-2 border-primary-primary">
                <div className="container">
                    <Link href="/">
                        <div className="flex items-center justify-center" role="button">
                            <img className="w-10 h-10" src="/images/logo.png" alt="BooksNBucks Logo"/>
                            <h3 className="ml-3">BooksNBucks</h3>
                        </div>
                    </Link>
                    {/*
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link href={"/login"}>
                                        <a className="nav-link">
                                            Sign in
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={"/signup"}>
                                        <a className="nav-link">
                                            Sign up
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                     */}
                </div>
            </nav>
            <div className="relative isolate">
                <UpperBackground />

                {children}
                <LowerBackground />
            </div>
        </div>
    )
}
export default AuthLayout
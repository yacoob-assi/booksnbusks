import React from 'react'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; //
import "@fontsource/montserrat";
import "@fontsource/oswald";
import 'antd/dist/antd.min.css'
import 'tailwindcss/tailwind.css'
import 'bootstrap/scss/bootstrap.scss'
import 'simplebar/dist/simplebar.min.css';
import '../styles/app.scss'
import {RouteLoader} from "../components/common/preloader";
import Head from "next/head";

const App = ({Component, pageProps}) => {
    let Layout = Component.layout || React.Fragment
    return (
        <>
            <Head>
                <title>BooksNBucks</title>
            </Head>
            <RouteLoader/>
            <Layout>

                <Component {...pageProps}/>
            </Layout>
        </>

    )
}
export default App
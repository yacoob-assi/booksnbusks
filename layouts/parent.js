import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import {fetchParentStudents, fetchProfile} from "../helpers/backend_helper";
import {signOut, useFetch, userOutSideClick} from "../helpers/hooks";
import PreLoader from "../components/common/preloader";
import {UserContext, useUserContext} from "../contexts/user";
import {
    FiArrowLeft,
    FiBarChart2,
    FiCalendar,
    FiHeart,
    FiLogOut, FiMinusCircle, FiPlusCircle,
    FiShoppingBag,
    FiShoppingCart, FiStar, FiTrash,
    FiX
} from "react-icons/fi";
import {NavItemProfile} from "./teacher";
import {NavItem} from "./student";
import {Select} from "antd";
import Link from "next/link";
import {BsCalendarCheck} from "react-icons/bs";

const ParentLayout = ({children}) => {
    const router = useRouter()
    const [user, setUser] = useState()
    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = () => {
        fetchProfile().then(({error, data}) => {
            if (error === false) {
                setUser(data)
            } else {
                router.push('/')
            }
        })
    }

    const [cart, setCart] = useState([])

    const addToCart = (product, inc) => {
        let find = cart?.find(d => d._id === product._id)
        let newCart
        if (!!find) {
            find.quantity += inc
            newCart = cart?.filter(d => d?.quantity > 0)
            setCart(newCart)
        } else {
            newCart = [
                ...cart,
                {
                    ...product,
                    quantity: inc
                }
            ]
            setCart(newCart)
        }
        localStorage.setItem('cart', JSON.stringify(newCart))
    }

    const clearCart = () => {
        setCart([])
        localStorage.setItem('cart', JSON.stringify([]))
    }

    useEffect(() => {
        const data = localStorage.getItem('cart')
        if (!!data) {
            setCart(JSON.parse(data))
        }
    }, [])

    const [showCart, setShowCart] = useState(false)
    const ref = useRef()
    userOutSideClick(ref, () => setShowCart(false))


    const isWishlist = id => {
        return user?.wishlist?.find(wish => wish === id) !== undefined
    }

    const toggleMobileMenu = () => {
        try {
            document.querySelector('.mobile-menu').classList.toggle('active')
        } catch (e) {

        }
    }

    const [student, setStudent] = useState()
    const [students, _, {loading}] = useFetch(fetchParentStudents)

    useEffect(() => {
        if (!student) {
            let studentId = localStorage.getItem('student')
            if (!!studentId) {
                if (students?.length > 0) {
                    setStudent(students.find(student => student._id === studentId))
                }
            } else {
                if (students?.length > 0) {
                    setStudent(students[0])
                    localStorage.setItem('student', students[0]._id)
                }
            }
        }

    }, [students])

    if (!user || loading) {
        return <PreLoader/>
    }

    return (
        <UserContext.Provider value={{...user, student, getProfile, isWishlist, cart, addToCart, setShowCart, clearCart}}>
            <div ref={ref} className={`fixed right-0 bottom-0 top-0 ${showCart ? 'w-80' : 'w-0'} transition-all shadow-lg bg-white z-50`}>
                <div className="flex px-4 py-3 border-b items-center">
                    <FiArrowLeft size={18} role="button" onClick={() => setShowCart(false)}/>
                    <span className="text-lg px-2">Order Details</span>
                </div>
                <div className="p-4">
                    <p className="text-lg">My Cart</p>
                    <div className="overflow-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
                        {cart?.map((product, index) => (
                            <div key={index} className="flex relative border-b mb-2">
                                <div className="px-2">
                                    <img src={product?.image} className="w-14" alt=""/>
                                </div>
                                <div className="mb-2.5">
                                    <p className="font-semibold mb-1">{product?.name}</p>
                                    <p className="mb-1">{product?.cost} Points</p>
                                    <div className="flex items-center">
                                        <FiMinusCircle role="button" size={20} onClick={() => addToCart(product, -1)}/>
                                        <span className="mb-0 text-primary pointer-events-none font-bold px-2">{product.quantity}</span>
                                        <FiPlusCircle role="button" size={20} onClick={() => addToCart(product, 1)}/>
                                    </div>
                                    <FiTrash className="absolute right-0 bottom-4" role="button" onClick={() => addToCart(product, -product.quantity)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <p>Total</p>
                        <p>{cart?.reduce((acc, d) => acc + ((d.cost * d.quantity) || 0), 0)} Points</p>
                    </div>
                    <div className="flex items-center py-2">
                        <Link href="/parent/checkout">
                            <button onClick={() => setShowCart(false)} className="btn btn-primary mx-auto">Checkout</button>
                        </Link>
                    </div>
                </div>
            </div>
            <main className="dashboard-layout">
                <aside className="nav-area">
                    <nav className="navbar">
                        <div className="site-title">
                            <img src="/images/logo.png" alt=""/>
                            <h3>BooksNBucks</h3>
                            <FiBarChart2 className="mobile-menu-icon" onClick={toggleMobileMenu} size={24}/>
                        </div>
                        <div className="mobile-menu">
                            <div className="menu-wrapper">
                                <div className="mobile-menu-title">
                                    <h5>Menu</h5>
                                    <FiX size={24} className="absolute right-4 top-4" onClick={toggleMobileMenu}/>
                                </div>
                                <ul className="menu">
                                    <NavItem href="/parent/awards" label="Awards" icon={FiStar}/>
                                    <NavItem href="/parent/purchases" label="Purchases" icon={FiShoppingCart}/>
                                    <NavItem href="/parent/classes" label="Classes" icon={FiCalendar}/>
                                    <NavItem href="/parent/attendance" label="Attendance" icon={BsCalendarCheck}/>
                                </ul>
                            </div>
                            <div className="flex mx-4 border-t">
                                <button className="pt-3 pl-2" onClick={() => signOut(router)}>
                                    <FiLogOut className="inline-block ml-4 mr-3"/> Logout
                                </button>
                            </div>
                            <NavItemProfile user={user}/>
                        </div>
                    </nav>
                </aside>
                <div className="main-container">
                    <div>
                        <Header user={user} students={students} student={student}/>
                        {!!student ? (
                            <>
                                {children}
                            </>
                        ) : (
                            <div>
                                <p className="text-3xl py-4">You don't have any student.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </UserContext.Provider>

    )
}
export default ParentLayout


export const Header = ({user, students, student}) => {
    const {cart, setShowCart} = useUserContext()
    return (
        <header className="bg-white mb-4 px-6 py-3 flex justify-between rounded">
            <div>
                <p className="mb-0 mt-1 font-semibold text-gray-600">Hi, {user?.first_name} {user?.last_name}</p>
            </div>
            <div className="flex items-center">
                {/*<div className="relative mr-6" role="button" onClick={() => setShowCart(true)}>*/}
                {/*    <FiShoppingCart className="font-semibold" size={22}/>*/}
                {/*    <div*/}
                {/*        className="absolute !border border-gray-700 px-1.5 -top-3 -right-3 text-[12px] font-bold text-primary rounded-full ">*/}
                {/*        {cart.length}*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div>
                    <Select className="w-60" value={student?._id} onSelect={student => {
                        localStorage.setItem('student', student)
                        window.location.reload()
                    }}>
                        {students?.map(student => (
                            <Select.Option key={student._id} value={student._id}>{student.first_name} {student.last_name}</Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

        </header>
    )
}

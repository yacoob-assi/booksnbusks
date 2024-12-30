import TeacherLayout from "../../../layouts/teacher";
import {Button} from "antd";
import {fetchNotifications, postNotificationRead} from "../../../helpers/backend_helper";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [page, setPage] = useState(0)
    const [last, setLast] = useState(1)
    const [loading, setLoading] = useState(false)
    const [clearNotificationsMessageVisible, setClearNotificationsMessageVisible] = useState(false);
    const router = useRouter()

    useEffect(() => {
        if (page === 0) {
            getNotifications()
        }

    }, [])

    const getNotifications = () => {
        setLoading(true)
        fetchNotifications({page: page + 1, size: 10}).then(({error, data}) => {
            if (error === false) {
                setNotifications([...notifications, ...data.docs])
                setPage(data.page)
                setLast(data.totalPages)
            }
            setLoading(false)
        })
    }

    const clearNotifications = () => {
        // Clear all notifications, mark all as read
        postNotificationRead({_id: "all"}).then(({error}) => {
            if (error === false) {
                setLoading(true)
                    fetchNotifications({page: 1, size: 10}).then(({error, data}) => {
                    if (error === false) {
                        setNotifications([...data.docs])
                        setPage(data.page)
                        setLast(data.totalPages)
                    }
                    setLoading(false)
                })
                setClearNotificationsMessageVisible(true); // Set message visibility to true
                setTimeout(() => {
                    setClearNotificationsMessageVisible(false); // Hide the message after a certain time
                }, 5000); // Certain time is 5000 milliseconds (5 seconds) here.
            }
        })
    }

    // This text box will only show up temporarily when clear notifications is clicked
    return (
        <>
            {clearNotificationsMessageVisible && (
                <div
                 style={{ background: "#C5CDB3",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    marginBottom: "20px"
                    }}
                >
                 All notifications have been cleared.
                </div>
            )}
            <ul className="p-0">
                {notifications?.map((d, index) => (
                    <li className="px-4 py-3 mb-2 bg-white rounded relative" role="button" onClick={() => {
                        postNotificationRead({_id: d._id}).then(() => {
                            router.push('/teacher/students/')
                        })
                    }} key={index}>
                        <p className="mb-0">
                            {d?.message}{' '}
                            <span style={{ float: 'right', textAlign: 'right', paddingRight: '25px' }}>
                                {new Date(d?.createdAt).toLocaleDateString()}{' '}
                                {new Date(d?.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </p>
                        {!d?.read && <div className="w-3 h-3 rounded-full absolute right-4 top-6 bg-blue-500"/> }
                    </li>
                ))}
            </ul>
            {loading && <div></div>}
            <div>
                {page < last && <Button onClick={getNotifications}>Load More</Button>}
                <Button onClick={clearNotifications}>Clear Notifications</Button>
            </div>
        </>
    )
}
Notifications.layout = TeacherLayout
export default Notifications
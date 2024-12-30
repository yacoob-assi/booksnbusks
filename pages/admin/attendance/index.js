import AdminLayout from "../../../layouts/admin";
import {useAction, useFetch} from "../../../helpers/hooks";
import {
    fetchAttendance, fetchAttendanceElements,
    fetchAttendanceStatus,
    fetchClasses,
    fetchStudents,
    postAttendance
} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import {DatePicker, Select} from "antd";
import {useEffect, useState} from "react";
import {FiArrowLeft, FiDelete, FiSearch} from "react-icons/fi";
import {useRouter} from "next/router";

const Attendance = () => {
    const [students] = useFetch(fetchStudents)
    const [attendanceStatus, getAttendanceStatus] = useFetch(fetchAttendanceStatus)
    let attendanceMap = {}
    attendanceStatus?.forEach(student => {
        attendanceMap[student._id] = student
    })

    const [classes] = useFetch(fetchAttendanceElements)
    let columns = [
        {
            label: 'Student',
            dataIndex: 'name',
            formatter: (_, student) => <>{student.first_name} {student.last_name}</>
        },
        {label: 'Present', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.present || 0},
        {label: 'Absences', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.missed || 0},
        {label: 'Tardy', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.tardy || 0},
        {label: 'Left Early', dataIndex: '_id', formatter: _id => attendanceMap[_id]?.left || 0},
    ]

    const [current, setCurrent] = useState()
    const [filter, setFilter] = useState()
    const [date, setDate] = useState()

    useEffect(() => {
        let data = classes?.find(d => d._id === current)
        if (data) {
            getAttendanceStatus({class: current})
            setFilter(data.students)
        } else {
            setFilter(undefined)
            getAttendanceStatus({class: undefined})
        }
    }, [current])

    const [status, setStatus] = useState({})
    const [update, setUpdate] = useState(false)
    const reload = () => setUpdate(!update)

    useEffect(() => {
        if (date && current) {
            getClassAttendance()
        }
    }, [date, current])

    const getClassAttendance = () => {
        fetchAttendance({class: current, date: date?.format('YYYY-MM-DD')}).then(({error, data}) => {
            let status = {}
            if (error === false) {
                data?.map(data => {
                    status[data?.student] = data.status
                    getAttendanceStatus({class: current})
                })
            }
            setStatus(status)
        })
    }

    const toggleAttendance = (_id, data) => () => {
        status[_id] = data
        reload()
    }

    const updateStatus = async () => {
        await useAction(postAttendance, {class: current, status, date: date?.format('YYYY-MM-DD')}, () => {
            getClassAttendance()
        })
    }

    if (date) {
        columns = [
            {
                label: 'Student',
                dataIndex: 'name',
                formatter: (_, student) => <>{student.first_name} {student.last_name}</>
            },
            {
                label: "Attendance",
                dataIndex: "_",
                formatter: (_, student) => {
                    return (
                        <div className="d-flex">
                            <div
                                onClick={toggleAttendance(student._id, 1)}
                                className={`btn ${status[student._id] === 1 ? 'btn-success' : 'btn-outline-success'} mx-1`}>
                                Present
                            </div>
                            <div
                                onClick={toggleAttendance(student._id, 2)}
                                className={`btn ${status[student._id] === 2 ? 'btn-danger' : 'btn-outline-danger'} mx-1`}>
                                Absent
                            </div>
                            <div
                                onClick={toggleAttendance(student._id, 3)}
                                className={`btn ${status[student._id] === 3 ? 'btn-dark' : 'btn-outline-dark'} mx-1`}>
                                Tardy
                            </div>
                            <div
                                onClick={toggleAttendance(student._id, 4)}
                                className={`btn ${status[student._id] === 4 ? 'btn-dark' : 'btn-outline-dark'} mx-1`}>
                                Left Early
                            </div>
                        </div>
                    )
                }
            }
        ]
    }

    const [search, setSearch] = useState('')

    const filterFunc = data => {
        if (search) {
            if (!`${data.first_name} ${data?.last_name}`.toLowerCase().includes(search.toLowerCase())) {
                return false
            }
        }
        if (filter) {
            filter?.includes(data._id)
        }
        return true
    }

    const router = useRouter()

    return (
        <>
            <div className="flex justify-between">
                <h4 className="page-title">
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/>
                    Attendance</h4>
                <div className="flex items-center">
                    <div className="w-56 mr-4 relative">
                        <FiSearch className="absolute top-2.5 left-2 text-gray-500"/>
                        <input className="form-control" value={search} onChange={e => setSearch(e.target.value)}
                               style={{paddingLeft: 30, paddingRight: 30}} placeholder="Search"/>
                        {!!search && <FiDelete className="absolute right-2 top-3 text-gray-500" role="button"
                                               onClick={() => setSearch('')}/>}
                    </div>
                    <Select
                        allowClear
                        className="w-44 mr-4"
                        placeholder="Class"
                        onClear={() => setCurrent(undefined)}
                        onChange={setCurrent}
                        options={classes?.map(d => ({label: d.name, value: d._id}))}/>
                    {current && (
                        <DatePicker onChange={setDate}/>
                    )}
                </div>
            </div>
            <Table
                columns={columns}
                data={students?.filter(filterFunc)?.sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase()))}
                noAction
            />
            {date && (
                <div className="text-right my-2">
                    <button className="btn-primary rounded ml-auto" onClick={updateStatus}>Save</button>
                </div>
            )}
        </>
    )
}
Attendance.layout = AdminLayout
export default Attendance
import TeacherLayout from "../../../layouts/teacher";
import Link from 'next/link'
import { checkPermission, useAction, useActionConfirm, useFetch } from "../../../helpers/hooks";
import { fetchClasses, fetchTraits, postAttendance, postAwards } from "../../../helpers/backend_helper";
import moment from "moment";
import { useRouter } from "next/router";
import { FiArrowLeft, FiCalendar, FiChevronDown, FiChevronUp, FiClipboard, FiGift } from "react-icons/fi";
import SearchInput from "../../../components/form/search";
import { useState } from "react";
import { Form, Modal } from "antd";
import FormSelect from "../../../components/form/FormSelect";
import FormInput from "../../../components/form/FormInput";
import Button from "../../../components/form/Button";

const Classes = () => {
    const router = useRouter()
    const [classes, getClasses] = useFetch(fetchClasses, { mine: true }, { date: moment().format('YYYY-MM-DD') })
    const [traits] = useFetch(fetchTraits)
    const nameFormat = (_, data) => {
        return (
            <>
                <p role="button" className="text-lg font-semibold mb-0">{data?.name}</p>
                <p>{data?.section}</p>
            </>
        )
    }

    const timeFormat = (_, data) => {
        return (
            <>
                <p className="text-lg mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                <p className="text-lg mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                    {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                </p>
            </>
        )
    }

    const columns = [
        {
            label: "All Classes",
            dataIndex: 'name',
            formatter: nameFormat,
            className: "hover:bg-gray-100 cursor-pointer",
            onClick: data => router.push('/teacher/classes/' + data._id)
        },
        {
            label: "Time",
            dataIndex: 'name',
            formatter: timeFormat,
            className: 'text-center',
            shadow: true,
            maxWidth: 200,
        },
        {
            label: "Instructors",
            dataIndex: 'instructors',
            formatter: data => data?.sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase())).map((instructor, index) => `${index > 0 ? ', ' : ''}${instructor?.first_name} ${instructor?.last_name}`),
            className: 'text-center',
            maxWidth: 200,
        }
    ]

    const add = checkPermission('class_create')
    const [search, setSearch] = useState('')
    return (
        <>
            <div className="flex justify-between">
                <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()} /> Classes
                </h4>
                <div className="flex">
                    {(classes?.length > 0) && (<SearchInput value={search} setValue={setSearch} />)}

                    {/* {add && (
                        <Link href="/teacher/classes/create">
                            <Button>Add Class</Button>
                        </Link>
                    )} */}
                </div>
            </div>
            <div className="pr-2">
                <div>
                    {classes?.length === 0 &&
                        (<>
                            <div class="h-24 mt-32 mx-auto border-2 rounded-md w-60 bg-white relative z-10">
                                <div class="flex flex-row items-center justify-center h-full space-x-5">
                                    <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
                                    <div class="flex flex-col space-y-3">
                                        <div class="h-6 bg-gray-300 rounded-md w-36"></div>
                                        <div class="w-24 h-6 bg-gray-300 rounded-md"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="h-20 mx-auto border-2 rounded-md w-48 bg-white relative bottom-6 z-0">
                                <div class="flex flex-row items-center justify-center h-full space-x-3">
                                    <div class="w-9 h-9 bg-gray-200 rounded-full"></div>
                                    <div class="flex flex-col space-y-3">
                                        <div class="h-6 bg-gray-200 rounded-md w-32"></div>
                                        <div class="w-16 h-6 bg-gray-200 rounded-md"></div>
                                    </div>
                                </div>
                            </div>

                            <p class="text-center text-2xl font-semibold pl-2 md:pl-8 mt-4 text-gray-400">
                                No Classes Found!
                            </p>

                            {add && (
                                <Link href="/teacher/classes/create">
                                    <button
                                        type="button"
                                        class="px-3 py-2 mx-auto bg-blue-600 rounded-md text-white outline-none focus:ring-4 transform active:scale-x-75 transition-transform flex"
                                    >


                                        <span class="ml-2">Add Class</span>
                                    </button>

                                </Link>
                            )}
                        </>
                        )}
                </div>
                {classes?.filter(d => d.name.toLowerCase()?.includes(search.toLowerCase())).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))?.map((d, index) => (
                    <ClassCard data={d} key={index} traits={traits} getClasses={getClasses} />
                ))}
            </div>

        </>

    )
}

Classes.layout = TeacherLayout
export default Classes


const ClassCard = ({ data, traits, getClasses }) => {
    const [show, setShow] = useState(false)
    const [showAward, setShowAward] = useState(false)
    const [showPresent, setShowPresent] = useState(false)
    const [showAbsent, setShowAbsent] = useState(false)
    const [awardForm] = Form.useForm()
    const [presentForm] = Form.useForm()
    const [absentForm] = Form.useForm()

    const [absences, setAbsences] = useState([])
    const [tardies, setTardies] = useState([])
    const [lefts, setLefts] = useState([])

    return (
        <div className="bg-white rounded my-4">
            <div className="flex flex-col md:flex-row flex-wrap justify-between p-4 pb-0">
                <div className="!text-center md:!text-left">
                    <div className="flex">
                        <h5 className="font-semibold ">{data?.name}</h5>
                        <Link href={'/teacher/classes/' + data._id}>
                            <a className="ml-2 mt-1 text-blue-300 hover:underline" style={{ fontSize: '0.7rem' }}>See Details</a>
                        </Link>
                    </div>
                    <p className="mb-1 text-sm">{data?.section}</p>
                    <p className="mb-1">Instructors</p>
                    {data?.instructors?.map((d, index) => (
                        <p className="mb-1 text-sm" key={index}>{d?.first_name} {d?.last_name} ({d?.email})</p>
                    ))}
                </div>
                <hr className="my-2 md:hidden" />
                <div className="!text-center md:!text-right">
                    <p className="mb-0">{data?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                    <p className="mb-0">{moment(data?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                        {moment(data?.time?.end, 'HH:mm').format('hh:mm a')}
                    </p>
                    <div className="bg-gray-600 inline-block px-2 py-1 rounded-full text-sm text-white my-1">
                        Students Enrolled <span
                            className="bg-white text-gray-700 rounded-full px-1 font-semibold">{data?.students?.length}</span>
                    </div>
                </div>
            </div>
            <div className="text-end px-4 pt-0 pb-3">
                <a className="py-1.5 text-decoration-none" onClick={() => setShow(!show)}>
                    View Attendance
                    {show ? <FiChevronDown className="inline-block ml-1" /> :
                        <FiChevronUp className="inline-block ml-1" />}
                </a>
            </div>
            {show && (
                <>
                    <div className="bg-gray-50 rounded-b border border-gray-400">
                        <div className="flex justify-between flex-wrap !px-2 md:!px-4 py-2.5 border-t border-gray-400">
                            <div className="flex items-center ">
                                <FiCalendar size={20} className="mr-2 mb-2 md:mb-0" />
                                <span>Attendance</span>
                            </div>
                            <div className="flex flex-wrap items-center">
                                <div
                                    className="flex border-2 border-green-600 bg-green-600 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Present</so>
                                    <div
                                        className="text-green-600 bg-white px-2">{data?.attendances?.find(d => d._id === 1)?.total || 0}</div>
                                </div>
                                <div
                                    className="flex border-2 border-red-500 bg-red-500 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Absent</so>
                                    <div
                                        className="text-red-500 bg-white px-2">{data?.attendances?.find(d => d._id === 2)?.total || 0}</div>
                                </div>
                                <div
                                    className="flex border-2 border-gray-500 bg-gray-500 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Tardy</so>
                                    <div
                                        className="text-gray-500 bg-white px-2">{data?.attendances?.find(d => d._id === 3)?.total || 0}</div>
                                </div>
                                <div
                                    className="flex border-2 border-gray-500 bg-gray-500 rounded overflow-hidden mr-3 mb-2 md:mb-0">
                                    <so className="text-white px-2">Early Dismissal</so>
                                    <div
                                        className="text-gray-500 bg-white px-2">{data?.attendances?.find(d => d._id === 4)?.total || 0}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
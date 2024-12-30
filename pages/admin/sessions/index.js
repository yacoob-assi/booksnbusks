import AdminLayout from "../../../layouts/admin";
import {useRouter} from "next/router";
import {useFetch, userOutSideClick} from "../../../helpers/hooks";
import {delProduct, fetchDashboard, fetchUserSessions, getSchools} from "../../../helpers/backend_helper";
import moment from "moment/moment";
import {Select} from "antd";
import {FaGift, FaShoppingBag, FaUsers} from "react-icons/fa";
import {DateRange} from "react-date-range";
import {useEffect, useRef, useState} from "react";
import Table from "../../../components/common/table";

const Sessions = () => {
    const router = useRouter()
    const [schools] = useFetch(getSchools)
    const [data, getData, {loading}] = useFetch(fetchUserSessions, {}, false)
    const [school, setSchool] = useState()
    const [date, setDate] = useState(
        {
            startDate: moment().startOf('month').toDate(),
            endDate: moment().endOf('month').toDate(),
            key: 'selection'
        }
    )

    useEffect(() => {
        getData({
            school,
            start: moment(date?.startDate).startOf('day').toDate(),
            end: moment(date?.endDate)?.endOf('day').toDate()
        })
    }, [school, date])

    let toHHMMSS = (secs) => {
        let sec_num = parseInt(secs, 10)
        let hours   = Math.floor(sec_num / 3600)
        let minutes = Math.floor(sec_num / 60) % 60
        let seconds = sec_num % 60
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .join(":")
    }

    const getDuration = data => {
        return toHHMMSS(moment.duration(moment(data.endTime).diff(moment(data.createdAt)))._milliseconds / 1000)
    }

    console.log(data)
    const [show, setShow] = useState(false)
    const ref = useRef()
    userOutSideClick(ref, () => setShow(false))

    return (
        <>
            <div className="flex justify-between mb-2">
                <h5>Sessions</h5>
                <div className="flex items-center">
                    <div className="relative mr-2" ref={ref}>
                        <input className="form-control bg-white" value={`${moment(date?.startDate).format('DD-MM-YYYY')} - ${moment(date?.endDate).format('DD-MM-YYYY')}`} onClick={() => setShow(!show)} readOnly/>
                        <div className={`absolute right-0 bg-white shadow w-96 ${show ? '' : 'hidden'}`}>
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDate(item.selection)}
                                moveRangeOnFirstSelection={false}
                                ranges={[date]}
                            />
                        </div>
                    </div>

                    <Select
                        allowClear
                        className="w-44 mr-4"
                        placeholder="School"
                        onClear={() => setSchool(undefined)}
                        onChange={setSchool}
                        options={schools?.map(d => ({label: d.name, value: d._id}))}/>
                </div>
            </div>
            <Table
                data={data}
                getData={getData}
                columns={[
                    {label: 'Name', dataIndex: 'name',},
                    {label: 'School', dataIndex: 'school',},
                    {
                        label: 'Session Start',
                        dataIndex: 'createdAt',
                        formatter: d => moment(d).format('MM/DD/YYYY HH:mm:ss')
                    },
                    {
                        label: 'Session End',
                        dataIndex: 'endTime',
                        formatter: d => moment(d).format('MM/DD/YYYY HH:mm:ss')
                    },
                    {
                        label: 'Duration',
                        dataIndex: 'endTime',
                        formatter: (_, dd) => getDuration(dd)
                    },
                ]}
                loading={loading}
                pagination
                noAction
            />
        </>
    )
}

Sessions.layout = AdminLayout
export default Sessions
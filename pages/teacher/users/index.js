import TeacherLayout from "../../../layouts/teacher";
import {useRouter} from "next/router";
import {useFetch} from "../../../helpers/hooks";
import {deleteUser, fetchTeachers} from "../../../helpers/backend_helper";
import Link from "next/link";
import Table from "../../../components/common/table";
import {FiArrowLeft} from "react-icons/fi";
import {useState} from "react";
import SearchInput from "../../../components/form/search";
import moment from "moment";
import Button from "../../../components/form/Button";

const Users = () => {
    const router = useRouter()
    const [teachers, getTeachers] = useFetch(fetchTeachers)
    const columns = [
        {
            label: "Name",
            dataIndex: 'name',
            formatter: (_, {first_name, last_name}) => `${first_name || ''} ${last_name || ''}`
        },
        {
            label: "Email",
            dataIndex: 'email',
            formatter: d => <a href={`mailto:${d}`}>{d}</a>
        },
        {
            label: "Role",
            dataIndex: 'permission',
            formatter: d => d?.name
        },
        {
            label: "Last Login",
            dataIndex: 'last_login',
            formatter: d => !!d ? (
                <>
                    <span className="date-tag day mb-1">
                        {moment(d).format("ddd, MMM Do")}
                    </span>
                    at 
                    <span className="date-tag time ml-2 mb-1">
                        {moment(d).format("hh:mm A")}
                    </span>
                </>
            ) : '-'
        }
    ]
    const [search, setSearch] = useState('')

    return (
        <>
            <div className="flex justify-between">
                <h4>
                    <FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/> Users
                </h4>
                <div className="flex">
                    <SearchInput value={search} setValue={setSearch}/>
                    <Link href="/teacher/users/create">
                        <Button>Add User</Button>
                    </Link>
                </div>
            </div>
            <Table
                data={teachers?.filter(d => `${d?.first_name} ${d?.last_name}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase()))}
                columns={columns}
                onEdit={({_id}) => (
                    router.push('/teacher/users/' + _id)
                )}
                onDelete={deleteUser}
                getData={getTeachers}
            />
        </>
    )
}
Users.layout = TeacherLayout
export default Users
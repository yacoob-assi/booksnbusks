import {useFetch} from "../../helpers/hooks";
import {fetchClasses, fetchTeachers} from "../../helpers/backend_helper";
import {useRouter} from "next/router";
import {Table} from "react-bootstrap";
import {FiArrowLeft} from "react-icons/fi";
import {useState} from "react";
import SearchInput from "../../components/form/search";
import AdminLayout from "../../layouts/admin";

const Roster = () => {
    const router = useRouter()
    const [teachers] = useFetch(fetchTeachers)
    const [classes] = useFetch(fetchClasses)
    const [search, setSearch] = useState('')
    let map = {}
    teachers?.sort((a, b) => a?.last_name?.toLowerCase()?.localeCompare(b?.last_name?.toLowerCase())).forEach(teacher => {
        map[teacher._id] = teacher
    })
    classes?.map(data => {
        data.instructors?.map(teacher => {
            let list = map[teacher?._id]?.classes || {}
            list[data._id] = data
            map[teacher?._id] = {
                ...map[teacher?._id],
                classes: list
            }
        })
    })
    let list = []
    Object.values(map).forEach(teacher => {
        if (`${teacher?.first_name} ${teacher?.last_name}`.toLowerCase().includes(search.toLowerCase())) {
            if (teacher?.classes) {
                Object.values(teacher?.classes).forEach((data, index) => {
                    list.push({
                        name: index === 0 ? `${teacher?.first_name} ${teacher?.last_name}` : '',
                        classes: Object.values(teacher?.classes)?.length,
                        class: {
                            _id: data?._id,
                            name: data?.name,
                            students: data?.students?.length
                        }
                    })
                })
            } else {
                list.push({
                    name: `${teacher?.first_name} ${teacher?.last_name}`,
                })
            }
        }
    })

    return (
        <>
            <div className="flex justify-between mb-3">
                <h4 className="page-title"><FiArrowLeft className="mr-2 inline-block" role="button"
                                                        onClick={() => router.back()}/> Faculty Roster</h4>
                <SearchInput value={search} setValue={setSearch}/>
            </div>
            <Table>
                <thead>
                <tr>
                    <th>Teacher</th>
                    <th className="text-center">Class</th>
                    <th className="text-center">Student Enrolled</th>
                </tr>
                </thead>
                <tbody>
                {list?.map((data, index) => (
                    <tr key={index}>
                        {data?.name && <td className="font-semibold border-r border-gray-200"
                                           rowSpan={data?.classes}>{data?.name}</td>}
                        <td className="text-center" onClick={() => {
                            if (data.class?._id) {
                                router.push('/teacher/classes/' + data.class?._id)
                            }
                        }}
                            role={data?.class?.name ? "button" : undefined}> {data?.class?.name || 'N/A'}</td>
                        <td className="text-center"> {data?.class?.students || ''}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    )
}

Roster.layout = AdminLayout
export default Roster
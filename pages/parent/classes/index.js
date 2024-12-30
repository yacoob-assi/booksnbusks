import ParentLayout from "../../../layouts/parent";
import {useFetch} from "../../../helpers/hooks";
import {fetchClasses} from "../../../helpers/backend_helper";
import {useUserContext} from "../../../contexts/user";
import {Table} from "react-bootstrap";
import moment from "moment/moment";

const Classes = () => {
    const {student} = useUserContext()
    const [classes] = useFetch(fetchClasses, {student: student?._id, info: true});


    return (
        <div className="bg-white">
            <Table>
                <thead>
                <tr>
                    <th>Class</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Teachers</th>
                </tr>
                </thead>
                <tbody>
                {classes?.map((c, index) => (
                    <tr key={index}>
                        <td>{c.name}</td>
                        <td className="text-center" style={{maxWidth: 300}}>
                            <p className="mb-0">{c?.days?.map((day, index) => `${index > 0 ? ', ' : ''}${day}`)}</p>
                            <p className="mb-0">{moment(c?.time?.start, 'HH:mm').format('hh:mm a')} -&nbsp;
                                {moment(c?.time?.end, 'HH:mm').format('hh:mm a')}
                            </p>

                        </td>
                        <td className="" style={{maxWidth: 300}}>
                            {c?.instructors?.map((d, index) => (
                                <p className="mb-1 text-sm" key={index}>{d?.first_name} {d?.last_name} ({<a href={'mailto:' + d?.email}>{d?.email}</a>})</p>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}
Classes.layout = ParentLayout
export default Classes
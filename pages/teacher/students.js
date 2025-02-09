import {checkPermission, useAction, useActionConfirm, useFetch} from "../../helpers/hooks";
import {
    deleteStudent,
    fetchAwards,
    fetchStudents,
    fetchTraits,
    postAward,
    updateStudent
} from "../../helpers/backend_helper";
import {Table} from "react-bootstrap";
import TeacherLayout from "../../layouts/teacher";
import {Form, Modal} from "antd";
import React, {useEffect, useState} from "react";
import FormSelect from "../../components/form/FormSelect";
import FormInput from "../../components/form/FormInput";
import {FiArrowLeft, FiEdit, FiGift, FiTrash} from "react-icons/fi";
import {useRouter} from "next/router";
import SearchInput from "../../components/form/search";
import {FaHistory} from "react-icons/fa";
import moment from "moment/moment";
import Pagination from "../../components/common/pagination";

const Students = () => {
    const [form] = Form.useForm()
    const [form2] = Form.useForm()
    const [search, setSearch] = useState('')
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [student, setStudent] = useState()
    const [students, getStudents] = useFetch(fetchStudents)
    const router = useRouter()
    const award_student = checkPermission('roster_award_student')
    const delete_student = checkPermission('roster_delete_student')
    const edit_student = checkPermission('roster_edit_student', true)

    const [traits] = useFetch(fetchTraits)

    const [history, getHistory] = useFetch(fetchAwards, {size: 5}, false)
    useEffect(() => {
        if (!!student) {
            getHistory({_id: student?._id})
        }
    }, [student])


    return (
        <>
            <div className="flex justify-between mb-3">
                <h4 className="page-title"><FiArrowLeft className="mr-2 inline-block" role="button"
                                                        onClick={() => router.back()}/> Student Roster</h4>
                <SearchInput value={search} setValue={setSearch}/>
            </div>

            <Modal visible={visible} title="Award" footer={null} onCancel={() => setVisible(false)}>
                <Form layout="vertical" form={form} onFinish={values => {
                    return useAction(postAward, {...values}, () => {
                        setVisible(false)
                        getStudents()
                    })
                }}>
                    <Form.Item name="student" initialValue="" hidden><input/></Form.Item>
                    <FormSelect
                        name="trait"
                        label="Virtue"
                        onSelect={value => form.setFieldsValue({amount: traits?.find(trait => trait._id === value)?.points || 0})}
                        options={traits?.map(trait => ({label: trait.name, value: trait._id}))} required/>
                    <FormInput name="amount" label="Amount" required readOnly/>
                    <button className="btn-primary mt-2">Submit</button>
                </Form>
            </Modal>

            <Modal visible={visible2} title="Edit Student" footer={null} onCancel={() => setVisible2(false)}>
                <Form layout="vertical" form={form2} onFinish={values => {
                    return useAction(updateStudent, {...values}, () => {
                        setVisible2(false)
                        getStudents()
                    })
                }}>
                    <Form.Item name="_id" initialValue="" hidden><input/></Form.Item>
                    <FormInput name="first_name" label="First Name" required/>
                    <FormInput name="last_name" label="Last Name" required/>
                    <FormInput name="points" label="Points" type="number" required/>
                    <button className="btn-primary mt-2">Submit</button>
                </Form>
            </Modal>

            <Modal visible={!!student} onCancel={() => setStudent(undefined)} title="Award History" style={{top: 30}}
                   width={800}
                   footer={null}>
                <ul className="px-4">

                    {history?.docs?.map((award, index) => (
                        <li className="flex justify-between mb-4" key={index}>
                            <span className="text-primary oswald text-6xl">+{award?.points}</span>
                            <div>
                                <p className="text-end text-lg font-bold mb-2">{award?.class?.name}&nbsp; {moment(award?.createdAt).format('MM/DD/YYYY')}</p>
                                <p className="text-end text-base font-medium mb-2">By: {award?.award_by?.first_name} {award?.award_by?.last_name}</p>
                                <p className="text-end text-sm font-medium">{award?.trait?.name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="text-center">
                    <Pagination page={history?.page || 1} pageCount={history?.totalPages || 1}
                                onPageChange={page => getHistory({page})}/>
                </div>

            </Modal>

            <Table>
                <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Current Balance</th>
                    <th>Guardian's Email</th>
                    {(delete_student || award_student) && <th>Action</th>}
                </tr>
                </thead>
                <tbody>
                {students?.filter(d => `${d?.first_name} ${d?.last_name}`.toLowerCase().includes(search.toLowerCase()))
                .sort((a, b) =>{
                    const lastNameA = a.last_name.toUpperCase();
                    const lastNameB = b.last_name.toUpperCase();
                    if (lastNameA < lastNameB) return -1;
                    if (lastNameA > lastNameB) return 1;
                
                    const firstNameA = a.first_name.toUpperCase();
                    const firstNameB = b.first_name.toUpperCase();
                    return firstNameA.localeCompare(firstNameB);
                })                
                .map((data, index) => (
                    <tr key={index}>
                        <td><a onClick={() => {
                            if (award_student) {
                                form.resetFields()
                                form.setFieldsValue({student: data._id})
                                setVisible(true)
                            }
                        }}>{data?.first_name} {data?.last_name}</a></td>
                        <td>{data?.points}</td>
                        <td><a href={`mailto:${data?.guardian_email}`}>{data?.guardian_email}</a></td>
                        {(delete_student || award_student) && (
                            <td>
                                {award_student && (
                                    <FaHistory
                                        size={20}
                                        className="text-blue-500 inline-block mr-2"
                                        role="button"
                                        onClick={() => {
                                            setStudent(data)
                                        }}/>
                                )}
                                {award_student && (
                                    <FiGift
                                        size={22}
                                        className="text-success inline-block mr-2"
                                        role="button"
                                        onClick={() => {
                                            form.resetFields()
                                            form.setFieldsValue({
                                                student: data._id
                                            })
                                            setVisible(true)
                                        }}/>
                                )}
                                {edit_student && (
                                    <FiEdit
                                        size={22}
                                        className="text-success inline-block mr-2"
                                        role="button"
                                        onClick={() => {
                                            form2.resetFields()
                                            form2.setFieldsValue(data)
                                            setVisible2(true)
                                        }}/>
                                )}
                                {delete_student && (
                                    <FiTrash
                                        size={22}
                                        className="text-danger inline-block"
                                        role="button"
                                        onClick={() => {
                                            return useActionConfirm(deleteStudent, {_id: data._id}, () => {
                                                getStudents()
                                            }, `Are you sure you want to delete ${data?.first_name || ''} ${data?.last_name || ''}? This action can not be undone`, 'Yes, Delete')
                                        }}/>
                                )}

                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </Table>

        </>
    )
}
Students.layout = TeacherLayout
export default Students
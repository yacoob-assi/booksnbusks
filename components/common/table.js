import {FiEdit, FiTrash} from "react-icons/fi";
import {useActionConfirm} from "../../helpers/hooks";
import Pagination from "./pagination";
import {Loading} from "./preloader";
import {useUserContext} from "../../contexts/user";

const Table = ({columns, data, onEdit, onDelete, action, getData, pagination = false, noAction = false, loading = false, permission, admin = false, actionLabel= ''}) => {
    console.log("data", data)
    const {permission: rolePermission , role, admin: isAdmin} = useUserContext()
    const  checkPermission = name => {
        if(permission && name) {
            if( role === 'admin' || rolePermission?.permissions?.includes(name)) {
                return true
            }
            return admin && isAdmin === true;
        }
        return true
    }

    return (
        <div className="bg-white p-3 border shadow-md">
            {!!loading ? (
                <div className="flex justify-center items-center h-96">
                    <Loading/>
                </div>
            ) : (
                <div className="">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {columns?.map((column, index) => (
                                <th key={index} className="px-6 py-3">{column.label}</th>
                            ))}
                            {noAction || <th className="text-center">{actionLabel}</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {(pagination ? data?.docs : data)?.map((data, index) => (
                            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>
                                {columns?.map((column, index) => {
                                    if (column.formatter) {
                                        return <td key={index} className="px-6 py-3"
                                                   onClick={() => {
                                                       if(column.onClick) {
                                                           column.onClick(data)
                                                       }
                                                   }}>{column.formatter(data[column.dataIndex], data)}</td>
                                    }
                                    if (column.type === 'image') {
                                        return <td key={index} className={column.className}
                                                   onClick={() => {
                                                       if(column.onClick) {
                                                           column.onClick(data)
                                                       }
                                                   }}
                                                   style={{
                                                       background: column?.shadow ? '#F8F8F8' : undefined,
                                                       maxWidth: column?.maxWidth
                                                   }}><img
                                            style={{height: 36}} src={data[column.dataIndex]} alt=""/></td>
                                    }
                                    return <td className="px-6 py-3"
                                               onClick={() => {
                                                   if(column.onClick) {
                                                       column.onClick(data)
                                                   }
                                               }}
                                               key={index}>{data[column.dataIndex]}</td>
                                })}
                                {noAction || (
                                    <td >
                                        <div className="flex justify-end pr-2">
                                            {onEdit && checkPermission(permission + '_edit') && (
                                                <a className="btn-primary p-1.5 rounded ml-2" onClick={() => onEdit(data)}>
                                                    <FiEdit size={18} role="button" />
                                                </a>
                                            )}
                                            {onDelete && checkPermission(permission + '_delete') && (
                                                <a className="btn-primary p-1.5 rounded ml-2 mr-2" onClick={() => {
                                                    useActionConfirm(onDelete, {_id: data._id}, getData, 'Are you sure want to delete this?', 'Yes, delete')
                                                }}>
                                                    <FiTrash size={20} role="button" />
                                                </a>
                                            )}
                                        </div>
                                    </td>

                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {pagination && (
                        <div className="text-center pt-3">
                            <Pagination pageCount={data?.totalPages || 1} page={data?.page || 1}
                                        onPageChange={page => getData({page})}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default Table
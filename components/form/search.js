import {FiDelete, FiSearch} from "react-icons/fi";

const SearchInput = ({value, setValue}) => {
    return (
        <div className="w-56 mr-4 relative">
            <FiSearch className="absolute top-2.5 left-2 text-gray-500"/>
            <input className="form-control" value={value} onChange={e => !!setValue &&  setValue(e.target.value)}
                   style={{paddingLeft: 30, paddingRight: 30}} placeholder="Search"/>
            {!!value && <FiDelete className="absolute right-2 top-3 text-gray-500" role="button"
                                   onClick={() => !!setValue && setValue('')}/>}
        </div>
    )
}
export default SearchInput
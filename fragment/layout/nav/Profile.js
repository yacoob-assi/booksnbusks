import { FaUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const ProfileNav = ({user}) => {
    return (
        <div className="flex items-center gap-4 text-center justify-center">
            <span className="text-right">
                <span className="block text-sm font-medium text-black dark:text-white">
                {user?.first_name || ''} {user?.last_name || ''}
                </span>
                <span className="block text-xs">{user?.email || ''}</span>
            </span>
            <span className="h-12 w-12 rounded-full bg-slate-300 items-center justify-center flex">
                <FaUser size={24}/>
            </span>
    
        </div>

    );
}

export default ProfileNav;
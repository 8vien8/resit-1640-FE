import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ROLE_IDS = {
    Admin: "64f000000000000000000011",
    UMM: "64f000000000000000000012",
    FMC: "64f000000000000000000013",
    Student: "64f000000000000000000014",
    Guest: "64f000000000000000000015"
};

const RoleBasedRedirect = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            switch (user.roleID) {
                case ROLE_IDS.Admin:
                    navigate('/admin');
                    break;
                case ROLE_IDS.FMC:
                    navigate('/fmc');
                    break;
                case ROLE_IDS.Student:
                    navigate('/student');
                    break;
                case ROLE_IDS.UMM:
                    navigate('/umm');
                    break;
                case ROLE_IDS.Guest:
                    navigate('/guest');
                    break;
                default:
                    navigate('/unauthorized');
            }
        }
    }, [user, navigate]);

    return null;
};

export default RoleBasedRedirect;

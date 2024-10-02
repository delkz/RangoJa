
import { setCookie } from 'cookies-next';
import validateToken from '../services/validadeToken';
import { redirect } from 'next/navigation'

const ProtectedRoute = async ({
    children,
}: {
    children: React.ReactNode
}) => {
    const isUserValid = await validateToken();
    if (isUserValid.isValid) {
        setCookie("userData", JSON.stringify(isUserValid.userData));
        return <div>{children}</div>;
    } else {
        redirect('/user/login')
    }
};

export default ProtectedRoute;

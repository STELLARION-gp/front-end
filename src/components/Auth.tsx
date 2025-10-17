import '../styles/components/_auth.scss';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="auth-container">
            <Button
                variant='primary'
                className="auth-button"
                onClick={handleSignupClick}
                white={false}
                size="medium"
            >
                SignUp
            </Button>
        </div>
    );
};

export default Auth;

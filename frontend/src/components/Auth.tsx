import React, { useState } from 'react';
import '../styles/components/_auth.scss';
import Button from './Button';

const Auth = () => {
    // Fake user state to simulate login/logout
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        // Simulate a logged-in user
        setUser({
            name: 'Nimna',
            profileImage: 'https://i.pravatar.cc/150?img=3', // Placeholder avatar
        });
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="auth-container">
            {!user ? (
                <Button variant='primary' className="auth-button" onClick={handleLogin} white={false}>
                    SignUp
                </Button>
            ) : (
                <div className="profile-wrapper" onClick={handleLogout}>
                    <img src={user.profileImage} alt="Profile" />
                </div>
            )}
        </div>
    );
};

export default Auth;

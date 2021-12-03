import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from "@material-ui/core";

export const NavigationLayout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <>
            <Button onClick={() => navigate("/")}>go back</Button>
            <div>
                {children}
            </div>
        </>
    );
};
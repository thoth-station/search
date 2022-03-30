import React from "react";

interface IErrorPage {
    message: string;
    type: string | number;
    reason: string;
}

export const ErrorPage = ({ message, type, reason }: IErrorPage) => {
    return (
        <div>
            <p>
                {type}
                {": "}
                {message}
            </p>
            <p>{reason}</p>
        </div>
    );
};

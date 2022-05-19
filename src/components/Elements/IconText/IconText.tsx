import React from "react";

// material-ui
import { Link, Stack, BoxProps, Typography } from "@mui/material";

interface IIconText extends BoxProps {
    /** The text shown */
    text: string;
    /** The icon component to be displayed */
    icon: React.ReactNode;
    /** Optional link if text is selected */
    link?: string;
}

/**
 * Text with an icon to the right of it.
 */
const IconText = ({ text, icon, link, ...props }: IIconText) => {
    return (
        <Stack {...props} direction="row" spacing={1} alignItems="center">
            {icon}
            {link
                ? (
                    <Link
                        underline="none"
                        href={link ? link : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        align="center"
                    >
                        {text}
                    </Link>
                )
                : (
                    <Typography variant="body2" align="center">{text}</Typography>
                )
            }
        </Stack>
    );
};

export default IconText;

IconText.propTypes = {};

import React from "react";

interface IProps extends React.ComponentPropsWithoutRef<"div"> {
    children: React.ReactNode;
    /** The unique identifier of the tab. */
    index: string | number;
    /** The state variable passed in from the parent which is compared to the index */
    value: string | number;
}

/**
 * A tab panel used to encapsulate different tab content.
 */
const TabPanel = ({ children, value, index, ...props }: IProps) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...props}
        >
            {value === index && children}
        </div>
    );
};

export default TabPanel;

import React, { CSSProperties} from "react";

import { RadialChart } from "react-vis";
import Loading from "components/Elements/Loading/Loading";
import { Stack } from "@mui/material";

interface IPieChart {
	source?: Array<{
		angle?: number | undefined;
		label?: string | undefined;
		radius?: number | undefined;
		style?: CSSProperties | undefined;
	}>
	setHovered: (val: {label: string} | undefined) => void
	hovered: {label: string} | undefined
}

export const PieChart = ({ source, setHovered, hovered }: IPieChart) => {
	if(!source) {
		return (
			<Loading type="circular"/>
		)
	}

	return (
		<Stack alignItems="center" justifyContent="center">
			<RadialChart
				height={150}
				width={150}
				data={source.map(row => {
					if (hovered && hovered?.label === row?.label) {
						return {...row, style: {stroke: 'black', strokeWidth: '5px'}};
					}
					return row;
				})}
				onValueMouseOver={row => setHovered(row as {label: string})}
				onSeriesMouseOut={() => setHovered(undefined)}
			/>
		</Stack>

	);
};

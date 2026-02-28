import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

export const useZoneProgress = (
    rowsCleared: number,
    bZoneActivated: boolean
) => {

    const [iZoneRows, setZoneRows] = useState(0);
    const [iHeight, setHeight] = useState(0);

    useEffect(() => {
        if (rowsCleared <= 0 || !bZoneActivated) return;

        setZoneRows((prev) => prev + rowsCleared);
        setHeight((prev) => prev + rowsCleared * 41);
    }, [rowsCleared, bZoneActivated]);

    return [
        iZoneRows,
        setZoneRows as Dispatch<SetStateAction<number>>,
        iHeight,
        setHeight as Dispatch<SetStateAction<number>>,
    ] as const;

};
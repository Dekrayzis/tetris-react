import { useState, useEffect, useCallback } from 'react';

export const useZoneProgress = (rowsCleared, bZoneActivated) => {

    const [iZoneRows, setZoneRows] = useState(0);
    const [iHeight, setHeight] = useState(0);

    const calcZoneRows = useCallback(() => {

        if (rowsCleared > 0 && bZoneActivated) {

            setZoneRows(iZoneRows + rowsCleared);
            setHeight(iHeight + rowsCleared*41);
            console.log(iHeight)
        }

    }, [rowsCleared, iZoneRows, setZoneRows, iHeight, setHeight, bZoneActivated]);


    useEffect(() => { calcZoneRows(); }, [calcZoneRows, rowsCleared, bZoneActivated]);

    return [iZoneRows, setZoneRows, iHeight, setHeight];

};
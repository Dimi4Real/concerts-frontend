import { useCallback, useState } from "react";
import { get } from "@/core/httpClient";

const useListData = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const getData = useCallback(async (url) => {
        setLoading(true);
        try {
            let result = await get(url);
            setData(result.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { getData, loading, data };
};

export default useListData;
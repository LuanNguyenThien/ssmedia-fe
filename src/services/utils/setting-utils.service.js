import { createSearchParams } from "react-router-dom";

export class SettingUtils {
    static navigateToSetting(data, navigate) {
        const url = `/app/social/setting/${data?.username}?${createSearchParams(
            { id: data?._id, uId: data?.uId }
        )}`;
        navigate(url);
    }
}

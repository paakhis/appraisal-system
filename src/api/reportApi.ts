import api from "./axios";

export const downloadEmployeesReport = async (defaultFileName = "employees-report.xlsx") => {
    const response = await api.get(
        "/api/reports/employees",
        {
            responseType: "blob"
        }
    );

    const blob = response.data as Blob;
    const disposition = response.headers?.["content-disposition"] as string | undefined;
    const match = disposition?.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
    const fileName = match?.[1] ? decodeURIComponent(match[1]) : defaultFileName;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
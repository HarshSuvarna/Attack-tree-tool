import axios from "axios";

export const getSignedUrl = (nodeId: string, fileName: string) => {
  return axios.get(
    `/storage/get-signed-url?filename=${fileName}&nodeId=${nodeId}`
  );
};

export const getDownloadUrl = (nodeId: string, fileName: string) => {
  return axios.get(
    `/storage/get-download-url?filename=${fileName}&nodeId=${nodeId}`
  );
};

export const uploadToBucket = (presignedUrl: any, file: any) => {
  return axios.put(
    presignedUrl,
    {
      data: file,
    },
    {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    }
  );
};

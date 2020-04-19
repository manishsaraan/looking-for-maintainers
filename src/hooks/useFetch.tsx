import React, { useEffect } from "react";

type HeaderRef = {
  Accept: string;
  "Content-Type": string;
  "x-access-token": string;
};

function createHeaders(): HeaderRef {
  const user: any = localStorage.getItem("user");

  const { jwtToken }: { jwtToken: string } = JSON.parse(user);
  return {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "x-access-token": jwtToken,
  };
}

type fetchMethod = (
  url: string,
  method: string,
  body?: any
) => { loading: boolean; error: boolean; data: any };

type payloadType = {
  method: string;
  headers: HeaderRef;
  body?: any;
};

const useFetch: fetchMethod = (url, method, body) => {
  const [loading, updateLoading] = React.useState(true);
  const [error, updateError] = React.useState(false);
  const [data, updateData] = React.useState({});

  const updateState = (loading: boolean, error: boolean, data: any) => {
    updateLoading(loading);
    updateError(error);
    updateData(data);
  };

  React.useEffect(() => {
    async () => {
      let payload: payloadType = {
        method: "POST",
        headers: createHeaders(),
      };

      if (body) {
        payload = { ...payload, body: JSON.stringify(body) };
      }

      fetch(url)
        .then((data) => data.json())
        .then((fetchedResp) => {
          updateState(false, false, fetchedResp);
        })
        .catch((error) => {
          updateState(false, true, {});
        });
    };
  }, [url, method, body]);

  return {
    loading,
    data,
    error,
  };
};

export default useFetch;

"use client";
import React, { useContext, useEffect } from "react";
// import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
// import MapOne from "../Maps/MapOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";
import useAuthStore from "@/store/authStore";

const ECommerce: React.FC = () => {
  const { setLoading } = useContext(OverlayLoaderContext);
  const { getUsers, userList = [], suspendUser } = useAuthStore();
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />

      </div>
    </>
  );
};

export default ECommerce;

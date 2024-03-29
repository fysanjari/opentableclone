"use client";

import React, { useState } from "react";
import { partySize as partySizeList, times } from "../../../../data";
import DatePicker from "react-datepicker";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { convertToDisplayTime, Time } from "../../../../utils/convertToDisplayTime";

const ReservationCard = ({
  openTime,
  closeTime,
  slug
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) => {
  const { data, loading, error, fetchAvailabilities } = useAvailabilities()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState(2);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  }

  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day,
      partySize,
      time
    })
  }

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];
    let isWithinWindos = false;
    times.forEach(time => {
      if (!isWithinWindos && time.time === openTime) {
        timesWithinWindow.push(time);
        isWithinWindos = true;
      }
      else if (isWithinWindos && time.time !== closeTime) {
        timesWithinWindow.push(time);
      }
      else if (isWithinWindos && time.time === closeTime) {
        timesWithinWindow.push(time);
        isWithinWindos = false;
      }
    });
    return timesWithinWindow
  }

  return (
    <div className="w-full bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party Size</label>
        <select
          name=""
          className="py-3 border-b font-light "
          id=""
          value={partySize}
          onChange={(e) => setPartySize(parseInt(e.target.value))}>
          {partySizeList.map((size, index) => (
            <option key={index} value={size.value}>{size.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[40%]">
          <label htmlFor=""> Date </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM d"
            wrapperClassName="w-[20%]"
            className="py-3 border-b text-reg font-light w-28" />
        </div>
        <div className="flex flex-col w-[40%]">
          <label htmlFor=""> Time </label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}>
            {filterTimeByRestaurantOpenWindow().map((time, index) => (
              <option key={index} value={time.time} className="w-[45%]">{time.displayTime}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}>
          {loading ? <CircularProgress color="inherit" /> : ("Find a Time")}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time, index) => {
              return time.available
                ? (<Link
                  href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-white mb-3 rounded mr-3"
                  key={index}
                >
                  <p className="text-sm text-center font-bold">
                    {convertToDisplayTime(time.time as Time)}
                  </p>
                </Link>)
                : <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3" key={index}>{convertToDisplayTime(time.time as Time)}</p>
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReservationCard;
